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

    orderIssueDate: {
        type: Date
    },
    orderDueDate: {
        type: Date
    },
    orderFile: {
        type: Date
    },

    // extra filed added by Ashish
    // vendorName: {
    //     type: Date
    // },
    // installmentNo: {
    //     type: Number
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

    // mobile application API for Component --> projects screen
    // dashboard data --> component --> projects (Project details table)
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
                        preserveNullAndEmptyArrays: true // optional
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
                        preserveNullAndEmptyArrays: true // optional
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
                        preserveNullAndEmptyArrays: true // optional
                    }
                },

                // Stage 14
                {
                    $group: {
                        "_id": {
                            projectExpense: "$_id",
                            componentName: "$components_data.name",
                            componentAllocation: "$components_data.allocation",
                            projectStatus: "$projects_data.status",
                            // projectSubStatus: "$projects_data.status",
                            projectType: "$projectType_data.name",
                            assetType: "$assetType_data.name",
                            projectId: "$project",
                            vendorId: "$vendor_data._id",
                            dueDate: "$projects_data.dueDate",
                            projectRemarks: "$projects_data.remarks",
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

                    var releasedAmountPerProject = 0;

                    _.each(newData, function (data) {
                        _.each(data.vendor, function (ven) {
                            releasedAmountPerProject = releasedAmountPerProject + ven.vendorReleased;
                        });
                        data.totalAmountReleased = releasedAmountPerProject;
                        releasedAmountPerProject = 0;
                    });

                    // in case of --> calculate component release & utilize % and keep it into separate object & remove repeated fields

                    // var compoPro = {};
                    // compoPro.Projects = [];
                    // compoPro.CompDetail = {
                    //     componentName: newData[0].componentName,
                    //     componentAllocation: newData[0].componentAllocation
                    // };
                    // compoPro.Projects = newData;

                    callback(null, newData);
                    // callback(newData, null);
                }
            });

    },

    // mobile application API for Component --> projects --> project --> add expense --> update projectExpense table
    vendorAllocation: function (data, callback) {
        // operation

        ProjectExpense.findOneAndUpdate({ project: data.project_id, vendor: data.vendor_id }, { allocatedAmount: data.allocation }).exec(function (err, mydata) {
            if (err) {
                console.log("inside vendorAllocation err");
            } else {
                console.log("inside vendorAllocation success", mydata);
                callback(null, mydata);
            }
        });



        // console.log("mydata", mydata);
        // if (err) {
        //     console.log("inside vendorAllocation err");
        // } else {
        //     console.log("inside vendorAllocation success", mydata);

        //     proExpObj = {
        //         _id: mydata._id,
        //         project: data.project_id,
        //         vendor: data.vendor_id,
        //         allocatedAmount: data.allocation
        //     };

        //     ProjectExpense.update(proExpObj, function (err, projectExpenseSave) {
        //         if (err) {
        //             console.log("inside vendorAllocation err");
        //         } else {
        //             console.log("inside vendorAllocation success");
        //         }
        //     });
        // }

        // });






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