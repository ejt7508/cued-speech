var animation_index = 0;
var playing = false;
var startTime = 0;
var medDelay = 1000;
var curDelay = medDelay;
var intervalId = null;
var previousCue = "";

function restart() {
    animation_index = 0;
    resetAnimationTimer();
    display();
}

function previous() {
    if (animation_index > 0) {
        animation_index--;
        resetAnimationTimer();
        display();
    }
}

function next() {
    if (animation_index < cueNotation.length - 1) {
        animation_index++;
        resetAnimationTimer();
        display();
    }
}

function setIndex(amount) {
    if (amount < 0) {
        animation_index = 0;
    } else if (amount >= cueNotation.length) {
        animation_index = cueNotation.length - 1;
    } else {
        animation_index = amount;
    }
    display();
}

function play(icon) {
    if (!playing) {
        /* change icon */
        icon.classList.remove("fa-play");
        icon.classList.add("fa-pause");
        icon.setAttribute("onClick", "pause(this)");

        playing = true;

        if (animation_index >= cueNotation.length - 1) {
            animation_index = 0;
        }

        startAnimation();
    }
}

function startAnimation() {
    previousCue = "";
    if (playing) {
        display();

        resetAnimationTimer();
    }
}

function display() {
    // End immediately, don't wait for delay
    if (animation_index >= cueNotation.length - 1) {
        pause(document.getElementById("pause"));
    }
    // Bold current notation
    let resultCued = cueNotation.map((cue, index) =>
        index === animation_index ? `<b>${cue}</b>` : cue
    );
    document.getElementById("resultCued").innerHTML = resultCued.join(" ");

    // Bold current IPA phoneme
    let ipaWords = phonemes.map((phoneme, index) =>
        index === animation_index ? `<b>${phoneme}</b>` : phoneme
    );

    // Set window text
    //document.getElementById("window-text").innerHTML = cueNotation[animation_index];
    document.getElementById("resultIPA").innerHTML = ipaWords.join("");

    // image
    handshape = cueNotation[animation_index][0];
    position = cueNotation[animation_index].slice(1);
    hand = document.getElementById("hand");
    hand.style.transform = "scale(1)"
    switch(position) {
        case("m"):  
            switch(handshape) {
                case("1"): hand.style.left = "52%"; hand.style.top = "18%"; break;
                case("2"): hand.style.left = "55%"; hand.style.top = "12%"; break;
                case("6"): hand.style.left = "54%"; hand.style.top = "14%"; break;
                case("8"): hand.style.left = "56%"; hand.style.top = "8%"; break;
                default: hand.style.left = "56%"; hand.style.top = "10%"; break;
            }
            break;
        case("c"): 
            switch(handshape) {
                case("1"): hand.style.left = "45%"; hand.style.top = "38%"; break;
                case("2"): hand.style.left = "48%"; hand.style.top = "32%"; break;
                case("4"): hand.style.left = "48%"; hand.style.top = "28%"; break;
                case("6"): hand.style.left = "47%"; hand.style.top = "33%"; break;
                case("8"): hand.style.left = "44%"; hand.style.top = "39%"; break;
                default: hand.style.left = "49%"; hand.style.top = "30%"; break;
            }
            break;
        case("t"):
            switch(handshape) {
                case("1"): hand.style.left = "45%"; hand.style.top = "48%"; break;
                case("2"): hand.style.left = "48%"; hand.style.top = "45%"; break;
                case("6"): hand.style.left = "47%"; hand.style.top = "45%"; break;
                case("7"): hand.style.left = "49%"; hand.style.top = "42%"; break;
                case("8"): hand.style.left = "44%"; hand.style.top = "46%"; break;
                default: hand.style.left = "49%"; hand.style.top = "40%"; break;
            }
            break;
        case("s"): 
            switch(handshape) {
                case("1"): hand.style.left = "68%"; hand.style.top = "40%"; break;
                case("8"): hand.style.left = "70%"; hand.style.top = "42%"; break;
                default: hand.style.left = "70%"; hand.style.top = "36%"; break;
            }
            break;
        case("sf"): 
            switch(handshape) {
                case("1"): hand.style.left = "68%"; hand.style.top = "40%"; break;
                case("8"): hand.style.left = "70%"; hand.style.top = "42%"; break;
                default: hand.style.left = "70%"; hand.style.top = "35%"; break;
            }
            setTimeout(() => {
                hand.style.transform = "scale(1.2)"; 
            }, 100);   
            break;
        case("sd"): 
            switch(handshape) {
                case("1"): hand.style.left = "68%"; hand.style.top = "40%"; break;
                case("8"): hand.style.left = "70%"; hand.style.top = "42%"; break;
                default: hand.style.left = "70%"; hand.style.top = "35%"; break;
            }
            setTimeout(() => {
                hand.style.left = "70%"; hand.style.top = "45%"; 
            }, 300);
            break;
        case("c-5t"): 
            switch(handshape) {
                case("1"): hand.style.left = "45%"; hand.style.top = "38%"; break;
                case("2"): hand.style.left = "48%"; hand.style.top = "32%"; break;
                case("4"): hand.style.left = "48%"; hand.style.top = "28%"; break;
                case("6"): hand.style.left = "47%"; hand.style.top = "33%"; break;
                case("8"): hand.style.left = "44%"; hand.style.top = "39%"; break;
                default: hand.style.left = "49%"; hand.style.top = "30%"; break;
            }
            setTimeout(() => {
                hand.src = "images/5.png";
                switch(handshape) {
                    case("1"): hand.style.left = "45%"; hand.style.top = "48%"; break;
                    case("2"): hand.style.left = "48%"; hand.style.top = "45%"; break;
                    case("6"): hand.style.left = "47%"; hand.style.top = "45%"; break;
                    case("7"): hand.style.left = "49%"; hand.style.top = "42%"; break;
                    case("8"): hand.style.left = "44%"; hand.style.top = "46%"; break;
                    default: hand.style.left = "49%"; hand.style.top = "40%"; break;
                }
            }, 400);
            break;
        case("s-5t"): 
            switch(handshape) {
                case("1"): hand.style.left = "68%"; hand.style.top = "40%"; break;
                case("8"): hand.style.left = "70%"; hand.style.top = "42%"; break;
                default: hand.style.left = "70%"; hand.style.top = "35%"; break;
            }
            setTimeout(() => {
                hand.src = "images/5.png";
                switch(handshape) {
                    case("1"): hand.style.left = "45%"; hand.style.top = "48%"; break;
                    case("2"): hand.style.left = "48%"; hand.style.top = "45%"; break;
                    case("6"): hand.style.left = "47%"; hand.style.top = "45%"; break;
                    case("7"): hand.style.left = "49%"; hand.style.top = "42%"; break;
                    case("8"): hand.style.left = "44%"; hand.style.top = "46%"; break;
                    default: hand.style.left = "49%"; hand.style.top = "40%"; break;
                }
            }, 200);
            break;
    }
    switch(handshape) {
        case("1"): hand.src = "images/1.png"; break;
        case("2"): hand.src = "images/2.png"; break;
        case("3"): hand.src = "images/3.png"; break;
        case("4"): hand.src = "images/4.png"; break;
        case("5"): hand.src = "images/5.png"; break;
        case("6"): hand.src = "images/6.png"; break;
        case("7"): hand.src = "images/7.png"; break;
        case("8"): hand.src = "images/8.png"; break;
    }
    if ((position == previousCue && position != "sf" && position != "sd" && position != "c-5t" && position !="s-5t") || (position == "t" && (previousCue == "c-5t" || previousCue == "s-5t"))) {
        hand = document.getElementById("hand");
        hand.style.transform = "scale(1.1)";
        setTimeout(() => {
            hand.style.transform = "scale(1)";
        }, 100);
    }
    previousCue = position;
}

function pause(icon) {
    /* change icon */
    icon.classList.remove("fa-pause");
    icon.classList.add("fa-play");
    icon.setAttribute("onClick", "play(this)");

    playing = false;
    clearInterval(intervalId); // Stop animation loop
}

function resetAnimationTimer() {
    // Stop any existing interval before setting a new one
    clearInterval(intervalId);

    if (playing) {
        intervalId = setInterval(() => {
            if (animation_index < cueNotation.length - 1) {
                animation_index++;
                display();
            } else {
                pause(document.getElementById("pause")); // Stop at the end
            }
        }, curDelay);
    }
}