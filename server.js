const express = require("express");
const fs = require("fs");
const path = require("path");
const database = require("./db/db");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static("public"));

app.use(express.urlencoded({ extemded: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

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

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
