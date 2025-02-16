var ipaList = [];
var pronunciationData;

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
        let unknown = [];
        let unknownIndices = [];
        let unknownOptions = [];
        let wordInput = document.getElementById('wordInput').value.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\s{2,}/g," ").trim().split(" ");
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

function displayForm(unknown, wordInput, unknownIndices, unknownOptions) {
    // Clear content from previous usage
    document.getElementById("formContent").innerHTML = "";
    // Make form visible
    document.getElementById("myForm").style.display = "block";
    document.getElementById("overlay").style.display = "block";

    let formContent = document.getElementById('formContent');

    unknown.forEach((element, index) => {
        let optionContainer = document.createElement("div");
        optionContainer.classList.add("optionContainer");

        let unknownIndex = unknownIndices[index];
        let labelText = "";
        if (unknownIndex == 0) {
            let nextWords = wordInput.slice(1, Math.min(3, wordInput.length)).join(" ");
            labelText = `<strong>${element}</strong> ${nextWords}`;
        }
        else if (unknownIndex == wordInput.length - 1) {
            let prevWords = wordInput.slice(-Math.min(3, wordInput.length - 1), wordInput.length).join(" ");
            labelText = `${prevWords} <strong>${element}</strong>`;
        }
        else {
            labelText = wordInput[unknownIndex - 1] + ` <strong>${element}</strong> ` + wordInput[unknownIndex + 1];
        }
        // Display word as label
        let wordLabel = document.createElement("label");
        wordLabel.setAttribute("for", "ipaOptions");
        wordLabel.innerHTML = labelText;
        optionContainer.appendChild(wordLabel);

        // Select tag for displaying options
        let optionSelect = document.createElement("select");
        optionSelect.name = element;
        optionSelect.classList.add("optionList");
        optionSelect.setAttribute("multiple", "multiple");
        optionSelect.setAttribute("required", "required");
        optionContainer.appendChild(optionSelect);

        unknownOptions[index].forEach(ipa => {
            // Create element for each ipa option and append to select
            let option = document.createElement("option");
            option.value = ipa;
            option.innerHTML = ipa;

            // Double click to make same words have the same pronunciation
            option.addEventListener("dblclick", () => {
                console.log("double click");
                let elements = document.getElementsByName(element);
                elements.forEach(element => {
                    element.value = option.value;
                });
            });

            optionSelect.appendChild(option);
        });

        formContent.appendChild(optionContainer);
    });
}
function processInput() {
    let formIndex = 0;
    let completeIPA = "";
    ipaList.forEach((element, index) => {
        if (element == "") {
            ipaList[index] = document.getElementsByClassName("optionList")[formIndex].value;
            formIndex++;
        }
        completeIPA += ipaList[index].replaceAll('/', '') + " ";
    });
    completeIPA = "/" + completeIPA.slice(0, -1) + "/";
    console.log(completeIPA);
    document.getElementById("resultIPA").innerHTML = completeIPA;
    convertToCue(completeIPA);
}
function closeForm() {
    document.getElementById("myForm").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}
function openForm() {
    document.getElementById("myForm").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function convertToCue(ipa) {
    if (ipa == "") {
        ipa = document.getElementsByClassName("optionList")[0].value;
    }
    var cueNotation = [];
    let consonants = ["d", "p", "ʒ", "ð", "k", "v", "z", "s", "h", "ɹ", "hw", "b", "n", "m", "t", "f", "w", "ʃ", "ɫ", "θ", "dʒ", "g", "j", "ŋ", "tʃ"];
    let vowels = ["i", "ɝ", "ɔ", "u", "ɛ", "ʊ", "ɪ", "æ", "oʊ", "ɑ", "ə", "ɔɪ", "eɪ", "aɪ", "aʊ"];
    ipa = ipa.replaceAll(' ', '').replaceAll('/', '').replaceAll('ˈ', '');
    let symbol = "";
    let handshape = "";
    let position = "";
    for(let i = 0; i < ipa.length; i++) {
        symbol += ipa[i];
        if (consonants.includes(ipa[i])) {
            symbol = "";
            if (handshape != "") {
                position = "s";
                cueNotation.push(handshape + position);
                handshape = "";
                position = "";
            }
            switch(ipa[i]) {
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
                case "g":
                    handshape = "7";
                    break;
                case "j":
                case "ŋ":
                case "tʃ":
                    handshape = "8";
                    break;
            }
        }
        else if (vowels.includes(symbol)) {
            if (handshape == "") {
                handshape = "5";
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
            cueNotation.push(handshape + position);
            handshape = "";
            position = "";
            symbol = "";
        }
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

function getScrollbarWidth() {
    let formContent = document.getElementById("formContent");
    
    // Ensure the element exists
    if (!formContent) return 0;

    // Create a temporary div with a scrollbar
    let scrollDiv = document.createElement("div");
    scrollDiv.style.visibility = "hidden";
    scrollDiv.style.overflow = "scroll";
    scrollDiv.style.width = "50px";
    scrollDiv.style.height = "50px";
    document.body.appendChild(scrollDiv);

    // Calculate scrollbar width
    let scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;

    // Remove the temporary div
    document.body.removeChild(scrollDiv);

    formContent.style.paddingLeft = scrollbarWidth + "px";
}
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("wordInput").addEventListener("keypress", function (event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault(); // Prevents new line in the textarea
            document.getElementById("submit").click()
        }
    });
});

window.onload = getScrollbarWidth;

function processForm() {
    let allSelects = document.querySelectorAll("#formContent select");
    let valid = true;

    allSelects.forEach(select => {
        if (select.value == "") {
            valid = false;
            select.classList.add("error");
        }
        else {
            select.classList.remove("error");
        }
    });
    if (valid) {
        processInput();
        closeForm();
    }
}