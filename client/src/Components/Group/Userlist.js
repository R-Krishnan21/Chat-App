import React, {useState,useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';
import AuthHandler from '../Auth/Auth';
import { Redirect } from 'react-router';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    top: '30%',
    left: '40%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    maxHeight: 300,
  },
  listSection: {
    backgroundColor: 'inherit',
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0,
  },
}));

const port = AuthHandler.port()

export default function PinnedSubheaderList(props) {
  const classes = useStyles();
  const [users, setUsers] = useState([])
  const [redirect, setRedirect] = useState(false)

  useEffect(() => {
    setUsers(props.users)
  }, [props])

  const handleDelete = (e) => {
    const userObj = e.currentTarget.value
    const userID = e.currentTarget.id
    const variables = {
      "id": props.id,
      "users":[{"_id": userID,"user":userObj}],
    }
    axios({
      method:'post',
      url:`http://127.0.0.1:${port}/group/removeUser`, 
      data: variables,
      headers: {
        Authorization: `Bearer ${AuthHandler.getLoginToken()}`,
        id: props.id,
        userId: userObj
      }
    }) .then(res => {
          setUsers(res.data)
          if(userObj === AuthHandler.getUserID()){
            setRedirect(true)
          }
        }
        ).catch( err => {
            console.log(err)
        })
  
  }

  return (
      <>
      {
        redirect ? <Redirect to={'/group'}/>:''
      }
        <List className={classes.root} subheader={<li />}>
            <ul className={classes.ul}>
                <ListSubheader>Users</ListSubheader>
                {users.map((item) => (
                <ListItem key={item._id}>
                    <ListItemText secondary={item.user} />
                    <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete" onClick={handleDelete} value={item.user} id={item._id}>
                          <DeleteIcon/>
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
                ))}
            </ul>
        </List>
    </>
)
}