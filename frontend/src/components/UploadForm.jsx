import React, { useState, useCallback } from 'react';
import './UploadForm.css';
import axios from 'axios';

const UploadForm = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateFile = (file) => {
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are accepted. Please upload a PDF file.');
      return false;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size too large. Please upload a file smaller than 10MB.');
      return false;
    }
    return true;
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (!file.name.endsWith('.pdf')) {
      setError('Please upload a PDF file');
      return;
    }

    setIsUploading(true);
    setError(null);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/analysis/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        },
      });

      if (response.data) {
        await onUpload(file, response.data);
        setIsUploading(false);
        setProgress(100);
      } else {
        throw new Error('No analysis data received');
      }
    } catch (error) {
      console.error('Upload error:', error);
      let errorMessage = 'Failed to analyze the document';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response:', error.response.data);
        errorMessage = error.response.data.detail || errorMessage;
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        errorMessage = 'No response from server. Please try again.';
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up request:', error.message);
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      setIsUploading(false);
      setProgress(0);
    }
  }, [onUpload]);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.pdf')) {
      setError('Please upload a PDF file');
      return;
    }

    setIsUploading(true);
    setError(null);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/analysis/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        },
      });

      if (response.data) {
        await onUpload(file, response.data);
        setIsUploading(false);
        setProgress(100);
      } else {
        throw new Error('No analysis data received');
      }
    } catch (error) {
      console.error('Upload error:', error);
      let errorMessage = 'Failed to analyze the document';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response:', error.response.data);
        errorMessage = error.response.data.detail || errorMessage;
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        errorMessage = 'No response from server. Please try again.';
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up request:', error.message);
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      setIsUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="upload-container">
      <div
        className={`upload-area ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={onDrop}
      >
        <input
          type="file"
          id="file-upload"
          accept=".pdf"
          onChange={handleFileSelect}
          className="file-input"
        />
        <label htmlFor="file-upload" className="upload-label">
          {isUploading ? (
            <div className="uploading-message">Uploading...</div>
          ) : (
            <>
              <div className="upload-icon">📄</div>
              <div className="upload-text">
                Drag and drop your PDF file here, or click to select
              </div>
              <div className="upload-subtext">Only PDF files are accepted</div>
            </>
          )}
        </label>
      </div>
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
};

export default UploadForm; 