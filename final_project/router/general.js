const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


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

const fetchBooks = async () => {
    try {
        const response = await axios.get('https://liaramosdev-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/');
        console.log("Books in the shop:");
        console.log(response.data);
    } catch (error) {
        console.error("Failure to fetch books:", error.message);
    }
};

fetchBooks();

// Get book details based on ISBN
const isbn = '3';
const apiUrl = `https://liaramosdev-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/isbn/${isbn}`;

axios.get(apiUrl)
    .then((response) => {
        console.log(`Book details for ISBN ${isbn}:`);
        console.log(response.data);
    })
    .catch((error) => {
        console.error(`Error fetching book with the ISBN ${isbn}`);
    });

  
// Get book details based on Author via promises
const author = 'Unknown';
const authorUrl = `https://liaramosdev-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/author/${author}`;

axios.get(authorUrl)
    .then((response) => {
        console.log(`Book(s) written by ${author}:`);
        console.log(response.data);
    })
    .catch((error) => {
        console.error(`Error fetching book(s) written by ${author}`);
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

    const fetchBookByTitle = async (title) => {
        try {
            // Encoding because of spaces in titles and all that.
            const encodedTitle = encodeURIComponent(title);
            const url = `https://liaramosdev-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/title/${encodedTitle}`;

            const response = await axios.get(url);
            console.log(`Book titled "${title}":`);
            console.log(response.data);
        } catch (error) {
            console.error(`Failed to fetch the book "${title}": `, error.message);
        }
    };

    // Getting book by title
    fetchBookByTitle('The Book Of Job');

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
