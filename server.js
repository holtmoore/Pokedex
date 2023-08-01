const express = require('express');
const app = express();


const pokemonData = require('./models/pokemon');

app.set('view engine', 'ejs');



app.get('/pokemon', (req, res) => {
  res.json(pokemonData);
});




const port = 4000;
app.listen(port, () => {
  console.log(`Server running on localhost:${port}`);
});
