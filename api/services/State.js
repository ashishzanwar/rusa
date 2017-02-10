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
        abbreviation: {
                type: String
        },
        users: [{
                type: Schema.Types.ObjectId,
                ref: 'User',
                index: true,
        }],
        project: [{
                type: Schema.Types.ObjectId,
                ref: 'Project',
                index: true
        }],
        centerShare: {
                type: Number
        },
        stateShare: {
                type: Number
        }

});

schema.plugin(deepPopulate, {});
schema.plugin(deepPopulate, {
        populate: {
                'project': {
                        select: '_id project_approved_board_no title component centerPercent statePercent totalAmount institute subStatus status'
                },
                'users': {
                        select: 'name _id'
                }
        }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('State', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, 'users Project _id project_approved_board_no title component centerPercent statePercent totalAmount institute subStatus status institute.name', 'users Project _id project_approved_board_no title component centerPercent statePercent institute.name totalAmount institute subStatus status'));
var model = {

        findOneStateUser: function (data, callback) {

                console.log(data);
                State.findOne({
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

        addUserToState: function (data, callback) {

                console.log(data);
                State.findOneAndUpdate({
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



        removeUserFromState: function (data, callback) {

                console.log(data);
                State.findOneAndUpdate({
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



        findOneState: function (data, callback) {
                State.findOne({
                        _id: data._id
                }).select('project').deepPopulate("project.institute  project.institute.state", "name name").exec(function (err, found) {
                        if (err) {
                                // console.log(err);
                                callback(err, null);
                        } else {
                                if (found) {
                                        console.log("IN FOUND", found);
                                        callback(null, found);
                                } else {
                                        callback(null, {
                                                message: "No Data Found"
                                        });
                                }
                        }
                })
        },
        findAllState: function (data, callback) {
                State.find().select("name _id").exec(function (err, found) {
                        if (err) {
                                // console.log(err);
                                callback(err, null);
                        } else {
                                if (found) {
                                        console.log("IN  STATE FOUND", found);
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
                State.update({
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