const express = require("express");
const router = express.Router();
const db = require("../db");

const path = require("path");
const nodemailer = require("nodemailer");




// // Join an event
// router.post("/:id/join-event", async (req, res) => {
//   const { id: eventId } = req.params;
//   const { userId } = req.body;

//   if (!userId) {
//     return res.status(400).json({ error: "User ID is required" });
//   }

//   try {
//     // Check if already joined
//     const [existing] = await db.query(
//       'SELECT * FROM event_attendees WHERE user_id = ? AND event_id = ?',
//       [userId, eventId]
//     );

//     if (existing.length > 0) {
//       return res.status(400).json({ error: "User already joined the event" });
//     }

//     // Insert into event_attendees
//     await db.query(
//       `INSERT INTO event_attendees (user_id, event_id) VALUES (?, ?)`,
//       [userId, eventId]
//     );

//     // Update attendees count
//     await db.query(
//       `UPDATE events SET attendees = (
//         SELECT COUNT(*) FROM event_attendees WHERE event_id = ?
//       ) WHERE id = ?`,
//       [eventId, eventId]
//     );

//     res.json({ message: "User joined the event" });
//   } catch (err) {
//     console.error("Error in POST /events/:id/join-event", err);
//     res.status(500).json({ error: err.message });
//   }
// });


// verify-payment
router.post("/:id/verify-payment", async (req, res) => {
  const { userId, transactionId } = req.body;
  const eventId = req.params.id;

  if (!userId || !transactionId || !eventId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const isValidFormat = /^[A-Z0-9]{12}$/.test(transactionId);
  if (!isValidFormat) {
    return res.status(400).json({ error: "Invalid transaction ID format" });
  }

  try {
    // Check if this user has already requested
    const [existingRequest] = await db.query(
      "SELECT * FROM event_payment_requests WHERE user_id = ? AND event_id = ?",
      [userId, eventId]
    );

    if (existingRequest.length > 0) {
      return res.status(400).json({ error: "Already submitted. Awaiting admin approval." });
    }

    // Insert into payment request table
    await db.query(
      "INSERT INTO event_payment_requests (user_id, event_id, transaction_id, status) VALUES (?, ?, ?, 'pending')",
      [userId, eventId, transactionId]
    );

    res.status(200).json({ message: "Request submitted. Awaiting admin approval." });

  } catch (err) {
    console.error("Error verifying payment:", err);
    res.status(500).json({ error: "Server error" });
  }
});





//admin-approval
router.post("/:id/accept-payment", async (req, res) => {
  const eventId = req.params.id;
  const { userId } = req.body;

  if (!userId || !eventId) {
    return res.status(400).json({ error: "Missing user or event ID" });
  }

  try {
    // Get payment request
    const [[request]] = await db.query(
      "SELECT * FROM event_payment_requests WHERE user_id = ? AND event_id = ? AND status = 'pending'",
      [userId, eventId]
    );

    if (!request) {
      return res.status(404).json({ error: "No pending request found" });
    }

    // Add user to event
    await db.query(
      "INSERT INTO event_attendees (user_id, event_id, transaction_id) VALUES (?, ?, ?)",
      [userId, eventId, request.transaction_id]
    );

    // Update attendees count
    await db.query(
      `UPDATE events SET attendees = (
        SELECT COUNT(*) FROM event_attendees WHERE event_id = ?
      ) WHERE id = ?`,
      [eventId, eventId]
    );

    // Update payment request status
    await db.query(
      "UPDATE event_payment_requests SET status = 'approved' WHERE user_id = ? AND event_id = ?",
      [userId, eventId]
    );

    // Send confirmation email
    const [[user]] = await db.query("SELECT email FROM users WHERE id = ?", [userId]);
    const [[event]] = await db.query("SELECT title FROM events WHERE id = ?", [eventId]);
    if (user && event) {
      await sendConfirmationEmail(user.email, event.title);
    }

    res.json({ message: "Payment approved and user added to event" });
  } catch (err) {
    console.error("Admin accept error:", err);
    res.status(500).json({ error: "Server error" });
  }
});





async function sendConfirmationEmail(toEmail, eventTitle) {
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
    subject: `Registration confirmed for ${eventTitle}`,
    text: `Hello! Your registration for the event "${eventTitle}" is confirmed. Thank you!`,
  });
}





// Get pending payment requests
router.get("/payment-requests", async (req, res) => {
  const [rows] = await db.query(`
    SELECT p.*, e.title AS event_title 
    FROM event_payment_requests p
    JOIN events e ON p.event_id = e.id
    WHERE p.status = 'pending'
    ORDER BY p.created_at DESC
  `);
  res.json(rows);
});

// Approve a payment request
router.post("/payment-requests/:id/approve", async (req, res) => {
  const { id } = req.params;
  try {
    const [[request]] = await db.query("SELECT * FROM event_payment_requests WHERE id = ?", [id]);
    if (!request) return res.status(404).json({ error: "Request not found" });

    const { user_id, event_id, transaction_id } = request;

    // Prevent duplicates
    const [existing] = await db.query("SELECT * FROM event_attendees WHERE user_id = ? AND event_id = ?", [user_id, event_id]);
    if (existing.length > 0) return res.status(400).json({ error: "User already enrolled" });

    // Approve
    await db.query(`
      INSERT INTO event_attendees (user_id, event_id, transaction_id)
      VALUES (?, ?, ?)
    `, [user_id, event_id, transaction_id]);

    await db.query(`
      UPDATE events SET attendees = (
        SELECT COUNT(*) FROM event_attendees WHERE event_id = ?
      ) WHERE id = ?
    `, [event_id, event_id]);

    await db.query("UPDATE event_payment_requests SET status = 'approved' WHERE id = ?", [id]);

    res.json({ message: "Payment approved and user added to event" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Reject a payment request
router.post("/payment-requests/:id/reject", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("UPDATE event_payment_requests SET status = 'rejected' WHERE id = ?", [id]);
    res.json({ message: "Payment rejected" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});




module.exports = router;