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
    }],

    quantity: {
        type: Number
    },
    tags: [
        String
    ],


});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Project', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, 'user institute state transaction', 'user institute state transaction'));
var model = {

    saveProject: function (data, callback) {
        var myprojectdata = data;
        console.log(data._id);

        myprojectdata = this(myprojectdata);

        var data2 = {};

            data2.project_approved_board_no = data.project_approved_board_no,
            data2.centerPercent = data.centerPercent,
            data2.component = data.component,
            data2.name = data.name,
            data2.quantity = data.quantity,
            data2.statePercent = data.statePercent,
            data2.status = data.status,
            data2.subStatus = data.subStatus,
            data2.title = data.title,
            data2.totalAmount = data.totalAmount

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



    }




};
module.exports = _.assign(module.exports, exports, model);