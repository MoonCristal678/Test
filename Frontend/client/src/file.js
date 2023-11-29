// fileOperations.js
const baseURL = 'https://backend-j7qq.onrender.com/v1';

export const createFile = async (fileName, fileContent, setCreatedFiles) => {
  if (!fileName || !fileContent) {
    alert('Please enter both a file name and content.');
    return;
  }

  try {
    await fetch(`${baseURL}/write`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileName, fileContent }),
    });
    setCreatedFiles((prevFiles) => ({
      ...prevFiles,
      [fileName]: fileContent,
    }));
  } catch (error) {
    console.error('Error creating file:', error);
  }
};

export const readFile = async (readFileName, setReadContent) => {
  if (!readFileName) {
    alert('Please enter a file name.');
    return;
  }

  try {
    const response = await fetch(`${baseURL}/read`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileName: readFileName }),
    });
    const data = await response.text();
    setReadContent(data.replace(/<\/?[^>]+(>|$)/g, ''));
  } catch (error) {
    console.error('Error reading file:', error);
  }
};

export const deleteFile = async (fileName, setCreatedFiles) => {
  try {
    await fetch(`${baseURL}/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileName }),
    });
    const updatedFiles = { ...createdFiles };
    delete updatedFiles[fileName];
    setCreatedFiles(updatedFiles);
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};
