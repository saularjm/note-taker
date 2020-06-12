// Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");

// Sets up the Express App
const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing and link external JS
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));

// Routes
// Get notes HTML
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// Get notes from DB JSON
app.get("/api/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/db/db.json"));
});

// Get index HTML (Homepage)
app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Post new note
app.post("/api/notes", function(req, res) {
    
    // Array of saved notes
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    
    // New note from POST data
    let newNote = req.body;

    // Attach ID to note and push to array
    let uniqueID = (savedNotes.length).toString();
    newNote.id = uniqueID;
    savedNotes.push(newNote);

    // Rewrite DB JSON file with new array and send array to client
    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
    console.log("Note saved to db.json. Content: ", newNote);
    res.json(savedNotes);
})

// Delete specified note
app.delete("/api/notes/:id", function(req, res) {

    // Array of saved notes
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));

    // Variable for specified ID of note to be deleted
    let noteID = req.params.id;

    // Counter for updated array ID
    let newID = 0;
    console.log(`Deleting note with ID ${noteID}`);

    // Create new array with specified note removed
    savedNotes = savedNotes.filter(currNote => {
        return currNote.id != noteID;
    })
    
    // Update ID in array
    for (currNote of savedNotes) {
        currNote.id = newID.toString();
        newID++;
    }

    // Rewrite DB JSON file with new array and send array to client
    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
    res.json(savedNotes);
})

// Starts the server to begin listening
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });