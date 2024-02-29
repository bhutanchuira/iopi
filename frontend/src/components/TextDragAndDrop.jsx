import React, { useState, useRef } from 'react';
import addtext from '../images/textupload.png';
import TextApiResponseDisplay from "./TextApiResponseDisplay";
const TextDragAndDrop = ({ onFilesSelected }) => {
  const [highlight, setHighlight] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [apiResponse, setApiResponse] = useState(null);
  const fileInputRef = useRef(null);
  const [showTextDragDrop, setShowTextDragDrop] = useState(true);
  const handleDragOver = (event) => {
    event.preventDefault();
    setHighlight(true);
  };

  const handleDragLeave = () => {
    setHighlight(false);
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    setHighlight(false);

    const files = event.dataTransfer.files;
    const filteredFiles = filterFiles(Array.from(files));

    if (filteredFiles.length > 0) {
      const uploadedFile = filteredFiles[0];
      setUploadedFiles([uploadedFile]);

      // Call API with the uploaded text file
      await uploadTextFile(uploadedFile);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  const handleFileInputChange = async (event) => {
    const files = event.target.files;
    const filteredFiles = filterFiles(Array.from(files));

    if (filteredFiles.length > 0) {
      const uploadedFile = filteredFiles[0];
      setUploadedFiles([uploadedFile]);

      // Call API with the uploaded text file
      await uploadTextFile(uploadedFile);
    }
  };

  const filterFiles = (files) => {
    return files.filter(file => {
      const fileType = file.type;
      return fileType === 'text/plain';
    });
  };

  const uploadTextFile = async (textFile) => {
    const formData = new FormData();
    formData.append('fileToUpload', textFile);

    try {
      const response = await fetch('http://127.0.0.1:8000/process_text/', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload text file');
      }
    
      const responseData = await response.json();
      setApiResponse(responseData);
      setShowTextDragDrop(false);
    } catch (error) {
      console.error('Error uploading text file:', error);
    }
  };

  return (
<div>    
  {showTextDragDrop && (
<div
      className={`drag-drop-area ${highlight ? 'highlight' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={openFileDialog}
    >
      <input
        ref={fileInputRef}
        className="file-input"
        type="file"
        onChange={handleFileInputChange}
        accept=".txt" // Accept only text files
        multiple
      />
      <img src={addtext} alt="image failed to load"/>
      <div className="drag-drop-text">
        <p><span className="span1">Drag and drop</span></p>
        <p> or <span className="span2">upload</span> your text file here.</p>
      </div>
      </div>
      )}
  {apiResponse && <TextApiResponseDisplay apiResponse={apiResponse} />}

    </div>
  );
};

export default TextDragAndDrop;
