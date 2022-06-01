const http = require("http");
const app = require("./app");
const bodyParser = require('body-parser')

// create application/json parser
//var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
//var urlencodedParser = bodyParser.urlencoded({ extended: false })

// const server = http.createServer(app);

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

// server listening 
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});