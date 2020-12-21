import React from "react";
import {RouteComponentProps, withRouter} from "react-router-dom";
import {Button, Paper, TextField, Typography} from "@material-ui/core";
import {styled} from "@material-ui/core/styles";
import logo from './logo.svg';

interface NamePageProps extends RouteComponentProps<any> {
    previousName: string;
    setUsername: any;
}

class NamePage extends React.Component<NamePageProps> {
    refs: any;

    constructor(props: NamePageProps) {
        super(props);
        this.refs = {};
    }

    render() {
        const WrapperPaper = styled(Paper)(theme => ({
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 1000,
            paddingTop: 150,
            paddingBottom: 150,
        }));

        return (
            <WrapperPaper style={{ background: "#fffaed" }} elevation={3}>
                <img src={logo} className="App-logo" alt="Go"/>
                <br/>
                <br/>
                <Typography variant="h4">Enter a name:</Typography>
                <TextField variant="outlined" size="small" style={{width: 500}} defaultValue={this.props.previousName}
                           inputRef={(c) => {
                               this.refs = {...this.refs, username: c};
                           }}/>
                <br/>
                <br/>
                <Button variant="contained" style={{width: 150}} onClick={() => {
                    this.props.setUsername(this.refs.username.value);
                    console.log(this.refs.username.value);
                    this.props.history.push("/lobby");
                }}>Play</Button>
            </WrapperPaper>
        );
    }
}

export default withRouter(NamePage);
