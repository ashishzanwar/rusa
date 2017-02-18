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
        allocation: Number,
        remarks: String,
        stateAsUnit: String
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
        console.log("Compile data", data);
        var componentData = {};
        componentData.institute = data.json.instituteId._id;
        componentData.pabno = data.json.pabId._id;
        componentData.keycomponents = data.json.keyComponentsId._id;
        componentData.allocation = data.json.allocation;



        Components.saveData(componentData, function (err, compoData) {
            if (err) {
                console.log("Error in Components Save", err);
                callback(err, null);
            } else {

                console.log("COMPONENT DATA", compoData);
                async.parallel([

                    //projects
                    function (callback) {
                        async.each(data.json.projects, function (n, callback) {
                            console.log("DATATATAT", n);
                            var projectData = {};
                            projectData.components = compoData._id;
                            projectData.projectType = n.projectType;
                            projectData.assetType = n.assetType;
                            projectData.valueProject = n.valueProject;

                            Project.saveData(projectData, function (err, proData) {
                                if (err) {
                                    console.log("Error in Project Save", err);
                                    callback(err, null);
                                } else {

                                    async.each(data.json.centerToState, function (c) {
                                        console.log("center to state", c);
                                        var centerToState = {};


                                        centerToState.type = "Center To State";
                                        centerToState.components = compoData._id;
                                        centerToState.project = proData._id;
                                        centerToState.installment = c.installmentNo;
                                        centerToState.amount = c.amount;
                                        centerToState.remark = c.remarks;
                                        centerToState.file = c.file;
                                        centerToState.transactionSent = c.transactionSent;
                                        centerToState.transactionReceived = c.transactionRececived;

                                        Transaction.saveData(centerToState, function (err, transCenterToStateData) {
                                            if (err) {
                                                console.log("Error in Transation centerToState ");
                                                callback(err, null);
                                            } else {


                                                console.log("Transaction In centerToState ", transCenterToStateData);
                                            }
                                        });


                                    });


                                    async.each(data.json.centerToState, function (c) {
                                        console.log("center to state", c);
                                        var centerToState = {};


                                        centerToState.type = "Center To State";
                                        centerToState.components = compoData._id;
                                        centerToState.project = proData._id;
                                        centerToState.installment = c.installmentNo;
                                        centerToState.amount = c.amount;
                                        centerToState.remark = c.remarks;
                                        centerToState.file = c.file;
                                        centerToState.transactionSent = c.transactionSent;
                                        centerToState.transactionReceived = c.transactionRececived;

                                        Transaction.saveData(centerToState, function (err, transCenterToStateData) {
                                            if (err) {
                                                console.log("Error in Transation centerToState ");
                                                callback(err, null);
                                            } else {


                                                console.log("Transaction In centerToState ", transCenterToStateData);
                                            }
                                        });


                                    });


                                    async.each(data.json.stateToInstitute, function (s) {
                                        console.log("stateToInstitute", s);
                                        var stateToInstitute = {};


                                        stateToInstitute.type = "Center To State";
                                        stateToInstitute.components = compoData._id;
                                        stateToInstitute.project = proData._id;
                                        stateToInstitute.installment = s.installmentNo;
                                        stateToInstitute.amount = s.amount;
                                        stateToInstitute.remark = s.remarks;
                                        stateToInstitute.file = s.file;
                                        stateToInstitute.transactionSent = s.transactionSent;
                                        stateToInstitute.transactionReceived = s.transactionRececived;

                                        Transaction.saveData(stateToInstitute, function (err, transStateToInstitute) {
                                            if (err) {
                                                console.log("Error in Transation stateToInstitute ");
                                                callback(err, null);
                                            } else {


                                                console.log("Transaction In stateToInstitute ", transStateToInstitute);
                                            }
                                        });


                                    });


                                    async.each(n.projectExpenses, function (m, callback) {

                                        console.log("Inner projectExpenses", m);
                                        var vendorData = {};
                                        vendorData.name = m.name;
                                        vendorData.tintan = m.tintan;
                                        vendorData.pan = m.vendorpan;



                                        Vendor.saveData(vendorData, function (err, venData) {
                                            if (err) {
                                                console.log("Error in Vendor ");
                                                callback(err, null);
                                            } else {
                                                console.log("Vendor Data", venData);

                                                var projectExpense = {};
                                                projectExpense.vendor = venData._id;
                                                projectExpense.allocatedAmount = m.amount;
                                                // projectExpense.transactions = {
                                                //     id: transId
                                                // };
                                                projectExpense.project = proData._id;

                                                ProjectExpense.saveData(projectExpense, function (err, proExData) {
                                                    if (err) {
                                                        console.log("Error in Project Expense  ", err);
                                                        callback(err, null);
                                                    } else {
                                                        console.log("Project Expense Data", proExData);

                                                        var transId = [];
                                                        async.each(m.institutetoVendors, function (p, callback) {
                                                            var counter = 1;
                                                            console.log("lINSTO VENDOR", p);
                                                            var trans = {};
                                                            trans.type = "Institute To Vendor";
                                                            trans.components = compoData._id;
                                                            trans.project = proData._id;
                                                            trans.installment = p.installmentNo;
                                                            trans.amount = p.amount;
                                                            trans.remark = p.remarks;
                                                            trans.file = p.file;
                                                            trans.transactionSent = p.transactionSent;
                                                            trans.transactionReceived = p.transactionRececived;

                                                            Transaction.saveData(trans, function (err, transData) {
                                                                if (err) {
                                                                    console.log("Error in Transation Institute To Vendor ");
                                                                    callback(err, null);
                                                                } else {
                                                                    console.log("Transaction In Insti to Vendor ", counter);

                                                                    console.log("Transaction In Insti to Vendor ", transData);
                                                                    console.log("ID", transData._id);

                                                                    transId.push(transData._id);
                                                                    console.log("ID---------------->-----", transId);

                                                                    proExpense = {};
                                                                    proExpense._id = proExData._id;
                                                                    // proExpense.transactions.id   
                                                                    ProjectExpense.update({
                                                                        _id: proExData
                                                                    }, {
                                                                        $push: {
                                                                            "transactions.id": transData._id
                                                                        }
                                                                    }, function (err, peData) {
                                                                        if (err) {
                                                                            console.log("Error in Project Expense Transatioon ID ", err);
                                                                            callback(err, null);
                                                                        } else {
                                                                            console.log("Project Expense Transatioon ID", peData);
                                                                        }
                                                                    });
                                                                    // transD`.push(trans)
                                                                }
                                                            });




                                                        }, function (err) {
                                                            callback(err, "DOne");
                                                        });


                                                    }
                                                });



                                                ////

                                                //


                                            }
                                        });




                                    }, function (err) {
                                        callback(err, data3);
                                    });


                                }
                            });







                        }, function (err) {
                            callback(err, data2);
                        });
                    },

                    //states
                    function (callback) {

                    },

                    //vendor
                    function (callback) {

                    },


                ], function (err, data5) {
                    if (err) {
                        callback(err, null);
                    }
                    callback(null, data5);
                });

            }
        })



        // async.parallel([






        //     //projects
        //     function (callback) {
        //         async.each(data.json.projects, function (n, callback) {
        //             console.log("DATATATAT", n);
        //             // var projectData =n.





        //         }, function (err) {
        //             callback(err, data2);
        //         });
        //     },

        //     //states
        //     function (callback) {

        //     },

        //     //vendor
        //     function (callback) {

        //     },


        // ], function (err, data5) {
        //     if (err) {
        //         callback(err, null);
        //     }
        //     callback(null, data5);
        // });






    }
};
module.exports = _.assign(module.exports, exports, model);