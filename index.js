import express from 'express';
import { ParseServer } from 'parse-server';
import path from 'path';
const __dirname = path.resolve();
import http from 'http';
import dotenv from 'dotenv';
import sharp from 'sharp';
import axios from "axios";
import fs from 'fs';


dotenv.config();

export const config = {
  databaseURI:
    process.env.DB_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/dev',
  appId: process.env.APP_ID || 'myAppId',
  masterKey: process.env.MASTER_KEY || '',
  serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',
  liveQuery: {
    classNames: ['Posts', 'Comments'],
  },
};

export const app = express();

app.use('/public', express.static(path.join(__dirname, '/public')));

if (!process.env.TESTING) {
  const mountPath = process.env.PARSE_MOUNT || '/parse';
  const server = new ParseServer(config);
  await server.start();
  app.use(mountPath, server.app);
}


app.get('/', function (req, res) {
  res.status(200).send('I dream of being a website.  Please star the parse-server repo on GitHub!');
});

const pathToCreate = './public/island-thumb-images';
if (!fs.existsSync(pathToCreate)) {
  fs.mkdirSync(pathToCreate, { recursive: true });
} else {
}

const Islands = Parse.Object.extend('Islands');
const query = new Parse.Query(Islands);

const results = await query.find();
for (const island of results) {
  const objAttributes = island.attributes
  const image = (await axios({ url: objAttributes.photo, responseType: "arraybuffer" })).data;
    await sharp(image)
    .resize({
      fit: sharp.fit.outside,
      width: 250,
      height: 250,
    })
    .sharpen()
    .toFile(objAttributes.photo.endsWith('.jpg') ? `./public/island-thumb-images/${objAttributes.title.toLowerCase()}.jpg` : `./public/island-thumb-images/${objAttributes.title.toLowerCase()}.png`)
    .then(async info => {
      island.set('photo_thumb', `http://localhost:5000/public/island-thumb-images/${objAttributes.title.toLowerCase()}.${info.format === 'jpeg' ? 'jpg' : info.format}`);

      try {
        const result = await island.save(null, { useMasterKey: true });
      } catch (error) {
        console.error('Error saving thumbnail URL to database', error);
      }
    })
    .catch(err => {
      console.log(err);
    });
}


if (!process.env.TESTING) {
  const port = process.env.PORT || 5000;
  const httpServer = http.createServer(app);
  httpServer.listen(port, function () {
    console.log('parse-server-example running on port ' + port + '.');
  });

}