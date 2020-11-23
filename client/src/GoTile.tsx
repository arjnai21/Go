import React from "react";
import Grid from "@material-ui/core/Grid";

interface GoTileProps {
    x: number,
    y: number,
    heldBy: string
}

class GoTile extends React.Component<GoTileProps, unknown> {

    constructor(props: GoTileProps) {
        super(props);
        this.determineImg = this.determineImg.bind(this);
    }

    determineImg() {
        let path: string = "/SVG/";
        if (this.props.x < 18) {
            path += 0;
        }
        if (this.props.y > 0) {
            path += 1;
        }
        if (this.props.x > 0) {
            path += 2;
        }
        if (this.props.y < 18) {
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
<img src={this.determineImg()} style={{width: 40}} className="GoTile-img" alt="GoTile-img" />
        </React.Fragment>
    );
  }
}

export default GoTile;
