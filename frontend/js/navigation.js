var imgurl = adminurl + "upload/";
var imgpath = imgurl + "readFile";
var uploadurl = imgurl;

var navigationservice = angular.module('navigationservice', [])

    .factory('NavigationService', function ($http) {
        var navigation = [{
            name: "Home",
            classis: "active",
            anchor: "home",
            subnav: [{
                name: "Subnav1",
                classis: "active",
                anchor: "home"
            }]
        }, {
            name: "Form",
            classis: "active",
            anchor: "form",
            subnav: []
        }];

        return {
            getnav: function () {
                return navigation;
            },
            getOneForm: function (id, callback) {
                $http.post(adminurl + "Form/getOne", {
                    _id: id
                }).then(function (data) {
                    data = data.data;
                    callback(data);
                });
            },
            makeactive: function (menuname) {
                for (var i = 0; i < navigation.length; i++) {
                    if (navigation[i].name == menuname) {
                        navigation[i].classis = "active";
                    } else {
                        navigation[i].classis = "";
                    }
                }
                return menuname;
            },

            getAllState: function (callback) {
                $http({
                    url: adminurl + 'State/findAllState',
                    method: 'POST',
                    withCredentials: true,
                }).then(callback);
            },

            boxCall: function (url, callback) {
                $http.post(adminurl + url).then(function (data) {
                    data = data.data;
                    callback(data);
                });
            },
            apiCall: function (url, formData, callback) {
                $http.post(adminurl + url, formData).then(function (data) {
                    console.log('inside Navvvvvvvi', data);
                    data = data.data;
                    callback(data);
                });
            },

        };


    });