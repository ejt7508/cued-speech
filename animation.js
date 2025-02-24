var animation_index = 0;
var playing = true;
var startTime = 0;

var medDelay = 1000;
var curDelay = medDelay;

function play(icon) {
    /* change icon */
    icon.classList.remove("fa-play");
    icon.classList.add("fa-pause");
    icon.setAttribute("onClick", "javascript: pause(this)");
    playing = true;
    if (animation_index >= cueNotation.length) {
        animation_index = 0;
    }
    startAnimation();
}
function startAnimation() {
    if(playing) {
        startTime = performance.now()
        
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

        // Set window text
        document.getElementById("window-text").innerHTML = cueNotation[animation_index];
        animation_index++;
        setTimeout(startAnimation, curDelay);
        curDelay = medDelay;

        // Pause immediately once end is reached
        if (animation_index >= cueNotation.length) {
            pause(document.getElementById("pause"));
            return;
        }
    }
}
function pause(icon) {
    // Calculate amount of time to wait after unpausing
    curDelay = medDelay - (performance.now() - startTime);

    /* change icon */
    icon.classList.remove("fa-pause");
    icon.classList.add("fa-play");
    icon.setAttribute("onClick", "javascript: play(this)");

    playing = false;
    if (animation_index < cueNotation.length) {
        animation_index--;
    }
}