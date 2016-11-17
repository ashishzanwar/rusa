var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var uniqueValidator = require('mongoose-unique-validator');
var timestamps = require('mongoose-timestamp');
var validators = require('mongoose-validators');
var monguurl = require('monguurl');
require('mongoose-middleware').initialize(mongoose);

var Schema = mongoose.Schema;

var schema = new Schema({

 project: {
                type: String
             },
 installment: {
                type: Number
             },
 subInstallment: {
                type: Number
             },
 amount: {
                type: String
             },
fromCenter: {
                type: String
             },
 fromState: {
                type: String
             },
fromInstitute: {
                type: String
             },
fromVendor: {
                type: String
             },

toCenter: {
                type: String
             },
 toState: {
                type: String
             },
toInstitute: {
                type: String
             },
toVendor: {
                type: String
             },
reason: {
                type: String
             },
             
photo: {
                type: String
             },





});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Transaction', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);
