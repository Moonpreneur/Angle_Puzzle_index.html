let score = 0;
let timeRemaining = 180;
let timerInterval;
let playing = false;
let selectedQuestions = [];
let currentQuestionSetIndex = 0;

document.getElementById("startreset").onclick = function() {
    if (playing) {
        location.reload();
    } else {
        startGame();
    }
};

function startGame() {
    playing = true;
    score = 0;
    timeRemaining = 180;
    clearInterval(timerInterval);
    currentQuestionSetIndex = 0;
    generateQuestions();
    generateValues();
    startTimer();
    document.getElementById('score').innerText = `Score: ${score}`;
    document.getElementById("timeremaining").style.display = "block";
    document.getElementById('timeremainingvalue').innerHTML = timeRemaining;
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById("startreset").innerHTML = "Reset Game";
    document.getElementById("container").classList.remove("hidden");
    document.getElementById('start-image').classList.add('hidden');
    document.getElementById('reset').classList.remove('hidden');
    document.getElementById('questions-container').style.pointerEvents = 'auto';
    document.getElementById('values').style.pointerEvents = 'auto';
}

function startTimer() {
    timerInterval = setInterval(function() {
        timeRemaining--;
        document.getElementById('timeremainingvalue').innerText = timeRemaining;
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            gameOver();
        }
    }, 1000);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function generateQuestions() {
    const container = document.getElementById('questions-container');
    container.innerHTML = '';
    const start = currentQuestionSetIndex * 4;
    const end = start + 4;
    selectedQuestions = questions.slice(start, end);

    if (selectedQuestions.length === 0) {
        gameOver();
        return;
    }

    shuffle(selectedQuestions);  

    selectedQuestions.forEach(q => {
        const questionHTML = `
            <div class="question-block">
                <div class="droppable" id="drop${q.id}" ondrop="drop(event)" ondragover="allowDrop(event)">
                    <img src="${q.imageUrl}" alt="Angle Image" id="${q.id}" style="width:300px;height:300px;">
                </div>
                <div class="droppable smaller-droppable" id="drop${q.id}drag" ondrop="drop(event)" ondragover="allowDrop(event)">
                    Drag here
                </div>
            </div>
        `;
        container.innerHTML += questionHTML;
    });
}

function generateValues() {
    const valuesContainer = document.getElementById('values');
    valuesContainer.innerHTML = '';
    values.forEach(value => {
        const valueHTML = `
            <div class="draggable" draggable="true" ondragstart="drag(event)" id="${value}" style="display: inline-block; margin: 5px; padding: 10px; background-color: #ffcccc; border: 1px solid #000;">
                ${value}
            </div>
        `;
        valuesContainer.innerHTML += valueHTML;
    });
}


function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const dropId = event.target.id.replace('drag', '');
    const question = selectedQuestions.find(q => `drop${q.id}` === dropId);
    
    if (question && event.target.classList.contains('droppable') && event.target.id === `drop${question.id}drag` && data === question.targetAngle) {
        event.target.innerHTML = ''; 
        event.target.textContent = data;  
        updateScore(true);
        document.getElementById('result').innerText = `Correct! The angle is ${question.targetAngle}.`;
        document.getElementById('result').style.color = 'green';
        document.getElementById('correctAnswerSound').play();
        checkCompletion();
    } else {
        document.getElementById('result').innerText = `Incorrect. Try again.`;
        document.getElementById('result').style.color = 'red';
        document.getElementById('IncorrectAnswerSound').play();
        updateScore(false);
    }

    setTimeout(function() {
        document.getElementById('result').innerText = '';
    }, 2000);
}

function updateScore(isCorrect) {
    if (isCorrect) {
        score += 1;
    } else {
        score -= 1;
    }
    document.getElementById('score').innerText = `Score: ${score}`;
}

function checkCompletion() {
    const allCompleted = selectedQuestions.every(q => document.getElementById(`drop${q.id}drag`).textContent === q.targetAngle);
    if (allCompleted) {
        currentQuestionSetIndex++;
        if (currentQuestionSetIndex * 6 >= questions.length) {
            gameOver();
        } else {
            generateQuestions();
            generateValues();
        }
    }
}

function gameOver() {
    clearInterval(timerInterval);
    document.getElementById('timeremainingvalue').innerText = 'Game Over';
    document.getElementById('score').innerText = `Final Score: ${score}`;
    document.getElementById('gameOver').style.display = 'block';
    document.getElementById('questions-container').style.pointerEvents = 'none';
    document.getElementById('values').style.pointerEvents = 'none';
}
