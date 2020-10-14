const express = require('express');
const path = require('path');
const app = express();
app.use(express.static(__dirname + '/dist/appLoans'));
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname +
    '/dist/appLoans/index.html'));
});
app.listen(process.env.PORT || 8080);
console.log('Server runnig on port ', process.env.PORT || 8080);
