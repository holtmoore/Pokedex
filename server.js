const express = require('express');
const app = express();
const port = 4000;

const pokemonData = require('./models/pokemon');

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.get('/pokemon', (req, res) => {
  res.render('index', { pokemonData });
});

app.get('/pokemon/:id', (req, res) => {
  const pokemonId = req.params.id;
  const selectedPokemon = pokemonData.find((pokemon) => pokemon.id === pokemonId);
  if (selectedPokemon) {
    res.render('show', { pokemon: selectedPokemon });
  } else {
    res.status(404).send('Pokémon not found');
  }
});

app.get('/pokemon/new', (req, res) => {
  res.render('new');
});


app.post('/pokemon', (req, res) => {
  const newPokemon = {
    id: generateNewId(),
    name: req.body.name,
    img: req.body.img,
    type: req.body.type,
    stats: req.body.stats,
 
  };


  pokemonData.push(newPokemon);


  res.redirect('/pokemon');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
