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
        images: String,
        date: Date,
        amount: Number
    }],
    fundDelay: Boolean
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Components', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {

    saveComponentsPhotos: function (data, callback) {

        // console.log(data);
        Components.findOneAndUpdate({
            _id: data._id
        }, {
                $push: {

                    utilizationCertificates: {
                        $each: [{
                            images: data.images,

                        }]
                    }
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

    removeComponentsPhotos: function (data, callback) {

        console.log("DATA", data);
        Components.update({

            "_id": data._id
        }, {
                $pull: {
                    utilizationCertificates: {

                        images: data.images
                    }
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
        console.log("DATA", data);
    },

    findOneComponents: function (data, callback) {


        Components.findOne({
            _id: data._id
        }).deepPopulate("utilizationCertificates").exec(function (err, found) {

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

    findAllComponents: function (data, callback) {


        Components.find({}).exec(function (err, found) {

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

    findDashBoardData: function (data, callback) {
        console.log(data);

        Components.findOne({
            _id: data._id

        }).deepPopulate("project").populate("institute").populate("pabno").populate("keycomponents").exec(function (err, found) {

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