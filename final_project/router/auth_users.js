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
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
