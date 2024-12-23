// JS module handling elements from the home page only

import { handleMute } from "./utils.js";

// Grab the elements
const muteButton = document.querySelector("#mute");
const lobbyMusic = new Audio("../assets/sounds/multiplayerLobby.mp3");
let paused = false;

let level = 1;

// Enable loop and autoplay
lobbyMusic.loop = true;
lobbyMusic.play();
console.log("Now playing: from Soul Knight by Chilly Room - Default Multiplayer Lobby Music");

// Level selector handling and send level number to game.js by exporting
document.querySelector(".levels").addEventListener("click", (e) => {
    // Only if button is clicked
    if (e.target.tagName === "BUTTON") {
        // Level grabber
        level = e.target.id[3]; // Level = selected level
        window.location.href = "../html/lvls.html"; // Redirect to game page
        // Set the level in local storage to be used in game.js
        localStorage.setItem("selectedLevel", level); 
    }
});

// Mute button handling
handleMute(muteButton, lobbyMusic, paused);
