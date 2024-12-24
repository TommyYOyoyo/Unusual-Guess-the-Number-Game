/* Utilities for all files */

export { handleMute, handleReturnToMain, handleRestart };

// Handle mute button
function handleMute(muteButton, music, paused) {
    // Mute button onclick -> pause music, reset to 0 and set paused to true.
    // Otherwise, play music and set paused to false
    muteButton.addEventListener("click", () => {
        if (paused) {
            music.play();
            muteButton.style.filter = "invert(100%)";
            paused = false;
            console.log("Music resumed");
        } else {
            music.pause();
            music.currentTime = 0;
            muteButton.style.filter = "invert(50%)";
            paused = true;
            console.log("Music stopped");
        }
    });
}

// Handling the "return to main menu" button
function handleReturnToMain(btn) {
    btn.addEventListener("click", () => {
        window.location.href = "../html/homepage.html"; // Return to main menu
    });
}

// Handling the "restart" button
function handleRestart(btn) {
    btn.addEventListener("click", () => {
        window.location.reload();   // Restart level
    });
}
