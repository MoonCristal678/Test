


export const updateCreatedFiles = (newFileName, newFileContent, setCreatedFiles) => {
    setCreatedFiles((prevFiles) => ({ ...prevFiles, [newFileName]: newFileContent }));
  };
  
  export const updateJsonData = (newUser, setJsonData) => {
    setJsonData((prevData) => [...prevData, newUser]);
  };
  
  export const clearFileInputs = (setFileName, setFileContent) => {
    setFileName('');
    setFileContent('');
  };
  
  export const clearUserInputs = (setNewName, setNewAge) => {
    setNewName('');
    setNewAge('');
  };
  