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

    // transactions: {
    //     id: [{
    //         type: Schema.Types.ObjectId,
    //         ref: 'Transaction',
    //         index: true
    //     }]
    // },

    transaction: [{
        type: Schema.Types.ObjectId,
        ref: 'Transaction',
        index: true,
        key: "project"
    }],

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
    // vendorName: {
    //     type: Date
    // },
    // installmentNo: {
    //     type: Number
    // },
    // orderIssueDate: {
    //     type: Date
    // },
    // orderDueDate: {
    //     type: Date
    // },
    // orderFile: {
    //     type: Date
    // },
    // vendorpan: {
    //     type: String
    // },
    // tintan: {
    //     type: String
    // },

});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('ProjectExpense', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, 'user institute state transaction components', 'user institute state transaction components'));
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

    getAllprojectOfComponent: function (data, callback) {

        ProjectExpense.aggregate([
            // Stage 1
            {
                $lookup: {
                    "from": "projects",
                    "localField": "project",
                    "foreignField": "_id",
                    "as": "project_data"
                }
            },

            // Stage 2
            {
                $unwind: {
                    path: "$project_data",

                }
            },
            {
                $lookup: {
                    "from": "projecttypes",
                    "localField": "project_data.projectType",
                    "foreignField": "_id",
                    "as": "projectType_data"
                }
            },

            // Stage 2.1
            {
                $unwind: {
                    path: "$projectType_data",

                }
            },

            // Stage 3.1
            {
                $lookup: {

                    "from": "assettypes",
                    "localField": "project_data.assetType",
                    "foreignField": "_id",
                    "as": "assetType_data"
                }
            },

            // Stage 4.1
            {
                $unwind: {
                    path: "$assetType_data",
                }
            },
            // Stage 1
            {
                $match: {
                    "project_data.components": ObjectId(data.id)
                }
            },

        ]).exec(function (error, resObject) {
            console.log(resObject);
            if (error) {
                callback(error, null)
            } else {
                if (_.isEmpty(resObject)) {
                    callback(null, "No data founds");
                } else {
                    callback(null, resObject);
                }
            }
        });

    },

    // mobile application API for Component --> projects screen
    componentProjects: function (data, callback) {
        ProjectExpense.aggregate(

            // Pipeline
            [
                // Stage 1
                {
                    $lookup: {
                        "from": "projects",
                        "localField": "project",
                        "foreignField": "_id",
                        "as": "projects_data"
                    }
                },

                // Stage 2
                {
                    $unwind: {
                        path: "$projects_data",
                        preserveNullAndEmptyArrays: true // optional
                    }
                },

                // Stage 3
                {
                    $lookup: {
                        "from": "components",
                        "localField": "projects_data.components",
                        "foreignField": "_id",
                        "as": "components_data"
                    }
                },

                // Stage 4
                {
                    $unwind: {
                        path: "$components_data",
                        preserveNullAndEmptyArrays: false // optional
                    }
                },

                // Stage 5
                {
                    $match: {
                        "components_data._id": ObjectId(data.component)
                    }
                },

                // Stage 6
                {
                    $lookup: {
                        "from": "vendors",
                        "localField": "vendor",
                        "foreignField": "_id",
                        "as": "vendor_data"
                    }
                },

                // Stage 7
                {
                    $unwind: {
                        path: "$vendor_data",
                        preserveNullAndEmptyArrays: true // optional
                    }
                },

                // Stage 8
                {
                    $lookup: {
                        "from": "transactions",
                        "localField": "transaction",
                        "foreignField": "_id",
                        "as": "transaction_data"
                    }
                },

                // Stage 9
                {
                    $unwind: {
                        path: "$transaction_data",
                        preserveNullAndEmptyArrays: true // optional
                    }
                },

                // Stage 10
                {
                    $lookup: {
                        "from": "projecttypes",
                        "localField": "projects_data.projectType",
                        "foreignField": "_id",
                        "as": "projectType_data"
                    }
                },

                // Stage 11
                {
                    $unwind: {
                        path: "$projectType_data",
                        preserveNullAndEmptyArrays: false // optional
                    }
                },

                // Stage 12
                {
                    $lookup: {
                        "from": "assettypes",
                        "localField": "projects_data.assetType",
                        "foreignField": "_id",
                        "as": "assetType_data"
                    }
                },

                // Stage 13
                {
                    $unwind: {
                        path: "$assetType_data",
                        preserveNullAndEmptyArrays: false // optional
                    }
                },

                // Stage 14
                {
                    $group: {
                        "_id": {
                            projectExpense: "$_id",
                            componentName: "$components_data.name",
                            projectStatus: "$projects_data.status",
                            projectType: "$projectType_data.name",
                            assetType: "$assetType_data.name",
                            projectId: "$project",
                            vendorId: "$vendor_data._id",
                            dueDate: "$projects_data.dueDate",
                            totalValue: "$projects_data.valueOfProject",
                            amountOfWork: "$projects_data.amountOfWork",
                            vendorName: "$vendor_data.name",
                            vendorAllocation: "$allocatedAmount",
                        },
                        vendorReleased: {
                            $sum: "$transaction_data.amount"
                        }
                    }
                },

            ], function (err, compProjects) {
                if (err) {
                    callback(null, err);
                } else if (_.isEmpty(compProjects)) {
                    callback(null, "No Data Found");
                } else {
                    var newData = _.map(compProjects, function (n) {
                        n._id.vendorReleased = n.vendorReleased;
                        return n._id;
                    });
                    newData = _.groupBy(newData, "projectId");
                    newData = _.map(newData, function (n) {
                        var obj = _.groupBy(n, "vendorId");
                        return obj;
                    });
                    newData = _.map(newData, function (projectObj) {
                        var projectDetails = {};
                        var vendors = [];
                        _.each(projectObj, function (projectArr) {
                            var single = projectArr[0];
                            projectDetails = single;
                            vendors.push(_.pick(single, ["vendorId", "vendorName", "vendorAllocation", "vendorReleased"]));
                            projectDetails = _.omit(projectDetails, ["vendorId", "vendorName", "vendorAllocation", "vendorReleased"]);
                        });
                        projectDetails.vendor = vendors;
                        return projectDetails;
                    });

                    callback(null, newData);
                }
            });

    },
};
module.exports = _.assign(module.exports, exports, model);




// console.log("i = ", i);
// console.log("j = ", j);
// console.log("----------------");
// console.log("    project._id.projectId", project._id.projectId);
// console.log("projectCopy._id.projectId", projectCopy._id.projectId);
// console.log("    project._id.vendorName", project._id.vendorName);
// console.log("projectCopy._id.vendorName", projectCopy._id.vendorName);
// console.log("    project._id.vendorAllocation", project._id.vendorAllocation);
// console.log("projectCopy._id.vendorAllocation", projectCopy._id.vendorAllocation);



// console.log("####################################", "match found", "##########################################", projectCopy);

// console.log("    project._id.projectId", project._id.projectId);
// console.log("projectCopy._id.projectId", projectCopy._id.projectId);
// console.log("---------------------------------------------------");

// console.log("#########################################", "match found", "##################################################");
// console.log("--------------------------------------------------------------------------------------------------------------");