const setting = {
    passLength: document.getElementById("lengthRange"),
    lengthLabel: document.getElementById("lengthLabel"),
    isUpInclude: document.getElementById('includeUppercase'),
    isLowInclude: document.getElementById('includeLowercase'),
    isNumInclude: document.getElementById('includeNumbers'),
    isSymInclude: document.getElementById('includeSymbols'),
    passField: document.getElementById("passwordFld")
}

function makeCharSet(isGenPass) {
    const charSetMap = {
        charLower: "abcdefghijklmnopqrstuvwxyz",
        charUpper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        charNum: "0123456789",
        charSym: "!@#$%^&*()_-+=[]{}|;:<>,.?"
    };

    // Initialize empty string for character set
    let charSet = "";

    if (setting.isLowInclude.checked) {
        charSet += charSetMap.charLower;
    }
    if (setting.isUpInclude.checked) {
        charSet += charSetMap.charUpper;
    }
    if (setting.isNumInclude.checked) {
        charSet += charSetMap.charNum;
    }
    if (setting.isSymInclude.checked) {
        charSet += charSetMap.charSym;
    }

    // Check if the character set is empty
    if (charSet.length === 0) {
        alert("Please select at least one character set.");
        return;
    }

    if (isGenPass) {
        console.log(`Running genPass() with charSet: ${charSet}`);
        genPass(charSet);
    } else {
        console.log(`Character set: ${charSet}`);
        return charSet;
    }
}
function genPass(_charSet) {
    let password = "";

    for (let i = 0; i < setting.passLength.value; i++) {
        password += _charSet.charAt(Math.floor(Math.random() * _charSet.length));
    }
    setting.passField.textContent = password;
    return 0;
}

function hasUppercase(chars) {
    return [...chars].some(c => c.toLowerCase() !== c);
}

function hasNumber(chars) {
    return [...chars].some(c => /[0-9]/.test(c));  
}

function hasSymbol(chars) {
    return [...chars].some(c => "!@#$%^&*()_-+=[]{}|;:<>,.?".includes(c));
}

// Password length range listener
setting.lengthLabel.textContent = `Length: ${setting.passLength.value}`;
setting.passLength.addEventListener("input", function() {
    // Get the value of the range input
    var lengthValue = this.value;

    // Update the textContent of the label
    setting.lengthLabel.textContent = `Length: ${lengthValue}${lengthValue == 63 ? " (WPA Character Limit)": lengthValue > 63 ? " (Greater than WPA Limit!)" : ""}`;
});
