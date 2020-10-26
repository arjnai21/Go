import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component<{/*default props*/}, {apiResponse: string}> {

    constructor(props : any) {
        super(props);
        this.state = {apiResponse: ""};
    }

    callAPI() {
        fetch("/testAPI")
            .then(res => res.text())
            .then(res => this.setState({apiResponse: res}))
            .catch(err => err);
    }

    componentDidMount(){
        this.callAPI();
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">{this.state.apiResponse}</h1>
                </header>
                <p className="App-intro">{this.state.apiResponse}</p>
            </div>
        );
    }
}

export default App;
