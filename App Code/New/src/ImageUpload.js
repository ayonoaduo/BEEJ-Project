import React, {useState} from 'react';
//import {Button} from '@material-ui/core';
import firebase from "firebase";
import {storage, db} from './firebase';
import './ImageUpload.css';

function ImageUpload({username}) {
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null); //state for the progress bar
    const [progress, setProgress] = useState(0);
   
    

    const handleChange =  (e) => {//handleChange function fires off an event
        if (e.target.files[0]) { //get the first file you selected
            setImage(e.target.files[0]); //set the image in state to that file
        }
    };

    const handleUpload = () => {
        //access the storage in firebase, get a references to the folder images/ and store image there
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
            "state_changed",
            /*provide snapshot of the image uploading progress via an equation*/
            (snapshot) => {
                //progress function ...
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                //error function ..
                console.log(error);
                alert(error.message);
            },
            () => {
                // complete function ...
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()   //GET DOWNLOAD LINK TO THE IMAGE
                    .then(url => {
                        //post image inside db
                        db.collection("posts").add({
                            //get server timestamp so images are sorted by time posted
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username
                        });

                        setProgress(0); //reset progress
                        setCaption("");
                        setImage(null);
                    });
            }
        );
    };

    return (
        <div className="imageupload">
            <progress className="imageupload__progress" value={progress} max="100"/>
           <input type="text" placeholder='Enter a caption...' onChange={event => setCaption(event.target.value)} value={caption}/>
           <input type="file" onChange={handleChange} />
           <button onClick={handleUpload}>
            Upload
           </button>

        </div>
    )
}

export default ImageUpload