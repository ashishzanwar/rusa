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
        name: {
        type: String
         },
       users : [{
            type: Schema.Types.ObjectId,
            ref: 'User',
            index: true
        }],

         state : {
            type: Schema.Types.ObjectId,
            ref: 'State',
            index: true
        },

    });

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Institute', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema,'user','state','user','state'));
var model = {};
module.exports = _.assign(module.exports, exports, model);
