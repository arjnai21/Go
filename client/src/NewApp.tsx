import React from 'react';
import logo from './logo.svg';
import './App.css';
import NamePage from './NamePage';
import {BrowserRouter, Switch, Route} from 'react-router-dom';

interface AppState {
    username: string
}

class App extends React.Component<{}, AppState> {

    constructor(props : any) {
        super(props);
        this.state = {username: ""};
        this.setUsername = this.setUsername.bind(this);
    }

    setUsername(username: string) {
        this.setState({username: username});
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
                <Route path={""} render={(props) => <NamePage {...props} previousName={this.state.username} setUsername={this.setUsername}/>} />
                </Switch>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;