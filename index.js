require("dotenv").config()

const app = require("./routes/routes");

const port = process.env.API_PORT || 9000;

// server listening 
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});