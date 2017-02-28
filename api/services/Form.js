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
        console.log("##############inside saveData of form.js#################");
        var Model = this;
        var Const = this(data);
        var foreignKeys = Config.getForeignKeys(schema);
        console.log("######### inside saveData  ###########", data);

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
                        //     Form.compile(data);
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

    compile: function (data, callback) {
        var json = {};
        json = data.json;
        if (json.instituteId && json.pabId && json.keyComponentsId) {
            if (!json.utilization) {
                json.utilization = {};
            }
            console.log("##############inside compile of form.js#################", json);
            var componentObj = {
                name: "newComponent",
                // institute: json.instituteId._id,        // we are not getting it don't know why
                institute: json.instituteId,
                pabno: json.pabId,
                keycomponents: json.keyComponentsId,
                allocation: json.allocation,
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
                if (err) {
                    callback();
                } else {
                    async.parallel({
                        project: function (callback) {
                            async.each(json.projects, function (project, callback) {
                                // project schema object
                                if (_.isEmpty(project.assetType)) {
                                    project.assetType = undefined;
                                }
                                if (_.isEmpty(project.projectType)) {
                                    project.projectType = undefined;
                                }
                                console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$ project is here, we have to look for compnent_id here $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$", project);
                                var projectObj = {
                                    name: "ProjectName_Ashish",
                                    components: comSave._id, //not available in json
                                    projectType: project.projectType,
                                    assetType: project.assetType,
                                    valueOfProject: project.valueProject,
                                    photos: [{
                                        photo: project.photo1
                                    }, {
                                        photo: project.photo2
                                    }],
                                    status: "Active",
                                    dueDate: project.dueDate
                                };

                                console.log(projectObj);
                                // var projectObjSave = Project(projectObj);
                                Project.saveData(projectObj, function (err, projectSave) {
                                    if (err) {
                                        console.log("DAMM PROJECT EEROR", err);
                                    } else {
                                        console.log("######### projectSave ########", projectSave);

                                        async.each(project.projectExpenses, function (projectExp, callback) {
                                            // ProjectExpense schema object
                                            console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$ projectExp is here, we have to look for compnent_id here $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$", projectExp);

                                            var projectExpObj = {
                                                // vendor: projectExp.name, //id is there in database & we need it in transaction as well
                                                project: projectSave._id,
                                                allocatedAmount: projectExp.amount,
                                                vendorpan: projectExp.vendorpan,
                                                tintan: projectExp.tintan,
                                                orderIssueDate: projectExp.orderIssueDate,
                                                orderDueDate: projectExp.orderDueDate,
                                                // orderFile: projectExp.orderFile
                                            };

                                            ProjectExpense.saveData(projectExpObj, function (err, projectExpenseSave) {
                                                if (err) {
                                                    console.log("DAMM ProjectExpense EEROR", err);
                                                } else {
                                                    console.log("####### ProjectExpense Save #######", projectExpenseSave);

                                                    async.each(projectExp.institutetoVendors, function (instituteVendor, callback) {

                                                        // institutetoVendors
                                                        // transaction schema object for type institute to vendor
                                                        var transactionObj = {
                                                            // we need project id, institute id & vendor id      

                                                            name: instituteVendor.vendorName, // it is vendor name or institue name? 
                                                            installment: instituteVendor.installmentNo,
                                                            amount: instituteVendor.amount,
                                                            type: "Institute To Vendor",
                                                            remarks: instituteVendor.remarks,
                                                            file: instituteVendor.file,
                                                            transactionSent: instituteVendor.transactionSent,
                                                            transactionReceived: instituteVendor.transactionRecieved,

                                                        };
                                                        // var transactionObjSave = Project(transactionObj);
                                                        // transactionObjSave.save();
                                                        Transaction.saveData(transactionObj, function (err, instToVen) {
                                                            if (err) {
                                                                console.log('#### error inside saveData of project expense ####');
                                                            } else if (instToVen) {
                                                                console.log('#### project expense data stored successfully ####');
                                                            }
                                                        });
                                                        //callback();

                                                    }, function (err) { // 3rd asynch error & data handling
                                                        if (err) {
                                                            console.log(err);
                                                            console.log('#### error inside 3rd async.each of institutetoVendors ####');
                                                        } else {
                                                            console.log('#### Done with 3rd async institutetoVendors data ####');
                                                            callback();
                                                        }
                                                    });

                                                }
                                            });


                                            //         // ProjectExpense.save();
                                            //         callback();

                                        }, function (err) { // 2nd asynch error & data handling
                                            if (err) {
                                                console.log(err);
                                                console.log('#### error inside 2nd async.each  of projectExpenses ####');
                                            } else {
                                                console.log('#### Done with 2nd async projectExpenses data stored successfully ####');
                                            }
                                        });

                                    }
                                });




                                // callback();


                            }, function (err) { //1st asynch error & data handling
                                if (err) {
                                    console.log('#### error inside 1st async async.each  of projects ####');
                                    console.log(err);
                                } else {
                                    console.log('####  Done with 1st async projects data stored successfully ####');
                                }
                            });
                        },
                        stateToInstitute: function (callback) {
                            async.each(json.stateToInstitute, function (stateTransaction, callback) {
                                var transactionObj = {
                                    name: stateTransaction.vendorName, // it is state name or institue name? 
                                    installment: stateTransaction.installmentNo,
                                    amount: stateTransaction.amount,
                                    type: "State To Intitute",
                                    remarks: stateTransaction.remarks,
                                    file: stateTransaction.file,
                                    transactionSent: stateTransaction.transactionSent,
                                    transactionReceived: stateTransaction.transactionRecieved,
                                }; // create it with StateTransaction;
                                // Transaction.save();

                                Transaction.saveData(transactionObj, function (err, instToVen) {
                                    if (err) {
                                        console.log('#### error inside saveData of stateToInstitute  ####');
                                    } else if (instToVen) {
                                        console.log('####  stateToInstitute data stored successfully ####');
                                    }
                                });
                            }, function (err) {
                                if (err) {
                                    console.log(err);
                                    console.log('#### error inside asynch.each of stateToInstitute ####');
                                } else {
                                    console.log('#### Done with stateToInstitute data ####');
                                }
                            });
                        },
                        centerToState: function (callback) {
                            async.each(json.centerToState, function (centerTransaction, callback) {
                                var transactionObj = {
                                    name: centerTransaction.vendorName, // it is vendor name or institue name? 
                                    installment: centerTransaction.installmentNo,
                                    amount: centerTransaction.amount,
                                    type: "State To Intitute",
                                    remarks: centerTransaction.remarks,
                                    file: centerTransaction.file,
                                    transactionSent: centerTransaction.transactionSent,
                                    transactionReceived: centerTransaction.transactionRecieved,
                                }; // create it with CenterTransaction;
                                // Transaction.save();
                                Transaction.saveData(transactionObj, function (err, instToVen) {
                                    if (err) {
                                        console.log('#### error inside saveData of centerToState ####');
                                    } else if (instToVen) {
                                        console.log('#### centerToState expense data stored successfully ####');
                                    }
                                });
                            }, function (err) {
                                if (err) {
                                    console.log(err);
                                    console.log('#### error inside asynch.each of centerToState ####');
                                } else {
                                    console.log('#### Done with centerToState data ####');
                                }
                            });
                        }
                    }, function (err, data) {
                        if (callback) {
                            callback(err, data);
                        }
                    });
                }

            });
        } else {
            callback();
        }


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

    },

};
module.exports = _.assign(module.exports, exports, model);