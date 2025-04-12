import React, {useState} from 'react';
import {useDropzone} from 'react-dropzone';

const uploadFile = () =>{
    // creating a state to hold the uploaded files, could change this later
    const [files, setFiles] = useState([]);

    // dropzone hook: functions to define behavior of dropzone, and file input
    const {getRootProps, getInputProps} = useDropzone({
        accept: '.pdf, image/*',
        onDrop: (acceptedFiles) => { // gets called when files are dropped
            //console.log(acceptedFiles);
            setFiles(acceptedFiles.map(file => Object.assign(file, {preview: URL.createObjectURL(file)})));
        }
    });

    
}

// going to do basic one first, no display preview yet

// document progress: styling, parse contents or upload file itself, submit button, backend server