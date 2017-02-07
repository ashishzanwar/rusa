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
    project_id: {
        type: String
    },

    name: {
        type: String
    },
    project_approved_board_no: {
        type: Number
    },
    state: {
        type: Schema.Types.ObjectId,
        ref: 'State',
        index: true,
        key: "project"
    },
    institute: {
        type: Schema.Types.ObjectId,
        ref: 'Institute',
        index: true,
        key: "project"
    },
    title: {
        type: String
    },
    component: {
        type: String
    },
    centerPercent: {
        type: Number
    },
    statePercent: {
        type: Number
    },
    totalAmount: {
        type: Number
    },
    allocationType: String,
    fundReleased: String,
    ultilization: String,
    projectStatus: {
        type: String,
        enum: ["Active", "Complete", "Cancelled", "OnHold"]
    },
    fundStatus: {
        type: String,
        enum: ["InTime", "Delay"]
    },
    workStatus: {
        type: String,
        enum: ["InTime", "Delay"]
    },
    totalAllocation: Number,
    endPoint: {
        type: String,
    },
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
    photos: [{
        photo: String,
        tags: String

    }],

    milestones: [{
        type: Schema.Types.ObjectId,
        ref: 'Milestones',
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
    statusLogs: [{
            timestamp: {
                type: Date,
                default: Date.now
            },
            status: {
                type: String,
                enum: ["Active", "Complete", "Cancelled", "OnHold"]
            }
        }


    ],

    quantity: {
        type: Number
    },
    tags: [
        String
    ],


});

schema.plugin(deepPopulate, {
    populate: {

        'state': {
            select: '_id name project'
        },

        'photos': {
            select: '_id photo tags'
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

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, 'user institute state transaction', 'user institute state transaction'));
var model = {

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
                        tags: data.tags

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
                    tags: data.tags



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


};
module.exports = _.assign(module.exports, exports, model);