const express = require('express');
const router = express.Router();
const Reader = require('../models/Reader');
const { saveReadersToFile, loadReadersFromFile } = require('../utils/fileStorage');

// 1- Add a new reader
router.post('/', async (req, res) => {
  try {
    const reader = new Reader(req.body);
    await reader.save();
    await saveReadersToFile(await Reader.find());
    console.log('  Add is Done:', {
          name: reader.name,
          gender: reader.gender,
          employment: reader.employment
        });
    res.status(201).send(reader);
  } catch (err) {
    res.status(400).send(err);
  }
});

// 2- Search for readers by id or name
router.get('/search', async (req, res) => {
  try {
    const { id, name } = req.query;
    let query = {};
    
    if (id) query._id = id;
    if (name) query.name = new RegExp(name, 'i');
    
    const readers = await Reader.find(query);
    res.send(readers);
   
  } catch (err) {
    res.status(500).send(err);
  }
});

// 3- Get all readers
router.get('/', async (req, res) => {
  try {
    const readers = await Reader.find();
    res.send(readers);
  } catch (err) {
    res.status(500).send(err);
  }
});

// 4) i- Delete reader by name
router.delete('/by-name/:name', async (req, res) => {
  try {
    const name = req.params.name;
    const reader = await Reader.findOneAndDelete({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });
    
    if (!reader) {
      return res.status(404).send(' reader not found');
    }
    
    await saveReadersToFile();
    res.send({ message: ` Delete is Done  "${name}" Successfuly`, deletedReader: reader });
    console.log('  Delete is Done:', {
          name: reader.name,
          gender: reader.gender,
          employment: reader.employment
        });
  } catch (err) {
    res.status(500).send(' Error : ' + err.message);
  }
});

//4) ii- Delete reader by id
router.delete('/:id', async (req, res) => {
  try {
    const reader = await Reader.findByIdAndDelete(req.params.id);
    if (!reader) return res.status(404).send('Reader not found');
    await saveReadersToFile();
    res.send(reader);
    console.log('  Delete is Done:', {
          name: reader.name,
          gender: reader.gender,
          employment: reader.employment
        });
  } catch (err) {
    res.status(500).send(err);
  }
});

(async () => {
  try {
    const data = await loadReadersFromFile();
    if (Array.isArray(data) && data.length > 0) {
      await Reader.deleteMany({});
      await Reader.insertMany(data);
    }
  } catch (err) {
    console.error('Error initializing data:', err);
  }
})();

module.exports = router;