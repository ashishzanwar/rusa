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
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true,
    }],

});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Center', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, 'user', 'user'));
var model = {

    addUserToCenter: function (data, callback) {

        console.log(data);
        Center.findOneAndUpdate({
            _id: data._id
        }, {
            $push: {
                users: data.user_id
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

    removeUserFromCenter: function (data, callback) {

        console.log(data);
        Center.findOneAndUpdate({
            _id: data._id
        }, {
            $pull: {
                users: data.user_id
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


        findOneCenter: function (data, callback) {

        console.log(data);
        Center.findOne({
            _id: data._id
        }).populate("users").exec(function (err, found) {

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


  


};
module.exports = _.assign(module.exports, exports, model);