const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// Qartal parametrləri
const eagle = {
    x: 100,
    y: canvasHeight / 2,
    width: 60,
    height: 60,
    dy: 0,
    gravity: 0.5,
    jumpPower: -10
};

// Maneələr
const obstacles = [];
const obstacleWidth = 50;
const obstacleGap = 150;
let obstacleSpeed = 3;

// Toplanacaq əşyalar
const collectibles = [];
const collectibleSize = 30;

// Skor
let score = 0;

// Klaviatura idarəsi
const keys = {};
document.addEventListener("keydown", e => keys[e.code] = true);
document.addEventListener("keyup", e => keys[e.code] = false);

// Oyun döngəsi
function gameLoop() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Qartalı çək
    eagle.dy += eagle.gravity;
    eagle.y += eagle.dy;

    if (keys["ArrowUp"] || keys["Space"]) {
        eagle.dy = eagle.jumpPower;
    }

    // Sərhəd yoxlaması
    if (eagle.y + eagle.height > canvasHeight) {
        eagle.y = canvasHeight - eagle.height;
        eagle.dy = 0;
    }
    if (eagle.y < 0) {
        eagle.y = 0;
        eagle.dy = 0;
    }

    ctx.fillStyle = "brown";
    ctx.drawImage(new Image(), eagle.x, eagle.y, eagle.width, eagle.height); // Sonradan eagle.png əlavə et

    // Maneələri idarə et
    if (Math.random() < 0.02) {
        const height = Math.random() * (canvasHeight - obstacleGap - 50) + 20;
        obstacles.push({x: canvasWidth, y: 0, width: obstacleWidth, height: height});
        obstacles.push({x: canvasWidth, y: height + obstacleGap, width: obstacleWidth, height: canvasHeight - height - obstacleGap});
    }

    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.x -= obstacleSpeed;
        ctx.fillStyle = "darkgreen";
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

        // Çarpışma yoxlaması
        if (
            eagle.x < obs.x + obs.width &&
            eagle.x + eagle.width > obs.x &&
            eagle.y < obs.y + obs.height &&
            eagle.y + eagle.height > obs.y
        ) {
            alert("Oyun bitdi! Skor: " + score);
            document.location.reload();
        }

        if (obs.x + obs.width < 0) obstacles.splice(i, 1);
    }

    // Toplanacaq əşyalar
    if (Math.random() < 0.01) {
        const yPos = Math.random() * (canvasHeight - collectibleSize);
        collectibles.push({x: canvasWidth, y: yPos, size: collectibleSize});
    }

    for (let i = collectibles.length - 1; i >= 0; i--) {
        const c = collectibles[i];
        c.x -= obstacleSpeed;
        ctx.fillStyle = "yellow";
        ctx.fillRect(c.x, c.y, c.size, c.size);

        if (
            eagle.x < c.x + c.size &&
            eagle.x + eagle.width > c.x &&
            eagle.y < c.y + c.size &&
            eagle.y + eagle.height > c.y
        ) {
            score++;
            collectibles.splice(i, 1);
        }

        if (c.x + c.size < 0) collectibles.splice(i, 1);
    }

    // Skoru göstər
    ctx.fillStyle = "black";
    ctx.font = "24px Arial";
    ctx.fillText("Skor: " + score, 10, 30);

    requestAnimationFrame(gameLoop);
}

gameLoop();
