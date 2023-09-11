const fs = require('fs');
const readline = require('readline');

// Function to write content to a file.
function writeFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`File '${filePath}' successfully written.`);
  } catch (err) {
    console.error('Error writing to the file:', err.message);
  }
}

// Function to read and display the content of a file.
function readFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    console.log(`File content of '${filePath}':`);
    console.log(content);
  } catch (err) {
    console.error('Error reading the file:', err.message);
  }
}

// Function to delete a file.
function deleteFile(filePath) {
  try {
    fs.unlinkSync(filePath);
    console.log(`File '${filePath}' successfully deleted.`);
  } catch (err) {
    console.error('Error deleting the file:', err.message);
  }
}

// Function to take user input for file operations.
function performFileOperations() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Enter 1 to read a file, 2 to write content to a file, 3 to delete a file: ', (choice) => {
    if (choice === '1') {
      rl.question('Enter the file name to read: ', (fileName) => {
        rl.close();
        readFile(fileName); // Read and display the content of the file.
      });
    } else if (choice === '2') {
      rl.question('Enter the file name: ', (fileName) => {
        rl.question('Enter content for the file: ', (content) => {
          rl.close();
          writeFile(fileName, content); // Create a new file with user-provided content and name.
        });
      });
    } else if (choice === '3') {
      rl.question('Enter the file name to delete: ', (fileName) => {
        rl.close();
        deleteFile(fileName); // Delete the specified file.
      });
    } else {
      console.log('Invalid choice.');
      rl.close();
    }
  });
}

// Example usage:
performFileOperations();

