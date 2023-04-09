var canvas;
var canvasContext;

var ballX = 50;
var ballY = 50;
var ballSpeedX = 10;
var ballSpeedY = 5;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_HEIGHT = 100;
const THICKNESS = 10;

var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 3;
var winCondition = true;

window.onload = function (){
    canvas = document.getElementById("gc");
    canvasContext = canvas.getContext("2d"); // 2D canvas
    setInterval(game,1000/30); // calls game() on interval
    
    // To start first game/new game click
    canvas.addEventListener("mousedown", handleMouseClick);

    // continously match height of paddle to mouse 
    canvas.addEventListener("mousemove", function(evt){
        var mousePos = mousePosition(evt);
        paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);
    });

   
   
}

// runs the game loop
// change the location of stuff
// then draw the stuff
// continously repeat
function game(){
    moveThings();
    drawThings();
}

// function to move AI paddle
function paddleAI() {
    var paddle2YCenter = paddle2Y + PADDLE_HEIGHT/2;

    // (0,0) coordinate is top left corner on browser, y increases down

    if(paddle2YCenter < ballY-20){ // move paddle down
        paddle2Y+=12.5;
    }
    else if(paddle2YCenter > ballY+20){ // mode paddle up
        paddle2Y-=12.5;
    }
}

function moveThings(){
        if(winCondition){
            return;
        }

        // function to move AI paddle
        paddleAI();

        ballX = ballX + ballSpeedX;
        ballY = ballY + ballSpeedY;

        // if ball reaches left wall
        if(ballX <= 0) { 
            // If ball hits paddle
            if((ballY > paddle1Y) && (ballY < paddle1Y+PADDLE_HEIGHT)){
                ballSpeedX = -ballSpeedX;
                
                // Ball gets sent back at higher speeds if hit with edge of paddle
                var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT/2);
                ballSpeedY = deltaY * 0.35;
            }
            else{ // If ball hits wall give opposing player a point and reset it
                player2Score++;
                resetBall();
            }
        }
        // if ball reaches right wall
        if(ballX >= canvas.width) {
            // If ball hits paddle
            if((ballY > paddle2Y) && (ballY < paddle2Y+PADDLE_HEIGHT)){
                ballSpeedX = -ballSpeedX;

                // Ball gets sent back at higher speeds if hit with edge of paddle
                var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT/2);
                ballSpeedY = deltaY * 0.35;
            }
            else{ // If ball hits wall give opposing player a point and reset it
                player1Score++;
                resetBall();
            }
        }
        // if ball hits top or bottom of canvas reverse its direction
        if(ballY <= 0) {
            ballSpeedY = -ballSpeedY;
        }
        if(ballY >= canvas.height) {
            ballSpeedY = -ballSpeedY;
        }
    
}

function drawThings(){

    // Draws Canvas
    colorRect(0,0,canvas.width, canvas.height, "black"); 

    if(winCondition){
        canvasContext.fillStyle = "white";
        canvasContext.font = "20px ArcadeClassic"; // use arcade font
        // If post game
        if(player1Score > 0 || player2Score > 0){
            canvasContext.fillText("CLICK TO PLAY AGAIN", 300, 500);
        }
        else{ // if pre game
            canvasContext.fillText("CLICK TO PLAY", 350, 500);
        }
        if (player1Score >= WINNING_SCORE){
            canvasContext.fillText("Player 1 Wins!!!", 100, 150);
        } 
        if(player2Score >= WINNING_SCORE ) {
            canvasContext.fillText("Player 2 Wins!!!", 550, 150);
        }
        return;
    }

    // always draw in white first time
    drawCourt("white");
    drawNet("white");

    // change field colors to match leaders colors
    if(player1Score > player2Score){
        drawCourt("glow");
        drawNet("glow");
    }
    else if(player1Score < player2Score){
        drawCourt("glow2");
        drawNet("glow2");
    }
    else{
        drawCourt("white");
        drawNet("white");
    }


    //Draws Left Paddle
    colorRect(0,paddle1Y,THICKNESS, PADDLE_HEIGHT,"glow"); 
    //Draws Right Computer Paddle
    colorRect(canvas.width-THICKNESS,paddle2Y,THICKNESS, PADDLE_HEIGHT,"glow2"); 
    // Draws Ball
    colorCircle(ballX, ballY, 10, "white");

    // Score Printing
    canvasContext.font = "40px ArcadeClassic"; // use arcade font
    
     // Set the fill style and shadow properties for player 1 Score
    canvasContext.fillStyle = "rgb(255, 0, 230)"; // fill color
    canvasContext.shadowBlur = 40; // Shadow blur radius
    canvasContext.shadowColor = "rgba(255, 0, 230, 0.3)"; // Shadow color with alpha
    canvasContext.fillText(player1Score, 100, 100);
    
     // Set the fill style and shadow properties for player 2 Score
    canvasContext.fillStyle = "rgb(0, 200, 200)"; // fill color
    canvasContext.shadowBlur = 40; // Shadow blur radius
    canvasContext.shadowColor = "rgba(0, 200, 200, 0.3)"; // Shadow color with alpha
    canvasContext.fillText(player2Score, canvas.width-100, 100);

    
}

// draws circle
function colorCircle(centerX, centerY, radius, drawColor) {

    
// Create a radial gradient
// The inner circle is at centerX, centerY with radius= 0
// The outer circle is at centerX, centerY, with radius= radius
const gradient = canvasContext.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);

// Add three color stops
gradient.addColorStop(0,  "rgb(168, 66, 162)");
gradient.addColorStop(0.5,"rgb(196, 20, 240)");
gradient.addColorStop(1,  "rgb(80, 206, 225)");


// Set the fill style and draw a rectangle
canvasContext.fillStyle = gradient;

//canvasContext.fillStyle = drawColor;
canvasContext.beginPath();
canvasContext.arc(centerX,centerY,radius,0,Math.PI*2,true);
canvasContext.fill();
canvasContext.fillStyle = drawColor; //reset color 

}

// For coloring items
function colorRect(leftX,topY, width, height, drawColor) {

    if(drawColor == "fancy"){ // unused, if we want the canvas to be a grey-black gradient
        const BGgradient = canvasContext.createLinearGradient(0, 0, width, 0);

        // Add three color stops
        BGgradient.addColorStop(0, "rgb(40,40,40)");
        BGgradient.addColorStop(0.5, "black");
        BGgradient.addColorStop(1, "rgb(40,40,40)");
        canvasContext.fillStyle = BGgradient; 
        canvasContext.fillRect(leftX,topY,width, height);

        // reset
        canvasContext.fillStyle = "white"; 
    }
    else if(drawColor == "glow"){ // purple glow
        
        // Set the fill style and shadow properties
        canvasContext.fillStyle = "rgb(255, 0, 230)"; // fill color
        canvasContext.shadowBlur = 20; // Shadow blur radius
        canvasContext.shadowColor = "rgba(255, 0, 230, 0.5)"; // Shadow color with alpha
        canvasContext.fillRect(leftX,topY,width, height);

        //reset
        canvasContext.fillStyle = "white";
    }
    else if(drawColor == "glow2"){ // cyan glow
        // Set the fill style and shadow properties
        canvasContext.fillStyle = "rgb(0, 200, 200)"; // fill color
        canvasContext.shadowBlur = 20; // Shadow blur radius
        canvasContext.shadowColor = "rgba(0, 200, 200, 0.5)"; // Shadow color with alpha
        canvasContext.fillRect(leftX,topY,width, height);
        
        //reset
        canvasContext.fillStyle = "white";

    }
    else{
        canvasContext.fillStyle = drawColor; 
        canvasContext.fillRect(leftX,topY,width, height);
    }

}

// For moving paddle with mouse
function mousePosition(evt){
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {x:mouseX, y:mouseY}; 
}

// place ball back in middle going in opposite direction
function resetBall(){
    ballSpeedX = -ballSpeedX; //invert direction
    ballX = canvas.width/2;
    ballY = canvas.height/2;
    if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE ) {
        winCondition = true;
    }
}

// Reset scores after someone wins or waits for a click to start game
function handleMouseClick(){
    if(winCondition){
        player1Score=player2Score=0;
        winCondition=false;
    }
}

// draws the line down the middle
function drawNet(color){
    for(var y =0; y < canvas.height;y+=40){
        colorRect(canvas.width/2-1,y,2,20,color); 
    }
}

// draws the court lines
function drawCourt(color){
    
    // horizontal (floor & ceiling)
    for(var x =0; x < canvas.width;x+=40){
        colorRect(x , canvas.height-3,35,3,color); 
        colorRect(x ,0,35,3,color); 
    }
    
    //vertical(walls)
    for(var y =0; y < canvas.height;y+=40){
        colorRect(canvas.width-3, y,3,40,"glow2"); 
        colorRect(0,y,3, 40,"glow"); 
    }
}   
    

