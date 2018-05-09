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

    //15 in total
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
    let uuid_video_1 = ObjectID();
    let uuid_like_1 = ObjectID();
    let uuid_like_2 = ObjectID();
    let uuid_comment_1 = ObjectID();
    let uuid_comment_2 = ObjectID();
    let uuid_geolocation_1 = ObjectID();

    users.insertMany([
        {
            _id: uuid_user_1,
            account: uuid_account_1,
            publishes: [uuid_publish_1],
            following: [uuid_user_2],
            followers: [uuid_user_2, uuid_user_3],
            likes: [],
            comments: [],
            pending_followers: [],
        },
        {
            _id: uuid_user_2,
            account: uuid_account_2,
            publishes: [uuid_publish_2, uuid_publish_3],
            following: [uuid_user_1],
            followers: [uuid_user_1],
            likes: [],
            comments: [],
            pending_followers: [uuid_user_3],
        },
        {
            _id: uuid_user_3,
            account: uuid_account_3,
            publishes: [],
            following: [uuid_user_1],
            followers: [],
            likes: [],
            comments: [],
            pending_followers: [],
        },
    ], function(err, result) {
        assert.equal(err, null);
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        console.log("Inserted 3 documents into the collection");
    });

    

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
            type: 1,
            username: "bob02",
            email: "bob@mail.com",
        },
        {
            _id: uuid_account_3,
            user: uuid_user_3,
            firstname: "Charlie",
            lastname: "Z",
            passwd_encrypted: "11624f82af04",
            type: 0,
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
            created_on: new Date(),
            comments: [],
            likes: [uuid_like_1, uuid_like_2],
            geolocation: [],
        },
        {
            _id: uuid_publish_2,
            type: "photo-collection", //can be photo-only, video-only, photo-collection
            content: [uuid_photo_2,uuid_photo_3],
            owner: uuid_user_2,
            created_on: new Date(),
            comments: [uuid_comment_1],
            likes: [],
            geolocation: [],
        },
        {
            _id: uuid_publish_3,
            type: "video-only", //can be photo-only, video-only, photo-collection
            content: [uuid_video_1],
            owner: uuid_user_2,
            created_on: new Date(),
            comments: [uuid_comment_2],
            likes: [],
            geolocation: [uuid_geolocation_1],
        },
    ], function(err, result) {
        assert.equal(err, null);
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        console.log("Inserted 3 documents into the collection");
    });

    photos.insertMany([
        {
            _id: uuid_photo_1,
            publish: uuid_publish_1,
            file: "IMG0178.jpg",
        },
        {
            _id: uuid_photo_2,
            publish: uuid_publish_2,
            file: "IMG1625.jpg",
        },
        {
            _id: uuid_photo_3,
            publish: uuid_publish_2,
            file: "IMG3474.jpg",
        },
    ], function(err, result) {
        assert.equal(err, null);
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        console.log("Inserted 3 documents into the collection");
    });

    videos.insertOne({
        _id: uuid_video_1,
        publish: uuid_publish_3,
        file: "random.mpg",
    }, function(err, result) {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        assert.equal(1, result.ops.length);
        console.log("Inserted 1 document into the collection");
    });

    likes.insertMany([
        {
            _id: uuid_like_1,
            from: uuid_user_1,
            on: uuid_publish_1,
        },
        {
            _id: uuid_like_2,
            from: uuid_user_2,
            on: uuid_publish_1,
        },
    ], function(err, result) {
        assert.equal(err, null);
        assert.equal(2, result.result.n);
        assert.equal(2, result.ops.length);
        console.log("Inserted 3 documents into the collection");
    });

    comments.insertMany([
        {
            _id: uuid_comment_1,
            from: uuid_user_1,
            to: uuid_user_2,
            msg: "Looks nice",
            on: uuid_publish_2,
        },
        {
            _id: uuid_comment_2,
            from: uuid_user_3,
            to: uuid_user_2,
            msg: "Cool",
            on: uuid_publish_3,
        },
    ], function(err, result) {
        assert.equal(err, null);
        assert.equal(2, result.result.n);
        assert.equal(2, result.ops.length);
        console.log("Inserted 3 documents into the collection");
    });

    geolocations.insertOne({
        _id: uuid_geolocation_1,
        tags: ["Santo Monica", "California"],
        latitude: 34.00,
        longtitude: -118.49,
        gps_coord: [-118.49, 34.00],
    }, function(err, result) {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        assert.equal(1, result.ops.length);
        console.log("Inserted 1 document into the collection");
    });
    client.close();
});