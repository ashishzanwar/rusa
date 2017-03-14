module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {


    findOneVendorUser: function (req, res) {
        if (req.body) {
            Vendor.findOneVendorUser(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },
    addUserToVendor: function (req, res) {
        if (req.body) {
            Vendor.addUserToVendor(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    removeUserFromVendor: function (req, res) {
        if (req.body) {
            Vendor.removeUserFromVendor(req.body, res.callback);
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
            Vendor.updateUser(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },


    // add vendors from application
    addVendor: function (req, res) {
        if (req.body) {
            Vendor.addVendor(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },

    // get all vendor list for vendor list in navigation menu & project--> add expense --> select vendor
    // use same API for both 
    getAllVendorList: function (req, res) {
        if (req.body) {
            Vendor.getAllVendorList(req.body, res.callback);
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