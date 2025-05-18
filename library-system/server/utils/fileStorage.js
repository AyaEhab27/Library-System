const fs = require('fs-extra');
const path = require('path');
const Book = require('../models/Book');
const Reader = require('../models/Reader');
const dataDir = path.join(__dirname, '../../data');

const ensureDataDir = async () => {
  try {
    await fs.ensureDir(dataDir);

    if (!await fs.pathExists(path.join(dataDir, 'books.json'))) {
      await fs.writeJson(path.join(dataDir, 'books.json'), []);
    }
    if (!await fs.pathExists(path.join(dataDir, 'readers.json'))) {
      await fs.writeJson(path.join(dataDir, 'readers.json'), []);
    }
  } catch (err) {
    console.error('Error creating data directory:', err);
    throw err;
  }
};

const saveBooksToFile = async () => {
  try {
    await ensureDataDir();
    const filePath = path.join(dataDir, 'books.json');
    const books = await Book.find();
    await fs.writeJson(filePath, books);
    console.log('Books data saved to file');
  } catch (err) {
    console.error('Error saving books to file:', err);
    throw err;
  }
};

const loadBooksFromFile = async () => {
  try {
    await ensureDataDir();
    const filePath = path.join(dataDir, 'books.json');

    if (!await fs.pathExists(filePath)) {
      await fs.writeJson(filePath, []); 
      return [];
    }
    
    if (await fs.pathExists(filePath)) {
      const data = await fs.readJson(filePath);
      console.log('Books data loaded from file');
      return data;
    }
    console.log('No books data file found');
    return [];
  } catch (err) {
    console.error('Error loading books from file:', err);
    throw err;
  }
};

const saveReadersToFile = async () => {
  try {
    await ensureDataDir();
    const filePath = path.join(dataDir, 'readers.json');
    const readers = await Reader.find(); 
    await fs.writeJson(filePath, readers);
    console.log('Readers data saved to file');
  } catch (err) {
    console.error('Error saving readers to file:', err);
    throw err;
  }
};

const loadReadersFromFile = async () => {
  try {
    await ensureDataDir();
    const filePath = path.join(dataDir, 'readers.json');

    if (!await fs.pathExists(filePath)) {
      await fs.writeJson(filePath, []); 
      return [];
    }
    
    if (await fs.pathExists(filePath)) {
      const data = await fs.readJson(filePath);
      console.log('Readers data loaded from file');
      return data;
    }
    console.log('No readers data file found');
    return [];
  } catch (err) {
    console.error('Error loading readers from file:', err);
    throw err;
  }
};

module.exports = {
  saveBooksToFile,
  loadBooksFromFile,
  saveReadersToFile,
  loadReadersFromFile
};