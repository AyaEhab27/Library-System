# 📚 Library Management System

A complete system for managing books and readers in libraries with an interactive web interface and automatic backup server.

## ✨ Key Features

- **Modern Web Interface** with Glassmorphism design
- **Automatic Backup System** (activates when main server fails)
- **Dual Storage** (MongoDB + local JSON files)
- **Easy Management Interface** for books and readers
- **Advanced Search** and data sorting
- **Server Monitoring** (online/offline status)

## 📦 Installation

1. Prerequisites:
   - Node.js (version 14 or higher)
   - MongoDB (version 4.4 or higher)

2. npm install
3. npm start

## 🚀 Usage  

After starting the server, open your browser at: http://localhost:3000


Main Interface:
. Books Tab: View, add, search, sort and delete books

. Readers Tab: View, add, search and delete readers

## 📂 Project Structure

library-system/
├── server/                 
│   ├── models/             
│   ├── routes/              
│   ├── utils/               
│   ├── app.js               
│   └── server.js            
├── public/                 
│   ├── css/
│   ├── js/
│   └── index.html
├── .gitignore
└── package.json

## 🌐 API Endpoints

Books:
GET /api/books - Get all books

POST /api/books - Add new book

GET /api/books/search?title=[title] - Search books

GET /api/books/sort/title - Sort books by title

GET /api/books/sort/date - Sort books by publication date

DELETE /api/books/:id - Delete a book by id

DELETE /api/books/by-title/:title - Delete a book by title

Readers:
GET /api/readers - Get all readers

POST /api/readers - Add new reader

GET /api/readers/search?name=[name] - Search readers

DELETE /api/readers/:id - Delete a reader

DELETE /api/readers/by-name/:name - Delete a reader by title

## 🛠️ Technologies Used

Backend:
. Node.js - JavaScript runtime

. Express.js - Web framework

. MongoDB - NoSQL database

. Mongoose - MongoDB ODM

Frontend:
. HTML5 - Page structure

. CSS3 - Styling

. JavaScript - User interaction

Utilities:
. dotenv - Environment variables

. chalk - Console text coloring

. fs-extra - File operations

. axios - HTTP requests
