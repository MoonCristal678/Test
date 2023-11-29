import express from 'express';
import methodOverride from 'method-override';
import { MongoClient } from 'mongodb';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));

const uri = "mongodb+srv://blackkrystal438:DemonSlayer1@fileanduserdata.3ynz8zm.mongodb.net/";
let db;

(async function () {
    try {
        const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        console.log('Connected to MongoDB.');
        db = client.db("fileAndUserData");
    } catch (err) {
        console.error('Error occurred while connecting to MongoDB:', err);
    }
})();

app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
});

// Render home page with links to file and user operations
app.get('/', (req, res) => {
    res.send(`
        <button><a href="/v1/read">Read a File</a></button>
        <button><a href="/v1/write">Write to a File</a></button>
        <button><a href="/v1/delete">Delete a File</a></button>
        <button><a href="/v1/api/users">Display JSON Data</a></button>
        <button><a href="/v1/add">Add User</a></button>
    `);
});

// API Version 1
const v1Router = express.Router();

// Render form to add a new user
v1Router.get('/add', (req, res) => {
    res.render('addUser.ejs');
});

// Add a new user
v1Router.post('/api/users', async (req, res) => {
    const { name, age } = req.body;

    const newUser = {
        name,
        age
    };

    const collection = db.collection('users');
    await collection.insertOne(newUser);
    res.json({ message: 'User added successfully', user: newUser });
});

// Get all users
v1Router.get('/api/users', async (req, res) => {
    console.log("Backend responded");
    const collection = db.collection('users');
    const users = await collection.find({}).toArray();
    res.json(users);
});

// Render form to read or delete a file
const renderFileForm = async (req, res, template) => {
    const collection = db.collection('files');
    const files = await collection.find({}, { projection: { _id: 0, name: 1 } }).toArray();
    const fileNames = files.map(file => file.name);
    res.render(template, { fileNames });
};

v1Router.get('/read', async (req, res) => {
    await renderFileForm(req, res, 'readFile.ejs');
});

v1Router.get('/delete', async (req, res) => {
    await renderFileForm(req, res, 'deleteFile.ejs');
});

const handleReadOrDelete = async (req, res, operation) => {
    const fileName = req.body.fileName;
    const collection = db.collection('files');
    const query = { name: fileName };
  
    try {
      if (operation === 'read') {
        const fileContent = await collection.findOne(query);
        return fileContent
          ? res.send(`<h2>File Content of '${fileName}':</h2><pre>${fileContent.content}</pre>`)
          : res.render('readFile.ejs', { readError: 'File not found.' });
      } else if (operation === 'delete') {
        const result = await collection.deleteOne(query);
        return result.deletedCount > 0
          ? res.send(`File '${fileName}' deleted.`)
          : res.status(404).send('File not found.');
      }
    } catch (error) {
      console.error(`Error during ${operation} operation:`, error);
      res.status(500).send('Something went wrong!');
    }
  };
  
  // Combine read and delete routes
  v1Router.post('/:operation(read|delete)', async (req, res) => {
    const operation = req.params.operation;
    await handleReadOrDelete(req, res, operation);
  });
  
  // Render form to write to a file
  v1Router.get('/write', (req, res) => {
    res.render('writeFile.ejs');
  });
  
  // Using async/await for write route
  v1Router.post('/write', async (req, res) => {
    const fileName = req.body.fileName;
    const fileContent = req.body.fileContent;
  
    const collection = db.collection('files');
    await collection.updateOne(
      { name: fileName },
      { $set: { content: fileContent } },
      { upsert: true }
    );
  
    res.send(`File '${fileName}' created with the provided content.`);
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
  