// Put the use case you chose here. Then justify your database choice:
//  I chose MongoDB. In my schema design, I used ObjecID to replace embedded documents, 
// but in real worl application those ObjectID should be directly replaced back to entities by embedding document
// in that those Objects are not large and embedded documents could be very flexible to QUERY and SCALE.
//
// Explain what will happen if coffee is spilled on one of the servers in your cluster, causing it to go down.
// That would be a disaster: the database will be rollback to a backup several days ago, because the db is running in standalone mode.
// For MongoDB there could be a redundancy solution: running multiple clusters and first writing to the primary node and primary node will then write to secondary nodes.
// Then if the primary node goes down the secondary one will become primary one.
//
// What data is it not ok to lose in your app? What can you do in your commands to mitigate the risk of lost data?
// Users' publishings, like photos, videos. And also comments.
// In case of storage, running multiple clusters can mitigate the risk
// In case of network loss, caching photo posting command on client side would work
// Generally running backup periodically of publishings would work

/// DB initialization and insertion
var Db = require('mongodb').Db,
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    ReplSetServers = require('mongodb').ReplSetServers,
    ObjectID = require('mongodb').ObjectID,
    Date = require('mongodb').Date,
    Binary = require('mongodb').Binary,
    assert = require('assert');
const url = 'mongodb://localhost:27017';

const dbName = 'instagramlike';
// MongoClient.connect(url, function(err, client) {
//     if(err) throw err;
//     const db = client.db(dbName);
//     db.dropDatabase(function(err){
//         if(err) throw err;
//     });
//     client.close();
// });

MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);

    //8 models
    const users = db.collection('users');
    const accounts = db.collection('accounts');
    const publishes = db.collection('publishes');
    const photos = db.collection('photos');
    const videos = db.collection('videos');
    const comments = db.collection('comments');
    const likes = db.collection('likes');
    const geolocations = db.collection('geolocations');

    // users.insertMany([
    //     {
    //         _id: ObjectID('AAAA1'),
    //         account: ObjectID('BBB1'),
    //         publishes: [Oid -> Publish, ...],
    //         following: Oid -> Following,
    //         followers: Oid -> Followers,
    //         likes: [Oid -> Like, ...],
    //         comments: [Oid -> Comment, ...],
    //         pending_followers: [Oid -> User, ...],
    //     },
    //     {
    //         _id: ObjectID('AAA2'),
    //         account: ObjectID('BBB2'),
    //         publishes: [Oid -> Publish, ...],
    //         following: Oid -> Following,
    //         followers: Oid -> Followers,
    //         likes: [Oid -> Like, ...],
    //         comments: [Oid -> Comment, ...],
    //         pending_followers: [Oid -> User, ...],
    //     },
    //     {
    //         _id: ObjectID('AAA3'),
    //         account: ObjectID('BBB3'),
    //         publishes: [Oid -> Publish, ...],
    //         following: Oid -> Following,
    //         followers: Oid -> Followers,
    //         likes: [Oid -> Like, ...],
    //         comments: [Oid -> Comment, ...],
    //         pending_followers: [Oid -> User, ...],
    //     },
    // ], function(err, result) {
    //     assert.equal(err, null);
    //     assert.equal(3, result.result.n);
    //     assert.equal(3, result.ops.length);
    //     console.log("Inserted 3 documents into the collection");
    // });

    let uuid_account_1 = ObjectID();
    let uuid_account_2 = ObjectID();
    let uuid_account_3 = ObjectID();
    let uuid_user_1 = ObjectID();
    let uuid_user_2 = ObjectID();
    let uuid_user_3 = ObjectID();
    let uuid_publish_1 = ObjectID();
    let uuid_publish_2 = ObjectID();
    let uuid_publish_3 = ObjectID();
    let uuid_photo_1 = ObjectID();
    let uuid_photo_2 = ObjectID();
    let uuid_photo_3 = ObjectID();

    accounts.insertMany([
        {
            _id: uuid_account_1,
            user: uuid_user_1,
            firstname: "Alice",
            lastname: "X",
            passwd_encrypted: "720b1a82f91c",
            type: 0, //public (or private)
            username: "alice01",
            email: "alice@mail.com",
        },
        {
            _id: uuid_account_2,
            user: uuid_user_2,
            firstname: "Bob",
            lastname: "Y",
            passwd_encrypted: "f15ad5391dbc",
            type: 1, //private
            username: "bob02",
            email: "bob@mail.com",
        },
        {
            _id: uuid_account_3,
            user: uuid_user_3,
            firstname: "Charlie",
            lastname: "Z",
            passwd_encrypted: "11624f82af04",
            type: 1, //private
            username: "charlie03",
            email: "charlie@mail.com",
        },
    ], function(err, result) {
        assert.equal(err, null);
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        console.log("Inserted 3 documents into the collection");
    });

    
    publishes.insertMany([
        {
            _id: uuid_publish_1,
            type: "photo-only", //can be photo-only, video-only, photo-collection
            content: [uuid_photo_1],
            owner: uuid_user_1,
            created_on: Date(),
            comments: [],
            likes: [Oid -> Like, ...],
            geolocation: Oid -> Geolocation,p
        },
        {
            _id: uuid_account_2,
            user: uuid_user_2,
            firstname: "Bob",
            lastname: "Y",
            passwd_encrypted: "f15ad5391dbc",
            type: 1, //private
            username: "bob02",
            email: "bob@mail.com",
        },
        {
            _id: uuid_account_3,
            user: uuid_user_3,
            firstname: "Charlie",
            lastname: "Z",
            passwd_encrypted: "11624f82af04",
            type: 0, //public
            username: "charlie03",
            email: "charlie@mail.com",
        },
    ], function(err, result) {
        assert.equal(err, null);
        assert.equal(4, result.result.n);
        assert.equal(4, result.ops.length);
        console.log("Inserted 3 documents into the collection");
    });





    //// Action 1: A user signs up for an account
    let uuid_newuser1 = ObjectID();
    let uuid_newaccount1 = ObjectID();
    accounts.insertOne({
        _id: uuid_newaccount1,
        uuid_newuser1,
        firstname: "Hi",
        lastname: "X",
        passwd_encrypted: "720b1a82f91c",
        type: 0, //public (or private)
        username: "hi01",
        email: "hi@mail.com",
    }, function(err, result) {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        assert.equal(1, result.ops.length);
        console.log("Inserted 1 documents into the collection");
    });
    users.insertOne({
        _id: uuid_newuser1,
        account: uuid_newaccount1,
        publishes: [],
        following: [],
        followers: [],
        likes: [],
        comments: [],
        pending_followers: [],
    }, function(err, result) {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        assert.equal(1, result.ops.length);
        console.log("Inserted 1 documents into the collection");
    });


    // Action 2: A user sees all the photos of one particular person they follow
    //in real world case, from click event we know the id of that person, now we just assume we know, which is the first one from following's list
    user = users.findOne({_id: uuid_user_1})
    console.log(user)
    //users.find({_id: })

    // Action 3: A user comments on another's photo


    // Action 4: A user starts following a new person, whether private or not



    // A user set her account to private



    // Action 6: A user gets an empty list if she attempts to view a non-following private account



    // Action 7: A private account accepts a following offer from another user



    // Action 8: A user sees all photo from a set of publishings from another user





client.close();
});

