import { useState, useEffect } from 'react'
import { Avatar, TextField, Button } from '@material-ui/core'
import { db } from '../firebase'
import firebase from 'firebase'
import '../css/Post.css'

const Post = ({ username, user, caption, imageUrl, postId }) => {
    const [comment, setComment] = useState('')
    const [comments, setComments] = useState([])

    useEffect(() => {
        let unsubscribe
        if(postId){
            unsubscribe = db
                .collection('posts')
                .doc(postId)
                .collection('comments')
                .onSnapshot(snapshot => {
                    setComments(snapshot.docs.map(doc => ({
                        id: doc.id,
                        comment: doc.data()
                      })
                    )
                )})
        }

        return () => {
            unsubscribe()
        }
    }, [postId])

    const postComment = e => {
        e.preventDefault()

        db
            .collection('posts')
            .doc(postId)
            .collection('comments')
            .add({
                text: comment,
                username: user.displayName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            })
        
            setComment('')
    }

    return (
        <div className='post'>
            <div className="post__header">
                <Avatar
                    className='post__avatar'
                    alt={username}
                    src='/static/images/avatar/1.jpg'
                />
                <h3>{ username }</h3>
            </div>

            <img
                className='post__image'
                src={ imageUrl }
                alt="img"
            />

            <h4 className='post__text'><strong>{ username } </strong> { caption }</h4>

            <br />

            <div className="post__comments">
                {
                    comments.map(({ id, comment }) => (
                        <p key={ id }>
                            <strong>{ comment.username }</strong> { comment.text }
                        </p>
                    ))
                }
            </div>

            { user && (
                <form className='post__commentBox'>
                    <TextField
                        className='post__input'
                        inputProps={{
                            underline: {
                                "&&&:before": {
                                    borderBottom: "none"
                                },
                                "&&:after": {
                                    borderBottom: "none"
                                }
                            }
                        }}
                        type='text'
                        placeholder='Enter a commnet'
                        value={ comment }
                        onChange={ (e) => setComment(e.target.value) }
                    />
                    <Button
                        className='post__button'
                        disabled={ !comment }
                        type='submit'
                        onClick={ postComment }
                    >Comment</Button>
                </form>
            )}
        </div>
    )
}

export default Post
