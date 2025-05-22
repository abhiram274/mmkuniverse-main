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



// Get all events
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM events");
    rows.forEach(event => {

      if (event.image) {
        event.image = `http://localhost:5000/uploads/${event.image}`;
      }
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all *non-completed* events
// router.get("/non-complete", async (req, res) => {
//   try {
//     const [rows] = await db.query("SELECT * FROM events WHERE completed = FALSE");
    
//     rows.forEach(event => {
//       if (event.image) {
//         event.image = `http://localhost:5000/uploads/${event.image}`;
//       }
//     });

//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });










// Create a new event with image
router.post("/", upload.single("image"), async (req, res) => {
  try {
        console.log("Request body:", req.body);
    console.log("File:", req.file);
    const {
      title, description, date, time, location, organizer,category
    } = req.body;

    const image = req.file ? req.file.filename : null;

const formattedDate = formatDate(date); // replace 'date' from req.body

await db.query(
  `INSERT INTO events (title, description, date, time, location, organizer, category, image)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  [title, description, formattedDate, time, location, organizer, category, image]
);

    res.status(201).json({ message: "Event created" });
  } catch (err) {
     console.error("Error in POST /events:", err);
    res.status(500).json({ error: err.message });
  }
});




// Update event
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, time, location, organizer, category } = req.body;
    const image = req.file ? req.file.filename : null;
    const formattedDate = formatDate(date);

    let query = `UPDATE events SET title = ?, description = ?, date = ?, time = ?, location = ?, organizer = ?, category = ?`;
const params = [title, description, formattedDate, time, location, organizer, category];

    if (image) {
      query += `, image = ?`;
      params.push(image);
    }

    query += ` WHERE id = ?`;
    params.push(id);

    await db.query(query, params);

    res.json({ message: "Event updated" });
  } catch (err) {
    console.error("Error in PUT /events/:id:", err);
    res.status(500).json({ error: err.message });
  }
});

// Delete event
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM events WHERE id = ?", [id]);
    res.json({ message: "Event deleted" });
  } catch (err) {
    console.error("Error in DELETE /events/:id:", err);
    res.status(500).json({ error: err.message });
  }
});








// Join an event
router.post("/:id/join-event", async (req, res) => {
  const { id: eventId } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    // Check if already joined
    const [existing] = await db.query(
      'SELECT * FROM event_attendees WHERE user_id = ? AND event_id = ?',
      [userId, eventId]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: "User already joined the event" });
    }

    // Insert into event_attendees
    await db.query(
      `INSERT INTO event_attendees (user_id, event_id) VALUES (?, ?)`,
      [userId, eventId]
    );

    // Update attendees count
    await db.query(
      `UPDATE events SET attendees = (
        SELECT COUNT(*) FROM event_attendees WHERE event_id = ?
      ) WHERE id = ?`,
      [eventId, eventId]
    );

    res.json({ message: "User joined the event" });
  } catch (err) {
    console.error("Error in POST /events/:id/join-event", err);
    res.status(500).json({ error: err.message });
  }
});



// Get all events joined by a user
router.get('/user-events/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const [events] = await db.query(`
      SELECT e.* 
      FROM events e
      JOIN event_attendees ea ON ea.event_id = e.id
      WHERE ea.user_id = ?
    `, [userId]);

    res.json(events);
  } catch (err) {
    console.error("Error in GET /user-events/:userId:", err);
    res.status(500).json({ error: "Failed to fetch user events." });
  }
});




// Mark event as completed
// Mark event as completed
router.put("/:id/complete", async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("UPDATE events SET completed = TRUE WHERE id = ?", [id]);
    res.json({ message: "Event marked as completed" });
  } catch (err) {
    console.error("Error completing event:", err);
    res.status(500).json({ error: "Failed to complete event" });
  }
});





module.exports = router;
