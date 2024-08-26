//import/app setup
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import albums from './albums.js';
import pretty from 'express-prettify';
import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 5000;
const passWord = process.env.PASSWORD

const pool = new Pool({
    user: 'vivcolvmn',
    host: 'localhost',
    database: 'music_library',
    password: passWord,
    port: 5432,
});

const loadInitialData = async () => {
    try {
        for (const album of albums) {
            const { title, artist, year } = album;
            await pool.query(
                'INSERT INTO albums (title, artist, year) VALUES ($1, $2, $3)',
                [title, artist, year]
            );
        }
        console.log('Albums data loaded into the database');
    } catch (err) {
        console.error('Error loading initial data:', err);
    }
};

loadInitialData();

//let the server know what directory we're working on
const __dirname = path.resolve();
//configure cors middleware
app.use(cors());
//configure express-prettify middleware for working with JSON
app.use(pretty({ query: 'pretty' }));
//configure body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//render static files from client folder
app.use(express.static('client'));
//create endpoint for route '/api/albums' that returns all the albums(GET request)
app.get('/api/albums/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM albums');
        res.json(result.rows);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
      }
});
//create endpoint for route '/api/albums/:albumID' that returns the album with that id(GET request)
app.get('/api/albums/:albumID', cors(), async (req, res) => {
    const requestedAlbumID = parseInt(req.params.albumID);
    //find the album by it's id
    const album = albums.find(a => a.id === requestedAlbumID);
    //if album is found, return as JSON, otherwise return a 404 error
    if (album) {
        res.json(album);
    } else {
        res.status(404).json({ message: 'Album not found' });
    }
});
//create endpoint for route '/api/albums' that adds a new album(POST request)
app.post('/api/albums', (req, res) => {
    //generate new id by incrementing last album's id
    const newAlbumID = albums.length ? albums[albums.length - 1].id + 1 : 1;
    //create new album object using data sent in req body
    const newAlbum = {
        id: newAlbumID,
        title: req.body.title,
        artist: req.body.artist,
        year: req.body.year
    }
    //add new album to albums array
    albums.push(newAlbum);
    //respond with newly created album
    res.status(201).json(newAlbum);
});
//create endpoint for the route '/api/albums/:albumID' that updates existing album(PUT request)
app.put('/api/albums/:albumID', (req, res) => {
    //find album by id
    const requestedAlbumID = parseInt(req.params.albumID);
    const album = albums.find(a => a.id === requestedAlbumID);
    //if album found, update properties with data from req body
    if (album) {
        album.title = req.body.title || album.title;
        album.artist = req.body.artist || album.artist;
        album.year = req.body.year || album.year;
        //repond with updated album, otherwise return 404 error
        res.json(album);
    } else {
        res.status(404).json({ message: 'Album not found' });
    }
});
//create endpoint for route '/api/albums/:albumID' that deletes an album(DELETE request)
app.delete('/api/albums/:albumID', (req, res) => {
    //find index of album by id
    const requestedAlbumID = parseInt(req.params.albumID);
    const albumIndex = albums.findIndex(a => a.id === requestedAlbumID);
    //if album found, remove from array
    if (albumIndex !== -1) {
        //repond with deleted album
        const deletedAlbum = albums.splice(albumIndex, 1);
        res.json(deletedAlbum);
    } else {
        res.status(404).json({ message: 'Album not found' })
    }
})
//create endpoint for route '/' for homepage
app.get('/', (req, res) => {
    //send response to open homepage of (future) 'index.html'
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});
//start the server
app.listen(PORT, () => console.log(`Server running on Port ${PORT}`));
