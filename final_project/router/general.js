const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Unable to register user" });
  }

  if (!isValid(username)) {
    return res.status(404).json({ message: "User already exists!" });
  }

  users.push({ username: username, password: password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Task 1 - Get all books
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 2 - Get book by ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn]);
});

// Task 3 - Get books by author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let filteredBooks = {};

  Object.keys(books).forEach((key) => {
    if (books[key].author === author) {
      filteredBooks[key] = books[key];
    }
  });

  return res.status(200).json(filteredBooks);
});

// Task 4 - Get books by title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let filteredBooks = {};

  Object.keys(books).forEach((key) => {
    if (books[key].title === title) {
      filteredBooks[key] = books[key];
    }
  });

  return res.status(200).json(filteredBooks);
});

// Task 5 - Get book reviews
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn].reviews);
});

// Task 10 - Get all books using async/await with axios
public_users.get('/asyncbooks', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Task 11 - Get book by ISBN using Promises with axios
public_users.get('/promise/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then((response) => {
      return res.status(200).json(response.data);
    })
    .catch((error) => {
      return res.status(500).json({ message: "Error fetching book by ISBN" });
    });
});

// Task 12 - Get books by author using async/await with axios
public_users.get('/async/author/:author', async function (req, res) {
  const author = req.params.author;

  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by author" });
  }
});

// Task 13 - Get books by title using Promises with axios
public_users.get('/promise/title/:title', function (req, res) {
  const title = req.params.title;

  axios.get(`http://localhost:5000/title/${title}`)
    .then((response) => {
      return res.status(200).json(response.data);
    })
    .catch((error) => {
      return res.status(500).json({ message: "Error fetching books by title" });
    });
});

module.exports.general = public_users;
