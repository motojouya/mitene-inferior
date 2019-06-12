// import React, { Component } from 'react';
import React, { useState } from 'react';
import Amplify, { API, Auth, I18n } from 'aws-amplify';
import dynamoDB from 'aws-sdk/clients/dynamodb';
// import { Authenticator } from 'aws-amplify-react';
import {
  withAuthenticator,
  S3Album,
  FormSection,
  SectionHeader,
  SectionBody,
  SectionFooter,
  FormField,
  Input,
  InputLabel as AmplifyInputLabel,
  SelectInput,
  Button as AmplifyButton,
  InputRow,
  ButtonRow,
  Link,
  SectionFooterPrimaryContent,
  SectionFooterSecondaryContent,
  SignUp,
  ConfirmSignIn,
  ConfirmSignUp,
  ForgotPassword,
  SignIn,
  VerifyContact,
  AmplifyTheme,
} from 'aws-amplify-react';

import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';
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

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';

import uuid from 'uuid/v4';

Amplify.configure({
  Auth: {
    identityPoolId: 'ap-northeast-1:1c787fbc-6cf3-41e5-84c0-944ded489bef',
    region: 'ap-northeast-1',
    userPoolId: 'ap-northeast-1_nXzG3qeZX',
    userPoolWebClientId: '132vh81i525sefdskttppjov7v',
  },
  Storage: {
    AWSS3: {
      bucket: 'mitene-inferior',
      region: 'ap-northeast-1',
    }
  },
  API: {
    endpoints: [
      {
        name: 'APIGatewayMiteneAlbum',
        endpoint: 'https://jypo1jbakl.execute-api.ap-northeast-1.amazonaws.com/test',
        region: 'ap-northeast-1',
      },
    ]
  }


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
  form: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: 'fit-content',
  },
  formControl: {
    marginTop: theme.spacing.unit * 2,
    minWidth: 120,
  },
  formControlLabel: {
    marginTop: theme.spacing.unit,
  },
});

const SnackBarWrap = ({ render }) => {

  const [open, changeOpen] = useState(false);
  const [message, changeMessage] = useState('');

  const handleClick = messageProp => {
    changeMessage(messageProp.message);
    changeOpen(true);
  };

  const handleClose = () => {
    changeMessage('');
    changeOpen(false);
  };

  const SnackbarComponent = () => (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }}
      open={open}
      onClose={handleClose}
      autoHideDuration={3000}
      ContentProps={{
        'aria-describedby': 'message-id',
      }}
      TransitionComponent={props => <Slide {...props} direction="left" />}
      message={<span id="message-id">{message}</span>}
    />
  );

  return <>{render(handleClick, SnackbarComponent)}</>;
};

const PrimarySearchAppBar = ({ classes }) => {

  Auth.currentUserPoolUser({ bypassCache: true });

  const [config, showConfig] = useState(true);

  return (
    <SnackBarWrap render={(showSnackbar, SnackBarComponent) => (
      <div className={classes.root}>
        <HeaderBar classes={classes} showConfig={showConfig} />
        {!config && <S3Album path="" picker />}
        {config && <Nest showSnackbar={showSnackbar} />}
        <SnackBarComponent />
      </div>
    )}/>
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
                  <IconButton aria-label="Add" onClick={() => context.inviteMemberForm(true)}>
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
              <IconButton aria-label="Create" onClick={() => context.createAlbumForm()}>
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

const createAlbum = afterCallback => async (albumName, relative) => {

  try {
    const userSession = await Auth.currentSession();
    const idToken = userSession.getIdToken().getJwtToken();

    const requestBody = {
      headers: {
        Authorization: idToken,
      },
      body: {
        albumName,
        relative,
      }
    };

    const res = await API.post('APIGatewayMiteneAlbum', '/album', requestBody);

    // refresh id token for update user attribute
    Auth.currentUserPoolUser({ bypassCache: true });
    afterCallback({ message: `Album ${albumName} を作成しました！` });

  } catch (e) {
    console.log(e);
  }
};

const deleteAlbum = () => {};

const inviteMember = afterCallback => async (albumId, albumName, email, relative) => {

  //TODO ここにCognitoUserが必要なんだけど、どうやって取得するのか
  Auth.userAttributes();


  try {
    const userSession = await Auth.currentSession();
    const idToken = userSession.getIdToken().getJwtToken();

    const requestBody = {
      headers: {
        Authorization: idToken,
      },
      body: {
        email,
        relative,
      }
    };

    const res = await API.post('APIGatewayMiteneAlbum', `/album/${albumId}`, requestBody);

    // refresh id token for update user attribute
    Auth.currentUserPoolUser({ bypassCache: true });
    afterCallback({ message: `${email}にAlbum ${albumName} への招待を送信しました！` });

  } catch (e) {
    console.log(e);
  }

};

const removeMember = () => {};


const AlbumControl = ({ classes, createAlbumForm, inviteMemberForm }) => {

  return (
    <AlbumContext.Provider value={{ classes, createAlbumForm, deleteAlbum, inviteMemberForm, removeMember }}>
      <Albums albums={[]} />
    </AlbumContext.Provider>
  );
};

const NestedList = ({ classes, showSnackbar }) => {

  const [activeCreateAlbum, changeActiveCreateAlbum] = React.useState(false);
  const [activeInviteMember, changeActiveInviteMember] = React.useState(false);

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
                <IconButton onClick={() => changeActiveInviteMember(true)}>
                <AddCircle />
                </IconButton>
              </ListItemIcon>
              <ListItemText primary="Add Family" />
            </ListItem>
          </List>
        </Collapse>
        <ListItem>
          <ListItemIcon>
            <IconButton onClick={() => changeActiveCreateAlbum(true)}>
              <AddCircle />
            </IconButton>
          </ListItemIcon>
          <ListItemText primary="Create Album" />
        </ListItem>
      </List>
      <Divider variant="middle" style={{ marginBottom: '30px' }}/>
      <AlbumControl
        classes={classes}
        createAlbumForm={changeActiveCreateAlbum}
        inviteMemberForm={changeActiveInviteMember}
      />
      <DialogCreateAlbum
        classes={classes}
        isOpen={activeCreateAlbum}
        changeOpen={changeActiveCreateAlbum}
        submitCreateAlbum={createAlbum(showSnackbar)}
      />
      <DialogInviteMember
        classes={classes}
        isOpen={activeInviteMember}
        changeOpen={changeActiveInviteMember}
        submitCreateAlbum={inviteMember(showSnackbar)}
      />
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
          <ListItemText primary="Sign Out" onClick={() => Auth.signOut()}/>
        </ListItem>
      </List>
    </div>
  );
};

const DialogCreateAlbum = ({ classes, isOpen, changeOpen, submitCreateAlbum }) => {

  const [relative, changeRelative] = React.useState('father');
  const [albumName, changeAlbumName] = React.useState('');

  const handleChangeAlbumName = e => changeAlbumName(e.target.value);
  const handleChangeRelative = e => changeRelative(e.target.value);
  const submit = () => {
    changeOpen(false);
    submitCreateAlbum(albumName, relative);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => changeOpen(false)}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
      <DialogContent>
        <DialogContentText>
          アルバムの名前とあなたの立場を入力してください
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Album Name"
          type="text"
          fullWidth
          onChange={handleChangeAlbumName}
        />
        <form className={classes.form} noValidate>
          <FormControl className={classes.formControl}>
            <SelectRelative {...{relative, handleChangeRelative}} />
          </FormControl>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => changeOpen(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={submit} color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const DialogInviteMember = ({ classes, isOpen, changeOpen, submitInviteMember }) => {

  const [relative, changeRelative] = React.useState('father');
  const [email, changeEmail] = React.useState('');

  const handleChangeEmail = e => changeEmail(e.target.value);
  const handleChangeRelative = e => changeRelative(e.target.value);
  const submit = () => {
    changeOpen(false);
    submitInviteMember(email, relative);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => changeOpen(false)}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
      <DialogContent>
        <DialogContentText>
          招待する方のEmailアドレスを入力してください
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Email"
          type="text"
          fullWidth
          onChange={handleChangeEmail}
        />
        <form className={classes.form} noValidate>
          <FormControl className={classes.formControl}>
            <SelectRelative {...{relative, handleChangeRelative}} />
          </FormControl>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => changeOpen(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={submit} color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const SelectRelative = (relative, handleChangeRelative) => {
  return (
    <>
      <InputLabel htmlFor="max-width">立場</InputLabel>
      <Select
        value={relative}
        onChange={handleChangeRelative}
        inputProps={{
          name: 'max-width',
          id: 'max-width',
        }}
      >
        <MenuItem value="father">father</MenuItem>
        <MenuItem value="mother">mother</MenuItem>
        <MenuItem value="grand father">grand father</MenuItem>
        <MenuItem value="grand mother">grand mother</MenuItem>
        <MenuItem value="other">other</MenuItem>
      </Select>
    </>
  );
};

NestedList.propTypes = {
  classes: PropTypes.object.isRequired,
};

const Nest = withStyles(listStyles)(NestedList);



const FormDialog = () => {
  const [isOpen, changeOpen] = React.useState(false);
  return (
    <div>
      <Button variant="outlined" color="primary" onClick={() => changeOpen(true)}>
        Open form dialog
      </Button>
      <Dialog
        open={isOpen}
        onClose={() => changeOpen(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We will send
            updates occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => changeOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => changeOpen(false)} color="primary">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

class MiteneSignUp extends SignUp {
  showComponent(theme) {
    //const { hide } = this.props
    //if (hide && hide.includes(SignUp)) {
    //  return null
    //}

    return (
      <FormSection theme={theme}>
        <SectionHeader theme={theme}>{I18n.get("Sign Up Account")}</SectionHeader>
        <SectionBody theme={theme}>
          <InputRow
            placeholder={I18n.get("Nickname")}
            theme={theme}
            key="name"
            name="name"
            onChange={this.handleInputChange}
          />
          <InputRow
            placeholder={I18n.get("Email")}
            theme={theme}
            key="email"
            name="email"
            onChange={this.handleInputChange}
          />
          <InputRow
            placeholder={I18n.get("Password")}
            theme={theme}
            type="password"
            key="password"
            name="password"
            onChange={this.handleInputChange}
          />
          {/*<InputRow
            placeholder={I18n.get('Phone Number')}
            theme={theme}
            key="phone_number"
            name="phone_number"
            onChange={this.handleInputChange}
          />*/}
          <ButtonRow onClick={this.signUp} theme={theme}>
            {I18n.get("Sign Up")}
          </ButtonRow>
        </SectionBody>
        <SectionFooter theme={theme}>
          <div style={theme.col6}>
            <Link theme={theme} onClick={() => this.changeState("confirmSignUp")}>
              {I18n.get("Confirm a Code")}
            </Link>
          </div>
          <div style={Object.assign({ textAlign: "right" }, theme.col6)}>
            <Link theme={theme} onClick={() => this.changeState("signIn")}>
              {I18n.get("Sign In")}
            </Link>
          </div>
        </SectionFooter>
      </FormSection>
    )
  }

  async signUp() {
    const { email, password, name } = this.inputs
    //const username = `${uuid()}@${email}`;
    const username = email;
    try {
      await Auth.signUp({
        attributes: {
          email,
          name,
        },
        username,
        password,
      })
      this.changeState("confirmSignUp", username)
    } catch (err) {
      this.error(err)
    }
  }
}


// class MiteneSignUp extends SignUp {
// 
//     signUp() {
//         if (!this.inputs.dial_code) {
//             this.inputs.dial_code = this.getDefaultDialCode();
//         }
//         const validation = this.validate();
//         if (validation && validation.length > 0) {
//           return this.error(`The following fields need to be filled out: ${validation.join(', ')}`);
//         }
//         if (!Auth || typeof Auth.signUp !== 'function') {
//             throw new Error('No Auth module found, please ensure @aws-amplify/auth is imported');
//         }
// 
//         let signup_info = {
//             username: this.inputs.username,
//             password: this.inputs.password,
//             attributes: {
// 
//             }
//         };
// 
//         const inputKeys = Object.keys(this.inputs);
//         const inputVals = Object.values(this.inputs);
// 
//         inputKeys.forEach((key, index) => {
//             if (!['username', 'password', 'checkedValue', 'dial_code'].includes(key)) {
//               if (key !== 'phone_line_number' && key !== 'dial_code' && key !== 'error') {
//                 const newKey = `${this.needPrefix(key) ? 'custom:' : ''}${key}`;
//                 signup_info.attributes[newKey] = inputVals[index];
//               } else if (inputVals[index]) {
//                   signup_info.attributes['phone_number'] = `${this.inputs.dial_code}${this.inputs.phone_line_number.replace(/[-()]/g, '')}`
//               }
//             }
//         });
// 
//         Auth.signUp(signup_info).then((data) => {
//             this.changeState('confirmSignUp', data.user.username)
//         })
//         .catch(err => this.error(err));
//     }
// 
//     showComponent(theme) {
//         const { hide } = this.props;
//         if (hide && hide.includes(SignUp)) { return null; }
//         if (this.checkCustomSignUpFields()) {
//             this.signUpFields = this.props.signUpConfig.signUpFields;
//         }
//         this.sortFields();
//         return (
//             <FormSection theme={theme} >
//                 <SectionHeader theme={theme} >{I18n.get(this.header)}</SectionHeader>
//                 <SectionBody theme={theme} >
//                     {
//                         this.signUpFields.map((field) => {
//                             return (
//                                 <FormField theme={theme} key={field.key}>
//                                 {
//                                     field.required ? 
//                                     <AmplifyInputLabel theme={theme}>{I18n.get(field.label)} *</AmplifyInputLabel> :
//                                     <AmplifyInputLabel theme={theme}>{I18n.get(field.label)}</AmplifyInputLabel>
//                                 }
//                                     <Input
//                                         autoFocus={this.signUpFields.findIndex(f => f.key === field.key) === 0 ? true : false}
//                                         placeholder={I18n.get(field.placeholder)}
//                                         theme={theme}
//                                         type={field.type}
//                                         name={field.key}
//                                         key={field.key}
//                                         onChange={this.handleInputChange}
//                                     />
//                                 </FormField>
//                             )
//                         })
//                     }
//                 </SectionBody>
//                 <SectionFooter theme={theme} >
//                     <SectionFooterPrimaryContent theme={theme}>
//                         <AmplifyButton onClick={this.signUp} theme={theme} >
//                             {I18n.get('Create Account')}
//                         </AmplifyButton>
//                     </SectionFooterPrimaryContent>
//                     <SectionFooterSecondaryContent theme={theme}>
//                         {I18n.get('Have an account? ')}
//                         <Link theme={theme} onClick={() => this.changeState('signIn')} >
//                             {I18n.get('Sign in')}
//                         </Link>
//                     </SectionFooterSecondaryContent>
//                 </SectionFooter>
//             </FormSection>
//         );
//     }
// 
// }

// export default withAuthenticator(withStyles(headerStyles)(PrimarySearchAppBar));
export default withAuthenticator(withStyles(headerStyles)(PrimarySearchAppBar), true, [
  <SignIn />,
  <ConfirmSignIn />,
  <VerifyContact />,
  <MiteneSignUp override="SignUp" />,
  <ConfirmSignUp />,
  <ForgotPassword />,
], null, AmplifyTheme);

