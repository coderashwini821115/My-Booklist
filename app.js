class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI {
    static displayBooks() {
      
        const books = Store.getBooks();
        books.forEach((book) => UI.addBookToList(book));
    }
        static addBookToList(book) {
            const list = document.querySelector('#book-list');
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class = "btn btn-danger btn-sm delete">X</a></td>
            `;
        list.appendChild(row);
        }

        static clearField() {
            document.querySelector('#title').value = '';
            document.querySelector('#author').value = '';
            document.querySelector('#isbn').value = '';
        }

        static deleteBook(e) {
            if(e.classList.contains('delete')) {
                e.parentElement.parentElement.remove();
                UI.showAlert('Book Removed', 'success');
            }
        }
        
        static showAlert(message, cname) {
            const div = document.createElement('div');
            div.className = `alert alert-${cname}`;
            div.appendChild(document.createTextNode(message));
            const cont = document.querySelector('.container');
            const form = document.querySelector('#book-form');
            cont.insertBefore(div, form);

            // Vanish in 3 seconds
            setTimeout(() => document.querySelector('.alert').remove(), 3000);

        } 
    }
    // Store class: Handles Storage
    class Store {
        static getBooks() {
            let books;
            if(localStorage.getItem('books') === null) {
                books = [];
            } else {
                books = JSON.parse(localStorage.getItem('books'));
            }
            return books;
        }
        static addBook(book) {
            const books = Store.getBooks();
            books.push(book);
            localStorage.setItem('books', JSON.stringify(books));
        }
        static removeBook(isbn) {
            const books = Store.getBooks();
            books.forEach((book, index) =>{
                if(book.isbn === isbn) {
                    books.splice(index, 1);
                }
            });
            localStorage.setItem('books', JSON.stringify(books));
        }

    }
    document.addEventListener('DOMContentLoaded', UI.displayBooks());

    // Event: Add a Book

    document.querySelector('#book-form').addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form value
        const title = document.querySelector('#title').value;
        const author = document.querySelector('#author').value;
        const isbn = document.querySelector('#isbn').value;

        // Validate
        if(title === '' || author === '' || isbn === '') {
            UI.showAlert('Please fill all the fields', 'danger');
        } else {
            const book = new Book(title, author, isbn);

            UI.addBookToList(book);
            // Add book to store
            Store.addBook(book);

            // show success message
            UI.showAlert('Jai Mahakal !! Book added', 'success')
    
            UI.clearField();
        }

     
    });

    // Event: remove a book

    document.querySelector('#book-list').addEventListener('click', (e)=>
    {
        // Remove Book from UI
        UI.deleteBook(e.target);

        // REmove from Store
        Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
        console.log(e.target.parentElement.previousElementSibling.textContent);
    }
    );