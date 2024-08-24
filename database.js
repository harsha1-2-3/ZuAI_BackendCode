const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const dbPath = path.join(__dirname, "blogs.db");

async function initializeDatabase() {
  try {
    // Open the database connection
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    // Drop the table if it exists (optional, for data cleanup)
    await db.exec(`DROP TABLE IF EXISTS posts;`);

    // Create the table with the new schema
    await db.exec(`
      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        content_url TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Insert dummy values if the table is empty
    const postCount = await db.get("SELECT COUNT(*) as count FROM posts");
    if (postCount.count === 0) {
      try {
        const dummyTitles = [
          "First Post",
          "Second Post",
          "Third Post",
          "Fourth Post",
          "Fifth Post",
        ];
        const dummyContent = [
          "This is the content of the first post.",
          "This is the content of the second post.",
          "This is the content of the third post.",
          "This is the content of the fourth post.",
          "This is the content of the fifth post.",
        ];
        const dummyUrls = [
          "https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png",
          "https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png",
          "https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png",
          "https://via.placeholder.com/150/FFFF00/000000?text=Blog+Post+Image+4",
          "https://via.placeholder.com/150/00FFFF/000000?text=Blog+Post+Image+5",
        ];

        for (let i = 0; i < dummyTitles.length; i++) {
          const insertStatement = await db.prepare(`
            INSERT INTO posts (title, content, content_url)
            VALUES (?, ?, ?)
          `);

          await insertStatement.run(
            dummyTitles[i],
            dummyContent[i],
            dummyUrls[i]
          );
        }
      } catch (err) {
        console.error("Error inserting posts:", err);
      }
    }

    return db; // Return the database connection after successful initialization
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1); // Exit process on critical error
  }
}

module.exports = initializeDatabase;
