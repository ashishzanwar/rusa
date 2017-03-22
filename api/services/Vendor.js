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
        username: {
                type: String
        },
        email: {
                type: String,
                validate: validators.isEmail()
        },
        mobile: {
                type: String,
                default: ""
        },
        pan: {
                type: String,
                required: true,
                unique: true
        },
        tintan: String,

        organization: {
                type: String
        },

        // users: [{
        //         type: Schema.Types.ObjectId,
        //         ref: 'User',
        //         index: true,
        // }]

});

schema.plugin(deepPopulate, {
        populate: {
                'users': {
                        select: 'name _id'
                }
        }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Vendor', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {

        addUserToVendor: function (data, callback) {

                console.log(data);
                Vendor.findOneAndUpdate({
                        _id: data._id
                }, {
                                $addToSet: {
                                        // $push: {
                                        users: data.user_id
                                        // }
                                },
                        }, {
                                upsert: true
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

        findOneVendorUser: function (data, callback) {

                console.log(data);
                Vendor.findOne({
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
        removeUserFromVendor: function (data, callback) {

                console.log(data);
                Vendor.findOneAndUpdate({
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

        updateUser: function (data, callback) {
                console.log("DATA", data);
                Vendor.update({
                        _id: data._id,
                        "users": data.user_id
                }, {
                                $set: {
                                        // $set: {
                                        "users.$": data.change_id
                                        // }
                                }
                        }, function (err, data) {
                                if (err) {
                                        console.log(err);
                                        callback(err, null);
                                } else if (data) {
                                        callback(null, data);
                                } else {
                                        callback(null, "Invalid data");
                                }
                        });

        },


        //called from addVendor
        addVendorToState: function (data, callback) {
                State.findOneAndUpdate({ _id: data.added_by_id }, { $push: { vendor: data.vendor } }).exec(function (err, mydata) {
                        if (err) {
                                console.log("inside addVendorToState err");
                                callback(null, err);
                        } else {
                                console.log("inside addVendorToState success", mydata);
                                callback(null, mydata);
                        }
                });
        },

        //called from addVendor
        addVendorToInstitute: function (data, callback) {
                Institute.findOneAndUpdate({ _id: data.added_by_id }, { $push: { vendor: data.vendor } }).exec(function (err, mydata) {
                        if (err) {
                                console.log("inside addVendorToInstitute err");
                        } else {
                                console.log("inside addVendorToInstitute success", mydata);
                                callback(null, mydata);
                        }
                });
        },

        // data --> compnay_name, contact_person, pan_no, mobile, email, added_by(state,institute), added_by_id
        addVendor: function (data, callback) {
                // console.log("inside addVEndor & data is :", data);
                Vendor.find({
                        pan: data.pan_no
                }).select("_id").exec(function (err, ProVen) {

                        console.log("ProVen 1st  :", ProVen);

                        if (err) {
                                callback(err, null);
                        } else {
                                // if ProVen is empty/null means vendor is not there in vendor table, then add it in vendor table & update vendor id in state or Institute table as well 
                                if (_.isEmpty(ProVen)) {
                                        console.log("inside empty proVen");
                                        // save it 
                                        vendorObj = {
                                                name: data.contact_person,
                                                username: data.contact_person,
                                                email: data.email,
                                                mobile: data.mobile,
                                                pan: data.pan_no,
                                                organization: data.compnay_name
                                        }
                                        Vendor.saveData(vendorObj, function (err, getAddedVendor) {
                                                console.log("inside vendor saveData getAddedVendor", getAddedVendor);
                                                if (err) {
                                                        callback(null, err);
                                                } else {
                                                        if (_.isEmpty(getAddedVendor)) {
                                                                callback(null, "No Data Found");
                                                        } else {
                                                                data.vendor = getAddedVendor._id;

                                                                // update getAddedVendor._id into state or intitute
                                                                if (data.added_by == "State") {
                                                                        Vendor.addVendorToState(data, callback);
                                                                        // callback(null, getAddedVendor);
                                                                } else if (data.added_by == "Institute") {
                                                                        Vendor.addVendorToInstitute(data, callback);
                                                                        // callback(null, getAddedVendor);
                                                                }
                                                        }
                                                        // send created vendor
                                                }
                                                // callback(null, getAddedVendor);
                                        });
                                } else {
                                        data.vendor = ProVen[0]._id;
                                        console.log("data if vendor available", data);
                                        if (data.added_by == "State") {
                                                Vendor.addVendorToState(data, callback);
                                        } else if (data.added_by == "Institute") {
                                                Vendor.addVendorToInstitute(data, callback);
                                        }

                                        callback(null, ProVen);
                                }
                        }
                })
        },

        // data --> type (state,institute), type_id
        // make sure type is in proper format State & Institute
        getAllVendorList: function (data, callback) {
                console.log("data type:", data);

                global[data.type].findOne({
                        _id: data.type_id
                }).populate("vendor").exec(function (err, found) {
                        console.log("found", found);
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

        }

};
module.exports = _.assign(module.exports, exports, model);