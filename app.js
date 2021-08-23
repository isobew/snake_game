const fs = require('fs');
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const path = require('path');
const { resolve } = require('path');
const PORT = 80;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
    

app.use(express.static('public'));

app.get('/', (req, res, next) => {

    const options = {
        root: path.join(__dirname + '/public/')
    };

    res.sendFile('index.html', options, (err) => {
        if (err) {
            next(err);
        } else {
            console.log('Sent:', fileName);
            next();
        }
    });
});

app.get("/ranking", (req, res)=>{
    fs.readFile('./data/players.json', 'utf-8', (err, data) => {
        if (err) throw err;
        let ranking;
        ranking = JSON.parse(data);
        ranking.sort((a, b) => parseInt(a["score"]) > parseInt(b["score"]) ? -1 : 1);
        res.send(ranking.slice(0, 10));
    });

})

app.post("/player", (req, res)=>{
    let info = req.body;
    let listaDeUsuarios = [];
    fs.readFile('./data/players.json', 'utf-8', (err, data) => {
        if (err) throw err;
        listaDeUsuarios = JSON.parse(data);
        listaDeUsuarios = listaDeUsuarios.filter((elem)=>{return elem.name != info.name});
        listaDeUsuarios.push(info);
        escreverArquivo(listaDeUsuarios);
    });
    res.send("enviado!");
})

function escreverArquivo(_listaDeUsuarios){
    fs.writeFile('./data/players.json', JSON.stringify(_listaDeUsuarios), (err) => {
        console.log("foi escrito");
    })

}

console.log("acabei de configurar programa servidor");

app.listen(PORT, ()=> console.log("executando..."));

