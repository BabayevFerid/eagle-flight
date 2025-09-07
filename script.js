const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// Şəkillər
const eagleImg = new Image();
eagleImg.src = "assets/eagle.png";

const obstacleImg = new Image();
obstacleImg.src = "assets/obstacle.png";

const collectibleImg = new Image();
collectibleImg.src = "assets/collectible.png";

// Səslər
const jumpSound = new Audio("assets/jump.wav");
const pointSound = new Audio("assets/point.wav");

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

// Skor və səviyyə
let score = 0;
let level = 1;

// Klaviatura idarəsi
const keys = {};
document.addEventListener("keydown", e => {
    keys[e.code] = true;
    if(e.code === "ArrowUp" || e.code === "Space") jumpSound.play();
});
document.addEventListener("keyup", e => keys[e.code] = false);

// Maneə yaratma funksiyası
function spawnObstacles() {
    const height = Math.random() * (canvasHeight - obstacleGap - 50) + 20;
    obstacles.push({x: canvasWidth, y: 0, width: obstacleWidth, height: height});
    obstacles.push({x: canvasWidth, y: height + obstacleGap, width: obstacleWidth, height: canvasHeight - height - obstacleGap});
}

// Toplama əşyası yaratma
function spawnCollectibles() {
    const yPos = Math.random() * (canvasHeight - collectibleSize);
    collectibles.push({x: canvasWidth, y: yPos, size: collectibleSize});
}

// Çarpışma yoxlaması
function checkCollision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

// Oyun döngəsi
function gameLoop() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Qartalı hərəkət etdir
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

    // Qartalı çək
    ctx.drawImage(eagleImg, eagle.x, eagle.y, eagle.width, eagle.height);

    // Maneələri idarə et
    if (Math.random() < 0.02) spawnObstacles();

    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.x -= obstacleSpeed;
        ctx.drawImage(obstacleImg, obs.x, obs.y, obs.width, obs.height);

        if (checkCollision(eagle, obs)) {
            alert(`Oyun bitdi! Skor: ${score}, Səviyyə: ${level}`);
            document.location.reload();
        }

        if (obs.x + obs.width < 0) obstacles.splice(i, 1);
    }

    // Toplanacaq əşyaları idarə et
    if (Math.random() < 0.01) spawnCollectibles();

    for (let i = collectibles.length - 1; i >= 0; i--) {
        const c = collectibles[i];
        c.x -= obstacleSpeed;
        ctx.drawImage(collectibleImg, c.x, c.y, c.size, c.size);

        if (checkCollision(eagle, {x:c.x, y:c.y, width:c.size, height:c.size})) {
            score++;
            pointSound.play();
            collectibles.splice(i, 1);
        }

        if (c.x + c.size < 0) collectibles.splice(i, 1);
    }

    // Səviyyə artımı
    if (score > 0 && score % 10 === 0) {
        level = Math.floor(score / 10) + 1;
        obstacleSpeed = 3 + level * 0.5; // Hər səviyyədə sürət artır
    }

    // Skoru və səviyyəni göstər
    ctx.fillStyle = "black";
    ctx.font = "24px Arial";
    ctx.fillText(`Skor: ${score}`, 10, 30);
    ctx.fillText(`Səviyyə: ${level}`, 10, 60);

    requestAnimationFrame(gameLoop);
}

gameLoop();
