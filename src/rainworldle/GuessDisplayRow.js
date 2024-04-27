function GuessDisplayRow({guess, target}) {
    let guessSquares = []
    guessSquares.push(<GuessIconDisplayBox guessName={guess['name']}/>)

    let propertyIndex = 0;
    for(const key in guess) {
        guessSquares.push(<GuessPropertyDisplayBox guessProperty={guess[key]} targetProperty={target[key]} key={propertyIndex}/>)
        propertyIndex++;
    }

    return (
        <div className="GuessRow">{guessSquares}</div>
    )
}

function GuessIconDisplayBox({ guessName }) {
    const imageUrl = "images/rainworldle/icons/"+guessName.replaceAll(" ", "_")+".png";

    return (
        <div className="GuessIconDisplayBox">
            {imageUrl ? (
                <img className="GuessIcon" src={imageUrl} alt={guessName} />
            ) : (
                <div>?</div>
            )}
        </div>
    );
}

function GuessPropertyDisplayBox({guessProperty, targetProperty}) {
    let matchType = "Wrong";
    let text = guessProperty;

    // Handle integer comparison cases, e.g. we need the up and down arrows to indicate target is less or more
    if(isInteger(guessProperty)) {
        const guessNum = Number(guessProperty);
        const targetNum = Number(targetProperty);
        if(guessNum>targetNum) {
            text += " (↓)";
        } else if (guessNum < targetNum) {
            text += " (↑)";
        } else {
            matchType = "Correct";
        }
    }
    else {
        if(guessProperty === targetProperty) {
            // First check for correct guesses
            matchType = "Correct"
        }
        else {
            // Otherwise check for partial matches
            let values = guessProperty.split(",");
            let partialMatch = false;
            values.forEach(value => {
                if(targetProperty.includes(value.trim())) {
                    partialMatch = true;
                }
            });
            if(partialMatch) { matchType = "Partial"}
        }
    }

    return (
        <div className={matchType+"PropertyDisplayBox"}>{text}</div>
    );
}

function isInteger(str) {
    if (str === "") return false; // Empty string is not a valid integer
    return Number.isInteger(Number(str));
}

export default GuessDisplayRow;