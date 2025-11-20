// TESTING
// s: dvhbmlgj
// m: divihibimiligiji
// c: dɛvɛhɛbɛmɛlɛgɛjɛ
// t: dɪvɪhɪbɪmɪlɪgɪjɪ


var animation_index = 0;
var playing = false;
var startTime = 0;
var medDelay = 1000;
var curDelay = medDelay;
var intervalId = null;

var prevPos = "";
var prevShape = "";

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
    console.log(animation_index);
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

function startAnimation() {
    prevPos = "";
    prevShape = "";
    display();           // Show current frame immediately
    resetAnimationTimer(); // Start interval only if playing
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


    document.getElementById("resultIPA").innerHTML = ipaWords.join("");

    const hand = document.getElementById("hand");
    hand.style.transform = "scale(1)";

    // Helper Lookup Tables
    const handImages = {
        "1": "one.png",
        "2": "two.png",
        "3": "three.png",
        "4": "four.png",
        "5": "five.png",
        "6": "six.png",
        "7": "seven.png",
        "8": "eight.png",
    };

    const staticPositions = {
        "m": {
            default: [56, 10],
            "1": [54, 12],
            "6": [54, 13],
            "8": [55, 7],
        },
        "c": {
            default: [49, 27],
            "1": [47, 29],
            "6": [47, 30],
            "8": [44, 35],
        },
        "t": {
            default: [49, 40],
            "1": [47, 42],
            "6": [47, 43],
            "8": [44, 46],
        },
        "s": {
            default: [70, 35]
        }
    };

    let [handshape, position] = [cueNotation[animation_index][0], cueNotation[animation_index].slice(1)];
    const path = "assets/images/cue_images/";
    hand.src = path + handImages[handshape];


    function applyPosition(posCode, shape = handshape) {
        const posSet = staticPositions[posCode];
        let [left, top] = posSet[shape] || posSet.default;
        if (window.innerWidth <= 800) {
            left -= 18;
        }
        hand.style.left = left + "%";
        hand.style.top = top + "%";
    }

    // Animate Position
    if (position === "sf") {
        applyPosition("s");
        setTimeout(() => {
            hand.style.transform = "scale(1.2)";
        }, 100);
    } 
    else if (position === "sd") {
        applyPosition("s");
        setTimeout(() => {
            hand.style.top = "45%";
        }, 300);
    } 
    else if (position === "c-5t" || position === "s-5t") {
        // Start at "c" or "s"
        if (position === "c-5t") {
            applyPosition("c");
        } else {
            applyPosition("s");
        }

        setTimeout(() => {
            hand.src = path + handImages[5];
            applyPosition("t");
        }, 300);
    } 
    else {
        applyPosition(position);
    }

    // Tap or flick for cue clarity
    if (
        (position === prevPos && (['c', 'm', 't'].includes(position) || (position === 's' && handshape === prevShape))) ||
        (position === 'c-5t' && prevPos === 'c') ||
        (position === 's-5t' && prevPos === 's') ||
        (position === 't' && ['c-5t', 's-5t'].includes(prevPos))
    ) {
        hand.style.transform = "scale(1.1)";
        setTimeout(() => {
            hand.style.transform = "scale(1)";
        }, 100);
    }
    prevPos = position;
    prevShape = handshape;
}

function pause() {
    if (!playing) return; // Already paused
    console.log("pause");
    playing = false;

    const icon = document.getElementById('pause');
    icon.classList.remove("fa-pause");
    icon.classList.add("fa-play");

    clearInterval(intervalId); // Stop animation loop
}


function play() {
    if (playing) return; // Already playing
    console.log("play");
    playing = true;

    const icon = document.getElementById('pause');
    icon.classList.remove("fa-play");
    icon.classList.add("fa-pause");

    // Restart from beginning if at the end
    if (animation_index >= cueNotation.length - 1) {
        animation_index = 0;
    }

    startAnimation();
}

function togglePlayPause() {
    if (playing) {
        pause();
    } else {
        play();
    }
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