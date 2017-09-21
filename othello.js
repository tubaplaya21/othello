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


function getLegalMoves(x,y){}

/** @function nextTurn()
  * Starts the next turn by changing the
  * turn property of state.
  */
function nextTurn() {
  if(state.turn === 'b') state.turn = 'w';
  else state.turn = 'b';
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
  ctx.font = "30px Arial";
  ctx.fillText("Black: " + state.score.b + "   White: " + state.score.w, 750, 50);
}


function setup(){
  var canvas = document.createElement('canvas');
  canvas.width = 1000;
  canvas.height = 1000;
  document.body.appendChild(canvas);
  ctx = canvas.getContext('2d');
  renderBoard();
}

setup();
