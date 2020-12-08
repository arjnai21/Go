import React from 'react';
import './NewApp.css';
import NamePage from './NamePage';
import LobbyPage from './LobbyPage';
import GamePage from './GamePage';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import SocketIO from "socket.io-client";

interface AppState {
    username: string;
    color: string;
    opponentName: string;
    socket: any;
}

class App extends React.Component<{}, AppState> {

    constructor(props : any) {
        super(props);
        this.state = {username: "", color: "B", opponentName: "opponent", socket: SocketIO.io("http://localhost:3001")};
        this.setUsername = this.setUsername.bind(this);
        this.setColor = this.setColor.bind(this);
        this.setOpponentName = this.setOpponentName.bind(this);
    }

    setUsername(username: string) {
        this.state.socket.emit("client_server_set_username", {username});
        this.setState({username: username});
    }

    setColor(color: string) {
        this.setState({color: color});
    }

    setOpponentName(opponentName: string) {
        this.setState({opponentName: opponentName});
    }

    // callAPI() {
    //     fetch("/testAPI")
    //         .then(res => res.text())
    //         .then(res => this.setState({apiResponse: res}))
    //         .catch(err => err);
    // }

    // componentDidMount(){
    //     this.callAPI();
    // }

    render() {
        return (
            <div className="App">
                <BrowserRouter>
                <Switch>
                <Route path={"/game"} render={(props) => <GamePage {...props} color={this.state.color} opponentName={this.state.opponentName} socket={this.state.socket} />} />
                <Route path={"/lobby"} render={(props) => <LobbyPage {...props} username={this.state.username} players={[""]} inviteDialogOpen={false} setColor={this.setColor} setOpponentName={this.setOpponentName} socket={this.state.socket}/>} />
                <Route path={"/"} render={(props) => <NamePage {...props} previousName={this.state.username} setUsername={this.setUsername}/>} />
                </Switch>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;