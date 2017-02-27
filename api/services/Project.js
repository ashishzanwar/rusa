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
            enum: ["Payment", "Instage Work", "Completed Work", "Others"]
        }

    }],

    status: {
        type: String,
        enum: ["Active", "Complete", "Cancelled", "OnHold"]
    },
    notes: [{

        timestamp: {
            type: Date,
            default: Date.now
        },

        fromCenter: {
            type: Schema.Types.ObjectId,
            ref: 'Center',
            index: true,
            text: String
        },
        fromState: {
            type: Schema.Types.ObjectId,
            ref: 'State',
            index: true,
            text: String
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
    }


    ],

    dueDate: {
        type: Date
    }




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

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, 'user institute state transaction components', 'user institute state transaction components'));
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
                    path: "$components_data"
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
                    path: "$institutes_data"
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
                    path: "$states_data"
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
                    path: "$pab_data"
                }
            }
        ];
        // console.log(ObjectId);
        if (data.pab) {
            pipeline.push({
                $match: {
                    "pab_data._id": ObjectId(data.pab)
                    // "pab_data._id": ObjectId("58a7f938efca06467a4ea95f")
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

    getProjectReport: function (data, callback) {
        var pipeLine = Project.getAggregatePipeLine(data);
        console.log(pipeLine);
        async.parallel({
            totalComponentsFundAllocation: function (callback) {
                var newPipeLine = _.cloneDeep(pipeLine);
                //If we directly use pipeline instead of newPipeLine then $group will change the pipeline data & we will not able to use it for next $group. So, we have to make a copy of pipeline everytime for new $group operation
                newPipeLine.push({
                    $group: {
                        "_id": "1",
                        totalFundAllocation: {
                            $sum: "$components_data.allocation"
                        }
                    }
                });
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
            state: function (callback) {
                var newPipeLine = _.cloneDeep(pipeLine);
                newPipeLine.push({
                    $group: {
                        "_id": "$states_data",
                        totalAllocation: {
                            $sum: "$components_data.allocation"
                        },
                    }
                });
                Project.aggregate(newPipeLine, function (err, data) {
                    if (err) {
                        callback(err);
                    } else {
                        var obj = {
                            centerShare: 0,
                            stateShare: 0
                        };
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
                    $group: {
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
                    $count: "count"
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
                newPipeLine.push({
                    $match: {
                        "components_data.subStatus": "InTime"
                    }
                });
                newPipeLine.push({
                    $group: {
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
            institute: function (callback) {
                var newPipeLine = _.cloneDeep(pipeLine);
                newPipeLine.push({
                    $group: {
                        "_id": {
                            pab: "$pab_data.name",
                            componentId: "$components_data._id",
                            component: "$components_data.name",
                            institute: "$institutes_data.name",
                            componentStatus: "$components_data.status",
                            state: "$states_data",
                        },
                        "totalComponentProjects": {
                            $sum: 1
                        },
                        totalComponentAllocation: {
                            $sum: "$components_data.allocation"
                        },
                    }
                });
                Project.aggregate(newPipeLine, callback);

            }
        }, callback);

    },

    getAllprojectOfComponent: function (data, callback) {
        // console.log("#############$$$$$$ inside getAllprojectOfComponent $$$$$#############", data);
        Project.aggregate([
            // Stage 1
            {
                $match: {
                    "components": ObjectId(data.id)
                }
            },

        ]).exec(function (error, resObject) {
            console.log(resObject);
            callback(error, resObject)
        });

    }
};
module.exports = _.assign(module.exports, exports, model);