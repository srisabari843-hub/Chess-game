const PIECES={
    K:{symbol:'♔',color:'white',name:'King',value:0 },
    Q:{symbol:'♕', color:'white',name:'Queen',value:9 },
    R:{symbol:'♖',color:'white',name:'Rook',value:5},
    B:{symbol:'♗',color:'white',name:'Bishop',value:3},
    N:{symbol:'♘',color:'white',name:'Knight',value:3 },
    P: {symbol:'♙',color:'white',name:'Pawn',value:1 },

    k: {symbol:'♚',color:'black',name:'King',value:0 },
    q: {symbol:'♛',color:'black',name:'Queen',value:9 },
    r:{symbol:'♜',color:'black',name:'Rook',value:5 },
    b:{symbol:'♝',color:'black',name:'Bishop',value:3 },
    n:{symbol:'♞',color:'black',name:'Knight',value:3 },
    p:{symbol:'♟',color:'black',name:'Pawn',value:3} ,
};


const INITIAL_BOARD=[
    ['r','n','b','q','k','b','n','r'],
    ['p','p','p','p','p','p','p','p'],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    ['P','P','P','P','P','P','P','P'],
    ['R','N','B','Q','K','B','N','R'],
];


function getPiece(code){
    return code ? PIECES[code]:null;
}

function isWhite(code){
    return code && code===code.toUpperCase();
}

function isBlack(code){
    return code && code==code.toLowerCase();
}

function sameColor(a,b){
    if (!a || !b) return false;
    return isWhite(a)===isWhite(b);
}

function piececolor(code){
 if(!code) return null;
 return isWhite(code)? 'white' : 'black' ;
}


function copyBoard(board){
    return board.map(row=>[...row]);
}



function colToFile(col){
  return String.fromCharCode(97+col);
}



function rowToRank(row){
    return 8 - row;
}


function toAlgebraic(row,col){
    return colToFile(col)+rowToRank(row);
}


