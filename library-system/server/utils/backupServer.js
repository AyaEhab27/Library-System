const axios = require('axios');
const chalk = require('chalk');
const express = require('express');
const mongoose = require('mongoose');
// const app = require('../app');
// const fs = require('fs-extra');
const path = require('path');

const BACKUP_PORT = process.env.BACKUP_SERVER_PORT || 3001;
const MAIN_SERVER_URL = `http://localhost:${process.env.MAIN_SERVER_PORT || 3000}`;
const CHECK_INTERVAL = 5000; 

let backupServer = null;


const checkMainServer = async () => {
  try {
    await axios.get(`${MAIN_SERVER_URL}/api/books/health`);
    console.log(chalk.green('Main server is running'));
    if (backupServer) {
      backupServer.close(() => {
        console.log(chalk.magenta('Backup server shutting down'));
        backupServer = null;
      });
    }
  } catch (err) {
    console.log(chalk.yellow('Main server is down'));
    if (!backupServer) {
      startBackupServer();
    }
  }
};


const startBackupServer = () => {
  if (backupServer) return;
  
  console.log(chalk.magenta('Starting backup server...'));
  
  const backupApp = express();
  backupApp.use(express.json());
  
  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log(chalk.magenta('Backup server connected to MongoDB')))
    .catch(err => console.error(chalk.red('Backup server could not connect to MongoDB'), err));

  backupApp.use('/api/books', require('../routes/books'));
  backupApp.use('/api/readers', require('../routes/readers'));
  
  backupApp.get('/api/books/health', (req, res) => {
    res.status(200).send('Backup server is healthy');
  });

  backupApp.use(express.static(path.join(__dirname, '../../public')));
  backupApp.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
  });

  backupServer = backupApp.listen(BACKUP_PORT, () => {
    console.log(chalk.magenta.bold(`Backup server running on port ${BACKUP_PORT}`));
  });
};

setInterval(checkMainServer, CHECK_INTERVAL);

module.exports = { startBackupServer };