const loginContainer = document.querySelector(".login-container");
const logoutContainer = document.querySelector(".logout-container");
const boardDropdownContainer = document.querySelector(".board-container");
const notesContainer = document.querySelector(".notes-container");
const notesCenter = document.querySelector(".notes-center");
const boardsDropdown = document.querySelector("#board-dropdown");

import { getBoards } from "./api.js";

/* UI functions */

// Function to hide login and show page content instead
export const showLoggedIn = () => {
    loginContainer.style.display = "none";
    logoutContainer.style.display = "block";
    boardDropdownContainer.style.display = "flex";
    notesCenter.style.display = "grid";
    displayBoardDropdown();
};

// Function to hide page content and show login instead
export const showLoggedOut = () => {
    loginContainer.style.display = "flex";
    logoutContainer.style.display = "none";
    boardDropdownContainer.style.display = "none";
    notesCenter.style.display = "none";
};

export const displayBoardDropdown = async () => {
    const jwtToken = localStorage.getItem("jwtToken");
    const boards = await getBoards(jwtToken);

    boardsDropdown.innerHTML = '<option value="" disabled selected>Select a board</option>';
    // Loop through respData and fill boardsDropdown with boards
    for (let i = 0; i < boards.length; i++) {
        const option = document.createElement("option");
        option.value = boards[i].id;
        option.textContent = boards[i].title;
        boardsDropdown.appendChild(option);
    }
};

// Matade in min html i chatGPT
export const displayNote = (note) => {
    // id finns i note.id
    // innehåll finns i note.content
    // position finns i note.position
    // färg finns i note.color
    const noteDiv = document.createElement("div");
    noteDiv.id = note.id;
    noteDiv.classList.add("note");
    const btnContainerDiv = document.createElement("div");
    btnContainerDiv.classList.add("note-btn-container");
    const greyNoteBtn = document.createElement("button");
    greyNoteBtn.classList.add("note-btn", "grey-note-btn");
    const greenNoteBtn = document.createElement("button");
    greenNoteBtn.classList.add("note-btn", "green-note-btn");
    const deleteNoteBtn = document.createElement("button");
    deleteNoteBtn.classList.add("note-btn", "delete-note-btn");
    const buttonGroupDiv = document.createElement("div");
    buttonGroupDiv.appendChild(greyNoteBtn);
    buttonGroupDiv.appendChild(greenNoteBtn);
    btnContainerDiv.appendChild(buttonGroupDiv);
    btnContainerDiv.appendChild(deleteNoteBtn);
    const contentDiv = document.createElement("div");
    contentDiv.classList.add("note-content");
    const textarea = document.createElement("textarea");
    textarea.classList.add("note-input");
    textarea.value = note.content;
    contentDiv.appendChild(textarea);
    noteDiv.appendChild(btnContainerDiv);
    noteDiv.appendChild(contentDiv);
    notesContainer.appendChild(noteDiv);
};

export const displayAllNotes = (notes) => {
    notesContainer.innerText = "";
    notes.forEach(note => {
        displayNote(note);
    });
};

// Function to remove the note from the UI
export const deleteNoteFromUI = (noteId) => {
    const noteElement = document.getElementById(noteId);
    if (noteElement) {
        noteElement.remove(); // Remove note element from the DOM
    }
};
