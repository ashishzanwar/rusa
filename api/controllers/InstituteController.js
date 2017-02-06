module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {

    saveProject: function (req, res) {
        if (req.body) {
            req.body.myCart = req.session.cart;
            // req.body.myCart.package = req.session.cart.package;
            // req.body.myCart.activities = req.session.cart.activities;
            // req.body.myCart.whatshot = req.session.cart.whatshot;
            Project.saveProject(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },

    removeUserFromInstitute: function (req, res) {
        if (req.body) {
            Institute.removeUserFromInstitute(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },
 updateUser: function (req, res) {
        if (req.body) {
            Institute.updateUser(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

  findOneInstituteUser: function (req, res) {
        if (req.body) {
            Institute.findOneInstituteUser(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },
    findOneInstitute: function (req, res) {
        if (req.body) {
            Institute.findOneInstitute(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    removeProject: function (req, res) {
        if (req.body) {
            Institute.removeProject(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },


addUserToInstitute: function (req, res) {
        if (req.body) {
            Institute.addUserToInstitute(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

     addNewProject: function (req, res) {
        if (req.body) {
            Project.addNewProject(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

     getInstitute: function (req, res) {
        if (req.body) {
            Project.getInstitute(req.body, res.callback);
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