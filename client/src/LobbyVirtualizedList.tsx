import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import socket from './index';

interface VirtualizedListProps {
  players: Array<string>
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      height: 400,
      maxWidth: 300,
      backgroundColor: theme.palette.background.paper,
    },
  }),
);

const handleInvite = (opponentName : string) => {
  console.log("oN" + opponentName);
  socket.emit("client_server_request_user", { username: opponentName });
};

function renderRow(props: ListChildComponentProps) {
  const { data, index, style } = props;
  console.log(data);
  return (
     <ListItem button onClick={() => handleInvite(data.playerArray[index])} style={style} key={index}>
      <ListItemText primary={`${data.playerArray[index]}`} />
    </ListItem>
  );
}

export default function VirtualizedList(props: VirtualizedListProps) {
  const {players} = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <FixedSizeList height={400} width={300} itemSize={46} itemCount={players.length} itemData = {{ playerArray: players }}>
        {renderRow}
      </FixedSizeList>
    </div>
  );
}
