import React, {useState,useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Sidebar from './Sidebar';
import Input from '../Group/Input';
import Message from '../Group/Mesage'
import Avatar from '@material-ui/core/Avatar';
import Modal from '@material-ui/core/Modal';
import Fab from '@material-ui/core/Fab';
import AddUser from './AddUser';
import Userlist from './Userlist';
import axios from 'axios';
import AuthHandler from '../Auth/Auth';
import io from "socket.io-client";

const drawerWidth = 400;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexGrow: 1
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
  title:{
      flexGrow:1,
      paddingLeft:10
  }
}));

const port = AuthHandler.port()

export default function PermanentDrawerLeft(props) {
  const classes = useStyles();
  const [messages, newMessages] = useState([])
  const [open, setOpen] = useState(false);
  const [openUser, setOpenUser] = useState(false);
  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [users, setUsers] = useState([])
  const port = AuthHandler.port()

  const section = {id}
  const group = io.connect(`http://localhost:${port}/group`,{query:{section}})

  useEffect(() => {
    if(group){
        group.on("recieved-group", ({value,grpId})=>{
          if(grpId == section){
            newMessages(value)
          }
        })
    }
    
  }, [])

  const handleChange = (value)=>{
    newMessages(value)
    let grpId = section
    group.emit('send-group',{value,grpId})
  }

  const handleCloseFab = () => {
    setOpen(false);
  };

  const handleFab = () => {
    setOpen(true);
  }

  const handleCloseFabUser = () => {
    setOpenUser(false);
  };

  const handleFabUser = () => {
    setOpenUser(true);
  }

  const handleNewUser = (value) => {
    setUsers(value.users)
    setOpen(false)
  }

  const handleSidebar = (value) => {
    let values = value.split(",")
    setId(values[0])
    setName(values[1])

    localStorage.setItem('group',group)

    if(id!==''){

      const variables = {
        "id": id
      }

      axios({
        method:'post',
        url:`http://127.0.0.1:${port}/group/getChat`, 
        data: variables,
        headers: {
          Authorization: `Bearer ${AuthHandler.getLoginToken()}`
        }
      }) .then(res => {
          if(res.data[0].messages.length == 0){
            newMessages([])
          } else{
            newMessages(res.data[0].messages)
          }
            setUsers(res.data[0].users)
          }
          ).catch( err => {
              console.log(err)
          })
    }
  }

  return (
      <div className={classes.root}>
        <CssBaseline />
        <Sidebar onChange={handleSidebar}/>
        { id ? 
        <>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Avatar alt={name} src="/static/images/avatar/1.jpg"/>
            <Typography variant="h6" noWrap className={classes.title}>
              {name}
            </Typography>
            <IconButton color="inherit">
              <Button variant="contained" color="secondary" onClick={handleFabUser}> 
                Users
              </Button>
            </IconButton>
            <Modal
                open={openUser}
                onClose={handleCloseFabUser}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
              >
                <Userlist users={users} id={id}/>
              </Modal>

            <IconButton color="inherit">
              <Fab color="secondary" onClick={handleFab}>
                <AddIcon />
              </Fab>
            </IconButton>
            <Modal
                open={open}
                onClose={handleCloseFab}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
              >
                <AddUser id={id} onChange={handleNewUser}/>
              </Modal>
          </Toolbar>
        </AppBar>
        
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <div style={{marginBottom:50}}>
            <Message message={messages}/>
          </div>
          <Input onChange={handleChange} id={id}/>
        </main>
        </>
        :
        <AppBar className={classes.appBar}>
          <Toolbar>
          
          </Toolbar>
        </AppBar>
        }
      </div>
  );
}
