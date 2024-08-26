//import/app setup
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import albums from './albums.js';
import pretty from 'express-prettify';
import { title } from 'process';

const app = express();
const port = 5000;
//let the server know what directory we're working on
const __dirname = path.resolve();
//configure cors middleware
app.use(cors());
//configure express-prettify middleware for working with JSON
app.use(pretty({ query: 'pretty'}));
//configure body parser middleware
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
//render static files from client folder
app.use(express.static('client'));
//create endpoint for route '/api/albums' that returns all the albums(GET request)
app.get('/api/albums/', (req, res) => {
    res.json(albums);
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
    //send response to open homepage of (future) 'index.html'
//start the server
