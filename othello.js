//othello.js

/** The state of the game */
var state = {
  action: 'idle',
  over: false,
  turn: 'b',
  board: [
    [null,null,null,null, null,null,  null,null],
    [null,null,null,null, null,null,  null,null],
    [null,null,null,null, null,null,  null,null],
    [null,null,null,'w' , 'b' ,null,  null,null],
    [null,null,null,'b' , 'w' ,null,  null,null],
    [null,null,null,null, null,null,  null,null],
    [null,null,null,null, null,null,  null,null],
    [null,null,null,null, null,null,  null,null]
  ],
  score: {w: 2, b: 2}
}

var ctx;


function checkValid(x,y,doChange){
  var minX = x > 0 ? x - 1 : 0;
  var minY = y > 0 ? y - 1 : 0;
  var maxX = x < 7 ? x + 1 : 7;
  var maxY = y < 7 ? y + 1 : 7;
  var isFound = false;
  if (state.board[y][x])
    return false;
  for (testY = minY; testY <= maxY; testY++) {
    for (testX = minX; testX <= maxX; testX++) {
      if (testX == x && testY == y)
        continue;
      var colorTest = board[testX][testY];
      if (colorTest != 0 && colorTest != color) {
        var diffX = testX - x;
        var diffY = testY - y;
        //alert (diffX +" "+ diffY);
        for (t=1;;t++) {
          var checkX = x+t*diffX;
          var checkY = y+t*diffY;
          //alert ("probing "+t+" "+checkX +" "+ checkY);
          if (checkX < 1 || checkY < 1 ||
            checkX > 8 || checkY > 8)
            break;
          if (board[checkY][checkX] == 0)
            break;
          if (board[checkY][checkX] == color) {
            found_opposite = true;
            var s;
            if (doChange) {
              for (s=1; s < t; s++) {
                var xChange = x+s*diffX;
                var yChange = y+s*diffY;
                board[yChange][xChange] = color;
                changeColor (yChange,xChange,color);
              }
            }
              break;
          }
        }
      }
    }
  }
  return isFound;
}

function getLegalMoves(x,y){
  var moves = [];
  for(var y = 0; y < 8; y++){
    for(var x = 0; x < 8; x++){
      if(state.board[y][x] == 'b'){
        var xIsSame = false;
        var yIsSame = false;
        for(var iy = 0; (y+iy) < 8; iy++){
          for(var ix = 0; (x+ix) < 8; iy++){

          }
        }
      }
    }
  }
}

function applyMove(x,y){
  if(state.turn == 'b'){
    state.board[y][x] = 'b';
  }
  if(state.turn == 'w'){
    state.board[y][x] = 'w'
  }
  nextTurn();
}

/** @function nextTurn()
  * Starts the next turn by changing the
  * turn property of state.
  */
function nextTurn() {
  if(state.turn === 'b') state.turn = 'w';
  else state.turn = 'b';
}

function boardPosition(x, y) {
  var boardX = Math.floor(x / 65);
  var boardY = Math.floor(y / 65);
  return {x: boardX, y: boardY}
}

function handleMouseDown(event) {
  var position = boardPosition(event.clientX, event.clientY);
  var x = position.x;
  var y = position.y;
  if(x < 0 || y < 0 || x > 7 || y > 7) return;
  // Make sure we're over the current player
  if(state.board[y][x] === null) {
    applyMove(x,y);
    renderBoard();
  }
}

/** @function hoverOverChecker
  * Event handler for when a player is deciding
  * where to move.
  */
function hoverOverSquare(event) {
  // Make sure we have a canvas context to render to
  if(!ctx) return;
  var x = Math.floor(event.clientX / 65);
  var y = Math.floor(event.clientY / 65);
  // Adjust for scrolling
  // Avoid array out-of-bounds issues.
  if(x < 0 || y < 0 || x > 7 || y > 7) return;
  // Make sure we're over the current player
  if(state.board[y][x] && state.board[y][x].charAt(0) === state.turn) {
    // Highlight the checker to move
    ctx.strokeWidth = 15;
    ctx.strokeStyle = "yellow";
    ctx.beginPath();
    ctx.arc(x*125+62.5, y*125+62.5, 40, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function handleMouseMove(event) {
  renderBoard();
  hoverOverSquare(event);
}

/** @function renderPiece
  * Renders a checker at the specified position
  */
function renderPiece(piece, x, y) {
  ctx.beginPath();
  if(state.board[y][x].charAt(0) === 'w') {
    ctx.fillStyle = '#fff';
  } else {
    ctx.fillStyle = '#000';
  }
  ctx.arc(x*125+62.5, y*125+62.5, 40, 0, Math.PI * 2);
  ctx.fill();
}

/** @function renderSquare
  * Renders a single square on the game board
  * as well as any checkers on it.
  */
function renderSquare(x,y) {
  if((x + y) % 2 == 1) {
    ctx.fillStyle = '#006400';
    ctx.fillRect(x*125, y*125, 125, 125);
    if(state.board[y][x]) {
      renderPiece(state.board[y][x], x, y);
    }
  }
  else{
    ctx.fillStyle = '#228B22'
    ctx.fillRect(x*125, y*125, 125, 125)
    if(state.board[y][x]) {
      renderPiece(state.board[y][x], x, y);
    }
  }
}

/** @function renderBoard()
  * Renders the entire game board.
  */
function renderBoard() {
  if(!ctx) return;
  for(var y = 0; y < 8; y++) {
    for(var x = 0; x < 8; x++) {
      renderSquare(x, y);
    }
  }
  ctx.fillStyle = "#FFF"
  ctx.font = "25px Arial";
  ctx.fillText("Black: " + state.score.b + "    White: " + state.score.w, 755, 30);
}


function setup(){
  var canvas = document.createElement('canvas');
  canvas.width = 1000;
  canvas.height = 1000;
  canvas.onmousemove = handleMouseMove;
  canvas.onmousedown = handleMouseDown;
  document.body.appendChild(canvas);
  ctx = canvas.getContext('2d');
  renderBoard();
}

setup();
