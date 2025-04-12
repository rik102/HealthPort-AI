import React, { useState } from 'react';
import './UploadForm.css';

const UploadForm = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

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

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (!validateFile(file)) return;

    setIsUploading(true);
    try {
      await onUpload(file);
    } catch (err) {
      setError(err.message || 'Error uploading file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!validateFile(file)) return;

    setIsUploading(true);
    try {
      await onUpload(file);
    } catch (err) {
      setError(err.message || 'Error uploading file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <div
        className={`upload-area ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
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