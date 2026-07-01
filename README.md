Chess Game
  A fully playable ,single-page chess game built with vanilla HTML,CSS,and JavaScript.


Features
   => full legal Move Generation-Pawns,Knights,Bishops,rooks,Queens,and Kings,all following standard chess rules.
   => Check,Checkmate & stalemate detection.
   => Castling (kingside & queenside),with proper rules: king not in check, path not attecked ,path clear.
   =>EnPassant captures
   => Pawn promotion with piece-choice modal (Queen,Rook,Bishop,Knight) 
   =>Move history panel with algebric notation.
   =>Captures piece tracker for both sides
   => Undo move support (full state snapShot/restore)
   => Turn indicator and live games status (in Progress/check/checkmate/stalemate)
   =>elegant dark-gold themed UI with customer board styling and animations



Project Structure

Chess Game
  index.html
  style.css
  pieces.js
  Moves.js
  Board.js
  Game.js



File responsibilities
    pieces.js==Defines PIECES,INITIAL_BOARD,and utility  functions like isWhite,pieceColor,copyBoard,toAlgebraic
    moves.js==pure move logic:getPseudoMoves,getLegalMoves,isINCheck,isAttacked,hasAnyLegalMoves,BuildMovesNotation
    board.js==All DOM manipulation:rendering cells/pieces,updating panels,showing the promotion modal.
    game.js=orchestrates everything:holds state,handles click,execute,move,undo/redo.

The Separation keeps game logic (mmoves.js) independent of rendering (boardds.js),so the rule engine could be reused (eg: for an AI opponent) without touching the UI.

Getting Started
    1==>clone or download the project Folder.
    2==>Make Sure all files (index.html,style.css,piece.js,moves.js,board.js,game.js) are in the same directory.
    3==>Open index.html in any modern browser.
That's it---the game initializees automatically via initGame() at botttom of game.js


How TO Play
  1==>Click a piece belonging to the current turn's color-legal destination squares are highlighted.
  2==>click a Highlight square to move there.
  3==>click the same piece again (or an invalid square) to deselect.
  4==>when a pawn reaches the back rank,choose a promotion piece from the popup.
  5==>use UNDO moves to step back one move,or New Game to reset the board.

How to Move The Engine Works
   1==>getPseudoMoves generate all moves a piece could make based on movement patterns along (ignoring checks).
   2==> isAttacked/isInCheck scan the board to see if a square or king is under attack.
    
    

 
