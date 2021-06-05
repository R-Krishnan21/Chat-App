import React,{useState,useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Fab from '@material-ui/core/Fab';
import MoreIcon from '@material-ui/icons/MoreVert';
import AddIcon from '@material-ui/icons/Add';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import Modal from '@material-ui/core/Modal';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import axios from 'axios';
import AuthHandler from '../Auth/Auth';
import AddGroup from './AddGroup';
import AddContact from '../Sidebar/AddContact'
import {
    Link,
    Redirect,
  } from "react-router-dom";
import { IconButton } from '@material-ui/core';

const drawerWidth = 400;

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  field: {
    marginTop: 20,
    marginBottom: 20,
    display: 'block',
    backgroundColor:"#fafafa"
  },
  link: {
      marginTop: 20,
      marginBottom: 20,
      display: 'block',
      textAlign:'center'
  },
  head:{
      textAlign: 'center' 
  },
  back:{
      marginTop:80,
      backgroundColor: "secondary",
      padding: "50px"
  },
}));

export default function FolderList(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [group, setGroup] = useState([])
  const port = AuthHandler.port()
  const [value, setValue] = React.useState(1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    axios({
      method:'post',
      url:`http://127.0.0.1:${port}/group/findUser`, 
      data: {"user":AuthHandler.getUserID()},
      headers: {
        Authorization: `Bearer ${AuthHandler.getLoginToken()}`
      }
    }) .then(res => {
          if(res.data){
            setGroup(res.data)
          }
        }).catch( err => {
            console.log(err)
        })
  },[])

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseFab = () => {
    setOpen(false);
  };

  const handleFab = () => {
    setOpen(true);
  }

  const handleGroupClick = (e) => {
    props.onChange(e.currentTarget.id)
  }

  const handleNewGroup = (value) => {
    setGroup([...group, value])
    setOpen(false)
  }

  return (
    <span>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <div className={classes.toolbar} />
        <Divider />
        <List style={{paddingBottom:50}}>
          <ListSubheader color="inherit">
              Chats
            <IconButton style={{marginLeft:"270px"}} color="inherit" onClick={handleClick}>
              <MoreIcon />
            </IconButton>
          </ListSubheader>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem component={Link} to="/logout" onClick={handleClose}>Logout</MenuItem>
            </Menu>
          <Divider />
          <Tabs value={value} onChange={handleChange} aria-label="simple tabs example" style={{width:400}}>
            <Tab label="Chat" {...a11yProps(0)} component={Link} to={`/`} />
            <Tab label="Group" {...a11yProps(1)} />
          </Tabs>
          
          <TabPanel value={value} index={1}>
              {group.map(group => 
                <> 
                  <ListItem onClick={handleGroupClick} key={group._id} id={[group._id,group.name]} name={group.name}>
                    <ListItemAvatar>
                      <Avatar>
                        <ImageIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={group.name} secondary={group._id}/>
                    <FiberManualRecordIcon color="secondary"/>
                  </ListItem>
                  <Divider/>
                </>
              )}
              <Fab color="secondary" className={classes.fab} onClick={handleFab}>
                <AddIcon />
              </Fab>
              <Modal
                open={open}
                onClose={handleCloseFab}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
              >
                <AddGroup onChange={handleNewGroup}/>
              </Modal>
          </TabPanel>
        </List>
      </Drawer>
    </span>
  )
}
