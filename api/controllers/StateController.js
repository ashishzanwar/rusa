module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {

    findOneState: function (req, res) {
        if (req.body) {
            State.findOneState(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },


    findOneStateUser: function (req, res) {
        if (req.body) {
            State.findOneStateUser(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    findState: function (req, res) {
        if (req.body) {
            State.findState(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    


    addUserToState: function (req, res) {
        if (req.body) {
            State.addUserToState(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },


    findAllState: function (req, res) {
        if (req.body) {
            State.findAllState(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },
    findInstitute: function (req, res) {
        if (req.body) {
            Institute.findInstitute(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },
    removeInstitute: function (req, res) {
        if (req.body) {
            Institute.removeInstitute(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    removeUserFromState: function (req, res) {
        if (req.body) {
            State.removeUserFromState(req.body, res.callback);
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
            State.updateUser(req.body, res.callback);
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