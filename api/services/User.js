var schema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        validate: validators.isEmail()
    },
    dob: {
        type: Date
    },
    photo: {
        type: String,
        default: ""
    },
    username: {
        type: String
    },
    password: {
        type: String,
        default: ""
    },
    forgotPassword: {
        type: String,
        default: ""
    },
    mobile: {
        type: String,
        default: ""
    },
    otp: {
        type: String,
        default: ""
    },
    accessToken: {
        type: [String],
        index: true
    },


    googleAccessToken: String,
    googleRefreshToken: String,
    oauthLogin: {
        type: [{
            socialId: String,
            socialProvider: String
        }],
        index: true
    },
    accessLevel: {
        type: String,
        default: "User",
        enum: ['User', 'Admin', 'Moderator']
    },
});

schema.plugin(deepPopulate, {
    populate: {
        'user': {
            select: 'name _id '
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);

module.exports = mongoose.model('User', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "user", "user"));
var model = {

    LoginUser: function (data, callback) {
        var username = data.username;
        console.log("username", username);
        var password = data.password;
        var Model = this;
        User.findOne({
            "username": username,
            "password": password
        }).exec(function (err, user) {
            console.log("user", user);
            if (err) {
                callback(err, null);
            } else {
                if (user) {
                    console.log("if!!!");
                    var id = user._id //user object id
                    async.parallel({
                        state: function (callback) {
                            State.find({
                                users: id
                            }).exec(function (err, state) {
                                if (err) {
                                    callback(err, null);
                                } else {
                                    if (state) {
                                        callback(null, state);
                                    }
                                }
                            });
                        },
                        center: function (callback) {
                            Center.find({
                                users: id
                            }).exec(function (err, center) {
                                if (err) {
                                    callback(err, null);
                                } else {
                                    if (center) {
                                        callback(null, center);
                                    }
                                }
                            });
                        },
                        institute: function (callback) {
                            Institute.find({
                                users: id
                            }).exec(function (err, institute) {
                                if (err) {
                                    callback(err, null);
                                } else {
                                    if (institute) {
                                        callback(null, institute);
                                    }
                                }
                            });
                        }
                    }, callback);
                } else {
                    callback("no data", null);
                }
            }
        });

    },


    existsSocial: function (user, callback) {
        var Model = this;
        Model.findOne({
            "oauthLogin.socialId": user.id,
            "oauthLogin.socialProvider": user.provider,
        }).exec(function (err, data) {
            if (err) {
                callback(err, data);
            } else if (_.isEmpty(data)) {
                var modelUser = {
                    name: user.displayName,
                    accessToken: [uid(16)],
                    oauthLogin: [{
                        socialId: user.id,
                        socialProvider: user.provider,
                    }]
                };
                if (user.emails && user.emails.length > 0) {
                    modelUser.email = user.emails[0].value;
                    var envEmailIndex = _.indexOf(env.emails, modelUser.email);
                    if (envEmailIndex >= 0) {
                        modelUser.accessLevel = "Admin";
                    }
                }
                modelUser.googleAccessToken = user.googleAccessToken;
                modelUser.googleRefreshToken = user.googleRefreshToken;
                if (user.image && user.image.url) {
                    modelUser.photo = user.image.url;
                }
                Model.saveData(modelUser, function (err, data2) {
                    if (err) {
                        callback(err, data2);
                    } else {
                        data3 = data2.toObject();
                        delete data3.oauthLogin;
                        delete data3.password;
                        delete data3.forgotPassword;
                        delete data3.otp;
                        console.log(data3);
                        callback(err, data3);
                    }
                });
            } else {
                delete data.oauthLogin;
                delete data.password;
                delete data.forgotPassword;
                delete data.otp;
                data.googleAccessToken = user.googleAccessToken;
                data.save(function () { });
                console.log(data);
                callback(err, data);
            }
        });
    },
    profile: function (data, callback, getGoogle) {
        var str = "name email photo mobile accessLevel";
        if (getGoogle) {
            str += " googleAccessToken googleRefreshToken";
        }
        User.findOne({
            accessToken: data.accessToken
        }, str).exec(function (err, data) {
            if (err) {
                callback(err);
            } else if (data) {
                callback(null, data);
            } else {
                callback("No Data Found", data);
            }
        });
    },
    updateAccessToken: function (id, accessToken) {
        User.findOne({
            "_id": id
        }).exec(function (err, data) {
            data.googleAccessToken = accessToken;
            data.save(function () { });
        });
    },
    findAllUser: function (data, callback) {

        User.find({
            _id: data._id
        }).select("name _id").exec(function (err, found) {
            if (err) {
                // console.log(err);
                callback(err, null);
            } else {
                if (found) {
                    console.log("IN  User FOUND", found);
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