const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 2004
const db = require('./queries')
var cors = require('cors')
app.use(cors())
app.options('*', cors())

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)


app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  next();
});



app.get('/pasazerowie', db.getPasazerowie)
app.get('/loty', db.getLoty)
app.post('/pasazerowie', db.stworzPasazera)
app.post('/login', db.login)
app.get('/znizka', db.znizka)
app.post('/dodajZnizke', db.dodajZnizke)
app.get('/bagaz', db.bagaz)
app.post('/bagazRezerwacja', db.bagazRezerwacja)
app.post('/ustawZajetosc', db.ustawZajetosc)
app.get('/klasa', db.klasa)
app.get('/zajeteMiejsca', db.zajeteMiejsca)
app.post('/oplata', db.oplata)
app.get('/pasazerID', db.pasazerID)
app.get('/kwota', db.kwota)
app.put('/wstawKoszt', db.wstawKoszt)
app.get('/usytuowanie', db.usytuowanie)
app.get('/nazwaKlasy', db.nazwaKlasy)
app.post('/zrobRezerwacje', db.zrobRezerwacje)
app.post('/wstawRezerwacje', db.wstawRezerwacje)
app.get('/wyswietlRezerwacje', db.wyswietlRezerwacje)
app.get('/calkowityKoszt', db.calkowityKoszt)
app.get('/wszystkieLoginy', db.wszystkieLoginy)


app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})