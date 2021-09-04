// Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");

// Housekeeping, setup express server, set port number
const PORT = process.env.PORT || 4002;
const app = express();

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// HTML routes using path and express
app.get("/notes", (req, res) =>
    res.sendFile(path.join(__dirname, "public/notes.html"))
);

app.get("/", (req, res) =>
    res.sendFile(path.join(__dirname, "public/index.html"))
);

// API (/api/notes) GET DELETE and POST routes
app.get("/api/notes", (req, res) => {
    fs.readFile("public/db/db.json", function (err, data) {
        if (err) throw err;
        const notes = JSON.parse(data);
        res.json(notes);
    });
});

app.post("/api/notes", (req, res) => {
    newNote = req.body;
    newNote.id = uuidv4();

    let notes = fs.readFileSync("public/db/db.json");
  
    notes = JSON.parse(notes);
    notes.push(newNote);
  
    fs.writeFile("public/db/db.json", JSON.stringify(notes), function (err) {
        if (err) throw err;
    });
    
    res.json(notes);
});

app.delete("/api/notes/:id", (req, res) => {
    let notes = fs.readFileSync("public/db/db.json");
    notes = JSON.parse(notes);
    notes.splice(req.params.id, 1);
    fs.writeFile("public/db/db.json", JSON.stringify(notes), function (err) {
        if (err) throw err;
    });
    res.json(notes);
});

// Express event handler
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});