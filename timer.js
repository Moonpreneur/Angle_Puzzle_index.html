// Timer function
let timeRemaining = 60;

function startTimer() {
    const timerElement = document.getElementById('timeremaining');

    const timerInterval = setInterval(() => {
        timeRemaining--; 

        timerElement.innerText = `Time remaining: ${timeRemaining} sec`;

        if (timeRemaining === 0) {
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000); 
}

function endGame() {
    // Add any actions you want to perform when the game ends
    document.getElementById('gameOver').innerText = 'Game Over';
}

// Call the startTimer function to begin the countdown
