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
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        index: true
    },
    installment: {
        type: Number
    },
    subInstallment: {
        type: Number
    },
    amount: {
        type: Number
    },
    fromCenter: {
        type: Schema.Types.ObjectId,
        ref: 'Center',
        index: true
    },
    fromState: {
        type: Schema.Types.ObjectId,
        ref: 'State',
        index: true
    },
    fromInstitute: {
        type: Schema.Types.ObjectId,
        ref: 'Institute',
        index: true
    },
    fromVendor: {
        type: String
    },
    toCenter: {
        type: Schema.Types.ObjectId,
        ref: 'Center',
        index: true
    },
    toState: {
        type: Schema.Types.ObjectId,
        ref: 'State',
        index: true
    },
    toInstitute: {
        type: Schema.Types.ObjectId,
        ref: 'Institute',
        index: true
    },
    toVendor: {
        type: String
    },
    reason: {
        type: String
    },
    photos: [{
        tags: String,
        photo: String
    }]
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('TransactionDue', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, 'project center institute state', 'project center institute state'));
var model = {

    saveComponentsPhotos: function (data, callback) {

        console.log(data);
        TransactionDue.update({
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

    removeComponentsPhotos: function (data, callback) {

        console.log("DATA", data);
        TransactionDue.update({

            "_id": data._id
        }, {
            $pull: {
                photos: {

                    photo: data.photo
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
        console.log("DATA", data);
    },

    findOneComponents: function (data, callback) {


        TransactionDue.findOne({
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

    saveComponent: function (data, callback) {
        console.log("inside saveComponent of Components, data:", data);

        TransactionDue.saveData(data, function (err, addedComponent) {
            if (err) {
                callback(err, null);
            } else if (_.isEmpty(addedComponent)) {
                callback(null, "No data founds");
            } else {
                console.log("addComponent", addedComponent);

                // note: we are creating a project with component ID only 
                // because we want all component in project table when we fire getProjectReport (for dashboard)
                var proExObj = {
                    components: addedComponent._id
                };

                Project.saveData(proExObj, function (err, addedProEx) {
                    if (err) {
                        callback(err, null);
                    } else if (_.isEmpty(addedProEx)) {
                        callback(null, "No data founds");
                    } else {
                        console.log("addedProEx", addedProEx);
                        callback(null, addedProEx);
                    }
                });
                // callback(null, addedProject);
            }
        });
    },

};
module.exports = _.assign(module.exports, exports, model);