function Book(title, author, pages, read) {
	this.title = title;
	this.author = author;
	this.pages = pages;
	this.read = read;
}

//returns an array of strings to display in each field of a book card
Book.prototype.info = function () {
	return [
		this.title.toString(),
		`by ${this.author}`,
		`${this.pages} pages long`,
		this.read ? 'read' : 'not read yet',
	];
};

Book.prototype.card = function () {
	const card = document.createElement('div');
	card.classList.add('card');
	this.info().forEach(info => {
		const field = document.createElement('div');
		field.textContent = info;
		card.appendChild(field);
	});
	return card;
};

function Library(grid, blacklist, cards) {
	this.grid = grid;
	this.blacklist = initArray(blacklist);
	this.cards = initArray(cards);
}

Library.prototype.push = function (card) {
	if (!(card instanceof HTMLElement))
		throw "Can't add non HTML Elements to library";
	this.cards.unshift(card);
	this.update();
};

Library.prototype.remove = function (card) {
	this.cards = this.cards.filter(elem => elem !== card);
	this.update();
};

Library.prototype.update = function () {
	for (card of this.grid.children) card.remove();
	for (card of this.cards) this.grid.appendChild(card);
	for (blacklisted of this.blacklist) this.grid.appendChild(blacklisted);
};

//returns a one dimensional array no matter if the argument is undefined, an array, or a single element
function initArray(arg) {
	return !arg
		? []
		: typeof arg[Symbol.iterator] === 'function' //is iterable
		? [...arg]
		: [arg];
}

document.querySelector('.add-card').addEventListener(
	'click',
	function () {
		this.classList.add('shown');
	}.bind(document.querySelector('.popup-container'))
);

document.querySelector('.popup-container').addEventListener(
	'click',
	function (e) {
		if (e.target !== this) return;
		this.classList.remove('shown');
	}.bind(document.querySelector('.popup-container'))
);

const library = new Library(
	document.querySelector('.books-grid'),
	document.querySelector('.add-card')
);
