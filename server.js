require("dotenv").config();
const express = require("express");
const initializeDatabase = require("./database");
// const cors = require("cors");

const app = express();
app.use(express.json());
/*
const allowedOrigins = [
  "http://localhost:3000", // for development
  "https://zuaipostsproject.netlify.app", // replace with actual domain
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        // !origin allows requests like Postman or server-side calls without Origin header
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
  })
);*/
let db;
console.log("Environment:", process.env.NODE_ENV);

initializeDatabase()
  .then((database) => {
    db = database;
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  });

// CRUD operations

app.use((req, res, next) => {
  // const origin = req.headers.origin;

  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://zuaipostsproject.netlify.app/"
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});
// Get all posts
app.get("/posts", async (req, res) => {
  try {
    const posts = await db.all("SELECT * FROM posts");
    res.json(posts);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get a specific post
app.get("/posts/:id", async (req, res) => {
  try {
    const post = await db.get("SELECT * FROM posts WHERE id = ?", [
      req.params.id,
    ]);
    if (post) {
      res.json(post);
    } else {
      res.status(404).send("Post not found");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Create a new post
app.post("/posts", async (req, res) => {
  const { title, content, content_url } = req.body;

  try {
    // Run the insertion directly
    const result = await db.run(
      `
        INSERT INTO posts (title, content, content_url)
        VALUES (?, ?, ?)
      `,
      [title, content, content_url]
    );

    // Check if the insertion was successful
    if (result.changes > 0) {
      res.status(201).json({
        message: "Post inserted successfully",
        postId: result.lastID,
      });
    } else {
      res.status(400).send("Failed to insert post");
    }
  } catch (error) {
    res.status(500).send(`Error inserting post: ${error.message}`);
  }
});

// Update a post
app.put("/posts/:id", async (req, res) => {
  const { title, content } = req.body;
  try {
    const result = await db.run(
      "UPDATE posts SET title = ?, content = ? WHERE id = ?",
      [title, content, req.params.id]
    );
    if (result.changes > 0) {
      res.json({ id: req.params.id, title, content });
    } else {
      res.status(404).send("Post not found");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete a post
app.delete("/posts/:id", async (req, res) => {
  try {
    const result = await db.run("DELETE FROM posts WHERE id = ?", [
      req.params.id,
    ]);
    if (result.changes > 0) {
      res.status(204).send("Post Deleted");
    } else {
      res.status(404).send("Post not found");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});
