// programs.js
const express = require("express");
const router = express.Router();
const db = require("../db"); 
const multer = require("multer");
const path = require("path");


// Multer setup
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

const formatDate = (inputDate) => {
  const date = new Date(inputDate);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// GET all programs
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM programs");
    rows.forEach(program => {

      if (program.image) {
        program.image = `http://localhost:5000/uploads/${program.image}`;
      }
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// POST new program
router.post("/", upload.single("image"), async (req, res) => {
  try {
        console.log("Request body:", req.body);
    console.log("File:", req.file);

  const {
    title,
    description,
    price,
    isFree,
    isCertified,
    isLive,
    duration,
    date,
    category
  } = req.body;

    const image = req.file ? req.file.filename : null;

await db.query(`
  INSERT INTO programs 
  (title, description, price, isFree, isCertified, isLive, duration, date, category, image)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`,
[
  title,
  description,
  price,
  isFree === "true" ? 1 : 0,
  isCertified === "true" ? 1 : 0,
  isLive === "true" ? 1 : 0,
  duration,
  date,
  category,
  image,
]
);


    res.status(201).json({ message: "Event created" });
  } catch (err) {
     console.error("Error in POST /programs:", err);
    res.status(500).json({ error: err.message });
  }
});


// In routes/events.js or a new route file
router.get("/check-attendance", async (req, res) => {
  const { userId, eventId } = req.query;

  if (!userId || !eventId) {
    return res.status(400).json({ error: "Missing userId or programId" });
  }

  try {
    const [rows] = await db.query(
      "SELECT * FROM program_attendees WHERE user_id = ? AND program_id = ?",
      [userId, eventId]
    );

    if (rows.length > 0) {
      res.json({ alreadyJoined: true });
    } else {
      res.json({ alreadyJoined: false });
    }
  } catch (err) {
    console.error("Error checking attendance:", err);
    res.status(500).json({ error: "Server error" });
  }
});








// PUT - Update a program
router.put("/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    price,
    isFree,
    isCertified,
    isLive,
    duration,
    date,
    category,
  } = req.body;

  const image = req.file ? req.file.filename : null;
    const formattedDate = formatDate(date);
  try {
    // Build query dynamically depending on whether image is updated
    const fields = [
      "title = ?",
      "description = ?",
      "price = ?",
      "isFree = ?",
      "isCertified = ?",
      "isLive = ?",
      "duration = ?",
      "date = ?",
      "category = ?"
    ];
    const values = [
      title,
      description,
      price,
      isFree === "true" ? 1 : 0,
      isCertified === "true" ? 1 : 0,
      isLive === "true" ? 1 : 0,
      duration,
      formattedDate,
      category
    ];

    if (image) {
      fields.push("image = ?");
      values.push(image);
    }

    values.push(id); // for WHERE clause

    const query = `UPDATE programs SET ${fields.join(", ")} WHERE id = ?`;
    await db.query(query, values);

    res.json({ message: "Program updated successfully" });
  } catch (err) {
    console.error("Error updating program:", err);
    res.status(500).json({ error: "Failed to update program" });
  }
});




// DELETE - Delete a program
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM programs WHERE id = ?", [id]);
    res.json({ message: "Program deleted successfully" });
  } catch (err) {
    console.error("Error deleting program:", err);
    res.status(500).json({ error: "Failed to delete program" });
  }
});








// GET all programs with optional user_id query to check enrollment
router.get("/", async (req, res) => {
  const userId = req.query.user_id;  // Optional

  try {
    // Fetch all programs
    const [programs] = await db.query("SELECT * FROM programs");

    // If userId passed, fetch all program_attendees of this user
    let enrolledProgramIds = [];
    if (userId) {
      const [program_attendees] = await db.query(
        "SELECT program_id FROM program_attendees WHERE user_id = ?",
        [userId]
      );
      enrolledProgramIds = program_attendees.map(e => e.program_id);
    }

    // Attach isEnrolled flag and adjust image URL
    const result = programs.map(program => ({
      ...program,
      image: program.image ? `http://localhost:5000/uploads/${program.image}` : "",
      isFree: Boolean(program.isFree),
      isCertified: Boolean(program.isCertified),
      isLive: Boolean(program.isLive),
      isEnrolled: userId ? enrolledProgramIds.includes(program.id) : false,
    }));

    res.json(result);
  } catch (err) {
    console.error("Error fetching programs:", err);
    res.status(500).json({ error: err.message });
  }
});





// Get all programs enrolled by a user
router.get('/user-programs/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const [events] = await db.query(`
      SELECT p.* 
      FROM programs p
      JOIN program_attendees e ON e.program_id = p.id
      WHERE e.user_id = ?
    `, [userId]);

    res.json(events);
  } catch (err) {
    console.error("Error in GET /user-programs/:userId:", err);
    res.status(500).json({ error: "Failed to fetch user events." });
  }
});




//Mark Program as completed
router.put("/:id/complete", async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("UPDATE programs SET completed = TRUE WHERE id = ?", [id]);
    res.json({ message: "Event marked as completed" });
  } catch (err) {
    console.error("Error completing event:", err);
    res.status(500).json({ error: "Failed to complete event" });
  }
});




module.exports = router;


