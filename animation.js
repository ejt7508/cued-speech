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
    const hand = document.getElementById("hand");
    hand.style.transform = "scale(1)";

    const cue = cueNotation[animation_index];
    const handshape = cue[0];
    const position = cue.slice(1);

    const handPositions = {
        m: {
            "1": ["52%", "18%"],
            "2": ["55%", "12%"],
            "6": ["54%", "14%"],
            "8": ["56%", "8%"],
            default: ["56%", "10%"]
        },
        c: {
            "1": ["45%", "38%"],
            "2": ["48%", "32%"],
            "4": ["48%", "28%"],
            "6": ["47%", "33%"],
            "8": ["44%", "39%"],
            default: ["49%", "30%"]
        },
        t: {
            "1": ["45%", "48%"],
            "2": ["48%", "45%"],
            "6": ["47%", "45%"],
            "7": ["49%", "42%"],
            "8": ["44%", "46%"],
            default: ["49%", "40%"]
        },
        s: {
            "1": ["68%", "40%"],
            "8": ["70%", "42%"],
            default: ["70%", "36%"]
        },
        sf: {
            "1": ["68%", "40%"],
            "8": ["70%", "42%"],
            default: ["70%", "35%"]
        },
        sd: {
            "1": ["68%", "40%"],
            "8": ["70%", "42%"],
            default: ["70%", "35%"]
        },
        "c-5t": {}, // handled specially
        "s-5t": {}  // handled specially
    };

    const handImages = {
        "1": "images/1.png",
        "2": "images/2.png",
        "3": "images/3.png",
        "4": "images/4.png",
        "5": "images/5.png",
        "6": "images/6.png",
        "7": "images/7.png",
        "8": "images/8.png"
    };

    function setHandPosition(x, y) {
        hand.style.left = x;
        hand.style.top = y;
    }

    function getPosition(pos, shape) {
        const config = handPositions[pos];
        return config?.[shape] || config?.default || ["50%", "50%"];
    }

    // Handle normal positions
    if (["m", "c", "t", "s"].includes(position)) {
        const [x, y] = getPosition(position, handshape);
        setHandPosition(x, y);
    }

    // Special cases
    if (position === "sf") {
        const [x, y] = getPosition(position, handshape);
        setHandPosition(x, y);
        setTimeout(() => hand.style.transform = "scale(1.2)", 100);
    }

    if (position === "sd") {
        const [x, y] = getPosition(position, handshape);
        setHandPosition(x, y);
        setTimeout(() => setHandPosition("70%", "45%"), 300);
    }

    if (position === "c-5t") {
        const [x, y] = getPosition("c", handshape);
        setHandPosition(x, y);
        setTimeout(() => {
            hand.src = handImages["5"];
            const [newX, newY] = getPosition("t", handshape);
            setHandPosition(newX, newY);
        }, 400);
    }

    if (position === "s-5t") {
        const [x, y] = getPosition("s", handshape);
        setHandPosition(x, y);
        setTimeout(() => {
            hand.src = handImages["5"];
            const [newX, newY] = getPosition("t", handshape);
            setHandPosition(newX, newY);
        }, 200);
    }

    // Update hand image (do this **after** special transitions to avoid being overwritten too early)
    if (handImages[handshape]) {
        hand.src = handImages[handshape];
    }

    // Small bounce/scale effect
    if ((position === previousCue && !["sf", "sd", "c-5t", "s-5t"].includes(position)) ||
        (position === "t" && ["c-5t", "s-5t"].includes(previousCue))) {
        hand.style.transform = "scale(1.1)";
        setTimeout(() => hand.style.transform = "scale(1)", 100);
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