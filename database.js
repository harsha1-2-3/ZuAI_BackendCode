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
          ('Third Post', 'This is the content of the third post.', 'https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png'),
('Fourth Blog Post', 'This is the content of the fourth blog post.', 'https://via.placeholder.com/150/FFFF00/000000?text=Blog+Post+Image+4'),
('Fifth Blog Post', 'This is the content of the fifth blog post.', 'https://via.placeholder.com/150/00FFFF/000000?text=Blog+Post+Image+5'),
('Sixth Blog Post', 'This is the content of the sixth blog post.', 'https://via.placeholder.com/150/FF00FF/000000?text=Blog+Post+Image+6'),
('Seventh Blog Post', 'This is the content of the seventh blog post.', 'https://via.placeholder.com/150/000000/FFFFFF?text=Blog+Post+Image+7'),
('Eighth Blog Post', 'This is the content of the eighth blog post.', 'https://via.placeholder.com/150/808080/FFFFFF?text=Blog+Post+Image+8'),
('Ninth Blog Post', 'This is the content of the ninth blog post.', 'https://via.placeholder.com/150/FFFFFF/000000?text=Blog+Post+Image+9'),
('Tenth Blog Post', 'This is the content of the tenth blog post.', 'https://via.placeholder.com/150/FF5733/FFFFFF?text=Blog+Post+Image+10'),
('Eleventh Blog Post', 'This is the content of the eleventh blog post.', 'https://via.placeholder.com/150/4A235A/FFFFFF?text=Blog+Post+Image+11'),
('Twelfth Blog Post', 'This is the content of the twelfth blog post.', 'https://via.placeholder.com/150/1F618D/FFFFFF?text=Blog+Post+Image+12'),
('Thirteenth Blog Post', 'This is the content of the thirteenth blog post.', 'https://via.placeholder.com/150/229954/FFFFFF?text=Blog+Post+Image+13'),
('Fourteenth Blog Post', 'This is the content of the fourteenth blog post.', 'https://via.placeholder.com/150/F4D03F/000000?text=Blog+Post+Image+14'),
('Fifteenth Blog Post', 'This is the content of the fifteenth blog post.', 'https://via.placeholder.com/150/E67E22/FFFFFF?text=Blog+Post+Image+15'),
('Sixteenth Blog Post', 'This is the content of the sixteenth blog post.', 'https://via.placeholder.com/150/A93226/FFFFFF?text=Blog+Post+Image+16'),
('Seventeenth Blog Post', 'This is the content of the seventeenth blog post.', 'https://via.placeholder.com/150/2471A3/FFFFFF?text=Blog+Post+Image+17'),
('Eighteenth Blog Post', 'This is the content of the eighteenth blog post.', 'https://via.placeholder.com/150/138D75/FFFFFF?text=Blog+Post+Image+18'),
('Nineteenth Blog Post', 'This is the content of the nineteenth blog post.', 'https://via.placeholder.com/150/633974/FFFFFF?text=Blog+Post+Image+19'),
('Twentieth Blog Post', 'This is the content of the twentieth blog post.', 'https://via.placeholder.com/150/9C640C/FFFFFF?text=Blog+Post+Image+20');

      `);
    } catch (err) {
      console.error("Error inserting posts:", err);
    }
  }

  return db;
}

module.exports = initializeDatabase;
