const express = require('express');
const Queah = require("../model/Queah");
const router = express.Router();

const squareMatrix = (size = 3) => {
    const matrix = [];
    for (let i = 0; i < size; i++)
        matrix.push(new Array(size).fill(0))
    return matrix;
}

const initialMatrix = () => {
    const externalMatrix = squareMatrix(3);
    const internalMatrix = squareMatrix(2);
    externalMatrix[2][0] = 2;
    externalMatrix[1][0] = 2;
    internalMatrix[1][0] = 2;
    internalMatrix[0][0] = 2;

    externalMatrix[0][2] = 1;
    externalMatrix[1][2] = 1;
    internalMatrix[0][1] = 1;
    internalMatrix[1][1] = 1;
    return {externalMatrix, internalMatrix};
}

const getAllNextMoves = (externalMatrix, internalMatrix, playerId, putPiece) => {
    const movements = {};
    if (putPiece)
        movements["-1"] = {possibleMovements: []};
    for (let i = 0; i < 3; i++)
        for (let j = 0; j < 3; j++) {
            if (putPiece) {
                if (externalMatrix[i][j] === 0)
                    movements["-1"].possibleMovements.push({i, j, k: -1, isExternalMatrix: true})
                if (i < 2 && j < 2 && internalMatrix[i][j] === 0)
                    movements["-1"].possibleMovements.push({i, j, k: -1, isExternalMatrix: false})
            } else {
                if (externalMatrix[i][j] === playerId)
                    movements[`${1}${i}${j}`] = Queah.nextMoves(i, j, externalMatrix, internalMatrix, true);
                if (i < 2 && j < 2 && internalMatrix[i][j] === playerId)
                    movements[`${0}${i}${j}`] = Queah.nextMoves(i, j, externalMatrix, internalMatrix, false);
            }
        }
    return movements;
}


router.get("/", (req, res) => {
    const {internalMatrix, externalMatrix} = initialMatrix();
    const queah = new Queah(
        externalMatrix,
        internalMatrix,
        {
            id: 1,
            remainingPieces: 10,
            externalPieces: 6
        },
        {
            id: 2,
            remainingPieces: 10,
            externalPieces: 6
        },
        0,
        false,
        6);
    const state = queah.getNextMove();
    res.send({
        externalMatrix: state.externalPlayerMatrix,
        internalMatrix: state.internalPlayerMatrix,
        movements: getAllNextMoves(
            state.externalPlayerMatrix,
            state.internalPlayerMatrix,
            2,
            false),
        pieces: {
            [state.activePlayer.id]: state.activePlayer.remainingPieces,
            [state.passivePlayer.id]: state.passivePlayer.remainingPieces
        }
    });
});

router.get("/initial_matrix", (req, res) => {
    const {internalMatrix, externalMatrix} = initialMatrix();
    res.send({
        externalMatrix,
        internalMatrix,
        movements: getAllNextMoves(
            externalMatrix,
            internalMatrix,
            2,
            false),
        pieces: {
            1: 10,
            2: 10
        }
    });
});

router.post("/movement", (req, res) => {
    const body = req.body;
    if (body.externalMatrix && body.internalMatrix && body.target && body.origin) {
        let originMatrix, targetMatrix;
        if (body.origin.isInnerRow)
            originMatrix = body.internalMatrix;
        else
            originMatrix = body.externalMatrix;
        if (body.target.isInnerRow)
            targetMatrix = body.internalMatrix;
        else
            targetMatrix = body.externalMatrix;
        originMatrix[body.origin.i][body.origin.j] = 0;
        targetMatrix[body.target.i][body.target.j] = body.origin.playerId;
        if (body.removePiece) {
            const removeMatrix = body.removePiece.isExternalMatrix ? body.externalMatrix : body.internalMatrix;
            removeMatrix[body.removePiece.i][body.removePiece.j] = 0;
            body.activePlayer.remainingPieces--;
        }
        if (body.activePlayer.remainingPieces > 0) {
            const queah = new Queah(
                body.externalMatrix,
                body.internalMatrix,
                body.activePlayer,
                body.passivePlayer,
                0,
                body.removePiece,
                body.difficulty);
            const state = queah.getNextMove();
            res.send({
                externalMatrix: state.externalPlayerMatrix,
                internalMatrix: state.internalPlayerMatrix,
                movements: getAllNextMoves(
                    state.externalPlayerMatrix,
                    state.internalPlayerMatrix,
                    2,
                    body.passivePlayer.remainingPieces > state.activePlayer.remainingPieces && state.activePlayer.externalPieces > 0),
                pieces: {
                    [state.activePlayer.id]: state.activePlayer.remainingPieces,
                    [state.passivePlayer.id]: state.passivePlayer.remainingPieces
                }
            });
        } else {
            res.send({
                externalMatrix: body.externalMatrix,
                internalMatrix: body.internalMatrix,
                movements: {},
                pieces: {
                    1: body.activePlayer.remainingPieces,
                    2: body.passivePlayer.remainingPieces
                }
            });
        }
    } else
        res.send({error: "Invalid"});
});

module.exports = router;