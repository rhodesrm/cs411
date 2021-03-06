const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user');



router.get('/', (req, res, next) => {
    User.find()
    .select("_id token_id location")
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            users: docs.map(doc => {
                return {
                    token_id: doc.token_id,
                    location: doc.location,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:8888/users/' + doc._id    // change url after********
                    }
                }
            })
        };
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.post('/', (req, res, next) => {
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        token_id: req.body.token_id,
        location: req.body.location
    });
    user
    .save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: "Created user successfully",
            createdUser: {
                token_id: result.token_id,
                location: result.location,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:8888/users/' + result._id    // change url after*****
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
    
});

router.get('/:userId', (req, res, next) => {
    const id = req.params.userId;
    User.findById(id)
    .select("token_id location _id")
    .exec()
    .then(doc => {
        console.log("From database", doc);
        if(doc) {
            res.status(200).json({
                product: doc,
                request: {
                    type: 'GET',
                    description: 'Get all users',
                    url: 'http://localhost:8888/users/'
                }
            });
        } else {
            res.status(404).json({message: 'No valid entry found for provided ID'});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

router.patch("/:userId", (req, res, next) => {
    const id = req.params.userId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propTokenId] = ops.value;
        updateOps[ops.propLocation] = ops.value;
    }                                        
    User.update({_id: id}, { $set: updateOps } )
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'User updated',
            type: 'GET',
            url: 'http://localhost:8888/users/' + id    // change url****
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
})

router.delete("/:userId", (req, res, next) => {
    const id = req.params.userId;
    User.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'User deleted',
            request: {
                type: 'POST',
                url: 'localhost:8888/users/'    // URL ****
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});


module.exports = router;