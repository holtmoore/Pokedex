const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'public/images' });
const methodOverride = require('method-override');
const app = express();
const port = 4000;
const { v4: uuidv4 } = require('uuid');

const pokemonData = require('./models/pokemon');

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// New 
app.get('/pokemon/new', (req, res) => {
  res.render('new');
});

// Edit
app.get('/pokemon/:id/edit', (req, res) => {
  const pokemonId = req.params.id;
  const selectedPokemon = pokemonData.find((pokemon) => pokemon.id === pokemonId);
  if (selectedPokemon) {
    res.render('edit', { pokemon: selectedPokemon });
  } else {
    res.status(404).send('Pokémon not found');
  }
});

// Update
app.post('/pokemon/:id', upload.single('img'), (req, res) => {
  const pokemonId = req.params.id;
  const selectedPokemonIndex = pokemonData.findIndex((pokemon) => pokemon.id === pokemonId);

  if (selectedPokemonIndex !== -1) {
    const editedPokemon = {
      id: pokemonId,
      name: req.body.name,
      img: req.file ? '/images/' + req.file.filename : pokemonData[selectedPokemonIndex].img,
      type: req.body.type,
      stats: {
        hp: req.body.hp,
        attack: req.body.attack,
        defense: req.body.defense,
        spattack: req.body.spattack,
        spdefense: req.body.spdefense,
        speed: req.body.speed,
      },
    };

    // Update
    pokemonData[selectedPokemonIndex] = editedPokemon;

    res.redirect(`/pokemon/${pokemonId}`); 
  } else {
    res.status(404).send('Pokémon not found');
  }
});

// Destroy
app.delete('/pokemon/:id', (req, res) => {
  const pokemonId = req.params.id;
  const selectedPokemonIndex = pokemonData.findIndex((pokemon) => pokemon.id === pokemonId);

  if (selectedPokemonIndex !== -1) {
   
    pokemonData.splice(selectedPokemonIndex, 1);

    res.redirect('/pokemon');
  } else {
    res.status(404).send('Pokémon not found');
  }
});

// Index
app.get('/pokemon', (req, res) => {
  res.render('index', { pokemonData });
});

// Show
app.get('/pokemon/:id', (req, res) => {
  const pokemonId = req.params.id;
  const selectedPokemon = pokemonData.find((pokemon) => pokemon.id === pokemonId);
  if (selectedPokemon) {
    res.render('show', { pokemon: selectedPokemon });
  } else {
    res.status(404).send('Pokémon not found');
  }
});

// Create
app.post('/pokemon', upload.single('img'), (req, res) => {
  const newPokemon = {
    id: uuidv4(),
    name: req.body.name,
    img: req.file ? '/images/' + req.file.filename : null,
    type: req.body.type,
    stats: {
      hp: req.body.hp,
      attack: req.body.attack,
      defense: req.body.defense,
      spattack: req.body.spattack,
      spdefense: req.body.spdefense,
      speed: req.body.speed,
    },
  };

  pokemonData.push(newPokemon);

  res.redirect('/pokemon');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
