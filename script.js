//Global variables.
let myLibrary = [];


//Select DOM
let tbody = document.querySelector('tbody')
const addBookButton = document.getElementById('addBookButton');
const modal = document.getElementById('modal');
const submitForm = document.getElementById('submitForm');
const table = document.querySelector('table');
const closeFormButton = document.getElementById('closeForm');


//Event Listeners
addBookButton.addEventListener('click', openForm);
table.addEventListener('click', handleTableClick);
submitForm.addEventListener('click', addBookFromForm);
closeFormButton.addEventListener('click', closeForm);
window.addEventListener('load', updateMyLibrary);
//Functions

function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read
};
Book.prototype.switchReadingStatusOnMyLibrary = function() {
    if(this.read) {
        this.read = false;
    }
    else this.read = true;
}

function addBookToLibrary(title, author, pages, read) {
    const book = new Book(title, author, pages, read)
    myLibrary.push(book);
}

function displayBookInTable() {
        let book = myLibrary[myLibrary.length - 1];
        let tr = document.createElement('tr');
        tr.setAttribute('data-index', `${myLibrary.indexOf(book)}`);
        let keys = Object.keys(book);
        keys.forEach(key => {
            let td = document.createElement('td');
            td.innerText = `${book[key]}`;
            td.classList.add(`${key}`);
            tr.appendChild(td);
        });
        let td = document.createElement('td');
        td.innerHTML = `<i class="fas fa-trash"></i>`;
        tr.appendChild(td);
        td.classList.add('delete');
        td.classList.add('deleteColumn');
        tbody.appendChild(tr);
};

function openForm() {
    modal.style.display = 'flex';
};

function closeForm() {
    modal.style.display = 'none';
}

function handleTableClick(e) {
    //Only take action if the delete button is what's triggered;
    if(e.target.classList.contains('delete')) {
        removeBook(e);
    }
    else if(e.target.classList.contains('read')) {
        let index = e.target.parentElement.getAttribute('data-index');
        myLibrary[index].switchReadingStatusOnMyLibrary();
        switchReadingStatusOnTable(e);
    }
    //update myLibrary in the local storage;
    localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
};
function removeBook(e) {
    e.target.parentElement.remove();
    removeBookFromTable(e.target.parentElement);
    removeBookFromLibrary(e.target.getAttribute('data-index'));
    updateDataIndex(e.target.getAttribute('data-index'));
};

function switchReadingStatusOnTable(e) {
    let td = e.target;
    td.innerText === 'true' ? td.innerText = false : td.innerText = 'true';
}

function removeBookFromTable(book) {
    book.remove();
};

function removeBookFromLibrary(index) {
    myLibrary.splice(index, 1);
};

function updateDataIndex(indexDeleted) {
    let i = indexDeleted + 1;
    while(i < myLibrary.length && i > 1) {
        let tr = document.querySelector(`[data-index^="${i}"]`);
        tr.setAttribute(`data-index="${i - 1}"`);
    }
}

function addBookFromForm() {
    let titleInput = document.getElementById('titleInput').value;
    let authorInput = document.getElementById('authorInput').value;
    let pagesInput = document.getElementById('pagesInput').value;
    let readingStatus = document.getElementById('switch').checked;
    if(titleInput && authorInput && pagesInput) {
        addBookToLibrary(titleInput, authorInput, pagesInput, readingStatus);
        displayBookInTable();
        document.getElementById('titleInput').value = '';
        document.getElementById('authorInput').value = '';
        document.getElementById('pagesInput').value = '';
    };
    //add myLibrary to the local storage of the browser.
    localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
};

function updateReadingStatusOnTable(index) {
    let readingStatusTd = document.querySelector(`[data-index^="${index}"]`);
    if(readingStatusTd.innerText === 'true') {
        readingStatusTd.innerText = 'false';
    }
    else readingStatusTd.innerText = 'true';
}

function updateMyLibrary() {
    if(localStorage.getItem('myLibrary')) {
        localStorageLibrary = JSON.parse(localStorage.getItem('myLibrary'));
        for(let i = 0; i < localStorageLibrary.length; i++) {
            let book = localStorageLibrary[i];
            addBookToLibrary(book.title, book.author, book.pages, book.read);
            displayBookInTable();
        }
    }
};

// function displayBooksFromLocalStorage() {
//     for(let i = 0; i < myLibrary.length; i++) {
//         let book = myLibrary[i];
//         let tr = document.createElement('tr');
//         tr.setAttribute('data-index', `${i}`);
//         let keys = Object.keys(book);
//         keys.forEach(key => {
//             let td = document.createElement('td');
//             td.innerText = `${book[key]}`;
//             td.classList.add(`${key}`);
//             tr.appendChild(td);
//         });
//         let td = document.createElement('td');
//         td.innerHTML = `<i class="fas fa-trash"></i>`;
//         tr.appendChild(td);
//         td.classList.add('delete');
//         td.classList.add('deleteColumn');
//         tbody.appendChild(tr);
//     }
// }