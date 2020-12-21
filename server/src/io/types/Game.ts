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

                this.attemptCapture(move.x, move.y);

                // if(this.currentPlayer.color =="W"){
                //     this.whiteCaptured++;
                // }
                // else{
                //     this.blackCaptured++;
                // }
                this.currentPlayer = player == this.player2 ? this.player1 : this.player2;

                // this.checkGameOver();
                return "no_error";
            }
            else{
                return "unknown_error"
            }
        }
    }

    positionId(x: number, y: number) : number {
        return y * this.board.length + x;
    }

    attemptCapture(x : number, y : number) {
        const opponentColor : string = (this.board[x][y] == 'B' ? 'W' : 'B');

        if (x > 0 && this.board[x-1][y] == opponentColor) {
            const result = this.checkGroup(x-1, y);
            if (!result.hasLiberties) {
                this.capture(result.group);
            }
        }
        
        if (y > 0 && this.board[x][y-1] == opponentColor) {
            const result = this.checkGroup(x, y-1);
            if (!result.hasLiberties) {
                this.capture(result.group);
            }
        }
        
        if (x < this.board.length-1 && this.board[x+1][y] == opponentColor) {
            const result = this.checkGroup(x+1, y);
            if (!result.hasLiberties) {
                this.capture(result.group); 
            }
        }
        
        if (y < this.board.length-1 && this.board[x][y+1] == opponentColor) {
            const result = this.checkGroup(x, y+1);
            if (!result.hasLiberties) {
                this.capture(result.group);
            }
        }
    }

    capture(captured: Set<number>) {
        const firstValue : number = captured.values().next().value;
        const myColor : string = (this.board[firstValue%this.board.length][Math.floor(firstValue/this.board.length)] == 'B' ? 'W' : 'B');
        if (myColor == 'B') {
            this.blackCaptured += captured.size;
        } else {
            this.whiteCaptured += captured.size;
        }

        for (let position of captured) {
            this.board[position % this.board.length][Math.floor(position / this.board.length)] = 'X';
        }
    }

    checkGroup(startX : number, startY : number) : {hasLiberties : boolean, group : Set<number>} {
        return this.checkGroupDFS(startX, startY, this.board[startX][startY], new Set());
    }

    checkGroupDFS(x: number, y : number, color: string, visited: Set<number>) : {hasLiberties : boolean, group : Set<number>} {
        if (visited.has(this.positionId(x, y))) {
            return {hasLiberties : false, group : visited};
        }
        visited.add(this.positionId(x, y));

        let hasLiberties : boolean = false;
        hasLiberties ||= x > 0 && this.board[x-1][y] == 'X';
        hasLiberties ||= y > 0 && this.board[x][y-1] == 'X';
        hasLiberties ||= x < this.board.length-1 && this.board[x+1][y] == 'X';
        hasLiberties ||= y < this.board.length-1 && this.board[x][y+1] == 'X';

        if (x > 0 && this.board[x-1][y] == color) {
            const result : {hasLiberties : boolean, group : Set<number>} = this.checkGroupDFS(x-1, y, color, visited);
            hasLiberties ||= result.hasLiberties;
        }
        
        if (y > 0 && this.board[x][y-1] == color) {
            const result : {hasLiberties : boolean, group : Set<number>} = this.checkGroupDFS(x, y-1, color, visited);
            hasLiberties ||= result.hasLiberties;
        }
        
        if (x < this.board.length-1 && this.board[x+1][y] == color) {
            const result : {hasLiberties : boolean, group : Set<number>} = this.checkGroupDFS(x+1, y, color, visited);
            hasLiberties ||= result.hasLiberties;
        }
        
        if (y < this.board.length-1 && this.board[x][y+1] == color) {
            const result : {hasLiberties : boolean, group : Set<number>} = this.checkGroupDFS(x, y+1, color, visited);
            hasLiberties ||= result.hasLiberties;
        }

        return {hasLiberties : hasLiberties, group : visited};
    }

    calculateFinalScore() {
        let visited : Array<boolean> = new Array(this.board.length * this.board.length).fill(false);
        // let tmp: number = this.blackCaptured;
        // this.blackCaptured = -this.whiteCaptured;
        // this.whiteCaptured = -tmp; 
        for (let x = 0; x < this.board.length; x++) {
            for (let y = 0; y < this.board[x].length; y++) {
                if (!visited[this.positionId(x, y)]) {
                    const result : {hasBorder: Array<boolean>, area: number} = this.calculateArea(x, y, visited);
                    if (result.hasBorder[0] && !result.hasBorder[1]) {
                        this.blackCaptured += result.area;
                    } else if (!result.hasBorder[0] && result.hasBorder[1]) {
                        this.whiteCaptured += result.area;
                    }

                    console.log()

                    if (this.board[x][y] == 'B') {
                        this.blackCaptured++;
                    } else if (this.board[x][y] == 'W') {
                        this.whiteCaptured++;
                    }
                }
            }
        }
    }

    calculateArea(x: number, y : number, visited: Array<boolean>) : {hasBorder: Array<boolean> /* black, white */, area: number} {
        if (visited[this.positionId(x, y)]) {
            return {hasBorder: [false, false], area : 0};
        }
        visited[this.positionId(x, y)] = true;

        let hasBorder : Array<boolean> = new Array(2).fill(false);
        let area : number = 0;

        if (this.board[x][y] != 'X') {
            hasBorder[this.board[x][y] == 'B' ? 0 : 1] ||= true;
            visited[this.positionId(x, y)] = false;
            return {hasBorder : hasBorder, area : 0};
        } else {
            if (x > 0) {
                const result : {hasBorder: Array<boolean>, area: number} = this.calculateArea(x-1, y, visited);
                hasBorder[0] ||= result.hasBorder[0];
                hasBorder[1] ||= result.hasBorder[1];
                area += result.area;
            }
            
            if (y > 0) {
                const result : {hasBorder: Array<boolean>, area: number} = this.calculateArea(x, y-1, visited);
                hasBorder[0] ||= result.hasBorder[0];
                hasBorder[1] ||= result.hasBorder[1];
                area += result.area;
            }
            
            if (x < this.board.length-1) {
                const result : {hasBorder: Array<boolean>, area: number} = this.calculateArea(x+1, y, visited);
                hasBorder[0] ||= result.hasBorder[0];
                hasBorder[1] ||= result.hasBorder[1];
                area += result.area;
            }
            
            if (y < this.board.length-1) {
                const result : {hasBorder: Array<boolean>, area: number} = this.calculateArea(x, y+1, visited);
                hasBorder[0] ||= result.hasBorder[0];
                hasBorder[1] ||= result.hasBorder[1];
                area += result.area;
            }

            return {hasBorder : hasBorder, area : area+1};
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

    setCaptured(black: number, white: number) {
        this.blackCaptured = black;
        this.whiteCaptured = white;
    }

}

export default Game;