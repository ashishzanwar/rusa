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
    project: [{
        type: Schema.Types.ObjectId,
        ref: 'Project',
        index: true
    }]

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
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Institute', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, 'project user state Project', 'project user state Project'));
var model = {

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
                callback(null, updated);
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
        }

};
module.exports = _.assign(module.exports, exports, model);