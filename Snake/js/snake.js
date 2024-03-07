const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const scoreMaxElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");
const up = document.querySelector(".up i")


let gameOver = false;

let foodX, foodY;
let snakeX = 5, snakeY = 10;
let snakeBody = [];
let positionX = 0, positionY = 0;
let setIntervalId;
let score = 0;
const keyCodes = [
    37, 38, 39, 40
]

// Getting high score from the storage local
let scoreMax = localStorage.getItem("high-score") || 0;
scoreMaxElement.innerText = `High Score: ${scoreMax}`;

const changeFoodPosition = () => {
    // Random food position generate 
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    // Clearing timer and reload the page when game its over
    clearInterval(setIntervalId);
    alert('Game OVER! Clique sur OK pour réessayer')
    location.reload();

}
const changeDirectionSnake = (e) => {
    // prevent to scroll, just activate for keyboard arrow
    if (e.keyCode && keyCodes.indexOf(e.keyCode) !== -1) {
        e.preventDefault();
    }

    // Direction for keyboard
    if (e.key === 'ArrowUp' && positionY != 1) {
        positionX = 0;
        positionY = -1;
    } else if (e.key === 'ArrowDown' && positionY != -1) {
        positionX = 0;
        positionY = 1;
    } else if (e.key === 'ArrowLeft' && positionX != 1) {
        positionX = -1;
        positionY = 0;
    } else if (e.key === 'ArrowRight' && positionX != -1) {
        positionX = 1;
        positionY = 0;
    }

}

controls.forEach(key => {
    key.addEventListener('click', () => changeDirectionSnake({ key: key.dataset.key }))
})
up.addEventListener('click', () => changeDirectionSnake({ key: up.dataset.key }));


const initGame = () => {


    if (gameOver) return handleGameOver();
    let classHtml = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    // Check if the snake hit food
    if (snakeX === foodX && snakeY === foodY) {
        document.documentElement.style.overflow = 'hidden';
        changeFoodPosition();
        snakeBody.push([foodX, foodY])
        score++; // increment score +1

        scoreMax = score >= scoreMax ? score : scoreMax;
        localStorage.setItem("high-score", scoreMax)
        scoreElement.innerText = `Score: ${score}`;
        scoreMaxElement.innerText = `High Score: ${scoreMax}`;
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        // shifting forward the values of the elements in the snake body by one
        snakeBody[i] = snakeBody[i - 1];

    }

    snakeBody[0] = [snakeX, snakeY]; // setting first element of snakebody to current position 

    // applicate position to snake
    snakeX += positionX;
    snakeY += positionY;

    //  checking if the snake going out of wall
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }
    for (let i = 0; i < snakeBody.length; i++) {
        // Add a new div for each part of the bodysnake
        classHtml += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        // checking if the snake head hit his body, if so set gameover
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    // classHtml = `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;



    playBoard.innerHTML = classHtml;
}


changeFoodPosition();
setIntervalId = setInterval(initGame, 125);

document.addEventListener("keydown", changeDirectionSnake);
