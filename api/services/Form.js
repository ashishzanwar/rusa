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
// schema.plugin(timestamps);
// const Ajv = require('ajv');
// const ajv = new Ajv({ allErrors: true });
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
        console.log("######### saveData ###########", data);

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
                        // }`
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

    checkVendor: function (data) {
        console.log("##@@@@## inside checkVendor##@@@##", data);

        Vendor.findOne({ "pan": data }, function (err, vendor) {
            if (err) {
                console.log("##@@@@## inside  check Vendor err ##@@@@##");
                // callback(err, null);
                return err;
            } else if (_.isEmpty(vendor)) {
                console.log("##@@@@## inside  check Vendor is empty ##@@@@##");
                // callback(null, "No Data Found");
                return "No Data Found";
            } else {
                console.log("##@@@@## inside  check success ##@@@@##", vendor);
                // callback(null, vendor);
                return vendor;
            }

        })
    },

    compile: function (data, callback) {
        console.log("##############inside compile of form.js#################", data);

        var json = {};
        json = data.json;

        var componentObj = {
            name: json.keyComponentsId.name,
            // institute: json.instituteId._id,        // we are not getting it don't know why
            institute: json.instituteId._id,
            pabno: json.pabId._id,
            keycomponents: json.keyComponentsId._id,
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
            console.log("$$$$$$$$$$ comSave data is here $$$$$$$$$$", comSave);

            async.parallel({
                project: function (callback) {
                    console.log("*********** inside project of async *******************");
                    async.eachSeries(json.projects, function (project, callback) {

                        var projectObj = {
                            // name: comSave.name,
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
                            dueDate: project.dueDate,
                            remarks: project.remarks
                        };

                        Project.saveData(projectObj, function (err, projectSave) {
                            if (err) {
                                console.log("********** Error in project saveData **********", err);
                            } else {
                                console.log("********** Following project Data submitted **********", projectSave);

                                async.eachSeries(project.projectExpenses, function (projectExp, callback) {
                                    var vendorObject = {};
                                    var tempVal = 0;

                                    // check whether vendor is already available or not on the base of PAN
                                    //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^//
                                    Vendor.findOne({ "pan": projectExp.vendorpan }, function (err, vendor) {
                                        if (err) {
                                            console.log("##@@@@## inside  check Vendor err ##@@@@##");
                                            // vendorObject = {
                                            //     name: projectExp.name,
                                            //     pan: projectExp.vendorpan,
                                            //     tintan: projectExp.tintan
                                            // };
                                        } else {
                                            if (_.isEmpty(vendor)) {
                                                // vendor is not there
                                                console.log("##@@@@## inside  check Vendor is empty ##@@@@##");
                                                vendorObject = {
                                                    // _id: vendor._id,
                                                    name: projectExp.name,
                                                    pan: projectExp.vendorpan,
                                                    tintan: projectExp.tintan
                                                };
                                                console.log("#@@ inside check empty1 & vendorObject is:", vendorObject);
                                            } else {
                                                // vendor is already available
                                                console.log("##@@@@## inside  check success ##@@@@##", vendor);
                                                vendorObject = {
                                                    _id: vendor._id,
                                                    name: projectExp.name,
                                                    // pan: projectExp.vendorpan,
                                                    tintan: projectExp.tintan
                                                };
                                                tempVal++;
                                                console.log("#@@ inside check success 1 & vendorObject is:", vendorObject);
                                            }

                                            Vendor.saveData(vendorObject, function (err, vendorSave) {
                                                if (err) {
                                                    console.log("********** Error in Vendor saveData **********", err);
                                                } else {
                                                    console.log("********** Following Vendor Data submitted **********", vendorSave);

                                                    var projectExpObj = {
                                                        // vendor: projectExp.name, //id is there in database & we need it in transaction as well
                                                        // vendor: vendorSave._id,
                                                        project: projectSave._id,
                                                        allocatedAmount: projectExp.amount,
                                                        orderIssueDate: projectExp.orderIssueDate,
                                                        orderDueDate: projectExp.orderDueDate,
                                                        orderFile: projectExp.orderFile
                                                    };

                                                    if (tempVal == 1) {
                                                        projectExpObj.vendor = vendor._id;
                                                    } else {
                                                        projectExpObj.vendor = vendorSave._id;
                                                    }

                                                    ProjectExpense.saveData(projectExpObj, function (err, projectExpenseSave) {
                                                        if (err) {
                                                            console.log("********** Error in ProjectExpense saveData **********", err);
                                                        } else {
                                                            console.log("********* Following ProjectExpense Data submitted **********", projectExpenseSave);

                                                            async.eachSeries(projectExp.institutetoVendors, function (instituteVendor, callback) {

                                                                var transactionObj = {
                                                                    components: comSave._id,
                                                                    name: projectExpenseSave.vendorName,
                                                                    installment: instituteVendor.installmentNo,
                                                                    amount: instituteVendor.amount,
                                                                    type: "Institute To Vendor",
                                                                    remarks: instituteVendor.remarks,
                                                                    file: instituteVendor.file,
                                                                    transactionSent: instituteVendor.transactionSent,
                                                                    transactionReceived: instituteVendor.transactionRecieved,
                                                                };

                                                                Transaction.saveData(transactionObj, function (err, instToVen) {
                                                                    if (err) {
                                                                        console.log("********** Error in Transaction saveData **********", err);
                                                                    } else if (instToVen) {
                                                                        console.log("********** Following Transaction from Institute To Vendor is submitted **********", instToVen);


                                                                        projectExpenseSave.transaction.push(instToVen._id); // current transaction id
                                                                        projectExpenseSave.save(function (err, updateTransProjectExpens) {
                                                                            if (err) {
                                                                                console.log("********** Error in ProjectExpense saveData (when updating transaction in project table) **********", err);
                                                                            } else {
                                                                                console.log("********** Following ProjectExpense Data (updating transaction in ProjectExpense) submitted **********", updateTransProjectExpens);

                                                                                comSave.amountUtilized.push(instituteVendor.amount);
                                                                                // comSave.amountUtilized.push(instToVen._id);
                                                                                comSave.save(function (err, updateAmountUtilizedComp) {
                                                                                    if (err) {
                                                                                        console.log("********** Error in comSave save (when  updating transaction in project table) **********", err);
                                                                                    } else {
                                                                                        console.log("********** Following comSave save (updating transaction in ProjectExpense) submitted **********", updateAmountUtilizedComp);
                                                                                    }
                                                                                    callback();
                                                                                });
                                                                            }

                                                                        });

                                                                        // comSave.amountUtilized.push(instituteVendor.amount);
                                                                        // // comSave.amountUtilized.push(instToVen._id);
                                                                        // comSave.save(function (err, updateAmountUtilizedComp) {
                                                                        //     if (err) {
                                                                        //         console.log("********** Error in ProjectExpense saveData (when updating transaction in project table) **********", err);
                                                                        //     } else {
                                                                        //         console.log("********** Following ProjectExpense Data (updating transaction in ProjectExpense) submitted **********", updateAmountUtilizedComp);
                                                                        //     }
                                                                        //     callback();
                                                                        // });
                                                                        // callback();
                                                                    }
                                                                });



                                                            }, function (err) {
                                                                if (err) {
                                                                    console.log(" ######## Following error in async.each of institutetoVendors ######## ", err);
                                                                } else {
                                                                    console.log(" ####### Data of institutetoVendors is stored successfully ####### ");
                                                                    callback();
                                                                }
                                                            });

                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    })
                                    //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^//



                                }, function (err) {
                                    if (err) {
                                        console.log(err);
                                        console.log(" ######## Following error in async.each of projectExpenses ######## ", err);
                                    } else {
                                        console.log(" ####### Data of projectExpenses is stored successfully ####### ");
                                        callback();
                                    }
                                });
                                // callback();
                            }
                        });


                    }, function (err) {
                        if (err) {
                            console.log(err);
                            console.log(" ######## Following error in async.each of project ######## ", err);
                        } else {
                            console.log(" ####### Data of project is stored successfully ####### ");
                            // callback();
                        }
                    });
                },
                stateToInstitute: function (callback) {
                    async.each(json.stateToInstitute, function (stateTransaction, callback) {
                        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$ stateTransaction is here, we have to look for transaction id here $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$", stateTransaction);
                        var transactionObj = {
                            components: comSave._id,
                            name: stateTransaction.vendorName, // it is state name or institue name? 
                            installment: stateTransaction.installmentNo,
                            amount: stateTransaction.amount,
                            type: "State To Institute",
                            remarks: stateTransaction.remarks,
                            file: stateTransaction.file,
                            transactionSent: stateTransaction.transactionSent,
                            transactionReceived: stateTransaction.transactionRecieved,
                        }; // create it with StateTransaction;
                        // Transaction.save();

                        Transaction.saveData(transactionObj, function (err, instToVen) {
                            if (err) {
                                console.log('#### error inside saveData of stateToInstitute  ####', err);
                            } else if (instToVen) {
                                console.log('####  stateToInstitute data stored successfully ####');
                                console.log('####  instituteToVendor data ####', instToVen);
                                callback();
                            }
                        });
                    }, function (err) {
                        if (err) {
                            console.log(err);
                            console.log('#### error inside asynch.each of stateToInstitute ####', err);
                        } else {
                            console.log('#### Done with stateToInstitute data ####');
                            callback();
                        }
                    });
                },
                centerToState: function (callback) {
                    async.each(json.centerToState, function (centerTransaction, callback) {
                        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$ centerTransaction is here, we have to look for transaction id here $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$", centerTransaction);
                        var transactionObj = {
                            components: comSave._id,
                            name: centerTransaction.vendorName, // it is vendor name or institue name? 
                            installment: centerTransaction.installmentNo,
                            amount: centerTransaction.amount,
                            type: "Center To State",
                            remarks: centerTransaction.remarks,
                            file: centerTransaction.file,
                            transactionSent: centerTransaction.transactionSent,
                            transactionReceived: centerTransaction.transactionRecieved,
                        }; // create it with CenterTransaction;
                        // Transaction.save();
                        Transaction.saveData(transactionObj, function (err, cenToState) {
                            if (err) {
                                console.log('#### error inside saveData of centerToState ####');
                            } else if (cenToState) {
                                console.log('#### centerToState expense data stored successfully ####');
                                console.log('####  instituteToVendor data ####', cenToState);
                                callback();
                            }
                        });
                    }, function (err) {
                        if (err) {
                            console.log(err);
                            console.log('#### error inside asynch.each of centerToState ####');
                        } else {
                            console.log('#### Done with centerToState data ####');
                            callback();
                        }
                    });
                }
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

    },

};
module.exports = _.assign(module.exports, exports, model);