import React from 'react';
import "./assets/index.css";
import './assets/app.css';
import Piece from "./components/Piece";
import Board from "./components/Board";
import TextField from "@material-ui/core/TextField";
import switchIcon from "./assets/switch.svg"
import {Button} from "@material-ui/core";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {pieces: {1: 0, 2: 0}, difficulty: 6, switch: false, start:true};
        this.movement = this.movement.bind(this);
        this.setDifficulty = this.setDifficulty.bind(this);
        this.onStart = this.onStart.bind(this);
        this.toggleActionButton = this.toggleActionButton.bind(this);
    }

    toggleActionButton(){
        const state = {start: !this.state.start};
        if(this.state.start){
            this.onStart();
        }else{
            state.externalMatrix = undefined;
            state.internalMatrix = undefined;
            state.pieces = {1: 0, 2: 0};
        }
        this.setState(state);
    }

    onStart() {
        const route = this.state.switch ? "/api" : "/api/initial_matrix";
        fetch(route)
            .then(response => response.json())
            .then(response => this.setState({
                externalMatrix: response.externalMatrix,
                internalMatrix: response.internalMatrix,
                movements: response.movements,
                pieces: response.pieces
            }));
    }

    setDifficulty(value) {
        if (value > 0)
            this.setState({difficulty: value})
    }

    movement(i, j, isInnerRow, playerId, origin, removePiece) {
        const request = {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify({
                origin,
                target: {i, j, isInnerRow, playerId},
                externalMatrix: this.state.externalMatrix,
                internalMatrix: this.state.internalMatrix,
                removePiece,
                activePlayer: {
                    id: origin.playerId % 2 + 1,
                    remainingPieces: this.state.pieces[origin.playerId % 2 + 1],
                    externalPieces: this.state.pieces[origin.playerId % 2 + 1] < 4 ? 0 : this.state.pieces[origin.playerId % 2 + 1] - 4
                },
                passivePlayer: {
                    id: origin.playerId,
                    remainingPieces: this.state.pieces[origin.playerId],
                    externalPieces: this.state.pieces[origin.playerId] < 4 ? 0 : this.state.pieces[origin.playerId] - 4
                },
                difficulty: parseInt(this.state.difficulty)
            })
        };
        return fetch("/api/movement", request)
            .then(response => response.json())
            .then(response => {
                if (!response.error)
                    this.setState({
                        externalMatrix: response.externalMatrix,
                        internalMatrix: response.internalMatrix,
                        movements: response.movements,
                        pieces: response.pieces
                    });
            });
    }

    render() {
        const style = this.state.switch ? {backgroundColor: "#f47560", transform: "rotate(270deg)"} : {};
        style.opacity = this.state.start ? 1.0 : 0.5;
        return (
            <div className="queah-body">
                <h1>Queah</h1>
                <div className="content">
                    <Board matrix={{external: this.state.externalMatrix, internal: this.state.internalMatrix}}
                           movements={this.state.movements} onMovement={this.movement} playerId={2} switch={this.state.switch}/>
                </div>
                <div className="configuration">
                    <h2>Configuration</h2>
                    <div className="players">
                        <div className="info">
                            <h3>{this.state.switch ? "AI" : "Player"}</h3>
                            <Piece/>
                            <TextField value={this.state.pieces[2]} id="primaryInfo" type="number"
                                       label="Remaining Pieces" disabled/>
                        </div>
                        <div className="button" style={style}
                             onClick={() => this.state.start && this.setState({switch: !this.state.switch})}>
                            <img alt="switch-player" src={switchIcon}/>
                        </div>
                        <div className="info">
                            <h3>{this.state.switch ? "Player" : "AI"}</h3>
                            <Piece secondary/>
                            <TextField value={this.state.pieces[1]} id="secondaryInfo" type="number"
                                       label="Remaining Pieces" disabled/>
                        </div>
                    </div>
                    <div className="footer">
                        <div className="difficulty-configuration">
                            <TextField value={this.state.difficulty} type="number" label="Difficulty" id="difficulty"
                                       onChange={(e) => this.setDifficulty(e.target.value)}/>
                        </div>
                        <Button onClick={this.toggleActionButton}>{this.state.start ? "START" : "GAME OVER"}</Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
