function GuessDisplayRow() {

    let guessSquares = []
    let columns = ["Name", "Species", "Hunter Food Pips", "Behaviour", "Region Count", "Game Version", "Colours"]

    guessSquares.push(<GuessPropertyDisplayBox header_text={"Icon"} key={0}/>)

    let propertyIndex= 1;
    columns.forEach(column=> {
        guessSquares.push(<GuessPropertyDisplayBox header_text={column} key={propertyIndex}/>)
        propertyIndex++;
    });

    return (
        <div className="GuessHeaderRow">{guessSquares}</div>
    )
}

function GuessPropertyDisplayBox({header_text}) {
    return (
        <div className="GuessColumnHeader">{header_text}</div>
    );
}

export default GuessDisplayRow;