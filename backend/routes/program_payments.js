const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const path = require("path");
const nodemailer = require("nodemailer");
const fs = require('fs');


// Setup multer to store uploaded files in "uploads/" folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // use existing folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `payment-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Accept image files only
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"), false);
    }
    cb(null, true);
  },
});


// verify-payment
router.post("/:id/verify-payment", upload.single("paymentImage"), async (req, res) => {
  const { userId, transactionId } = req.body;
  const programId = req.params.id;
   const paymentImage = req.file;

  if (!userId || !transactionId || !programId || !paymentImage) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const isValidFormat = /^[A-Z0-9]{12}$/.test(transactionId);
  if (!isValidFormat) {
    return res.status(400).json({ error: "Invalid transaction ID format" });
  }

  try {
    // Check if this user has already requested
    const [existingRequest] = await db.query(
      "SELECT * FROM program_payment_requests WHERE user_id = ? AND program_id = ?",
      [userId, programId]
    );

    if (existingRequest.length > 0) {
      return res.status(400).json({ error: "Already submitted. Awaiting admin approval." });
    }

    // Insert into payment request table
    await db.query(
      "INSERT INTO program_payment_requests (user_id, program_id, transaction_id, payment_image_path,status) VALUES (?, ?, ?, ?,'pending')",
      [userId, programId, transactionId, paymentImage.filename]
    );

    res.status(200).json({ message: "Request submitted. Awaiting admin approval." });

  } catch (err) {
    console.error("Error verifying payment:", err);
    res.status(500).json({ error: "Server error" });
  }
});


//admin-approval
router.post("/:id/accept-payment", async (req, res) => {
  const programId = req.params.id;
  const { userId } = req.body;

  if (!userId || !programId) {
    return res.status(400).json({ error: "Missing user or Program ID" });
  }

  try {
    // Get payment request
    const [[request]] = await db.query(
      "SELECT * FROM program_payment_requests WHERE user_id = ? AND program_id = ? AND status = 'pending'",
      [userId, programId]
    );

    if (!request) {
      return res.status(404).json({ error: "No pending request found" });
    }

    // Add user to program
    await db.query(
      "INSERT INTO program_attendees (user_id, program_id, transaction_id) VALUES (?, ?, ?)",
      [userId, programId, request.transaction_id]
    );

    // Update attendees count
    await db.query(
      `UPDATE programs SET attendees = (
        SELECT COUNT(*) FROM program_attendees WHERE program_id = ?
      ) WHERE id = ?`,
      [programId, programId]
    );

    // Update payment request status
    await db.query(
      "UPDATE program_payment_requests SET status = 'approved' WHERE user_id = ? AND program_id = ?",
      [userId, programId]
    );

    // Send confirmation email
    const [[user]] = await db.query("SELECT email FROM users WHERE id = ?", [userId]);
    const [[program]] = await db.query("SELECT title FROM programs WHERE id = ?", [programId]);
    if (user && program) {
      await sendConfirmationEmail(user.email, program.title);
    }

    res.json({ message: "Payment approved and user added to program" });
  } catch (err) {
    console.error("Admin accept error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


async function sendConfirmationEmail(toEmail, paymentTitle) {
  let transporter = nodemailer.createTransport({
    service: "gmail", // Use Gmail service
    auth: {
      user: "heckerbeluga197@gmail.com",
      pass: "mimtprtalkucuxbh", // Use your Gmail App Password here
    },
  });

  await transporter.sendMail({
    from: '"MMK Universe Team" <heckerbeluga197@gmail.com>',
    to: toEmail,
    subject: `Registration confirmed for ${paymentTitle}`,
    text: `Hello! Your registration for the program "${paymentTitle}" is confirmed. Thank you!`,
  });
}



// Get pending payment requests
router.get("/payment-requests", async (req, res) => {
  try{
  const [rows] = await db.query(`
 
SELECT 
        ppr.id,
        ppr.user_id,
        ppr.program_id,
        ppr.transaction_id,
        ppr.status,
        ppr.payment_image_path,
        pg.title AS program_title
      FROM program_payment_requests ppr
      JOIN programs pg ON ppr.program_id = pg.id

    WHERE ppr.status = 'pending'
    ORDER BY ppr.created_at DESC
  `);
  res.json(rows);
  }
  catch(err){
     console.error("Fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }


});





// Approve a payment request
router.post("/payment-requests/:id/approve", async (req, res) => {
  const { id } = req.params;
  try {
    const [[request]] = await db.query("SELECT * FROM program_payment_requests WHERE id = ?", [id]);
    if (!request) return res.status(404).json({ error: "Request not found" });





    const { user_id, program_id, transaction_id, payment_image_path  } = request;

    // Prevent duplicates
    const [existing] = await db.query("SELECT * FROM program_attendees WHERE user_id = ? AND program_id = ?", [user_id, program_id]);
    if (existing.length > 0) return res.status(400).json({ error: "User already enrolled" });




    // Approve
    await db.query(`
      INSERT INTO program_attendees (user_id, program_id, transaction_id)
      VALUES (?, ?, ?)
    `, [user_id, program_id, transaction_id]);



    await db.query(`
      UPDATE programs SET attendees = (
        SELECT COUNT(*) FROM program_attendees WHERE program_id = ?
      ) WHERE id = ?
    `, [program_id, program_id]);

    //update attendees count
    await db.query("UPDATE program_payment_requests SET status = 'approved' WHERE id = ?", [id]);


   // Send confirmation email
    const [[user]] = await db.query("SELECT email FROM users WHERE id = ?", [
      user_id,
    ]);
    const [[program]] = await db.query("SELECT title FROM programs WHERE id = ?", [
      program_id,
    ]);
    if (user && program) {
      await sendConfirmationEmail(user.email, program.title);
    }

    // Delete uploaded image
    if (payment_image_path) {
      const filePath = path.join(__dirname, "../uploads", payment_image_path);
      fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to delete image:", err);
      });
    }






    res.json({ message: "Payment approved and user added to Program" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});



// Reject a payment request
router.post("/payment-requests/:id/reject", async (req, res) => {
  const { id } = req.params;
  try {
    const [[request]] = await db.query("SELECT * FROM program_payment_requests WHERE id = ?", [id]);
    if (!request) return res.status(404).json({ error: "Request not found" });


    await db.query("UPDATE program_payment_requests SET status = 'rejected' WHERE id = ?", [id]);

    // Delete image
    if (request.payment_image_path) {
      const filePath = path.join(__dirname, "../uploads", request.payment_image_path);
      fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to delete image:", err);
      });
    }




    res.json({ message: "Payment rejected" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});




module.exports = router;



