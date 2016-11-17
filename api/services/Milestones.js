var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var uniqueValidator = require('mongoose-unique-validator');
var timestamps = require('mongoose-timestamp');
var validators = require('mongoose-validators');
var monguurl = require('monguurl');
require('mongoose-middleware').initialize(mongoose);

var Schema = mongoose.Schema;

var schema = new Schema({


    project: {
                type: String
             },
    status: {
        type: String,
        enum: ["Pending", "Cancelled","Completed"]
    },             
    percentageCompleted: {
                type: String
             },
    photos:[
    {
        type:String
    }
    ],
    comment:[
    {
        type:String
    }
    ],
    timeline: {
                type: String
             },
    completionDate: {
                type: String
             },
    name: {
                type: String
             },
    transaction: {
                type: String
             },
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Milestones', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);
