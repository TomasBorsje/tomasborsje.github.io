import './RainWorldlePage.css';
import './Rodondo.otf'
import Cookies from 'js-cookie';
import rainworldle_data from './rainworldle-data.json'
import seedrandom from 'seedrandom';
import {useState} from "react";
import GuessDropdownTextBox from "./GuessDropdownTextBox";
import GuessDisplayRow from "./GuessDisplayRow";
import ShareStatsButton from "./ShareStatsButton";
import GuessHeaderRow from "./GuessHeaderRow";

function getGuessTarget(offset) {
  const dayOffset = getGameNumber(offset);

  // Seed the random number generator with the day of the month
  const rng = seedrandom(dayOffset.toString());
  const randomIndex = Math.floor(rng() * rainworldle_data.length);

  // Retrieve the random object from the array
  return rainworldle_data[randomIndex]
}

function getGameNumber(offset) {
  const targetDate = new Date('2023-11-01');
  const currentDate = new Date();

  // Calculate the difference in milliseconds
  const timeDifference = currentDate - targetDate;

  // Convert the time difference to days
  return Math.floor(timeDifference / (1000 * 60 * 60 * 24)) + offset;
}

function RainWorldlePage() {
  const targetGuess = getGuessTarget(5);
  const gameNum = getGameNumber(5);
  const cookie = Cookies.get('rainworldleGuesses');

  // Load guesses from cookie
  const [guesses, setGuesses] = useState(() => {
      if(cookie) {
        const parsedCookie = JSON.parse(cookie);
        if(parsedCookie.gameNum === gameNum) {
          return parsedCookie.guesses;
        }
        else {
          return [];
        }
      }
      else {
        return [];
      }
  });
  // Load win state from guesses
  const [hasWon, setHasWon] = useState(() => {
    if(cookie) {
      const parsedCookie = JSON.parse(cookie);
      if(parsedCookie.gameNum === gameNum) {
        let alreadySolved = false;
        guesses.forEach(guess => {
          if(guess['name'] === targetGuess['name']) {
            alreadySolved = true;
          }
        })
        return alreadySolved;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  });

  let guessOptions = rainworldle_data.filter(option => !guesses.some(guess => option.name === guess.name)).map(option => option.name).sort()

  const handleGuess = (guessName) => {
    const newGuess = rainworldle_data.find(option => option.name === guessName)

    // If we haven't guessed this, add it to the list
    if(newGuess !== undefined && !guesses.some(item => item.name === newGuess.name)) {
      const updatedGuesses = [newGuess, ...guesses]
      setGuesses(updatedGuesses)
      Cookies.set('rainworldleGuesses', JSON.stringify({guesses: updatedGuesses, gameNum: gameNum}), {expires: 2, samesite: "Strict"})
    }

    // Check if we won
    let correctGuess = true;
    for(const key in newGuess) {
      if (targetGuess[key] !== newGuess[key]) {
        correctGuess=false;
      }
    }
    if(correctGuess) { setHasWon(true); }
  }

  let guessRows = guesses.map((guess, index) =>
      <GuessDisplayRow guess={guess} target={targetGuess} key={index}/>
  )

  return (
    <div className="RainWorldleApp">
        <header className="Rainworldle">
          <div className="TitleArea">
            <div className="Rainworldle-Title">Rain<br/>Worldle</div>
            <ShareStatsButton hidden={hasWon} guesses={guesses} target={targetGuess} gameNum={gameNum}/>
            <GuessDropdownTextBox hidden={!hasWon} options={guessOptions} onGuessCallback={handleGuess}/>
          </div>
          <div className="GuessArea">
            <GuessHeaderRow/>
            {guessRows}
          </div>
        </header>
    </div>
  );
}



export default RainWorldlePage;
