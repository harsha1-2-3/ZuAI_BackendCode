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
          "Firstpost began in 2011 as an online news portal of Network18. In May 2013, the news group was merged with the Indian edition of Forbes India whose four top editorial heads, including editor in chief Indrajit Gupta, were dismissed.The event led to a media furor. Thereafter on 31 May 2013, Firstpost took over a satirical website Fakingnews.com for an undisclosed amount. According to Scroll.in,Network18, with its online outlet FirstPost, famously lost its primetime anchors in 2014 because of a diktat against criticising Modi.In 2015, The Caravan reported on censorship in Firstpost over criticism of political leaders such as Arun Jaitley. In January 2019, a weekly English-language print edition of Firstpost began, and then ended in June 2019, with publication of Firstpost continuing online. As of April 2020, Jaideep Giridhar is the executive editor of Firstpost in Mumbai, while Sanjay Singh is the deputy executive editor. On 26 January 2023, the prime-time show Vantage was launched, hosted by managing editor Palki Sharma Upadhyay, formerly of WION.Fact-checkers have found the Firstpost to have posted incorrect information on multiple occasions. In 2023, it misreported photo of a grave with iron grille to be from Pakistan when it was from Hyderabad, India.In 2023, it falsely reported that Atiq Ahmed's vote had ‘Saved' the UPA Govt in 2008.",
          "postal services established according to mail content: second-class consists of newspapers and magazines, third-class encompasses other printed matter and merchandise weighing less than one pound, and fourth-class mail is either merchandise or printed matter that weighs one pound or more.postal services established according to mail content: second-class consists of newspapers and magazines, third-class encompasses other printed matter and merchandise weighing less than one pound, and fourth-class mail is either merchandise or printed matter that weighs one pound or more.postal services established according to mail content: second-class consists of newspapers and magazines, third-class encompasses other printed matter and merchandise weighing less than one pound, and fourth-class mail is either merchandise or printed matter that weighs one pound or more.postal services established according to mail content: second-class consists of newspapers and magazines, third-class encompasses other printed matter and merchandise weighing less than one pound, and fourth-class mail is either merchandise or printed matter that weighs one pound or more.",
          "Hooks were added to React in version 16.8. Hooks allow function components to have access to state and other React features. Because of this, class components are generally no longer needed.Although Hooks generally replace class components, there are no plans to remove classes from React.Hooks allow us to hook into React features such as state and lifecycle methods.",
          "CSS (Cascading Style Sheets) allows you to create great-looking web pages, but how does it work under the hood? This article explains what CSS is with a simple syntax example and also covers some key terms about the language.As we have mentioned before, CSS is a language for specifying how documents are presented to users — how they are styled, laid out, etc.A document is usually a text file structured using a markup language — HTML is the most common markup language, but you may also come across other markup languages such as SVG or XML.Presenting a document to a user means converting it into a form usable by your audience. Browsers, like Firefox, Chrome, or Edge, are designed to present documents visually, for example, on a computer screen, projector, or printer.",
          "Artificial Intelligence (AI) is developing and advancing right before our very eyes. It has aggressively integrated into our society as it contributes heavily to a plethora of fields such as medical, legal, military, and government. Although AI is used universally as a resource and tool, it is less certain how advanced and dependable it will become. Likewise, society is still determining the implications it will have on the global dynamic. Diplomatic figures and institutes have utilized AI to enhance productivity and facilitate international development and diplomatic efforts. Diplomats who have served in various regions of the world have shared with ADST their views of AI in the workplace, the global sphere, and what the future could look like. This “Moment in U.S. Diplomatic History” will explore various diplomatic perspectives on AI over the time of its development and includes excerpts from the following ADST oral histories: Leslie Gerson (2007), a career consular officer, discusses how she wished she had more technological knowledge when she went to Sandia Labs since it would have aided in her understanding of AI; Keith Curtis (2018), who was acting senior commercial officer for a number of years, shares his viewpoint on how the future is not in AI but in aerospace; Richard Virden (2011), a National War College faculty member, discusses how AI contributes heavily to the military and the military-industrial-complex and questions if Congress is making the right decisions in allocating large amounts of money to combative efforts rather than countering cyberwarfare; and Jack Shellenberger (1990), the former director of programs at Voice of America, who remarks on the international development of AI in the context of political and trade relationships.",
        ];
        const dummyUrls = [
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoa0xRB5N5tODjzYiiK95_p8QkpPecrrXlSXc9L5oO9P76HPTYlzK3P8G_&s=10",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0Uk5C7SVTO3Yt2azBDPuJ-mLbca-cX4F_sw&s",
          "https://miro.medium.com/v2/resize:fit:900/0*HemFwK6FJ1T9gNtz.png",
          "https://colorlib.com/wp/wp-content/uploads/sites/2/creative-css3-tutorials.jpg",
          "https://images.spiceworks.com/wp-content/uploads/2023/05/16105727/AI-Replacing-Human-Workers.jpg",
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
