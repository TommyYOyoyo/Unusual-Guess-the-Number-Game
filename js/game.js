/* Main JS module for the gameplay handling */

import { handleMute, handleReturnToMain, handleRestart } from "./utils.js";
import { Samurai, Boss } from "./classes.js";

// Initializing the elements, audios and declaring the variables
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
const healthContainer = document.querySelector(".healthBarContainer");
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
const hurtSound = new Audio("../assets/sounds/Oof.mp3");
const footstepSound = new Audio("../assets/sounds/footsteps.mp3");
const laughSound = new Audio("../assets/sounds/laugh.mp3");
const explosionSound = new Audio("../assets/sounds/explosion.mp3");
let boss; // Pre-declare boss as a global var to be able to access it after
let answer;
let maxTries = 5;
let currentTries = 1;
let paused = false;
let isBossfight = false;
let music;
let number;

// Determine the range of numbers based on the level
// and generate the number.
// Also updates the contents of the page (images, audio...) according to the level.
switch (parseInt(level)) {
    // Level 1
    case 1:
        isBossfight = false;

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
    // Level 2
    case 2:
        isBossfight = false;

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
    // Level 3
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
    // Level 4
    case 4:
        isBossfight = false;

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
    // Level 5
    case 5:
        isBossfight = true;

        number = Math.floor(Math.random() * 1000) - 499;

        // Changing background image
        document.querySelector(".lvls").style.backgroundImage =
            'url("../assets/images/l5.png")';

        // Changing audio
        music = new Audio("../assets/sounds/Rival.mp3");
        console.log("To be played: from Soul Knight by Chilly Room - Rival");

        // Changing title
        title.innerHTML = "Level 5";

        // Changing subtitle
        subtitle.innerHTML = "Guess a number between -500 and 500";

        // Changing tries indicator
        maxTries = 20;
        triesIndicator.innerHTML = "You have about 20 tries in total.";

        break;
}

// Display current level and the right answer
console.log(`Level: ${level}, Correct number: ${number}`);

// Handling the extra buttons
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

// Play the right music
music.loop = true;
music.play();

// Determine the correct animation function (bossfight or no)
if (!isBossfight) animate();
else bossFight();

// ================ MAIN ANSWER HANDLING SECTION IS BELOW. =================
// Form on submit
form.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent page reloading

    // Increase tries count
    currentTries++;

    // Get answer -> from string to int
    answer = parseInt(document.querySelector("#answer").value);

    // If player didn't answer a number, it still counts as a try...
    if (!Number.isInteger(answer)) {
        transcript.innerHTML += "That was not a number... <br>";

        takeHit(currentTries, maxTries); // Player takes a hit

        if (isBossfight) boss.switchState(3); // If bossfight, boss takes "hit" animation
    }

    // User answer is too small
    if (answer < number) {
        console.log(`User answer: ${answer}, too low.`);
        transcript.innerHTML += `You guessed ${answer}, too low.<br>`;

        takeHit(currentTries, maxTries); // Player takes a hit

        if (isBossfight) boss.switchState(3); // If bossfight, boss takes "hit" animation

    // User answer is too big
    } else if (answer > number) {
        console.log(`User answer: ${answer}, too high.`);
        transcript.innerHTML += `You guessed ${answer}, too high.<br>`;

        takeHit(currentTries, maxTries); // Player takes a hit

        if (isBossfight) boss.switchState(3); // If bossfight, boss takes "hit" animation

    // User answer is correct
    } else if (answer == number) {
        console.log(
            `Correct answer, congrats. I hope you didn't cheat by opening inspect.`
        );

        bestCountUpdater(currentTries, level); // Update the best count if necessary

        // If gamemode = bossfight
        if (isBossfight) {
            // Boss dies and the animation is shown before victory text displays, along with explosion sound
            explosionSound.play();
            boss.switchState(4);
            boss.dead = true;
            setTimeout(() => {
                win(currentTries - 1); // Handle win after one second of boss death animation
            }, 1000);
        } else {
            win(currentTries - 1); // Handle win
        }
    }
    // If player dies
    if (player.hp <= 0) {
        transcript.innerHTML += "You died. Game over.";
        gameOver(number);
    }
});

// Win function (display congratulations message)
function win(tries) {
    // If current gamemode is bossfight, re-center the title
    if (isBossfight) {
        title.style.animation = "reverseTitleRoll 1s linear forwards";
    }

    music.pause();       // Pause current music to hear the victory sound effect
    victorySound.play(); // Victory sound effect
    // Victory text displays, all others are hidden
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
        // If current gamemode is bossfight, re-center the title
        if (isBossfight) {
            title.style.animation = "reverseTitleRoll 1s linear forwards";
        }

        music.pause();        // Pause current music to hear sound effect
        gameOverSound.play(); // Game over sound effect
        // Game over text displays, all others are hidden
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

// Function animating frames of the player
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
    hurtSound.play(); // Play hurt sound
    healthBar.value = newHealth;
    healthValue.innerHTML = `${newHealth}%`;
}

/* ==================== THE FOLLOWING PART IS ONLY FOR BOSS FIGHT LEVEL, LVL 5 ================= */
// Function animating the boss fight
function bossFightAnimation(boss) {
    window.requestAnimationFrame(() => {
        bossFightAnimation(boss);
    }); // Infinite animating loop, with wrapper here to pass the arg "boss"

    // Clear previous frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update player and boss
    player.update(ctx);
    boss.update(ctx);
}

// LVL5 Boss fight entrance cutscene + fight function
function bossFight() {

    // Initialize a new boss character spritesheet
    boss = new Boss({
        x: canvas.width + 500,
        y: canvas.height / 2 - 150,
        canvasWidth: canvas.width,
        canvasHeight: canvas.height,
        scale: 10,
    });

    // Animating the bossfight
    bossFightAnimation(boss);

    // Pause current music and disallow user from skipping the cutscene
    music.pause();
    document.querySelector("#answer").style.display = "none";
    document.querySelector("#submit").style.display = "none";

    // Play footsteps and change title to create ambiance
    title.innerHTML = "Huh?!!";
    footstepSound.play();

    // Start bossfight after 10 seconds
    setTimeout(() => {
        // Allow user to interact
        document.querySelector("#answer").style.display = "block";
        document.querySelector("#submit").style.display = "block";

        // Boss level ambiance creation
        laughSound.play();
        music.play();
        title.innerHTML = "Level 5";

        // Grab current HP container position (x, y)
        let currentHPContainerx = 1100;
        let currentHPContainery = 550;

        player.switchState(1); // Player starts running first due to 800ms delay
        // Boss starts its entrance animation, animation triggers once per 1s
        let runAnimationInterval = setInterval(() => {
            // Player running animation
            player.switchState(1);
            // Boss entrance animation
            boss.switchState(1);
            // Stop interval once boss reaches the destination x
            if (boss.x <= canvas.width / 1.5) {
                clearInterval(runAnimationInterval);
            }
        }, 800); // Each 800ms, the running state is triggered once

        // Boss and player start moving left, update once per 10ms
        let moveLeftInterval = setInterval(() => {
            boss.x -= 0.5; // Boss moving towards left
            player.x += 0.2; // Player moves left
            player.y += 0.2; // Player moves down slightly
            canvas.width++; // Canvas enlarging

            // Move healthbar and health value along with the player
            healthContainer.style.left = `${(currentHPContainerx -= 0.8)}px`;
            healthContainer.style.top = `${(currentHPContainery += 0.2)}px`;

            if (boss.x <= canvas.width / 1.75) {
                // Stop interval once boss reaches the destination x
                clearInterval(moveLeftInterval);
            }
        }, 10); // Each 10ms, one movement occurs (around 100hz update rate)

        // Boss punches the windows
        boss.switchState(2);
        // Trigger chaos animations (everything got thrown away) 600ms after the start
        setTimeout(() => {
            explosionSound.play();
            form.style.animation = "rollAside 1s linear forwards";
            title.style.animation = "titleRoll 1s linear forwards";
            transcripts.style.animation = "rollAway 1s linear forwards";
        }, 600);

        // Enlargen the canvas to fit in the whole animated boss punch, after the end of boss entrance
        setTimeout(() => {
            canvas.width += 300;        // Largen canvas
            player.x = player.x + 300;  // Ensure player stays the same position with new width offset
            boss.x = boss.x + 300;      // Ensure boss stays the same position with new width offset
        }, 8000);

        // Boss attacks, interval per attack per window session is randomized
        let punchInterval = setInterval(() => {
            // If boss is not dead and player is not dead
            if (!boss.dead && !player.hp <= 0) {
                boss.switchState(2); // Attack animation
                setTimeout(() => {
                    takeHit(currentTries, maxTries); // Player takes hit
                    // If player dies with hit
                    if (player.hp <= 0) {
                        transcript.innerHTML += "You died. Game over.";
                        gameOver(number);       // Game over handler
                    }
                }, 500);
            // If boss or player is dead, stop punching
            } else {
                clearInterval(punchInterval);
            }
        }, (Math.random() * (5 - 3 + 1) + 3) * 1000); // between 3 to 5 seconds
    }, 10000);
}

// Function that handles when player takes a hit
function takeHit(currentTries, maxTries) {
    // Update player health
    player.hp -= (1 / maxTries) * 100;
    // Update healthbar and trigger player animation
    updateHealth(player.hp);
    console.log(`Current health: ${player.hp}%, try #${currentTries - 1}`);
}
