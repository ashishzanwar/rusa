var schema = new Schema({
    name: String,
    json: {
        contact: {
            type: {}
        },
        utilization: {
            type: {}
        },
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
        allocation: Number,
        remarks: String,
        stateAsUnit: String
    },
    status: {
        type: String,
        enum: ["To Be Moderated", "Moderation Completed", "Trashed"],
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

    saveName: function (id, callback) {
        var Model = this;
        var deepSearch = "json.stateId json.districtId json.pabId json.instituteId json.keyComponentsId";
        Model.findOne({
            _id: id
        }).deepPopulate(deepSearch).exec(function (err, data) {
            name = "";
            if (data.json.stateId && data.json.stateId.name) {
                name += data.json.stateId.name + " ";
            }
            if (data.json.districtId && data.json.districtId.name) {
                name += data.json.districtId.name + " ";
            }
            if (data.json.instituteId && data.json.instituteId.name) {
                name += data.json.instituteId.name + " ";
            }
            if (data.json.pabId && data.json.pabId.name) {
                name += data.json.pabId.name + " ";
            }
            if (data.json.keyComponentsId && data.json.keyComponentsId.name) {
                name += data.json.keyComponentsId.name + " ";
            }
            data.name = name;
            data.save(callback);
        });
    },

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
                        Model.saveName(data._id);
                        // if (data.status == "Moderation Completed") {
                        //Form.compile(data);
                        // }


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
                    Model.saveName(data2._id);
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
        var json = data.json;

        var componentObj = {
            name: String,
            institute: json.instituteId._id,
            pabno: json.pabId._id,
            keycomponents: json.keyComponentsId._id,
            allocation: allocation,
            status: "Active",
            subStatus: "InTime",
            utilizationCertificates: [{
                images: json.utilization.file1,
                date: json.utilization.date1,
                amount: json.utilization.value1
            }, {
                images: json.utilization.file2,
                date: json.utilization.date2,
                amount: json.utilization.value2
            }],
            fundDelay: false
        };
        var compo = Components(componentObj);
        compo.save(function (err, comSave) {
            async.parallel({
                project: function (callback) {
                    async.each(json.projects, function (project, callback) {
                        var projectObj = {}; // create it with project;
                        Project.save(function (err, projectSave) {
                            async.each(project.projectExpenses, function (projectExp, callback) {
                                var projectExpObj = {}; // create it with projectExp;
                                ProjectExpense.save(function (err, projectExpenseSave) {
                                    async.each(projectExp.institutetoVendors, function (instituteVendor, callback) {
                                        var transactionObj = {}; // create it with instituteVendor;
                                        Transaction.save();
                                    }, function () {

                                    });
                                });
                            }, function () {

                            });
                        });
                    }, function () {

                    });
                },
                stateToInstitute: function (callback) {
                    async.each(json.stateToInstitute, function (stateTransaction, callback) {
                        var transactionObj = {}; // create it with StateTransaction;
                        Transaction.save();
                    }, function () {});
                },
                centerToState: function (callback) {
                    async.each(json.centerToState, function (centerTransaction, callback) {
                        var transactionObj = {}; // create it with CenterTransaction;
                        Transaction.save();
                    }, function () {});
                }
            }, function (err, data) {
                // callback(err, data);
            });
        });
    },
    search: function (data, status, callback) {

        var deepSearch = "json.stateId json.districtId json.pabId json.instituteId json.keyComponentsId";
        var Model = this;
        var Const = this(data);
        var maxRow = Config.maxRow;
        if (data.filter) {
            data.filter.status = status;
        } else {
            data.filter = {};
            data.filter.status = status;
        }

        var page = 1;
        if (data.page) {
            page = data.page;
        }
        var field = data.field;
        var options = {
            field: data.field,
            filters: {
                keyword: {
                    fields: ['name'],
                    term: data.keyword
                }
            },
            sort: {
                desc: 'updatedAt'
            },
            start: (page - 1) * maxRow,
            count: maxRow
        };




        var Search = Model.find(data.filter)

            .order(options)
            .deepPopulate(deepSearch)
            .keyword(options)
            .page(options, callback);

    }
};
module.exports = _.assign(module.exports, exports, model);