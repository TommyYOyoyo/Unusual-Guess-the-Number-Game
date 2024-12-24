export { Samurai, Boss };

// Character (samurai) sprite class
class Samurai {
    constructor({ x, y, canvasWidth, canvasHeight, scale }) {
        this.canvasWidth = canvasWidth; // Width of the canvas
        this.canvasHeight = canvasHeight; // Height of the canvas

        // Sources for each spritesheet and the max frame count for each
        this.sprites = {
            idle: {
                imageSrc: "../assets/images/samuraiMack/Idle.png",
                maxFrame: 8
            },
            death: {
                imageSrc: "../assets/images/samuraiMack/Death.png",
                maxFrame: 6
            },
            hurt: {
                imageSrc: "../assets/images/samuraiMack/Take Hit.png",
                maxFrame: 4
            },
            run: {
                imageSrc: "../assets/images/samuraiMack/Run.png",
                maxFrames: 8
            }
        };

        this.state = 0; // Player states: 0 = idle, 1 = run, 2 = hurt, 3 = death

        this.image = new Image();
        this.image.src = this.sprites.idle.imageSrc; // Current spritesheet

        this.spriteWidth = 200; // width of each sprite
        this.spriteHeight = 200; // height of each sprite

        this.width = this.spriteWidth; // width of sprite in canvas
        this.height = this.spriteHeight; // width of sprite in canvas

        this.scale = scale; // Image scale

        this.x = x; // sprite position, x
        this.y = y; // sprite position, y

        this.xframe = 1; // # of frame in the spritesheet

        this.minFrame = 0; // Minimum frame number
        this.maxFrame = this.sprites.idle.maxFrame; // Maximum frame number

        // Frame timer to slow down the animation (5 game ticks before 1 frame refresh)
        this.frameTimer = 0;
        this.frameInterval = 5;

        // Player HP
        this.hp = 100;
    }

    // Draw the sprite
    draw(ctx) {
        ctx.drawImage(
            this.image, // Image source
            this.xframe * this.spriteWidth, // sx: Position of current sprite the spritesheet
            0, // sy: Position of current sprite in the spritesheet
            this.spriteWidth, // sWidth: Each sprite's width in the spritesheet
            this.spriteHeight, // sHeight: Each sprite's height in the spritesheet
            // dx: Pos in canvas, with offset to always center image to the desired position
            this.x - (this.width * this.scale) / 2,
            // dy: Pos in canvas, with offset to always center image to the desired position
            this.y - (this.height * this.scale) / 2,
            this.width * this.scale, // dWidth: Image width in canvas
            this.height * this.scale // dHeight: Image height in canvas
        );
    }

    // Updating the sprite
    update(ctx) {
        // Draw the sprite on the canvas
        this.draw(ctx);
        // Frame timing
        if (this.frameTimer > this.frameInterval) {
            // Update the xframe to cycle through the animation
            if (this.xframe < this.maxFrame - 1) {
                this.xframe++; // Move to the next frame
            } else {
                // If player = dying, and is at last frame -> pause animation
                if (this.state == 3 && this.xframe >= this.maxFrame - 1) {
                    return;
                // If player is taking hit or is running, and is at last frame -> switch spritesheet to idling
                } else if ((this.state == 1 || this.state == 2) && this.xframe >= this.maxFrame - 1) {
                    this.switchState(0);
                // Player is idling, replay the same spritesheet
                } else {
                    this.xframe = this.minFrame; // Reset to the first frame
                }
            }
            this.frameTimer = 0; // Reset timer
        // If frame didn't reach the timing, do not update the frame in the current game tick 
        } else {
            this.frameTimer++;
        }
    }

    // Switching to the correct spritesheet according to the player state
    switchState(state) {
        this.xframe = 0;
        switch (state){
            // Idle
            case 0:
                this.state = 0;
                this.image.src = this.sprites.idle.imageSrc;
                this.maxFrame = this.sprites.idle.maxFrame;
                break;
            // running
            case 1:
                this.state = 1;
                this.image.src = this.sprites.run.imageSrc;
                this.maxFrame = this.sprites.run.maxFrames;
                break;
            // Hurt
            case 2:
                this.state = 2;
                this.image.src = this.sprites.hurt.imageSrc;
                this.maxFrame = this.sprites.hurt.maxFrame;
                break;
            // Death
            case 3:
                this.state = 3;
                this.image.src = this.sprites.death.imageSrc;
                this.maxFrame = this.sprites.death.maxFrame;
                break;
        }
    }
}


// Boss sprite class
class Boss {
    constructor({ x, y, canvasWidth, canvasHeight, scale }) {
        this.canvasWidth = canvasWidth; // Width of the canvas
        this.canvasHeight = canvasHeight; // Height of the canvas

        // Sources for each sprite and the max frame count for each
        this.sprites = {
            idle: {
                imageSrc: "../assets/images/boss/idle.png",
                maxFrame: 6
            },
            run: {
                imageSrc: "../assets/images/boss/run.png",
                maxFrame: 10
            },
            attack: {
                imageSrc: "../assets/images/boss/attack.png",
                maxFrame: 14
            },
            hurt: {
                imageSrc: "../assets/images/boss/tankHit.png",
                maxFrame: 7
            },
            death: {
                imageSrc: "../assets/images/boss/death.png",
                maxFrame: 16
            }
        };

        this.state = 0; // Boss states: 0 = idle, 1 = run, 2 = attack, 3 = hurt, 4 = death

        this.image = new Image();
        this.image.src = this.sprites.idle.imageSrc; // Current spritesheet

        this.spriteWidth = 192; // width of each sprite
        this.spriteHeight = 128; // height of each sprite

        this.width = this.spriteWidth; // width of sprite in canvas
        this.height = this.spriteHeight; // width of sprite in canvas

        this.scale = scale; // Image scale

        this.x = x; // sprite position, x
        this.y = y; // sprite position, y

        this.xframe = 1; // # of frame in the spritesheet

        this.minFrame = 0; // Minimum frame number
        this.maxFrame = this.sprites.idle.maxFrame; // Maximum frame number

        // Frame timer to slow down the animation (3 game ticks before 1 frame refresh)
        this.frameTimer = 0;
        this.frameInterval = 3;

        // Death status for the boss
        this.dead = false;
    }

    // Draw the sprite
    draw(ctx) {
        ctx.drawImage(
            this.image, // Image source
            this.xframe * this.spriteWidth, // sx: Position of current sprite the spritesheet
            0, // sy: Position of current sprite in the spritesheet
            this.spriteWidth, // sWidth: Each sprite's width in the spritesheet
            this.spriteHeight, // sHeight: Each sprite's height in the spritesheet
            // dx: Pos in canvas, with offset to always center image to the desired position
            this.x - (this.width * this.scale) / 2,
            // dy: Pos in canvas, with offset to always center image to the desired position
            this.y - (this.height * this.scale) / 2,
            this.width * this.scale, // dWidth: Image width in canvas
            this.height * this.scale // dHeight: Image height in canvas
        );
    }

    // Updating the sprite
    update(ctx) {
        // Draw the sprite on the canvas
        this.draw(ctx);
        // Frame timing
        if (this.frameTimer > this.frameInterval) {
            // Update the xframe to cycle through the animation
            if (this.xframe < this.maxFrame - 1) {
                this.xframe++; // Move to the next frame
            } else {
                // If boss = dying, and is at last frame -> pause animation
                if (this.state == 4 && this.xframe >= this.maxFrame - 1) {
                    return;
                // If boss is taking hit, is attacking or is running, and is at last frame -> switch spritesheet to idling
                } else if ((this.state == 1 || this.state == 2 || this.state == 3) && this.xframe >= this.maxFrame - 1) {
                    this.switchState(0);
                // Boss is idling, replay the same spritesheet
                } else {
                    this.xframe = this.minFrame; // Reset to the first frame
                }
            }
            this.frameTimer = 0; // Reset timer
        // If frame didn't reach the timing, do not update the frame in the current game tick 
        } else {
            this.frameTimer++;
        }
    }

    // Switching to the correct spritesheet according to the boss state
    switchState(state) {
        this.xframe = 0;
        switch (state){
            // Idle
            case 0:
                this.state = 0;
                this.image.src = this.sprites.idle.imageSrc;
                this.maxFrame = this.sprites.idle.maxFrame;
                break;
            // run
            case 1:
                this.state = 1;
                this.image.src = this.sprites.run.imageSrc;
                this.maxFrame = this.sprites.run.maxFrame;
                break;
            // Attack
            case 2:
                this.state = 2;
                this.image.src = this.sprites.attack.imageSrc;
                this.maxFrame = this.sprites.attack.maxFrame;
                break;
            // Hurt
            case 3:
                this.state = 3;
                this.image.src = this.sprites.hurt.imageSrc;
                this.maxFrame = this.sprites.hurt.maxFrame;
                break;
            // Death
            case 4:
                this.state = 4;
                this.image.src = this.sprites.death.imageSrc;
                this.maxFrame = this.sprites.death.maxFrame;
                break;
        }
    }
}

