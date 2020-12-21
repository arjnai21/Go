import React from "react";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import {TransitionProps} from '@material-ui/core/transitions';
import Button from '@material-ui/core/Button';
import LobbyVirtualizedList from "./LobbyVirtualizedList";
import {RouteComponentProps, withRouter,} from "react-router-dom";
import {Paper, styled} from "@material-ui/core";

interface LobbyPageProps extends RouteComponentProps<any> {
    username?: string,
    players: Array<string>,
    inviteDialogOpen: boolean,
    setColor: any,
    setOpponentName: any,
    socket: any
}

interface LobbyPageState {
    username?: string,
    players: Array<string>,
    opponentName?: string,
    declinedSnackbarOpen?: boolean,
    inviteDialogOpen: boolean,
    inviteId?: string
}


class LobbyPage extends React.Component<LobbyPageProps, LobbyPageState> {

    constructor(props: LobbyPageProps) {
        super(props);
        this.state = {
            username: props.username,
            players: props.players,
            inviteDialogOpen: props.inviteDialogOpen
        };
    }

//   changeState(newState: any) {
//       this.setState(newState);
//   }

    componentDidMount() {
        this.props.socket.emit("client_server_lobby");
        this.props.socket.on("server_client_lobby", (information: { players: Array<string> }) => {
            console.log("getting players from server");
            console.log(information.players);
            this.setState({players: information.players})
        });

        this.props.socket.on("server_client_game_request", (information: { id: string, from: string, to: string }) => {
            if (information.to === this.state.username) {
                this.setState({opponentName: information.from, inviteDialogOpen: true, inviteId: information.id});
            }
        });

        this.props.socket.on(
            "server_client_game_start",
            (information: { gameId: number, color: string, opponent: string }) => {
                this.props.setColor(information.color);
                this.props.setOpponentName(information.opponent);
                this.props.history.push("/game");
            }
        );
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
            this.props.socket.emit("client_server_request_respond", {
                sender: this.state.opponentName,
                accepted: true,
                id: this.state.inviteId
            });
        };

        const handleDecline = () => {
            this.setState({inviteDialogOpen: false});
            this.props.socket.emit("client_server_request_respond", {sender: this.state.opponentName, accepted: false});
        };

        const handleRefreshLobby = () => {
            this.props.socket.emit('client_server_lobby');
        }

        const WrapperPaper = styled(Paper)(theme => ({
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 1000,
            paddingTop: 110,
            paddingBottom: 110,
        }));

        return (
            <div className="LobbyPage">
                <WrapperPaper>
                    <h1>Lobby</h1>

                    <h2>Pick someone to play with!</h2>

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
                    <LobbyVirtualizedList players={this.state.players}
                                          socket={this.props.socket}></LobbyVirtualizedList>
                    <Button onClick={handleRefreshLobby}>Refresh</Button>
                </WrapperPaper>
            </div>


        );
    }
}

export default withRouter(LobbyPage);

