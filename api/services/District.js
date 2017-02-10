var schema = new Schema({
    name: {
        type: String
    },
    state: {
        type: Schema.Types.ObjectId,
        ref: 'State',
        index: true
    },
    district: {
        type: Schema.Types.ObjectId,
        ref: 'District',
        index: true
    }

});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('District', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);