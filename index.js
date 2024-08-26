//import/app setup
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import albums from './albums.js';
import pretty from 'express-prettify';

const app = express();
const port = 5000;
//let the server know what directory we're working on
//configure cors middleware
//configure express-prettify middleware for working with JSON
//configure body parser middleware
//render static files from client folder
//create endpoint for route '/api/albums' that returns all the albums(GET request)
//create endpoint for route '/api/albums/:albumID' that returns the album with that id(GET request)
    //find the album by it's id
    //if album is found, return as JSON, otherwise return a 404 error
//create endpoint for route '/api/albums' that adds a new album(POST request)
    //generate new id by incrementing last album's id
    //create new album object using data sent in req body
    //add new album to albums array
    //respond with newly created album
//create endpoint for the route '/api/albums/:albumID' that updates existing album(PUT request)
    //find album by id
    //if album found, update properties with data from req body
    //repond with updated album, otherwise return 404 error
//create endpoint for route '/api/albums/:albumID' that deletes an album(DELETE request)
    //find index of album by id
    //if album found, remove from array
    //repond with deleted album
//create endpoint for route '/' for homepage
    //send response to open homepage of (future) 'index.html'
//start the server
