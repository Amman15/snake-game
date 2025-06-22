const boxSize = 20;
const gameWidth = 400;
const gameHeight = 400;
let direction = 'right';
let food = {};
let score = 0;
let gameInterval;
let directionLock = false;
let snake = [ { x: 100, y: 100 }, // head
{ x: 80, y: 100 },
{ x: 60, y: 100 }]; 
$(document).keydown(function(event){
        console.log(event.key);
        switch (event.key) {
            case 'ArrowLeft': 
            if (direction !== 'right')
            {
                direction = 'left';
                directionLock = true;
            } 
                break;

            case 'ArrowRight':
                if (direction !== 'left')
                {
                    direction = 'right';
                    directionLock = true;
                } 
                break;
            
            case 'ArrowUp':
                if (direction !== 'down')
                {
                    direction = 'up';
                    directionLock = true;
                }  
                break;
            case 'ArrowDown':
                if (direction !== 'up')
                {
                    direction = 'down';
                    directionLock = true;
                }  
                break;
          }
        console.log(direction);
});
$('#restartBtn').click(function () {
        // Reset all variables
        resetSnake()
        direction = 'right';
        score = 0;
        $("#score").text(`Score: ${score}`);
        spawnFood();
        $('#restartBtn').hide(); // Hide button again
        $('#gameOverMsg').hide();
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, 100);
});
function resetSnake(){
    snake = [
        { x: 100, y: 100 }, // head
        { x: 80, y: 100 },
        { x: 60, y: 100 }
    ]; 
}
function moveSnake(){
    const head = { ...snake[0] }; //shallow copy
    console.log(head);
    switch (direction) {
        case 'left': head.x -= boxSize; break;
        case 'up': head.y -= boxSize; break;
        case 'right': head.x += boxSize; break;
        case 'down': head.y += boxSize; break;
      }
      console.log(head);
      console.log(food);
      console.log(score);
    snake.unshift(head);
    console.log(snake)
    if(checkCollision()){
        clearInterval(gameInterval); // stop the loop
        $('#restartBtn').show();
        $('#gameOverMsg').addClass('show').show();
        const audio = new Audio('./Audio/wrong.mp3');
        audio.play();
        return; 
    }
    else if (head.x === food.x && head.y === food.y){
        score++;
        $("#score").text(`Score: ${score}`);
        const audio = new Audio('./Audio/score.mp3');
        audio.play();
        spawnFood();
    }
    else{
        snake.pop();
    }
    directionLock = false;
}
function checkCollision(){
    let head = snake[0];
    console.log(head)
    if (head.x < 0 || head.x >= gameWidth || head.y < 0 || head.y >= gameHeight ){
        return true;
    }
    for (var i = 1; i < snake.length; i++){
        if (head.x === snake[i].x && head.y === snake[i].y){
            return true;
        }
    }
    return false;
}
function spawnFood(){
    let valid = false;
    while(!valid){
       const newFood = {
        x: Math.floor(Math.random() * gameWidth/boxSize) * boxSize,
        y: Math.floor(Math.random() * gameHeight/boxSize) * boxSize
    };
    const onSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);

    if (!onSnake) {
        food = newFood;
        valid = true;
    }
}
    
}
function drawGame(){
    $('#gameArea').empty();
    snake.forEach(part => {
        $('#gameArea').append(`<div class="snake" style="left:${part.x}px; top:${part.y}px;"></div>`);
      });
    
      $('#gameArea').append(`<div class="food" style="left:${food.x}px; top:${food.y}px;"></div>`);
}   
function gameLoop() {
    moveSnake();
    drawGame();
}
function startGame() {
      spawnFood();
      drawGame();
      gameInterval = setInterval(gameLoop, 100); // ✅ assign to gameInterval
}
startGame();