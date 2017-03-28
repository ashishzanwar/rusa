var schema = new Schema({
    version: {
        type: String
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    states: {
        type: Schema.Types.ObjectId,
        ref: 'States',
        required: true,
        index: true
    },
    answerList: [{
        category: String,
        question: String,
        points: String,
        answers: [{
            answer: String,
            point: String,
            isSelected: Boolean
        }]
    }]

});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('AnsweredRefor​m', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);