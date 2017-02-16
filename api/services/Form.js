var schema = new Schema({
    json: {
        projects: {
            type: []
        },
        centerToState: {
            type: []
        },
        stateToInstitute: {
            type: []
        },
        stateId: {
            type: Schema.Types.ObjectId,
            ref: 'State',
            index: true
        },
        districtId: {
            type: Schema.Types.ObjectId,
            ref: 'District',
            index: true
        },
        instituteType: String,
        instituteId: {
            type: Schema.Types.ObjectId,
            ref: 'Institute',
            index: true
        },
        pabId: {
            type: Schema.Types.ObjectId,
            ref: 'Pab',
            index: true
        },
        keyComponentsId: {
            type: Schema.Types.ObjectId,
            ref: 'KeyComponents',
            index: true
        },
        allocation: Number

    },
    status: {
        type: String,
        enum: ["To Be Moderated", "Moderation Completed"],
        default: "To Be Moderated"
    }
});

schema.plugin(deepPopulate, {

    populate: {

        'json.stateId': {
            select: '_id name'
        },
        'json.districtId': {
            select: '_id name'
        },
        'json.pabId': {
            select: '_id name'
        },
        'json.instituteId': {
            select: '_id name'
        },

        'json.keyComponentsId': {
            select: '_id name'
        },

    }

});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Form', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "json.stateId json.districtId json.pabId json.instituteId json.keyComponentsId", "json.stateId json.districtId json.pabId json.instituteId json.keyComponentsId"));
var model = {

    saveData: function (data, callback) {
        var Model = this;
        var Const = this(data);
        var foreignKeys = Config.getForeignKeys(schema);
        if (data._id) {
            Model.findOne({
                _id: data._id
            }, function (err, data2) {
                if (err) {
                    callback(err, data2);
                } else if (data2) {
                    async.each(foreignKeys, function (n, callback) {
                        if (data[n.name] != data2[n.name]) {
                            Config.manageArrayObject(mongoose.models[n.ref], data2[n.name], data2._id, n.key, "delete", function (err, md) {
                                if (err) {
                                    callback(err, md);
                                } else {
                                    Config.manageArrayObject(mongoose.models[n.ref], data[n.name], data2._id, n.key, "create", callback);
                                }
                            });
                        } else {
                            callback(null, "no found for ");
                        }
                    }, function (err) {
                        data2.update(data, {
                            w: 1
                        }, callback);

                        Form.compile(data);

                    });


                } else {
                    callback("No Data Found", data2);
                }
            });
        } else {

            Const.save(function (err, data2) {
                if (err) {
                    callback(err, data2);
                } else {

                    async.each(foreignKeys, function (n, callback) {
                        Config.manageArrayObject(mongoose.models[n.ref], data2[n.name], data2._id, n.key, "create", function (err, md) {
                            callback(err, data2);
                        });
                    }, function (err) {
                        callback(err, data2);
                    });

                }
            });

        }

    },

    compile: function (data) {
        console.log("Compilation Starts");
    }


};
module.exports = _.assign(module.exports, exports, model);