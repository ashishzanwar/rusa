var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var uniqueValidator = require('mongoose-unique-validator');
var timestamps = require('mongoose-timestamp');
var validators = require('mongoose-validators');
var monguurl = require('monguurl');
require('mongoose-middleware').initialize(mongoose);

var Schema = mongoose.Schema;

var schema = new Schema({

    workOrder: String,
    itemDetail: String,
    dueDate: {
        type: Date
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        index: true,
        key: "milestones"
    },
    status: {
        type: String,
        enum: ["Pending", "Cancelled", "Completed"]
    },
    percentageCompleted: {
        type: Number
    },
    photos: [{
        tags: [String],
        photo: String
    }],
    comment: [{

        fromCenter: {
            type: Schema.Types.ObjectId,
            ref: 'Center',
            index: true,
            text: String
        },
        fromState: {
            type: Schema.Types.ObjectId,
            ref: 'State',
            index: true,
            text: String
        },
        fromInstitute: {
            type: Schema.Types.ObjectId,
            ref: 'Institute',
            index: true,
            text: String
        },
        text: {
            type: String
        }
    }],
    timeline: {
        type: Date
    },
    completionDate: {
        type: Date
    },
    name: {
        type: String
    },
    transaction: {
        type: Schema.Types.ObjectId,
        ref: 'Transaction',
        index: true
    },
    quantity: {
        type: Number
    },
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Milestones', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, 'Project Transaction', 'Project Transaction'));
var model = {};
module.exports = _.assign(module.exports, exports, model);