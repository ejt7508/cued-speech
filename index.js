var ipaList = [];
var pronunciationData;

// Fetch JSON data
fetch('en_US.json')
.then(response => response.json())
.then(data => {
    pronunciationData = data.en_US[0];  // Store the pronunciation data

    // Function to get the pronunciation for a specific word
    window.getPronunciation = function() {
        let resultContainer = document.getElementById('result');
        // Clear content from previous usage
        resultContainer.innerHTML = "";

        let accept = true;

        ipaList = [];
        let unknown = [];
        let wordInput = document.getElementById('wordInput').value.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\s{2,}/g," ").trim().split(" ");
        wordInput.every(element => {
            element = element.toLowerCase();
            ipa = `${pronunciationData[element]}`;
        
            if (element in pronunciationData) {
                let ipa_options = ipa.split(', ');
                if (ipa_options.length > 1) {
                    unknown.push(element);

                    ipaList.push("");
                }
                else {
                    ipaList.push(ipa);
                }
                return true;
            } else {
                resultContainer.innerHTML = `<strong>Word "` + element + `" not found.</strong>`;
                accept = false;
                return false;
            }
        });
        // If input is not acceptable, don't process
        if (!accept) {
            return;
        }
        // Some pronunciations not known, need user input
        if (unknown.length != 0) {
            displayForm(unknown);
        }
        else {
            processInput();
        }

    };
})
.catch(error => console.error('Error fetching the JSON file:', error));

function displayForm(unknown) {
    // Clear content from previous usage
    document.getElementById("formContent").innerHTML = "";
    // Make form visible
    document.getElementById("myForm").style.display = "block";
    document.getElementById("overlay").style.display = "block";

    let formContent = document.getElementById('formContent');

    unknown.forEach(element => {
        let optionContainer = document.createElement("div");
        optionContainer.classList.add("optionContainer");
        // Display word as label
        let word = document.createElement("label");
        word.setAttribute("for", "ipaOptions");
        word.innerHTML = element;
        optionContainer.appendChild(word);

        // Select tag for displaying options
        let optionSelect = document.createElement("select");
        optionSelect.name = "ipaOptions";
        optionSelect.classList.add("optionList");
        optionSelect.setAttribute("multiple", "multiple");
        optionSelect.setAttribute("required", "required");
        optionContainer.appendChild(optionSelect);

        let ipa_list = `${pronunciationData[element]}`;
        let ipa_options = ipa_list.split(', ');
        ipa_options.forEach(ipa => {
            // Create element for each ipa option and append to select
            let option = document.createElement("option");
            option.value = ipa;
            option.innerHTML = ipa;
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
    console.log(ipa);
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
window.onload = getScrollbarWidth;