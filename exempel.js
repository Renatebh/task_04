const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");

const path = require("path");

const app = express();
const port = process.env.PORT || 8080;

let active_sessions = [];

app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "something_secret",
    cookie: { maxAge: 60000 },
  })
);

function SessionLookup(current_session) {
  for (var i = active_sessions.length - 1; i >= 0; i--) {
    if (active_sessions[i] == current_session) {
      return true;
    }
  }
  return false;
}

const checkSession = function (req, res, next) {
  const hasValidSession = SessionLookup(req.session.id);
  if (
    req.path == "/" ||
    req.path == "/auth_user" ||
    req.path == "/login" ||
    hasValidSession
  ) {
    next();
  } else {
    res.redirect("/login");
  }
};

app.use(checkSession);

app.get("/", (req, res) => {
  res.send("hello");
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

app.post("/auth_user", (req, res) => {
  console.log(req.body);
  if (req.body.username == "craig" && req.body.password == "test") {
    if (!SessionLookup(req.session.id)) {
      active_sessions.push(req.session.id);
    }

    res.redirect("/main");
  } else {
    res.redirect("/login");
  }

  res.end();
});

app.get("/main", (req, res) => {
  res.write("<h1>MAIN</h1><p>id: " + req.session.id + "</p>");
  res.end();
});

app.get("/account", (req, res) => {
  res.write("<h1>ACCOUNT</h1><p>id: " + req.session.id + "</p>");
  res.end();
});

app.listen(port, () => {
  console.log("Server started on port", port);
});
// res.write(`<h1>Hello ${username}, you can now login</h1>
//     <form action="/main" method="POST">
//       <div>
//         <label for="username">Username</label>
//         <input id="username" type="text" name="username" />
//       </div>
//       <br /><br />
//       <div>
//         <label for="passsword">Password</label>
//         <input type="password" name="password" id="password" />
//       </div>
//       <br /><br />
//       <button type="submit">Submit</button>
//     </form>
// `);
