// Someone thinks of a word and we keep it secret from the other players
// We will display a series of underscores depending on the length of the word.
// Each turn the player will guess 1 letter from the word.
// If guess is correct we will display the letter in the blank word.
// If incorrect we draw a piece of the hangman OR tell the user they have x amount of guesses left.
// Add incorrect guess to a div
// Start button
// Replay button

// We'll need an Id for:
// start button
// replay button
// secret word
// wrong guesses
// hangman
// guess / input

// Id Section

let startBtn = document.getElementById("startBtn");
let restartBtn = document.getElementById("restartBtn");

let secretWord = document.getElementById("secretWord");
let wrongGuesses = document.getElementById("wrongGuesses");

let hangMan = document.getElementById("hangMan");
let userInput = document.getElementById("userInput");

// variables
// random word will be for our API call
// wrong guess will be the user's incorrect input
// displayed word will be for their correct input

let randomWord = "";
let wrongGuess = "";
let displayedWord = [];

let guesses = 0;
let maxGuesses = 5;

startBtn.addEventListener("click", function () {
  // we will call our API function
  ApiCall();
});

restartBtn.addEventListener("click", function() {
  resetGame();
});

function resetGame() {
  randomWord = "";
  wrongGuess = "";
  displayedWord = [];
  guesses = 0;
  wrongGuesses.textContent = "";
  secretWord.textContent = "[Secret Word]";
  hangMan.textContent = "Hangman / Guesses left";
  userInput.readOnly = true;
  userInput.value = "";
}

function ApiCall() {
  // we initiate the fetch request from our random word api
  fetch("https://random-word-api.herokuapp.com/word")
    .then((response) => {
      // We're using .json() to parse the response into json data
      return response.json();
    })
    .then((data) => {
      console.log(data[0]);
      startGame(data[0]);
    });
}

function startGame(word) {
  displayedWord = [];
  randomWord = word;

  // now we have to change our displayed word to have _ for the length of our random word
    for(let i = 0; i<randomWord.length; i++){
        displayedWord[i] = "_";
    }
    // we will update our "game State"
    updateGameState();
    userInput.readOnly = false;
}

function updateGameState(){
    secretWord.textContent = displayedWord.join(" ");

    hangMan.textContent = `Guesses left ${guesses} / ${maxGuesses}`;
}

userInput.addEventListener("keydown", function(event) {
    if(event.key === "Enter"){
      let guess = userInput.value.toLowerCase();
      // check if user's guess is included in our secret word
      if(randomWord.includes(guess)){
          // now that we know that guess is included. We have to figure out at what indexes it's included
          for(let i = 0; i<randomWord.length; i++) {

              if(randomWord[i] === guess) {
                  displayedWord[i] = guess;
              }
          }
      } else {
        wrongGuess += guess;
        wrongGuesses.textContent = wrongGuess;
        guesses++;
        console.log(guesses);
      }

      

      updateGameState();
      userInput.value = "";
      gameEnd();

    }
});

function gameEnd() {
  // checking if user guesses = to max guesses LOSER
  // check if our random word = to displayedWord Winner

  if(guesses === maxGuesses) {
    alert(`You lose your word was ${randomWord}`);
    resetGame();
  }else if(displayedWord.join("") === randomWord) {
    alert(`Yay you won you've guessed: ${randomWord}`);
    resetGame();
  }
}