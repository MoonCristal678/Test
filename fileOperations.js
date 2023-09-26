const express = require('express');
const app = express();
const port = 3000;

const fs = require('fs');
const path = require('path');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');

// Function to write content to a file.
function writeFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`File '${filePath}' successfully written.`);
  } catch (err) {
    console.error('Error writing to the file:', err.message);
    throw err;
  }
}

// Function to read and display the content of a file.
function readFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    console.log(`File content of '${filePath}':`);
    console.log(content);
    return content;
  } catch (err) {
    console.error('Error reading the file:', err.message);
    throw err;
  }
}

// Function to delete a file.
function deleteFile(filePath) {
  try {
    fs.unlinkSync(filePath);
    console.log(`File '${filePath}' successfully deleted.`);
  } catch (err) {
    console.error('Error deleting the file:', err.message);
    throw err;
  }
}


// Serve an HTML page with buttons to perform file operations
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>File Operations Page</title>
    </head>
    <body>
      <h1>Welcome to the File Operations Page</h1>
      <button onclick="redirectToReadFile()">Read a File</button>
      <button onclick="redirectToWriteFile()">Write to a File</button>
      <button onclick="redirectToDeleteFile()">Delete a File</button>
      <button onclick="redirectToApiUsers()">Display JSON Data</button>
      <script>
      function redirectToApiUsers() {
         window.location.href = '/v1/api/users';
      }
</script>
      <script>
        function redirectToReadFile() {
          window.location.href = '/v1/read';
        }
        function redirectToWriteFile() {
          window.location.href = '/v1/write';
        }
        function redirectToDeleteFile() {
          window.location.href = '/v1/delete';
        }
      </script>
    </body>
    </html>
  `);
});

// API Version 1
const v1Router = express.Router();
v1Router.get('/api/users', (req, res) => {
  const jsonData = [
    { "id": 1, "name": "John" },
    { "id": 2, "name": "Jane" }
  ];
  res.json(jsonData);
});

v1Router.get('/read', (req, res) => {
  res.render('readFile.ejs');
});

v1Router.post('/read', (req, res) => {
  const fileName = req.body.fileName;
  const filePath = path.join(__dirname, fileName);

  try {
    const fileContent = readFile(filePath);
    res.render('readFile.ejs', { fileContent });
  } catch (err) {
    res.render('readFile.ejs', { readError: 'Error reading the file.' });
  }
});

v1Router.get('/write', (req, res) => {
  res.render('writeFile.ejs');
});

v1Router.post('/write', (req, res) => {
  const fileName = req.body.fileName;
  const fileContent = req.body.fileContent;

  try {
    writeFile(fileName, fileContent);
    res.send(`File '${fileName}' created with the provided content.`);
  } catch (err) {
    res.status(500).send('Error creating the file.');
  }
});

v1Router.get('/delete', (req, res) => {
  res.render('deleteFile.ejs');
});

v1Router.post('/delete', (req, res) => {
  const fileName = req.body.fileName;

  try {
    deleteFile(fileName);
    res.send(`File '${fileName}' deleted.`);
  } catch (err) {
    res.status(500).send('Error deleting the file.');
  }
});

// Use API versioning
app.use('/v1', v1Router);

// Define error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
