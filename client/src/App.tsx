import React from "react";
import {RouteComponentProps, withRouter,} from "react-router-dom";

class App extends React.Component<{/*default props*/ } & RouteComponentProps, { socket: any }> {
    // lobbyPage: any;
    // gamePage: any;

    // constructor(props : any) {
    //     super(props);
    //     this.state = {socket: SocketIO.io("http://localhost:3001")};
    //     // this.setState({socket: SocketIO.io("http://localhost:3001")});

    //     this.SetUsername = this.SetUsername.bind(this);
    //     this.SetUsernameForm = this.SetUsernameForm.bind(this);
    //     this.goTileHandler = this.goTileHandler.bind(this);
    //     console.log(this.state.socket);
    // }

    // SetUsername(username: string) {
    //     this.state.socket.emit("client_server_set_username", {username});

    //     this.lobbyPage = <LobbyPage username={username} players={[""]} inviteDialogOpen={false} socket={this.state.socket} />
    //     // gamePage = new GamePage({color:"B", goTileHandler:goTileHandler, board:blankBoard, currentPlayer:"B", opponentName:information.opponent});
    //     console.log(this.lobbyPage)
    //     this.props.history.push("/lobby");
    //   }

    // SetUsernameForm() {
    //     var username : string;

    //     function handleChange(e : any) {
    //       username = e.target.value;
    //     }

    //     return (
    //       <div>
    //         <label>
    //           Enter a name:
    //           <input type="text" name="username" onChange={handleChange} />
    //         </label>
    //         <Button onClick={() => this.SetUsername(username)} component={Link} to="/lobby">
    //           Play
    //         </Button>
    //       </div>
    //     );
    // }

    // goTileHandler(xPos: number, yPos: number) {
    //     console.log(`${xPos} ${yPos}`);
    //     this.state.socket.emit("client_server_play_move", { x: yPos, y: xPos });
    // }

    // componentDidMount() {
    //     // let gamePage = new GamePage({});

    //     this.lobbyPage = (
    //         <LobbyPage
    //         username={""}
    //         players={[""]}
    //         inviteDialogOpen={false}
    //         socket={this.state.socket}
    //         />
    //     );
    //     this.gamePage = (
    //         <GamePage
    //         color={"B"}
    //         goTileHandler={this.goTileHandler}
    //         board={Array(9)}
    //         currentPlayer={"B"}
    //         opponentName={""}
    //         socket={this.state.socket}
    //         />
    //     );

    //     this.state.socket.on("connect", () => console.log("connection"));
    //     this.state.socket.on("server_message", (message: any) => console.log(message));

    //     this.state.socket.on(
    //       "server_client_game_start",
    //       (information: { gameId: number; color: string; opponent: string }) => {
    //         console.log("START GAME");
    //         const blankBoard = Array(9);
    //         for (let i = 0; i < 9; i++) {
    //           blankBoard[i] = Array(9);
    //           for (let j = 0; j < 9; j++) {
    //             blankBoard[i][j] = "X";
    //           }
    //         }

    //         this.gamePage = <GamePage color={"B"} goTileHandler={this.goTileHandler} board={blankBoard} currentPlayer={"B"} opponentName={information.opponent} socket={this.state.socket} />
    //         // gamePage = new GamePage({color:"B", goTileHandler:goTileHandler, board:blankBoard, currentPlayer:"B", opponentName:information.opponent});
    //         this.props.history.push("/game");
    //       }
    //     );

    //     // this.state.socket.on("server_client_move_played", (information: {board: any, moveError: string, whiteCaptured: Number, blackCaptured: Number, currentPlayer: string}) => {
    //     //   GamePage.changeState({board: information.board, whiteCaptured: information.whiteCaptured, blackCaptured: information.blackCaptured, currentPlayer: information.currentPlayer})
    //     // });

    //     // this.state.socket.on("server_client_game_over", (information: {myCaptured: Number, theirCaptured: Number, win: String}) => {
    //     //   GamePage.changeState({win: information.win, winSnackbarOpen: true});
    //     // });
    // }

    // render() {
    //     return (
    //         <div className="App">

    //             <Switch>
    //             <Route exact path="/">
    //                 <this.SetUsernameForm></this.SetUsernameForm>
    //                 </Route>
    //                 <Route path="/lobby">{() => this.lobbyPage}</Route>
    //                 <Route path="/game">{() => this.gamePage}</Route>
    //             </Switch>
    //         </div>
    //     );
    // }
}

export default withRouter(App);


// import React from 'react';
// import logo from './logo.svg';
// import './App.css';

// class App extends React.Component<{/*default props*/}> {

//     constructor(props : any) {
//         super(props);
//     }

//     render() {
//         return (
//             <div className="App">
//                 <header className="App-header">
//                     <img src={logo} className="App-logo" alt="logo" />
//                     <h1 className="App-title"></h1>
//                 </header>
//                 <p className="App-intro"></p>
//             </div>
//         );
//     }
// }

// export default App;
