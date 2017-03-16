module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {

    saveProject: function (req, res) {
        if (req.body) {
            //  req.body.myCart = req.session.cart;
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

    findAllState: function (req, res) {
        if (req.body) {
            Project.findAllState(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    saveProjectPhotos: function (req, res) {
        if (req.body) {
            Project.saveProjectPhotos(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    removeProjectPhotos: function (req, res) {
        if (req.body) {
            Project.removeProjectPhotos(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },

    findOneProject: function (req, res) {
        if (req.body) {
            Project.findOneProject(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },

    getProjectReport: function (req, res) {
        if (req.body) {
            Project.getProjectReport(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },

    // mobile API component--> projects --> Project --> update --> status
    changeStatus: function (req, res) {
        console.log("data", req.body);
        if (req.body) {
            Project.changeStatus(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },

    updateProject: function (req, res) {
        console.log("data", req);
        if (req.body) {
            Project.updateProject(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },

    // mobile API component --> projects --> project --> notes --> addNew notes
    // data --> project_id, componentId, from, added_by, text  
    addProjectNotes: function (req, res) {
        // console.log("#################### inside addProjectNotes: ###########################", req.body);
        if (req.body) {
            Project.addProjectNotes(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
            // res.callback("Invalid Data");
        }
    },

    // mobile API component --> project --> notes 
    // data --> project_id 
    getProjectAllNotes: function (req, res) {
        console.log("inside getProjectAllNotes: ", req.body);
        if (req.body) {
            Project.getProjectAllNotes(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
            // res.callback("Invalid Data");
        }
    },


    // mobile API component --> projects --> project --> photos --> addNew photos
    // data --> project_id, componentId
    addProjectPhotos: function (req, res) {
        console.log("inside addProjectPhotos: ", req.body);
        if (req.body) {
            Project.addProjectPhotos(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },

    getProjectAllPhotos: function (req, res) {
        // console.log("inside getProjectAllNotes: ", req.body);
        if (req.body) {
            Project.getProjectAllPhotos(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },

    getComponentAllPhotos: function (req, res) {
        // console.log("inside getProjectAllNotes: ", req.body);
        if (req.body) {
            Project.getComponentAllPhotos(req.body, res.callback);
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