module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    saveComponentsPhotos: function (req, res) {
        if (req.body) {
            Components.saveComponentsPhotos(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    removeComponentsPhotos: function (req, res) {
        if (req.body) {
            Components.removeComponentsPhotos(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    findOneComponents: function (req, res) {
        if (req.body) {
            Components.findOneComponents(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    findAllComponents: function (req, res) {
        if (req.body) {
            Components.findAllComponents(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    findDashBoardData: function (req, res) {
        // console.log("#################### All dashboard data ###################");
        // console.log('request is :', req.body);
        if (req.body) {
            Components.findDashBoardData(req.body, res.callback);
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