init();

function Book(title, author, pages, read) {
	this.title = title;
	this.author = author;
	this.pages = pages;
	this.read = read;
}

//Returns an array of properties to display in each field of a book card
Book.prototype.info = function () {
	let info = [];
	for (prop in this)
		if (this.hasOwnProperty(prop)) info.push({ key: prop, value: this[prop] });
	return info;
};

//Returns a card element to be added to the DOM
Book.prototype.card = function () {
	const card = document.createElement('div');
	card.classList.add('card');
	this.info().forEach(info => card.appendChild(this.createField(info)));
	card.appendChild(this.createRemoveButton());
	return card;
};

Book.prototype.createField = function (info) {
	let field;
	if (info.key !== 'read') {
		field = document.createElement('div');
		field.textContent = info.value;
	} else field = this.createReadField(info);
	field.classList.add(`${info.key}-field`);
	return field;
};

Book.prototype.createReadField = function (info) {
	const field = document.createElement('button');
	field.setAttribute('type', 'button');
	field.textContent = this[info.key] ? 'Read' : 'Not read yet';
	field.classList.add(this[info.key] ? 'read' : 'not-read');
	field.addEventListener('click', this.toggleRead.bind(this));
	return field;
};

//returns a button element to attach to the card
Book.prototype.createRemoveButton = function () {
	const removeButton = document.createElement('button');
	removeButton.classList.add('remove-button');
	removeButton.textContent = 'Remove';
	removeButton.addEventListener('click', this.remove.bind(this));
	return removeButton;
};

Book.prototype.remove = function () {
	library.remove(this);
};

Book.prototype.toggleRead = function () {
	library.toggleRead(this);
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

Library.prototype.toggleRead = function (book) {
	this.books = this.books.map(elem => {
		if (elem === book) elem.read = !elem.read;
		return elem;
	});
	this.update();
};

//Makes the grid element's children the books' cards + the original elements (this.children)
Library.prototype.update = function () {
	[...this.grid.children].forEach(card => card.remove());
	// for (card of this.grid.children) card.remove();
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

function init() {
	const library = new Library(document.querySelector('.books-grid'));
	this.library = library;

	const cardAdd = document.querySelector('.add-card');
	const ButtonAdd = document.querySelector('.add-button');
	const popup = document.querySelector('.popup-container');
	const inputs = {
		title: document.getElementById('title'),
		author: document.getElementById('author'),
		pages: document.getElementById('pages'),
		read: document.getElementById('read'),
	};

	//bring up popup after clicking on the add card
	cardAdd.addEventListener('click', function () {
		popup.classList.add('shown');
	});

	//hide popup after clicking outside of it
	popup.addEventListener('click', function (e) {
		if (e.target !== this) return;
		hidePopup();
	});

	// add a new book to the library and hide the popup after clicking on the add button on the popup
	ButtonAdd.addEventListener('click', function () {
		if (isEmpty(inputs.title.value) || isEmpty(inputs.author.value)) return;
		library.push(
			new Book(
				inputs.title.value,
				inputs.author.value,
				inputs.pages.value,
				inputs.read.checked
			)
		);
		hidePopup();
	});

	//hide the popup and reset every input in the popup
	const hidePopup = function () {
		popup.classList.remove('shown');
		inputs.title.value = '';
		inputs.author.value = '';
		inputs.pages.value = '';
		inputs.read.checked = false;
	};
}

function isEmpty(str) {
	return str ? !str.trim().length : !str;
}
