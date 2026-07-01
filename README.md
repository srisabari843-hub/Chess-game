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
    pieces.js==Defines PIECES,INITIAL_BOARD,and utility, functions like isWhite,pieceColor,copyBoard,toAlgebraic
    moves.js==

 
