module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {

    getTransactionReport: function (req, res) {
        if (req.body) {
            Transaction.getTransactionReport(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },

    // Mobile Application API
    componentOverview: function (req, res) {
        if (req.body) {
            Transaction.componentOverview(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },
    componentFundflow: function (req, res) {
        if (req.body) {
            Transaction.componentFundflow(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },
    componentProjects: function (req, res) {
        if (req.body) {
            Transaction.componentProjects(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },
    componentMedia: function (req, res) {
        if (req.body) {
            Transaction.componentMedia(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },
};
module.exports = _.assign(module.exports, controller);