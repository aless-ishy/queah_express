import React, {Component} from 'react';
import Piece from "./Piece";
import "../assets/board.css";

const side = 100 * Math.sqrt(2);
const fix = 100 * 0.5 * (Math.sqrt(2) - 1);

class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {lookingAt: {}};
        this.drawRow = this.drawRow.bind(this);
        this.setLookingAt = this.setLookingAt.bind(this);
        this.select = this.select.bind(this);
    }

    setLookingAt(i, j, isInnerRow, playerId) {
        this.setState({lookingAt: {i, j, isInnerRow, playerId}});
    }

    select(i, j, isInnerRow, playerId) {
        const origin = this.state.lookingAt.i !== undefined ? this.state.lookingAt : {
            i,
            j,
            isInnerRow,
            playerId: this.props.playerId
        };
        const lookingAtString = `${origin.isInnerRow ? 0 : 1}${origin.i}${origin.j}`
        const movements = this.props.movements && this.props.movements[lookingAtString] && this.props.movements[lookingAtString].possibleMovements;
        let removePiece = undefined;
        if (Array.isArray(movements))
            for (let movement of movements)
                if (movement.i === i && movement.j === j && isInnerRow !== movements.isExternalMatrix) {
                    removePiece = Array.isArray(this.props.movements[lookingAtString].removePieces) &&
                                  this.props.movements[lookingAtString].removePieces[movement.k];
                    break;
                }
        this.props.onMovement(i, j, isInnerRow, playerId, origin,removePiece)
            .then(() => this.setState({lookingAt: {}}));
    }

    drawRow(row, isInnerRow = false) {
        const x_position = (isInnerRow ? side * 0.5 : 0) + fix;
        const y_position = (isInnerRow ? side * 0.5 : 0) + row * side + fix;
        const squares_number = isInnerRow ? 2 : 3;
        const squares = [];
        const matrix = this.props.matrix &&
        Array.isArray(this.props.matrix.external) &&
        Array.isArray(this.props.matrix.internal) ? isInnerRow ?
            this.props.matrix.internal : this.props.matrix.external : undefined;
        const className = isInnerRow ? "diagonal-square-inner" : "diagonal-square-outer";
        const lookingAtString = this.props.movements && this.props.movements["-1"] ? "-1" : `${this.state.lookingAt.isInnerRow ? 0 : 1}${this.state.lookingAt.i}${this.state.lookingAt.j}`
        const movements = this.props.movements && this.props.movements[lookingAtString] && this.props.movements[lookingAtString].possibleMovements;
        for (let i = 0; i < squares_number; i++) {
            const style = {transform: `translate(${x_position + side * i}px,${y_position}px) rotate(45deg)`};
            const pieceKey = `${isInnerRow ? 0 : 1}${row}${i}`;
            squares.push(
                <div className={className} key={pieceKey} style={style}>
                    {matrix && Array.isArray(matrix[row]) ? matrix[row][i] !== 0 ?
                        <Piece onLookUp={() => this.setLookingAt(row, i, isInnerRow, matrix[row][i])}
                               secondary={matrix[row][i] === (this.props.switch ? 2 : 1)} rotate/> :
                        Array.isArray(movements) && movements.some(position => position.i === row && position.j === i && position.isExternalMatrix !== isInnerRow) &&
                        <Piece onLookUp={() => this.select(row, i, isInnerRow, matrix[row][i])}
                               secondary={this.state.lookingAt.playerId === (this.props.switch ? 2 : 1) || !this.state.lookingAt.playerId && this.props.switch} rotate neutral/> : undefined}
                </div>
            )
        }
        return squares;
    }

    render() {
        return (
            <div className="board" style={{height: 3 * side, width: 3 * side}}>
                {this.drawRow(0)}
                {this.drawRow(0, true)}
                {this.drawRow(1)}
                {this.drawRow(1, true)}
                {this.drawRow(2)}
            </div>
        );
    }
}

export default Board;