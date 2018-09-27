// Final Protoype - Brian Nguyen

var ripples = []
var nextBackgroundBlack = true;
var lastDrag = 501;
var osc;



function setup() {
    // Makes canvas size fullscreen
    createCanvas(windowWidth, windowHeight);
    osc = new p5.Oscillator();
    osc.setType('sine');
    osc.freq(240);
    osc.amp(1);
    osc.start();


    
}

function draw() {
    background(255);
    for (var i = 0; i < ripples.length; i++) {
        var element = ripples[i];
        element.display();
        if(element.size > windowWidth * 2) {
            ripples.splice(i, 1)
        }
    }
}


function mouseDragged() {
    if(Date.now() - lastDrag < 200) return

    if (mouseButton == LEFT) {

        ripples.push(new Ripple(mouseX, mouseY, "regular"));
    }
    if (mouseButton == RIGHT) {

        ripples.push(new Ripple(mouseX, mouseY, "background"));
    }

    lastDrag = Date.now();
}


function mouseReleased() {
    if (mouseButton == LEFT) {
        ripples.push(new Ripple(mouseX, mouseY, "regular"));
    }
    if (mouseButton == RIGHT) {
        ripples.push(new Ripple(mouseX, mouseY, "background"));
    }
}


class Ripple {
    constructor(x,y, type) {
        // Sets XY Coordinates based off of parameters
        this.x = x;
        this.y = y;
        this.size = 0;
        // Randomizes the growth rate
        this.growthRate = random(5, 20);
        // Randomizes the color
        this.R = random(1, 255);
        this.G = random(1, 255);
        this.B = random(1, 255);
        osc.freq(map(this.growthRate, 5, 1, 20, 600),0.15);
        // Takes a snapshot of the current time 
        this.age = millis();

        // If it is meant to be in background mode
        if (type == "background") {
            // Set the starting opacity to be 0 (Invisible)
            this.opacity = 0;
        }
        // Else set it to 255 (Visible)
        else {
            this.opacity = 255;
        }
        // Sets the type variable to the parameter value
        this.type = type;

        // If the next background ripple is supposed to be black fill, track that
        if (nextBackgroundBlack == true) {
            this.isBlack = true;
        }

        // Invert the nextBackgroundBlack boolean to make the next ripple a different color
        nextBackgroundBlack = !nextBackgroundBlack;
    }

    // Display function that runs every time draw() is ran
    display() {
        // Increment the size by the growth rate
        this.size += this.growthRate;
        // If it is a background ripple
        if (this.type == "background") {
            // Increase the opacity by the growth rate as well
            this.opacity += this.growthRate;
            // If the background is meant to be black
            if (this.isBlack == true) {
                // Set the background to be black and set the opacity value
                fill(0, 0, 0, this.opacity);
            }
            // Else set the background to white
            else {

                fill(255, 255, 255, this.opacity);
            }
        }

        // If it is a regular ripple
        else {
            // decrement the opacity by the growth rate
            this.opacity -= this.growthRate;
            // Set the fill to be the randomized RGB colors and fade away with opacity
            fill(this.R, this.G, this.B, this.opacity);
        }

        // Set the stroke to the randomized RGB values
        stroke(this.R, this.G, this.B);
        // Create a circle at (X,Y) with an equal size
        ellipse(this.x, this.y, this.size, this.size);
    }
}