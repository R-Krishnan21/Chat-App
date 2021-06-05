import React, {useState,useEffect,useRef} from 'react';
import makeStyles from "@material-ui/core/styles/makeStyles";
import './mesage.css';
import Link from '@material-ui/core/Link';
import AuthHandler from '../Auth/Auth';

const useStyles = makeStyles(theme => ({
    container: {
      bottom: 0
    },
    bubbleContainer: {
      width: "100%",
      display: "flex",
    },
    bubble: {
      border: "0.5px solid black",
      borderRadius: "10px",
      margin: "5px",
      padding: "10px",
      display: "inline-block",
      maxWidth: "50%"
    }
}));

export default function Mesage(props) {
    const [messages, newMessages] = useState([])
    const classes = useStyles();
    const messagesEndRef = useRef(null)
    const port = AuthHandler.port()
    let direction = 'left'

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        newMessages(props.message)
        scrollToBottom()
      }, [props])
      
    const chatBubbles = messages.map((obj) => (
        <span>
            {
                AuthHandler.getUserID() == obj.sender ? 

                    obj.type === "image" ?

                    <div className={`${classes.bubbleContainer} right`} key={obj._id}>
                    <div className={classes.bubble} key={obj._id}>
                        {/* <div className={classes.button} key={obj._id}>{obj.message}</div> */}
                        <img
                            style={{ maxWidth: '300px' }}
                            src={`http://localhost:${port}/${obj.message}`}
                            alt="img"
                        />
                    </div>
                    </div>:

                    <div className={`${classes.bubbleContainer} right`} key={obj._id}>
                    <div className={classes.bubble} key={obj._id}>
                        <div className={classes.button} key={obj._id}>{obj.message}</div>
                    </div>
                    </div> :

                obj.type === "image" ?
                <div className={`${classes.bubbleContainer} right`} key={obj._id}>
                    <div className={classes.bubble} key={obj._id}>
                        <img
                            style={{ maxWidth: '300px' }}
                            src={`http://localhost:${port}/${obj.message}`}
                            alt="img"
                        />
                    </div>
                </div>:

                <div className={`${classes.bubbleContainer} ${direction}`} key={obj._id}>
                <div className={classes.bubble} key={obj._id}>
                    <div className={classes.button} key={obj._id}>{obj.message}</div>
                </div>
                </div>
            }
        </span>
    ));
        
    return (
        <div>
            <div className={classes.container}>{chatBubbles}</div>
            <div ref={messagesEndRef} />
        </div>
    )
}
