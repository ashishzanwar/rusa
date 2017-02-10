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
    components: {
        type: Schema.Types.ObjectId,
        ref: 'Components',
        index: true
    },
    status: {
        type: String,
        enum: ["Pending", "Completed"]
    },

    type: {
        type: String,
        enum: ["Center To State", "State To Intitute", "Institute To Vendor", "Vendor To Institute", "Institute To State", "Institute To Center", "State To Vendor", "State To Center", "Center To Institute"]
    },

    transactionSent: {
        type: Date
    },

    transactionReceived: {
        type: Date
    },

    remarks: String,

    file: String,
    expectedDaysTillReceipt: String,


    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        index: true
    },
    installment: {
        type: Number
    },

    amount: {
        type: Number
    },
    fromCenter: {
        type: Schema.Types.ObjectId,
        ref: 'Center',
        index: true
    },
    fromState: {
        type: Schema.Types.ObjectId,
        ref: 'State',
        index: true
    },
    fromInstitute: {
        type: Schema.Types.ObjectId,
        ref: 'Institute',
        index: true
    },

    fromVendor: {
        type: Schema.Types.ObjectId,
        ref: 'Vendor',
        index: true
    },

    toCenter: {
        type: Schema.Types.ObjectId,
        ref: 'Center',
        index: true
    },
    toState: {
        type: Schema.Types.ObjectId,
        ref: 'State',
        index: true
    },
    toInstitute: {
        type: Schema.Types.ObjectId,
        ref: 'Institute',
        index: true
    },
    toVendor: {
        type: Schema.Types.ObjectId,
        ref: 'Vendor',
        index: true
    },

    reason: {
        type: String
    },
    photos: [{
        tags: [String],
        photo: String
    }]
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Transaction', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, 'project center institute state', 'project center institute state'));
var model = {};
module.exports = _.assign(module.exports, exports, model);