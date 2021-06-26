import { useState } from 'react'
import { Button, Input } from '@material-ui/core'
import { db, storage } from '../firebase'
import '../css/ImageUpload.css'
import firebase from 'firebase'

const ImageUpload = ({ username }) => {
    const [image, setImage] = useState(null)
    const [progress, setProgress] = useState(0)
    const [caption, setCaption] = useState('')

    const handleChange = e => {
        if(e.target.files[0]){
            setImage(e.target.files[0])
        }
    }

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${ image.name }`).put(image)

        uploadTask.on(
            'state_changed',
            snapshot => {
                // Progress Function
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                setProgress(progress)
            },
            error => {
                // Error Function
                console.log(error);
                alert(error.message)
            },
            () => {
                // Complete Function
                storage
                    .ref('images')
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        db.collection('posts').add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username
                        })

                        setProgress(0)
                        setImage(null)
                        setCaption('')
                    })
            }
        )
    }

    return (
        <div className="container">
            <div className='imageupload'>
            <Input
                className='imageupload__input'
                type='text'
                placeholder='Enter a caption'
                value={ caption }
                onChange={ e => setCaption(e.target.value) }
              />
            <br />
            <input
                className='imageupload__file'
                type="file"
                onChange={ handleChange }
            />
            <br />
            <Button
                className='imageupload__btn'
                onClick={ handleUpload }
                variant='outlined' 
                color="primary"
                size='small'
            >Upload</Button>
            <br />
            <progress value={ progress } max='100' />
        </div>
        </div>
    )
}

export default ImageUpload
