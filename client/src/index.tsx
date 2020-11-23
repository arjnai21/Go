import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import LobbyPage from "./LobbyPage";
import GamePage from "./GamePage";
import SocketIO from "socket.io-client";
import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  useHistory,
} from "react-router-dom";
import Button from "@material-ui/core/Button";
// import reportWebVitals from './reportWebVitals';

// let gamePage = new GamePage({});

let gamePage = (
  <GamePage
    color={"B"}
    goTileHandler={goTileHandler}
    board={Array(9)}
    currentPlayer={"B"}
    opponentName={""}
  />
);

let lobbyPage = (
  <LobbyPage
    username={""}
    players={[""]}
    inviteDialogOpen={false}
  />
);

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Switch>
      <Route exact path="/">
          <App />
          <SetUsernameForm></SetUsernameForm>
        </Route>
        <Route path="/lobby">{() => lobbyPage}</Route>
        <Route path="/game">{() => gamePage}</Route>
        
      </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
const socket = SocketIO.io("http://localhost:3001/");

function SetUsernameForm() {
  const history = useHistory();

  var username : string;

  function handleChange(e : any) {
    username = e.target.value;
  }

  function SetUsername() {
  
    socket.emit("client_server_set_username", {username});

    lobbyPage = <LobbyPage username={username} players={[""]} inviteDialogOpen={false} />
    // gamePage = new GamePage({color:"B", goTileHandler:goTileHandler, board:blankBoard, currentPlayer:"B", opponentName:"spaghetti"});
    console.log(lobbyPage)
    history.push("/lobby");
  }

  return (
    <div>
      <label>
        Enter a name:
        <input type="text" name="username" onChange={handleChange} />
      </label>
      <Button onClick={SetUsername} component={Link} to="/lobby">
        Play
      </Button>
    </div>
  );
}

function InitGameButton() {
  const history = useHistory();

  function InitGame() {
    const blankBoard = Array(9);
    for (let i = 0; i < 9; i++) {
      blankBoard[i] = Array(9);
      for (let j = 0; j < 9; j++) {
        blankBoard[i][j] = "X";
      }
    }

    gamePage = <GamePage color={"B"} goTileHandler={goTileHandler} board={blankBoard} currentPlayer={"B"} opponentName={"spaghetti"} />
    // gamePage = new GamePage({color:"B", goTileHandler:goTileHandler, board:blankBoard, currentPlayer:"B", opponentName:"spaghetti"});
    console.log(gamePage)
    history.push("/game");
  }

  return (
    <Button onClick={InitGame} component={Link} to="/game">
      START GAME
    </Button>
  );
}

socket.on(
  "server_client_game_start",
  (information: { gameId: number; color: string; opponent: string }) => {
    const history = useHistory();
    const blankBoard = Array(9);
    for (let i = 0; i < 9; i++) {
      blankBoard[i] = Array(9);
      for (let j = 0; j < 9; j++) {
        blankBoard[i][j] = "X";
      }
    }

    gamePage = <GamePage color={"B"} goTileHandler={goTileHandler} board={blankBoard} currentPlayer={"B"} opponentName={"spaghetti"} />
    // gamePage = new GamePage({color:"B", goTileHandler:goTileHandler, board:blankBoard, currentPlayer:"B", opponentName:"spaghetti"});

    history.push("/game");
  }
);

function goTileHandler(xPos: number, yPos: number) {
  console.log(`${xPos} ${yPos}`);
  socket.emit("client_server_play_move", { x: xPos, y: yPos });
}

// socket.on("server_client_move_played", (information: {board: any, moveError: string, whiteCaptured: Number, blackCaptured: Number, currentPlayer: string}) => {
//   GamePage.changeState({board: information.board, whiteCaptured: information.whiteCaptured, blackCaptured: information.blackCaptured, currentPlayer: information.currentPlayer})
// });

// socket.on("server_client_game_over", (information: {myCaptured: Number, theirCaptured: Number, win: String}) => {
//   GamePage.changeState({win: information.win, winSnackbarOpen: true});
// });

export default socket;