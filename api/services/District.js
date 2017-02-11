var schema = new Schema({
    name: {
        type: String
    },
    state: {
        type: Schema.Types.ObjectId,
        ref: 'State',
        index: true
    }


});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('District', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {

    findAllDistrict: function (data, callback) {
        District.find({
            state: data.state
        }).select("name _id").exec(function (err, found) {
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