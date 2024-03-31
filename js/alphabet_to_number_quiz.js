const quizForm = document.getElementById("quizForm");
const quizArea = document.getElementById("quizArea");
const questionElement = document.getElementById("question");
const answerElement = document.getElementById("answer");
const submitButton = document.getElementById("submitAnswer");
const nextQuestionButton = document.getElementById("nextQuestion");
const resultElement = document.getElementById("result");

let currentQuestion = 0;
let correctAnswers = 0;
let totalQuestions = 26; // Total number of questions (26 alphabets)
let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let wrongAnswers = []; // Array to store wrongly answered questions
let shuffledLetters = shuffleArray(letters.split('')).map(letter => {
    return {
        letter: letter,
        userAnswer: null // Placeholder for user answer, initially null
    };
});
let answerSubmitted = false; // Flag to track if answer has been submitted

quizForm.addEventListener("submit", function(event) {
    event.preventDefault();
    currentQuestion = 0;
    correctAnswers = 0;
    answerSubmitted = false; // Reset answer submission flag
    displayNextQuestion();
    quizArea.style.display = "block";
    quizForm.style.display = "none";
});

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

function displayNextQuestion() {
    if (currentQuestion < totalQuestions) {
        const letter = shuffledLetters[currentQuestion].letter;
        questionElement.textContent = `What is the number value of '${letter}'?`;
        answerElement.value = "";
        answerElement.focus();
        resultElement.textContent = ""; // Clear previous result
        nextQuestionButton.disabled = true; // Disable Next Question button
    } else {
        showResults();
    }
}

function checkAnswer() {
    const letter = shuffledLetters[currentQuestion].letter;
    const userAnswer = answerElement.value.trim().toUpperCase();
    shuffledLetters[currentQuestion].userAnswer = userAnswer;
    const correctAnswer = letters.indexOf(letter) + 1;
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

function nextQuestion() {
    currentQuestion++;
    answerSubmitted = false; // Reset answer submission flag
    displayNextQuestion();
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
        resultHTML += `<h3>All Answers:</h3>`;
        resultHTML += `<div class="table-container">`;
        resultHTML += `<table>`;
        resultHTML += `<tr>`;
        resultHTML += `<th>Question</th>`;
        resultHTML += `<th>Your Answer</th>`;
        resultHTML += `<th>Correct Answer</th>`;
        resultHTML += `</tr>`;
        for (let i = 0; i < totalQuestions; i++) {
            const letter = shuffledLetters[i].letter;
            const userAnswer = answerElement.value.trim().toUpperCase();
            const correctAnswer = letters.indexOf(letter) + 1;
            const isCorrect = userAnswer === correctAnswer.toString();
            const textColor = isCorrect ? 'green' : 'red';
            resultHTML += `<tr>`;
            resultHTML += `<td>What is the number value of '${letter}'?</td>`;
            resultHTML += `<td style="color: ${textColor}">${userAnswer}</td>`;
            resultHTML += `<td>${correctAnswer}</td>`;
            resultHTML += `</tr>`;
        }
        resultHTML += `</table>`;
        resultHTML += `</div>`;
    }
    return resultHTML;
}




function shuffleArray(array) {
    // Fisher-Yates shuffle algorithm
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
