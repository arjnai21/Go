import React from "react";
import GoTile from "./GoTile";
import Grid from "@material-ui/core/Grid";
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {
    BrowserRouter,
    Switch,
    Route,
    Link,
    useHistory,
  } from "react-router-dom";

interface GamePageProps {
    color?: string,
    goTileHandler?: any,
    board?: any,
    currentPlayer?: string,
    opponentName?: string
    returnButtonHandler?: any,
    socket: any
}

interface GamePageState {
    color?: string,
    goTileHandler?: any,
    board?: any,
    currentPlayer?: string,
    opponentName?: string
    returnButtonHandler?: any,
    whiteCaptured?: number,
    blackCaptured?: number,
    win?: string
    winSnackbarOpen?: boolean
}

class GamePage extends React.Component<GamePageProps, GamePageState> {
  constructor(props: GamePageProps) {
    super(props);
    this.state = props;
  }

//   changeState(newState: any) {
//       this.setState(newState);
//   }

  componentDidMount() {
    this.props.socket.on("server_client_move_played", (information: {board: any, moveError: string, whiteCaptured: number, blackCaptured: number, currentPlayer: string}) => {
        this.setState({board: information.board, whiteCaptured: information.whiteCaptured, blackCaptured: information.blackCaptured, currentPlayer: information.currentPlayer})
    });
        
    this.props.socket.on("server_client_game_over", (information: {myCaptured: number, theirCaptured: number, win: string}) => {
        this.setState({win: information.win, winSnackbarOpen: true});
    });
  }

  render() {
    console.log(this.state.board);

    let indexArray = Array(9);
    for (let i = 0; i < indexArray.length; i++) {
        indexArray[i] = i;
    }

    return (
        <div className="GamePage">
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={this.state.winSnackbarOpen}
                message={this.state.win + " won!"}
                key={"top" + "right"}
                action={<Button variant="contained">Return</Button>}
            ></Snackbar>
            
            <Typography variant="h5" style={{textAlign: "center"}}>
                {this.state.opponentName} captured:
            </Typography>
            <Grid container direction="column" justify="center" alignItems="center" spacing={0}>
                {
                    indexArray.map((row) => 
                        <Grid container direction="row" justify="center" alignItems="center" key={row} spacing={0}>
                            {
                                indexArray.map((column) => <GoTile key={column} x={column} y={row} heldBy={this.state.board[row][column]} handler={this.state.goTileHandler} />)
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
                key={"bottom" + "right"}
            ><Button variant="contained" style={{textAlign: "center"}}>Pass</Button></Snackbar>
            
        </div>
    );
  }
}

export default GamePage;
