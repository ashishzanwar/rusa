var mongoose = require('mongoose');
var objectid = require("mongodb").ObjectId;
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var uniqueValidator = require('mongoose-unique-validator');
var timestamps = require('mongoose-timestamp');
var validators = require('mongoose-validators');
var monguurl = require('monguurl');
require('mongoose-middleware').initialize(mongoose);

var Schema = mongoose.Schema;

var schema = new Schema({
    name: {
        type: String
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true,
    }],

});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Center', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, 'user', 'user'));
var model = {

    // addUserToCenter: function (data, callback) {

    //     console.log(data);
    //     Center.findOneAndUpdate({
    //         _id: data._id
    //     }, {
    //         $push: {
    //             users: data.user_id
    //         }
    //     }).exec(function (err, found) {

    //         if (err) {
    //             // console.log(err);
    //             callback(err, null);
    //         } else {

    //             if (found) {

    //                 callback(null, found);
    //             } else {
    //                 callback(null, {
    //                     message: "No Data Found"
    //                 });
    //             }
    //         }

    //     })
    // },


    addUserToCenter: function (data, callback) {

        console.log(data);
        Center.findOneAndUpdate({
            _id: data._id
        }, {
            $addToSet: {
                // $push: {
                users: data.user_id
                // }
            },
        }, {
            upsert: true
        }).exec(function (err, found) {

            if (err) {
                // console.log(err);
                callback(err, null);
            } else {

                if (found) {

                    callback(null, found);
                } else {
                    callback(null, {
                        message: "No Data Found"
                    });
                }
            }

        })
    },

    removeUserFromCenter: function (data, callback) {

        console.log(data);
        Center.findOneAndUpdate({
            _id: data._id
        }, {
            $pull: {
                users: data.user_id
            }
        }).exec(function (err, found) {
            if (err) {
                // console.log(err);
                callback(err, null);
            } else {
                if (found) {
                    callback(null, found);
                } else {
                    callback(null, {
                        message: "No Data Found"
                    });
                }
            }

        })
    },


    findOneCenter: function (data, callback) {

        console.log(data);
        Center.findOne({
            _id: data._id
        }).populate("users").exec(function (err, found) {

            if (err) {
                // console.log(err);
                callback(err, null);
            } else {

                if (found) {

                    callback(null, found);
                } else {
                    callback(null, {
                        message: "No Data Found"
                    });
                }
            }

        })
    },
    updateUser: function (data, callback) {
        console.log("DATA", data);
        Center.update({
            _id: data._id,
            "users": data.user_id
        }, {
            $set: {
                // $set: {
                "users.$": data.change_id
                // }
            }
        }, function (err, data) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else if (data) {
                callback(null, data);
            } else {
                callback(null, "Invalid data");
            }
        });

    },

    //////////
    // updateUser: function (data, callback) {
    //     console.log("DATA", data);
    //     Center.find({
    //         "users.$": data.change_id

    //     }).exec(function (err, data) {
    //         if (err) {
    //             callback(err, null);
    //         } else if (data) {
    //             console.log(data);

    //             if (_.isEmpty(data)) {
    //                 console.log("DATA EMPTY", data);
    //             } else {
    //                 console.log("EMPTY", data);
    //             }

    //             callback(null, data);


    //         } else {
    //             callback(null, "Invalid data");
    //         }
    //     })


    //     // Center.update({
    //     //     _id: data._id,
    //     //     "users": data.user_id
    //     // }, {
    //     //     $set: {
    //     //         // $set: {
    //     //         "users.$": data.change_id
    //     //         // }
    //     //     }
    //     // }, function (err, data) {
    //     //     if (err) {
    //     //         console.log(err);
    //     //         callback(err, null);
    //     //     } else if (data) {
    //     //         callback(null, data);
    //     //     } else {
    //     //         callback(null, "Invalid data");
    //     //     }
    //     // });

    // }


};
module.exports = _.assign(module.exports, exports, model);