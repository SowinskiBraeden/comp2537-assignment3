const express = require("express");
const path = require("path");
const port = 8000;

const app = express();

app.use("/static", express.static(path.join(__dirname, "/public")));

app.get('/', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.sendFile(path.join(__dirname, '/views/index.html'));
  return res.status(200);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});