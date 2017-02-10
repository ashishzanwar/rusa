var schema = new Schema({
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        index: true
    },
    vendor: {
        type: Schema.Types.ObjectId,
        ref: 'Vendor',
        index: true
    },
    allocatedAmount: {
        type: Number
    },
    amountReleased: {
        type: Number
    },
    workCompletedPercent: {
        type: Number
    },

    transactions: {
        id: [{
            type: Schema.Types.ObjectId,
            ref: 'Transaction',
            index: true
        }]
    },
    photos: [{
        type: String
    }],
    notes: [{
        timestamp: {
            type: Date,
            default: Date.now
        },
        fromInstitute: {
            type: Schema.Types.ObjectId,
            ref: 'Institute',
            index: true,
            text: String
        },

        fromVendor: {
            type: Schema.Types.ObjectId,
            ref: 'Vendor',
            index: true,
            text: String
        },
        text: {
            type: String
        }
    }],
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('ProjectExpense', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);