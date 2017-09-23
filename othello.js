//othello.js

/** The state of the game */
var state = {
  canMove: true,
  over: false,
  turn: 'b',
  board: [
    ['b', 'w', 'b', 'b', 'b', 'w', 'w', 'w'],
    ['b', 'w', 'b', 'b', 'b', 'w', 'w', 'w'],
    ['b', 'w', 'b', 'b', 'b', 'w', 'w', 'w'],
    ['b', 'w', 'b', 'b', 'b', 'w', 'w', 'w'],
    ['b', 'w', 'b', 'b', 'b', 'w', 'w', 'w'],
    ['b', 'w', 'b', 'b', 'b', 'w', 'w', 'w'],
    ['b', 'w', 'b', 'b', 'b', 'w', 'b', 'w'],
    ['b', 'w', 'b', 'b', 'b', 'w', 'b', null]
    /*[null,null,null,null, null,null,  null,null],
    [null,null,null,null, null,null,  null,null],
    [null,null,null,null, null,null,  null,null],
    [null,null,null,'w' , 'b' ,null,  null,null],
    [null,null,null,'b' , 'w' ,null,  null,null],
    [null,null,null,null, null,null,  null,null],
    [null,null,null,null, null,null,  null,null],
    [null,null,null,null, null,null,  null,null]*/
  ],
  score: {w: 2, b: 2}
}

var ctx;

/** @function updateScore
 * Changes score property based on board.
 */
function updateScore(){
  var wScore = 0;
  var bScore = 0;
  for(var y = 0; y < 8; y++){
    for(var x = 0; x < 8; x++){
      if(state.board[y][x] == 'w')
        wScore++;
      if(state.board[y][x] == 'b')
        bScore++;
    }
  }
  state.score = {w: wScore, b: bScore};
}

/** @function checkVictory
 * Determines if victory has been reached.
 */
function checkVictory(){
  var existsNull = false;
  for(var y = 0; y < 8; y++){
    for(var x = 0; x < 8; x++){
      if(state.board[y][x] == null){
        existsNull = true;
      }
    }
  }
  if(!existsNull || state.score.w == 0 || state.score.b == 0){
    state.over = true;
  }
}

/** @function checkValid
 * Checks for a valid move at a given square.
 */
function checkValid(x, y, color, doChange){
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
      var colorTest = state.board[testY][testX];
      if (colorTest != null && colorTest != color) {
        var diffX = testX - x;
        var diffY = testY - y;
        for (t=1;;t++) {
          var checkX = x + t * diffX;
          var checkY = y + t * diffY;
          if (checkX < 0 || checkY < 0 || checkX > 7 || checkY > 7)
            break;
          if (state.board[checkY][checkX] == null)
            break;
          if (state.board[checkY][checkX] == color) {
            isFound = true;
            var s;
            //Flip pieces between valid move and current player's pieces in line.
            if (doChange) {
              for (s = 1; s < t; s++) {
                var xChange = x + s * diffX;
                var yChange = y + s * diffY;
                state.board[yChange][xChange] = color;
                renderPiece(state.board[yChange][xChange], xChange, yChange);
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

/** @function getLegalMoves
 * Gathers possible moves for given
 * player color.
 */
function getLegalMoves(color){
  var moves = [];
  for (y = 0; y < 8; y++) {
    for (x = 0; x < 8 ; x++) {
      var valid = checkValid (x, y, color, false);
      if (valid) {
        moves.push({x: x, y: y});
      }
    }
  }
  if(moves.length === 0)
    state.canMove = false;
  else
    state.canMove = true;
  return moves;
}

/** @function applyMove
  * Applies move made by player.
  */
function applyMove(x,y){
  if(state.board[y][x])
    return;
  if(!checkValid(x, y, state.turn, true)){
    nextTurn();
    return;
  }
  state.board[y][x] = state.turn;
  renderPiece(state.board[y][x], x, y);
  updateScore();
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

/** @function boardPosition
  * Gets a board position as square from
  * mouse coordinates.
  */
function boardPosition(x, y) {
  var boardX = Math.floor(x / 65);
  var boardY = Math.floor(y / 65);
  return {x: boardX, y: boardY}
}

/** @function handleMouseDown
  * Event handler for when mouse is clicked.
  */
function handleMouseDown(event) {
  if(state.over) return;
  if(!state.canMove){
    nextTurn();
    hoverOverSquare(event);
    renderBoard();
    return;
  }
  var position = boardPosition(event.clientX, event.clientY);
  var x = position.x;
  var y = position.y;
  if(x < 0 || y < 0 || x > 7 || y > 7) return;
  var moves = getLegalMoves(state.turn);
  var foundOne = false;
  for(var i = 0; i < moves.length;){
    var test = moves.pop();
    if(test.x == x && test.y == y)
      foundOne = true;
  }
  // Make sure we're over the valid space.
  if(state.board[y][x] === null && foundOne) {
    applyMove(x,y);
    checkVictory();
    renderBoard();
  }
}

/** @function hoverOverSquare
  * Event handler for when a player is deciding
  * where to move.
  */
function hoverOverSquare(event) {
  // Make sure we have a canvas context to render to
  if(!ctx) return;
  if(state.over) return;
  var x = Math.floor(event.clientX / 65);
  var y = Math.floor(event.clientY / 65);
  // Adjust for scrolling
  // Avoid array out-of-bounds issues.
  if(x < 0 || y < 0 || x > 7 || y > 7) return;
  var moves = getLegalMoves(state.turn);
  var foundOne = false;
  for(var i = 0; i < moves.length;){
    var test = moves.pop();
    if(test.x == x && test.y == y)
      foundOne = true;
  }
  if(state.board[y][x] == null && foundOne) {
    // Highlight the space that can be moved to.
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
  * Renders a piece at the specified position
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
  * as well as any pieces on it.
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

/** @function renderBoard
  * Renders the entire game board.
  */
function renderBoard() {
  if(!ctx) return;
  for(var y = 0; y < 8; y++) {
    for(var x = 0; x < 8; x++) {
      renderSquare(x, y);
    }
  }
  ctx.fillStyle = "red";
  ctx.font = "28px Arial";
  ctx.fillText("Black: " + state.score.b + "    White: " + state.score.w, 730, 30);
  if(!state.canMove){
    ctx.font = "80px Arial";
    ctx.fillStyle = 'red';
    ctx.fillText("Player must skip!", 200, 520);
    ctx.fillText("(Click to skip)", 270, 650);
  }
  if(state.turn == 'b'){
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.fillText("Black's Turn", 380, 30);
  }
  if(state.turn == 'w'){
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.fillText("White's Turn", 380, 30);
  }
  if(state.over){
    ctx.fillStyle = 'red';
    ctx.font = "80px Arial";
    state.over = true;
    if(state.score.b > state.score.w){
      ctx.fillText("Black wins!", 310, 520);
    }
    if(state.score.w > state.score.b){
      ctx.fillText("White wins!", 300, 520);
    }
    if(state.score.b == state.score.w){
      ctx.fillText("Draw!", 400, 520);
    }
  }
}

/** @function setup
  * Sets up elements and board.
  */
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
