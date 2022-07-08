require("dotenv").config()

const app = require("./routes/routes");

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

app.get('/', (req, res)=> {
  res.send('Welcome to upskill node api app')
})
// server listening 
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});