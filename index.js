function Book(title, author, pages, read) {
	this.title = title;
	this.author = author;
	this.pages = pages;
	this.read = read;
}

//Returns an array of strings to display in each field of a book card
Book.prototype.info = function () {
	return [
		this.title.toString(),
		`by ${this.author}`,
		`${this.pages} pages long`,
		this.read ? 'read' : 'not read yet',
	];
};

//Returns a card element to be added to the DOM
Book.prototype.card = function () {
	const card = document.createElement('div');
	card.classList.add('card');
	this.info().forEach(info => {
		const field = document.createElement('div');
		field.textContent = info;
		card.appendChild(field);
	});
	const removeButton = this.createRemoveButton();
	card.appendChild(removeButton);
	return card;
};

// TODO
Book.prototype.createRemoveButton = function () {
	const removeButton = document.createElement('button');
	removeButton.textContent = 'X';
	return removeButton;
};

//Interface for storing books that automatically adds them to the DOM
function Library(grid, books) {
	this.grid = grid;
	this.children = initArray(grid.children);
	this.books = initArray(books);
}

//Adds book to library and updates the DOM
Library.prototype.push = function (book) {
	if (!(book instanceof Book)) throw "Can't add non Book to library";
	this.books.unshift(book);
	this.update();
};

//Removes book from library and updates the DOM
Library.prototype.remove = function (book) {
	this.books = this.books.filter(elem => elem !== book);
	this.update();
};

//Makes the grid element's children the books' cards + the original elements (this.children)
Library.prototype.update = function () {
	for (card of this.grid.children) card.remove();
	for (book of this.books) this.grid.appendChild(book.card());
	for (child of this.children) this.grid.appendChild(child);
};

//returns a one dimensional array no matter if the argument is undefined, an iterable, or a single element
function initArray(arg) {
	return !arg
		? []
		: typeof arg[Symbol.iterator] === 'function' //is iterable
		? [...arg]
		: [arg];
}

//bring up popup after clicking on the add card
document.querySelector('.add-card').addEventListener(
	'click',
	function () {
		this.classList.add('shown');
	}.bind(document.querySelector('.popup-container'))
);

//hide popup after clicking outside of it
document.querySelector('.popup-container').addEventListener(
	'click',
	function (e) {
		if (e.target !== this) return;
		hidePopup();
	}.bind(document.querySelector('.popup-container'))
);

// add a new book to the library and hide the popup after clicking on the add button on the popup
document.querySelector('.add-button').addEventListener(
	'click',
	function () {
		library.push(
			new Book(
				this.title.value,
				this.author.value,
				this.pages.value,
				this.read.checked
			)
		);
		hidePopup();
	}.bind({
		title: document.getElementById('title'),
		author: document.getElementById('author'),
		pages: document.getElementById('pages'),
		read: document.getElementById('read'),
	})
);

//hide the popup and reset every input in the popup
const hidePopup = function () {
	this.popup.classList.remove('shown');
	this.inputs.title.value = '';
	this.inputs.author.value = '';
	this.inputs.pages.value = '';
	this.inputs.read.checked = false;
}.bind({
	popup: document.querySelector('.popup-container'),
	inputs: {
		title: document.getElementById('title'),
		author: document.getElementById('author'),
		pages: document.getElementById('pages'),
		read: document.getElementById('read'),
	},
});

const library = new Library(document.querySelector('.books-grid'));
