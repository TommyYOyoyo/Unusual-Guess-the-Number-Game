/* Main JS module for the gameplay handling */

import { handleMute, handleReturnToMain, handleRestart } from "./utils.js";
import { Samurai } from "./classes.js";

// Getting the elements, audios and initializing the variables
const level = localStorage.getItem("selectedLevel");
const title = document.querySelector("#title");
const muteButton = document.querySelector("#mute");
const returnToMainButton = document.querySelector("#returnToMainMenu");
const restartButton = document.querySelector("#restart");
const subtitle = document.querySelector("#subtitle");
const triesIndicator = document.querySelector("#triesIndicator");
const form = document.querySelector(".form");
const transcripts = document.querySelector(".transcripts");
const transcript = document.querySelector("#transcript");
const canvas = document.getElementById("canvas");
const healthBar = document.querySelector("#healthbar");
const healthValue = document.querySelector("#healthValue");
const ctx = canvas.getContext("2d"); // Canvas render context = 2D
canvas.width = 450;
canvas.height = 680;
const bestResultCount = document.querySelector("#bestCount");
const previousRecord = localStorage.getItem(`l${level}_bestCount`);
// If previous tries record isn't found, display a dash, otherwise, display previous record
previousRecord == null
    ? (bestResultCount.innerHTML = "Least tries: -")
    : (bestResultCount.innerHTML = `Least tries: ${localStorage.getItem(
          `l${level}_bestCount`
      )}`);
const victorySound = new Audio("../assets/sounds/win.mp3");
const gameOverSound = new Audio("../assets/sounds/game-over.mp3");
let answer;
let maxTries = 5;
let currentTries = 1;
let paused = false;
let music;
let number;

// Determine the range of numbers based on the level
// and generate the number.
// Also updates the contents of the page (images, audio...) according to the level.
switch (parseInt(level)) {
    case 1:
        number = Math.floor(Math.random() * 10) + 1;

        // Changing background image
        document.querySelector(".lvls").style.backgroundImage =
            'url("../assets/images/l1.webp")';

        // Changing audio
        music = new Audio("../assets/sounds/homeSweetHome.mp3");
        console.log(
            "Now playing: from Soul Knight by Chilly Room - Home Sweet Home"
        );

        // Changing title
        title.innerHTML = "Level 1";

        // Changing subtitle
        subtitle.innerHTML = "Guess a number between 1 and 10";

        // Changing tries indicator
        maxTries = 5;
        triesIndicator.innerHTML = "You have 5 tries in total.";

        break;
    case 2:
        number = Math.floor(Math.random() * 25) + 1;

        // Changing background image
        document.querySelector(".lvls").style.backgroundImage =
            'url("../assets/images/l2.webp")';

        // Changing audio
        music = new Audio("../assets/sounds/bigBigWorld.mp3");
        console.log(
            "Now playing: from Soul Knight by Chilly Room - Big Big World"
        );

        // Changing title
        title.innerHTML = "Level 2";

        // Changing subtitle
        subtitle.innerHTML = "Guess a number between 1 and 25";

        // Changing tries indicator
        maxTries = 5;
        triesIndicator.innerHTML = "You have 5 tries in total.";

        break;
    case 3:
        number = Math.floor(Math.random() * 50) + 1;

        // Changing background image
        document.querySelector(".lvls").style.backgroundImage =
            'url("../assets/images/l3.webp")';

        // Changing audio
        music = new Audio("../assets/sounds/tillTheEndOfDawn.mp3");
        console.log(
            "Now playing: from Soul Knight by Chilly Room - Till The End Of Dawn"
        );

        // Changing title
        title.innerHTML = "Level 3";

        // Changing subtitle
        subtitle.innerHTML = "Guess a number between 1 and 50";

        // Changing tries indicator
        maxTries = 10;
        triesIndicator.innerHTML = "You have 10 tries in total.";

        break;
    case 4:
        number = Math.floor(Math.random() * 100) + 1;

        // Changing background image
        document.querySelector(".lvls").style.backgroundImage =
            'url("../assets/images/l4.png")';

        // Changing audio
        music = new Audio("../assets/sounds/bewareOfFalling.mp3");
        console.log(
            "Now playing: from Soul Knight by Chilly Room - Beware Of Falling"
        );

        // Changing title
        title.innerHTML = "Level 4";

        // Changing subtitle
        subtitle.innerHTML = "Guess a number between 1 and 100";

        // Changing tries indicator
        maxTries = 10;
        triesIndicator.innerHTML = "You have 10 tries in total.";

        break;
    case 5:
        number = Math.floor(Math.random() * 1000) - 499;

        // Changing background image
        document.querySelector(".lvls").style.backgroundImage =
            'url("../assets/images/l5.png")';

        // Changing audio
        music = new Audio("../assets/sounds/Rival.mp3");
        console.log("Now playing: from Soul Knight by Chilly Room - Rival");

        // Changing title
        title.innerHTML = "Level 5";

        // Changing subtitle
        subtitle.innerHTML = "Guess a number between -500 and 500";

        // Changing tries indicator
        maxTries = 20;
        triesIndicator.innerHTML = "You have 20 tries in total.";

        break;
}

// Play the right music
music.loop = true;
music.play();

console.log(`Level: ${level}, Correct number: ${number}`);

// Extra buttons handler
handleMute(muteButton, music, paused);
handleReturnToMain(returnToMainButton);
handleRestart(restartButton);

// Initialize a new player character spritesheet
const player = new Samurai({
    x: canvas.width / 2,
    y: canvas.height / 2 + 50,
    canvasWidth: canvas.width,
    canvasHeight: canvas.height,
    scale: 6,
});

// Trigger spritesheet
animate();

// MAIN ANSWER HANDLING SECTION IS BELOW.
// Form on submit
form.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent page reloading

    // User under tries limit
    if (currentTries <= maxTries) {
        // Increase tries count
        currentTries++;

        // Get answer -> from string to int
        answer = parseInt(document.querySelector("#answer").value);

        // If player didn't answer a number, it still counts as a try...
        if (!Number.isInteger(answer)) {
            updateHealth(100 - ((currentTries - 1) / maxTries) * 100);
            transcript.innerHTML += "That was not a number... <br>";
            console.log(
                `Current health: ${
                    100 - ((currentTries - 1) / maxTries) * 100
                }%, try #${currentTries - 1}`
            );
            // User has reached max limit of tries
            if (currentTries > maxTries) {
                transcript.innerHTML +=
                    "You've reached the max number of tries. Game over <br>";
                gameOver(number);
            }
        }

        // User answer is too small
        if (answer < number) {
            console.log(`User answer: ${answer}, too low.`);
            transcript.innerHTML += `You guessed ${answer}, too low.<br>`;

            // Update health
            updateHealth(100 - ((currentTries - 1) / maxTries) * 100);
            console.log(
                `Current health: ${
                    100 - ((currentTries - 1) / maxTries) * 100
                }%, try #${currentTries - 1}`
            );

            // User has reached max limit of tries
            if (currentTries > maxTries) {
                transcript.innerHTML +=
                    "You've reached the max number of tries. Game over <br>";
                gameOver(number);
            }
            // User answer is too big
        } else if (answer > number) {
            console.log(`User answer: ${answer}, too high.`);
            transcript.innerHTML += `You guessed ${answer}, too high.<br>`;

            // Update health
            updateHealth(100 - ((currentTries - 1) / maxTries) * 100);
            console.log(
                `Current health: ${
                    100 - ((currentTries - 1) / maxTries) * 100
                }%, try #${currentTries - 1}`
            );

            // User has reached max limit of tries
            if (currentTries > maxTries) {
                transcript.innerHTML +=
                    "You've reached the max number of tries. Game over <br>";
                gameOver(number);
            }

            // User answer is correct
        } else if (answer == number) {
            console.log(
                `Correct answer, congrats. I hope you didn't cheat by opening inspect.`
            );
            bestCountUpdater(currentTries, level); // Update the best count if necessary
            win(currentTries - 1); // Handle win
        }
    } else {
        transcript.innerHTML +=
            "You've reached the max number of tries. Game over <br>";
    }
});

// Win function (display congratulations message)
function win(tries) {
    music.pause();
    victorySound.play(); // Victory sound effect
    // Victory text
    canvas.style.display = "none";
    healthBar.style.display = "none";
    healthValue.style.display = "none";
    form.style.display = "none";
    transcripts.style.display = "none";
    title.innerHTML = `You win! Congratulations! <br> Tries: ${tries}`;
}

// Lose function
function gameOver(correctNumber) {
    // Switch to player death spritesheet
    player.switchState(3);

    setTimeout(() => {
        music.pause();
        gameOverSound.play(); // Game over sound effect
        // Game over text
        canvas.style.display = "none";
        healthBar.style.display = "none";
        healthValue.style.display = "none";
        form.style.display = "none";
        transcripts.style.display = "none";
        title.style.color = "rgb(255, 66, 66)";
        title.innerHTML = `Game Over! <br> Correct number: ${correctNumber}`;
        // Enable player death
    }, 1000);
}

// Best count updater
function bestCountUpdater(currentCount, level) {
    // Retrieve previous best try
    const best = localStorage.getItem(`l${level}_bestCount`);

    // No previous record: set the current record as best try
    if (best == null) {
        localStorage.setItem(`l${level}_bestCount`, currentCount - 1);
        bestResultCount.innerHTML = `Least tries: ${currentCount - 1}`;
        // Current record is better, set current record as best count
    } else if (currentCount - 1 < best) {
        localStorage.setItem(`l${level}_bestCount`, currentCount);
        bestResultCount.innerHTML = `Least tries: ${currentCount - 1}`;
    }
}

// Animate frames of the player
function animate() {
    window.requestAnimationFrame(animate); // Infinite animating loop
    // Clear previous frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Update player
    player.update(ctx);
}

// Function to update healthbar and trigger player hurt animation
function updateHealth(newHealth) {
    player.switchState(2); // Switch player's spritesheet to hurt
    healthBar.value = newHealth;
    healthValue.innerHTML = `${newHealth}%`;
}
