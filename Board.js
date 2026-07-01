function initBoardUI(){
    const boardE1=document.getElementById('chessBoard');
    boardE1.innerHTML='';

    for (let row=0;row < 8; row++){
        for (let col =0 ;col < 8 ;col++){
            const cell=document.createElement('div');
            cell.classList.add('cell',(row+col)%2===0 ? 'light' : 'dark');
            cell.dataset.row=row;
            cell.dataset.col=col;
            cell.addEventListener('click',()=>handleCellClick(row,col));
            boardE1.appendChild(cell);
        }
    }

    const rankLabels=document.getElementById('rankLabels');
    rankLabels.innerHTML='';
 
 for (let r=0;r<8;r++){
    const label=document.createElement('div');
    label.className='rank-label';
    label.textContent=8-r;
    rankLabels.appendChild(label);
 }

  const fileLabels=document.getElementById('fileLabels');
  fileLabels.innerHTML='';
  for (let c=0;c < 8;c++){
    const label=document.createElement('div');
    label.className='file-label';
        label.textContent=String.fromCharCode(97+c);
        fileLabels.appendChild(label);

    
  }

}

function renderBoard(board,selectedCell,possibleMoves,checkCell){
    const cells=document.querySelectorAll('.cell');

    cells.forEach(cell => {
        const row=parseInt(cell.dataset.row);
        const col=parseInt(cell.dataset.col);

        cell.className='cell ' + ((row+col)%2===0 ? 'light' : 'dark');

        if (selectedCell && selectedCell[0] === row && selectedCell[1]===col){
            cell.classList.add('selected');
        }

        if (possibleMoves && possibleMoves.some(([r,c]) => r===row && c===col)){
            cell.classList.add('possible');
            if (board[row][col]) cell.classList.add('occupied');
        }

        if (checkCell && checkCell[0]===row && checkCell[1]===col){
            cell.classList.add('check');
        }

        cell.innerHTML='';
        const code=board[row][col];
        if(code) {
            const piece=PIECES[code];
            const span=document.createElement('span');
            span.className='piece '+ (isWhite(code) ? 'white-piece' : 'black-piece');
            span.textContent = piece.symbol;
            span.title = piece.color + ' ' +piece.name;
            cell.appendChild(span);

        }
    });
}

function updateTurnIndicator(color){
    const piece=document.getElementById('turnPiece');
    const name=document.getElementById('turnName');
    piece.textContent=color==='white' ? '♔' : '♚';
    name.textContent=color.toUpperCase();
    name.style.color=color=='white' ? '#e8c97a' : '#aaaaaa';

}

function updateStatus(message,type){

    const panel=document.getElementById('statusPanel');
    const text = document.getElementById('statusText');
    text.textContent=message;
    panel.className='status-panel ' + (type || '');
}
     
function addMoveToHistory(moveNum,white,black){
    const list =document.getElementById('moveList');
    
    if (white){
       const entry=document.createElement('div');
      entry.className='move-entry';
      entry.id='move-' + moveNum;
      entry.innerHTML=`
      <span class="move-num">${moveNum}</span>
      <span class="move-white">${white}</span>
      <span class="move-black"></span>`;
      list.appendChild(entry);
    }
  
    if (black){
        const entry=document.getElementById('move-'+moveNum);
        if (entry) entry.querySelector('.move-black').textContent=black;
    }

    list.scrollTop=list.scrollHeight;
}
    function clearMoveHistory(){
        document.getElementById('moveList').innerHTML='';
    }

    function updateCaptured(whiteCaptured,blackCaptured){
        document.getElementById('whiteCaptured').textContent=
           whiteCaptured.map(c=>PIECES[c].symbol).join('');
        document.getElementById('blackCaptured').textContent=
           blackCaptured.map(c=> PIECES[c].symbol).join('');
    }
    

    function showPromotionModal(color,callBack){
    const modal=document.getElementById('promotionModal');
    const choices=document.getElementById('promotionChoices');
    choices.innerHTML='';


    const options = color === 'white'
       ? [['Q','♕'],['R','♖'],['B','♗' ],['N', '♘' ]]
       :[['q','♛' ],['r','♜'],['b', '♝' ],['n','♞']];

    
       options.forEach(([code,symbol])=>{
        const btn=document.createElement('button');
        btn.className='promo-btn';
        btn.textContent=symbol;
        btn.onclick=()=>{
            modal.classList.remove('active');
            callBack(code);
        };
        choices.appendChild(btn);
       });
       modal.classList.add('active');
    }


         


