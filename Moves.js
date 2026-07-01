function getPseudoMoves(board,row,col,enPassantTarget){
    const code=board[row][col];
    if (!code) return [];

    const color=pieceColor(code);
    const type=code.toUpperCase();
    const moves=[];


    function inBounds(r,c){
        return r >=0 && r < 8 && c >=0 && c <8;
    }

    function addMove(r,c){
        if (!inBounds(r,c)) return false;
        const target=board[r][c];
        if (target && pieceColor(target)===color) return false;

        moves.push([r,c]);
        return !target;
    }

      function slide(dr,dc){
        let r=row+dr,c=col+dc;
        while (inBounds(r,c)){
            const target=board[r][c];
            if (target && pieceColor(target)===color) break;
            moves.push([r,c]);
            if (target) break;
            r+=dr;c+=dc;
        }
      }
      if (type=='P'){
        const dir=color==='white' ? -1 : 1;
        const startRow=color==='white' ? 6 : 1;


        if (inBounds(row+dir,col) && !board[row+dir][col]){
            moves.push([row+dir,col]);

            if(row===startRow && !board[row+2*dir][col]){
                moves.push([row+2*dir,col]);
            }
        }
    

        for (const dc of [-1,1]){
            const r=row+dir,c=col+dc;
            if (inBounds(r,c)){
                if (board[r][c] && pieceColor(board[r][c])!==color){
                    moves.push([r,c]);
                }
                if (enPassantTarget && enPassantTarget[0]===r && enPassantTarget[1]===c){
                    moves.push([r,c]);
                }
            }
        }
    }
             else if (type==='N'){
                const knightMoves=[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
                for (const [dr,dc] of knightMoves) addMove(row+dr,col+dc);
             }

            else if (type==='B'){
                for (const[dr,dc] of [[-1,-1],[-1,1],[1,-1],[1,1]]) slide(dr,dc);
            }

            else if (type==='R'){
                for (const [dr,dc] of [[-1,0],[1,0],[0,-1],[0,1]]) slide(dr,dc);
            }

            else if (type==='Q'){
                 for (const [dr,dc] of [[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]]) 
                slide(dr,dc)
            }


            else if(type==='K'){
                for (const [dr,dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]) 
                addMove(row+dr,col+dc);

            }

            return moves;
       }

      
       function isAttacked(board,r,c,byColor){
        for (let row=0;row<8;row++){
            for (let col=0;col < 8;col++){
                const code=board[row][col];
                if(!code || pieceColor(code)!==byColor) continue;
                const moves=getPseudoMoves(board,row,col,null);
                if (moves.some(([mr,mc])=>mr ===r && mc===c)) return true;

            }
        }
        return false;
       }



       function isInCheck(board,color){
        const kingCode=color==='white' ? 'K' : 'k';
         let kingRow=-1,kingCol=-1;
         for (let r=0;r<8;r++){
            for (let c=0;c<8;c++){
                if(board[r][c]===kingCode) {
                    kingRow=r;
                    kingCol=c;
                }
            }
         }

         if (kingRow===-1) return false;
         const opponent = color ==='white' ? 'black' : 'white';
         return isAttacked(board,kingRow,kingCol,opponent);
       }


       function getLegalMoves(board,row,col,enPassantTarget,castleRights){
        const code=board[row][col];
        if (!code) return [];
        const color=pieceColor(code);
        const pseudo=getPseudoMoves(board,row,col,enPassantTarget);
        const legal=[];

        for (const [r,c] of pseudo){
            const nb=copyBoard(board);
            nb[r][c]=code;
            nb[row][col]=null;
             
            if (code.toUpperCase()==='P' && enPassantTarget && r===enPassantTarget[0] && c===enPassantTarget[1]){
                const capturedRow=color==='white' ? r+1 : r-1;
                nb[capturedRow][c]=null;
            }

            if(!isInCheck(nb,color)) legal.push([r,c]);
       }

       if (code.toUpperCase()==='K' && castleRights){
        const backRow=color==='white' ? 7 : 0;
        const opponent=color==='white' ? 'black' : 'white';

        if(!isInCheck(board,color)){
            
            const ksSide=color==='white' ? castleRights.whiteKingside : castleRights.blackKingside;
            if(ksSide && !board[backRow][3] && !board[backRow][2] && !board[backRow][2] && !board[backRow][1])
            {
                if(!isAttacked(board,backRow,3,opponent) && !isAttacked(board,backRow,2,opponent))
                {
                    legal.push([backRow,2]);
                }
            }
        

      const qsSide=color==='white' ? castleRights.whiteQueenside :castleRights.blackQueenside;
      if (qsSide && !board[backRow][3] && !board[backRow][2] && !board[backRow][1])
      {
        if (!isAttacked(board,backRow,3,opponent) && !isAttacked(board,backRow,2,opponent)){
            legal.push([backRow,2]);
        }
      }
    }
}
    return legal;
}

      function hasAnyLegalMoves(board,color,enPassantTarget,castleRights){
        for (let r=0;r<8;r++){
            for (let c=0;c<8;c++){
                if (board[r][c] && pieceColor(board[r][c])===color){
                    if (getLegalMoves(board,r,c,enPassantTarget,castleRights).length > 0) 
                        return true;

                }
            }
        }
        return false;
      }


      function buildMoveNotation(board,fromRow,fromCol,toRow,toCol,isCapture,isCheck,isMate,isCastle){
        if (isCastle){
            const isKingside=toCol===6;
            let notation = isKingside ? 'O-O' :'O-O-O';
            if (isMate) notation+='#';
            else if (isCheck) notation+='+';
            return notation;
        }

        const code = board[fromRow][fromCol];
        const type=code.toUpperCase();
        let notation = '';

        if(type!='P'){
            notation+=type;
        }

        if(isCapture){
            if(type==='P') notation+=colToFile(fromCol);
            notation+='x';
        }

        notation+=toAlgebraic(toRow,toCol);
        if(isMate) notation +='#';
        else if (isCheck) notation+='+';
        return notation;


      }

