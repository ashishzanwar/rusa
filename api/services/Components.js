var schema = new Schema({
    name: String,
    institute: {
        type: Schema.Types.ObjectId,
        ref: 'Institute',
        index: true
    },
    pabno: {
        type: Schema.Types.ObjectId,
        ref: 'Pab',
        index: true
    },
    keycomponents: {
        type: Schema.Types.ObjectId,
        ref: 'KeyComponents',
        index: true
    },
    allocation: Number,
    project: [{
        type: Schema.Types.ObjectId,
        ref: 'Project',
        index: true
    }],
    amountReceivedCenter: [{
        type: Schema.Types.ObjectId,
        ref: 'Transaction',
        index: true
    }],
    amountReceivedState: [{
        type: Schema.Types.ObjectId,
        ref: 'Transaction',
        index: true
    }],
    amountUtilized: [{
        type: Schema.Types.ObjectId,
        ref: 'Transaction',
        index: true
    }],
    refundCanceled: [{
        type: Schema.Types.ObjectId,
        ref: 'Transaction',
        index: true
    }],
    refundUnutilized: [{
        type: Schema.Types.ObjectId,
        ref: 'Transaction',
        index: true
    }],
    status: {
        type: String,
        enum: ["Active", "Complete", "Cancelled", "OnHold"]
    },
    subStatus: {
        type: String,
        enum: ["InTime", "Delay"]
    },
    tags: [
        String
    ],
    utilizationCertificates: [{
        images: String
    }],
    fundDelay: Boolean
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Components', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);