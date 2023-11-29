import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [fileName, setFileName] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [readFileName, setReadFileName] = useState('');
  const [readContent, setReadContent] = useState('');
  const [createdFiles, setCreatedFiles] = useState({});
  const [jsonData, setJsonData] = useState([]);
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState('');

  useEffect(() => {
    async function fetchJsonData() {
      try {
        const response = await fetch('https://backend-j7qq.onrender.com/v1/api/users');
        const data = await response.json();
        setJsonData(data);
      } catch (error) {
        console.error('Error fetching JSON data:', error);
      }
    }

    fetchJsonData();
  }, []);

  const handleApiRequest = async (url, method, body) => {
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      return response;
    } catch (error) {
      console.error(`Error performing ${method} request:`, error);
    }
  };

  const handleCreateFile = async () => {
    if (!fileName || !fileContent) {
      alert('Please enter both a file name and content.');
      return;
    }

    const response = await handleApiRequest('https://backend-j7qq.onrender.com/v1/write', 'POST', { fileName, fileContent });

    if (response) {
      setCreatedFiles((prevFiles) => ({ ...prevFiles, [fileName]: fileContent }));
      setFileName('');
      setFileContent('');
    }
  };

  const handleReadFile = async () => {
    if (!readFileName) {
      alert('Please enter a file name.');
      return;
    }

    const response = await handleApiRequest('https://backend-j7qq.onrender.com/v1/read', 'POST', { fileName: readFileName });

    if (response) {
      const data = await response.text();
      setReadContent(data.replace(/<\/?[^>]+(>|$)/g, ''));
    }
  };

  const handleDeleteFile = async (fileNameToDelete) => {
    const response = await handleApiRequest('https://backend-j7qq.onrender.com/v1/delete', 'POST', { fileName: fileNameToDelete });

    if (response) {
      const updatedFiles = { ...createdFiles };
      delete updatedFiles[fileNameToDelete];
      setCreatedFiles(updatedFiles);
    }
  };

  const handleAddUser = async () => {
    if (!newName || !newAge) {
      alert('Please enter both a name and age.');
      return;
    }

    const newUser = { name: newName, age: newAge };
    const response = await handleApiRequest('https://backend-j7qq.onrender.com/v1/api/users', 'POST', newUser);

    if (response) {
      setJsonData((prevData) => [...prevData, newUser]);
      setNewName('');
      setNewAge('');
    }
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
