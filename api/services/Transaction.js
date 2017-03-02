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
    // project: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Project',
    //     index: true
    // },
    status: {
        type: String,
        enum: ["Pending", "Completed"]
    },

    type: {
        type: String,
        enum: ["Center To State", "State To Institute", "Institute To Vendor", "Vendor To Institute", "Institute To State", "Institute To Center", "State To Vendor", "State To Center", "Center To Institute"]
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
var model = {

    getAggregatePipeLine: function (data) {

        var pipeline = [
            // Stage 1
            {
                $lookup: {
                    "from": "components",
                    "localField": "components",
                    "foreignField": "_id",
                    "as": "components_data"
                }
            },

            // Stage 2
            {
                $unwind: {
                    path: "$components_data",

                }
            },

            // Stage 3
            {
                $lookup: {
                    "from": "pabs",
                    "localField": "components_data.pabno",
                    "foreignField": "_id",
                    "as": "pab_data"
                }
            },

            // Stage 4
            {
                $unwind: {
                    path: "$pab_data",

                }
            },

            // Stage 5
            {
                $unwind: {
                    path: "$components_data.utilizationCertificates",

                }
            },

            // Stage 6
            {
                $unwind: {
                    path: "$components_data.amountUtilized",

                }
            },

        ];

        if (data.pab) {
            pipeline.push({
                $match: {
                    "pab_data._id": ObjectId(data.pab)
                }
            });
        }
        if (data.component) {
            pipeline.push({
                $match: {
                    "components_data._id": ObjectId(data.component)
                }
            });
        }

        if (data.componentStatus) {
            pipeline.push({
                $match: {
                    "components_data.status": data.componentStatus
                }
            });
        }

        return pipeline;
    },

    getTransactionReport: function (data, callback) {
        var pipeLine = Transaction.getAggregatePipeLine(data);
        console.log(pipeLine);
        async.parallel({

            //Release & Utilized block data 
            totalReleaseAndUtilization: function (callback) {
                var newPipeLine = _.cloneDeep(pipeLine);
                newPipeLine.push({
                    $group: {
                        _id: "1",
                        totalFundRelease: {
                            $sum: "$amount"
                        },
                        totalUtilization: {
                            $sum: "$components_data.amountUtilized"
                        },
                        totalfundUtizedPercent: {
                            $avg: {
                                $sum: "$components_data.utilizationCertificates"
                            }
                        }
                    }
                });

                Transaction.aggregate(newPipeLine, function (err, totalData) {
                    if (err) {
                        callback(null, err);
                    } else {
                        if (_.isEmpty(totalData)) {
                            callback(null, "No data founds");
                        } else {
                            callback(null, totalData[0]);
                        }
                    }
                });
            },
            totalCenterRelease: function (callback) {
                var newPipeLine = _.cloneDeep(pipeLine);
                newPipeLine.push({
                    $match: {
                        $or: [{
                            "type": "Center To State"
                        }, {
                            "type": "Center To Institute"
                        }, {
                            "type": "Center To Vendor"
                        }]
                    }
                });
                newPipeLine.push({
                    $group: {
                        _id: "1",
                        totalCenterRelease: {
                            $sum: "$amount"
                        }

                    }
                });
                Transaction.aggregate(newPipeLine, function (err, totalCenterData) {
                    if (err) {
                        callback(null, err);
                    } else {
                        if (_.isEmpty(totalCenterData)) {
                            callback(null, "No data founds");
                        } else {
                            callback(null, totalCenterData[0]);
                        }
                    }
                });
            },
            centerAndStateReleasePerComponent: function (callback) {

                var typeData = [];
                var newPipeLine = _.cloneDeep(pipeLine);

                newPipeLine.push({
                    $match: {
                        $or: [{
                            "type": "Center To State"
                        }, {
                            "type": "Center To Institute"
                        }, {
                            "type": "Center To Vendor"
                        }]
                    }
                });
                newPipeLine.push({
                    $group: {
                        "_id": {
                            pab: "$pab_data.name",
                            componentId: "$components_data._id",
                            component: "$components_data.name",
                            componentStatus: "$components_data.status",
                        },
                        centerComponentRelease: {
                            $sum: "$amount"
                        }
                        // totalComponentAmountUtlization: {
                        //     $sum: "$components_data.amountUtilized"
                        // },
                        // totalComponentUtilizationPercent: {
                        //     $sum: "$components_data.utilizationCertificates"
                        // },

                    }
                });
                Transaction.aggregate(newPipeLine, function (err, centerData) {
                    if (err) {
                        callback(null, err);
                    } else {
                        if (_.isEmpty(centerData)) {
                            callback(null, "No data founds");
                        } else {
                            typeData.push(centerData);
                            console.log("center", centerData);
                            var newPipeLine1 = _.cloneDeep(pipeLine);
                            newPipeLine1.push({
                                $match: {
                                    $or: [{
                                            "type": "State To Intitute"
                                        },
                                        {
                                            "type": "State To Vendor"
                                        }
                                    ]
                                }
                            });
                            newPipeLine1.push({
                                $group: {
                                    "_id": {
                                        pab: "$pab_data.name",
                                        componentId: "$components_data._id",
                                        component: "$components_data.name",
                                        componentStatus: "$components_data.status",
                                    },
                                    stateComponentRelease: {
                                        $sum: "$amount"
                                    },
                                    // totalComponentAmountUtlization: {
                                    //     $sum: "$components_data.amountUtilized"
                                    // },
                                    // totalComponentUtilizationPercent: {
                                    //     $sum: "$components_data.utilizationCertificates"
                                    // },
                                }
                            });
                            Transaction.aggregate(newPipeLine1, function (err, stateData) {
                                if (err) {
                                    callback(null, err);
                                } else {
                                    if (_.isEmpty(stateData)) {
                                        callback(null, "No data founds");
                                    } else {
                                        typeData.push(stateData);
                                        console.log("state", stateData);
                                        callback(null, typeData);
                                    }
                                }
                            });
                            //callback(null, componentData);
                        }
                    }
                });

            },

            transactionsPerComponents: function (callback) {

                var newPipeLine = _.cloneDeep(pipeLine);
                newPipeLine.push({
                    $group: {
                        "_id": {
                            // id: "_id",
                            // pab: "$pab_data.name",
                            componentId: "$components_data._id",
                            component: "$components_data.name",
                            componentStatus: "$components_data.status",
                            amountUtilizedPerComponent: "$components_data.amountUtilized",
                            amountUtilizedPercentagePerComponent: "$components_data.utilizationCertificates"
                        },
                        totalComponentRelease: {
                            $sum: "$amount"
                        },
                        // totalComponentAmountUtlization: {
                        //     $sum: "$components_data.amountUtilized"
                        // },
                        // totalComponentUtilizationPercent: {
                        //     $sum: "$components_data.utilizationCertificates"
                        // },

                    }
                });
                Transaction.aggregate(newPipeLine, function (err, componentData) {
                    if (err) {
                        callback(null, err);
                    } else {
                        if (_.isEmpty(componentData)) {
                            callback(null, "No data founds");
                        } else {
                            callback(null, componentData);
                        }
                    }
                });



                // Project.distinct("_id","").exec(function (err, projectDistData) {
                //     if (err) {
                //         // console.log(err);
                //         callback(err, null);
                //     } else {
                //         if (projectDistData) {
                //             console.log("inside projects distinct success", projectDistData);



                //             //callback(null, projectDistData);
                //         } else {
                //             callback(null, {
                //                 message: "No Data Found"
                //             });
                //         }
                //     }
                // });




            },

            // centerReleasePerComponents: function (callback) {

            //     var newPipeLine = _.cloneDeep(pipeLine);
            //     newPipeLine.push({
            //         $match: {
            //             $or: [{
            //                 "type": "Center To State"
            //             }, {
            //                 "type": "Center To Institute"
            //             }, {
            //                 "type": "Center To Vendor"
            //             }]
            //         }
            //     });
            //     newPipeLine.push({
            //         $group: {
            //             "_id": {
            //                 pab: "$pab_data.name",
            //                 componentId: "$components_data._id",
            //             },
            //             centerReleasePerComponents: {
            //                 $sum: "$amount"
            //             }
            //         }
            //     });
            //     Transaction.aggregate(newPipeLine, function (err, perCenterData) {
            //         if (err) {
            //             callback(null, err);
            //         } else {
            //             if (_.isEmpty(perCenterData)) {
            //                 callback(null, "No data founds");
            //             } else {
            //                 callback(null, perCenterData);
            //             }
            //         }
            //     });
            // },
            // stateReleasePerComponents: function (callback) {

            //     var newPipeLine = _.cloneDeep(pipeLine);
            //     newPipeLine.push({
            //         $match: {
            //             $or: [{
            //                 "type": "State To Institute"
            //             }, {
            //                 "type": "State To Vendor"
            //             }]
            //         }
            //     });
            //     newPipeLine.push({
            //         $group: {
            //             "_id": {
            //                 pab: "$pab_data.name",
            //                 componentId: "$components_data._id",
            //             },
            //             stateReleasePerComponents: {
            //                 $sum: "$amount"
            //             }
            //         }
            //     });
            //     Transaction.aggregate(newPipeLine, function (err, perStateData1) {
            //         if (err) {
            //             callback(null, err);
            //         } else {
            //             if (_.isEmpty(perStateData1)) {
            //                 callback(null, "No data founds");
            //             } else {
            //                 callback(null, perStateData1);
            //             }
            //         }
            //     });
            // },



        }, callback);

    },

};
module.exports = _.assign(module.exports, exports, model);