let player1, player2;
let currentPlayer = 1;
let scores = { player1: 0, player2: 0 };
let questions = [];
let takenCategories = [];
let questionIndex = 0;
// DOM Elements
const categoryContainer = document.getElementById("category-cont");
const categoryBtn = document.getElementById("category-btn");
const questionText = document.getElementById("question");
const answersDiv = document.getElementById("answers");
const gameEnd = document.getElementById("game-end");
const finalScores = document.getElementById("final-scores");
const questionContainer = document.getElementById("question-container");
const TriviaApi = 'https://the-trivia-api.com/v2/questions?';
const categoryList = document.getElementById('category-list');

// Start Game Logic
document.getElementById("start-btn").addEventListener("click", function () {
  player1Name = document.getElementById('player1').value;
  player2Name = document.getElementById('player2').value;
  if (player1Name && player2Name) {
    document.querySelector(".name-container").style.display = "none";
    categoryContainer.style.display = "block";
    fetchCategories();
  } else {
    alert("Enter your names.");
  }
})
// Fetch Categories from the API
function fetchCategories() {
  fetch('https://the-trivia-api.com/api/categories')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(categories => {
      // Clear any existing categories in the dropdown
      categoryList.innerHTML = '';

      // Populate the category dropdown
      Object.keys(categories).forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category; // Use category name as text content
        categoryList.appendChild(option);
      });
    })
    .catch(error => console.error("Error in Fetching Categories:", error));
}

// Select Category and Fetch Questions
categoryBtn.addEventListener("click", function () {
  const category = categoryList.value;
  if (!takenCategories.includes(category)) {
    takenCategories.push(category);
    fetch(`${TriviaApi}${category}&limit=6`)
      .then(response => response.json())
      .then(data => {
        questions = data; // Ensure this returns an array
        questionIndex = 0;
        categoryContainer.style.display = 'none';
        questionContainer.style.display = 'block';
        displayQuestion();
      })
      .catch(error => console.log('Error:', error));
  }
});
// Display Questions and Answers
function displayQuestion() {
  const question = questions[questionIndex];
  questionText.textContent = question.question.text;
  answersDiv.innerHTML = ''; // Clear previous answers
  question.incorrectAnswers.concat(question.correctAnswer).forEach(answer => {
    const button = document.createElement('button');
    button.textContent = answer;
    button.addEventListener('click', () => checkAnswer(answer));
    answersDiv.appendChild(button);
  });
}
// Check Answer Logic
function checkAnswer(selectedAns) {
  const question = questions[questionIndex];
  if (selectedAns === question.correctAnswer) {
    let points;
    if (questionIndex < 2) {
      points = 10;
    } else if (questionIndex < 4) {
      points = 15;
    } else {
      points = 20;
    }
    if (currentPlayer === 1) {
      scores['player1'] += points;
    } else {
      scores['player2'] += points;
    }
  }
  // Switch Players
  if (currentPlayer === 1) {
    currentPlayer = 2;
  } else {
    currentPlayer = 1;
  }
  // Move to Next Question or End Game
  questionIndex++;
  if (questionIndex < questions.length) {
    displayQuestion();
  } else {
    endGame();
  }
}
// End Game and Show Results
function endGame() {
  questionContainer.style.display = 'none';
  gameEnd.style.display = 'block';
  finalScores.textContent = `${player1Name}: ${scores.player1} - ${player2Name}: ${scores.player2}`;
}

document.getElementById("restart-game").addEventListener("click", restartGame);
function restartGame() {
  // Reset scores and game variables
  scores = { player1: 0, player2: 0 };
  currentPlayer = 1;
  questionIndex = 0;
  takenCategories = [];

  // Hide game-end and show the name input screen
  gameEnd.style.display = 'none';
  document.querySelector(".name-container").style.display = "block";

  // Clear category and question containers
  categoryList.innerHTML = ''; 
  answersDiv.innerHTML = '';
}
