Chess Game
  A fully playable ,single-page chess game built with vanilla HTML,CSS,and JavaScript.


Features
   => full legal Move Generation-Pawns,Knights,Bishops,rooks,Queens,and Kings,all following standard chess rules.
   => Check,Checkmate & stalemate detection.
   => Castling (kingside & queenside),with proper rules: king not in check, path not atteched ,path clear.
   =>EnPassant captures.
   => Pawn promotion with piece-choice modal (Queen,Rook,Bishop,Knight) 
   =>Move history panel with algebraic notation.
   =>Captured piece tracker for both sides
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
   1->eces.js==Defines PIECES,INITIAL_BOARD,and utility  functions like isWhite,pieceColor,copyBoard,toAlgebraic
   2->moves.js==pure move logic:getPseudoMoves,getLegalMoves,isInCheck,isAttacked,hasAnyLegalMoves,buildMovesNotation
    3->board.js==All DOM manipulation:rendering cells/pieces,updating panels,showing the promotion modal.
    4->game.js=orchestrates everything:holds state,handles click,execute,move,undo/redo.

The Separation keeps game logic (moves.js) independent of rendering (boards.js),so the rule engine could be reused (eg: for an AI opponent) without touching the UI.

Getting Started
    1==>clone or download the project Folder.
    2==>Make Sure all files (index.html,style.css,piece.js,moves.js,board.js,game.js) are in the same directory.
    3==>Open index.html in any modern browser.
That's it---the game initializees automatically via initGame() at bottom of game.js


How TO Play
  1==>Click a piece belonging to the current turn's color-legal destination squares are highlighted.
  2==>click a Highlight square to move there.
  3==>click the same piece again (or an invalid square) to deselect.
  4==>when a pawn reaches the back rank,choose a promotion piece from the popup.
  5==>use UNDO moves to step back one move,or New Game to reset the board.

How to Move The Engine Works
   1==>getPseudoMoves generate all moves a piece could make based on movement patterns along (ignoring checks).
   2==> isAttached/isInCheck scan the board to see if a square or king is under attack.
   3==>getLegalMoves filters pseudo-moves by simulating each one on a board copy and rejecting any that leave the mover's own king in check,it also appends castling moves when condition are met.
   4==>hasAnyLegalMoves checks every piece of a color to determine checkmate vs stalemate.
   5==>buildMoveNotation converts a move into standard algebraic notation for the move history panel.

Special Case Handling;
    =>enPassant Capture eligibility is stored in state.enPassantTarget,which gets set right after a pawn advances two square and its reset to null on every subsequent move.
    =>castling rights are permanently disabled for a side as soon as its king moves,or as soon as the specific rook on that side moves (or is captured while still on its starting square).
    => undo functionality relies on strong a full snapshot of the game state-board,turn,castleRights,enpassantTarget,and Captured pieces-right before each move is made,so they previous before each move is made,so the previos state can be restored exactly. 


Known Limitations/possible Improvements
    =>no dismabiguation in notation for two identical pieces that an reach the same square eg:Nbd7.
    =>No Draw detection for threefold repetition or the 50-move rule.
    =>no Support for resigning or offering a draw.
    =>no sound effects/move animation.

Tech Stack/BrowserSupport
      HTML5 for structure.
      CSS3(custom properties/variables,grid,FlexBox) for Styling .
      use JSS for functioning.
