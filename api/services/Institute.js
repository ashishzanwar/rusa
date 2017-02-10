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
    state: {
        type: Schema.Types.ObjectId,
        ref: 'State',
        index: true
    },
    components: [{
        type: Schema.Types.ObjectId,
        ref: 'Components',
        index: true
    }],
    district: {
        type: Schema.Types.ObjectId,
        ref: 'District',
        index: true
    },
    institute_type: {
        type: String,
        enum: ["Central Universities",
            "State Universities",
            "Institutes of National Importance",
            "Deemed to be Universities",
            "Affiliated Colleges",
            "Autonomous Colleges"
        ]
    },

});

schema.plugin(deepPopulate, {
    populate: {
        'project': {
            select: '_id name component project_approved_board_no title  state statePercent centerPercent totalAmount quantity status institute  subStatus'
        }
    }
});
schema.plugin(deepPopulate, {
    populate: {
        'project': {
            select: '_id project_approved_board_no title component  centerPercent statePercent totalAmount institute subStatus status'
        },
        'state': {
            select: '_id name'
        },
        'users': {
            select: 'name _id'
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Institute', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, 'project users state Project', 'project users state Project'));
var model = {
    findOneInstituteUser: function (data, callback) {

        console.log(data);
        Institute.findOne({
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

    removeUserFromInstitute: function (data, callback) {

        console.log(data);
        Institute.findOneAndUpdate({
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
        Institute.update({
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


    addUserToInstitute: function (data, callback) {

        console.log(data);
        Institute.findOneAndUpdate({
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



    findOneInstitute: function (data, callback) {


        Institute.findOne({
            _id: data._id
        }).populate("project state").exec(function (err, found) {

            if (err) {

                callback(err, null);
            } else {

                if (found) {
                    console.log("Found", found);
                    callback(null, found);
                } else {
                    callback(null, {
                        message: "No Data Found"
                    });
                }
            }

        })
    },
    removeProject: function (data, callback) {
        console.log("Institute ID", data.institute);

        console.log("Project ID", data._id);
        Institute.update({

            "_id": data.institute,
        }, {
            $pull: {
                "project": objectid(data._id)

            }
        }, function (err, updated) {
            console.log(updated);
            if (err) {
                console.log(err);
                callback(err, null);
            } else {

                State.update({

                    "_id": data.state,
                }, {
                    $pull: {
                        "project": objectid(data._id)

                    }
                }, function (err, updated) {
                    console.log(updated);
                    if (err) {
                        console.log(err);
                        callback(err, null);
                    } else {
                        Project.update({

                            "_id": data._id,
                        }, {

                            "institute": null,
                            "state": null

                        }, function (err, updated) {
                            console.log(updated);
                            if (err) {
                                console.log(err);
                                callback(err, null);
                            } else {
                                callback(null, updated);
                            }
                        });
                    }
                });
                //    callback(null, updated);
            }
        });
    },
    findInstitute: function (data, callback) {
        Institute.find({
            state: data._id
        }).populate('state').exec(function (err, found) {
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
    removeInstitute: function (data, callback) {

        Institute.findOneAndUpdate({
            _id: data._id

        }, {
            state: null
        }).exec(function (err, found) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else {
                console.log("Institute", found);
                callback(null, found);
            }
        });
    },

};
module.exports = _.assign(module.exports, exports, model);