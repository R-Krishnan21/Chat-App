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

export default function AddGroup(props) {
    const classes = useStyles();
    const [groupname,setGroupname] = useState('')
    const port = AuthHandler.port()

    const handleChange = (e) => {
        if(e.target.name === "setGroupname"){
            setGroupname(e.target.value)
        }
      }

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if(groupname !== ''){
            const data = {
                user:AuthHandler.getUserID(),
                name: groupname
            }
        
            axios.post(`http://127.0.0.1:${port}/group/create`,data)
                .then( res => {
                    props.onChange(res.data)
                    setGroupname('')
                })
                .catch( err => {
                    console.log(err)
                })
        }
      }

    return (
        <div>
            <Container maxWidth="xs" className={classes.back}>
                <form autoComplete="off" onSubmit={handleSubmit}>
                    <TextField className={classes.field}
                        onChange={handleChange}
                        type="text"
                        name="setGroupname"
                        label="GroupName" 
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
                        Create Group
                    </Button>
                </form>
              </Container>
        </div>
    )
}
