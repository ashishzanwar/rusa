module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    search: function (req, res) {
        req.model.search(req.body, "To Be Moderated", res.callback);
    },
    searchModerated: function (req, res) {
        req.model.search(req.body, "Moderation Completed", res.callback);
    },
    searchTrashed: function (req, res) {
        req.model.search(req.body, "Trashed", res.callback);
    },
    saveName: function (req, res) {
        req.model.saveName(req.body._id, res.callback);
    }
};
module.exports = _.assign(module.exports, controller);