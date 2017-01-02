var imgurl = adminurl + "upload/";

var imgpath = imgurl + "readFile";
var uploadurl = imgurl;

var navigationservice = angular.module('navigationservice', [])

.factory('NavigationService', function($http) {
  var navigation = [{
      name: "Users",
      classis: "active",
      sref: "#!/page/viewUser//",
      icon: "phone"
    }, {
      name: "Center",
      classis: "active",
      sref: "#!/page/viewCenter//",
      icon: "phone"
    }, {
      name: "State",
      classis: "active",
      sref: "#!/page/viewState//",
      icon: "phone"
    }, {
      name: "Institute",
      classis: "active",
      sref: "#!/page/viewInstitute//",
      icon: "phone"
    },

    {
      name: "Project",
      classis: "active",
      sref: "#!/page/viewProject//",
      icon: "phone"
    }, {
      name: "Transaction",
      classis: "active",
      sref: "#!/page/viewTransaction//",
      icon: "phone"
    }, {
      name: "Milestones",
      classis: "active",
      sref: "#!/page/viewMilestones//",
      icon: "phone"
    }, {
      name: "Transaction Due",
      classis: "active",
      sref: "#!/page/viewTransactionDue//",
      icon: "phone"
    }


  ];

  return {
    getnav: function() {
      return navigation;
    },
    parseAccessToken: function(data, callback) {
      if (data) {
        $.jStorage.set("accessToken", data);
        callback();
      }
    },
    removeAccessToken: function(data, callback) {
      $.jStorage.flush();
    },
    profile: function(callback, errorCallback) {
      var data = {
        accessToken: $.jStorage.get("accessToken")
      };
      $http.post(adminurl + 'user/profile', data).then(function(data) {
        data = data.data;
        if (data.value === true) {
          $.jStorage.set("profile", data.data);
          callback();
        } else {
          errorCallback(data.error);
        }
      });
    },
    makeactive: function(menuname) {
      for (var i = 0; i < navigation.length; i++) {
        if (navigation[i].name == menuname) {
          navigation[i].classis = "active";
        } else {
          navigation[i].classis = "";
        }
      }
      return menuname;
    },

    search: function(url, formData, i, callback) {
      $http.post(adminurl + url, formData).then(function(data) {
        data = data.data;
        callback(data, i);
      });
    },
    delete: function(url, formData, callback) {
      $http.post(adminurl + url, formData).then(function(data) {
        data = data.data;
        callback(data);
      });
    },
    countrySave: function(formData, callback) {
      $http.post(adminurl + 'country/save', formData).then(function(data) {
        data = data.data;
        callback(data);
      });
    },

    apiCall: function(url, formData, callback) {
      $http.post(adminurl + url, formData).then(function(data) {
        console.log('inside Navvvvvvvi',data);
        data = data.data;
        callback(data);
      });
    },

      // apiCall: function(url, formData,callback) {
      //      $http({
      //          url: adminurl + url,
      //          method: 'POST',
      //          withCredentials: true,
      //          data:formData
      //      }).then(function(data) {
      //   console.log('inside Navvvvvvvi',data);
      //   console.log('inside Navvvvvvvi',data.data.photos[0]);
      //   data = data.data;
      //   callback(data);
      // });
      //  },

    boxCall: function(url, formData, callback) {
      $http.post(adminurl + url, formData).then(function(data) {
        data = data.data;
        callback(data);
      });
    },
    searchCall: function(url, formData, i, callback) {
      $http.post(adminurl + url, formData).then(function(data) {
        data = data.data;
        callback(data, i);
      });
    },

    getOneCountry: function(id, callback) {
      $http.post(adminurl + 'country/getOne', {
        _id: id
      }).then(function(data) {
        data = data.data;
        callback(data);
      });
    },
    getLatLng: function(address, i, callback) {
      $http({
        url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=AIzaSyC62zlixVsjaq4zDaL4cefNCubjCgxkte4",
        method: 'GET',
        withCredentials: false,
      }).then(function(data) {
          data = data.data;
        callback(data, i);
      });
    }

  };
});
