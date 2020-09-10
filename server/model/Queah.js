class Tree {

    constructor(externalPlayerMatrix, internalPlayerMatrix, activePlayer, passivePlayer, heuristic, lostPiece, depth) {
        this.externalPlayerMatrix = externalPlayerMatrix;
        this.internalPlayerMatrix = internalPlayerMatrix;
        this.activePlayer = activePlayer;
        this.passivePlayer = passivePlayer;
        this.heuristic = heuristic;
        this.depth = depth;
        this.lostPiece = lostPiece;

        if(depth > 0 && activePlayer.remainingPieces > 0)
            this.childrenMovement = lostPiece && activePlayer.externalPieces > 0 ? this.getPuttingPieceChildren() : this.getAllChildren();
        else
            this.childrenMovement = [];

    }

    getNextMove(){
        Tree.alphaBeta(this,this.depth,-Infinity, Infinity, true);
        for(let i = 0; i < this.childrenMovement.length; i++)
            if(this.heuristic === this.childrenMovement[i].heuristic)
                return this.childrenMovement[i];

    }


    // {possibleMovements: a, removePieces: b}
    //                                         a.push({
    //                                                 i: i + 1,
    //                                                 j: j - 1,
    //                                                 player: player,
    //                                                 isExternalMatrix: true,
    //                                                 k: kindex
    //                                             });
    //                                             b.push({i: auxi, j: auxj, player: 0, isExternalMatrix: false});
    getPuttingPieceChildren(activePlayer = this.activePlayer){
        let children = [];
        let putPiece  = this.getAllEmptySpaces(activePlayer.id);

        children.push(...this.movementsToNodes(putPiece));
        return children;
    }
    getAllChildren(activePlayer = this.activePlayer.id, A = this.externalPlayerMatrix, B = this.internalPlayerMatrix) {
        let children = [];
        for (let i = 0; i < 3; i++)
            for (let j = 0; j < 3; j++) {

                if (i < 2 && j < 2 && B[i][j] === activePlayer) {
                    let movesExternal = Tree.nextMoves(i, j, A, B, false);
                    let nodes = this.movements2Nodes(movesExternal, i, j, false);
                    children.push(...nodes);
                }

                if (A[i][j] === activePlayer) {
                    let moveInternal = Tree.nextMoves(i, j, A, B, true);
                    let nodes = this.movements2Nodes(moveInternal, i, j, true);
                    children.push(...nodes);
                }
            }
        return children;
    }
    getAllEmptySpaces(player, A = this.externalPlayerMatrix, B = this.internalPlayerMatrix) {
        let spaces = [];
        for (let i = 0; i < 3; i++)
            for (let j = 0; j < 3; j++) {
                if (A[i][j] === 0)
                    spaces.push({i: i, j: j, isExternalMatrix: true, player: player, k: -1});
                if (i < 2 && j < 2)
                    if (B[i][j] === 0)
                        spaces.push({i: i, j: j, isExternalMatrix: false, player: player, k: -1});
            }
        return spaces;

    }

    movements2Nodes(movements, i, j, isExternalMatrix, A = this.externalPlayerMatrix, B = this.internalPlayerMatrix, depth = this.depth) {
        let nodes = [];
        for (let m = 0; m < movements.possibleMovements.length; m++) {
            let a = Tree.cloneMatrix(A);
            let b = Tree.cloneMatrix(B);
            let updates = [];
            let k = movements.possibleMovements[m].k;
            let node = null;
            let passivePlayer = {
                id: this.activePlayer.id,
                remainingPieces: this.activePlayer.remainingPieces,
                externalPieces: this.activePlayer.externalPieces
            };
            let activePlayer = {
                id: this.passivePlayer.id,
                remainingPieces: this.passivePlayer.remainingPieces,
                externalPieces: this.passivePlayer.externalPieces
            };
            let heuristic = this.heuristic + (passivePlayer.id === 1 ? 1 : -1) * (k > -1 ? 1 : 0);


            updates.push(movements.possibleMovements[m], {i: i, j: j, isExternalMatrix: isExternalMatrix, player: 0});
            if (k > -1) {
                updates.push(movements.removePieces[k]);
                activePlayer.remainingPieces =  activePlayer.remainingPieces - 1;
                if(activePlayer.remainingPieces === 0)
                    heuristic = heuristic + (passivePlayer.id === 1 ? 1 : -1)*100*depth;

            }

            Tree.updateMatrix(updates, a, b);

            node = new Tree(a, b, activePlayer, passivePlayer, heuristic, k > -1, depth - 1);
            nodes.push(node);
        }
        return nodes;

    }
    movementsToNodes(movements, A = this.externalPlayerMatrix, B = this.internalPlayerMatrix, depth = this.depth) {
        let nodes = [];
        for (let i = 0; i < movements.length; i++) {
            let a = Tree.cloneMatrix(A);
            let b = Tree.cloneMatrix(B);
            let node = null;
            let heuristic = this.heuristic;
            let passivePlayer = {
                id: this.activePlayer.id,
                remainingPieces: this.activePlayer.remainingPieces,
                externalPieces: this.activePlayer.externalPieces -1
            };
            let activePlayer = {
                id: this.passivePlayer.id,
                remainingPieces: this.passivePlayer.remainingPieces,
                externalPieces: this.passivePlayer.externalPieces
            };


            Tree.updateMatrix([movements[i]], a, b);

            node = new Tree(a, b, activePlayer, passivePlayer, heuristic, false, depth - 1);
            nodes.push(node);
        }
        return nodes;

    }

    static alphaBeta(node, depth, alpha, beta, maximizingPlayer) {
        if (depth === 0 || node.childrenMovement.length === 0)
            return node.heuristic;
        if (maximizingPlayer) {
            let value = -Infinity, aux;
            for (let i = 0; i < node.childrenMovement.length; i ++) {
                aux = Tree.alphaBeta(node.childrenMovement[i], depth - 1, alpha, beta, false);
                value = value > aux ? value : aux;
                alpha = alpha > value ? alpha : value;
                if (alpha >= beta)
                    break;
            }
            node.heuristic = value;
            return value;
        } else {
            let value = Infinity, aux;
            for (let i = 0; i < node.childrenMovement.length; i ++) {
                aux = Tree.alphaBeta(node.childrenMovement[i], depth - 1, alpha, beta, true);
                value = value < aux ? value : aux;
                beta = beta < value ? alpha : value;
                if (alpha >= beta)
                    break;
            }
            node.heuristic = value;
            return value;
        }

    }


    static cloneMatrix(A) {
        let a = [];
        for (let i = 0; i < A.length; i++)
            a.push([...A[i]]);
        return a;
    }

    static updateMatrix(movement, A, B) {
        for (let k = 0; k < movement.length; k++) {
            let i = movement[k].i, j = movement[k].j;
            if (movement[k].isExternalMatrix)
                A[i][j] = movement[k].player;
            else
                B[i][j] = movement[k].player;
        }
    }

    static isPossible(i, j, isExternalMatrix) {
        if (i < 0 || j < 0) return false;
        if (i > 2 || j > 2) return false;
        if (!isExternalMatrix && (i > 1 || j > 1)) return false;
        return true
    }

    static nextMoves(i, j, externalPlayerMatrix, internalPlayerMatrix, isExternalMatrix) {
        let a = [];
        let b = [];
        let A = externalPlayerMatrix;
        let B = internalPlayerMatrix;
        let player;
        let kindex = -1;

        if (isExternalMatrix)
            player = A[i][j];
        else
            player = B[i][j];


        if (player !== 0)
            for (let k = 0; k < 2; k++)
                for (let l = 0; l < 2; l++) {
                    if (isExternalMatrix) {

                        if (Tree.isPossible(i - k, j - l, false)) {
                            switch (B[i - k][j - l]) {
                                case 0 :
                                    a.push({
                                        i: i - k,
                                        j: j - l,
                                        player: player,
                                        isExternalMatrix: false,
                                        k: -1
                                    });
                                    break;
                                case player:
                                    break;
                                default:
                                    let auxi = i - k, auxj = j - l;


                                    if (i === auxi && j === auxj && Tree.isPossible(i + 1, j + 1, true)) {
                                        if (A[i + 1][j + 1] === 0) {

                                            kindex++;
                                            a.push({
                                                i: i + 1,
                                                j: j + 1,
                                                player: player,
                                                isExternalMatrix: true,
                                                k: kindex
                                            });
                                            b.push({i: auxi, j: auxj, player: 0, isExternalMatrix: false});
                                        }
                                    } else if (i - 1 === auxi && j === auxj && Tree.isPossible(i - 1, j + 1, true)) {
                                        if (A[i - 1][j + 1] === 0) {

                                            kindex++;
                                            a.push({
                                                i: i - 1,
                                                j: j + 1,
                                                player: player,
                                                isExternalMatrix: true,
                                                k: kindex
                                            });
                                            b.push({i: auxi, j: auxj, player: 0, isExternalMatrix: false});
                                        }
                                    } else if (i - 1 === auxi && j - 1 === auxj && Tree.isPossible(i - 1, j - 1, true)) {
                                        if (A[i - 1][j - 1] === 0) {

                                            kindex++;
                                            a.push({
                                                i: i - 1,
                                                j: j - 1,
                                                player: player,
                                                isExternalMatrix: true,
                                                k: kindex
                                            });
                                            b.push({i: auxi, j: auxj, player: 0, isExternalMatrix: false});
                                        }
                                    } else if (i === auxi && j - 1 === auxj && Tree.isPossible(i + 1, j - 1, true)) {
                                        if (A[i + 1][j - 1] === 0) {

                                            kindex++;
                                            a.push({
                                                i: i + 1,
                                                j: j - 1,
                                                player: player,
                                                isExternalMatrix: true,
                                                k: kindex
                                            });
                                            b.push({i: auxi, j: auxj, player: 0, isExternalMatrix: false});
                                        }
                                    }
                            }
                        }

                    } else if (Tree.isPossible(i + k, j + l, true))
                        switch (A[i + k][j + l]) {
                            case 0:
                                a.push({
                                    i: i + k,
                                    j: j + l,
                                    player: player,
                                    isExternalMatrix: true,
                                    k: -1
                                });
                                break;
                            case player:
                                break;
                            default:
                                let auxi = i + k, auxj = j + l;

                                if (i + 1 === auxi && j + 1 === auxj && Tree.isPossible(i + 1, j + 1, false)) {
                                    if (B[i + 1][j + 1] === 0) {
                                        kindex++;
                                        a.push({
                                            i: i + 1,
                                            j: j + 1,
                                            player: player,
                                            isExternalMatrix: false,
                                            k: kindex
                                        });
                                        b.push({i: auxi, j: auxj, player: 0, isExternalMatrix: true});
                                    }
                                } else if (i === auxi && j + 1 === auxj && Tree.isPossible(i - 1, j + 1, false)) {
                                    if (B[i - 1][j + 1] === 0) {
                                        kindex++;
                                        a.push({
                                            i: i - 1,
                                            j: j + 1,
                                            player: player,
                                            isExternalMatrix: false,
                                            k: kindex
                                        });
                                        b.push({i: auxi, j: auxj, player: 0, isExternalMatrix: true});
                                    }
                                } else if (i === auxi && j === auxj && Tree.isPossible(i - 1, j - 1, false)) {
                                    if (B[i - 1][j - 1] === 0) {
                                        kindex++;
                                        a.push({
                                            i: i - 1,
                                            j: j - 1,
                                            player: player,
                                            isExternalMatrix: false,
                                            k: kindex
                                        });
                                        b.push({i: auxi, j: auxj, player: 0, isExternalMatrix: true});
                                    }
                                } else if (i + 1 === auxi && j === auxj && Tree.isPossible(i + 1, j - 1, false)) {
                                    if (B[i + 1][j - 1] === 0) {
                                        kindex++;
                                        a.push({
                                            i: i + 1,
                                            j: j - 1,
                                            player: player,
                                            isExternalMatrix: false,
                                            k: kindex
                                        });
                                        b.push({i: auxi, j: auxj, player: 0, isExternalMatrix: true});
                                    }
                                }
                        }
                }
        return {possibleMovements: a, removePieces: b};
    }

}

module.exports = Tree