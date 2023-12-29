const setting = {
    passLength: document.getElementById("lengthRange"),
    lengthLabel: document.getElementById("lengthLabel"),
    isUpInclude: document.getElementById('includeUppercase'),
    isNumInclude: document.getElementById('includeNumbers'),
    isSymInclude: document.getElementById('includeSymbols'),
    passField: document.getElementById("passwordFld"),
    startingSubst: document.getElementById("substrInclude")
}

function makeCharSet(isGenPass) {
    let charSet = "abcdefghijklmnopqrstuvwxyz";
    if (setting.isUpInclude.checked) charSet += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (setting.isNumInclude.checked) charSet += "0123456789";
    if (setting.isSymInclude.checked) charSet += "!@#$%^&*()_-+=[]{}|;:<>,.?";
    
    if (isGenPass) {
        console.log(`Running genPass() with charSet: ${charSet}`);
        genPass(charSet);
    } else {
        console.log(`Return charSet: ${charSet}`);
        return charSet;
    }
}

function genPass(_charSet) {
    // Initialize objects and get charSet
    let password = "";
    let counter = 0;

    // Set constant for maximum tries
    // Higher values (10 million) will take longer, but gives it a chance to successfully generate a password with startingSubst.
    // Lower values (<1m) are recommended if you have a slow CPU, but less attempts to generate desired password.
    const maxTries = 5000000;

    // Check and validate startingSubst
    if (setting.startingSubst.value.length > 0) {
        if (!validateStartingSubst(setting, _charSet)) { // Run validation function
            return 1;
        }

        const genStartTime = Date.now();
        // Run password generation loop
        while (!password.startsWith(setting.startingSubst.value)) {
            password = ""; // Reset password
            for (let i = 0; i < setting.passLength.value; i++) {
                password += _charSet.charAt(Math.floor(Math.random() * _charSet.length));
            }
            counter++; // Increase counter

            // Handle counter limit
            if (counter >= maxTries) {
                password = ""; // Clear password
                alert(`Failure: Couldn't generate desired password in ${(maxTries).toLocaleString()} attempts.`)
                console.warn(`Failed to generate password with set startingSubst within ${(maxTries).toLocaleString()} attempts. Try again with shorter subst.`);
                setting.passField.textContent = ""; // Clear field
                return 1;
            }
        }
        const genStopTime = Date.now();
        setting.passField.textContent = password; // Set generated password
        console.log(`Generated password at ${new Date().toLocaleTimeString()} in ${(counter).toLocaleString()} attempts.\nTook ${(genStopTime - genStartTime)/1000} sec.`);
        return 0;
    }

    // Empty startingSubst? Run password generation once.
    for (let i = 0; i < setting.passLength.value; i++) {
        password += _charSet.charAt(Math.floor(Math.random() * _charSet.length));
    }
    setting.passField.textContent = password;
    console.log(`Generated password at ${new Date().toLocaleTimeString()}.`);
    return 0;
}

function validateStartingSubst(_setting, _charSet) {
    if (_setting.startingSubst.value.length < 1) {
        alert("Please enter a starting substring to include in the password.");
        throw new Error("Starting substring is required.");
    }

    // Init constant for substring characters
    const substringChars = new Set(_setting.startingSubst.value);

    // Check for characters outside the specified character set
    const invalidChars = [...substringChars].filter(c => !_charSet.includes(c)).join('');

    // Check disabled character sets
    if (!_setting.isUpInclude.checked && hasUppercase(substringChars)) {
        alert("Substring contains uppercase letters, but Uppercase is not enabled.");
        console.warn("Uppercase letters in substring without Uppercase enabled.");
        return false;
    }
    if (!_setting.isNumInclude.checked && hasNumber(substringChars)) {
        alert("Substring contains numbers, but Numbers is not enabled.");  
        console.warn("Numbers in substring without Numbers enabled.");
        return false;
    }
    if (!_setting.isSymInclude.checked && hasSymbol(substringChars)) {
        alert("Substring contains symbols, but Symbols is not enabled.");
        console.warn("Symbols in substring without Symbols enabled.");
        return false;
    }

    // Check for other invalid characters
    if (invalidChars.length > 0) {
        alert(`Invalid characters found in substring: ${invalidChars}`);
        console.warn(`Invalid characters found in substring: ${invalidChars}`);
        return false;
    }

    return true;
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
    setting.lengthLabel.textContent = `Length: ${lengthValue}`;
});
