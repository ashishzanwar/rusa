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

    // extra filed added by Ashish
    vendorName: {
        type: Date
    },
    installmentNo: {
        type: Number
    },
    orderIssueDate: {
        type: Date
    },
    orderDueDate: {
        type: Date
    },
    orderFile: {
        type: Date
    },
    vendorpan: {
        type: String
    },
    tintan: {
        type: String
    },

});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('ProjectExpense', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    saveProjectExpensePhotos: function (data, callback) {

        console.log(data);
        ProjectExpense.findOneAndUpdate({
            _id: data._id
        }, {
                $push: {

                    photos: data.photos
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
    removeProjectExpensePhotos: function (data, callback) {

        console.log("DATA", data);
        ProjectExpense.update({

            "_id": data._id
        }, {
                $pull: {
                    photos: data.photos

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
    },


    updateProjectExpensePhotos: function (data, callback) {

        console.log("DATA", data);
        ProjectExpense.update({
            _id: data._id,
            photos: data.old
        }, {
                $set: {
                    "photos.$": data.photo

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
    },


    findOneProjectExpense: function (data, callback) {


        ProjectExpense.findOne({
            _id: data._id
        }).deepPopulate("photos").exec(function (err, found) {

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
};
module.exports = _.assign(module.exports, exports, model);