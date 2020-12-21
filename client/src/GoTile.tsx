import React from "react";

interface GoTileProps {
    x: number,
    y: number,
    heldBy: string
    handler: any
}

class GoTile extends React.Component<GoTileProps, unknown> {

    constructor(props: GoTileProps) {
        super(props);
        this.determineImg = this.determineImg.bind(this);
    }

    determineImg() {
        let path: string = "/SVG/";
        if (this.props.x < 8) {
            path += 0;
        }
        if (this.props.y > 0) {
            path += 1;
        }
        if (this.props.x > 0) {
            path += 2;
        }
        if (this.props.y < 8) {
            path += 3;
        }

        if (this.props.heldBy === 'B') {
            path += "Black";
        } else if (this.props.heldBy === 'W') {
            path += "White";
        }

        return path + ".svg";
    }

    render() {
        return (
            <React.Fragment>
                <img src={this.determineImg()} style={{width: 40}} className="GoTile-img" alt="GoTile-img"
                     onClick={() => this.props.handler(this.props.x, this.props.y)}/>
            </React.Fragment>
        );
    }
}

export default GoTile;
