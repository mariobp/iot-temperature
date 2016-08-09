var five = require("johnny-five");
var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(8010);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}


five.Board().on("ready", function() {
    var temperature = new five.Thermometer({
        controller: "LM35",
        pin: "A0"
    });
    var led1 = new five.Led(5);
    var led2 = new five.Led(6);
    console.log("Board ready");
    io.on('connection', function (socket) {
      console.log("connection");
      temperature.on("change", function() {
          console.log(this.celsius + "°C", this.fahrenheit + "°F");
          socket.emit('news', { "c": this.celsius, "f": this.fahrenheit});
          if (this.celsius <= 28) {
              led1.on();
              led2.off();
          } else {
              console.log("Hace calor");
              led1.off();
              led2.on();
          }
      });
      socket.on('my other event', function (data) {
        console.log(data);
      });
    });
});
