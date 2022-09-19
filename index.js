// const morgan = require("morgan");
// const session = require("express-session")

const cookieParser = require("cookie-parser");
const express = require("express");
const hostname = "localhost";
const port = process.env.PORT || 8080;
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const { start } = require("repl");
const fs = require("fs");

app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public/style.css")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/login", (req, res) => {
  console.log(req.body);
  res.cookie("username", req.body.usernameInput, { maxAge: 60000 });
  res.cookie("password", req.body.passwordInput, { maxAge: 60000 });
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

app.post("/auth_req", (req, res) => {
  if (
    req.body.username === req.cookies.username &&
    req.body.password === req.cookies.password
  ) {
    res.redirect("/main");
  } else {
    res.redirect("/wrong");
  }
});

app.get("/wrong", (req, res) => {
  res.sendFile(path.join(__dirname, "wrong.html"));
});

app.get("/main", (req, res) => {
  if (req.cookies.username && req.cookies.password) {
    // res.sendFile(path.join(__dirname, "main.html"));

    res.write(`<h1>${req.cookies.username}, you are logged in!</h1>
    <div class="card">
    <img src=""/>
    <h2>${req.cookies.username}</h2>
    </div>
     <button type="button" onclick="location.href = '/editUser'">
     Change Username and Password</button>
`);
    res.end();
  } else {
    res.redirect("/");
  }
});

app.get("/editUser", (req, res) => {
  res.sendFile(path.join(__dirname, "editUser.html"));
});

app.post("/main", (req, res) => {
  res.clearCookie("username", [req.cookies.username]);
  res.clearCookie("password", [req.cookies.password]);
  res.cookie("username", req.body.newUsername, { maxAge: 60000 });
  res.cookie("password", req.body.newPassword, { maxAge: 60000 });
  res.redirect("/main");
});

app.listen(port, hostname, () => {
  console.log(`server is running at http://${hostname}:${port}`);
});
