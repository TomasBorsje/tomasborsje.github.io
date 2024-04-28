import React, { Component } from "react";
import './RainWorldlePage.css';
import './Rodondo.otf'
import Cookies from 'js-cookie';
import rainworldle_data from './rainworldle-data.json'
import seedrandom from 'seedrandom';
import GuessDropdownTextBox from "./GuessDropdownTextBox";
import GuessDisplayRow from "./GuessDisplayRow";
import ShareStatsButton from "./ShareStatsButton";
import GuessHeaderRow from "./GuessHeaderRow";
import { changeFavicon } from "../Utils.js"

class RainWorldlePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      targetGuess: null,
      gameNum: null,
      guesses: [],
      hasWon: false,
      guessOptions: []
    };
  }

  componentDidMount() {
    // Set page title to RainWorldle
    document.title = "Rain Worldle"
    // Set favicon to rain worldle
    changeFavicon("images/rainworldle/favicon.ico");

    const targetGuess = this.getGuessTarget(5);
    const gameNum = this.getGameNumber(5);
    const cookie = Cookies.get('rainworldleGuesses');

    // Load guesses from cookie
    const guesses = this.loadGuessesFromCookie(cookie, gameNum);

    // Load win state from guesses
    const hasWon = this.loadWinStateFromGuesses(cookie, guesses, gameNum);

    // Update state
    this.setState({
      targetGuess: targetGuess,
      gameNum: gameNum,
      guesses: guesses,
      hasWon: hasWon,
      guessOptions: rainworldle_data.filter(option => !guesses.some(guess => option.name === guess.name)).map(option => option.name).sort()
    });
  }

  getGuessTarget(offset) {
    const dayOffset = this.getGameNumber(offset);

    // Seed the random number generator with the day of the month
    const rng = seedrandom(dayOffset.toString());
    const randomIndex = Math.floor(rng() * rainworldle_data.length);

    // Retrieve the random object from the array
    return rainworldle_data[randomIndex];
  }

  getGameNumber(offset) {
    const targetDate = new Date('2023-11-01');
    const currentDate = new Date();

    // Calculate the difference in milliseconds
    const timeDifference = currentDate - targetDate;

    // Convert the time difference to days
    return Math.floor(timeDifference / (1000 * 60 * 60 * 24)) + offset;
  }

  loadGuessesFromCookie(cookie, gameNum) {
    if (cookie) {
      const parsedCookie = JSON.parse(cookie);
      if (parsedCookie.gameNum === gameNum) {
        return parsedCookie.guesses;
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

  loadWinStateFromGuesses(cookie, guesses, gameNum) {
    if (cookie && this.state.targetGuess !== null) {
      const parsedCookie = JSON.parse(cookie);
      if (parsedCookie.gameNum === gameNum) {
        let alreadySolved = false;
        guesses.forEach(guess => {
          if (guess['name'] === this.state.targetGuess['name']) {
            alreadySolved = true;
          }
        });
        return alreadySolved;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  handleGuess = (guessName) => {
    const newGuess = rainworldle_data.find(option => option.name === guessName);

    // If we haven't guessed this, add it to the list
    if (newGuess !== undefined && !this.state.guesses.some(item => item.name === newGuess.name)) {
      const updatedGuesses = [newGuess, ...this.state.guesses];
      this.setState({ guesses: updatedGuesses });
      Cookies.set('rainworldleGuesses', JSON.stringify({ guesses: updatedGuesses, gameNum: this.state.gameNum }), { expires: 2, samesite: "Strict" });
    }

    // Check if we won
    let correctGuess = true;
    for (const key in newGuess) {
      if (this.state.targetGuess && this.state.targetGuess[key] !== newGuess[key]) {
        correctGuess = false;
      }
    }
    if (correctGuess) { this.setState({ hasWon: true }); }
  }

  render() {
    const guessRows = this.state.guesses.map((guess, index) =>
        <GuessDisplayRow guess={guess} target={this.state.targetGuess} key={index} />
    );

    return (
        <div className="RainWorldleApp">
          <header className="Rainworldle">
            <div className="TitleArea">
              <div className="Rainworldle-Title">Rain<br />Worldle</div>
              <ShareStatsButton hidden={this.state.hasWon} guesses={this.state.guesses} target={this.state.targetGuess} gameNum={this.state.gameNum} />
              <GuessDropdownTextBox hidden={!this.state.hasWon} options={this.state.guessOptions} onGuessCallback={this.handleGuess} />
            </div>
            <div className="GuessArea">
              <GuessHeaderRow />
              {guessRows}
            </div>
          </header>
        </div>
    );
  }
}

export default RainWorldlePage;
