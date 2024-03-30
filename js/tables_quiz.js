const tableBody = document.querySelector('table tbody'); // Select tbody
const submitBtn = document.getElementById('submit-answer');
const questionElement = document.getElementById("question");
const answerElement = document.getElementById("answer");
const quizArea = document.getElementById("quizArea");
const quizForm = document.getElementById("quizForm");
const startQuizButton = document.getElementById("submit-answer");
const submitButton = document.getElementById("submitAnswer");
const resultElement = document.getElementById("result");
const nextQuestionButton = document.getElementById("nextQuestion");

let startNumber;
let endNumber;
let currentQuestion = 0;
let correctAnswers = 0;
let totalQuestions = 0;
let questions;
let answerSubmitted = false; // Flag to track if answer has been submitted
let wrongAnswers = []; // Array to store wrongly answered questions

function createTable() {
  for (let i = 11; i <= 29; i += 5) {
    const row = document.createElement('tr');
    for (let j = i; j < i + 5; j++) {
      const cell = document.createElement('td');
      cell.textContent = j;
      cell.addEventListener('click', () => {
        cell.classList.toggle('selected');
      });
      row.appendChild(cell);
    }
    tableBody.appendChild(row);
  }
}

createTable();

submitBtn.addEventListener('click', () => {
    const selectedNumbers = document.querySelectorAll('td.selected');
    let selectedText = '';
  
// Generate questions for selected numbers
questions = [];

    // Check if any selections are made
    if (selectedNumbers.length === 0) {
        startNumber = parseInt(document.getElementById("startNumber").value);
        endNumber = parseInt(document.getElementById("endNumber").value);
        for (let i = startNumber; i <= endNumber ; i++) {
            for (let j = 2; j <= 9; j++) {
                questions.push({
                    question: `${i} x ${j} = ?`,
                    answer: i * j
                });
            }
        }
    } else {
        for (const cell of selectedNumbers) {
            const number = parseInt(cell.textContent);
            for (let i = 2; i <= 9; i++) { // Generate questions from 2 * number to 9 * number
              questions.push({
                  question: `${number} x ${i} = ?`,
                  answer: number * i
              });
            }
          }
    }
  
    // Randomize question order
    questions = questions.sort(() => Math.random() - 0.5);

    totalQuestions = questions.length;
    currentQuestion = 0;
    correctAnswers = 0;
    displayNextQuestion(); // Pass operation as an argument
    quizArea.style.display = "block";
    tableBody.style.display = "none";
    quizForm.style.display = "none";
    startQuizButton.style.display = "none";
  });

  function displayNextQuestion() {
    if (currentQuestion < totalQuestions) {
        questionElement.textContent = questions[currentQuestion].question;
        answerElement.value = "";
        answerElement.focus();
        resultElement.textContent = ""; // Clear previous result
        nextQuestionButton.disabled = true; // Disable Next Question button
    } else {
        showResults();
    }
}

submitButton.addEventListener("click", function(event) {
    event.preventDefault();
    if (!answerSubmitted) { // If answer has not been submitted yet
        checkAnswer(); // Check the answer
    } else {
        nextQuestion(); // Move to the next question
    }
});

answerElement.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent default form submission behavior
        if (!answerSubmitted) { // If answer has not been submitted yet
            checkAnswer(); // Check the answer
        } else {
            nextQuestion(); // Move to the next question
        }
    }
});

nextQuestionButton.addEventListener("click", function(event) {
    event.preventDefault();
    nextQuestion(); // Move to the next question
});

function nextQuestion() {
    currentQuestion++;
    answerSubmitted = false; // Reset answer submission flag
    displayNextQuestion();
}

function checkAnswer() {
    const userAnswer = answerElement.value.trim().toUpperCase();
    const correctAnswer = questions[currentQuestion].answer
    if (userAnswer === correctAnswer.toString()) {
        resultElement.textContent = "Correct!";
        resultElement.classList.remove("incorrect");
        resultElement.classList.add("correct");
        correctAnswers++;
    } else {
        resultElement.textContent = `Incorrect. The correct answer is ${correctAnswer}.`;
        resultElement.classList.remove("correct");
        resultElement.classList.add("incorrect");
        wrongAnswers.push({ question: currentQuestion, userAnswer, correctAnswer });
    }
    answerSubmitted = true; // Mark answer as submitted
    nextQuestionButton.disabled = false; // Enable Next Question button
}

function showResults() {
    const percentage = (correctAnswers / totalQuestions) * 100;
    let resultHTML = generateResultHTML();
    quizArea.innerHTML = resultHTML;
    submitButton.style.display = "none";
    nextQuestionButton.style.display = "none";
}

function generateResultHTML() {
    const percentage = (correctAnswers / totalQuestions) * 100;
    let resultHTML = `<h2>Quiz Results</h2>`;
    if (correctAnswers === totalQuestions) {
        resultHTML += `<p>Congratulations! You got all answers correct! 🎉</p>`;
    } else {
        resultHTML += `<p>Correct Answers: ${correctAnswers} out of ${totalQuestions}</p>`;
        resultHTML += `<p>Percentage: ${percentage.toFixed(2)}%</p>`;
        if (wrongAnswers.length > 0) {
            resultHTML += `<h3>Incorrect Answers:</h3>`;
            resultHTML += `<ul>`;
            wrongAnswers.forEach(wrongAnswer => {
                console.log('abc', questions[wrongAnswer.question])
                resultHTML += `<li>Question: '${questions[wrongAnswer.question].question}'<br/>`;
                resultHTML += `Your Answer: ${wrongAnswer.userAnswer}, Correct Answer: ${wrongAnswer.correctAnswer}</li>`;
            });
            resultHTML += `</ul>`;
        }
    }
    return resultHTML;
}