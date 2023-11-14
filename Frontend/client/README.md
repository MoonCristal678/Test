First Code Snippet:
This initial code employs the React app to manage file operations and user data operations, emulating file operations through local state manipulation and performing actions on that data.

Local State Management:

Uses React useState hooks to manage state variables (fileName, fileContent, createdFiles) within the component.
Manages created files and their content within the createdFiles state object.
File Operations:

Handles file creation, reading, and deletion locally by manipulating the createdFiles state.
Reads, writes, and deletes files within the application's local state, not interacting with any external API or database.
User Data Operations:

Manages user data (jsonData) within the component's local state.
Allows addition of users to the jsonData state without interacting with an API.
Execution:

Runs within the React environment.
Local state management simulates file operations and user data actions within the React application without communicating with any external server or API.
Second Code Snippet:
This updated code interacts with an API for file and user data operations, communicating with a server to perform CRUD actions on files and users.

Local State Management:

Utilizes React useState hooks to manage similar state variables as the first snippet (fileName, fileContent, createdFiles, jsonData, etc.).
File Operations:

Communicates with a server API (http://localhost:3000/v1/write, http://localhost:3000/v1/read, http://localhost:3000/v1/delete) to perform file operations via fetch requests.
Sends POST requests to create, read, and delete files on the server.
User Data Operations:

Interacts with an API endpoint (http://localhost:3000/v1/api/users) to retrieve and add users via fetch requests.
Execution:

Communicates with an external server (assumed to handle file operations and user data) using API endpoints.
Requires the server to be running on http://localhost:3000 to handle requests.
Comparison:
The first snippet handles file operations and user data locally within the React app's state.
The second snippet communicates with a server API to perform CRUD operations on files and user data.
Running the Applications:
First Snippet:

Runs within a React application environment.
No external server communication required.
Second Snippet:

Requires an external server running (assumed to be available at http://localhost:3000).
The server should handle API endpoints for file operations and user data to interact correctly with the React app.

RUN BY INPUTTING ("npm start"). Cors on the backend allows to connect applications running on two different servers. 