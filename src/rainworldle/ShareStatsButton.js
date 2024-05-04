import React from 'react';
import clipboardCopy from 'clipboard-copy';

function ShareStatsButton({guesses, target, gameNum, hidden}) {
    let clipboardText = "🌧️ I guessed Rain Worldle creature #"+gameNum+" in "+guesses.length+" attempts! 🌧️"

    const reversedGuesses = guesses.slice().reverse();

    // Check each guess and its properties, creating a coloured block for each match
    // eslint-disable-next-line array-callback-return
    reversedGuesses.map(guess => {
        let guessLine = ""
        for(const key in guess) {
            let propertyEmoji = "🟥"
            if(target[key] === guess[key]) {
                propertyEmoji = "🟩"
            }
            else {
                // Check if each comma-split value exists in the target key
                let values = guess[key].split(",");
                let partialMatch = false;
                values.forEach(value => {
                    if(target[key].includes(value.trim())) {
                        partialMatch = true;
                    }
                });
                if(partialMatch) { propertyEmoji = "🟧" }
            }
            guessLine += propertyEmoji;
        }
        clipboardText += '\n'+guessLine;
    })

    clipboardText += '\nhttps://tomasborsje.github.io/rainworldle'

    const handleCopyToClipboard = () => {
        clipboardCopy(clipboardText)
            .catch((error) => {
                // Handle copy error
                console.error('Copy to clipboard failed:', error);
            });
    };

    return ( hidden &&
        <div>
            <button className="ShareStatsButton" onClick={handleCopyToClipboard}>📊 Share Results 📊</button>
        </div>
    );
}

export default ShareStatsButton;
