const express = require('express')
const app = express();
var cookieParser = require('cookie-parser')
var csrf = require('csurf')
const bodyParser = require('body-parser')

var csrfProtection = csrf({ cookie: true })
var parseForm = bodyParser.urlencoded({ extended: false })

app.set('view engine', 'ejs');
app.use(cookieParser())

app.get('/csrf', csrfProtection, function (req, res) {
  // pass the csrfToken to the view
  let csrftoken = req.csrfToken();
  res.send(`
    <html>
    <form id="myForm" action="/transfer" method="POST" target="_self">
    Account:<input type="text" name="account" value="your friend"/><br/>
    Amount:<input type="text" name="amount" value="$5000"/>
    <input type="hidden" name="_csrf" value="${csrftoken}"/>
      <button type="submit">Transfer Money</button>
    </form>
    </html>
    `)
    console.log('to browser',csrftoken);
})

app.post('/transfer', parseForm, csrfProtection, function (req, res) {
  console.log('from browser:',req.body._csrf)
  res.send("OK")
})

// server listening 
app.listen(9000, () => {
  console.log(`Server running on port 9000`);
});