import * as http from 'http'; 
import { SerialPort } from 'serialport'; 
import { ReadlineParser } from 'serialport'; 
import express from 'express'; 
import { Server } from 'socket.io'; 

const app = express(); 
const server = http.createServer(app); 
const io = new Server(server); 

app.use(express.static('public-game')); 

const protocolConfiguration = {
    path: 'COM3', 
    baudRate: 9600 
};

const port = new SerialPort(protocolConfiguration); 
const parser = port.pipe(new ReadlineParser()); 

app.get('/', (req, res) => {
    console.log("Hello There!"); 
});

port.on('error', function (err) {
    console.log('Error: ', err.message); // Maneja errores en la conexión serie e imprime el mensaje de error
});

parser.on('data', (data) => {
    console.log(data); 
    let input = data.split(":"); 
    if (input[0] == 'derecho') {
        moveRight(); 
    } else if (input[0] == 'izquierdo') {
        moveLeft(); 
    } else if (input[0] == 'disparar') {
        shoot(); 
    } else {
        console.log(input[0]); 
    }
});

// Maneja la conexión de los clientes de Socket.IO
io.on('connect', (socket) => {
    console.log('Usuario conectado'); 
    socket.on('disconnect', () => {
        console.log('Usuario desconectado'); 
    });
});

server.listen(6969, () => {
    console.log('LISTENING PORT 6969'); 
});


function moveRight() {
    io.emit('derecho'); 
}


function moveLeft() {
    io.emit('izquierdo'); 
}


function shoot() {
    io.emit('disparo'); 
}
