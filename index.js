require("dotenv").config()

const app = require("./routes/routes");

const port = process.env.API_PORT || 9000;

// server listening 
app.get('/', (req, res)=> {
  res.send('Welcome to upskill node api app')
})
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});