const loginContainer = document.querySelector(".login-container");
const loginMessage = document.querySelector(".login-message");
const loginButton = document.querySelector("#btn-login");
const createUserButton = document.querySelector("#btn-create-user");
const logoutButton = document.querySelector("#btn-logout");
const logoutContainer = document.querySelector(".logout-container");
const boardDropdownContainer = document.querySelector(".board-container");
const notesContainer = document.querySelector(".notes-container");
const notesCenter = document.querySelector(".notes-center");
const boardsDropdown = document.querySelector("#board-dropdown");

import { createUser, logIn, getBoards, getBoardNotes, createNote, updateNote, deleteNote, checkTokenValidity } from './api.js';
import { showLoggedIn, showLoggedOut, displayNote, displayAllNotes, deleteNoteFromUI } from "./UI.js";


/* WebSocket */

let currentSocket = null;
const connectWebsocket = (boardId) => {

    const jwtToken = localStorage.getItem("jwtToken");
    if (!jwtToken) {
        console.error("No JWT token found");
        return;
    }

    if (currentSocket) {
        currentSocket.close();
    }

    // Create a new WebSocket connection
    const socket = new WebSocket(`ws://localhost:5000?boardId=${boardId}&jwtToken=${jwtToken}`);
    currentSocket = socket;  // Assign the new socket to the currentSocket variable

    // Connection established
    socket.onopen = async function (event) {
        console.log("Connected to WebSocket server");
        const notes = await getBoardNotes(boardId, jwtToken);
        if (notes) {
            displayAllNotes(notes);
        }
    };

    // Onmessage tar emot från servern
    socket.onmessage = function (event) {
        // Log the received event and data
        console.log('Received message:', event.data);

        // Parse the incoming message (assumed to be JSON)
        const data = JSON.parse(event.data);

        // Extract type and note data from the message
        const messageType = data.type;
        const note = data.note;

        // Handle different message types
        if (messageType === "create") {
            console.log("A new note has been created:", note);
            displayNote(note); // Display the new note in the UI
        } else if (messageType === "update") {
            console.log("A note has been updated:", note);
            // Update note in the UI
        } else if (messageType === "delete") {
            console.log("A note has been deleted:", note);
            deleteNoteFromUI(note.id);
        }

        // Optionally log the full data
        console.log(data);
    };

    // Connection closed
    socket.onclose = function (event) {
        console.log("Connection closed");
    };

    // Hade ett problem där en ny note blev skapad i alla föregående boards
    // Lösning av ChatGPT, fastnade länge och hittade inte på annat just då
    let createNoteButton = document.querySelector("#btn-create-note");
    const newCreateNoteButton = createNoteButton.cloneNode(true);
    createNoteButton.parentNode.replaceChild(newCreateNoteButton, createNoteButton);

    // currentSocket.send skickar till servern

    const createNoteClickHandler = async () => {
        const response = await createNote(boardId, jwtToken);
        console.log(response.note);
        displayNote(response.note);

        currentSocket.send(JSON.stringify({
            status: 0,
            type: "create",
            note: response.note
        }));
    };

    const deleteNoteClickHandler = async (noteId) => {
        const response = await deleteNote(boardId, noteId, jwtToken); // Call the API to delete the note
        if (response) {
            // Remove note from UI and notify other clients
            deleteNoteFromUI(noteId);

            currentSocket.send(JSON.stringify({
                status: 0,
                type: "delete",
                note: { id: noteId }
            }));
        }
    };

    const updateNoteClickHandler = async () => {
        // delete old note
        //displayNote(response.note)
        currentSocket.send(JSON.stringify({
            status: 0,
            type: "update",
            note: response.note
        }));
    };

    newCreateNoteButton.addEventListener("click", createNoteClickHandler);
    // eventlistener for all notes("click", deleteNoteHandler)
    // eventlistener for all notes("click", updateNoteHandler)

    notesContainer.addEventListener("click", (event) => {
        if (event.target.classList.contains('delete-note-btn')) {
            const noteId = event.target.closest('.note').id; // Get the ID of the note to delete
            deleteNoteClickHandler(noteId); // Call the delete handler
        }
    });
};


/* Event listeners */

createUserButton.addEventListener("click", async () => {
    const user = document.querySelector("#username").value;
    const pass = document.querySelector("#password").value;
    if (!user || user.length < 3) {
        alert("Användarnamn måste vara minst 3 tecken.");
        return;
    }
    if (!pass || pass.length < 5) {
        alert("Lösenord måste vara minst 5 tecken.");
        return;
    }
    try {
        const response = await createUser(user, pass);

        if (response) {
            loginMessage.innerText = "Användare skapad.";
        } else {
            loginMessage.innerText = "Användaren kunde inte skapas. Försök igen.";
        }
    } catch (error) {
        loginMessage.innerText = "Något gick fel. Försök igen.";
        console.error("Error:", error);
    }
});

// Login button event listener
loginButton.addEventListener("click", async () => {
    const user = document.querySelector("#username").value;
    const pass = document.querySelector("#password").value;

    try {
        const response = await logIn(user, pass);
        if (response) {
            const jwtToken = response.jwt;
            localStorage.setItem("jwtToken", jwtToken);
            showLoggedIn();
        } else {
            loginMessage.innerText = "Inloggning misslyckades. Försök igen.";
        }
    } catch (error) {
        loginMessage.innerText = "Något gick fel. Försök igen.";
        console.error("Error:", error);
    }
});

logoutButton.addEventListener("click", () => {
    localStorage.removeItem("jwtToken");
    location.reload();
});

boardsDropdown.addEventListener("change", (event) => {
    let boardId = event.target.value;
    connectWebsocket(boardId);
});


/* On load */

// Check if JWT token is valid every time the page loads
window.onload = async () => {
    const isValid = await checkTokenValidity();
    if (isValid) {
        showLoggedIn();
    } else {
        showLoggedOut();
    }
};
