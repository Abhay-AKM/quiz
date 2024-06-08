const quizForm = document.getElementById("quizForm");
const quizArea = document.getElementById("quizArea");
const questionElement = document.getElementById("question");
const answerElement = document.getElementById("answer");
const submitButton = document.getElementById("submitAnswer");
const nextQuestionButton = document.getElementById("nextQuestion");
const resultElement = document.getElementById("result");
const operationInput = document.getElementById("operation");

let startNumber;
let endNumber;
let currentQuestion = 0;
let correctAnswers = 0;
let totalQuestions = 0;
let numbers = [];
let answerSubmitted = false; // Flag to track if answer is submitted
let wrongAnswers = []; // Array to store wrongly answered questions
let operation;

quizForm.addEventListener("submit", function(event) {
    event.preventDefault();
    startNumber = parseInt(document.getElementById("startNumber").value);
    endNumber = parseInt(document.getElementById("endNumber").value);
    operation = document.getElementById("operation").value; // Retrieve the operation from the hidden input field
    if (isNaN(startNumber) || isNaN(endNumber) || startNumber > endNumber) {
        if (operation === 'square') {
            startNumber = 12;
            endNumber = 40;
        } else {
            startNumber = 2;
            endNumber = 30;
        }
    }
    numbers = Array.from({ length: endNumber - startNumber + 1 }, (_, i) => startNumber + i);
    shuffleNumbers(); // Shuffle the numbers array
    numbers = numbers.map(number => {
        return {
            number: number,
            userAnswer: null // Placeholder for user answer, initially null
        };
    });
    totalQuestions = numbers.length;
    currentQuestion = 0;
    correctAnswers = 0;
    displayNextQuestion(operation); // Pass operation as an argument
    quizArea.style.display = "block";
    quizForm.style.display = "none";
});

submitButton.addEventListener("click", function(event) {
    event.preventDefault();
    const userAnswer = parseInt(answerElement.value);
    checkAnswer(userAnswer);
    answerSubmitted = true; // Mark answer as submitted
});

nextQuestionButton.addEventListener("click", function(event) {
    event.preventDefault();
    displayNextQuestion();
});

answerElement.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent form submission on Enter key press
        if (!answerSubmitted) {
            submitButton.click();
        } else {
            nextQuestionButton.click();
        }
    }
});

function shuffleNumbers() {
    const seed = Math.floor(Math.random() * 100000000); // Generating random seed
    numbers = shuffleArray(numbers.slice(), seed);
}

function shuffleArray(array, seed) {
    // Initialize random number generator with given seed
    const random = (seed) => {
        let x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    };

    // Fisher-Yates shuffle algorithm
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(random(seed++) * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

function displayNextQuestion() {
    if (currentQuestion < totalQuestions) {
        const number = numbers[currentQuestion].number;
        let operationName;
        switch(operation) {
            case "square":
                operationName = "Square";
                break;
            case "cube":
                operationName = "Cube";
                break;
            // Add more cases for other operations if needed
            default:
                operationName = "";
        }
        questionElement.textContent = `What is the ${operationName} of ${number}?`;
        answerElement.value = "";
        answerElement.focus();
        submitButton.disabled = false;
        nextQuestionButton.disabled = true;
        answerSubmitted = false; // Reset answer submission flag
    } else {
        showResults();
    }
}

function checkAnswer(userAnswer) {
    numbers[currentQuestion].userAnswer = userAnswer;
    const correctAnswer = Math.pow(numbers[currentQuestion].number, operation === "square" ? 2 : 3);
    if (userAnswer === correctAnswer) {
        resultElement.textContent = "Correct!";
        resultElement.classList.remove("incorrect");
        resultElement.classList.add("correct");
        correctAnswers++;
    } else {
        resultElement.textContent = `Incorrect. The correct answer is ${correctAnswer}.`;
        resultElement.classList.remove("correct");
        resultElement.classList.add("incorrect");
        wrongAnswers.push({ question: numbers[currentQuestion].number, userAnswer, correctAnswer });
    }
    currentQuestion++;
    submitButton.disabled = true;
    nextQuestionButton.disabled = false;
}

function showResults() {
    const percentage = (correctAnswers / totalQuestions) * 100;
    let resultHTML = `<h2>Quiz Results</h2>`;
    if (correctAnswers === totalQuestions) {
        resultHTML += `<p>Congratulations! You got all answers correct! 🎉</p>`;
    } else {
        resultHTML += `<p>Correct Answers: ${correctAnswers} out of ${totalQuestions}</p>`;
        resultHTML += `<p>Percentage: ${percentage.toFixed(2)}%</p>`;
    }

    resultHTML += `<h3>All Questions:</h3>`;
    resultHTML += `<div class="table-container">`;
    resultHTML += `<table>`;
    resultHTML += `<tr>`;
    resultHTML += `<th>Question</th>`;
    resultHTML += `<th>Your Answer</th>`;
    resultHTML += `<th>Correct Answer</th>`;
    resultHTML += `</tr>`;
    numbers.forEach(number => {
        const correctAnswer = Math.pow(number.number, operation === "square" ? 2 : 3);
        resultHTML += `<tr>`;
        resultHTML += `<td>What is the ${operation === "square" ? "square" : "cube"} of ${number.number}?`;
        resultHTML += `<td style="color: ${number.userAnswer === correctAnswer ? 'green' : 'red'}">${number.userAnswer}</td>`;
        resultHTML += `<td>${correctAnswer}</td>`;
        resultHTML += `</tr>`;
    });
    resultHTML += `</table>`;
    resultHTML += `</div>`;

    quizArea.innerHTML = resultHTML;
    submitButton.style.display = "none";
    nextQuestionButton.style.display = "none";
}
