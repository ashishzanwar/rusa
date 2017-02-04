module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {

    findAllUser: function (req, res) {
        if (req.body) {
            User.findAllUser(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    addUserToCenter: function (req, res) {
        if (req.body) {
            Center.addUserToCenter(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    removeUserFromCenter: function (req, res) {
        if (req.body) {
            Center.removeUserFromCenter(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },
    findOneCenter: function (req, res) {
        if (req.body) {
            Center.findOneCenter(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    findAllUser: function (req, res) {
        if (req.body) {
            User.findAllUser(req.body, res.callback);
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
            Center.updateUser(req.body, res.callback);
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