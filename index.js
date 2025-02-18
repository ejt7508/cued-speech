var ipaList = [];
var pronunciationData;
var unknown = [];
var wordInput = [];

// Fetch JSON data
fetch('en_US.json')
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

        let accept = true;

        ipaList = [];
        unknown = [];
        let unknownIndices = [];
        unknownOptions = [];
        wordInput = document.getElementById('wordInput').value.replace(/[.,\/#!?$%\^&\*;:{}=\-_`~()]/g,"").replace(/\s{2,}/g," ").replace(/\r?\n/g, " ").trim().split(" ");
        if (wordInput == "") {
            return;
        }
        wordInput.every((element, index) => {
            element = element.toLowerCase();
            ipa = `${pronunciationData[element]}`;
        
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
                        uniqueOptions[uniqueOptions.indexOf(option)] = normalizedIPA;
                    }
                });

                if (uniqueOptions.length > 1) {
                    // if there's more than one option, prepare variables for displaying form
                    unknown.push(element);
                    unknownIndices.push(index);
                    unknownOptions.push(uniqueOptions);

                    // placeholder so that words remain in correct order
                    ipaList.push("");
                }
                else {
                    // only one unique option
                    ipaList.push(uniqueOptions[0]);
                }
                // continue
                return true;
            } else {
                resultIPA.innerHTML = `<strong>Word "` + element + `" not found.</strong>`;
                accept = false;
                // break
                return false;
            }
        });
        // If input is not acceptable, don't process
        if (!accept) {
            return;
        }
        // Some pronunciations not known, need user input
        if (unknown.length != 0) {
            displayForm(unknown, wordInput, unknownIndices, unknownOptions);
        }
        else {
            processInput();
        }

    };
})
.catch(error => console.error('Error fetching the JSON file:', error));


function processInput() {
    let formIndex = 0;
    let completeIPA = "";
    ipaList.forEach((element, index) => {
        // IPA hasn't been set OR is being changed through form
        if (element == "" || unknown.includes(wordInput[index])) {
            ipaList[index] = document.getElementsByClassName("buttonGroup")[formIndex].querySelector(".ipaButton.selected").dataset.value;
            formIndex++;
        }
        completeIPA += ipaList[index].replaceAll('/', '') + " ";
    });
    completeIPA = "/" + completeIPA.slice(0, -1) + "/";
    console.log(completeIPA);
    document.getElementById("resultIPA").innerHTML = completeIPA;
    convertToCue(completeIPA);
}

function convertToCue(ipa) {
    var cueNotation = [];
    let consonants = ["d", "p", "ʒ", "ð", "k", "v", "z", "s", "h", "ɹ", "hw", "b", "n", "m", "t", "f", "w", "ʃ", "ɫ", "θ", "dʒ", "ɡ", "j", "ŋ", "tʃ"];
    let vowels = ["i", "ɝ", "ɔ", "u", "ɛ", "ʊ", "ɪ", "æ", "oʊ", "ɑ", "ə", "ɔɪ", "eɪ", "aɪ", "aʊ", "o", "e", "a"];
    ipa = ipa.replaceAll(' ', '').replaceAll('/', '').replaceAll('ˈ', '');
    let symbol = "";
    let handshape = "";
    let position = "";
    for(let i = 0; i < ipa.length; i++) {
        symbol += ipa[i];
        
        if (consonants.includes(symbol) || consonants.includes(ipa[i])) {
            // We have seen two consonants and they are not a pair
            if (handshape != "" && position == "" && !consonants.includes(symbol)) {
                position = "s";
            }
            // We have seen a valid pairing
            if (handshape != "" && position != "") {
                cueNotation.push(handshape + position);
                handshape = "";
                position = "";
                symbol = ipa[i];
            }
            switch(symbol) {
                case "d":
                case "p":
                case "ʒ":
                    handshape = "1";
                    break;
                case "ð":
                case "k":
                case "v":
                case "z":
                    handshape = "2";
                    break;
                case "s":
                case "h":
                case "ɹ":
                    handshape = "3";
                    break;
                case "hw":
                case "b":
                case "n":
                    handshape = "4";
                    break;
                case "m":
                case "t":
                case "f":
                    handshape = "5";
                    break;
                case "w":
                case "ʃ":
                case "ɫ":
                    handshape = "6";
                    break;
                case "θ":
                case "dʒ":
                case "ɡ":
                    handshape = "7";
                    break;
                case "j":
                case "ŋ":
                case "tʃ":
                    handshape = "8";
                    break;
            }
        }
        else if (vowels.includes(symbol) || vowels.includes(ipa[i])) {
            if (handshape == "") {
                handshape = "5";
            }
            else {
                // Last character was a consonant, don't need to keep track of it
                if (consonants.includes(ipa[i - 1])) {
                    symbol = ipa[i];
                }
            }
            switch(symbol) {
                case "i":
                case "ɝ":
                    position = "m";
                    break;
                case "ɔ":
                case "u":
                case "ɛ":
                    position = "c";
                    break;
                case "ʊ":
                case "ɪ":
                case "æ":
                    position = "t";
                    break;
                case "oʊ":
                case "ɑ":
                    position = "sf";
                    break;
                case "ə":
                    position = "sd";
                    break;
                case "ɔɪ":
                case "eɪ":
                    position = "c-5t";
                    break;
                case "aɪ":
                case "aʊ":
                    position = "s-5t";
                    break;
            }
        }
    }
    if (handshape != "" && position != "") {
        cueNotation.push(handshape + position);
        handshape = "";
        position = "";
    }
    if (handshape != "") {
        position = "s";
        cueNotation.push(handshape + position);
    }
    else if (position != "") {
        handshape = "5";
        cueNotation.push(handshape + position);
    }
    document.getElementById("resultCued").innerHTML = cueNotation.join(" ");
    console.log(cueNotation);
    return cueNotation;
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

