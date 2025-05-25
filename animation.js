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
    position = cueNotation[animation_index].slice(1);
    hand = document.getElementById("hand");
    switch(position) {
        case("m"): hand.style.right = "120px"; hand.style.bottom = "80px"; break;
    }
    if (position == previousCue) {
        hand = document.getElementById("hand");
        hand.style.transform = "scale(1.1)";
        setTimeout(() => {
            hand.style.transform = "scale(1)";
        }, 150);
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