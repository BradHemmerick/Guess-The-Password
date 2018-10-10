document.addEventListener('DOMContentLoaded', () => {
//number of words the user sees
  const wordCount = 12;
  //number of guesses the user has
  var guessCount = 4;
  //empty string set to var password
  var password = '';
  //select an element with id of start from the dom. the element is a button
  var start = document.getElementById('start');
  //when clicked we run a function called toggleClasses then we run a function called startGame
  start.addEventListener('click', () => {
    toggleClasses(document.getElementById('start-screen'), 'hide', 'show');
    toggleClasses(document.getElementById('game-screen'), 'hide', 'show');
    startGame();
  });
//toggle classes function loops through thee arguments to the function starting at the second one
  function toggleClasses(element, ...classNames) {
    classNames.forEach(name => element.classList.toggle(name))
  }

  function startGame() {
    // get random words and append them to the DOM
    var wordList = document.getElementById("word-list");
    //pass in the array of words from words.js and the wordCount var
    var randomWords = getRandomValues(words);
    randomWords.forEach((word) => {
      var li = document.createElement("li");
      li.innerText = word;
      wordList.appendChild(li);
    });

    // set a secret password and the guess count display
    password = getRandomValues(randomWords, 1)[0];
    setGuessCount(guessCount);

    // add update listener for clicking on a word
    wordList.addEventListener('click', updateGame);
  }

  let getRandomValues = (array, numVals=wordCount) => shuffle(array).slice(0,numVals)

  //implementaion of Fisher–Yates shuffle algorithm
  function shuffle(array) {
    var arrayCopy = array.slice();
    for (let idx1 = arrayCopy.length - 1; idx1 > 0; idx1--) {
      // generate a random index between 0 and idx1 (inclusive)
      var idx2 = Math.floor(Math.random() * (idx1 + 1));

      // swap elements at idx1 and idx2
      [arrayCopy[idx1], arrayCopy[idx2]] = [arrayCopy[idx2], arrayCopy[idx1]]
    }
    return arrayCopy;
  }

  function setGuessCount(newCount) {
    guessCount = newCount;
    document.getElementById("guesses-remaining").innerText = `Guesses remaining: ${guessCount}.`;
  }

  function updateGame(e) {
    if (e.target.tagName === "LI" && !e.target.classList.contains("disabled")) {
      // grab guessed word, check it against password, update view
      var guess = e.target.innerText;
      var similarityScore = compareWords(guess, password);
      e.target.classList.add("disabled");
      e.target.innerText = `${e.target.innerText} --> Matching Letters: ${similarityScore}`;
      setGuessCount(guessCount - 1);

      // check whether the game is over
      if (similarityScore === password.length) {
        toggleClasses(document.getElementById("winner"), 'hide', 'show');
        this.removeEventListener('click', updateGame);
      } else if (guessCount === 0) {
        toggleClasses(document.getElementById("loser"), 'hide', 'show');
        this.removeEventListener('click', updateGame);
      }
    }
  }

  function compareWords(word1, word2) {
    if (word1.length !== word2.length) throw "Words must have the same length";
    var count = 0;
    for (let i = 0; i < word1.length; i++) {
      if (word1[i] === word2[i]) count++;
    }
    return count;
  }
});
