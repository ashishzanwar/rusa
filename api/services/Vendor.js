var mongoose = require('mongoose');
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
        username: {
                type: String
        },
        email: {
                type: String,
                validate: validators.isEmail()
        },
        mobile: {
                type: String,
                default: ""
        },
        pan: String,

        organization: String,

        users: [{
                type: Schema.Types.ObjectId,
                ref: 'User',
                index: true,
        }],
        tintan:String
});

schema.plugin(deepPopulate, {
        populate: {
                'users': {
                        select: 'name _id'
                }
        }

});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Vendor', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {

        addUserToVendor: function (data, callback) {

                console.log(data);
                Vendor.findOneAndUpdate({
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

        findOneVendorUser: function (data, callback) {

                console.log(data);
                Vendor.findOne({
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
        removeUserFromVendor: function (data, callback) {

                console.log(data);
                Vendor.findOneAndUpdate({
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

        updateUser: function (data, callback) {
                console.log("DATA", data);
                Vendor.update({
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

};
module.exports = _.assign(module.exports, exports, model);