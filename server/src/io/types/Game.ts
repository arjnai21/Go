import Player from "./Player";
import {Move} from "../listeners/GameListener";
import {v4 as uuidv4, parse} from "uuid";

class Game {

    public id: string;
    public player1: Player; //"B"
    public player2: Player; //"W"
    public board: Array<string>[];
    public previousBoard: Array<string>[];
    public currentPlayer: Player;
    public passCount: number;
    public whiteCaptured: number;
    public blackCaptured: number;

    constructor(player1: Player, player2: Player) {
        this.player1 = player1;
        this.player2 = player2;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        this.id = uuidv4();
        this.board = []
        for(let i = 0; i < 9; i++){
            this.board.push(["X", "X", "X", "X", "X", "X", "X", "X", "X"])
        }
        this.previousBoard = this.copyBoard(this.board);
        this.currentPlayer = player1;
        this.passCount = 0;
        this.whiteCaptured = 0;
        this.blackCaptured = 0;
    }

    copyBoard(array: Array<string>[]){
        return array.map(function(arr : string[]) {
            return arr.slice();
        });
    }

    getGameId() : string{
        return this.id;
    }

    playMove(player : Player, move: Move):string{

        if(player != this.currentPlayer){
            return "wrong_player";
        }

        if(move.x == -1 && move.y == -1){
            //user decided to pass
            console.log("RECIEVED PASS EVENT");
            this.passCount++;
            if (this.checkGameOver()){

                return "game_over";
            }
            this.currentPlayer = player == this.player2 ? this.player1 : this.player2;
            return "no_error";
        }
        if(this.board[move.x][move.y] !== "X"){

            return "non_empty_space";
        }
        else{
            if(this.isValidMove(move.x, move.y)) {
                this.passCount = 0;
                this.board[move.x][move.y] = this.currentPlayer.color;
                this.currentPlayer = player == this.player2 ? this.player1 : this.player2;
                if(this.currentPlayer.color =="W"){
                    this.whiteCaptured++;
                }
                else{
                    this.blackCaptured++;
                }
                // this.checkGameOver();
                return "no_error";
            }
            else{
                return "unknown_error"
            }
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
        // eslint-disable-next-line max-len
        if((x >= this.board.length || y >= this.board[x].length || this.board[x][y] !== 'X') && !(x == -1  && y == -1))
            return false

        // TODO: implement valid move logic
        return true;
    }

    checkGameOver(): boolean {
        // if(this.passCount == 2){
        //     //game is over
        // }
        // else return false;
       return this.passCount == 2;//!this.hasPlayableMovesLeft();
    }

    getCapturedPieces(color: string): number {
        if(color == "W"){
            return this.whiteCaptured;
        }
        else if (color == "B"){
            return this.blackCaptured;
        }
        return -1;
    }

}

export default Game;