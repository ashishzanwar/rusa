module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {

    saveProjectExpensePhotos: function (req, res) {
        if (req.body) {
            ProjectExpense.saveProjectExpensePhotos(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    findOneProjectExpense: function (req, res) {
        if (req.body) {
            ProjectExpense.findOneProjectExpense(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    updateProjectExpensePhotos: function (req, res) {
        if (req.body) {
            ProjectExpense.updateProjectExpensePhotos(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },


    removeProjectExpensePhotos: function (req, res) {
        if (req.body) {
            ProjectExpense.removeProjectExpensePhotos(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

};
module.exports = _.assign(module.exports, controller);