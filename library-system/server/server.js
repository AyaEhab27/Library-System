const mongoose = require('mongoose'); 
const app = require('./app');
const chalk = require('chalk');
const { startBackupServer } = require('./utils/backupServer');
const fs = require('fs-extra');
const path = require('path');


if (!mongoose.models.Counter) {
  mongoose.model('Counter', new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
  }));
}

const dataDir = path.join(__dirname, '../data');
fs.ensureDirSync(dataDir);

const PORT = process.env.MAIN_SERVER_PORT || 3000;
const HOST = 'localhost'; 

const server = app.listen(PORT, HOST, () => {
  console.log(chalk.green.bold(`
  ====================================
  | Main server running              |
  | Link: http://${HOST}:${PORT}     |
  ====================================
  `));
  
});

startBackupServer();

server.on('error', (err) => {
  console.error(chalk.red('  error in server:'), err);
});