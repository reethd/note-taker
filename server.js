//Set variables for required packages
const express = require("express");
const fs = require("fs");
const path = require("path");

//Set variable for database file
const database = require("./db/db");

//Set variable for express()
const app = express();

//Set variable for port
const PORT = process.env.PORT || 3001;

//Get access to public folder
app.use(express.static("public"));

//Allow express to interpret json data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Send the html files to their respective routes as a response to client request
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

//GET and POST handlers for the '/api/notes' route. GET request will respond with
//the json data from the database file and POST request will respond with pushing
//a new note to the database array and assigning it a number as an id before then
//rewriting the updated database file.
app
  .route("/api/notes")
  .get((req, res) => {
    res.json(database);
  })
  .post((req, res) => {
    let jsonFilePath = path.join(__dirname, "/db/db.json");
    let newNote = req.body;
    let highestId = 0;

    for (let i = 0; i < database.length; i++) {
      let individualNote = database[i];

      if (individualNote.id > highestId) {
        highestId = individualNote.id;
      }
    }

    newNote.id = highestId + 1;
    database.push(newNote);

    fs.writeFile(jsonFilePath, JSON.stringify(database), (err) => {
      if (err) {
        return console.log(err);
      }
      console.log("Note saved!");
    });
    res.json(newNote);
  });

//DELETE request finds and deletes the note from the database according to
//its id number before rewriting the updated database file.
app.delete("/api/notes/:id", (req, res) => {
  let jsonFilePath = path.join(__dirname, "/db/db.json");
  for (let i = 0; i < database.length; i++) {
    if (database[i].id == req.params.id) {
      database.splice(i, 1);
      break;
    }
  }

  fs.writeFileSync(jsonFilePath, JSON.stringify(database), (err) => {
    if (err) {
      return console.log(err);
    } else {
      console.log("Note deleted!");
    }
  });
  res.json(database);
});

//Opens up server at the provided port
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
