const loginContainer = document.querySelector(".login-container");
const logoutContainer = document.querySelector(".logout-container");
const boardDropdownContainer = document.querySelector(".board-container");
const notesContainer = document.querySelector(".notes-container");
const notesCenter = document.querySelector(".notes-center");
const boardsDropdown = document.querySelector("#board-dropdown");

import { getBoards } from "./api.js";

/* UI functions */

// Visa logged in vy
export const showLoggedIn = () => {
    loginContainer.style.display = "none";
    logoutContainer.style.display = "block";
    boardDropdownContainer.style.display = "flex";
    notesCenter.style.display = "grid";
    displayBoardDropdown();
};

// Visa logged out vy
export const showLoggedOut = () => {
    loginContainer.style.display = "flex";
    logoutContainer.style.display = "none";
    boardDropdownContainer.style.display = "none";
    notesCenter.style.display = "none";
};

// Visa board dropdown
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

// Visa en note
export const displayNote = (note) => {
    const noteHTML = `
        <div id="${note.id}" class="note ${note.color}" style="transform: translate(${note.positionX}px, ${note.positionY}px); cursor: move;" data-x="${note.positionX}" data-y="${note.positionY}">
            <div class="button-container">
                <button class="note-btn orange-note-btn"></button>
                <button class="note-btn green-note-btn"></button>
                <button class="note-btn delete-note-btn"></button>
            </div>
            <textarea class="note-input" placeholder="Skriv note här...">${note.content || ''}</textarea>
        </div>
    `;
    notesContainer.innerHTML += noteHTML;
};

// Visa alla notes
export const displayAllNotes = (notes) => {
    notesContainer.innerText = "";
    notes.forEach(note => {
        displayNote(note);
    });
};

// Ta bort note från skärmen
export const deleteNoteFromUI = (noteId) => {
    const noteElement = document.getElementById(noteId);
    if (noteElement) {
        noteElement.remove();
    }
};
