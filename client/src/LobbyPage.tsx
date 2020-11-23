import React from "react";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import Button from '@material-ui/core/Button';
import LobbyVirtualizedList from "./LobbyVirtualizedList";
import socket from './index';
import {
    BrowserRouter,
    Switch,
    Route,
    Link,
    useHistory,
  } from "react-router-dom";

interface LobbyPageProps {
    username?: string,
    players: Array<string>,
    inviteDialogOpen: boolean
}

interface LobbyPageState {
    username?: string,
    players: Array<string>,
    opponentName?: string,
    declinedSnackbarOpen?: boolean,
    inviteDialogOpen: boolean
}


class LobbyPage extends React.Component<LobbyPageProps, LobbyPageState> {

  constructor(props: LobbyPageProps) {
    super(props);
    this.state = props;
  }

//   changeState(newState: any) {
//       this.setState(newState);
//   }

  componentDidMount() {
    socket.on("server_client_lobby", (information: {players: Array<string>}) => {
      console.log(information.players);
      this.setState({players: information.players})
    });
        
    socket.on("server_client_game_request", (information: {id: string, from: string, to: string}) => {
       if (information.to === this.state.username) {
          this.setState({opponentName: information.from, inviteDialogOpen: true});
      }
    });
  }

  render() {
    console.log(this.state.username);

    const Transition = React.forwardRef(function Transition(
        props: TransitionProps & { children?: React.ReactElement<any, any> },
        ref: React.Ref<unknown>,
      ) {
        return <Slide direction="up" ref={ref} {...props} />;
      });

    const handleAccept = () => {
      this.setState({inviteDialogOpen: false});
      socket.emit("client_server_request_respond", { sender: this.state.opponentName, accepted: true });
    };

    const handleDecline = () => {
      this.setState({inviteDialogOpen: false});
      socket.emit("client_server_request_respond", { sender: this.state.opponentName, accepted: false });
    };
    
    return (
        <div className="LobbyPage">

          <h1>Lobby</h1> 
          
          <h2>Pick someone to play with!</h2>

            <div>
                <Dialog
                    open={this.state.inviteDialogOpen}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleDecline}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle id="alert-dialog-slide-title">{"Game Invite Received!"}</DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {this.state.opponentName} wants to play with you!
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleAccept} color="primary">
                        Accept
                    </Button>
                    <Button onClick={handleDecline} color="primary">
                        Decline
                    </Button>
                    </DialogActions>
                </Dialog>
                {/*
 // @ts-ignore */}
                <LobbyVirtualizedList players={this.state.players} ></LobbyVirtualizedList>
            </div>

            
            
        </div>
    );
  }
}

export default LobbyPage;

