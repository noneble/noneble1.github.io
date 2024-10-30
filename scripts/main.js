const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function randomColor() {
    return (
        "rgb(" +
        random(0, 255) +
        ", " +
        random(0, 255) +
        ", " +
        random(0, 255) +
        ")"
    );
}

function Ball(x, y, velX, velY, color, size) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
}

Ball.prototype.draw = function () {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
};

Ball.prototype.update = function () {
    if (this.x + this.size >= width || this.x - this.size <= 0) {
        this.velX = -this.velX;
    }
    if (this.y + this.size >= height || this.y - this.size <= 0) {
        this.velY = -this.velY;
    }

    this.x += this.velX;
    this.y += this.velY;
};

Ball.prototype.collisionDetect = function () {
    for (let j = 0; j < balls.length; j++) {
        if (this !== balls[j]) {
            const dx = this.x - balls[j].x;
            const dy = this.y - balls[j].y;
            const distanceSquared = dx * dx + dy * dy;
            const radiiSum = this.size + balls[j].size;

            if (distanceSquared < radiiSum * radiiSum) {
                const newColor = randomColor();
                balls[j].color = this.color === newColor ? randomColor() : newColor;
                this.color = newColor;
            }
        }
    }
};

let balls = [];

function createBalls() {
    balls = [];
    while (balls.length < 25) {
        let size = random(10, 20);
        let ball = new Ball(
            random(0 + size, width - size),
            random(0 + size, height - size),
            random(-7, 7),
            random(-7, 7),
            randomColor(),
            size
        );
        balls.push(ball);
    }
}

createBalls();

function DemonCircle(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = 'red';
}

DemonCircle.prototype.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.lineWidth = 5;
    ctx.strokeStyle = this.color;
    ctx.stroke();
};

DemonCircle.prototype.grow = function() {
    this.size += 5; // 增大比例
};

const demonCircle = new DemonCircle(width / 2, height / 2, 30);
let gameOver = false;

function loop() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.fillRect(0, 0, width, height);

    demonCircle.draw();

    for (let i = 0; i < balls.length; i++) {
        balls[i].draw();
        balls[i].update();
        balls[i].collisionDetect();

        // 检测彩球是否与恶魔圈碰撞
        const dx = balls[i].x - demonCircle.x;
        const dy = balls[i].y - demonCircle.y;
        const distanceSquared = dx * dx + dy * dy;
        const radiiSum = balls[i].size + demonCircle.size;

        if (distanceSquared < radiiSum * radiiSum) {
            demonCircle.grow(); // 恶魔圈增大
            balls.splice(i, 1); // 删除彩球
            i--; // 调整索引
        }
    }

    if (balls.length === 0 && !gameOver) {
        gameOver = true;
        showRestartButton();
    }

    requestAnimationFrame(loop);
}

// 显示“再来一次”按钮
function showRestartButton() {
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.fillRect(width / 2 - 75, height / 2 - 25, 150, 50);
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("再来一次", width / 2 - 50, height / 2 + 5);
}

// 处理鼠标移动事件
canvas.addEventListener('mousemove', (event) => {
    if (!gameOver) {
        const rect = canvas.getBoundingClientRect();
        demonCircle.x = event.clientX - rect.left;
        demonCircle.y = event.clientY - rect.top;
    }
});

// 处理鼠标点击事件重置游戏
canvas.addEventListener('click', (event) => {
    if (gameOver) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if (x >= width / 2 - 75 && x <= width / 2 + 75 &&
            y >= height / 2 - 25 && y <= height / 2 + 25) {
            resetGame();
        }
    }
});

function resetGame() {
    demonCircle.size = 30; // 重置恶魔圈大小
    gameOver = false; // 重置游戏状态
    createBalls(); // 重新创建彩球
    loop(); // 重新开始循环
}

loop();
