// TESTING
// s: dvhbmlgj



var ipaList = [];
var pronunciationData;
var unknown = [];
var unknownGroup = [];

var wordInput = [];
var sentences = [];

var cueNotation = [];
var phonemes = [];

var checkbox;


// Fetch JSON data
fetch('en_US copy.json')
.then(response => response.json())
.then(data => {
    pronunciationData = data.en_US[0];  // Store the pronunciation data

    // Function to get the pronunciation for a specific word
    window.getCuedSpeech = function() {
        let resultIPA = document.getElementById('resultIPA');
        let resultCued = document.getElementById('resultCued');

        // Clear content from previous usage
        resultIPA.innerHTML = "";
        resultCued.innerHTML = "";
        clearInterval(intervalId);

        let icon = document.getElementById('pause');
        icon.classList.remove("fa-play");
        icon.classList.add("fa-pause");
        icon.setAttribute("onClick", "pause(this)");

        let accept = true;

        ipaList = [];
        unknown = [];
        let unknownIndices = [];
        unknownOptions = [];

        wordInput = document.getElementById('wordInput').value.replaceAll(/[,\/#$%\^&\*;:{}=_`~()]/g,"").replaceAll(/\s{2,}/g," ").replaceAll(/\r?\n/g, " ").trim();     
        wordInput = wordInput.replaceAll("?", ".");
        wordInput = wordInput.replaceAll("!", ".");

        // Remove spaces and don't allow empty strings
        sentences = wordInput.split(".").map(sentence => sentence.trim()).filter(sentence => sentence != "");
        console.log(sentences);

        cleanInput = wordInput.replaceAll(".", "").split(" ");
        console.log(cleanInput);

        if (wordInput == "") {
            return;
        }

        unknownGroup = [];
        let unknownIndicesGroup = [];
        let unknownOptionsGroup = [];
        let index = 0;

        sentences.every((sentence) => {
            checkbox = document.getElementById('inputIPA');
            if(checkbox.checked) {
                ipaList.push(sentence.split(" "));
                return false;
            }

            let sentenceIPA = [];

            unknown = [];
            unknownIndices = [];
            unknownOptions = [];

            let words = sentence.split(" ");
            words.every((element)  => {
                element = element.toLowerCase();
                console.log(element);
                let ipa = `${pronunciationData[element]}`;
            
                if (element in pronunciationData) {
                    let ipa_options = ipa.split(', ');

                    // Check for duplicates (same except for ')
                    let uniqueOptions = [];
                    let normalized = [];
                    ipa_options.forEach(option => {
                        let normalizedIPA = (option.replaceAll('/', '').replaceAll('ˈ', ''));
                        if (!normalized.includes(normalizedIPA)) {
                            normalized.push(normalizedIPA);
                            uniqueOptions.push(option);
                        }
                        else {
                            uniqueOptions[uniqueOptions.indexOf(option)] = option;
                        }
                    });

                    if (uniqueOptions.length > 1) {
                        // if there's more than one option, prepare variables for displaying form
                        unknown.push(element);
                        unknownIndices.push(index);
                        unknownOptions.push(uniqueOptions);

                        // placeholder so that words remain in correct order
                        sentenceIPA.push("");
                    }
                    else {
                        // only one unique option
                        sentenceIPA.push(uniqueOptions[0]);
                    }
                    // continue
                    index++;
                    return true;
                } else {
                    resultIPA.innerHTML = `<strong>Word "` + element + `" not found.</strong>`;
                    accept = false;
                    // break
                    return false;
                }
            });
            if (!accept) {
                return false;
            }
            unknownGroup.push(unknown);
            unknownIndicesGroup.push(unknownIndices);
            unknownOptionsGroup.push(unknownOptions);

            ipaList.push(sentenceIPA);
            return true;
        });
        // If input is not acceptable, don't process
        if (!accept) {
            return;
        }
        // Some pronunciations not known, need user input
        if (unknownOptions.length != 0) {
            displayForm(unknownGroup, cleanInput, unknownIndicesGroup, unknownOptionsGroup);
        }
        else {
            processInput();
        }

    };
})
.catch(error => console.error('Error fetching the JSON file:', error));


function processInput() {
    // reset values
    cueNotation = [];
    phonemes = [];
    let formIndex = 0;
    let completeIPA = "";
    let phonemeIndex = 0;

    ipaList.forEach((sentenceIPA, sentenceIndex) => {
        sentenceIPA.forEach((element, index) => {
            // IPA hasn't been set OR is being changed through form
            if (!checkbox.checked && (element == "" || unknownGroup[sentenceIndex].includes(sentences[sentenceIndex].split(" ")[index]))) {
                sentenceIPA[index] = document.getElementsByClassName("buttonGroup")[formIndex].querySelector(".ipaButton.selected").dataset.value;
                formIndex++;
            }
            completeIPA += sentenceIPA[index].replaceAll('/', '').replaceAll('ˈ', '') + " ";
        });
        phonemeIndex = convertToCue(sentenceIPA.join(" "), phonemeIndex);
    });
    console.log(phonemes);
    completeIPA = "/" + completeIPA.slice(0, -1) + "/";
    console.log(completeIPA);
    console.log(cueNotation);
    document.getElementById("resultIPA").innerHTML = completeIPA;
    document.getElementById("resultCued").innerHTML = cueNotation.join(" ");
    //convertToCue(completeIPA);

    // Start animation
    playing = true;
    animation_index = 0;
    startAnimation();
}

function convertToCue(ipa, phonemeIndex) {
    let consonants = ["d", "p", "ʒ", "ð", "k", "v", "z", "s", "h", "ɹ", "hw", "b", "n", "m", "t", "f", "w", "ʃ", "ɫ", "θ", "dʒ", "ɡ", "j", "ŋ", "tʃ"];
    let vowels = ["i", "ɝ", "ɔ", "u", "ɛ", "ʊ", "ɪ", "æ", "oʊ", "ɑ", "ə", "ɔɪ", "eɪ", "aɪ", "aʊ", "o", "e", "a"];
    ipa = ipa.replaceAll('/', '').replaceAll('ˈ', '');
    let handshape = "";
    let position = "";
    let i = 0;

    while(i < ipa.length) {
        let symbol = ipa[i];
        if (i < ipa.length - 1) {
            let nextSymbol = ipa[i] + ipa[i + 1];
            if (consonants.includes(nextSymbol) || vowels.includes(nextSymbol)) {
                symbol = nextSymbol;
                i++;
            }
        }
        if (consonants.includes(symbol) && handshape != "") {
            phonemeIndex++;
        }
        if (phonemes[phonemeIndex] == null) {
            phonemes[phonemeIndex] = symbol;
        }
        else {
            phonemes[phonemeIndex] += symbol;
        }

        if (consonants.includes(symbol)) {
            // Two consonants in a row
            if (handshape != "") {
                position = "s";
                cueNotation.push(handshape + position);
                handshape = "";
                position = "";
            }
            switch(symbol) {
                case "d": case "p": case "ʒ": handshape = "1"; break;
                case "ð": case "k": case "v": case "z": handshape = "2"; break;
                case "s": case "h": case "ɹ": handshape = "3"; break;
                case "hw": case "b": case "n": handshape = "4"; break;
                case "m": case "t": case "f": handshape = "5"; break;
                case "w": case "ʃ": case "ɫ": handshape = "6"; break;
                case "θ": case "dʒ": case "ɡ": handshape = "7"; break;
                case "j": case "ŋ": case "tʃ": handshape = "8"; break;
            }
        }
        else if (vowels.includes(symbol)) {
            switch(symbol) {
                case "i": case "ɝ": position = "m"; break;
                case "ɔ": case "u": case "ɛ": position = "c"; break;
                case "ʊ": case "ɪ": case "æ": position = "t"; break;
                case "oʊ": case "ɑ": case "o": position = "sf"; break;
                case "ə": position = "sd"; break;
                case "ɔɪ": case "eɪ": position = "c-5t"; break;
                case "aɪ": case "aʊ": position = "s-5t"; break;
            }
            if (handshape == "") {
                handshape = "5";
            }
            cueNotation.push(handshape + position);
            handshape = "";
            position = "";
            phonemeIndex++;
        }
        i++;
    }
    if (handshape != "") {
        cueNotation.push(handshape + "s");
    }
    // Keep phonemes for each sentence separate
    phonemes.push(" ");
    return phonemeIndex + 1;
}

function processForm() {
    let valid = true;
    let allWords = document.querySelectorAll(".optionContainer");
    for (let word of allWords) {
        if (!word.querySelector(".ipaButton.selected")) {
            word.querySelector(".buttonGroup").classList.add("error");
            document.getElementById("formSubmit").classList.add("error");
            valid = false;
        }
        else {
            word.querySelector(".buttonGroup").classList.remove("error");
            document.getElementById("formSubmit").classList.remove("error");
        }
    }
    if (valid) {
        processInput();
        closeForm();
        let submitButton = document.getElementById("submit");
        submitButton.innerHTML = "Change Pronunciation";
        submitButton.onclick = openForm;
    }
}

