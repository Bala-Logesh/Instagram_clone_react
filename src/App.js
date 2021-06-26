import { useState, useEffect } from "react";
import Post from "./components/Post";
import { Modal, makeStyles, Button, Input } from '@material-ui/core'
import { db, auth } from './firebase'
import ImageUpload from "./components/ImageUpload";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    padding: '30px 20px',
    borderRadius: '10px'
  },
  input: {
    margin: '10px 0px',
    width: '100%'
  },
  button: {
    margin: '20px 0px 0px',
    width: '100%'
  }
}));

function App() {
  const [posts, setPosts] = useState([])
  const [open, setOpen] = useState(false)
  const [openLogin, setOpenLogin] = useState(false)

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authUser => {
      if(authUser){
        setUser(authUser)
      } else {
        setUser(null)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [user, username])

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      }
      )))
    })
  }, [])

  // Create a new user with the username, email and password
  const handleSignup = (e) => {
    e.preventDefault()

    auth
      .createUserWithEmailAndPassword(email, password)
      .then(authUser => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch(err => alert(err.message))

      setEmail('')
      setPassword('')
      setUsername('')
      setOpen(false)
  }

  // Login the user with the email and the password
  const handleLogin = (e) => {
    e.preventDefault()

    auth
      .signInWithEmailAndPassword(email, password)
      .catch(err => alert(err.message))

      setEmail('')
      setPassword('')
      setOpenLogin(false)
  }
  
  return (
    <div className="app">

      {/* Sign Up modal */}
      <Modal
          open={open}
          onClose={ () => setOpen(false)}
      >
          <center>
            <div style={modalStyle} className={classes.paper}>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="Instagram Logo"
              />

              <br />

              <h4 style={{ fontWeight: 'normal', marginTop: '20px', marginBottom: '20px' }}>Sign In as new User</h4>

              <Input
                className={ classes.input }
                type='text'
                placeholder='Username'
                value={ username }
                onChange={ (e) => setUsername(e.target.value) }
              />

              <Input
                className={ classes.input }
                type='email'
                placeholder='Email'
                value={ email }
                onChange={ (e) => setEmail(e.target.value) }
              />

              <Input
                className={ classes.input }
                type='password'
                placeholder='Password'
                value={ password }
                onChange={ (e) => setPassword(e.target.value) }
              />

              <Button
                className={ classes.button }
                variant='outlined'
                color="primary"
                onClick={ handleSignup }
              >Sign Up</Button>
            </div>
          </center>
      </Modal>
      
      {/* Login modal */}
      <Modal
          open={ openLogin }
          onClose={ () => setOpenLogin(false) }
      >
          <center>
            <div style={modalStyle} className={classes.paper}>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="Instagram Logo"
              />

              <br />

              <h4 style={{ fontWeight: 'normal', marginTop: '20px', marginBottom: '20px' }}>Login as existing User</h4>

              <Input
                className={ classes.input }
                type='email'
                placeholder='Email'
                value={ email }
                onChange={ (e) => setEmail(e.target.value) }
              />

              <Input
                className={ classes.input }
                type='password'
                placeholder='Password'
                value={ password }
                onChange={ (e) => setPassword(e.target.value) }
              />

              <Button
                className={ classes.button }
                variant='outlined'
                color="primary"
                onClick={ handleLogin }
              >Login</Button>
            </div>
          </center>
      </Modal>

      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="Instagram Logo"
        />

        { user ? (
          <div className="app__dispName">
            <h4>Welcome { user.displayName }</h4>
            <Button onClick={ () => auth.signOut() }>Logout</Button>
          </div>
        ) : (
          <div className="app__loginContainer">
            <Button onClick={ () => setOpenLogin(true) }>Login</Button>
            <Button onClick={ () => setOpen(true) }>Sign Up</Button>
          </div>
        ) }
      </div>

      <div className="app__posts">
        { posts.map(({ id, post }) => <Post username={ post.username } user={ user } caption={ post.caption } imageUrl={ post.imageUrl } postId={ id } key={ id } /> ) }
      </div>

      { user?.displayName ? (
        <ImageUpload username={ user.displayName } />
      ) : (
        <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Sorry, You have to login to post</h3>
      ) }
      
    </div>
  );
}

export default App;
