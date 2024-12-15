// Initialisation canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let startTime = Date.now();
let elapsedTime = 0;
let gameStarted = false;
let countdown = 5;
let lastCountdownTime = 0;

// Ajouter la référence au bouton
const nextLevelBtn = document.getElementById('nextLevelBtn');

// Ajouter des variables pour gérer l'affichage du gagnant
let winner = null;
let showWinner = false;

// Position initiale unique pour tous les joueurs et tous les niveaux
const INITIAL_POSITION = { x: 50, y: 50 };

// Fonction pour le compte à rebours
function drawCountdown() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 100px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    if (countdown > 0) {
        ctx.fillText(countdown.toString(), canvas.width / 2, canvas.height / 2);
    } else if (countdown === 0) {
        ctx.fillText('GO!', canvas.width / 2, canvas.height / 2);
    }
}

// Player class
class Player {
    constructor(color, x, y, keys) {
        this.color = color;
        this.x = x;
        this.y = y;
        this.size = 20;
        this.speed = 3;
        this.score = 0;
        this.keys = keys;
        this.active = false; // Pour suivre si le joueur est actif
    }

    move() {
        if (!gameStarted || !this.active) return;

        let newX = this.x;
        let newY = this.y;
        
        if (keysPressed[this.keys.left]) newX -= this.speed;
        if (keysPressed[this.keys.right]) newX += this.speed;
        if (keysPressed[this.keys.up]) newY -= this.speed;
        if (keysPressed[this.keys.down]) newY += this.speed;

        // Vérification des limites du canvas
        newX = Math.max(0, Math.min(canvas.width - this.size, newX));
        newY = Math.max(0, Math.min(canvas.height - this.size, newY));

        // Vérification séparée pour X et Y
        if (!this.checkObstacleCollision(newX, this.y)) {
            this.x = newX;
        }
        if (!this.checkObstacleCollision(this.x, newY)) {
            this.y = newY;
        }

        // Vérification des collisions avec les autres joueurs
        const collision = this.checkPlayerCollision(this.x, this.y);
        if (collision) {
            // Gestion de la collision avec les autres joueurs...
        }
    }
    checkObstacleCollision(newX, newY) {
        for (let obstacle of obstacles) {
            if (this.intersects(
                newX, newY, this.size, this.size,
                obstacle.x, obstacle.y, obstacle.width, obstacle.height
            )) {
                return true; // Collision détectée
            }
        }
        return false;
    }

    checkPlayerCollision(newX, newY) {
        for (let player of players) {
            if (player === this || !player.active) continue;
            
            if (this.intersects(
                newX, newY, this.size, this.size,
                player.x, player.y, player.size, player.size
            )) {
                return player; // Retourne le joueur avec lequel il y a collision
            }
        }
        return null;
    }

    intersects(x1, y1, w1, h1, x2, y2, w2, h2) {
        return !(x1 + w1 <= x2 ||
                x2 + w2 <= x1 ||
                y1 + h1 <= y2 ||
                y2 + h2 <= y1);
    }


    draw() {
        if (!this.active) return; // Ne dessine pas si le joueur n'est pas actif
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}


// Ajouter un objet pour suivre les touches pressées
const keysPressed = {};

// Modifier les event listeners
document.addEventListener('keydown', (e) => {
    keysPressed[e.key] = true;
    
    // Ajouter la détection de la touche espace
    if (e.code === 'Space' && !gameStarted) {
        startNextLevel();
    }
});

document.addEventListener('keyup', (e) => {
    keysPressed[e.key] = false;
});

// Ajouter une fonction pour activer/désactiver les joueurs
function setNumberOfPlayers(num) {
    for (let i = 0; i < players.length; i++) {
        players[i].active = i < num;
    }
}

// Obstacle class
class Obstacle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw() {
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Moving Obstacle class
class MovingObstacle extends Obstacle {
    constructor(x, y, width, height, direction, speed) {
        super(x, y, width, height);
        this.direction = direction;
        this.speed = speed;
    }

    move() {
        let newX = this.x;
        let newY = this.y;

        if (this.direction === 'vertical') {
            newY += this.speed;
            if (newY + this.height > canvas.height || newY < 0) {
                this.speed = -this.speed;
                newY = this.y + this.speed;
            }
        } else if (this.direction === 'horizontal') {
            newX += this.speed;
            if (newX + this.width > canvas.width || newX < 0) {
                this.speed = -this.speed;
                newX = this.x + this.speed;
            }
        }

        // Vérifier les collisions avec les joueurs
        let collision = false;
        players.forEach(player => {
            if (player.active && player.intersects(
                player.x, player.y, player.size, player.size,
                newX, newY, this.width, this.height
            )) {
                collision = true;
            }
        });

        if (!collision) {
            this.x = newX;
            this.y = newY;
        }
    }

    draw() {
        ctx.fillStyle = 'green'; // Moving obstacles in green
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}


// Game elements
const players = [
    new Player('red', 130, 20, { 
        up: 'ArrowUp', 
        down: 'ArrowDown', 
        left: 'ArrowLeft', 
        right: 'ArrowRight' 
    }),
    new Player('blue', 130, 50, { 
        up: 'z', 
        down: 's', 
        left: 'q', 
        right: 'd' 
    }),
    new Player('green', 130, 80, { 
        up: 't', 
        down: 'g', 
        left: 'f', 
        right: 'h' 
    }),
    new Player('purple', 130, 110, { 
        up: 'i', 
        down: 'k', 
        left: 'j', 
        right: 'l' 
    })
];

const obstacles = [];

// Exit location (example: bottom right corner)
const exit = { x: canvas.width - 40, y: canvas.height - 40, size: 30 };

// Score and Level Management
let currentLevel = 1;

function nextLevel() {
    currentLevel++;
    startTime = Date.now(); // Réinitialise le chronomètre
    createNewObstacles();
}

// Reset player position when they reach the exit
function resetPlayerPosition(player) {
    player.x = INITIAL_POSITION.x;
    player.y = INITIAL_POSITION.y;
}

// Display score
function displayScores() {
    // Créer un fond pour les scores
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillRect(0, 0, canvas.width, 40);
    
    // Scores des joueurs
    ctx.font = '16px Arial';
    
    // Afficher les scores alignés avec les positions de départ
    players.forEach((player, index) => {
        ctx.fillStyle = player.color;
        ctx.textAlign = 'center';
        const scoreX = 50 + (index * 150);
        ctx.fillText(`J${index + 1}: ${player.score}`, scoreX, 25);
    });

    // Timer et niveau en haut à droite
    ctx.fillStyle = 'black';
    ctx.textAlign = 'right';
    elapsedTime = Date.now() - startTime;
    ctx.fillText(`Niveau: ${currentLevel} | Temps: ${formatTime(elapsedTime)}`, canvas.width - 20, 25);
    ctx.textAlign = 'left';
}

// Draw exit
function drawExit() {
    ctx.fillStyle = 'blue';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(exit.x, exit.y, exit.size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
}

// Check if player reaches exit
function checkExitCollision(player) {
    const dx = player.x - exit.x;
    const dy = player.y - exit.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < player.size + exit.size / 2) {
        player.score += 4;
        winner = player;
        showWinner = true;
        nextLevelBtn.style.display = 'block';
        gameStarted = false;
    }
}

// Handle player movement input
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') players[0].controls.up = true;
    if (e.key === 'ArrowDown') players[0].controls.down = true;
    if (e.key === 'ArrowLeft') players[0].controls.left = true;
    if (e.key === 'ArrowRight') players[0].controls.right = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp') players[0].controls.up = false;
    if (e.key === 'ArrowDown') players[0].controls.down = false;
    if (e.key === 'ArrowLeft') players[0].controls.left = false;
    if (e.key === 'ArrowRight') players[0].controls.right = false;
});

// Create new obstacles for the next level
function createNewObstacles() {
    obstacles.length = 0; // Reset obstacles

    switch(currentLevel) {
        case 1:
            // Niveau 1 : Un seul obstacle simple
            obstacles.push(new Obstacle(
                300,  // Position X au milieu
                200,  // Position Y
                20,   // Largeur
                200   // Hauteur
            ));
            break;

        case 2:
            // Niveau 2 : Deux obstacles formant un passage
            obstacles.push(new Obstacle(200, 100, 20, 300));
            obstacles.push(new Obstacle(400, 200, 20, 300));
            break;

        case 3:
            // Niveau 3 : Couloir en zigzag
            obstacles.push(new Obstacle(200, 100, 20, 200));
            obstacles.push(new Obstacle(200, 100, 200, 20));
            obstacles.push(new Obstacle(400, 100, 20, 200));
            break;

        case 4:
            // Niveau 4 : Premier obstacle mobile
            obstacles.push(new Obstacle(200, 100, 20, 400));
            obstacles.push(new MovingObstacle(300, 200, 50, 20, 'horizontal', 2));
            break;

        case 5:
            // Niveau 5 : Labyrinthe simple avec obstacle mobile
            obstacles.push(new Obstacle(200, 100, 20, 300));
            obstacles.push(new Obstacle(200, 400, 200, 20));
            obstacles.push(new Obstacle(400, 100, 20, 300));
            obstacles.push(new MovingObstacle(300, 250, 20, 50, 'vertical', 2));
            break;

        case 6:
            // Niveau 6 : Plusieurs obstacles mobiles
            obstacles.push(new Obstacle(300, 100, 20, 400));
            obstacles.push(new MovingObstacle(100, 200, 50, 20, 'horizontal', 2));
            obstacles.push(new MovingObstacle(400, 300, 50, 20, 'horizontal', 2.5));
            break;

        case 7:
            // Niveau 7 : Labyrinthe plus complexe
            obstacles.push(new Obstacle(150, 100, 20, 400));
            obstacles.push(new Obstacle(150, 100, 300, 20));
            obstacles.push(new Obstacle(450, 100, 20, 400));
            obstacles.push(new MovingObstacle(250, 200, 50, 20, 'horizontal', 3));
            obstacles.push(new MovingObstacle(350, 300, 20, 50, 'vertical', 2));
            break;

        case 8:
            // Niveau 8 : Parcours d'obstacles
            obstacles.push(new Obstacle(200, 50, 20, 200));
            obstacles.push(new Obstacle(200, 350, 20, 200));
            obstacles.push(new Obstacle(400, 100, 20, 200));
            obstacles.push(new Obstacle(400, 400, 20, 200));
            obstacles.push(new MovingObstacle(300, 250, 100, 20, 'horizontal', 3));
            break;

        case 9:
            // Niveau 9 : Labyrinthe avec multiples obstacles mobiles
            obstacles.push(new Obstacle(150, 100, 20, 500));
            obstacles.push(new Obstacle(350, 0, 20, 400));
            obstacles.push(new Obstacle(550, 100, 20, 500));
            obstacles.push(new MovingObstacle(200, 200, 50, 20, 'horizontal', 2));
            obstacles.push(new MovingObstacle(400, 300, 50, 20, 'horizontal', 2.5));
            obstacles.push(new MovingObstacle(300, 400, 20, 50, 'vertical', 3));
            break;

        case 10:
            // Niveau 10 : Configuration complexe
            obstacles.push(new Obstacle(100, 100, 20, 400));
            obstacles.push(new Obstacle(300, 0, 20, 300));
            obstacles.push(new Obstacle(500, 200, 20, 400));
            obstacles.push(new MovingObstacle(200, 150, 50, 20, 'horizontal', 3));
            obstacles.push(new MovingObstacle(400, 250, 50, 20, 'horizontal', 2.5));
            obstacles.push(new MovingObstacle(150, 350, 20, 50, 'vertical', 2));
            obstacles.push(new MovingObstacle(450, 450, 20, 50, 'vertical', 3));
            break;

        default:
            // Niveaux au-delà de 10 : Génération procédurale plus difficile
            const numObstacles = Math.min(5 + Math.floor(currentLevel / 2), 15);
            const numMoving = Math.min(3 + Math.floor(currentLevel / 3), 8);

            // Obstacles fixes
            for(let i = 0; i < numObstacles; i++) {
                obstacles.push(new Obstacle(
                    100 + i * 100,
                    50 + i * 50,
                    20,
                    300 - i * 20
                ));
            }

            // Obstacles mobiles
            for(let i = 0; i < numMoving; i++) {
                obstacles.push(new MovingObstacle(
                    200 + i * 80,
                    150 + i * 60,
                    i % 2 === 0 ? 50 : 20,
                    i % 2 === 0 ? 20 : 50,
                    i % 2 === 0 ? 'horizontal' : 'vertical',
                    2 + (currentLevel - 10) * 0.2
                ));
            }
    }

    // Ajuster la position de sortie selon le niveau
    if (currentLevel > 5) {
        exit.x = canvas.width - 100;
        exit.y = canvas.height - 100;
    } else {
        exit.x = canvas.width - 40;
        exit.y = canvas.height - 40;
    }
}
function formatTime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}
// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameStarted) {
        if (showWinner) {
            // Afficher le gagnant
            players.forEach(player => player.draw());
            obstacles.forEach(obstacle => obstacle.draw());
            drawExit();
            displayScores();
            displayWinner();
        } else {
            const currentTime = Date.now();
            if (currentTime - lastCountdownTime >= 1000) {
                countdown--;
                lastCountdownTime = currentTime;
                if (countdown < -1) {
                    gameStarted = true;
                    startTime = Date.now();
                }
            }
            drawCountdown();
        }
    } else {
        players.forEach(player => {
            player.move();
            player.draw();
            checkExitCollision(player);
        });

        obstacles.forEach(obstacle => {
            if (obstacle instanceof MovingObstacle) {
                obstacle.move();
            }
            obstacle.draw();
        });

        drawExit();
        displayScores();
    }

    requestAnimationFrame(gameLoop);
}

// Au début du jeu, initialiser le premier niveau :
function initGame() {
    currentLevel = 1;
    obstacles.length = 0; // Vider le tableau d'obstacles
    createNewObstacles(); // Créer uniquement les obstacles du niveau 1
    
    // Initialiser les positions des joueurs
    players.forEach(player => {
        player.x = INITIAL_POSITION.x;
        player.y = INITIAL_POSITION.y;
    });
    
    startTime = Date.now();
    gameStarted = false;
    countdown = 5;
}

// Ajouter l'event listener pour le bouton
nextLevelBtn.addEventListener('click', startNextLevel);

// Ajouter une fonction pour gérer le passage au niveau suivant
function startNextLevel() {
    nextLevelBtn.style.display = 'none';
    currentLevel++;
    obstacles.length = 0;
    createNewObstacles();
    
    // Réinitialiser tous les joueurs à la position initiale
    players.forEach(player => {
        player.x = INITIAL_POSITION.x;
        player.y = INITIAL_POSITION.y;
    });
    
    gameStarted = true;
    countdown = 5;
    lastCountdownTime = Date.now();
    startTime = Date.now();
    winner = null;
    showWinner = false;
}

// Ajouter une fonction pour afficher le gagnant
function displayWinner() {
    if (!winner) return;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Déterminer quel joueur a gagné
    let playerNumber = players.indexOf(winner) + 1;
    ctx.fillText(`Joueur ${playerNumber} gagne le niveau ${currentLevel}!`, canvas.width / 2, canvas.height / 2 - 50);
    ctx.font = '20px Arial';
    ctx.fillText('Appuyez sur ESPACE ou cliquez sur le bouton pour continuer', canvas.width / 2, canvas.height / 2 + 50);
}

// Appeler initGame avant de démarrer le jeu
initGame();
gameLoop();
