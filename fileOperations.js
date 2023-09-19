const fs = require('fs');
const readline = require('readline');
const http = require('http');
const path = require('path');
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




// Create an HTTP server
const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    // Serve an HTML page with a button
    res.writeHead(200, { 'Content-Type': 'text/html' });
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>JSON Data Page</title>
      </head>
      <body>
        <h1>Welcome to the main page</h1>
        <button onclick="redirectToJsonData()">Go to JSON Data</button>
        <script>
          function redirectToJsonData() {
            window.location.href = '/api/users';
          }
        </script>
      </body>
      </html>
    `;
    res.end(htmlContent);
  } else if (req.method === 'GET' && req.url === '/api/users') {
    const filePath = path.join(__dirname, 'users.json');
    readFile(filePath); // Read and display the content of the users.json file.
    res.writeHead(200, { 'Content-Type': 'application/json' });
    const jsonData = [
      { "id": 1, "name": "John" },
      { "id": 2, "name": "Jane" }
    ];
    res.end(JSON.stringify(jsonData));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});


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
server.listen(3000, () => {
  console.log('Server running on <http://localhost:3000/>');
});


// Example usage:
performFileOperations();


