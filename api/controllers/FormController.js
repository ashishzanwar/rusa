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
    }
};
module.exports = _.assign(module.exports, controller);