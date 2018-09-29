// Final Ripples Protoype - Brian Nguyen

// This code references a lot of the p5 scripting reference as well as
// accompanying libraries such as p5 sound.

// Initalize starting variables

// Array to store ripple objects
var ripples = []
// Controls right click ripple background toggle
var nextBackgroundBlack = true;
// Time since last ripple was created from mouseDragged()
var lastDrag = 501;

// Variable to store oscillator
var osc;
// Variable keeps track of the oscillation type
var oscType = "sine"



function setup() {
    // Makes canvas size window screen
    createCanvas(windowWidth, windowHeight);
    // Creates new oscillator
    osc = new p5.Oscillator();
    // Sets oscillator to default 'sine'
    osc.setType(oscType);
    // Sets default oscillation frequency to 240hz
    osc.freq(240);
    // Sets amplitude to max of 1
    osc.amp(1);
    // Starts the oscillator
    osc.start();

    // Creates Sine UI radio button
    createP('Sine')
    var sine_input = createInput("", 'radio')
    sine_input.input(sineValue);

    // Creates Triangle oscillation UI radio button
    createP('Triangle')
    var triangle_input = createInput("", 'radio')
    triangle_input.input(triangleValue);

    // Code for Sawtooth pattern, not implemented

    // createP('Sawtooth')
    // var sawtooth_input = createInput("", 'radio')
    // triangle_input.input(triangleValue);
}

// Functions to call on radio buttons that change oscType
function sineValue() {
    oscType = "sine"
}

function triangleValue() {
    oscType = "triangle"
}

function sawtoothValue() {
    oscType = "sawtooth"
}

function squareValue() {
    oscType = "square"
}

// Basic class of a ripple
class Ripple {
    // Constructor, called on creation of a new ripple
    constructor(x,y, type) {

        // Sets properties
        this.x = x;
        this.y = y;
        this.size = 0;
        this.growthRate = random(1, 20);
        this.R = random(1, 255);
        this.G = random(1, 255);
        this.B = random(1, 255);
        // Generates a frequency based off a map of the growth rate
        // Frequency is proportional to the growth rate of a ripple
        osc.freq(map(this.growthRate, 5, 1, 20, 500),0.15);
        // Age used for garbage collection
        this.age = millis();
        this.type = type;
        // If recieves type value of "background"
        // Generate a opaque ripple

        if (type == "background") {
            this.opacity = 0;
        }
        else {
            this.opacity = 255;
        }

       // If nextBackgroundBlack variable is true, make the fill black
        if (nextBackgroundBlack == true) {
            this.isBlack = true;
        }
        nextBackgroundBlack = !nextBackgroundBlack;
    }

    // Display function, called every draw loop, draws the ripple
    display() {
        // Increment the size by the growth rate
        this.size += this.growthRate;
        // If its a background ripple, increase the opacity
        if (this.type == "background") {
            this.opacity += this.growthRate;
            // If the background is black, make it black
            if (this.isBlack == true) {
                fill(0, 0, 0, this.opacity);
            }
            else {

                fill(255, 255, 255, this.opacity);
            }
        }
        // Else, fade the fill away, and make it the random colors in properties
        else {
            this.opacity -= this.growthRate;
            fill(this.R, this.G, this.B, this.opacity);
        }

        // Draw the ripple
        stroke(this.R, this.G, this.B);
        ellipse(this.x, this.y, this.size, this.size);
    }
}

// Main draw loop
function draw() {
    // Refresh the background
    background(255);
    // Set the oscillation type
    osc.setType(oscType);
    // Loop through the ripples array and draw every ripple
    for (var i = 0; i < ripples.length; i++) {
        var element = ripples[i];
        element.display();
        // If the element width is twice as big as the window width,
        // remove it from the array and stop drawing it
        // My makeshift garbage collection 
        if(element.size > windowWidth * 2) {
            ripples.splice(i, 1)
        }
    }
}

// On mouse dragged
function mouseDragged() {
    // If the time between the last ripple being created is less than 100ms, end the function
    // Makes the playground less messy and chaotic
    if(Date.now() - lastDrag < 100) return
    // If the left mouse button is being dragged, add a regular ripple
    if (mouseButton == LEFT) {

        ripples.push(new Ripple(mouseX, mouseY, "regular"));
    }
    // If its the right mouse button, make it a background opaque ripple
    if (mouseButton == RIGHT) {

        ripples.push(new Ripple(mouseX, mouseY, "background"));
    }
    // Update lastDrag
    lastDrag = Date.now();
}
// If the mouse is released, run the same set of functions as above. 
// Guarantes that single clicks will be registered
function mouseReleased() {
    if (mouseButton == LEFT) {
        ripples.push(new Ripple(mouseX, mouseY, "regular"));
    }
    if (mouseButton == RIGHT) {
        ripples.push(new Ripple(mouseX, mouseY, "background"));
    }
}


