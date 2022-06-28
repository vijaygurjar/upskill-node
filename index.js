const app = require("./routes/routes");

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

// server listening 
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});