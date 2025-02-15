// Fetch JSON data
fetch('en_US.json')
.then(response => response.json())
.then(data => {
    const pronunciationData = data.en_US[0];  // Store the pronunciation data

    // Function to get the pronunciation for a specific word
    window.getPronunciation = function() {
        let wordInput = document.getElementById('wordInput').value.toLowerCase().trim();
        let resultContainer = document.getElementById('result');
        // Clear content from previous usage
        resultContainer.innerHTML = "";
        ipa = `${pronunciationData[wordInput.toLowerCase()]}`;
        
        if (wordInput in pronunciationData) {
            let ipa_options = ipa.split(', ');
            if (ipa_options.length > 1) {
                // Clear content from previous usage
                document.getElementById("formContent").innerHTML = "";
                // Make form visible
                document.getElementById("myForm").style.display = "block";
                document.getElementById("overlay").style.display = "block";

                let optionContainer = document.createElement("div");
                optionContainer.classList.add("optionContainer");
                let formContent = document.getElementById('formContent');

                // Display word as label
                let word = document.createElement("label");
                word.setAttribute("for", "ipaOptions");
                word.innerHTML = wordInput;
                optionContainer.appendChild(word);

                // Select tag for displaying options
                let optionSelect = document.createElement("select");
                optionSelect.name = "ipaOptions";
                optionSelect.classList.add("optionList");
                optionSelect.setAttribute("multiple", "multiple");
                optionContainer.appendChild(optionSelect);

                ipa_options.forEach(element => {
                    // Create element for each ipa option and append to select
                    let option = document.createElement("option");
                    option.value = element;
                    option.innerHTML = element;
                    optionSelect.appendChild(option);
                });
                formContent.appendChild(optionContainer);
            }
            else {
                convertToCue(ipa);
            }
        } else {
            resultContainer.innerHTML = `<strong>Word not found.</strong>`;
        }
    };
})
.catch(error => console.error('Error fetching the JSON file:', error));

function closeForm() {
    document.getElementById("myForm").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function convertToCue(ipa) {
    if (ipa == "") {
        ipa = document.getElementsByClassName("optionList")[0].value;
    }
    console.log(ipa);
    var cueNotation = [];
    let consonants = ["d", "p", "ʒ", "ð", "k", "v", "z", "s", "h", "ɹ", "hw", "b", "n", "m", "t", "f", "w", "ʃ", "ɫ", "θ", "dʒ", "g", "j", "ŋ", "tʃ"];
    let vowels = ["i", "ɝ", "ɔ", "u", "ɛ", "ʊ", "ɪ", "æ", "oʊ", "ɑ", "ə", "ɔɪ", "eɪ", "aɪ", "aʊ"];
    ipa = ipa.replaceAll('/', '');
    ipa = ipa.replaceAll("ˈ", "");
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
                case "a":
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