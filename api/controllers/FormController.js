module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    search: function (req, res) {
        req.model.search(req.body, "To Be Moderated", res.callback);
    },
    searchModerated: function (req, res) {
        req.model.search(req.body, "Moderation Completed", res.callback);
    },
    searchTrashed: function (req, res) {
        req.model.search(req.body, "Trashed", res.callback);
    },
    saveName: function (req, res) {
        req.model.saveName(req.body._id, res.callback);
    },
    findAllSave: function (req, res) {
        Form.find({}).exec(function (err, data) {
            var retVal = [];
            async.each(data, function (n, callback) {
                Form.saveName(n._id, function (err2, data2) {
                    callback(null);
                    if (err2) {
                        //n.remove();
                        retVal.push({
                            id: n._id,
                            err: err2,
                            data: data2
                        });
                    }

                });
            }, function (err) {
                if (err) {
                    res.callback(err);
                } else {
                    res.callback(err, retVal);
                }
            });
        });
    },
    compileAll: function (req, res) {
        Form.find({
            status: "Moderation Completed"
        }).lean().exec(function (err, data) {
            if (err) {
                res.callback(err);
            }
            if (data.length === 0) {
                res.callback();
            } else {
                async.each(data, function (n, callback) {
                    Form.compile(n, callback);
                }, function (data) {
                    res.callback(err, data);
                });
            }
        });
    },

    // to change the status of all form
    changeStatusOfAllForm: function (req, res) {
        Form.update({
            status: "Moderation Completed"
        }, {
                status: "To Be Moderated"
            }, { multi: true }).exec(function (err, data) {
                if (err) {
                    res.callback(err);
                } else if (_.isEmpty(data)) {
                    res.callback(null, "No Data Found");
                } else {
                    res.callback(null, data);
                }

            });
    },


    checkVendor: function (req, res) {
        if (req.body) {
            Form.checkVendor(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    }
};
module.exports = _.assign(module.exports, controller);