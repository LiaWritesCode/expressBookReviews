const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;
    const doesExist = (username) => {
        return users.some(user => user.username === username);
      };

    // Are both fields provided?
    if (username && password) {
        // Does the user currently exist?
        if (!doesExist(username)) {
            // Add user to array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(400).json({message: "User already exists!"});
        }
    }
    // Error if anything is missing
    return res.status(409).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({message: "Book not found."});
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const results = [];

    for (let key in books) {
        if (books[key].author === author) {
            results.push(books[key]);
        }
    }

    if (results.length > 0) {
        return res.status(200).json(results);
    } else {
        return res.status(404).json({message: "Author not found."});
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const titleResults = [];

    for (let key in books) {
        if (books[key].title === title) {
            titleResults.push(books[key]);
        }
    }

    if (titleResults.length > 0) {
        return res.status(200).json(titleResults);
    } else {
        return res.status(404).json({message: "Title not found."});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn
  const reviewResults = books[isbn].reviews;

    if (reviewResults) {
        return res.status(200).json(reviewResults);
    } else {
        return res.status(404).json({message: "Review not found."})
    }
});

module.exports.general = public_users;
