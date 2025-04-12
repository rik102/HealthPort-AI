import React, {useState} from 'react';
import {useDropzone} from 'react-dropzone';

const uploadFile = () =>{
    // creating a state to hold the uploaded files, could change this later
    const [files, setFiles] = useState([]);

    
}

// document progress: styling, parse contents or upload file itself, submit button, backend server