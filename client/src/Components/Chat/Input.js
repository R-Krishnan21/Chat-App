import React, {useState,useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MicIcon from '@material-ui/icons/Mic';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import AuthHandler from '../Auth/Auth';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: "65%",
    position:"fixed",
    borderRadius:20,
    border: "1px red solid",
    bottom:20
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
    backgroundColor:"red"
  },
}));

export default function CustomizedInputBase(props) {
  const classes = useStyles();
  const [message,setMessage] = useState('')
  const port = AuthHandler.port()

  const handleChange = (e) =>{
    setMessage(e.target.value)
  }

  const onDrop = (files) => {

    let formData = new FormData();
    const config = {
        header: { 'content-type': 'multipart/form-data' }
    }
    console.log(files)
    formData.append("file", files[0])

    axios.post(`http://127.0.0.1:${port}/chat/uploadfiles`, formData, config)
        .then(response => {
            if (response.data.success) {

                console.log(response.data.filePath)

                //save message

                const variables = {
                  "users":[AuthHandler.getUserID(),props.user],
                  "message":{
                    "sender": AuthHandler.getUserID(),
                    "message": response.data.filePath,
                    "type":"image"
                  }
                }
                axios({
                  method:'post',
                  url:`http://127.0.0.1:${port}/chat/message`, 
                  data: variables,
                  headers: {
                    Authorization: `Bearer ${AuthHandler.getLoginToken()}`
                  }
                }) .then(res => {
                        props.onChange(res.data.messages)
                    }).catch( err => {
                        console.log(err)
                    })


            } else {
                alert('failed to save the video in server')
            }
        }).catch((err)=>{console.log(err)})
}

  const handleSubmit = (e) => {
    e.preventDefault();
    const variables = {
      "users":[AuthHandler.getUserID(),props.user],
      "message":{
        "sender": AuthHandler.getUserID(),
        "message": message,
        "type":"text"
      }
    }
    axios({
      method:'post',
      url:`http://127.0.0.1:${port}/chat/message`, 
      data: variables,
      headers: {
        Authorization: `Bearer ${AuthHandler.getLoginToken()}`
      }
    }) .then(res => {
            props.onChange(res.data.messages)
            setMessage('')
        }).catch( err => {
            console.log("error")
        })
  }

  return (
    <Paper component="form" className={classes.root} onSubmit={handleSubmit}>
      <Dropzone onDrop={onDrop}>
          {({ getRootProps, getInputProps }) => (
              <section>
                  <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <IconButton color="primary" className={classes.iconButton}>
                        <AttachFileIcon />
                      </IconButton>
                  </div>
              </section>
          )}
      </Dropzone>
      <Divider className={classes.divider} orientation="vertical" />
      <InputBase
        value={message}
        className={classes.input}
        placeholder="Enter message..."
        inputProps={{ 'aria-label': 'enter message' }}
        onChange={handleChange}
      />
      <IconButton color="primary" type="submit" className={classes.iconButton}>
        <SendIcon />
      </IconButton>
      <Divider className={classes.divider} orientation="vertical" />
      <IconButton color="primary" className={classes.iconButton} aria-label="directions">
        <MicIcon />
      </IconButton>
    </Paper>
  );
}
