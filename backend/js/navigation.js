var imgurl = adminurl + "upload/";

var imgpath = imgurl + "readFile";
var uploadurl = imgurl;

var navigationservice = angular.module('navigationservice', [])

  .factory('NavigationService', function ($http) {
    var navigation = [{
        name: "Users",
        classis: "active",
        sref: "#!/page/viewUser//",
        icon: "phone"
      }, {
        name: "Centre",
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
      }, {
        name: "Project",
        classis: "active",
        sref: "#!/page/viewProject//",
        icon: "phone"
      }, {
        name: "Project Expenses",
        classis: "active",
        sref: "#!/page/viewProjectExpense//",
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
      },
      {
        name: "Vendor",
        classis: "active",
        sref: "#!/page/viewVendor//",
        icon: "phone"
      },
      {
        name: "Components",
        classis: "active",
        sref: "#!/page/viewComponents//",
        icon: "phone"
      },
      {
        name: "PAB",
        classis: "active",
        sref: "#!/page/viewPab//",
        icon: "phone"
      },
      {
        name: "Key Components",
        classis: "active",
        sref: "#!/page/viewKeyComponents//",
        icon: "phone"
      },
      {
        name: "Project Type",
        classis: "active",
        sref: "#!/page/viewProjectType//",
        icon: "phone"
      },
      {
        name: "Asset Type",
        classis: "active",
        sref: "#!/page/viewAssetType//",
        icon: "phone"
      },
      {
        name: "District",
        classis: "active",
        sref: "#!/page/viewDistrict//",
        icon: "phone"
      }
    ];

    return {
      getnav: function () {
        return navigation;
      },
      parseAccessToken: function (data, callback) {
        if (data) {
          $.jStorage.set("accessToken", data);
          callback();
        }
      },
      removeAccessToken: function (data, callback) {
        $.jStorage.flush();
      },
      profile: function (callback, errorCallback) {
        var data = {
          accessToken: $.jStorage.get("accessToken")
        };
        $http.post(adminurl + 'user/profile', data).then(function (data) {
          data = data.data;
          if (data.value === true) {
            $.jStorage.set("profile", data.data);
            callback();
          } else {
            errorCallback(data.error);
          }
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

      search: function (url, formData, i, callback) {
        $http.post(adminurl + url, formData).then(function (data) {
          data = data.data;
          callback(data, i);
        });
      },
      delete: function (url, formData, callback) {
        $http.post(adminurl + url, formData).then(function (data) {
          data = data.data;
          callback(data);
        });
      },
      countrySave: function (formData, callback) {
        $http.post(adminurl + 'country/save', formData).then(function (data) {
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

      boxCall: function (url, formData, callback) {
        $http.post(adminurl + url, formData).then(function (data) {
          data = data.data;
          callback(data);
        });
      },
      searchCall: function (url, formData, i, callback) {
        $http.post(adminurl + url, formData).then(function (data) {
          data = data.data;
          console.log("DATAA", data);
          callback(data, i);
        });
      },

      searchCall2: function (url, formData, i, callback) {
        $http.post(adminurl + url, formData).then(function (data) {
          // $scope.CENTRE={};
          data = data.data;
          // $scope.CENTRE =data;
          console.log("DATAA", data);
          callback(data, i);
        });
      },

      getOneCountry: function (id, callback) {
        $http.post(adminurl + 'country/getOne', {
          _id: id
        }).then(function (data) {
          data = data.data;
          callback(data);
        });
      },
      getLatLng: function (address, i, callback) {
        $http({
          url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=AIzaSyC62zlixVsjaq4zDaL4cefNCubjCgxkte4",
          method: 'GET',
          withCredentials: false,
        }).then(function (data) {
          data = data.data;
          callback(data, i);
        });
      }

    };
  });