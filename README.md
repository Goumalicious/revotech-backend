# RevotechBackend

## Requirements

Nodejs is required for this project.

## Installation 

For MacOs you should replace "@img/sharp-win32-x64" in  the dependencies with "@img/sharp-darwin-x64": "^0.33.4" .
Run `npm install` in order to install all the required node modules.
In order for MacOs devices to run the backend, you need to change the port into 5001 wherever its used in the .env file (PUBLIC_SERVER_URL, SERVER_URL, SERVER_PORT).
Run `node index.js` for the dev server to start.
If you want to access the parse-dashboard you can run `parse-dashboard --dev --appId 'your_app_key' --masterKey 'your_master_key' --serverURL "http://localhost:5001/parse" --allowInsecureHTTPecureHTTP`

This is the backend of the application. In order for the application to successfully run you also need to have the frontend (https://github.com/Goumalicious/revotech-frontend) installed and running.