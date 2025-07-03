const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    return users.some(user => user.username === username)
};

const authenticatedUser = (username,password)=>{ 
    return users.some(user => user.username === username && user.password === password );
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Is any information missing??
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in!" });
    }

    // Is the user authenticated???
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: "1h" });
        // Store token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("Successfully logged in!");
    } else {
        return res.status(208).json({ message: "Invalid Login. Please check your details." });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session?.authorization?.username;


  if (!username) {
    return res.status(401).json({message: "Error submitting review. Please log in."})
  }
  if (!review) {
    return res.status(400).json({message: "Review cannot be empty."})
  }

  const book = books[isbn];
    if (!book) {
        return res.status(404).json({message: "Book not found."})
    }

    const isUpdate = book.reviews?.[username] !== undefined;
    let message = "";

    // Review object creation if it doesn't exist.
    if (!book.reviews) {
        book.reviews = {};
    }

    book.reviews[username] = review;

    if (isUpdate) {
        message = "Your review has been updated.";
    } else {
        message = "Your review has been added.";
    }
    
    return res.status(200).json({message});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session?.authorization?.username;

    if (!username) {
        return res.status(401).json({message: "Unable to delete. Please login."});
    }

    const book = books[isbn];
    if (!book) {
        return res.status(404).json({message: "Book not found!"});
    }

    if (!book.reviews || !book.reviews[username]) {
        return res.status(403).json({message: "There are no reviews by this user to delete."});
    }

    delete book.reviews[username];
    return res.status(200).json({message: "Review has been successfully deleted."});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
