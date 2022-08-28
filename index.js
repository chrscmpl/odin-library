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
