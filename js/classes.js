export { Samurai };

// Character (samurai) sprite class
class Samurai {
    constructor({ x, y, canvasWidth, canvasHeight, scale }) {
        this.canvasWidth = canvasWidth; // Width of the canvas
        this.canvasHeight = canvasHeight; // Height of the canvas

        // Sources for each sprite
        this.idleSrc = "../assets/images/samuraiMack/Idle.png";
        this.hurtSrc = "../assets/images/samuraiMack/Take Hit.png";
        this.deathSrc = "../assets/images/samuraiMack/Death.png";

        this.state = 0; // Current state, 0 = idle, 1 = death

        this.image = new Image();
        this.image.src = this.idleSrc; // Current spritesheet

        this.spriteWidth = 200; // width of each sprite
        this.spriteHeight = 200; // height of each sprite

        this.width = this.spriteWidth; // width of sprite in canvas
        this.height = this.spriteHeight; // width of sprite in canvas

        this.x = x; // sprite position, x
        this.y = y; // sprite position, y

        this.scale = scale; // Image scale

        this.xframe = 1; // x-axis frame position in the spritesheet

        this.minFrame = 0; // Minimum frame number
        this.maxFrame = this.image.width / 200; // Maximum frame number

        // Frame timer to slow down the animation (5 updates before 1 frame refresh)
        this.frameTimer = 0;
        this.frameInterval = 5;
    }

    // Draw the sprite
    draw(ctx) {
        // Offset making to always center the sprite to the x, y given

        const scaledWidth = this.width * this.scale;
        const scaledHeight = this.height * this.scale;

        // Calculate the offsets to maintain centering
        const offsetX = (scaledWidth - this.width) / 2;
        const offsetY = (scaledHeight - this.height) / 2;

        ctx.drawImage(
            this.image, // Image source
            this.xframe * this.spriteWidth, // sx: Position of current sprite the spritesheet
            0, // sy: Position of current sprite in the spritesheet
            this.spriteWidth, // sWidth: Each sprite's width in the spritesheet
            this.spriteHeight, // sHeight: Each sprite's height in the spritesheet
            this.x - offsetX, // dx: Pos in canvas, with offset
            this.y - offsetY, // dy: Pos in canvas, with offset
            this.width * this.scale, // dWidth: Image width in canvas
            this.height * this.scale // dHeight: Image height in canvas
        );
    }

    // Updating the sprite
    update(ctx) {
        // Draw the sprite on the canvas
        this.draw(ctx);
        // If player is alive
        if (this.state == 0) {
            // Frame timing
            if (this.frameTimer > this.frameInterval) {
                // Update the xframe to cycle through the animation
                if (this.xframe < this.maxFrame - 1) {
                    this.xframe++; // Move to the next frame
                } else {
                    this.xframe = this.minFrame; // Reset to the first frame
                }
                this.frameTimer = 0; // Reset timer
            } else {
                this.frameTimer++;
            }
        // Player is dead
        } else {
            this.image.src = this.deathSrc;
            // Frame timing
            if (this.frameTimer > this.frameInterval) {
                // Update the xframe to cycle through the animation
                if (this.xframe < this.maxFrame - 3) {
                    this.xframe++; // Move to the next frame
                } else {
                    // Keep the last visible death frame on screen
                    return;
                }
                this.frameTimer = 0; // Reset timer
            } else {
                this.frameTimer++;
            }
        }
    }
}
