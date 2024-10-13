// This is replaced when deploying
const API_URL = "http://localhost:8080";
// const WS_URL = `ws://localhost:5000?token=${WS_TOKEN}`

// Create user
export async function createUser(user, pass) {
    const response = await fetch(`${API_URL}/users/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "name": user.toLowerCase(),
            "password": pass
        })
    });

    if (!response.ok) {
        console.error("Failed to create user!", response.status);
        return;
    }

    const respData = await response.json();
    return respData;
}

// Log in
// Checks JWT and saves it in Local Storage
export async function logIn(user, pass) {
    const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "name": user.toLowerCase(),
            "password": pass
        })
    });

    if (!response.ok) {
        console.error("Failed to login!", response.status);
        return;
    }

    const respData = await response.json();
    return respData;
}

// Get boards for the user
export async function getBoards(jwtToken) {
    const response = await fetch(`${API_URL}/boards`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwtToken}`
        }
    });

    if (!response.ok) {
        console.error("Failed to fetch boards:", response.status);
        return;
    }

    const respData = await response.json();
    return respData;
}

// Get all notes for a specific board
export async function getBoardNotes(boardId, jwtToken) {
    const response = await fetch(`${API_URL}/notes/${boardId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwtToken}`
        }
    });

    if (!response.ok) {
        console.error("Failed to fetch notes:", response.status);
        return;
    }

    const respData = await response.json();
    return respData;
}

// Create note
export async function createNote(boardId, jwtToken) {
    const response = await fetch(`${API_URL}/notes/${boardId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwtToken}`
        },
        body: JSON.stringify({
            content: "",
            position: "{x: 10, y: 10}",
            color: "white"
        })
    });

    if (!response.ok) {
        console.error("Failed to create note:", response.status);
        return;
    }

    const respData = await response.json();
    return respData;
}

// Update note
export async function updateNote(boardId, noteId, jwtToken, updatedContent, updatedPosition, updatedColor) {
    const response = await fetch(`${API_URL}/notes/${boardId}/${noteId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwtToken}`
        },
        body: JSON.stringify({
            content: updatedContent,  // Update the content of the note
            position: updatedPosition, // Update the position (can be x, y coordinates)
            color: updatedColor        // Update the note's color
        })
    });

    if (!response.ok) {
        console.error("Failed to update note:", response.status);
        return;
    }

    const respData = await response.json();
    return respData;
}

// Delete note
export async function deleteNote(boardId, noteId, jwtToken) {
    const response = await fetch(`${API_URL}/notes/${boardId}/${noteId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwtToken}`
        }
    });

    if (!response.ok) {
        console.error('Failed to delete note:', response.status);
        return;
    }
    const respData = await response.json();
    return respData;
}

// Check if the token in Local Storage is valid
export async function checkTokenValidity() {
    const jwtToken = localStorage.getItem("jwtToken");
    if (!jwtToken) {
        return false;
    }

    const response = await fetch(`${API_URL}/users/verify-token`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${jwtToken}`
        }
    });

    if (response.ok) {
        const data = await response.json();
        getBoards(jwtToken);
        return true; // Valid token
    } else {
        console.error("Invalid token!");
        localStorage.removeItem("jwtToken"); // Remove invalid token
        return false; // Invalid token
    }
}
