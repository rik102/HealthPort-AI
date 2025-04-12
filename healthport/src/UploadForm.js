import React, {useState} from 'react';
import {useDropzone} from 'react-dropzone';

const uploadFile = () =>{
    // creating a state to hold the uploaded files, could change this later
    const [files, setFiles] = useState([]);

    // dropzone hook: functions to define behavior of dropzone, and file input
    const {getRootProps, getInputProps} = useDropzone({
        accept: '.pdf, image/*',
        onDrop: (acceptedFiles) => { // function that gets called when files are dropped
            //console.log(acceptedFiles);
            //shows the preview: , well first part of it
            setFiles(acceptedFiles.map(file => Object.assign(file, {preview: URL.createObjectURL(file)})));
            // map is method that loops through acceptedFiles array
        }
    });

    return (
        // the dropzone area
        <div>
            <div {...getRootProps()} style={styles.dropzone}>
                <input {...getInputProps()} />
                <p>Drag and drop a PDF or image here, or click to select one</p>
            </div>

            {/*Preview of file*/}
            <div style={styles.previewContainer}>
                {files.map((file) => (
                    <div>
                        
                    </div>
                ))}
            </div>

        </div>
    );
}
// worry about format later, can i see what i have as of rn
// can integrate by importing into App.js, or routing if different pages

// going to do basic one first, no display preview yet (or maybe yes)

// document progress: styling, parse contents or upload file itself, submit button, backend server