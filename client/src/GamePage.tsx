import React from "react";
import GoTile from "./GoTile";
import Grid from "@material-ui/core/Grid";
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {RouteComponentProps, withRouter} from "react-router-dom";

interface GamePageProps extends RouteComponentProps<any> {
    color: string,
    opponentName: string
    returnButtonHandler?: any,
    socket: any
}

interface GamePageState {
    board: any,
    currentPlayer: string,
    whiteCaptured: number,
    blackCaptured: number,
    win: string
    winSnackbarOpen: boolean
}

class GamePage extends React.Component<GamePageProps, GamePageState> {
    constructor(props: GamePageProps) {
        super(props);
        this.goTileHandler = this.goTileHandler.bind(this);

        const blankBoard = Array(9);
        for (let i = 0; i < 9; i++) {
            blankBoard[i] = Array(9);
            for (let j = 0; j < 9; j++) {
                blankBoard[i][j] = "X";
            }
        }
        this.state = {
            board: blankBoard,
            currentPlayer: "B",
            whiteCaptured: 0,
            blackCaptured: 0,
            win: "",
            winSnackbarOpen: false
        };
    }

    goTileHandler(xPos: number, yPos: number) {
        console.log(`${xPos} ${yPos}`);
        this.props.socket.emit("client_server_play_move", {x: yPos, y: xPos});
    }

//   changeState(newState: any) {
//       this.setState(newState);
//   }

    componentDidMount() {
        this.props.socket.on("server_client_move_played", (information: { board: any, moveError: string, whiteCaptured: number, blackCaptured: number, currentPlayer: string }) => {
            console.log({
                board: information.board,
                whiteCaptured: information.whiteCaptured,
                blackCaptured: information.blackCaptured,
                currentPlayer: information.currentPlayer
            });
            this.setState({
                board: information.board,
                whiteCaptured: information.whiteCaptured,
                blackCaptured: information.blackCaptured,
                currentPlayer: information.currentPlayer
            })
        });

        this.props.socket.on("server_client_game_over", (information: { whiteCaptured: number, blackCaptured: number, win: string }) => {
            this.setState({
                win: information.win,
                winSnackbarOpen: true,
                whiteCaptured: information.whiteCaptured,
                blackCaptured: information.blackCaptured
            });
        });

        console.log(this.props);
        console.log(this.state);
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
                    anchorOrigin={{vertical: "top", horizontal: "right"}}
                    open={this.state.winSnackbarOpen}
                    message={(this.state.win == this.props.color ? "You" : this.props.opponentName) + " won!"}
                    key={"top" + "right"}
                    action={<Button variant="contained"
                                    onClick={() => this.props.history.push("/lobby")}>Return</Button>}
                ></Snackbar>

                <Typography variant="h5" style={{textAlign: "center"}}>
                    {this.props.opponentName} captured: {(this.props.color == "B" ? this.state.whiteCaptured : this.state.blackCaptured)}
                </Typography>
                <Grid container direction="column" justify="center" alignItems="center" spacing={0}>
                    {
                        indexArray.map((row) =>
                            <Grid container direction="row" justify="center" alignItems="center" key={row} spacing={0}>
                                {
                                    indexArray.map((column) => <GoTile key={column} x={column} y={row}
                                                                       heldBy={this.state.board[row][column]}
                                                                       handler={this.goTileHandler}/>)
                                }
                            </Grid>
                        )
                    }
                </Grid>
                <Typography variant="h5" style={{textAlign: "center"}}>
                    You captured: {(this.props.color == "B" ? this.state.blackCaptured : this.state.whiteCaptured)} <br/><br/>
                </Typography>
                <Typography variant = "h3" style={{textAlign: "center", color: "white", backgroundColor: "black"}} >
                    {this.state.currentPlayer === this.props.color ? "Your Turn!" : "Opponent's Turn!"}
                </Typography>
                <Snackbar
                    anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                    open={true}
                    key={"bottom" + "right"}
                ><Button variant="contained" style={{textAlign: "center"}} onClick={() => {
                    this.props.socket.emit("client_server_play_move", {x: -1, y: -1});
                }}>Pass</Button></Snackbar>



            </div>

        );
    }
}

export default withRouter(GamePage);