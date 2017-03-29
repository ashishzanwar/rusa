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
        console.log("*************************************************************************");
        console.log("inside componentProjects & data is:", data);
        console.log("*************************************************************************");
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
                            projectPhotos: "$projects_data.photos",
                            totalValue: "$projects_data.valueOfProject",
                            amountOfWork: "$projects_data.amountOfWork",
                            vendorDescription: "$description",
                            vendorOrderIssueDate: "$orderIssueDate",
                            vendorOrderDueDate: "$orderDueDate",
                            vendorOrderPhoto: "$photos",
                            vendorName: "$vendor_data.name",
                            vendorAllocation: "$allocatedAmount",
                        },
                        vendorReleased: {
                            $sum: "$transaction_data.amount"
                        }
                    }
                },

            ], function (err, compProjects) {

                console.log("**************************************************************************************************");
                console.log("inside the response of ProjectExpense.aggregate & the result is", compProjects);
                console.log("**************************************************************************************************");
                if (err) {
                    callback(null, err);
                } else if (_.isEmpty(compProjects)) {
                    callback(null, []);
                } else {
                    console.log("componentProjects --> final response compProjects", compProjects);
                    var newData = _.map(compProjects, function (n) {
                        n._id.vendorReleased = n.vendorReleased;
                        return n._id;
                    });

                    console.log("componentProjects --> final response 1st newData", newData);

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
                            vendors.push(_.pick(single, ["vendorId", "vendorName", "vendorAllocation", "vendorReleased", "vendorOrderIssueDate", "vendorOrderDueDate", "vendorOrderPhoto"]));
                            projectDetails = _.omit(projectDetails, ["vendorId", "vendorName", "vendorAllocation", "vendorReleased", "vendorOrderIssueDate", "vendorOrderDueDate", "vendorOrderPhoto"]);
                        });
                        projectDetails.vendor = vendors;
                        return projectDetails;
                    });

                    // console.log("componentProjects --> final response 2nd newData", newData);

                    var releasedAmountPerProject = 0;

                    _.each(newData, function (data) {
                        _.each(data.vendor, function (ven) {
                            releasedAmountPerProject = releasedAmountPerProject + ven.vendorReleased;
                        });
                        data.totalAmountReleased = releasedAmountPerProject;
                        releasedAmountPerProject = 0;
                    });

                    // console.log("componentProjects --> final response 3rd newData", newData);
                    console.log("--------------------------------------------------------------------------------------------------");
                    console.log("component projects 1st API data: ", newData);
                    console.log("--------------------------------------------------------------------------------------------------");

                    callback(null, newData);

                }
            });

    },

    getProjectsNotAvailInProjectExpense: function (data, callback) {
        console.log("inside getProjectsNotAvailInProjectExpense & data is :", data);
        var tempProId = [];
        ProjectExpense.find({}).select("project").exec(function (err, getAllProj) {
            if (err) {
                console.log("error", err);
                //callback(err, null);
            } else if (_.isEmpty(getAllProj)) {
                console.log("getProComp", getAllProj);
                callback(null, "No data founds");
            } else {
                _.forEach(getAllProj, function (getPro, key) {
                    tempProId.push(ObjectId(getPro.project));
                });

                console.log("tempCompId", tempProId);

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
                            "preserveNullAndEmptyArrays": true
                        }
                    },

                    // Stage 3
                    {
                        $match: {
                            "components_data._id": ObjectId(data.component)
                        }
                    },

                    // Stage 4
                    {
                        $lookup: {
                            "from": "projecttypes",
                            "localField": "projectType",
                            "foreignField": "_id",
                            "as": "projectType_data"
                        }
                    },

                    // Stage 5
                    {
                        $unwind: {
                            path: "$projectType_data",
                            preserveNullAndEmptyArrays: true // optional
                        }
                    },

                    // Stage 6
                    {
                        $lookup: {
                            "from": "assettypes",
                            "localField": "assetType",
                            "foreignField": "_id",
                            "as": "assetType_data"
                        }
                    },

                    // Stage 7
                    {
                        $unwind: {
                            path: "$assetType_data",
                            preserveNullAndEmptyArrays: true // optional
                        }
                    },

                    // Stage 8
                    {
                        $match: {
                            "_id": { $nin: tempProId }
                        }
                    },

                    // Stage 9
                    {
                        $group: {
                            "_id": {
                                componentName: "$components_data.name",
                                componentAllocation: "$components_data.allocation",
                                projectStatus: "$status",
                                // projectSubStatus: "$projects_data.status",
                                projectType: "$projectType_data.name",
                                assetType: "$assetType_data.name",
                                projectId: "$_id",
                                dueDate: "$dueDate",
                                projectRemarks: "$remarks",
                                totalValue: "$valueOfProject",
                                amountOfWork: "$amountOfWork"
                            }
                        }
                    }
                ];

                Project.aggregate(pipeline, function (err, compData) {
                    if (err) {
                        callback(null, err);
                    } else {
                        if (_.isEmpty(compData)) {
                            console.log("compData", compData);
                            callback(null, []);
                        } else {
                            console.log("compData", compData);

                            var newData = _.map(compData, function (n) {
                                return n._id;
                            });

                            callback(null, newData);

                        }
                    }
                });
            }
        });
    },

    // mobile application API for Component --> projects --> project --> add expense --> update projectExpense table
    // check whether vendor is available into the corresponding project or not --> 
    // if yes --> then update the document  
    // if no  --> then create a new document with vendor id & allocation amount
    vendorAllocation: function (data, callback) {
        console.log("data", data);
        // operation

        ProjectExpense.findOneAndUpdate({ project: data.project_id, vendor: data.vendor_id }, { allocatedAmount: data.allocation }).exec(function (err, mydata) {
            if (err) {
                console.log("inside vendorAllocation err");
            } else if (_.isEmpty(mydata)) {
                console.log("inside vendorAllocation null");
                // create a new document & save vendor id & alllocation
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