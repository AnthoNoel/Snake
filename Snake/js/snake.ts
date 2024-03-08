//Coucou ! transformation du fichier JavaScript en TypeScript pour plus de solidité ! :-) 
//-----------> https://lehomar2vinci.itch.io/ <-----------


const playBoard = document.querySelector<HTMLElement>(".play-board");
const scoreElement = document.querySelector<HTMLElement>(".score");
const scoreMaxElement = document.querySelector<HTMLElement>(".high-score");
const controls = document.querySelectorAll<HTMLElement>(".controls i");
const up = document.querySelector<HTMLElement>(".up i");

let gameOver: boolean = false;

let foodX: number, foodY: number;
let snakeX: number = 5, snakeY: number = 10;
let snakeBody: number[][] = [];
let positionX: number = 0, positionY: number = 0;
let setIntervalId: NodeJS.Timeout;
let score: number = 0;
const keyCodes: number[] = [
    37, 38, 39, 40
];

// Obtenir le score maximal depuis le stockage local
let scoreMax: number | string = localStorage.getItem("high-score") || 0;
scoreMaxElement.innerText = `High Score: ${scoreMax}`;

const changeFoodPosition = () => {
    // Générer une position de nourriture aléatoire
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
};

const handleGameOver = () => {
    // Arrêter le minuteur et recharger la page lorsque le jeu est terminé
    clearInterval(setIntervalId);
    alert('Game OVER! Click OK to try again');
    location.reload();
};

const changeDirectionSnake = (e: KeyboardEvent | { key: string }) => {
    // Empêcher le défilement, uniquement activer pour les flèches du clavier
    if ((e as KeyboardEvent).keyCode && keyCodes.indexOf((e as KeyboardEvent).keyCode) !== -1) {
        e.preventDefault();
    }

    // Direction pour le clavier
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
};

controls.forEach(key => {
    key.addEventListener('click', () => changeDirectionSnake({ key: key.dataset.key! }));
});

up.addEventListener('click', () => changeDirectionSnake({ key: up.dataset.key! }));

const initGame = () => {
    if (gameOver) return handleGameOver();
    let classHtml = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    // Vérifier si le serpent a touché la nourriture
    if (snakeX === foodX && snakeY === foodY) {
        document.documentElement.style.overflow = 'hidden';
        changeFoodPosition();
        snakeBody.push([foodX, foodY]);
        score++; // incrémenter le score de +1

        scoreMax = score >= scoreMax ? score : scoreMax;
        localStorage.setItem("high-score", scoreMax.toString());
        scoreElement.innerText = `Score: ${score}`;
        scoreMaxElement.innerText = `High Score: ${scoreMax}`;
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        // Décaler vers l'avant les valeurs des éléments dans le corps du serpent d'une unité
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY]; // définir le premier élément de snakebody sur la position actuelle

    // appliquer la position au serpent
    snakeX += positionX;
    snakeY += positionY;

    // vérifier si le serpent sort du mur
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }
    for (let i = 0; i < snakeBody.length; i++) {
        // Ajouter un nouveau div pour chaque partie du corps du serpent
        classHtml += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        // vérifier si la tête du serpent a touché son corps, si c'est le cas, définir gameover
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = classHtml;
};

changeFoodPosition();
setIntervalId = setInterval(initGame, 125);

document.addEventListener("keydown", changeDirectionSnake);
