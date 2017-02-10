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
    workcompletedpercent: {
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
        text: String,
        timestamp: {
            type: Date,
            default: Date.now
        },
        from: {
            type: String,
            enum: ["fromInstitute", "fromVendor"]
        }
    }],
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Projectexpense', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);