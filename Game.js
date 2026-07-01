let state={};

function initGame(){
    state={
        board:INITIAL_BOARD.map(row=>[...row]),
        turn:'white',
        selected:null,
        possibleMoves:[],
        enPassantTarget:null, 
        castleRights:{
            whiteKingside:true,
            whiteQueenside:true,
            blackKingside:true,
            blackQueenside:true,
        },
        whiteCaptured:[],
        blackCaptured:[],
        moveHistory:[],
        moveCount:1,
        gameOver:false,
        checkCell:null,
        history:[],
    };               
     


    initBoardUI();
    render();
    updateTurnIndicator('white');
    updateStatus('Game in progress...','');
    clearMoveHistory();
    updateCaptured([],[]);
}

function render(){
    renderBoard(state.board,state.selected,state.possibleMoves,state.checkCell);
}

function handleCellClick(row,col)
{
if (state.gameOver) return;

const code=state.board[row][col];

if (state.selected){
    const [selRow,selCol]=state.selected;

if (code && pieceColor(code)===state.turn){
    if(selRow===row && selCol===col){
        state.selected=null;
        state.possibleMoves=[];
    render();
    return;
    }
    selectPiece(row,col);
    return;
}


const isLegal=state.possibleMoves.some(([r,c])=> r===row && c===col);
if (isLegal){
    executeMove(selRow,selCol,row,col);
    return;
}


state.selected=null;
state.possibleMoves=[];
render();
return;
}

if (code && pieceColor(code)===state.turn){
    selectPiece(row,col);
}
}

function selectPiece(row,col){
    state.selected=[row,col];
    state.possibleMoves=getLegalMoves(
        state.board,row,col,
        state.enPassantTarget,
        state.castleRights
    );
    render();
}

function executeMove(fromRow,fromCol,toRow,toCol)
{
state.history.push({    
    board:copyBoard(state.board),
    turn:state.turn,
    enPassantTarget:state.enPassantTarget,
    castleRights:JSON.parse(JSON.stringify(state.castleRights)),
    whiteCaptured:[...state.whiteCaptured],
    blackCaptured:[...state.blackCaptured],
    moveCount:state.moveCount,
    checkCell:state.checkCell,
});

 const movingCode=state.board[fromRow][fromCol];
 const capturedCode=state.board[toRow][toCol];
 const movingType=movingCode.toUpperCase();
 const color=pieceColor(movingCode);
 let isCastle=false;
 let isEnPassant=false; 



 if (movingType==='K' && Math.abs(toCol-fromCol)===2){
    isCastle=true;
    const backRow=color==='white' ? 7 : 0;
    if (toCol===6){
        state.board[backRow][5]=state.board[backRow][7];
        state.board[backRow][7]=null;
    }
    else{
        state.board[backRow][3]=state.board[backRow][0];
        state.board[backRow][0]=null;
    }
 }

 if (movingType === 'P' && state.enPassantTarget && 
    toRow===state.enPassantTarget[0] && toCol===state.enPassantTarget[1]){
        isEnPassant=true;
        const capturedPawnRow=color==='white' ? toRow+1 : toRow-1;
        const epCaptured=state.board[capturedPawnRow][toCol];
        state.board[capturedPawnRow][toCol]=null;
        if (color==='white') state.whiteCaptured.push(epCaptured);
        else state.blackCaptured.push(epCaptured);
    }   

 if (capturedCode){
    if (color === 'white')state.whiteCaptured.push(capturedCode);
    else state.blackCaptured.push(capturedCode);
 }

 state.board[toRow][toCol]=movingCode;
 state.board[fromRow][fromCol]=null;

 state.enPassantTarget=null;
 if (movingType==='P' && Math.abs(toRow-fromRow)===2){
    state.enPassantTarget=[
        (fromRow+toRow)/2,
        toCol
    ];
 }     
                
 if (movingType==='K'){  
    if (color==='white')
        { state.castleRights.whiteKingside= false ; state.castleRights.whiteQueenside=false;}

    else   { state.castleRights.blackKingside=false;state.castleRights.blackQueenside=false; }
   }        

  if (movingType==='R'){
            if (fromRow===7 && fromCol===7) state.castleRights.whiteKingside=false;
            if (fromRow===7 && fromCol===0)state.castleRights.whiteQueenside=false;
            if (fromRow===0 && fromCol===7)state.castleRights.blackKingside=false;
            if (fromRow===0 && fromCol===0)state.castleRights.blackQueenside=false;

        }
 
        const promotionRow=color==='white' ? 0 : 7;
        if (movingType==='P' && toRow===promotionRow){
            showPromotionModal(color,(chosenCode)=>{
                state.board[toRow][toCol]=chosenCode;
                finishMove(fromRow,fromCol,toRow,toCol,capturedCode || (isEnPassant ? 'captured' : null),isCastle,chosenCode);

            }); 
            return;          
        }
     
        finishMove(fromRow,fromCol,toRow,toCol,capturedCode || (isEnPassant ? 'captured' : null),isCastle,null);
    
    }

    

    function finishMove(fromRow,fromCol,toRow,toCol,wasCapture,isCastle,promoted){
        const movingCode=state.board[toRow][toCol];
        const color=pieceColor(movingCode);
        const opponent=color==='white' ? 'black' : 'white';

        state.turn=opponent;
        state.selected=null;
        state.possibleMoves=[];

        const oppInCheck=isInCheck(state.board,opponent);
        const oppHasMoves=hasAnyLegalMoves(state.board,opponent,state.enPassantTarget,state.castleRights);
        
        let checkCell=null;
        if (oppInCheck){
            const kingCode=opponent==='white' ? 'K' : 'k';
            for (let r = 0 ;r < 8; r++){
               for (let c =0 ; c < 8 ;c++){
                if (state.board[r][c]===kingCode) checkCell=[r,c];
               }
            }
        }
        state.checkCell=checkCell;


        const notation =  buildMoveNotation(
            state.history[state.history.length - 1].board,
            fromRow,fromCol,toRow,toCol,
            !!wasCapture , oppInCheck,oppInCheck && !oppHasMoves,isCastle)
            + (promoted ? '=' + promoted.toUpperCase() : '');
 
            if (color === 'white'){
                addMoveToHistory(state.moveCount,notation,null);
            }
            else{
                addMoveToHistory(state.moveCount,null,notation);
                state.moveCount++;
            }

            if (!oppHasMoves){
                if (oppInCheck){
                    state.gameOver=true;
                    updateStatus(`Checkmate! ${color.charAt(0).toUpperCase()+color.slice(1)} wins! 🏆`,'checkmate');
                }
            
                else{
                    state.gameOver=true;
                    updateStatus("Stalemate! It's a draw.",'stalemate');
                }
            }
            else if (oppInCheck){
                updateStatus(`${opponent.charAt(0).toUpperCase() + opponent.slice(1)} is in check!`,'check');
            }
            else{
                updateStatus('Game in progress...','');
            }
             
            
            updateTurnIndicator(state.turn);
            updateCaptured(state.whiteCaptured,state.blackCaptured);
            render();

 
    }

    function undoMove(){
        if (state.history.length===0) return ;
        const prev=state.history.pop();
        state.board=prev.board;
        state.turn=prev.turn;
        state.enPassantTarget=prev.enPassantTarget;
        state.castleRights=prev.castleRights;
        state.whiteCaptured=prev.whiteCaptured;
        state.blackCaptured=prev.blackCaptured;
        state.moveCount=prev.moveCount;
        state.checkCell=prev.checkCell;
        state.selected=null;
        state.possibleMoves=[];
        state.gameOver=false;
    

    const list=document.getElementById('moveList');
    const entries=list.querySelectorAll('.move-entry');
    if (entries.length > 0){
        const last=entries[entries.length-1];
        const blackSpan=last.querySelector('.move-black');
        if (blackSpan && blackSpan.textContent){
            blackSpan.textContent='';
        }
        else{
            last.remove();
        }
    }
    
    updateTurnIndicator(state.turn);
    updateCaptured(state.whiteCaptured,state.blackCaptured);
    updateStatus('Game in progress...', '');
    render();
}

document.getElementById('newGameBtn').addEventListener('click',initGame);
document.getElementById('undoBtn').addEventListener('click',undoMove);

initGame();
   
 