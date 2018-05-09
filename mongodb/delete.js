var Db = require('mongodb').Db,
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    ReplSetServers = require('mongodb').ReplSetServers,
    ObjectID = require('mongodb').ObjectID,
    Binary = require('mongodb').Binary,
    assert = require('assert');
const url = 'mongodb://localhost:27017';

const dbName = 'instagramlike';
MongoClient.connect(url, function(err, client) {
    if(err) throw err;
    const db = client.db(dbName);
    db.dropDatabase(function(err){
        if(err) throw err;
    });
    client.close();
});