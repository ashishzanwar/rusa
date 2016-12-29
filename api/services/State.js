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
        users: [{
                type: Schema.Types.ObjectId,
                ref: 'User',
                index: true,

        }],
        project: [{
                type: Schema.Types.ObjectId,
                ref: 'Project',
                index: true
        }]
});

schema.plugin(deepPopulate, {});
schema.plugin(deepPopulate, {
        populate: {
                'project': {
                        select: '_id project_approved_board_no title component centerPercent statePercent totalAmount institute subStatus status'
                }
        }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('State', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, 'user Project _id project_approved_board_no title component centerPercent statePercent totalAmount institute subStatus status institute.name', 'user Project _id project_approved_board_no title component centerPercent statePercent institute.name totalAmount institute subStatus status'));
var model = {

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
        findState: function (data, callback) {
                State.find().exec(function (err, found) {
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
        



};
module.exports = _.assign(module.exports, exports, model);