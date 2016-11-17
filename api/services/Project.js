var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var uniqueValidator = require('mongoose-unique-validator');
var timestamps = require('mongoose-timestamp');
var validators = require('mongoose-validators');
var monguurl = require('monguurl');
require('mongoose-middleware').initialize(mongoose);

var Schema = mongoose.Schema;

var schema = new Schema(
    {
     project_approved_board_no: {
                type: String
             },
    state : {
            type: Schema.Types.ObjectId,
            ref: 'State',
            index: true
        },
   institute : {
            type: Schema.Types.ObjectId,
            ref:'Institute',
            index: true
        },
  title: {
        type: String
             },
component: {
        type: String
             },
  centerPercent: {
        type: String
             },
  statePercent: {
        type: String
             },
 totalAmount: {
        type: String
             },

    amountRecievedCountry:[{
        id:{
            type: Schema.Types.ObjectId,
            ref: 'Transaction',
            index: true
    }}],
    
    amountRecievedState:[{
        id:{
            type: Schema.Types.ObjectId,
            ref: 'Transaction',
            index: true
    }}],


    amountUtilized:[{
         id:{   type: Schema.Types.ObjectId,
            ref: 'Transaction',
            index: true
    }}],


     refundCanceled:[{
         id:{
            type: Schema.Types.ObjectId,
            ref: 'Transaction',
            index: true
     }}],



    refundUnutilized:[{
        id:{
            type: Schema.Types.ObjectId,
            ref: 'Transaction',
            index: true
            }}],





     photos : {
            type: Schema.Types.ObjectId,
            ref: 'Milestones',
            index: true
        },

    milestones : {
            type: Schema.Types.ObjectId,
            ref: 'Milestones',
            index: true
        },
    
    status: {
        type: String,
        enum: ["Active","Complete","Cancelled","OnHold"]
    },

        subStatus: {
        type: String,
        enum: ["InTime", "Delay"]
    },


    
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Project', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema,'users institute state transaction','users institute state transaction'));
var model = {};
module.exports = _.assign(module.exports, exports, model);
