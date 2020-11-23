import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
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

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Switch>
      <Route exact path="/">
          <App />
          <InitGameButton></InitGameButton>
        </Route>
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