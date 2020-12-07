import Player from "./Player";
import {Move} from "../listeners/GameListener";
import {v4 as uuidv4, parse} from "uuid";

class Game {

    public id: string;
    public player1: Player; //"B"
    public player2: Player; //"W"
    public board: Array<string>[];
    public currentPlayer: Player;

    constructor(player1: Player, player2: Player) {
        this.player1 = player1;
        this.player2 = player2;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        this.id = uuidv4();
        this.board = []
        for(let i = 0; i < 9; i++){
            this.board.push(["X", "X", "X", "X", "X", "X", "X", "X", "X"])
        }
        this.currentPlayer = player1;
    }

    getGameId() : string{
        return this.id;
    }

    playMove(player : Player, move: Move):string{
        if(player != this.currentPlayer){
            return "wrong_player";
        }
        if(this.board[move.x][move.y] !== "X"){
            return "non_empty_space";
        }
        else{
            this.board[move.x][move.y] = this.currentPlayer.color;
            this.currentPlayer = player == this.player2 ? this.player1 : this.player2;
            return "no_error";
        }
    }

    getBoard() : Array<Array<string>>{
        return this.board;
    }

    hasPlayableMovesLeft(): boolean {
        for(let x = 0; x < this.board.length; x++) {
            for(let y = 0; y < this.board[x].length; y++) {
                if(this.isValidMove(x, y)) {
                    return true;
                }
            }
        }

        return false;
    }

    isValidMove(x: number, y: number): boolean {
        // invalid move
        if(x >= this.board.length || y >= this.board[x].length || this.board[x][y] !== 'X')
            return false

        // TODO: implement valid move logic
        // basically check if move is in an already captured zone
        return true;
    }

    checkGameOver(): boolean {
        return !this.hasPlayableMovesLeft();
    }

    getCapturedPieces(color: string): boolean {
        // TODO IMPLEMENT
        return false;
    }

}

export default Game;