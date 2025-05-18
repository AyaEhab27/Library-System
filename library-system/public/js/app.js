document.addEventListener('DOMContentLoaded', () => {

  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
    
  tabs.forEach(t => t.classList.remove('active'));
  tabContents.forEach(c => c.classList.remove('active'));
      
      const booksTab = document.querySelector('.tab[data-tab="books"]');
      const booksContent = document.getElementById('books-tab');

      booksTab.classList.add('active');
      booksContent.classList.add('active');

      listBooks();
      listReaders();

      tabs.forEach(tab => {
      tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      document.getElementById(`${tab.dataset.tab}-tab`).classList.add('active');

      if (tab.dataset.tab === 'books') {
        listBooks();
      } else {
        listReaders();
      }
    });
  });
  
  const bookModal   = document.getElementById('book-modal');
  const readerModal = document.getElementById('reader-modal');
  const closeButtons = document.querySelectorAll('.close');
    
  document.getElementById('add-book').addEventListener('click', () => {
  bookModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
});

  document.getElementById('add-reader').addEventListener('click', () => {
  readerModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
});

  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      bookModal.style.display = 'none';
      readerModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });

    
closeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
    document.body.style.overflow = 'auto';
  });
});
  

  document.getElementById('book-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    await addBook();
  });
  
  document.getElementById('reader-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    await addReader();
  });
  
  document.getElementById('list-books').addEventListener('click', listBooks);
  document.getElementById('sort-title').addEventListener('click', () => sortBooks('title'));
  document.getElementById('sort-date').addEventListener('click', () => sortBooks('date'));
  document.getElementById('search-books').addEventListener('click', searchBooks);
  
  document.getElementById('list-readers').addEventListener('click', listReaders);
  document.getElementById('search-readers').addEventListener('click', searchReaders);
  
  checkServerStatus();
  setInterval(checkServerStatus, 5000);
  

  setTimeout(() => {
    const activeTab = document.querySelector('.tab.active');
    if (activeTab.dataset.tab === 'books') {
      listBooks();
    } else {
      listReaders();
    }
  }, 100);
});


let currentServer = 'main';

const getBaseUrl = () => {
  return window.location.origin; 
};

const checkServerStatus = async () => {
  try {
  //  1- try main server
    const response = await fetch('http://localhost:3000/api/books/health');
    if (response.ok) {
      currentServer = 'main';
      document.getElementById('server-status').textContent = 'Main Server: Online';
      document.getElementById('server-status').style.color = '#2ecc71';
      return;
    }
  } catch (err) {
  //   2- try bakeup server
    try {
      const backupResponse = await fetch('http://localhost:3001/api/books/health');
      if (backupResponse.ok) {
        currentServer = 'backup';
        document.getElementById('server-status').textContent = 'Backup Server: Online';
        document.getElementById('server-status').style.color = '#9b59b6';
      }
    } catch (err) {
      // 3- Both servers down
      document.getElementById('server-status').textContent = 'All Servers: Offline';
      document.getElementById('server-status').style.color = '#e74c3c';
    }
  }
};

const handleApiError = (error) => {
  console.error('API Error:', error);
  alert('An error occurred. Please check the console for details.');
};
//  1- Add Book
const addBook = async () => {
  const form = document.getElementById('book-form');
  const bookData = {
    title: document.getElementById('book-title').value,
    author: document.getElementById('book-author').value,
    publicationDate: document.getElementById('book-date').value,
    genre: document.getElementById('book-genre').value,
    publisher: document.getElementById('book-publisher').value,
    language: document.getElementById('book-language').value
  };
  
  try {
    const response = await fetch(`${getBaseUrl()}/api/books`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookData)
    });
    
    if (!response.ok) throw new Error('Failed to add book');
      const data = await response.json();
      console.log('Book added:', data);
      await listBooks();
      document.getElementById('book-modal').style.display = 'none';
      form.reset();
      
      document.body.style.overflow = 'auto';

    } catch (err) {
    handleApiError(err);
  }
};
//  2- Add Reader
const addReader = async () => {
  const form = document.getElementById('reader-form');
  const readerData = {
    name: document.getElementById('reader-name').value,
    gender: document.getElementById('reader-gender').value,
    birthday: document.getElementById('reader-birthday').value,
    height: parseFloat(document.getElementById('reader-height').value),
    weight: parseFloat(document.getElementById('reader-weight').value),
    employment: document.getElementById('reader-employment').value
  };
  
  try {
    const response = await fetch(`${getBaseUrl()}/api/readers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(readerData)
    });
    
    if (!response.ok) throw new Error('Failed to add reader');
    
    const data = await response.json();
    console.log('Reader added:', data);
    await listReaders(); 
    document.getElementById('reader-modal').style.display = 'none';
    form.reset();
    
  } catch (err) {
    handleApiError(err);
  }
};
//  3-  List Books
const listBooks = async () => {
  try {
    const response = await fetch(`${getBaseUrl()}/api/books`);
    if (!response.ok) throw new Error('Failed to fetch books');
    
    const books = await response.json();
    const tableBody = document.querySelector('#books-table tbody');
    tableBody.innerHTML = '';
    
    books.forEach(book => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${new Date(book.publicationDate).toLocaleDateString()}</td>
        <td>${book.genre}</td>
        <td>
          <button class="action-btn delete" data-id="${book._id}">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
    

    document.querySelectorAll('#books-table .action-btn.delete').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        if (confirm('Are you sure you want to delete this book?')) {
          await deleteBook(e.target.dataset.id);
        }
      });
    });
  } catch (err) {
    handleApiError(err);
  }
};

// 4- List Readers
const listReaders = async () => {
  try {
    const response = await fetch(`${getBaseUrl()}/api/readers`);
    if (!response.ok) throw new Error('Failed to fetch readers');
    
    const readers = await response.json();
    const tableBody = document.querySelector('#readers-table tbody');
    tableBody.innerHTML = '';
    
    readers.forEach(reader => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${reader.name}</td>
        <td>${reader.gender}</td>
        <td>${new Date(reader.birthday).toLocaleDateString()}</td>
        <td>${reader.employment}</td>
        <td>
          <button class="action-btn delete" data-id="${reader._id}">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
    

    document.querySelectorAll('#readers-table .action-btn.delete').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        if (confirm('Are you sure you want to delete this reader?')) {
          await deleteReader(e.target.dataset.id);
        }
      });
    });
  } catch (err) {
    handleApiError(err);
  }
};
// 5- Search for Book
const searchBooks = async () => {
  const query = document.getElementById('book-search').value.trim();
  if (!query) return listBooks();
  
  try {
    const response = await fetch(`${getBaseUrl()}/api/books/search?title=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to search books');
    
    const books = await response.json();
    const tableBody = document.querySelector('#books-table tbody');
    tableBody.innerHTML = '';
    
    books.forEach(book => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${new Date(book.publicationDate).toLocaleDateString()}</td>
        <td>${book.genre}</td>
        <td>
          <button class="action-btn delete" data-id="${book._id}">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (err) {
    handleApiError(err);
  }
};

// 6- Search for Reader
const searchReaders = async () => {
  const query = document.getElementById('reader-search').value.trim();
  if (!query) return listReaders();
  
  try {
    const response = await fetch(`${getBaseUrl()}/api/readers/search?name=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to search readers');
    
    const readers = await response.json();
    const tableBody = document.querySelector('#readers-table tbody');
    tableBody.innerHTML = '';
    
    readers.forEach(reader => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${reader.name}</td>
        <td>${reader.gender}</td>
        <td>${new Date(reader.birthday).toLocaleDateString()}</td>
        <td>${reader.employment}</td>
        <td>
          <button class="action-btn delete" data-id="${reader._id}">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (err) {
    handleApiError(err);
  }
};

//  7- Sort  Books by date or title
const sortBooks = async (type) => {
  try {
    const endpoint = type === 'title' ? '/sort/title' : '/sort/date';
    const response = await fetch(`${getBaseUrl()}/api/books${endpoint}`);
    if (!response.ok) throw new Error(`Failed to sort books by ${type}`);
    
    const books = await response.json();
    const tableBody = document.querySelector('#books-table tbody');
    tableBody.innerHTML = '';
    
    books.forEach(book => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${new Date(book.publicationDate).toLocaleDateString()}</td>
        <td>${book.genre}</td>
        <td>
          <button class="action-btn delete" data-id="${book._id}">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (err) {
    handleApiError(err);
  }
};

// 8- Delete Book
const deleteBook = async (id) => {
  try {
    const response = await fetch(`${getBaseUrl()}/api/books/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) throw new Error('Failed to delete book');
    
    await listBooks(); 
    location.reload();
  } catch (err) {
    console.error('Delete Error:', err);
    alert('Failed to delete book. See console for details.');
  }
};

// 9- Delete Reader
const deleteReader = async (id) => {
  try {
    const response = await fetch(`${getBaseUrl()}/api/readers/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) throw new Error('Failed to delete reader');
    
    await listReaders(); 
    location.reload();
  } catch (err) {
    console.error('Delete Error:', err);
    alert('Failed to delete reader. See console for details.');
  }
};