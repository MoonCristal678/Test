// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import { api } from './api';
import * as utils from './utils';

const WRITE_URL = 'https://backend-j7qq.onrender.com/v1/write';
const READ_URL = 'https://backend-j7qq.onrender.com/v1/read';
const DELETE_URL = 'https://backend-j7qq.onrender.com/v1/delete';
const USERS_URL = 'https://backend-j7qq.onrender.com/v1/api/users';

function App() {
  const [fileName, setFileName] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [readFileName, setReadFileName] = useState('');
  const [readContent, setReadContent] = useState('');
  const [createdFiles, setCreatedFiles] = useState({});
  const [jsonData, setJsonData] = useState('');
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState('');

  useEffect(() => {
    fetchJsonData();
  }, []);

  const fetchJsonData = async () => {
    try {
      const response = await fetch(USERS_URL);
      const data = await response.json();
      setJsonData(data);
    } catch (error) {
      console.error('Error fetching JSON data:', error);
    }
  };

  const handleCreateFile = async () => {
    if (!fileName || !fileContent) {
      alert('Please enter both a file name and content.');
      return;
    }

    const successCallback = () => {
      utils.updateCreatedFiles(fileName, fileContent, setCreatedFiles);
      utils.clearFileInputs(setFileName, setFileContent);
    };

    api.fetchData(WRITE_URL, 'POST', { fileName, fileContent }, successCallback);
  };

  const handleReadFile = async () => {
    if (!readFileName) {
      alert('Please enter a file name.');
      return;
    }

    const successCallback = async () => {
      const response = await api.handleApiRequest(READ_URL, 'POST', { fileName: readFileName });
      const data = await response.text();
      setReadContent(data.replace(/<\/?[^>]+(>|$)/g, ''));
    };

    api.fetchData(READ_URL, 'POST', { fileName: readFileName }, successCallback);
  };

  const handleDeleteFile = async (fileNameToDelete) => {
    const successCallback = () => {
      utils.updateCreatedFiles(fileNameToDelete, setCreatedFiles);
    };

    api.fetchData(DELETE_URL, 'POST', { fileName: fileNameToDelete }, successCallback);
  };

  const handleAddUser = async () => {
    if (!newName || !newAge) {
      alert('Please enter both a name and age.');
      return;
    }

    const newUser = { name: newName, age: newAge };
    const successCallback = () => {
      utils.updateJsonData(newUser, setJsonData);
      utils.clearUserInputs(setNewName, setNewAge);
    };

    api.fetchData(USERS_URL, 'POST', newUser, successCallback);
  };

  const renderInputField = (name, value, onChange, placeholder) => (
    <input type="text" name={name} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
  );

  const renderButton = (text, onClick) => (
    <button className="app-button" onClick={onClick}>
      {text}
    </button>
  );

  const renderFileList = () => (
    <ul className="app-file-list">
      {Object.entries(createdFiles).map(([fileName, fileContent]) => (
        <li key={fileName}>
          {fileName}
          {renderButton('Delete', () => handleDeleteFile(fileName))}
        </li>
      ))}
    </ul>
  );

  const renderUserData = () => (
    <ul className="app-file-list">
      {jsonData.map((user) => (
        <li key={user.id}>
          ID: {user.id}, Name: {user.name}, Age: {user.age}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="app-container">
      <h1 className="app-title">Welcome to the File Operations Page</h1>

      <div className="app-section">
        <h2>Create File</h2>
        {renderInputField('fileName', fileName, setFileName, 'Enter file name')}
        <textarea name="fileContent" value={fileContent} onChange={(e) => setFileContent(e.target.value)} placeholder="Enter file content" />
        {renderButton('Create File', handleCreateFile)}
      </div>

      <div className="app-section">
        <h2>Read File</h2>
        {renderInputField('readFileName', readFileName, setReadFileName, 'Enter file name')}
        {renderButton('Read File', handleReadFile)}
        <div>
          {readContent && <pre className="app-file-content">{readContent}</pre>}
          {!readContent && <p className="app-file-not-found">File not found.</p>}
        </div>
      </div>

      <div className="app-section">
        <h2>Created Files</h2>
        {renderFileList()}
      </div>

      <div className="app-section">
        <h2>Add User to JSON Data</h2>
        {renderInputField('newName', newName, setNewName, 'Enter name')}
        {renderInputField('newAge', newAge, setNewAge, 'Enter age')}
        {renderButton('Add User', handleAddUser)}
      </div>

      <div className="app-json-section">
        <h2>JSON Data</h2>
        {renderUserData()}
      </div>
    </div>
  );
}

export default App;
