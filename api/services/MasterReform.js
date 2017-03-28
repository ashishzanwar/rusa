var schema = new Schema({
    category: {
        type: String,
        required: true,
        unique: true,
    },
    questionAnswerList: [{
        question: String,
        points: String,
        answers: [{
            answer: String,
            points: String
        }]
    }]
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('MasterReform', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);