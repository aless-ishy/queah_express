import React, {Component} from 'react';

class Piece extends Component {
    render() {
        const style = {};
        if(this.props.rotate)
            style.transform ="rotate(-45deg)";
        if(this.props.neutral)
            style.opacity = 0.4;
        return (
            <div className={this.props.secondary ? "piece-b" : "piece-a"} onClick={this.props.onLookUp} style={style}>
                <p>{this.props.secondary ? "B" : "A"}</p>
            </div>
        );
    }
}

export default Piece;