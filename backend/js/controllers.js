var globalfunction = {};
angular.module('phonecatControllers', ['templateservicemod', 'navigationservice', "jsonservicemod", 'ui.bootstrap', 'ui.select', 'ngAnimate', 'toastr', 'ngSanitize', 'angular-flexslider', 'ui.tinymce', 'imageupload', 'ngMap', 'toggle-switch', 'cfp.hotkeys', 'ui.sortable'])

  .controller('DashboardCtrl', function ($scope, TemplateService, NavigationService, $timeout, $state) {
    //Used to name the .html file
    $scope.template = TemplateService.changecontent("dashboard");
    $scope.menutitle = NavigationService.makeactive("Dashboard");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();
  })


  .controller('AccessController', function ($scope, TemplateService, NavigationService, $timeout, $state) {
    if ($.jStorage.get("accessToken")) {

    } else {
      $state.go("login");
    }
  })

  .controller('JagzCtrl', function ($scope, TemplateService, NavigationService, $timeout, $state, $interval) {

    function toColor(num, red) {
      num >>>= 0;
      var b = num & 0xFF,
        g = (num & 0xFF00) >>> 8,
        r = (num & 0xFF0000) >>> 16,
        a = ((num & 0xFF000000) >>> 24) / 255;
      if (red == "red") {
        r = 255;
        b = 0;
        g = 0;
      }
      return "rgba(" + [r, g, b, a].join(",") + ")";
    }

    $scope.circles = _.times(360, function (n) {

      var radius = _.random(0, 10);
      return {
        width: radius,
        height: radius,
        background: toColor(_.random(-12525360, 12525360)),
        top: _.random(0, $(window).height()),
        left: _.random(0, $(window).width())
      };
    });

    function generateCircle() {
      _.each($scope.circles, function (n, index) {
        var radius = _.random(0, 10);
        n.width = radius;
        n.height = radius;
        n.background = toColor(_.random(-12525360, 12525360));
        if (count % 7 === 0 || count % 7 === 5 || count % 7 === 6) {
          if (count % 7 === 6) {
            n.background = toColor(_.random(-12525360, 12525360), "red");
            // n.width = 3;
            // n.height = 3;
          }
          var t = index * Math.PI / 180;
          var x = (4.0 * Math.pow(Math.sin(t), 3));
          var y = ((3.0 * Math.cos(t)) - (1.3 * Math.cos(2 * t)) - (0.6 * Math.cos(3 * t)) - (0.2 * Math.cos(4 * t)));
          n.top = -50 * y + 300;
          n.left = 50 * x + $(window).width() / 2;
        } else {
          n.top = _.random(0, $(window).height());
          n.left = _.random(0, $(window).width());
        }
      });
    }

    var count = 0;

    $interval(function () {
      count++;
      console.log("Version 1.1");
      generateCircle();
    }, 5000);

  })

  .controller('MultipleSelectCtrl', function ($scope, $rootScope, TemplateService, NavigationService, $timeout, $state, $stateParams, $filter, toastr) {
    var i = 0;
    $scope.getValues = function (filter, insertFirst) {
      var dataSend = {
        keyword: $scope.search.modelData,
        filter: filter,
        page: 1
      };
      if (dataSend.keyword === null || dataSend.keyword === undefined) {
        dataSend.keyword = "";
      }
      NavigationService[$scope.api]($scope.url, dataSend, ++i, function (data) {

        // console.log("DATA IN MS CTRL", data);
        if (data.value) {
          $scope.list = data.data.results;
          if ($scope.search.modelData) {
            $scope.showCreate = true;
            _.each($scope.list, function (n) {
              // if (n.name) {
              if (_.lowerCase(n.name) == _.lowerCase($scope.search.modelData)) {
                $scope.showCreate = false;
                return 0;
              }
              // }else{
              //     if (_.lowerCase(n.officeCode) == _.lowerCase($scope.search.modelData)) {
              //       $scope.showCreate = false;
              //       return 0;
              //   }
              // }

            });
          } else {
            $scope.showCreate = false;

          }
          if (insertFirst) {
            if ($scope.list[0] && $scope.list[0]._id) {
              // if ($scope.list[0].name) {
              $scope.sendData($scope.list[0]._id, $scope.list[0].name);
              // }else{
              //   $scope.sendData($scope.list[0]._id, $scope.list[0].officeCode);
              // }
            } else {
              console.log("Making this happen");
              // $scope.sendData(null, null);
            }
          }
        } else {
          console.log("Making this happen2");
          $scope.sendData(null, null);
        }


      });
    };

    $scope.$watch('model', function (newVal, oldVal) {
      if (newVal && oldVal === undefined) {
        $scope.getValues({
          _id: $scope.model
        }, true);
      }
    });


    $scope.$watch('filter', function (newVal, oldVal) {
      var filter = {};
      if ($scope.filter) {
        filter = JSON.parse($scope.filter);
      }
      var dataSend = {
        keyword: $scope.search.modelData,
        filter: filter,
        page: 1
      };

      NavigationService[$scope.api](dataSend, ++i, function (data) {
        if (data.value) {
          $scope.list = data.data.results;
          $scope.showCreate = false;

        }
      });
    });


    $scope.search = {
      modelData: ""
    };
    if ($scope.model) {
      $scope.getValues({
        _id: $scope.model
      }, true);
    } else {
      $scope.getValues();
    }





    $scope.listview = false;
    $scope.showCreate = false;
    $scope.typeselect = "";
    $scope.showList = function () {
      $scope.listview = true;
      $scope.searchNew(true);
    };
    $scope.closeList = function () {
      $scope.listview = false;
    };
    $scope.closeListSlow = function () {
      $timeout(function () {
        $scope.closeList();
      }, 500);
    };
    $scope.searchNew = function (dontFlush) {
      if (!dontFlush) {
        $scope.model = "";
      }
      var filter = {};
      if ($scope.filter) {
        filter = JSON.parse($scope.filter);
      }
      $scope.getValues(filter);
    };
    $scope.createNew = function (create) {
      var newCreate = $filter("capitalize")(create);
      var data = {
        name: newCreate
      };
      if ($scope.filter) {
        data = _.assign(data, JSON.parse($scope.filter));
      }
      console.log(data);
      NavigationService[$scope.create](data, function (data) {
        if (data.value) {
          toastr.success($scope.name + " Created Successfully", "Creation Success");
          $scope.model = data.data._id;
          $scope.ngName = data.data.name;
        } else {
          toastr.error("Error while creating " + $scope.name, "Error");
        }
      });
      $scope.listview = false;
    };
    $scope.sendData = function (val, name) {
      $rootScope.user_id = val;
      $rootScope.user_name = name;
      console.log("VAL", val);
      console.log("IN SEND DATA", name);

      $scope.search.modelData = name;
      $scope.ngName = name;
      $scope.model = val;
      $scope.listview = false;
    };
  })

  .controller('PageJsonCtrl', function ($scope, TemplateService, NavigationService, JsonService, $timeout, $state, $stateParams, $uibModal) {
    $scope.json = JsonService;
    $scope.template = TemplateService.changecontent("none");
    $scope.menutitle = NavigationService.makeactive("Country List");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();
    console.log("JSONSERVICE START get");
    console.log("ORGIN-------->", $stateParams.id);
    JsonService.getJson($stateParams.id, function () {});
    console.log("JSONSERVICE END get");

    globalfunction.confDel = function (callback) {
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: '/backend/views/modal/conf-delete.html',
        size: 'sm',
        scope: $scope
      });
      $scope.close = function (value) {
        callback(value);
        modalInstance.close("cancel");
      };
    };

    globalfunction.openModal = function (callback) {
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: '/backend/views/modal/modal.html',
        size: 'lg',
        scope: $scope
      });
      $scope.close = function (value) {
        callback(value);
        modalInstance.close("cancel");
      };
    };

    // globalfunction.confDel(function (value) {
    //     console.log(value);
    //     if (value) {
    //         NavigationService.apiCall(id, function (data) {
    //             if (data.value) {
    //                 $scope.showAllCountries();
    //                 toastr.success("Country deleted successfully.", "Country deleted");
    //             } else {
    //                 toastr.error("There was an error while deleting country", "Country deleting error");
    //             }
    //         });
    //     }
    // });

  })
  .controller('CustomPageJsonCtrl', function ($scope, TemplateService, NavigationService, JsonService, $timeout, $state, $stateParams, $uibModal) {
    //$scope.json = JsonService;
    $scope.template = TemplateService.changecontent("none");
    $scope.menutitle = NavigationService.makeactive("Country List");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();
    console.log("IN CUSTOM PAGE CTRLLER");
    console.log("CUSTOM JSONSERVICE START get");
    console.log("CUSTOM-------->", $stateParams.id);
    JsonService.getJson($stateParams.id, function () {});

    console.log("CUSTOM JSONSERVICE END get");
    globalfunction.confDel = function (callback) {
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: '/backend/views/modal/conf-delete.html',
        size: 'sm',
        scope: $scope
      });
      $scope.close = function (value) {
        callback(value);
        modalInstance.close("cancel");
      };
    };

    globalfunction.openModal = function (callback) {
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: '/backend/views/modal/modal.html',
        size: 'lg',
        scope: $scope
      });
      $scope.close = function (value) {
        callback(value);
        modalInstance.close("cancel");
      };
    };

    // globalfunction.confDel(function (value) {
    //     console.log(value);
    //     if (value) {
    //         NavigationService.apiCall(id, function (data) {
    //             if (data.value) {
    //                 $scope.showAllCountries();
    //                 toastr.success("Country deleted successfully.", "Country deleted");
    //             } else {
    //                 toastr.error("There was an error while deleting country", "Country deleting error");
    //             }
    //         });
    //     }
    // });

  })

  .controller('CustomStatePageJsonCtrl', function ($scope, TemplateService, NavigationService, JsonService, $timeout, $state, $stateParams, $uibModal) {
    //$scope.json = JsonService;
    $scope.template = TemplateService.changecontent("none");
    $scope.menutitle = NavigationService.makeactive("Country List");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();
    console.log("IN CUSTOM PAGE CTRLLER");
    console.log("CUSTOM JSONSERVICE START get");
    console.log("CUSTOM-------->", $stateParams.id);
    JsonService.getJson($stateParams.id, function () {});

    console.log("CUSTOM JSONSERVICE END get");
    globalfunction.confDel = function (callback) {
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: '/backend/views/modal/conf-delete.html',
        size: 'sm',
        scope: $scope
      });
      $scope.close = function (value) {
        callback(value);
        modalInstance.close("cancel");
      };
    };

    globalfunction.openModal = function (callback) {
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: '/backend/views/modal/modal.html',
        size: 'lg',
        scope: $scope
      });
      $scope.close = function (value) {
        callback(value);
        modalInstance.close("cancel");
      };
    };

    // globalfunction.confDel(function (value) {
    //     console.log(value);
    //     if (value) {
    //         NavigationService.apiCall(id, function (data) {
    //             if (data.value) {
    //                 $scope.showAllCountries();
    //                 toastr.success("Country deleted successfully.", "Country deleted");
    //             } else {
    //                 toastr.error("There was an error while deleting country", "Country deleting error");
    //             }
    //         });
    //     }
    // });

  })



  .controller('ViewCtrl', function ($scope, TemplateService, NavigationService, JsonService, $timeout, $state, $stateParams) {
    $scope.json = JsonService;
    $scope.template = TemplateService;
    var i = 0;
    if ($stateParams.page && !isNaN(parseInt($stateParams.page))) {
      $scope.currentPage = $stateParams.page;
    } else {
      $scope.currentPage = 1;
    }

    $scope.search = {
      keyword: ""
    };
    if ($stateParams.keyword) {
      $scope.search.keyword = $stateParams.keyword;
    }
    $scope.changePage = function (page) {
      var goTo = "page";
      if ($scope.search.keyword) {
        goTo = "page";
      }
      $state.go(goTo, {
        id: $stateParams.id,
        page: page,
        keyword: $scope.search.keyword
      });
    };

    $scope.getAllItems = function (keywordChange) {
      $scope.totalItems = undefined;
      if (keywordChange) {
        $scope.currentPage = 1;
      }
      NavigationService.search($scope.json.json.apiCall.url, {
          page: $scope.currentPage,
          keyword: $scope.search.keyword
        }, ++i,
        function (data, ini) {
          if (ini == i) {
            $scope.items = data.data.results;
            $scope.totalItems = data.data.total;
            $scope.maxRow = data.data.options.count;
          }
        });
    };
    JsonService.refreshView = $scope.getAllItems;
    $scope.getAllItems();

  })

  .controller('DetailCtrl', function ($scope, TemplateService, NavigationService, JsonService, $timeout, $state, $stateParams, toastr) {
    $scope.json = JsonService;
    JsonService.setKeyword($stateParams.keyword);
    $scope.template = TemplateService;
    $scope.data = {};
    console.log("IN Detail controller");
    console.log("SCOPE JSON", $scope.json);

    //  START FOR EDIT
    if ($scope.json.json.preApi) {

      NavigationService.apiCall($scope.json.json.preApi.url, {
        [$scope.json.json.preApi.params]: $scope.json.keyword._id
      }, function (data) {
        $scope.data = data.data;
        $scope.generateField = true;

      });
    } else {
      $scope.generateField = true;
    }




    //  END FOR EDIT

    $scope.onCancel = function (sendTo) {
      $scope.json.json.action[1].stateName.json.keyword = "";
      $scope.json.json.action[1].stateName.json.page = "";
      $state.go($scope.json.json.action[1].stateName.page, $scope.json.json.action[1].stateName.json);
    };

    $scope.saveData = function (formData) {
      console.log("in save");
      console.log("ABC", formData);
      // console.log("PIC",formData.photos[0].photo);
      NavigationService.apiCall($scope.json.json.apiCall.url, formData, function (data) {
        if (data.value === true) {
          $scope.json.json.action[0].stateName.json.keyword = "";
          $scope.json.json.action[0].stateName.json.page = "";
          $state.go($scope.json.json.action[0].stateName.page, $scope.json.json.action[0].stateName.json);
          var messText = "created";
          if ($scope.json.keyword._id) {
            messText = "edited";
          }
          toastr.success($scope.json.json.name + " " + formData.name + " " + messText + " successfully.");
        } else {
          var messText = "creating";
          if ($scope.json.keyword._id) {
            messText = "editing";
          }
          toastr.error("Failed " + messText + " " + $scope.json.json.name);
        }
      });
    };
  })
  .controller('InstituteDetailCtrl', function ($scope, TemplateService, $rootScope, NavigationService, JsonService, $timeout, $state, $stateParams, $uibModal, toastr) {
    $scope.json = JsonService;
    JsonService.setKeyword($stateParams.keyword);
    $scope.template = TemplateService;
    $scope.data = {};
    console.log("IN InstituteDetail controller");
    console.log("SCOPE JSON", $scope.json);
    $scope.tableData = {};
    $scope.instituteData = {};
    $scope.instituteUserData = {};
    $rootScope.user_id;
    $rootScope.user_name;


    $scope.editNewInstitute = function (userId, centerId) {

      console.log("USER ID", userId);
      $scope.edituserinfo = {
        "_id": centerId,
        "user_id": userId,
        "change_id": $rootScope.user_id
      };
      value = $scope.edituserinfo;

      NavigationService.boxCall("Institute/updateUser", value, function (data) {
        toastr.success(" User " + " " + "updated" + " successfully.");
        $scope.closeBox();
      });

      $scope.closeBox = function () {
        $scope.modalInstance.close();
        $scope.getUser();
      };

    };


    $scope.editBoxCustomUserInstitute = function (data, index) {
      $scope.UserEditData = data;
      $scope.index = index;
      console.log("DATTATATATAT", data);

      $scope.modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: '/backend/views/modal/edit-user-institute.html',
        size: 'lg',
        scope: $scope,
        instituteUserData: $scope.instituteUserData
      });
    };




    $scope.getUser = function () {
        NavigationService.apiCall("Institute/findOneInstituteUser", {
          [$scope.json.json.preApi.params]: $scope.json.keyword._id
        }, function (data) {
          $scope.instituteUserData = data.data;
          // $scope.generateField = true;
          console.log("instituteUserDATA IS FOUND HERE-->", $scope.instituteUserData);
          // console.log("STATEID", $scope.tableData.state._id);
          // console.log("STATEID", $scope.tableData.state.name);
        });
      },
      $scope.getUser();
    $scope.removeUser = function (value) {
      console.log("USER REMOVE DATA", $scope.json.keyword._id);

      var dataUser = {
        _id: $scope.json.keyword._id,
        user_id: value._id
      };

      NavigationService.boxCall("Institute/removeUserFromInstitute", dataUser, function (data) {
        $scope.newProjectData = data.data;
        $scope.generateField = true;
        // $state.reload();
        $scope.getUser();
      })

    };




    $scope.addBoxInstituteUser = function () {
      $scope.addNewState = function () {
        $scope.newuserinfo = {
          "_id": $scope.json.keyword._id,
          "user_id": $rootScope.user_id,
          "user_name": $rootScope.user_name
        };
        value = $scope.newuserinfo;


      $scope.projectStatus2 = [
        "Active"
      ];
     

            $scope.workStatus2 = [
        "InTime"
      ];
            $scope.fundStatus2 = [
        "InTime"
      ];
        console.log("DATA TO BE SEND", value);
        NavigationService.boxCall("Institute/addUserToInstitute", value, function (data) {
          toastr.success(value.user_name + " User " + " " + "added" + " successfully.");
          $scope.closeBox();
          $scope.getUser();
        })
      };

      $scope.modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: '/backend/views/modal/add-user-institute.html',
        size: 'lg',
        scope: $scope,
        tableData: $scope.tableData
      });
    };




    $scope.getInstitute = function () {
      NavigationService.apiCall("Institute/getInstitute", {
        [$scope.json.json.preApi.params]: $scope.json.keyword._id
      }, function (data) {
        $scope.tableData = data.data;
        $scope.generateField = true;
        console.log("TABLEDATA IS FOUND HERE-->", $scope.tableData);
        console.log("STATEID", $scope.tableData.state._id);
        console.log("STATEID", $scope.tableData.state.name);
      });
    }

    $scope.findInstitute = function () {
      NavigationService.apiCall("Institute/findOneInstitute", {
        [$scope.json.json.preApi.params]: $scope.json.keyword._id
      }, function (data) {
        $scope.tableDatas = data.data;
        $scope.generateField = true;
        console.log("TABLEDATAs IS FOUND HERE-->", $scope.tableDatas);
        console.log("STATEID", $scope.tableDatas.state._id);
        console.log("STATEID", $scope.tableDatas.state.name);
      });
    }



    $scope.getOne = function () {
      NavigationService.apiCall("Institute/getOne", {
        [$scope.json.json.preApi.params]: $scope.json.keyword._id
      }, function (data) {
        $scope.ownData = data.data;
        $scope.generateField = true;
        console.log("TABLEDATAs IS FOUND HERE-->", $scope.ownData);

      });
    }
    $scope.findInstitute();
    $scope.getInstitute();
    $scope.getOne();


    //  START FOR EDIT
    if ($scope.json.json.preApi) {

      NavigationService.apiCall($scope.json.json.preApi.url, {
        [$scope.json.json.preApi.params]: $scope.json.keyword._id
      }, function (data) {
        $scope.data = data.data;
        $scope.generateField = true;
        console.log("DATA IS FOUND HERE-->", $scope.data);

      });
    } else {
      $scope.generateField = true;
    }


    //  END FOR EDIT

    $scope.editBoxCustomProject = function (data) {

      console.log("DATADATA", data);
      $scope.info = data;
      $scope.newinfo = {};

      $scope.status = [
        "Active", "Complete", "Cancelled", "OnHold"
      ];

 $scope.subStatus = [
        "InTime", "Delay"
      ];
      $scope.projectStatus = [
        "Active", "Complete", "Cancelled", "OnHold"
      ];
     

            $scope.workStatus = [
        "InTime", "Delay"
      ];
            $scope.fundStatus = [
        "InTime", "Delay"
      ];




      $scope.modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: '/backend/views/modal/project-edit-detail.html',
        size: 'lg',
        scope: $scope,

      });
    };

    $scope.editBoxProject = function () {
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: '/backend/views/modal/project-detail.html',
        size: 'lg',
        scope: $scope,
        tableData: $scope.tableData
      });
    };

    $scope.addBoxProject = function (data, state) {
      // $scope.newinfo = newdata;
      // console.log("STATEID", $scope.tableData.state._id);
      // console.log("STATEID", $scope.tableData.state.name);
      // $scope.STATE = $scope.tableData.state.name;

      $scope.newprojectinfo = {
        "institute": data,
        "state": state
      };


      $scope.projectStatus = [
        "Active", "Complete", "Cancelled", "OnHold"
      ];

      $scope.subStatus = [
        "InTime", "Delay"                                                                                                                                                                                                                                                                                                             
      ];
            $scope.workStatus = [
        "InTime", "Delay"
      ];

      $scope.fundStatus = [
        "InTime", "Delay"
      ];

      $scope.modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: '/backend/views/modal/project-add2.html',
        size: 'lg',
        scope: $scope,
        tableData: $scope.tableData
      });
    };


    $scope.onCancel = function (sendTo) {
      $scope.json.json.action[1].stateName.json.keyword = "";
      $scope.json.json.action[1].stateName.json.page = "";
      $state.go($scope.json.json.action[1].stateName.page, $scope.json.json.action[1].stateName.json);
    };


    $scope.saveProject = function (value) {

      console.log("DATA", value);
      NavigationService.boxCall("Project/save", value, function (data) {
        $scope.projectData = data.data;
        $scope.generateField = true;
        $scope.modalInstance.close();

      })

    };
    $scope.addNewProject = function (value) {

      console.log("DATA", value);
      NavigationService.boxCall("Institute/addNewProject", value, function (data) {
        $scope.newProjectData = data.data;
        $scope.generateField = true;
        $scope.modalInstance.close();
        $state.reload();
      })

    };
    $scope.removeProject = function (value, state) {

      console.log("VALUE<<<<<<<<<<<<<<<", value);
      console.log("STATE<<<<<<<<<<<<<<<", state);


      console.log("REMOVE DATA", value);
      NavigationService.boxCall("Institute/removeProject", value, function (data) {
        $scope.newProjectData = data.data;
        $scope.generateField = true;
        $state.reload();
        $scope.findInstitute();
      })

    };

    $scope.closeBox = function () {
      $scope.modalInstance.close();
    };


    $scope.saveData = function (formData) {
      console.log("in save");
      console.log("ABC", formData);
      // console.log("PIC",formData.photos[0].photo);
      NavigationService.apiCall($scope.json.json.apiCall.url, formData, function (data) {
        if (data.value === true) {
          $scope.json.json.action[0].stateName.json.keyword = "";
          $scope.json.json.action[0].stateName.json.page = "";
          $state.go($scope.json.json.action[0].stateName.page, $scope.json.json.action[0].stateName.json);
          var messText = "created";
          if ($scope.json.keyword._id) {
            messText = "edited";
          }
          toastr.success($scope.json.json.name + " " + formData.name + " " + messText + " successfully.");
        } else {
          var messText = "creating";
          if ($scope.json.keyword._id) {
            messText = "editing";
          }
          toastr.error("Failed " + messText + " " + $scope.json.json.name);
        }
      });
    };
  })

  .controller('StateDetailCtrl', function ($scope, TemplateService, NavigationService, JsonService, $timeout, $state, $stateParams, $uibModal, toastr, $rootScope) {
    $scope.json = JsonService;
    JsonService.setKeyword($stateParams.keyword);
    $scope.template = TemplateService;
    $scope.data = {};
    console.log("IN STATEDETAIL controller");
    console.log("SCOPE JSON", $scope.json);
    $scope.tableData = {};
    $scope.stateData = {};
    $scope.stateName = [];
    $scope.stateIds = [];
    $scope.STATE;
    $rootScope.user_id;
    $rootScope.user_name;
    $scope.stateUserData = {};

    $scope.editNewState = function (userId, centerId) {

      console.log("USER ID", userId);
      $scope.edituserinfo = {
        "_id": centerId,
        "user_id": userId,
        "change_id": $rootScope.user_id
      };
      value = $scope.edituserinfo;

      NavigationService.boxCall("State/updateUser", value, function (data) {
        toastr.success(" User " + " " + "updated" + " successfully.");
        $scope.closeBox();
      });

      $scope.closeBox = function () {
        $scope.modalInstance.close();
        $scope.getUser();
      };

    };



    $scope.editBoxCustomState = function (data, index) {
      $scope.UserEditData = data;
      $scope.index = index;

      $scope.modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: '/backend/views/modal/edit-user-state.html',
        size: 'lg',
        scope: $scope,
        stateUserData: $scope.stateUserData
      });
    };


    $scope.removeUser = function (value) {
      console.log("USER REMOVE DATA", $scope.json.keyword._id);

      var dataUser = {
        _id: $scope.json.keyword._id,
        user_id: value._id
      };

      NavigationService.boxCall("State/removeUserFromState", dataUser, function (data) {
        $scope.newProjectData = data.data;
        $scope.generateField = true;
        // $state.reload();
        $scope.getUser();
      })

    };


    $scope.getUser = function () {
        NavigationService.apiCall("State/findOneStateUser", {
          [$scope.json.json.preApi.params]: $scope.json.keyword._id
        }, function (data) {
          $scope.stateUserData = data.data;
          // $scope.generateField = true;
          console.log("stateUserDATA IS FOUND HERE-->", $scope.stateUserData);
          // console.log("STATEID", $scope.tableData.state._id);
          // console.log("STATEID", $scope.tableData.state.name);
        });
      },

      $scope.getUser();

    $scope.findInstitute = function () {
      NavigationService.apiCall("State/findInstitute", {
        [$scope.json.json.preApi.params]: $scope.json.keyword._id
      }, function (data) {
        $scope.tableData = data.data;
        $scope.generateField = true;
        console.log("TABLEDATA IS FOUND HERE-->", $scope.tableData);
      });
    }
    $scope.findState = function () {
      NavigationService.apiCall("State/findState", {
        [$scope.json.json.preApi.params]: $scope.json.keyword._id
      }, function (data) {
        $scope.stateData = data.data;
        $scope.generateField = true;
        console.log("STATEDATA IS FOUND HERE-->", $scope.stateData);
        // console.log("STATEDATA IS FOUND HERE-->", $scope.stateData[0].name);
        var abc = $scope.stateData;
        var log = [];
        var n = 0;
        _.each($scope.stateData, function (n) {
          console.log("LODASH", n.name);
          console.log("innnnnnn");
          $scope.stateName.push({
            "state": n.name,
            "_id": n._id
          });
          $scope.stateIds.push(n._id);
          console.log("after", $scope.stateName);

          console.log("STATE NAME", $scope.stateName);
        });

      });
    }
    $scope.findInstitute();
    $scope.findState();
    //  START FOR EDIT
    if ($scope.json.json.preApi) {

      NavigationService.apiCall($scope.json.json.preApi.url, {
        [$scope.json.json.preApi.params]: $scope.json.keyword._id
      }, function (data) {
        $scope.data = data.data;
        $scope.generateField = true;
        console.log("DATA IS FOUND HERE-->", $scope.data);

      });
    } else {
      $scope.generateField = true;
    }

    $scope.addBoxState = function () {
      $scope.addNewState = function () {
        $scope.newuserinfo = {
          "_id": $scope.json.keyword._id,
          "user_id": $rootScope.user_id,
          "user_name": $rootScope.user_name
        };
        value = $scope.newuserinfo;

        console.log("DATA TO BE SEND", value);
        NavigationService.boxCall("State/addUserToState", value, function (data) {
          toastr.success(value.user_name + " User " + " " + "added" + " successfully.");
          $scope.closeBox();
          $scope.getUser();
        })
      };

      $scope.modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: '/backend/views/modal/add-user-state.html',
        size: 'lg',
        scope: $scope,
        tableData: $scope.tableData
      });
    };













    //  END FOR EDIT
    $scope.editBoxCustomInstitute = function (data) {

      console.log("DATADATA", data);
      $scope.info = data;
      $scope.newinfo = {};

      NavigationService.apiCall("State/findAllState", {
        [$scope.json.json.preApi.params]: $scope.json.keyword._id
      }, function (data) {
        $scope.AllState = data.data;
        $scope.generateField = true;
        console.log("AllState DATA IS FOUND HERE-->", $scope.AllState);
      });
      // $scope.stateData;
      $scope.modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: '/backend/views/modal/institute-edit2-detail.html',
        size: 'lg',
        scope: $scope,

      });
    };

    $scope.editBoxInstitute = function () {


      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: '/backend/views/modal/institute-edit-detail.html',
        size: 'lg',
        scope: $scope,
        tableData: $scope.tableData
      });
    };

    $scope.addBoxInstitute = function (data) {
      // $scope.newinfo = newdata;

      $scope.instiType=["Central Universities",
            "State Universities",
            "Institutes of National Importance",
            "Deemed to be Universities",
            "Affiliated Colleges",
            "Autonomous Colleges"];
      NavigationService.apiCall("State/findAllState", {
        [$scope.json.json.preApi.params]: $scope.json.keyword._id
      }, function (data) {
        $scope.AllState = data.data;
        $scope.generateField = true;
        console.log("AllState DATA IS FOUND HERE-->", $scope.AllState);
      });

      $scope.newinstituteinfo = {
        "state": data
      };
      $scope.modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: '/backend/views/modal/institute-add.html',
        size: 'lg',
        scope: $scope,
        tableData: $scope.tableData
      });
    };


    $scope.onCancel = function (sendTo) {
      $scope.json.json.action[1].stateName.json.keyword = "";
      $scope.json.json.action[1].stateName.json.page = "";
      $state.go($scope.json.json.action[1].stateName.page, $scope.json.json.action[1].stateName.json);
    };


    $scope.saveInstitute = function (value) {
      console.log("DATA", value);
      NavigationService.boxCall("Institute/save", value, function (data) {
        $scope.projectData = data.data;
        $scope.generateField = true;
        $scope.modalInstance.close();
        $scope.findInstitute();
        toastr.success(value.name + " Institute" + " " + "added" + " successfully.");
      })

    };



    $scope.addNewProject = function (value) {

      console.log("DATA", value);
      NavigationService.boxCall("Institute/addNewProject", value, function (data) {
        $scope.newProjectData = data.data;
        $scope.generateField = true;
        $scope.modalInstance.close();
        $state.reload();
      })

    };
    $scope.removeInstitute = function (value) {

      console.log("Institute REMOVE DATA", value);
      NavigationService.boxCall("State/removeInstitute", value, function (data) {
        $scope.newProjectData = data.data;
        $scope.generateField = true;
        // $state.reload();
        $scope.findInstitute();
      })

    };

    $scope.closeBox = function () {
      $scope.modalInstance.close();
      $scope.findInstitute();
    };


    $scope.saveData = function (formData) {
      console.log("in save");
      console.log("ABC", formData);
      // console.log("PIC",formData.photos[0].photo);
      NavigationService.apiCall($scope.json.json.apiCall.url, formData, function (data) {
        if (data.value === true) {
          $scope.json.json.action[0].stateName.json.keyword = "";
          $scope.json.json.action[0].stateName.json.page = "";
          $state.go($scope.json.json.action[0].stateName.page, $scope.json.json.action[0].stateName.json);
          var messText = "created";
          if ($scope.json.keyword._id) {
            messText = "edited";
          }
          toastr.success($scope.json.json.name + " " + formData.name + " " + messText + " successfully.");
        } else {
          var messText = "creating";
          if ($scope.json.keyword._id) {
            messText = "editing";
          }
          toastr.error("Failed " + messText + " " + $scope.json.json.name);
        }
      });
    };
  })


  .controller('VendorDetailCtrl', function ($scope, TemplateService, NavigationService, JsonService, $timeout, $state, $stateParams, $uibModal, toastr, $rootScope) {
    $scope.json = JsonService;
    JsonService.setKeyword($stateParams.keyword);
    $scope.template = TemplateService;
    $scope.data = {};
    console.log("IN STATEDETAIL controller");
    console.log("SCOPE JSON", $scope.json);
    $scope.tableData = {};
    $scope.stateData = {};
    $scope.stateName = [];
    $scope.stateIds = [];
    $scope.STATE;
    $rootScope.user_id;
    $rootScope.user_name;
    $scope.vendorUserData = {};

    $scope.editNewVendor = function (userId, centerId) {

      console.log("USER ID", userId);
      $scope.edituserinfo = {
        "_id": centerId,
        "user_id": userId,
        "change_id": $rootScope.user_id
      };
      value = $scope.edituserinfo;

      NavigationService.boxCall("Vendor/updateUser", value, function (data) {
        toastr.success(" User " + " " + "updated" + " successfully.");
        $scope.closeBox();
      });

      $scope.closeBox = function () {
        $scope.modalInstance.close();
        $scope.getUser();
      };

    };

    $scope.editBoxCustomVendor = function (data, index) {
      $scope.UserEditData = data;
      $scope.index = index;

      $scope.modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: '/backend/views/modal/edit-user-vendor.html',
        size: 'lg',
        scope: $scope,
        vendorUserData: $scope.vendorUserData
      });
    };


    $scope.removeUser = function (value) {
      console.log("USER REMOVE DATA", $scope.json.keyword._id);

      var dataUser = {
        _id: $scope.json.keyword._id,
        user_id: value._id
      };

      NavigationService.boxCall("Vendor/removeUserFromVendor", dataUser, function (data) {
        $scope.newProjectData = data.data;
        $scope.generateField = true;
        // $state.reload();
        $scope.getUser();
      })

    };


    $scope.getUser = function () {
        NavigationService.apiCall("Vendor/findOneVendorUser", {
          [$scope.json.json.preApi.params]: $scope.json.keyword._id
        }, function (data) {
          $scope.vendorUserData = data.data;
          // $scope.generateField = true;
          console.log("vendorUserDATA IS FOUND HERE-->", $scope.stateUserData);
          // console.log("STATEID", $scope.tableData.state._id);
          // console.log("STATEID", $scope.tableData.state.name);
        });
      },

      $scope.getUser();

    $scope.findInstitute = function () {
      NavigationService.apiCall("State/findInstitute", {
        [$scope.json.json.preApi.params]: $scope.json.keyword._id
      }, function (data) {
        $scope.tableData = data.data;
        $scope.generateField = true;
        console.log("TABLEDATA IS FOUND HERE-->", $scope.tableData);
      });
    }
    $scope.findState = function () {
      NavigationService.apiCall("State/findState", {
        [$scope.json.json.preApi.params]: $scope.json.keyword._id
      }, function (data) {
        $scope.stateData = data.data;
        $scope.generateField = true;
        console.log("STATEDATA IS FOUND HERE-->", $scope.stateData);
        // console.log("STATEDATA IS FOUND HERE-->", $scope.stateData[0].name);
        var abc = $scope.stateData;
        var log = [];
        var n = 0;
        _.each($scope.stateData, function (n) {
          console.log("LODASH", n.name);
          console.log("innnnnnn");
          $scope.stateName.push({
            "state": n.name,
            "_id": n._id
          });
          $scope.stateIds.push(n._id);
          console.log("after", $scope.stateName);

          console.log("STATE NAME", $scope.stateName);
        });

      });
    }
    $scope.findInstitute();
    $scope.findState();
    //  START FOR EDIT
    if ($scope.json.json.preApi) {

      NavigationService.apiCall($scope.json.json.preApi.url, {
        [$scope.json.json.preApi.params]: $scope.json.keyword._id
      }, function (data) {
        $scope.data = data.data;
        $scope.generateField = true;
        console.log("DATA IS FOUND HERE-->", $scope.data);

      });
    } else {
      $scope.generateField = true;
    }

    $scope.addBoxVendor = function () {
      $scope.addNewState = function () {
        $scope.newuserinfo = {
          "_id": $scope.json.keyword._id,
          "user_id": $rootScope.user_id,
          "user_name": $rootScope.user_name
        };
        value = $scope.newuserinfo;

        console.log("DATA TO BE SEND", value);
        NavigationService.boxCall("Vendor/addUserToVendor", value, function (data) {
          toastr.success(value.user_name + " User " + " " + "added" + " successfully.");
          $scope.closeBox();
          $scope.getUser();
        })
      };

      $scope.modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: '/backend/views/modal/add-user-vendor.html',
        size: 'lg',
        scope: $scope,
        tableData: $scope.tableData
      });
    };













    //  END FOR EDIT
    $scope.editBoxCustomInstitute = function (data) {

      console.log("DATADATA", data);
      $scope.info = data;
      $scope.newinfo = {};

      NavigationService.apiCall("State/findAllState", {
        [$scope.json.json.preApi.params]: $scope.json.keyword._id
      }, function (data) {
        $scope.AllState = data.data;
        $scope.generateField = true;
        console.log("AllState DATA IS FOUND HERE-->", $scope.AllState);
      });
      // $scope.stateData;
      $scope.modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: '/backend/views/modal/institute-edit2-detail.html',
        size: 'lg',
        scope: $scope,

      });
    };

    $scope.editBoxInstitute = function () {


      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: '/backend/views/modal/institute-edit-detail.html',
        size: 'lg',
        scope: $scope,
        tableData: $scope.tableData
      });
    };

    $scope.addBoxInstitute = function (data) {
      // $scope.newinfo = newdata;
      NavigationService.apiCall("State/findAllState", {
        [$scope.json.json.preApi.params]: $scope.json.keyword._id
      }, function (data) {
        $scope.AllState = data.data;
        $scope.generateField = true;
        console.log("AllState DATA IS FOUND HERE-->", $scope.AllState);
      });

      $scope.newinstituteinfo = {
        "state": data
      };
      $scope.modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: '/backend/views/modal/institute-add.html',
        size: 'lg',
        scope: $scope,
        tableData: $scope.tableData
      });
    };


    $scope.onCancel = function (sendTo) {
      $scope.json.json.action[1].stateName.json.keyword = "";
      $scope.json.json.action[1].stateName.json.page = "";
      $state.go($scope.json.json.action[1].stateName.page, $scope.json.json.action[1].stateName.json);
    };


    $scope.saveInstitute = function (value) {
      console.log("DATA", value);
      NavigationService.boxCall("Institute/save", value, function (data) {
        $scope.projectData = data.data;
        $scope.generateField = true;
        $scope.modalInstance.close();
        $scope.findInstitute();
        toastr.success(value.name + " Institute" + " " + "added" + " successfully.");
      })

    };



    $scope.addNewProject = function (value) {

      console.log("DATA", value);
      NavigationService.boxCall("Institute/addNewProject", value, function (data) {
        $scope.newProjectData = data.data;
        $scope.generateField = true;
        $scope.modalInstance.close();
        $state.reload();
      })

    };
    $scope.removeInstitute = function (value) {

      console.log("Institute REMOVE DATA", value);
      NavigationService.boxCall("State/removeInstitute", value, function (data) {
        $scope.newProjectData = data.data;
        $scope.generateField = true;
        // $state.reload();
        $scope.findInstitute();
      })

    };

    $scope.closeBox = function () {
      $scope.modalInstance.close();
      $scope.findInstitute();
    };


    $scope.saveData = function (formData) {
      console.log("in save");
      console.log("ABC", formData);
      // console.log("PIC",formData.photos[0].photo);
      NavigationService.apiCall($scope.json.json.apiCall.url, formData, function (data) {
        if (data.value === true) {
          $scope.json.json.action[0].stateName.json.keyword = "";
          $scope.json.json.action[0].stateName.json.page = "";
          $state.go($scope.json.json.action[0].stateName.page, $scope.json.json.action[0].stateName.json);
          var messText = "created";
          if ($scope.json.keyword._id) {
            messText = "edited";
          }
          toastr.success($scope.json.json.name + " " + formData.name + " " + messText + " successfully.");
        } else {
          var messText = "creating";
          if ($scope.json.keyword._id) {
            messText = "editing";
          }
          toastr.error("Failed " + messText + " " + $scope.json.json.name);
        }
      });
    };
  })


















  .controller('CentreDetailCtrl', function ($scope, $rootScope, TemplateService, NavigationService, JsonService, $timeout, $state, $stateParams, toastr, $uibModal) {
    $scope.json = JsonService;
    JsonService.setKeyword($stateParams.keyword);
    $scope.template = TemplateService;
    $scope.data = {};
    $scope.AllUser = {};

    $scope.centerData = {};
    console.log("IN Detail controller");
    console.log("SCOPE JSON", $scope.json);
    $rootScope.user_id;
    $rootScope.user_name;

    //  START FOR EDIT
    if ($scope.json.json.preApi) {

      NavigationService.apiCall($scope.json.json.preApi.url, {
        [$scope.json.json.preApi.params]: $scope.json.keyword._id
      }, function (data) {
        $scope.data = data.data;
        $scope.generateField = true;

      });
    } else {
      $scope.generateField = true;
    }


    $scope.getCenter = function () {
      NavigationService.apiCall("Center/findOneCenter", {
        [$scope.json.json.preApi.params]: $scope.json.keyword._id
      }, function (data) {
        $scope.centerData = data.data;
        // $scope.generateField = true;
        console.log("CENTERDATA IS FOUND HERE-->", $scope.centerData);
        // console.log("STATEID", $scope.tableData.state._id);
        // console.log("STATEID", $scope.tableData.state.name);
      });
    }


    $scope.editNewUser = function (userId, centerId) {

      console.log("USER ID", userId);
      $scope.edituserinfo = {
        "_id": centerId,
        "user_id": userId,
        "change_id": $rootScope.user_id
      };
      value = $scope.edituserinfo;

      NavigationService.boxCall("Center/updateUser", value, function (data) {
        toastr.success(" User " + " " + "updated" + " successfully.");
        $scope.closeBox();
      });

      $scope.closeBox = function () {
        $scope.modalInstance.close();
        $scope.getCenter();
      };

    };

    $scope.getCenter();
    $scope.addBoxUser = function (data) {
      // $scope.newinfo = newdata;
      NavigationService.apiCall("Center/findAlluser", {
        [$scope.json.json.preApi.params]: $scope.json.keyword._id
      }, function (data) {
        $scope.AllUser = data.data;
        $scope.generateField = true;
        console.log("AllState DATA IS FOUND HERE-->", $scope.AllState);
      });
      $scope.addNewUser = function () {
        $scope.newuserinfo = {
          "_id": $scope.json.keyword._id,
          "user_id": $rootScope.user_id,
          "user_name": $rootScope.user_name
        };
        value = $scope.newuserinfo;

        NavigationService.boxCall("Center/addUserToCenter", value, function (data) {
          toastr.success(value.user_name + " User " + " " + "added" + " successfully.");
          $scope.closeBox();
        })
      };

      $scope.modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: '/backend/views/modal/add-user.html',
        size: 'lg',
        scope: $scope,
        tableData: $scope.tableData
      });
      $scope.closeBox = function () {
        $scope.modalInstance.close();
        $scope.getCenter();

      };
    };

    $scope.removeUser = function (value) {
      console.log("USER REMOVE DATA", $scope.json.keyword._id);

      var dataUser = {
        _id: $scope.json.keyword._id,
        user_id: value._id
      };

      NavigationService.boxCall("Center/removeUserFromCenter", dataUser, function (data) {
        $scope.newProjectData = data.data;
        $scope.generateField = true;
        // $state.reload();
        $scope.getCenter();
      })

    };

    $scope.addNewUser = function (value) {

      console.log("DATA", value);

      // NavigationService.boxCall("Institute/addNewUser", value, function (data) {
      //   $scope.newProjectData = data.data;
      //   $scope.generateField = true;
      //   $scope.modalInstance.close();
      //   $state.reload();
      // })

    };



    $scope.onCancel = function (sendTo) {
      $scope.json.json.action[1].stateName.json.keyword = "";
      $scope.json.json.action[1].stateName.json.page = "";
      $state.go($scope.json.json.action[1].stateName.page, $scope.json.json.action[1].stateName.json);
    };

    $scope.editBoxCustomUser = function (data, index) {
      $scope.UserEditData = data;
      $scope.index = index;

      $scope.modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: '/backend/views/modal/edit-user.html',
        size: 'lg',
        scope: $scope,
        editUserData: $scope.UserEditData
      });
    };

    //  END FOR EDIT
    $scope.onCancel = function (sendTo) {
      $scope.json.json.action[1].stateName.json.keyword = "";
      $scope.json.json.action[1].stateName.json.page = "";
      $state.go($scope.json.json.action[1].stateName.page, $scope.json.json.action[1].stateName.json);
    };

    $scope.saveData = function (formData) {
      console.log("in save");
      console.log("ABC", formData);
      // console.log("PIC",formData.photos[0].photo);
      NavigationService.apiCall($scope.json.json.apiCall.url, formData, function (data) {
        if (data.value === true) {
          $scope.json.json.action[0].stateName.json.keyword = "";
          $scope.json.json.action[0].stateName.json.page = "";
          $state.go($scope.json.json.action[0].stateName.page, $scope.json.json.action[0].stateName.json);
          var messText = "created";
          if ($scope.json.keyword._id) {
            messText = "edited";
          }
          toastr.success($scope.json.json.name + " " + formData.name + " " + messText + " successfully.");
        } else {
          var messText = "creating";
          if ($scope.json.keyword._id) {
            messText = "editing";
          }
          toastr.error("Failed " + messText + " " + $scope.json.json.name);
        }
      });
    };
  })

  .controller('ProjectDetailCtrl', function ($scope, TemplateService, NavigationService, JsonService, $timeout, $state, $stateParams, $uibModal, toastr) {
    $scope.json = JsonService;
    JsonService.setKeyword($stateParams.keyword);
    $scope.template = TemplateService;
    $scope.data = {};
    console.log("IN PROJECT controller");
    console.log("SCOPE JSON", $scope.json);
    $scope.tableData = {};
    $scope.stateData = {};
    $scope.projectDATA = {};
    $scope.stateName = [];
    $scope.stateIds = [];
    $scope.STATE;

    $scope.projectID = {};




    // $scope.findInstitute = function () {
    //   NavigationService.apiCall("State/findInstitute", {
    //     [$scope.json.json.preApi.params]: $scope.json.keyword._id
    //   }, function (data) {
    //     $scope.tableData = data.data;
    //     $scope.generateField = true;
    //     console.log("TABLEDATA IS FOUND HERE-->", $scope.tableData);
    //   });
    // }
    // $scope.findState = function () {
    //   NavigationService.apiCall("State/findState", {
    //     [$scope.json.json.preApi.params]: $scope.json.keyword._id
    //   }, function (data) {
    //     $scope.stateData = data.data;
    //     $scope.generateField = true;
    //     console.log("STATEDATA IS FOUND HERE-->", $scope.stateData);
    //     // console.log("STATEDATA IS FOUND HERE-->", $scope.stateData[0].name);
    //     var abc = $scope.stateData;
    //     var log = [];
    //     var n = 0;
    //     _.each($scope.stateData, function (n) {
    //       console.log("LODASH", n.name);
    //       console.log("innnnnnn");
    //       $scope.stateName.push({
    //         "state": n.name,
    //         "_id": n._id
    //       });
    //       $scope.stateIds.push(n._id);
    //       console.log("after", $scope.stateName);

    //       console.log("STATE NAME", $scope.stateName);
    //     });

    //   });
    // }

    $scope.findProject = function () {
      console.log('datttttttta1111');
      NavigationService.apiCall("Project/findOneProject", {
        [$scope.json.json.preApi.params]: $scope.json.keyword._id
      }, function (data) {
        // var mydata = _.cloneDeep(data.data);
        // console.log('mydatatttttttttttt',mydata);
        $scope.projectDATA = data.data;
        $scope.tableData = data.data;
        $scope.generateField = true;
        console.log("TABLEDATA IS FOUND HERE-->", $scope.tableData);
      });
    }



    $scope.findProject();
    // $scope.findState();
    //  START FOR EDIT
    if ($scope.json.json.preApi) {

      NavigationService.apiCall($scope.json.json.preApi.url, {
        [$scope.json.json.preApi.params]: $scope.json.keyword._id
      }, function (data) {
        $scope.data = data.data;
        $scope.generateField = true;
        console.log("DATA IS FOUND HERE-->", $scope.data);

      });
    } else {
      $scope.generateField = true;
    }


    //  END FOR EDIT
    $scope.editBoxCustomProjectPhotos = function (data) {

      console.log("DATADATA", data);
      $scope.datainfo = data;
      $scope.newinfo = {};
      $scope.modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: '/backend/views/modal/image-edit-edit.html',
        size: 'lg',
        scope: $scope,

      });
    };

    $scope.editBoxInstitute = function () {


      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: '/backend/views/modal/institute-edit-detail.html',
        size: 'lg',
        scope: $scope,
        tableData: $scope.tableData
      });
    };

    $scope.addBoxProjectImage = function (data) {
      console.log("DATADATA", data);

      $scope.projectinfo = {
        _id: data

      };

      $scope.modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: '/backend/views/modal/image-edit.html',
        size: 'lg',
        scope: $scope,
        tableData: $scope.tableData
      });
    };


    $scope.onCancel = function (sendTo) {
      $scope.json.json.action[1].stateName.json.keyword = "";
      $scope.json.json.action[1].stateName.json.page = "";
      $state.go($scope.json.json.action[1].stateName.page, $scope.json.json.action[1].stateName.json);
    };


    $scope.saveProjectPhotos = function (value) {
      console.log("DATA", value);

      console.log("INSIDE SPP");
      NavigationService.boxCall("Project/saveProjectPhotos", value, function (data) {
        $scope.projectData = data.data;
        $scope.generateField = true;
        $scope.modalInstance.close();
        $scope.findProject();
        toastr.success(value.name + " Project" + " " + "added" + " successfully.");
      })

    };

    $scope.updateProjectPhotos = function (value) {
      console.log("DATA", value);
      NavigationService.boxCall("Project/save", value, function (data) {
        $scope.projectData = data.data;
        $scope.generateField = true;
        $scope.modalInstance.close();
        $scope.findProject();
        toastr.success(" Project" + " " + "updated" + " successfully.");
      })

    };


    $scope.saveEditProjectPhotos = function (value) {
      console.log("DATA", value);
      NavigationService.boxCall("Project/save", value, function (data) {
        $scope.projectData = data.data;
        $scope.generateField = true;
        $scope.modalInstance.close();
        $scope.findProject();
        toastr.success(" Project" + " " + "updated" + " successfully.");
      })

    };


    $scope.addNewProject = function (value) {

      console.log("DATA", value);
      NavigationService.boxCall("Institute/addNewProject", value, function (data) {
        $scope.newProjectData = data.data;
        $scope.generateField = true;
        $scope.modalInstance.close();
        $state.reload();
      })

    };
    $scope.removeProjectPhotos = function (value, project) {

      // var abc ={};
      // abc = value;
      // abc.project=project;
      // console.log("PROJECT ",project);
      console.log("PROJECT IMAGE afdadfdaTA", value);

      NavigationService.boxCall("Project/removeProjectPhotos", value, function (data) {
        $scope.newProjectData = data.data;
        $scope.generateField = true;
        // $state.reload();
        $scope.findProject();
      })

    };

    $scope.closeBox = function () {
      $scope.modalInstance.close();
      $scope.findProject();
    };


    $scope.saveData = function (formData) {
      console.log("in save");
      console.log("ABC", formData);
      // console.log("PIC",formData.photos[0].photo);
      NavigationService.apiCall($scope.json.json.apiCall.url, formData, function (data) {
        if (data.value === true) {
          $scope.json.json.action[0].stateName.json.keyword = "";
          $scope.json.json.action[0].stateName.json.page = "";
          $state.go($scope.json.json.action[0].stateName.page, $scope.json.json.action[0].stateName.json);
          var messText = "created";
          if ($scope.json.keyword._id) {
            messText = "edited";
          }
          toastr.success($scope.json.json.name + " " + formData.name + " " + messText + " successfully.");
        } else {
          var messText = "creating";
          if ($scope.json.keyword._id) {
            messText = "editing";
          }
          toastr.error("Failed " + messText + " " + $scope.json.json.name);
        }
      });
    };
  })



  .controller('DetailFieldCtrl', function ($scope, TemplateService, NavigationService, JsonService, $timeout, $state, $stateParams, $uibModal, toastr) {
    if (!$scope.type.type) {
      $scope.type.type = "text";
    }
    $scope.json = JsonService;
    $scope.tags = {};
    $scope.model = [];
    $scope.tagNgModel = {};
    // $scope.boxModel
    $scope.tinymceOptions = {
      selector: 'textarea',
      height: 500,
      theme: 'modern',
      plugins: [
        'advlist autolink lists link image charmap print preview hr anchor pagebreak',
        'searchreplace wordcount visualblocks visualchars code fullscreen',
        'insertdatetime media nonbreaking save table contextmenu directionality',
        'emoticons template paste textcolor colorpicker textpattern imagetools '
      ],
      toolbar1: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
      toolbar2: 'print preview media | forecolor backcolor emoticons',
      image_advtab: true,
      readonly: $scope.type.disabled,
      templates: [{
        title: 'Test template 1',
        content: 'Test 1'
      }, {
        title: 'Test template 2',
        content: 'Test 2'
      }],
      content_css: [
        '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
        '//www.tinymce.com/css/codepen.min.css'
      ]
    };
    if ($scope.type.validation) {
      var isRequired = _.findIndex($scope.type.validation, function (n) {
        return n == "required";
      });
      if (isRequired >= 0) {
        $scope.type.required = true;
      }
    }
    $scope.form = {};
    if ($scope.value && $scope.value[$scope.type.tableRef]) {
      $scope.form.model = $scope.value[$scope.type.tableRef];
    }

    $scope.template = "views/field/" + $scope.type.type + ".html";

    // BOX


    $scope.saveDataBox = function () {
      console.log("IN CNTROL OD SAVE DTAA");
    };

    if ($scope.type.type == "date") {
      $scope.formData[$scope.type.tableRef] = moment($scope.formData[$scope.type.tableRef]).toDate();
    }
    if ($scope.type.type == "password") {
      $scope.formData[$scope.type.tableRef] = "";
    }
    if ($scope.type.type == "youtube") {
      $scope.youtube = {};

      function getJsonFromUrl(string) {
        var obj = _.split(string, '?');
        var returnval = {};
        if (obj.length >= 2) {
          obj = _.split(obj[1], '&');
          _.each(obj, function (n) {
            var newn = _.split(n, "=");
            returnval[newn[0]] = newn[1];
            return;
          });
          return returnval;
        }

      }
      $scope.changeYoutubeUrl = function (string) {
        if (string) {
          $scope.formData[$scope.type.tableRef] = "";
          var result = getJsonFromUrl(string);
          console.log(result);
          if (result && result.v) {
            $scope.formData[$scope.type.tableRef] = result.v;
          }
        }

      };
    }
    if ($scope.type.type == "box") {

      if (!_.isArray($scope.formData[$scope.type.tableRef]) && $scope.formData[$scope.type.tableRef] === '') {
        $
        scope.formData[$scope.type.tableRef] = [];
        $scope.model = [];
      } else {
        if ($scope.formData[$scope.type.tableRef]) {
          $scope.model = $scope.formData[$scope.type.tableRef];
        }
      }
      $scope.search = {
        text: ""
      };
    }
    if ($scope.type.type == "box2") {

      if (!_.isArray($scope.formData[$scope.type.tableRef]) && $scope.formData[$scope.type.tableRef] === '') {
        $
        scope.formData[$scope.type.tableRef] = [];
        $scope.model = [];
      } else {
        if ($scope.formData[$scope.type.tableRef]) {
          $scope.model = $scope.formData[$scope.type.tableRef];
        }
      }
      $scope.search = {
        text: ""
      };
    }
    $scope.state = "";
    $scope.createBox = function (state) {
      $scope.state = state;
      $scope.model.push({});
      $scope.editBox("Create", $scope.model[$scope.model.length - 1]);
    };
    $scope.editBox = function (state, data) {
        $scope.state = state;
        $scope.data = data;
        $scope.formData[$scope.type.tableRef] = data;
        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          templateUrl: '/backend/views/modal/modal.html',
          size: 'lg',
          scope: $scope,
          formData: $scope.data
        });
      },

      $scope.editBox2 = function (state, data) {
        $scope.state = state;
        $scope.data = data;
        $scope.data2 = data;
        $scope.data = data2.concat(data);
        $scope.data3 = data2.concat(data);
        $scope.formData[$scope.type.tableRef] = data;
        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          templateUrl: '/backend/views/modal/modal.html',
          size: 'lg',
          scope: $scope,
          formData: $scope.data
        });
      },
      /////////////////////////////////////
      // vm.updateUser = function(selectedUser) {
      //     $scope.selectedUser = selectedUser;
      //     var modalInstance = $uibModal.open({
      //         animation: true,
      //         templateUrl: 'app/views/pages/modal.html',
      //         resolve: {
      //             user: function () {
      //                 return $scope.selectedUser;
      //             }
      //         },
      //         controller: function($scope, user) {
      //             $scope.user = user;
      //         }
      //     });
      //     modalInstance.result.then(function(selectedUser) {
      //         $scope.selected = selectedUser;
      //     });
      //};

      $scope.editBoxTable = function (state, data) {
        $scope.state = state;
        $scope.data = data;
        $scope.selectedUser = data;

        $scope.formData[$scope.type.tableRef] = data;
        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          templateUrl: '/backend/views/modal/modalData.html',
          size: 'lg',
          scope: $scope,
          formData: $scope.data,
          resolve: {
            user: function () {
              console.log("DATA", $scope.selectedUser);
              return $scope.selectedUser;
            }
          },
          controller: function ($scope, user) {
            $scope.user = user;
          },
          close: function (result) {
            $modalStack.close(modalInstance, result);
            console.log("RESULT", result);
          }
        });
        modalInstance.result.then(function (result) {
          console.log(result.name);

        });
        /////////////////////////
        $scope.close = function (value) {
          // callback(value);
          console.log("DATA", value);
          NavigationService.boxCall("Project/saveProject", value, function (data) {
            $scope.data = data.data;
            $scope.generateField = true;

          });

          modalInstance.close("cancel");
        };
      };
    $scope.deleteBox = function (index, data) {
      console.log(data);
      data.splice(index, 1);
    };

    //  TAGS STATIC AND FROM TABLE
    $scope.refreshTags = function (search) {
      if ($scope.type.url !== "") {
        NavigationService.searchCall($scope.type.url, {
          keyword: search
        }, 1, function (data1) {
          $scope.tags[$scope.type.tableRef] = data1.data.results;
        });
      } else {
        $scope.tags[$scope.type.tableRef] = $scope.type.dropDown;
      }
    };
    if ($scope.type.type == "tags") {
      $scope.refreshTags();
    }

    $scope.tagClicked = function (select, index) {
      if ($scope.type.fieldType === "array") {
        $scope.formData[$scope.type.tableRef] = [];
        _.each(select, function (n) {
          $scope.formData[$scope.type.tableRef].push(n._id);
        });
      } else {
        $scope.formData[$scope.type.tableRef] = select;
      }
    };
  })

  .controller('LoginCtrl', function ($scope, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
    //Used to name the .html file
    $scope.menutitle = NavigationService.makeactive("Login");
    TemplateService.title = $scope.menutitle;
    $scope.currentHost = window.location.origin;
    if ($stateParams.id) {
      if ($stateParams.id === "AccessNotAvailable") {
        toastr.error("You do not have access for the Backend.");
      } else {
        NavigationService.parseAccessToken($stateParams.id, function () {
          NavigationService.profile(function () {
            $state.go("dashboard");
          }, function () {
            $state.go("login");
          });
        });
      }
    } else {
      NavigationService.removeAccessToken();
    }

  })

  .controller('CountryCtrl', function ($scope, TemplateService, NavigationService, $timeout, $state, $stateParams, toastr) {
    //Used to name the .html file
    $scope.template = TemplateService.changecontent("country-list");
    $scope.menutitle = NavigationService.makeactive("Country List");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();
    $scope.currentPage = $stateParams.page;
    var i = 0;
    $scope.search = {
      keyword: ""
    };
    if ($stateParams.keyword) {
      $scope.search.keyword = $stateParams.keyword;
    }
    $scope.showAllCountries = function (keywordChange) {
      $scope.totalItems = undefined;
      if (keywordChange) {
        $scope.currentPage = 1;
      }
      NavigationService.searchCountry({
        page: $scope.currentPage,
        keyword: $scope.search.keyword
      }, ++i, function (data, ini) {
        if (ini == i) {
          $scope.countries = data.data.results;
          $scope.totalItems = data.data.total;
          $scope.maxRow = data.data.options.count;
        }
      });
    };

    $scope.changePage = function (page) {
      var goTo = "country-list";
      if ($scope.search.keyword) {
        goTo = "country-list";
      }
      $state.go(goTo, {
        page: page,
        keyword: $scope.search.keyword
      });
    };
    $scope.showAllCountries();
    $scope.deleteCountry = function (id) {
      globalfunction.confDel(function (value) {
        console.log(value);
        if (value) {
          NavigationService.deleteCountry(id, function (data) {
            if (data.value) {
              $scope.showAllCountries();
              toastr.success("Country deleted successfully.", "Country deleted");
            } else {
              toastr.error("There was an error while deleting country", "Country deleting error");
            }
          });
        }
      });
    };
  })

  .controller('CreateCountryCtrl', function ($scope, TemplateService, NavigationService, $timeout, $state, toastr) {
    //Used to name the .html file

    $scope.template = TemplateService.changecontent("country-detail");
    $scope.menutitle = NavigationService.makeactive("Country");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();

    $scope.header = {
      "name": "Create Country"
    };
    $scope.formData = {};
    $scope.saveCountry = function (formData) {
      console.log($scope.formData);
      NavigationService.countrySave($scope.formData, function (data) {
        if (data.value === true) {
          $state.go('country-list');
          toastr.success("Country " + formData.name + " created successfully.", "Country Created");
        } else {
          toastr.error("Country creation failed.", "Country creation error");
        }
      });
    };

  })

  .controller('CreateAssignmentCtrl', function ($scope, TemplateService, NavigationService, $timeout, $state, toastr, $stateParams, $uibModal) {
    //Used to name the .html file

    $scope.template = TemplateService.changecontent("assignment-detail");
    $scope.menutitle = NavigationService.makeactive("Assignment");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();

    $scope.header = {
      "name": "Create Assignment"
    };
    $scope.formData = {};
    $scope.formData.status = true;
    $scope.formData.invoice = [];
    $scope.formData.products = [];
    $scope.formData.LRs = [];
    $scope.formData.vehicleNumber = [];
    $scope.formData.others = [];
    $scope.formData.shareWith = [];
    $scope.modalData = {};
    $scope.modalIndex = "";
    $scope.wholeObj = [];
    $scope.addModels = function (dataArray, data) {
      dataArray.push(data);
    };

    // NavigationService.searchNatureLoss(function(data) {
    //     $scope.natureLoss = data.data.results;
    // });

    $scope.refreshShareWith = function (data, office) {
      var formdata = {};
      formdata.search = data;
      formdata.filter = {
        "postedAt": office
      };
      NavigationService.searchEmployee(formdata, 1, function (data) {
        $scope.shareWith = data.data.results;
      });
    };
    $scope.refreshNature = function (data, causeloss) {
      var formdata = {};
      formdata.search = data;
      formdata.filter = {
        "_id": causeloss
      };
      NavigationService.getNatureLoss(formdata, 1, function (data) {
        $scope.natureLoss = data.data.results;
      });
    };

    $scope.addModal = function (filename, index, holdobj, data, current, wholeObj) {
      if (index !== "") {
        $scope.modalData = data;
        $scope.modalIndex = index;
      } else {
        $scope.modalData = {};
        $scope.modalIndex = "";
      }
      $scope.wholeObj = wholeObj;
      $scope.current = current;
      $scope.holdObject = holdobj;
      var modalInstance = $uibModal.open({
        scope: $scope,
        templateUrl: 'views/modal/' + filename + '.html',
        size: 'lg'
      });
    };

    $scope.addElements = function (moddata) {
      if ($scope.modalIndex !== "") {
        $scope.wholeObj[$scope.modalIndex] = moddata;
      } else {
        $scope.newjson = moddata;
        var a = moddata;
        switch ($scope.holdObject) {
          case "invoice":
            {
              var newmod = a.invoiceNumber.split(',');
              _.each(newmod, function (n) {
                $scope.newjson.invoiceNumber = n;
                $scope.wholeObj.push($scope.newjson);
              });
            }
            break;
          case "products":
            {
              var newmod1 = a.item.split(',');
              _.each(newmod1, function (n) {
                $scope.newjson.item = n;
                $scope.wholeObj.push($scope.newjson);
              });
            }
            break;
          case "LRs":
            var newmod2 = a.lrNumber.split(',');
            _.each(newmod2, function (n) {
              $scope.newjson.lrNumber = n;
              $scope.wholeObj.push($scope.newjson);
            });
            break;
          case "Vehicle":
            var newmod3 = a.vehicleNumber.split(',');
            _.each(newmod3, function (n) {
              $scope.newjson.vehicleNumber = n;
              $scope.wholeObj.push($scope.newjson);
            });
            break;

          default:
            {
              $scope.wholeObj.push($scope.newjson);
            }

        }

      }
    };

    $scope.deleteElements = function (index, data) {
      data.splice(index, 1);
    };


    $scope.submit = function (formData) {
      console.log($scope.formData);
      NavigationService.assignmentSave($scope.formData, function (data) {
        if (data.value === true) {
          $state.go('assignment-list');
          toastr.success("Assignment " + formData.name + " created successfully.", "Assignment Created");
        } else {
          toastr.error("Assignment creation failed.", "Assignment creation error");
        }
      });
    };

  })

  .controller('EditAssignmentCtrl', function ($scope, TemplateService, NavigationService, $timeout, $state, toastr, $stateParams, $uibModal) {
    //Used to name the .html file

    $scope.template = TemplateService.changecontent("assignment-detail");
    $scope.menutitle = NavigationService.makeactive("Assignment");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();

    $scope.header = {
      "name": "Edit Assignment"
    };
    $scope.formData = {};
    $scope.formData.status = true;
    $scope.formData.invoice = [];
    $scope.formData.products = [];
    $scope.formData.LRs = [];
    $scope.formData.vehicleNumber = [];
    $scope.formData.others = [];
    $scope.formData.shareWith = [];
    $scope.modalData = {};
    $scope.modalIndex = "";
    $scope.wholeObj = [];
    $scope.addModels = function (dataArray, data) {
      dataArray.push(data);
    };

    NavigationService.getOneModel("Assignment", $stateParams.id, function (data) {
      $scope.formData = data.data;
      $scope.formData.dateOfIntimation = new Date(data.data.dateOfIntimation);
      $scope.formData.dateOfAppointment = new Date(data.data.dateOfAppointment);
      $scope.formData.country = data.data.city.district.state.zone.country._id;
      $scope.formData.zone = data.data.city.district.state.zone._id;
      $scope.formData.state = data.data.city.district.state._id;
      $scope.formData.district = data.data.city.district._id;
      $scope.formData.city = data.data.city._id;
      $scope.formData.insuredOfficer = data.data.insuredOfficer._id;
      console.log($scope.formData.policyDoc);
      console.log($scope.formData);
    });


    $scope.refreshShareWith = function (data, office) {
      var formdata = {};
      formdata.search = data;
      formdata.filter = {
        "postedAt": office
      };
      NavigationService.searchEmployee(formdata, 1, function (data) {
        $scope.shareWith = data.data.results;
      });
    };
    $scope.refreshNature = function (data, causeloss) {
      var formdata = {};
      formdata.search = data;
      formdata.filter = {
        "_id": causeloss
      };
      NavigationService.getNatureLoss(formdata, 1, function (data) {
        $scope.natureLoss = data.data.results;
      });
    };

    $scope.addModal = function (filename, index, holdobj, data, current, wholeObj) {
      if (index !== "") {
        $scope.modalData = data;
        $scope.modalIndex = index;
      } else {
        $scope.modalData = {};
        $scope.modalIndex = "";
      }
      $scope.wholeObj = wholeObj;
      $scope.current = current;
      $scope.holdObject = holdobj;
      var modalInstance = $uibModal.open({
        scope: $scope,
        templateUrl: 'views/modal/' + filename + '.html',
        size: 'lg'
      });
    };

    $scope.addElements = function (moddata) {
      if ($scope.modalIndex !== "") {
        $scope.wholeObj[$scope.modalIndex] = moddata;
      } else {
        $scope.newjson = moddata;
        var a = moddata;
        switch ($scope.holdObject) {
          case "invoice":
            {
              var newmod = a.invoiceNumber.split(',');
              _.each(newmod, function (n) {
                $scope.newjson.invoiceNumber = n;
                $scope.wholeObj.push($scope.newjson);
              });
            }
            break;
          case "products":
            {
              var newmod1 = a.item.split(',');
              _.each(newmod1, function (n) {
                $scope.newjson.item = n;
                $scope.wholeObj.push($scope.newjson);
              });
            }
            break;
          case "LRs":
            var newmod2 = a.lrNumber.split(',');
            _.each(newmod2, function (n) {
              $scope.newjson.lrNumber = n;
              $scope.wholeObj.push($scope.newjson);
            });
            break;
          case "Vehicle":
            var newmod3 = a.vehicleNumber.split(',');
            _.each(newmod3, function (n) {
              $scope.newjson.vehicleNumber = n;
              $scope.wholeObj.push($scope.newjson);
            });
            break;

          default:
            {
              $scope.wholeObj.push($scope.newjson);
            }

        }

      }
    };

    $scope.deleteElements = function (index, data) {
      data.splice(index, 1);
    };


    $scope.submit = function (formData) {
      console.log($scope.formData);
      NavigationService.assignmentSave($scope.formData, function (data) {
        if (data.value === true) {
          $state.go('assignment-list');
          toastr.success("Assignment " + formData.name + " created successfully.", "Assignment Created");
        } else {
          toastr.error("Assignment creation failed.", "Assignment creation error");
        }
      });
    };

  })

  .controller('EditCountryCtrl', function ($scope, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
    //Used to name the .html file

    $scope.template = TemplateService.changecontent("country-detail");
    $scope.menutitle = NavigationService.makeactive("Country");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();

    $scope.header = {
      "name": "Edit Country"
    };

    NavigationService.getOneCountry($stateParams.id, function (data) {
      $scope.formData = data.data;
      console.log('$scope.oneCountry', $scope.oneCountry);

    });

    $scope.saveCountry = function (formValid) {
      NavigationService.countryEditSave($scope.formData, function (data) {
        if (data.value === true) {
          $state.go('country-list');
          console.log("Check this one");
          toastr.success("Country " + $scope.formData.name + " edited successfully.", "Country Edited");
        } else {
          toastr.error("Country edition failed.", "Country editing error");
        }
      });
    };

  })

  .controller('SchemaCreatorCtrl', function ($scope, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
    //Used to name the .html file
    $scope.template = TemplateService.changecontent("schema-creator");
    $scope.menutitle = NavigationService.makeactive("Schema Creator");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();
    $scope.collectionTypes = ["Table View", "Table View Drag and Drop", "Grid View", "Grid View Drag and Drop"];
    $scope.schema = [{
        "schemaType": "Boolean",
        "Input1": "",
        "Input2": ""
      }, {
        "schemaType": "Color",
        "Input1": "",
        "Input2": ""
      }, {
        "schemaType": "Date",
        "Input1": "",
        "Input2": ""
      }, {
        "schemaType": "Email",
        "Input1": "",
        "Input2": ""
      }, {
        "schemaType": "File",
        "Input1": "MB Limit",
        "Input2": ""
      }, {
        "schemaType": "Image",
        "Input1": "pixel x",
        "Input2": "pixel y "
      }, {
        "schemaType": "Location",
        "Input1": "",
        "Input2": ""
      }, {
        "schemaType": "Mobile",
        "Input1": "",
        "Input2": ""
      }, {
        "schemaType": "Multiple Select",
        "Input1": "Enum",
        "Input2": ""
      }, {
        "schemaType": "Multiple Select From Table",
        "Input1": "Collection",
        "Input2": "Field"
      }, {
        "schemaType": "Number",
        "Input1": "min ",
        "Input2": "max"
      }, {
        "schemaType": "Single Select ",
        "Input1": "Enum",
        "Input2": ""
      },

      {
        "schemaType": "Single Select From Table",
        "Input1": "Collection",
        "Input2": "Field"
      }, {
        "schemaType": "Telephone",
        "Input1": "",
        "Input2": ""
      }, {
        "schemaType": "Text",
        "Input1": "min length",
        "Input2": "max length"
      }, {
        "schemaType": "TextArea",
        "Input1": "min length",
        "Input2": "max length"
      }, {
        "schemaType": "URL",
        "Input1": "",
        "Input2": ""
      }, {
        "schemaType": "WYSIWYG",
        "Input1": "",
        "Input2": ""
      }, {
        "schemaType": "Youtube",
        "Input1": "",
        "Input2": ""
      }
    ];


    $scope.inputTypes = [{
      value: '',
      name: 'Select type of input'
    }, {
      value: 'Text',
      name: 'Text'
    }, {
      value: 'Date',
      name: 'Date'
    }, {
      value: 'Textarea',
      name: 'Textarea'
    }];

    $scope.formData = {};
    $scope.formData.status = true;

    $scope.formData.forms = [{
      head: '',
      items: [{}, {}]
    }];

    $scope.addHead = function () {
      $scope.formData.forms.push({
        head: $scope.formData.forms.length + 1,
        items: [{}]
      });
    };
    $scope.removeHead = function (index) {
      if ($scope.formData.forms.length > 1) {
        $scope.formData.forms.splice(index, 1);
      } else {
        $scope.formData.forms = [{
          head: '',
          items: [{}, {}]
        }];
      }
    };

    $scope.addItem = function (obj) {
      var index = $scope.formData.forms.indexOf(obj);
      $scope.formData.forms[index].items.push({});
    };

    $scope.removeItem = function (obj, indexItem) {
      var indexHead = $scope.formData.forms.indexOf(obj);
      if ($scope.formData.forms[indexHead].items.length > 1) {
        $scope.formData.forms[indexHead].items.splice(indexItem, 1);
      } else {
        $scope.formData.forms[indexHead].items = [{}];
      }
    };

  })

  .controller('EditInstituteCtrl', function ($scope, TemplateService, NavigationService, $timeout, $state, toastr, $stateParams, $uibModal) {
    $scope.template = TemplateService.changecontent("institute-detail");
    $scope.menutitle = NavigationService.makeactive("Institute");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();
    $scope.editBoxProject = function () {
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: '/backend/views/modal/project-detail.html',
        size: 'lg',
        scope: $scope,
      });
    };
  })

  .controller('EditStateCtrl', function ($scope, TemplateService, NavigationService, $timeout, $state, toastr, $stateParams, $uibModal) {
    $scope.template = TemplateService.changecontent("state-detail");
    $scope.menutitle = NavigationService.makeactive("State");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();
    $scope.editBoxInstitute = function () {
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: '/backend/views/modal/institute-detail.html',
        size: 'lg',
        scope: $scope,
      });
    };
  })

  .controller('headerctrl', function ($scope, TemplateService, $uibModal) {
    $scope.template = TemplateService;
    $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
      $(window).scrollTop(0);
    });

  })

  .controller('languageCtrl', function ($scope, TemplateService, $translate, $rootScope) {

    $scope.changeLanguage = function () {
      console.log("Language CLicked");

      if (!$.jStorage.get("language")) {
        $translate.use("hi");
        $.jStorage.set("language", "hi");
      } else {
        if ($.jStorage.get("language") == "en") {
          $translate.use("hi");
          $.jStorage.set("language", "hi");
        } else {
          $translate.use("en");
          $.jStorage.set("language", "en");
        }
      }
      //  $rootScope.$apply();
    };
  });