import React, {useState,useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Sidebar from '../Sidebar/Sidebar';
import Input from '../Chat/Input';
import Message from '../Chat/Mesage';
import Avatar from '@material-ui/core/Avatar';
import axios from 'axios';
import AuthHandler from '../Auth/Auth';
import { io } from 'socket.io-client';

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

const id = AuthHandler.getUserID()
const port = AuthHandler.port()

const socket = io(`http://localhost:${port}`,{ query: { id } })

export default function PermanentDrawerLeft() {
  const classes = useStyles();
  const [messages, newMessages] = useState([])
  const [user, setUser] = useState('')
  const [name, setName] = useState('')
  const port = AuthHandler.port()

  useEffect(() => {
    if(socket){
      if(localStorage.getItem('user')){
        let userNow = localStorage.getItem('user')
        socket.on("recieved-message", ({value,receiver,sender,name})=>{
          if(userNow === sender){
            setUser(receiver)
            setName(name)
            newMessages(value)
          }
        })
      }
    }
  }, [])

  const handleChange = (value)=>{
    newMessages(value)
    let receiver = user
    let sender = AuthHandler.getUserID()
    socket.emit("send-message",{value,receiver,sender,name})
  }

  const handleSidebar = (value) => {
    let values = value.split(",")
    setUser(values[0])
    setName(values[1])

    localStorage.setItem('user',user)

    if(user!==''){

      const variables = {
        "users":[AuthHandler.getUserID(),user]
      }

      axios({
        method:'post',
        url:`http://127.0.0.1:${port}/chat/getChat`, 
        data: variables,
        headers: {
          Authorization: `Bearer ${AuthHandler.getLoginToken()}`
        }
      }) .then(res => {
            if(res.data.length == 0){
              newMessages([])
            } else{
              newMessages(res.data[0].messages)
            }
          }).catch( err => {
              console.log(err)
          })
    }
  }

  return (
      <div className={classes.root}>
        <CssBaseline />
        <Sidebar onChange={handleSidebar}/>
        { user ?
        <>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Avatar alt={name} src="/static/images/avatar/1.jpg"/>
            <Typography variant="h6" noWrap className={classes.title}>
              {name}
              <Typography>
                online
              </Typography>
            </Typography>
          </Toolbar>
        </AppBar>
        
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <div style={{marginBottom:50}}>
            <Message message={messages}/>
          </div>
          <Input onChange={handleChange} user={user}/>
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
