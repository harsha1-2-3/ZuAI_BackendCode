const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const dbPath = path.join(__dirname, "blogs.db");

async function initializeDatabase() {
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  // Drop the table if it exists
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

  // Insert some dummy values if the table is empty
  const postCount = await db.get("SELECT COUNT(*) as count FROM posts");
  if (postCount.count === 0) {
    try {
      await db.run(`
          INSERT INTO posts (title, content, content_url)
          VALUES
          ('First Post', 'This is the content of the first post.', 'https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png'),
          ('Second Post', 'This is the content of the second post.', 'https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png'),
          ('Third Post', 'This is the content of the third post.', 'https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png');
      `);
    } catch (err) {
      console.error("Error inserting posts:", err);
    }
  }

  return db;
}

module.exports = initializeDatabase;
