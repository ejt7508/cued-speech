function displayForm(unknownGroup, cleanInput, unknownIndicesGroup, unknownOptionsGroup) {
    // Clear content from previous usage
    document.getElementById("formContent").innerHTML = "";
    document.getElementById("formSubmit").classList.remove("error");
    // Make form visible
    openForm();

    let formContent = document.getElementById('formContent');

    unknownGroup.forEach((unknown, groupIndex) => {
        unknown.forEach((element, index) => {
            let optionContainer = document.createElement("div");
            optionContainer.classList.add("optionContainer");
    
            let unknownIndex = unknownIndicesGroup[groupIndex][index];
            let labelText = "";
            if (unknownIndex == 0) {
                let nextWords = cleanInput.slice(1, Math.min(3, cleanInput.length)).join(" ");
                labelText = `<strong>${element}</strong> ${nextWords}`;
            }
            else if (unknownIndex == cleanInput.length - 1) {
                let prevWords = cleanInput.slice(-Math.min(3, cleanInput.length + 1), cleanInput.length - 1).join(" ");
                labelText = `${prevWords} <strong>${element}</strong>`;
            }
            else {
                labelText = cleanInput[unknownIndex - 1] + ` <strong>${element}</strong> ` + cleanInput[unknownIndex + 1];
            }
    
            // Display word as label
            let wordLabel = document.createElement("p");
            wordLabel.innerHTML = labelText;
            optionContainer.appendChild(wordLabel);
    
            // Create a container for the buttons
            let buttonGroup = document.createElement("div");
            buttonGroup.classList.add("buttonGroup");
    
            let unknownOptions = unknownOptionsGroup[groupIndex];
            unknownOptions[index].forEach((ipa) => {
                let ipaButton = document.createElement("button");
                ipaButton.type = "button";
                ipaButton.classList.add("ipaButton");
                ipaButton.innerHTML = ipa;
                ipaButton.dataset.word = element;
                ipaButton.dataset.value = ipa;
    
                // Click to select
                ipaButton.addEventListener("click", () => {
                    // Remove active class from other buttons of the same word
                    let buttonGroup = ipaButton.closest(".buttonGroup");
                    let buttons = buttonGroup.querySelectorAll(".ipaButton");
                    buttons.forEach(btn => {
                        btn.classList.remove("selected")
                    });
                    
                    // Mark this one as selected
                    ipaButton.classList.add("selected");
    
                    // Remove error markings
                    buttonGroup.classList.remove("error");
                    document.getElementById("formSubmit").classList.remove("error");
                });
    
                // Double-click to apply to all instances
                ipaButton.addEventListener("dblclick", () => {
                    let allButtons = document.querySelectorAll(`.ipaButton[data-word='${element}']`);
                    allButtons.forEach(btn => {
                        if (btn.dataset.value === ipa) {
                            btn.classList.add("selected");
                        } else {
                            btn.classList.remove("selected");
                        }
                    });
                });
    
                buttonGroup.appendChild(ipaButton);
            });
    
            optionContainer.appendChild(buttonGroup);
            formContent.appendChild(optionContainer);
        });
    });
}

function closeForm() {
    document.getElementById("myForm").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    toggleTabAccess(false);
}
function openForm() {
    document.getElementById("myForm").style.display = "block";
    document.getElementById("overlay").style.display = "block";
    toggleTabAccess(true);
}

function viewIPA() {
    document.getElementById("IPAselector").style.display = checkbox.checked ? 'flex' : 'none';
}

// Disable/enable tabbing below overlay
function toggleTabAccess(disable) {
    let allElements = document.querySelectorAll("body *:not(.form-popup *):not(#overlay)");

    allElements.forEach(el => {
        if (disable) {
            el.dataset.oldTabindex = el.getAttribute("tabindex");
            el.setAttribute("tabindex", "-1"); 
        } else {
            if (el.dataset.oldTabindex !== null) {
                el.setAttribute("tabindex", el.dataset.oldTabindex); 
                delete el.dataset.oldTabindex;
            } else {
                el.removeAttribute("tabindex"); 
            }
        }
    });
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

// Allow user to press enter to submit
document.getElementById("wordInput").addEventListener("keypress", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault(); // Prevents new line in the textarea
        document.getElementById("submit").click()
    }
});
document.getElementById("wordInput").addEventListener("input", function (event) {
    let button = document.getElementById("submit");
    if (button.innerHTML != "Submit") {
        button.innerHTML = "Submit";
        button.onclick = getCuedSpeech;
    }
});