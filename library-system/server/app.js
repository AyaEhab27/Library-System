require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const bookRoutes = require('./routes/books');
const readerRoutes = require('./routes/readers');
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(chalk.green('Connected to MongoDB')))
  .catch(err => console.error(chalk.red('Could not connect to MongoDB'), err));

app.use('/api/books', bookRoutes);
app.use('/api/readers', readerRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});



function printEndpoints() {
  console.log(chalk.cyan.bold('\nAvailable Endpoints:'));
  const routes = [];
  
  app._router.stack.forEach(middleware => {
    if (middleware.route) {
      routes.push({
        Method: Object.keys(middleware.route.methods).join(', ').toUpperCase(),
        Path: middleware.route.path
      });
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach(handler => {
        if (handler.route) {
          routes.push({
            Method: Object.keys(handler.route.methods).join(', ').toUpperCase(),
            Path: `/api${handler.route.path}`
          });
        }
      });
    }
  });
  
  console.table(routes);
}

mongoose.connection.once('open', () => {
  printEndpoints();
});

module.exports = app;