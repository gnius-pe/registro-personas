const express = require('express');
const path = require('path');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const { Server } = require("socket.io");
const app = express();
const http = require('http');
const server = http.createServer(app);

const io = new Server(server);

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

const imagenesRandom = [
    "https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png",
    "https://assets.pokemon.com/assets/cms2/img/pokedex/full/004.png",
    "https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png",
    "https://assets.pokemon.com/assets/cms2/img/pokedex/full/016.png",
    "https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png",
    "https://assets.pokemon.com/assets/cms2/img/pokedex/full/039.png",
    "https://assets.pokemon.com/assets/cms2/img/pokedex/full/048.png",
    "https://assets.pokemon.com/assets/cms2/img/pokedex/full/052.png",
    "https://assets.pokemon.com/assets/cms2/img/pokedex/full/054.png",
    "https://assets.pokemon.com/assets/cms2/img/pokedex/full/074.png",
    "https://assets.pokemon.com/assets/cms2/img/pokedex/full/079.png",
    "https://assets.pokemon.com/assets/cms2/img/pokedex/full/104.png",
    "https://assets.pokemon.com/assets/cms2/img/pokedex/full/113.png",
    "https://assets.pokemon.com/assets/cms2/img/pokedex/full/120.png",
    "https://assets.pokemon.com/assets/cms2/img/pokedex/full/124.png",
    "https://assets.pokemon.com/assets/cms2/img/pokedex/full/129.png",
    "https://assets.pokemon.com/assets/cms2/img/pokedex/full/143.png",
    "https://assets.pokemon.com/assets/cms2/img/pokedex/full/150.png",
    "https://assets.pokemon.com/assets/cms2/img/pokedex/full/152.png"
]

require("dotenv").config();

//routes
const recordRoutes = require("./routes/record.js");
const port = process.env.PORT || 9000;
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://192.168.0.107'); 
const topic = 'alerta';
//const message = 'test message'; 

app.use(express.json({limit: '25mb'}));
app.use(express.urlencoded({limit: '25mb'}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded());


app.use(express.json());
app.use('/', recordRoutes);


// mongodb connection
mongoose
.connect(process.env.MONGODB_URI)
.then(() => {
    console.log("Conexión exitosa a base de datos");
})
.catch((error) => {
    console.error(error);
});

client.on('connect', () => {
    console.log(`Is client connected: ${client.connected}`);    
    if (client.connected === true) {
        // subscribe to a topic
        client.subscribe(topic);
    }
});

// receive a message from the subscribed topic
client.on('message',(topic, message) => {
    const recordSchema = require("./models/record");
    const recordPhoto = {"photo": imagenesRandom[Math.floor(Math.random() * imagenesRandom.length)]};
    const record = recordSchema(recordPhoto);
    record.save().then((data) => {
       console.log(data);
       io.sockets.emit('alerta', data);
    }).catch((error) => {
       console.log(error);
    })
});

// error handling
client.on('error',(error) => {
    console.error(error);
    process.exit(1);
});

server.listen(port, () => console.log('server listening on port', port));

