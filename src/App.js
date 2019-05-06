// import React, { Component } from 'react';
import React, { useState } from 'react';
import Amplify from 'aws-amplify';
// import { Authenticator } from 'aws-amplify-react';
import { withAuthenticator, S3Album } from 'aws-amplify-react';

import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';

import Settings from '@material-ui/icons/Settings';
import ArrowBack from '@material-ui/icons/ArrowBack';
import AddToPhotos from '@material-ui/icons/AddToPhotos';
import RemoveCircle from '@material-ui/icons/RemoveCircle';
import AddCircle from '@material-ui/icons/AddCircle';
import DeleteForever from '@material-ui/icons/DeleteForever';
import Create from '@material-ui/icons/Create';
import Edit from '@material-ui/icons/Edit';

import Divider from '@material-ui/core/Divider';

import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';



Amplify.configure({
  Auth: {
    identityPoolId: 'ap-northeast-1:c6f2c8dd-2c9a-4fb6-b5c2-653c5aee9401',
    region: 'ap-northeast-1',
    userPoolId: 'ap-northeast-1_9TnIBH7mj',
    userPoolWebClientId: '4megifsql6rfeje1n1b35f01h5',
  },
  Storage: {
    AWSS3: {
      bucket: 'mitene-inferior',
      region: 'ap-northeast-1',
    }
  },
});

// const AppWithAuth = () => <Authenticator />;

// import React from 'react';
// import logo from './logo.svg';
// import './App.css';
// 
// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }
// 
// export default App;

const headerStyles = theme => ({
  root: {
    width: '100%',
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  title: {
    display: 'block',
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 3,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
});

const PrimarySearchAppBar = ({ classes }) => {
  const [config, showConfig] = useState(true);
  return (
    <div className={classes.root}>
      <HeaderBar classes={classes} showConfig={showConfig} />
      {!config && <S3Album path="" picker />}
      {config && <Nest />}
    </div>
  );
}

const HeaderBar = ({ classes, showConfig }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton className={classes.menuButton} color="inherit" aria-label="Open drawer">
          <MenuIcon />
        </IconButton>
        <Typography className={classes.title} variant="h6" color="inherit" noWrap>
          Mitene Inferior
        </Typography>
        <div className={classes.grow} />
        <IconButton color="inherit" onClick={() => showConfig(false)}>
          <ArrowBack />
        </IconButton>
        <IconButton color="inherit">
          <AddToPhotos />
        </IconButton>
        <IconButton
          aria-owns="material-appbar"
          aria-haspopup="true"
          color="inherit"
          onClick={() => showConfig(true)}
        >
          <Settings />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

const Configs = () => {
  return (
    <div>

- album
  - father RemoveCircle
  - mother RemoveCircle
  - grand father RemoveCircle
  - grand mother RemoveCircle
  - .. RemoveCircle
  - add family AddCircle
- change album
  - .. DeleteForever
  - .. DeleteForever
  - make album Create
- indivisuals
  - name Edit
  - email Edit
  - password Edit
  - logout
    </div>
  );
};

PrimarySearchAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};



const listStyles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing.unit * 3,
  },
});

const AlbumContext = React.createContext();

const AlbumMember = ({ member: { cognitoUsername, name, relative } }) => {
  return (
    <AlbumContext.Consumer>
      { context =>
        <ListItem>
          <ListItemText primary={name} secondary={relative} />
          <ListItemSecondaryAction>
            <IconButton aria-label="Remove" onClick={() => context.removeMember(cognitoUsername)}>
              <RemoveCircle />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      }
    </AlbumContext.Consumer>
  );
};

const AlbumItem = ({ album: { basic: { albumId, albumName }, members } }) => {
  const [isOpen, changeOpen] = useState(false);
  return (
    <AlbumContext.Consumer>
      { context =>
        <>
          <ListItem>
            <ListItemText primary={albumName} />
            <ListItemSecondaryAction>
              <IconButton aria-label="Delete" onClick={() => context.deleteAlbum(albumId)}>
                <DeleteForever />
              </IconButton>
            </ListItemSecondaryAction>
            <ListItemSecondaryAction>
              <IconButton aria-label="Delete" onClick={() => context.changeOpen(!isOpen)}>
                {isOpen ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding className={context.classes.nested}>
              { members.map(member => <AlbumMember member={member} />) }
              <ListItem>
                <ListItemIcon>
                  <IconButton aria-label="Add" onClick={() => context.addMember(albumId)}>
                    <AddCircle />
                  </IconButton>
                </ListItemIcon>
                <ListItemText primary="Add Family" />
              </ListItem>
            </List>
          </Collapse>
        </>
      }
    </AlbumContext.Consumer>
  );
};

// const AlbumContext = { classes, createAlbum, deleteAlbum, addMember, removeMember };
const Albums = ({ albums }) => {
  return (
    <AlbumContext.Consumer>
      { context =>
        <List
          component="nav"
          subheader={<ListSubheader component="div">Albums</ListSubheader>}
          className={context.classes.root}
        >
          { albums.map(album => <AlbumItem album={album} />) }
          <ListItem>
            <ListItemIcon>
              <IconButton aria-label="Create" onClick={() => context.createAlbum()}>
                <AddCircle />
              </IconButton>
            </ListItemIcon>
            <ListItemText primary="Create Album" />
          </ListItem>
        </List>
      }
    </AlbumContext.Consumer>
  );
};

const AlbumControl = ({ classes }) => {

  const createAlbum = () => {};
  const deleteAlbum = () => {};
  const addMember = () => {};
  const removeMember = () => {};

  return (
    <AlbumContext.Provider value={{ classes, createAlbum, deleteAlbum, addMember, removeMember }}>
      <Albums albums={[]} />
    </AlbumContext.Provider>
  );
};

const NestedList = ({ classes }) => {
  return (
    <div>
      <List
        component="nav"
        subheader={<ListSubheader component="div">Albums</ListSubheader>}
        className={classes.root}
      >
        <ListItem>
          <ListItemText primary="ムスコ" />
          <ListItemSecondaryAction>
            <IconButton aria-label="Delete">
              <DeleteForever />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        <Collapse in={true} timeout="auto" unmountOnExit>
          <List component="div" disablePadding className={classes.nested}>
            <ListItem>
              <ListItemText primary="ワイ" secondary="father" />
              <ListItemSecondaryAction>
                <IconButton aria-label="Remove">
                  <RemoveCircle />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
              <ListItemText primary="ヨッメ" secondary="mother" />
              <ListItemSecondaryAction>
                <IconButton aria-label="Remove">
                  <RemoveCircle />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
              <ListItemText primary="オカン" secondary="grand mother" />
              <ListItemSecondaryAction>
                <IconButton aria-label="Remove">
                  <RemoveCircle />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
              <ListItemText primary="オヤジ" secondary="grand father" />
              <ListItemSecondaryAction>
                <IconButton aria-label="Remove">
                  <RemoveCircle />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <AddCircle />
              </ListItemIcon>
              <ListItemText primary="Add Family" />
            </ListItem>
          </List>
        </Collapse>
        <ListItem>
          <ListItemIcon>
            <AddCircle />
          </ListItemIcon>
          <ListItemText primary="Create Album" />
        </ListItem>
      </List>
      <Divider variant="middle" style={{ marginBottom: '30px' }}/>
      <AlbumControl classes={classes} />
      <Divider variant="middle" style={{ marginBottom: '30px' }}/>
      <List
        component="nav"
        subheader={<ListSubheader component="div">Profile</ListSubheader>}
        className={classes.root}
      >
        <ListItem>
          <ListItemText primary="ワイ" />
          <ListItemSecondaryAction>
            <IconButton aria-label="Edit">
              <Edit />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemText primary="test@gmail.com" />
          <ListItemSecondaryAction>
            <IconButton aria-label="Edit">
              <Edit />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemText primary="Password" />
          <ListItemSecondaryAction>
            <IconButton aria-label="Edit">
              <Edit />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemText primary="Sign Out" />
        </ListItem>
      </List>
    </div>
  );
};

NestedList.propTypes = {
  classes: PropTypes.object.isRequired,
};

const Nest = withStyles(listStyles)(NestedList);




export default withAuthenticator(withStyles(headerStyles)(PrimarySearchAppBar));

