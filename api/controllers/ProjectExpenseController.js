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

    getAllprojectOfComponent: function (req, res) {
        // console.log("#############$$$$$ inside getAllprojectOfComponent controller  $$$$$#############");
        if (req.body) {
            ProjectExpense.getAllprojectOfComponent(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },

    // mobile application API for Component --> projects screen
    componentProjects: function (req, res) {
        if (req.body) {
            ProjectExpense.componentProjects(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },

    // mobile application API for Component --> projects --> project --> add expense --> update projectExpense table
    vendorAllocation: function (req, res) {
        if (req.body) {
            ProjectExpense.vendorAllocation(req.body, res.callback);
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