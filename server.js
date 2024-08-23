const express = require("express");
const initializeDatabase = require("./database");

const app = express();
app.use(express.json());

let db;

// Initialize the database and start the server
initializeDatabase()
  .then((database) => {
    db = database;
    const port = 3000;
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  });

// CRUD operations

// Access
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000"); // Replace with your frontend's origin
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
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
  const posts = req.body.posts;

  try {
    const insertPost = await db.prepare(`
        INSERT INTO posts (title, content, content_url)
        VALUES (?, ?, ?);
      `);

    for (const post of posts) {
      await insertPost.run(post.title, post.content, post.content_url);
    }

    await insertPost.finalize();
    res.status(200).send("Posts inserted successfully");
  } catch (error) {
    res.status(500).send(`Error inserting posts: ${error.message}`);
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
