import React, {useState,useEffect} from 'react';
import TextField from '@material-ui/core/TextField';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import AuthHandler from '../Auth/Auth';

const useStyles = makeStyles((theme) => ({
    field: {
      marginTop: 20,
      marginBottom: 20,
      display: 'block',
      backgroundColor:"#fafafa"
    }
  }));

export default function AddContact(props) {
    const classes = useStyles();
    const [username,setUsername] = useState('')
    const [userId, setUserId] = useState('')
    const [contact, setContact] = useState([])
    const port = AuthHandler.port()

    const handleChange = (e) => {
        if(e.target.name === "setUsername"){
            setUsername(e.target.value)
        } else {
            setUserId(e.target.value)
        }
      }

    const handleSubmit = (e) => {
        e.preventDefault();
    
        const data = {
            user:AuthHandler.getUserID(),
            contacts:{
                name: username, 
                contact: userId
            }
        }
    
        axios.post(`http://127.0.0.1:${port}/contact/add`,data)
            .then( res => {
                props.onChange(res.data.contacts)
                setUsername('')
                setUserId('')
            })
            .catch( err => {
                console.log(err)
            })
      }

    return (
        <div>
            <Container maxWidth="xs" className={classes.back}>
                <form autoComplete="off" onSubmit={handleSubmit}>
                    <TextField className={classes.field}
                        onChange={handleChange}
                        type="text"
                        name="setUsername"
                        label="username" 
                        variant="outlined" 
                        color="secondary" 
                        fullWidth
                        required
                    />
                    <TextField className={classes.field}
                        onChange={handleChange}
                        type="text"
                        name="setUserId"
                        label="userId" 
                        variant="outlined" 
                        color="secondary" 
                        fullWidth
                        required
                    />
                    <Button
                        type="submit" 
                        color="secondary" 
                        variant="contained"
                        fullWidth
                        size="large"
                        endIcon={<KeyboardArrowRightIcon />}>
                        Add User
                    </Button>
                </form>
              </Container>
        </div>
    )
}
