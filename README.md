Web Project - UI Client
Introduction
This is the client side of the web project, built using ReactJS. It interacts with the API server to handle functionalities such as user management and data presentation. The client connects to the API server at web-project-2024-api.

System Requirements
Node.js (v14+)
ReactJS (v17+)
npm or yarn (for dependency management)

Installation Steps
1. Clone the Repository
Clone the project from GitHub:

`git clone https://github.com/tuantu2609/web-project-2024-ui-client.git`

 `cd web-project-2024-ui-client`

3. Install Dependencies
Run the following command to install the necessary dependencies from package.json: `npm install`

4. Start the Server
Use the following command to start:
`npm start`
The client will run at http://localhost:3000.

5. Project Structure
The client-side code is organized into the following structure:
````
├──public/ # Images and other static files
├──src/
    ├── helpers/
    ├── pages/          # Page-specific components
    ├── App.css         # Stylesheets
    ├── App.js          # Main application file
    └── index.js        # Entry point of the React app
├──package.json
````

Notes
+ Do not push the node_modules folder and the .env file to the repository. Dependencies will be installed with npm install.
+ Create separate branches for new features and only merge them into the main branch after testing.
+ This repository only contains the UI (Client) part. The server (API) part is maintained in a separate repository.

If you have any questions or suggestions, feel free to contact me at tuantums10@gmail.com or open an issue on GitHub.
