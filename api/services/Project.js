var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var uniqueValidator = require('mongoose-unique-validator');
var timestamps = require('mongoose-timestamp');
var validators = require('mongoose-validators');
var monguurl = require('monguurl');
var autoIncrement = require('mongoose-auto-increment');
require('mongoose-middleware').initialize(mongoose);
autoIncrement.initialize(mongoose);

var Schema = mongoose.Schema;

var schema = new Schema({
    name: String,
    components: {
        type: Schema.Types.ObjectId,
        ref: 'Components',
        index: true
    },
    projectType: {
        type: Schema.Types.ObjectId,
        ref: 'ProjectType',
        index: true
    },
    assetType: {
        type: Schema.Types.ObjectId,
        ref: 'AssetType',
        index: true
    },
    valueOfProject: {
        type: Number
    },
    amountOfWork: {
        type: Number,
        default: 0
    },
    dueDate: {
        type: Date
    },
    remarks: {
        type: String
    },
    transaction: [{
        type: Schema.Types.ObjectId,
        ref: 'Transaction',
        index: true,
        key: "project"
    }],
    photos: [{
        photo: String,
        types: {
            type: String,
            enum: ["Payment", "InstageWork", "CompletedWork", "Others"],
            default: "Others"
        }
    }],

    status: {
        type: String,
        enum: ["Active", "Completed", "Cancelled", "OnHold"]
    },
    notes: [{

        timestamp: {
            type: Date,
            default: Date.now
        },
        from: {
            type: String,
            enum: ["Center", "State", "Institute", "Vendor"]
        },
        added_by: {
            type: Schema.Types.ObjectId
        },
        text: {
            type: String
        }

        // fromCenter: {
        //     type: Schema.Types.ObjectId,
        //     ref: 'Center',
        //     index: true,
        //     text: String
        // },
        // fromState: {
        //     type: Schema.Types.ObjectId,
        //     ref: 'State',
        //     index: true,
        //     text: String
        // },
        // fromInstitute: {
        //     type: Schema.Types.ObjectId,
        //     ref: 'Institute',
        //     index: true,
        //     text: String
        // },
        // fromVendor: {
        //     type: Schema.Types.ObjectId,
        //     ref: 'Vendor',
        //     index: true,
        //     text: String
        // },

    }],

});

schema.plugin(deepPopulate, {
    populate: {

        'state': {
            select: '_id name project'
        },

        'photos': {
            select: '_id photo tags'
        },

        'components': {
            select: '_id name'
        },

        'assetType': {
            select: '_id name'
        },

        'projectType': {
            select: '_id name'
        }
    }

});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);

schema.plugin(autoIncrement.plugin, {
    model: 'Project',
    field: 'project_id',
    startAt: 1,
    incrementBy: 1
});
module.exports = mongoose.model('Project', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, 'user institute state transaction components assetType projectType', 'user institute state transaction components assetType projectType'));
var model = {
    findAllProject: function (data, callback) {
        Project.find().select("name _id").exec(function (err, found) {
            if (err) {
                // console.log(err);
                callback(err, null);
            } else {
                if (found) {
                    console.log("IN  STATE FOUND", found);
                    callback(null, found);
                } else {
                    callback(null, {
                        message: "No Data Found"
                    });
                }
            }
        })
    },

    saveProject: function (data, callback) {
        var myprojectdata = data;
        console.log("Data in ADD PROJECT", data);
        console.log(data._id);

        myprojectdata = this(myprojectdata);

        var data2 = {};

        data2.project_approved_board_no = data.project_approved_board_no,


            data2.project_id = data.project_id,
            data2.project_approved_board_no = data.project_approved_board_no,
            data2.component = data.component,
            data2.allocationType = data.allocationType,
            data2.endPoint = data.endPoint,
            data2.totalAllocation = data.totalAllocation,
            data2.fundReleased = data.fundReleased,
            data2.ultilization = data.ultilization,
            data2.projectStatus = data.projectStatus,
            data2.fundStatus = data.fundStatus,
            data2.workStatus = data.workStatus


        // data2.project_approved_board_no = data.project_approved_board_no,
        //     data2.centerPercent = data.centerPercent,
        //     data2.component = data.component,
        //     data2.name = data.name,
        //     data2.quantity = data.quantity,
        //     data2.statePercent = data.statePercent,
        //     data2.status = data.status,
        //     data2.subStatus = data.subStatus,
        //     data2.title = data.title,
        //     data2.totalAmount = data.totalAmount

        Project.findOneAndUpdate({
            _id: data._id
        }, data2, {
                new: true
            }).exec(function (err, found) {
                if (err) {

                    // console.log("err", err);
                    //   callback(err);
                } else {
                    console.log("reply", found);
                    callback(null, found);
                }

            });
    },

    saveProjectPhotos: function (data, callback) {

        console.log(data);
        Project.findOneAndUpdate({
            _id: data._id
        }, {
                $push: {

                    photos: {
                        $each: [{
                            photo: data.photo,
                            types: data.types

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

    addNewProject: function (data, callback) {
        var projectdata = data;
        projectdata = this(projectdata);
        projectdata.save(function (err, respo) {
            if (err) {
                callback(err, null);
            } else {
                console.log("respo", respo);
                console.log("respo id --->", respo._id);

                Institute.findOneAndUpdate({
                    _id: data.institute
                }, {
                        $push: {
                            project: respo._id
                        }
                    }).exec(function (err, found) {
                        if (err) {
                            callback(err, null);
                        } else {
                            if (found) {
                                console.log("FOUND-->", found);
                                State.findOneAndUpdate({
                                    _id: data.state
                                }, {
                                        $push: {
                                            project: respo._id
                                        }
                                    }).exec(function (err, found) {
                                        if (err) {
                                            callback(err, null);
                                        } else {
                                            if (found) {
                                                console.log("FOUND-->", found);
                                                callback(null, found);
                                            } else {
                                                callback(null, {
                                                    message: "No Data Found"
                                                });
                                            }
                                        }
                                    });
                                //  callback(null, found);
                            } else {
                                callback(null, {
                                    message: "No Data Found"
                                });
                            }
                        }
                    });

            }
        });
    },

    findOneProject: function (data, callback) {

        Project.findOne({
            _id: data._id
        }).deepPopulate("photos projectType assetType").exec(function (err, found) {

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

    findAllState: function (data, callback) {
        Project.find().select("state").deepPopulate("state").exec(function (err, found) {
            if (err) {
                // console.log(err);
                callback(err, null);
            } else {
                if (found) {
                    console.log("IN  STATE FOUND", found);
                    callback(null, found);
                } else {
                    callback(null, {
                        message: "No Data Found"
                    });
                }
            }
        })
    },

    getInstitute: function (data, callback) {

        Project.find({
            institute: data._id
        }).deepPopulate("state institute").exec(function (err, found) {
            if (err) {
                console.log("Err", err);
                callback(err, null);
            } else {
                console.log("FOUND", found);
                callback(null, found);
            }
        });

    },

    removeProjectPhotos: function (data, callback) {

        console.log("DATA", data);
        Project.update({

            "_id": data._id
        }, {
                $pull: {
                    photos: {
                        photo: data.photo,
                        types: data.types
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
    },

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
                    "preserveNullAndEmptyArrays": true
                }
            },

            // Stage 3
            {
                $lookup: {
                    "from": "institutes",
                    "localField": "components_data.institute",
                    "foreignField": "_id",
                    "as": "institutes_data"
                }
            },

            // Stage 4
            {
                $unwind: {
                    path: "$institutes_data",
                    "preserveNullAndEmptyArrays": true
                }
            },

            // Stage 5
            {
                $lookup: {
                    "from": "states",
                    "localField": "institutes_data.state",
                    "foreignField": "_id",
                    "as": "states_data"
                }
            },

            // Stage 6
            {
                $unwind: {
                    path: "$states_data",
                    "preserveNullAndEmptyArrays": true
                }
            },

            // Stage 7
            {
                $lookup: {
                    "from": "pabs",
                    "localField": "components_data.pabno",
                    "foreignField": "_id",
                    "as": "pab_data"
                }
            },

            // Stage 8
            {
                $unwind: {
                    path: "$pab_data",
                    "preserveNullAndEmptyArrays": true
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
        // if (data.component) {
        //     pipeline.push({
        //         $match: {
        //             "components_data._id": ObjectId(data.component)
        //         }
        //     });
        // }
        if (data.keyComponent) { // In actual it is keycomponents
            pipeline.push({
                $match: {
                    "components_data.keycomponents": ObjectId(data.keyComponent)
                }
            });
        }
        if (data.institute) {
            pipeline.push({
                $match: {
                    "institutes_data._id": ObjectId(data.institute)
                }
            });
        }
        if (data.state) {
            pipeline.push({
                $match: {
                    "states_data._id": ObjectId(data.state)
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

    // mobile API --> component --> addProject 
    // data --> components(id), assetType(id), projectType(id), valueOfProject (number), dueDate (date), amountOfWork(% number)
    addProjectFromApp: function (data, callback) {
        console.log("####################### inside addProjectFromApp project model ##########################");
        Project.saveData(data, function (err, addedProject) {
            if (err) {
                callback(err, null);
            } else if (_.isEmpty(addedProject)) {
                callback(null, "No data founds");
            } else {
                console.log("addedProject", addedProject);

                // this is not right approach at all
                // var proExObj = {
                //     project: addedProject._id
                // };

                // ProjectExpense.saveData(proExObj, function (err, addedProEx) {
                //     if (err) {
                //         callback(err, null);
                //     } else if (_.isEmpty(addedProEx)) {
                //         callback(null, "No data founds");
                //     } else {
                //         console.log("addedProEx", addedProEx);
                //         callback(null, addedProEx);
                //     }
                // });
                // callback(null, addedProject);
            }
        });

    },


    //mobile api for compnent --> project --> edit project details
    updateProject: function (data, callback) {
        console.log("inside updateProject data", data);
        var proObj = {
            "_id": data._id,
            "components": data.components,
            "assetType": data.assetType,
            "projectType": data.projectType,
            "valueOfProject": data.valueOfProject,
            "dueDate": data.dueDate,
            "amountOfWork": data.amountOfWork
        }

        Project.saveData(proObj, function (err, proUpdate) {
            console.log("proUpdate", proUpdate);
            if (err) {
                callback(err, null);
            } else if (_.isEmpty(proUpdate)) {
                callback(null, "No Data Found");
            } else {
                callback(null, proUpdate);
            }
        });
    },

    // mobile API + Dashboard API 
    // mobile --> app --> fund allocations
    getProjectReport: function (data, callback) {
        console.log("inside getProjectReport model");
        var pipeLine = Project.getAggregatePipeLine(data);
        console.log(pipeLine);
        async.parallel({

            // Blocks function start here
            // rusaDashboard.js pipeline 9 & 10
            totalComponentsFundAllocation: function (callback) {
                var newPipeLine = _.cloneDeep(pipeLine);

                //do not delete below two pipeline
                newPipeLine.push({
                    $group: {
                        "_id": "$components",
                        totalFundAllocationTemp: { // bcoz one component can have multiple projects.
                            $first: "$components_data.allocation"
                        }
                    }
                });

                newPipeLine.push({
                    $group: {
                        "_id": null,
                        totalFundAllocation: {
                            $sum: "$totalFundAllocationTemp"
                        }
                    }
                });

                // newPipeLine.push({
                //     $group: {
                //         "_id": "1",
                //         totalFundAllocation: {
                //             $sum: "$components_data.allocation"
                //         }
                //     }
                // });

                Project.aggregate(newPipeLine, function (err, allocationData) {
                    if (err) {
                        callback(null, err);
                    } else {
                        if (_.isEmpty(allocationData)) {
                            callback(null, "No data founds");
                        } else {
                            callback(null, allocationData[0]);
                        }
                    }
                });
            },
            // rusaDashboard.js pipeline 11 & 12
            totalCenterAndStateAllocation: function (callback) {
                var newPipeLine = _.cloneDeep(pipeLine);

                newPipeLine.push({
                    $group: {
                        "_id": {
                            compData: "$components_data._id",
                            state: "$states_data._id",
                            centerShare: "$states_data.centerShare",
                            stateShare: "$states_data.stateShare",
                        },

                        totalAllocation: {
                            $first: "$components_data.allocation"
                        },
                    },

                });

                Project.aggregate(newPipeLine, function (err, data) {
                    if (err) {
                        callback(err);
                    } else {
                        var obj = {
                            centerShare: 0,
                            stateShare: 0
                        };

                        // console.log("###############################datadatadatadata#########################################", data);

                        _.each(data, function (n) {
                            obj.centerShare += n._id.centerShare * n.totalAllocation / 100;
                            obj.stateShare += n._id.stateShare * n.totalAllocation / 100;
                        });
                        callback(err, obj);
                    }
                });
            },
            totalComponents: function (callback) {
                var newPipeLine = _.cloneDeep(pipeLine);
                newPipeLine.push({
                    $group: { // it will remove repeated component
                        "_id": {
                            pab: "$pab_data.name",
                            componentId: "$components_data._id",
                        },
                    },
                },

                    {
                        $group: { // it will select all records. So, we will get total components
                            "_id": 1,
                            count: {
                                $sum: 1
                            },
                        }
                    });
                Project.aggregate(newPipeLine, function (err, componentData) {
                    if (err) {
                        callback(null, err);
                    } else {
                        if (_.isEmpty(componentData)) {
                            callback(null, "No data founds");
                        } else {
                            callback(null, componentData[0]);
                        }
                    }
                });

            },
            totalProjects: function (callback) {
                var newPipeLine = _.cloneDeep(pipeLine);
                newPipeLine.push({
                    $group: {
                        "_id": {
                            componentId: "$_id",
                        },
                    },
                },

                    {
                        $group: {
                            "_id": 1,
                            count: {
                                $sum: 1
                            },
                        }
                    });
                Project.aggregate(newPipeLine, function (err, projectData) {
                    if (err) {
                        callback(null, err);
                    } else {
                        if (_.isEmpty(projectData)) {
                            callback(null, "No data founds");
                        } else {
                            callback(null, projectData[0]);
                        }
                    }
                });

            },
            inTimeComponents: function (callback) {

                var newPipeLine = _.cloneDeep(pipeLine);
                newPipeLine.push({ // it will remove repeated component 
                    $group: {
                        "_id": {
                            componentId: "$components_data._id",
                            componentSubStatus: "$components_data.subStatus",
                        },
                    }
                });

                newPipeLine.push({ // it will select only InTime Component
                    $match: {
                        "_id.componentSubStatus": "InTime"
                    }
                });

                newPipeLine.push({
                    $group: { //to select all records so we will get totalInTime components
                        "_id": null,
                        inTimeComponentsCount: {
                            $sum: 1
                        }
                    }
                });
                Project.aggregate(newPipeLine, function (err, inTimeCompData) {
                    if (err) {
                        callback(null, err);
                    } else {
                        if (_.isEmpty(inTimeCompData)) {
                            callback(null, "No data founds");
                        } else {
                            callback(null, inTimeCompData[0]);
                        }
                    }
                });
            },

            // Table functions start here
            institute: function (callback) {
                var newPipeLine = _.cloneDeep(pipeLine);
                newPipeLine.push({
                    $group: {
                        "_id": {
                            id: "$components",
                            componentId: "$components_data._id",
                            component: "$components_data.name",
                            pab: "$pab_data.name",
                            institute: "$institutes_data.name",
                            componentStatus: "$components_data.status",
                            componentWorkStatus: "$components_data.workCompleted",
                            keyComponent: "$components_data.keycomponents",
                            state: "$states_data._id",
                            stateName: "$states_data.name",
                            centerShare: "$states_data.centerShare",
                            stateShare: "$states_data.stateShare"
                        },

                        totalComponentProjects: {
                            $sum: 1
                        },
                        totalComponentAllocation: {
                            $first: "$components_data.allocation"
                        }
                    }



                });
                // Project.aggregate(newPipeLine, callback);
                Project.aggregate(newPipeLine, function (err, datacomp) {
                    if (err) {
                        callback(null, err);
                    } else {
                        if (_.isEmpty(datacomp)) {
                            callback(null, "No data founds");
                        } else {
                            console.log("###############################.....institute....#########################################", datacomp);

                            callback(null, datacomp);
                        }
                    }
                });
            },
            totalDelayedProjectsPerComponent: function (callback) {
                var newPipeLine = _.cloneDeep(pipeLine);
                newPipeLine.push({ // it will select records who's deuDate is less than current date
                    $match: {
                        "dueDate": {
                            "$lt": new Date()
                        } // to filter delayed data
                    }
                });

                newPipeLine.push({
                    $group: { //  
                        "_id": {
                            pab: "$pab_data.name",
                            componentId: "$components_data._id",
                            component: "$components_data.name",
                            institute: "$institutes_data.name",
                            state: "$states_data.name",
                            pab: "$pab_data.name",
                        },
                        "totalDelayedProjectsPerComponent": {
                            $sum: 1
                        }
                    }
                });
                Project.aggregate(newPipeLine, function (err, tdppc) {
                    if (err) {
                        callback(null, err);
                    } else {
                        if (_.isEmpty(tdppc)) {
                            callback(null, "No data founds");
                        } else {
                            callback(null, tdppc);
                        }
                    }
                });
            },
            totalDelayedProjects: function (callback) {
                var newPipeLine = _.cloneDeep(pipeLine);
                newPipeLine.push({ // it will select records who's deuDate is less than current date
                    $match: {
                        "dueDate": {
                            "$lt": new Date()
                        } // to filter delayed data
                    }
                });

                newPipeLine.push({
                    $group: { //  
                        _id: "1",
                        "totalDelayedProjects": {
                            $sum: 1
                        }
                    }
                });
                Project.aggregate(newPipeLine, function (err, tdppc) {
                    if (err) {
                        callback(null, err);
                    } else {
                        if (_.isEmpty(tdppc)) {
                            callback(null, "No data founds");
                        } else {
                            callback(null, tdppc[0]);
                        }
                    }
                });
            },
        }, callback);

    },

    // mobile API component--> projects --> Project --> update --> status
    // data --> _id (project_id), status(Completed)
    changeStatus: function (data, callback) {
        // operation
        console.log("inside data", data);

        // var proObj = {
        //     "_id": data.project_id,
        //     "status": data.status // Completed
        // };

        Project.findOneAndUpdate({
            _id: data.projectId
        }, {
                status: data.status
            }).exec(function (err, changeStat) {
                if (err) {
                    callback(err, null);
                } else if (_.isEmpty(changeStat)) {
                    callback(null, "No Data Found");
                } else {
                    // callback(null, changeStat);
                    console.log("changeStat", changeStat);

                    var pipeline = [
                        // Stage 1
                        {
                            $match: {
                                "components": ObjectId(changeStat.components)
                            }
                        },

                        // Stage 2
                        {
                            $match: {
                                "status": "Completed"
                            }
                        },

                        // Stage 3
                        {
                            $group: {
                                "_id": 1,
                                "getAmountOfWork": {
                                    $sum: "$amountOfWork"
                                }
                            }
                        },

                    ];
                    console.log("pipeline", pipeline);

                    Project.aggregate(pipeline, function (err, updatedCompStatus) {
                        if (err) {
                            callback(null, err);
                        } else {
                            if (_.isEmpty(updatedCompStatus)) {
                                callback(null, "No data founds");
                            } else {
                                console.log("updatedCompStatus", updatedCompStatus[0].getAmountOfWork);
                                // update completed
                                Components.findOneAndUpdate({
                                    _id: changeStat.components
                                }, {
                                        workCompleted: updatedCompStatus[0].getAmountOfWork
                                    }).exec(function (err, updateWorkCompleted) {
                                        if (err) {
                                            callback(err, null);
                                        } else if (_.isEmpty(updateWorkCompleted)) {
                                            callback(null, "No data founds");
                                        } else {
                                            callback(null, updateWorkCompleted);
                                        }
                                    });

                            }
                        }
                    });
                }

            });

        // Project.saveData(proObj, function (err, proChangedStatus) {
        //     if (err) {
        //         callback(err, null);
        //     } else if (_.isEmpty(proChangedStatus)) {
        //         callback(null, "No Data Found");
        //     } else {

        //         // get component of corresposnding project
        //         // get total of amount of work allocated for  all projects
        //         // get total amount of completed projects  


        //         // callback(null, updatedCompStatus);
        //     }
        // });
    },

    // mobile API component --> project --> notes --> add
    // data --> project_id, componentId, from, added_by, text  
    addProjectNotes: function (data, callback) {
        console.log("addProjectNotes", data.projectId);

        Project.findOneAndUpdate({
            _id: data.projectId,
            components: data.componentId
        }, {
                $push: {
                    notes: {
                        $each: [{
                            from: data.from,
                            added_by: data.added_by,
                            text: data.text
                        }]
                    }
                }
            }).exec(function (err, addNotesData) {
                if (err) {
                    callback(err, null);
                } else if (_.isEmpty(addNotesData)) {
                    callback(null, "No Data Found");
                } else {
                    callback(null, addNotesData);
                }

            });
    },

    // mobile API component --> project --> notes 
    // data --> project_id 
    getProjectAllNotes: function (data, callback) {
        // console.log("inside getProjectAllNotes data", data);
        Project.find({
            _id: data.projectId,
            components: data.componentId
        }).select("_id components notes").exec(function (err, getProNotes) {
            if (err) {
                callback(err, null);
            } else if (_.isEmpty(getProNotes)) {
                callback(null, "No Data Found");
            } else {
                callback(null, getProNotes[0]);
            }
        });
    },

    // mobile API component --> projects --> project --> photos --> addNew photos
    // data --> projectId, componentId, 
    addProjectPhotos: function (data, callback) {
        // console.log("inside addProjectPhotos data", data);
        Project.findOneAndUpdate({
            _id: data.projectId,
            components: data.componentId
        }, {
                $push: {
                    photos: {
                        $each: data.photos
                    },
                }
            }).exec(function (err, addNotesData) {
                if (err) {
                    callback(err, null);
                } else if (_.isEmpty(addNotesData)) {
                    callback(null, "No Data Found");
                } else {
                    callback(null, addNotesData);
                }

            });

    },

    // mobile API component --> project --> photos 
    // data --> projectId & componentId
    getProjectAllPhotos: function (data, callback) {
        // console.log("inside getProjectAllPhotos data", data);
        Project.find({
            _id: data.projectId,
            components: data.componentId
        }).select("_id components photos").exec(function (err, getProPhotos) {
            if (err) {
                callback(err, null);
            } else if (_.isEmpty(getProPhotos)) {
                callback(null, "No Data Found");
            } else {
                // var onlyPhotos = _.groupBy(getProPhotos[0].photos, "types");
                callback(null, getProPhotos[0]);
            }
        });
    },

    // mobile API component --> media --> photos 
    // data --> componentId 
    getComponentAllPhotos: function (data, callback) {
        // console.log("inside getProjectAllPhotos data", data);
        Project.find({
            components: data.componentId
        }).deepPopulate("photos projectType assetType").exec(function (err, getProPhotos) {
            if (err) {
                callback(err, null);
            } else if (_.isEmpty(getProPhotos)) {
                callback(null, "No Data Found");
            } else {
                callback(null, getProPhotos);
            }
        });

        //  Project.find({ components: data.componentId }).select("_id name components photos ").exec(function (err, getProPhotos) {
        //     if (err) {
        //         callback(err, null);
        //     } else if (_.isEmpty(getProPhotos)) {
        //         callback(null, "No Data Found");
        //     } else {
        //         callback(null, getProPhotos);
        //     }
        // });
    },

    // get all filtered (PAB, Institute, state & keyComponent) components which are not available in project collection 
    getComponentsNotAvailInProject: function (data, callback) {
        console.log("inside getComponentsNotAvailInProject model");
        var tempCompId = [];

        // get all components which are not available in project table
        // then match with passed filter 
        // then send data in callback & merge with dashboard data

        // fetching component --> id of every projects
        Project.find({}).select("components").exec(function (err, getAllProj) {
            if (err) {
                console.log("error", err);
                //callback(err, null);
            } else if (_.isEmpty(getAllProj)) {
                console.log("getProComp", getAllProj);
                //callback(null, "No Data Found");
            } else {
                // console.log("getAllComp", getAllProj);

                //getting all component id's in required format & pushing it into an array (to use it in $match --> $nin)
                _.forEach(getAllProj, function (getPro, key) {
                    tempCompId.push(ObjectId(getPro.components));
                });

                console.log("tempCompId", tempCompId);

                var pipeline = [
                    {
                        $match: {
                            "_id": { $nin: tempCompId }
                        }
                    },

                    {
                        $lookup: {
                            "from": "institutes",
                            "localField": "institute",
                            "foreignField": "_id",
                            "as": "institutes_data"
                        }
                    },

                    {
                        $unwind: {
                            path: "$institutes_data",
                            "preserveNullAndEmptyArrays": true
                        }
                    },

                    {
                        $lookup: {
                            "from": "states",
                            "localField": "institutes_data.state",
                            "foreignField": "_id",
                            "as": "states_data"
                        }
                    },

                    {
                        $unwind: {
                            path: "$states_data",
                            "preserveNullAndEmptyArrays": true
                        }
                    },

                    {
                        $lookup: {
                            "from": "pabs",
                            "localField": "pabno",
                            "foreignField": "_id",
                            "as": "pab_data"
                        }
                    },

                    {
                        $unwind: {
                            path: "$pab_data",
                            "preserveNullAndEmptyArrays": true
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
                if (data.keyComponent) {
                    pipeline.push({
                        $match: {
                            "keycomponents": ObjectId(data.keyComponent)
                        }
                    });
                }
                if (data.institute) {
                    pipeline.push({
                        $match: {
                            "institutes_data._id": ObjectId(data.institute)
                        }
                    });
                }
                if (data.state) {
                    pipeline.push({
                        $match: {
                            "states_data._id": ObjectId(data.state)
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


                var newPipeLine = _.cloneDeep(pipeline);

                newPipeLine.push({
                    $group: {
                        _id: {
                            componentId: "$_id",
                            component: "$name",
                            componentStatus: "$status",
                            componentWorkStatus: "$workCompleted",
                            instituteId: "$institutes_data._id",
                            institute: "$institutes_data.name",
                            keyComponent: "$keycomponents",
                            state: "$states_data._id",
                            stateName: "$states_data.name",
                            pabId: "$pab_data._id",
                            pab: "$pab_data.name",
                            centerShare: "$states_data.centerShare",
                            stateShare: "$states_data.stateShare"
                        },
                        totalComponentAllocation: {
                            $first: "$allocation"
                        }
                    }
                });

                Components.aggregate(newPipeLine, function (err, compData) {
                    if (err) {
                        callback(null, err);
                    } else {
                        if (_.isEmpty(compData)) {
                            callback(null, "No data founds");
                        } else {
                            callback(null, compData);
                        }
                    }
                });

                console.log("pipeline", pipeline);

            }
        });

        // _.findIndex(tempCompId, function (o) { return o._id == data.component });
    }
};

module.exports = _.assign(module.exports, exports, model);