var express = require('express');
var app = express();
var admin = require("firebase-admin");
var serviceAccount = require("./news-c1eed-firebase-adminsdk-lxsj2-d67e262685.json");
var fs = require('fs');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://news-c1eed.firebaseio.com"
});

var database = admin.database();
var ref = database.ref("/News-list/");
ref.remove(); // Clear all news


var index = 0;
var intervalLoadData = setInterval(function() {
  fs.readFile('./news.json', function(err, data){
    if(err) return;

    let result = JSON.parse(data);
    let item = result[index];
    if(!item) {
      clearInterval(intervalLoadData);
      return;
    }

    let itemId = stringToFormatId(item.title);
    let refItem = database.ref('/News-list/' + itemId + '/');
    refItem.set(item);
    index++;
  })
}, 2000);


app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

function stringToFormatId(value) {
  if(!value) return null;
  return value.toLowerCase().replace(' ', '-');
}
