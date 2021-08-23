let canvas = document.getElementById("snake");
let context = canvas.getContext("2d");
let box = 32;
let snake = [];
snake[0] = {
    x: 8 * box,
    y: 8 * box
}
let direction = "right";
let food = {
    x: Math.floor(Math.random() * 15 + 1) * box,
    y: Math.floor(Math.random() * 15 + 1) * box
}
let points = 0;

function createBox() {
    context.fillStyle = "black";
    context.fillRect(0, 0, 16 * box, 16 * box);
}

function createSnake() {
    for (i = 0; i < snake.length; i++) {
        context.fillStyle = "purple";
        context.fillRect(snake[i].x, snake[i].y, box, box);
    }
}

function drawFood() {
    context.fillStyle = "white";
    context.fillRect(food.x, food.y, box, box);
}

document.addEventListener('keydown', update);

function update(event) {
    if (event.keyCode == 37 && direction != "right") {
        direction = "left";
    }
    if (event.keyCode == 38 && direction != "down") {
        direction = "up";
    }
    if (event.keyCode == 39 && direction != "left") {
        direction = "right";
    }
    if (event.keyCode == 40 && direction != "up") {
        direction = "down";
    }
}

function eatFood() {
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction == "right") {
        snakeX += box;
    }
    if (direction == "left") {
        snakeX -= box;
    }
    if (direction == "up") {
        snakeY -= box;
    }
    if (direction == "down") {
        snakeY += box;
    }

    if (snakeX != food.x || snakeY != food.y) {
        snake.pop();
    } else {
        food.x = Math.floor(Math.random() * 15 + 1) * box;
        food.y = Math.floor(Math.random() * 15 + 1) * box;
        points += 1000;
    }


    let newHead = {
        x: snakeX,
        y: snakeY
    }

    snake.unshift(newHead);
}

function finish() {
    let player = document.getElementById("name").value;
    let infoPlayer = {
        name: player,
        score: `${points}`
    };
    $.post("/player", infoPlayer, function (data) {
        console.log(data);
    });
}

function startGame() {
    $("#score").html(points);
    for (i = 1; i < snake.length; i++) {
        if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
            clearInterval(game);
            finish();
            alert("Game Over! :(");
            $("#game").css("visibility", "hidden");
            $("#points").css("visibility", "hidden");
            $("#score").css("visibility", "hidden");
            $("#name").css("visibility", "hidden");
            $("#text_name").css("visibility", "hidden");
            $("#play").css("visibility", "hidden");
            $.get("/ranking", function (data) {
                console.log(data);
                for (let i = 0; i < data.length; i++) {
                    $("#ranking").append(`<li>${data[i].name} - ${data[i].score}</>`)
                }
            });
        }
    }

    if (snake[0].x > 15 * box && direction == "right") {
        snake[0].x = 0;
    }
    if (snake[0].x < 0 && direction == "left") {
        snake[0].x = 16 * box;
    }
    if (snake[0].y > 15 * box && direction == "down") {
        snake[0].y = 0;
    }
    if (snake[0].y < 0 && direction == "up") {
        snake[0].y = 16 * box;
    }

    createBox();
    createSnake();
    drawFood();
    eatFood();
}

$("#play").click(function () {
    if ($("#name").val() == "") {
        alert("Insira seu nome");
    } else {
        $("#game").css("visibility", "visible");
        $("#score").css("visibility", "visible");
        $("#points").css("visibility", "visible");
        $("#exit").css("visibility", "visible");
    }
})

$("#exit").click(function () {
    document.location.reload(true);
})

let game = setInterval(startGame, 100)