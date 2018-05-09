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
        console.log("Inserted 2 documents into the collection");
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
        console.log("Inserted 2 documents into the collection");
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
    
    //// Action 1: A user signs up for an account
    let uuid_newuser1 = ObjectID();
    let uuid_newaccount1 = ObjectID();
    accounts.insertOne({
        _id: uuid_newaccount1,
        user: uuid_newuser1,
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
    
    // publishes.findOne({owner: uuid_user_2}, function(err, result) {
    //     console.log(result.content);
    // });

    publishes.aggregate([
        {"$match": {owner: uuid_user_2}},
        {"$unwind": "$content"},
        {"$lookup": {
            from: "photos",
            localField: "content",
            foreignField: "_id",
            as: "publish_docs",
        }},
    ]).toArray(function(err, data){
        data.forEach(function(elt){
            if(elt.publish_docs[0]){
                console.log(elt.publish_docs[0].file);
            }
        });
    });

    // Action 3: A user comments on another's photo
    comments.insertOne({
            _id: ObjectID(),
            from: uuid_user_2,
            to: uuid_user_1,
            msg: "Looks not bad",
            on: uuid_publish_1,
        }, function(err, result) {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        assert.equal(1, result.ops.length);
        console.log("Inserted 1 documents into the collection");
    });

    // Action 4: A user starts following a new person, whose account is private 
    users.update(
        {_id: uuid_user_2},
        {"$push": {pending_followers: uuid_user_3}},
        function(err, result){
    });


    // A user set her account to private
    accounts.update(
        {user: uuid_user_3},
        {"$set": {type: 1}},
        function(err, result){
    });


    // Action 6: A user gets an empty list if she attempts to view a non-following private account
    users.findOne({_id: uuid_user_2}, function(err, result){
        if(result.followers.indexOf(uuid_account_3)>-1){
            //same as action 2
            publishes.aggregate([
                {"$match": {owner: uuid_user_2}},
                {"$unwind": "$content"},
                {"$lookup": {
                    from: "photos",
                    localField: "content",
                    foreignField: "_id",
                    as: "publish_docs",
                }},
            ]).toArray(function(err, data){
                data.forEach(function(elt){
                    if(elt.publish_docs[0]){
                        console.log(elt.publish_docs[0].file);
                    }
                });
            });
        }
        else {
            console.log("none");
        }
    });

    // Action 7: A private account accepts a following offer from another user
    users.update({_id: uuid_user_2}, 
        {"$push": {followers: uuid_user_3}},
        {"$pull": {pending_followers: uuid_user_3}},
        function(err, result){

    });


    // Action 8: A user sees all comments from a set of publishings from another user
    publishes.aggregate([
        {"$match": {owner: uuid_user_2}},
        {"$unwind": "$comments"},
        {"$lookup": {
            from: "comments",
            localField: "comments",
            foreignField: "_id",
            as: "publish_docs",
        }},
    ]).toArray(function(err, data){
        data.forEach(function(elt){
            if(elt.publish_docs[0]){
                console.log(elt.publish_docs[0].msg);
            }
        });
    });

client.close();
});
