const app = require("./app");
const PORT = process.env.PORT || 3000;
const db = require("./db/connection");
const fs = require("fs");
const path = require("path");
const { checkAllProcedures } = require("./utils/dbChecker");

// Function to check if triggers are active (for debug purposes)
const checkTriggers = async () => {
  try {
    const [triggers] = await db.query(`
      SELECT TRIGGER_NAME, EVENT_MANIPULATION, EVENT_OBJECT_TABLE 
      FROM information_schema.TRIGGERS 
      WHERE TRIGGER_SCHEMA = ?
    `, [process.env.DB_NAME]);
    
    if (triggers.length > 0) {
      console.log("✅ Found triggers:", triggers.map(t => t.TRIGGER_NAME).join(", "));
    } else {
      console.log("⚠️ No triggers found. You may need to run your triggers.sql in MySQL Workbench.");
    }
  } catch (err) {
    console.error("❌ Error checking triggers:", err.message);
  }
};

db.getConnection()
  .then(async () => {
    console.log("✅ Database connected successfully.");
    
    // Check if triggers are active
    await checkTriggers();
    
    // Check required procedures
    const { missing, existing } = await checkAllProcedures();
    if (existing.length > 0) {
      console.log("✅ Found procedures:", existing.join(", "));
    }
    if (missing.length > 0) {
      console.log("⚠️ Missing procedures:", missing.join(", "));
      console.log("Please run the procedures.sql and transactions.sql files in MySQL Workbench");
    }
  })
  .catch((err) => {
    console.error("❌ Unable to connect to the database:", err.message);
  });

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
