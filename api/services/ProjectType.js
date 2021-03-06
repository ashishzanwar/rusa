var schema = new Schema({
    name: {
        type: String
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('ProjectType', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    findAllProjectType: function (data, callback) {
        ProjectType.find().select("name _id").exec(function (err, found) {
            if (err) {
                // console.log(err);
                callback(err, null);
            } else {
                if (found) {
                    console.log("IN  STATE FOUND", found);
                    callback(null, found);
                } else {
                    callback(null, {
                        message: "No Data Found"
                    });
                }
            }
        })
    },
};
module.exports = _.assign(module.exports, exports, model);