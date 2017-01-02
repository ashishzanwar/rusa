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
            })
        }
    },
   
  findOneProject: function (req, res) {
        if (req.body) {
            Project. findOneProject(req.body, res.callback);
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
