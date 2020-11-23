import React from "react";
import GoTile from "./GoTile";
import Grid from "@material-ui/core/Grid";
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

class GamePage extends React.Component<{}, {}> {
  constructor(props: any) {
    super(props);
  }

  render() {
    let indexArray = Array(19);
    for (let i = 0; i < indexArray.length; i++) {
        indexArray[i] = i;
    }

    return (
        <div className="GamePage">
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={true}
                message="Name won!"
                key={"top" + "right"}
                action={<Button variant="contained">Return</Button>}
            ></Snackbar>
            
            <Typography variant="h5" style={{textAlign: "center"}}>
                Opponent captured:
            </Typography>
            <Grid container direction="column" justify="center" alignItems="center" spacing={0}>
                {
                    indexArray.map((row) => 
                        <Grid container direction="row" justify="center" alignItems="center" key={row} spacing={0}>
                            {
                                indexArray.map((column) => <GoTile key={column} x={column} y={row} heldBy={'W'} />)
                            }
                        </Grid>
                    )
                }
            </Grid> 
            <Typography variant="h5" style={{textAlign: "center"}}>
                You captured:
            </Typography>
            <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                open={true}
                message="Name won!"
                key={"bottom" + "right"}
            ><Button variant="contained" style={{textAlign: "center"}}>Pass</Button></Snackbar>
            
        </div>
    );
  }
}

export default GamePage;
