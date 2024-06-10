const quizForm = document.getElementById("quizForm");
const quizArea = document.getElementById("quizArea");
const questionElement = document.getElementById("question");
const answerElement = document.getElementById("answer");
const submitButton = document.getElementById("submitAnswer");
const nextQuestionButton = document.getElementById("nextQuestion");
const resultElement = document.getElementById("result");

let currentQuestion = 0;
let correctAnswers = 0;
const numbers = [7, 14, 21, 28, 35, 42];
let totalQuestions = numbers.length; // Total number of questions
let shuffledNumbers = shuffleArray(numbers).map(number => {
    return {
        number: number,
        userAnswer: null, // Placeholder for user answer, initially null
        circumference: (2 * 22 * number) / 7,
        area: (22 * number * number) / 7
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
        const number = shuffledNumbers[currentQuestion].number;
        questionElement.textContent = `What is the circumference and area of circle with radius = '${number}'?`;
        answerElement.value = "";
        answerElement.focus();
        resultElement.textContent = ""; // Clear previous result
        nextQuestionButton.disabled = true; // Disable Next Question button
    } else {
        showResults();
    }
}

function checkAnswer() {
    const number = shuffledNumbers[currentQuestion].number;
    const userAnswer = answerElement.value.trim();
    shuffledNumbers[currentQuestion].userAnswer = userAnswer;
    const correctAnswer = `${shuffledNumbers[currentQuestion].circumference.toString()} ${shuffledNumbers[currentQuestion].area.toString()}`
    if (userAnswer === correctAnswer) {
        resultElement.textContent = "Correct!";
        resultElement.classList.remove("incorrect");
        resultElement.classList.add("correct");
        correctAnswers++;
    } else {
        resultElement.textContent = `Incorrect. The correct answer is ${correctAnswer}.`;
        resultElement.classList.remove("correct");
        resultElement.classList.add("incorrect");
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
            const number = shuffledNumbers[i].number;
            const userAnswer = shuffledNumbers[i].userAnswer;
            const correctAnswer = `${shuffledNumbers[i].circumference.toString()} ${shuffledNumbers[i].area.toString()}`
            const isCorrect = userAnswer === correctAnswer.toString();
            const textColor = isCorrect ? 'green' : 'red';
            resultHTML += `<tr>`;
            resultHTML += `<td>What is the circumference and area of circle with radius = '${number}'?</td>`;
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
