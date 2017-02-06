var jsonservicemod = angular.module('jsonservicemod', ["templateservicemod", "toastr", "ui.bootstrap"]);
jsonservicemod.service('JsonService', function ($http, TemplateService, $state, toastr, $uibModal, NavigationService) {
  this.json = {};
  this.keyword = {};
  this.refreshView;
  var JsonService = this;
  this.setKeyword = function (data) {
    try {
      this.keyword = JSON.parse(data);
      console.log(this.keyword);
    } catch (e) {
      console.log("keyword is not is json format");
    }
  };
  this.getJson = function (page, callback) {
    $http.get("pageJson/" + page + ".json").then(function (data) {
      data = data.data;
      JsonService.json = data;
      console.log("DATA---->", data);
      console.log("DATA-PAGETYPE--->", data.pageType);

      switch (data.pageType) {
        case "view":
          {
            TemplateService.changecontent("view");
          }
          break;

        case "create":
          {
            TemplateService.changecontent("detail");
          }
          break;

        case "edit":
          {
            console.log("IN EDIT");
            TemplateService.changecontent("detail");
          }
          break;
        case "customedit":
          {
            console.log("IN CUSTOM EDIT");
            TemplateService.changecontent("institute-detail");
          }
          break;
        case "stateedit":
          {
            console.log("IN STATE EDIT");
            TemplateService.changecontent("state-detail2");
          }
          break;

        case "projectedit":
          {
            console.log("IN PROJECT EDIT");
            TemplateService.changecontent("project-detail");
          }
          break;
        case "centreedit":
          {
            console.log("IN Centre EDIT");
            TemplateService.changecontent("centre-detail");
          }
          break;

        case "vendoredit":
          {
            console.log("IN Centre EDIT");
            TemplateService.changecontent("vendor-detail");
          }
          break;
      }
      callback();
    });

  };
  this.deleteFunction = function (callback) {

    var modalInstance = $uibModal.open({
      // animation: $scope.animationsEnabled,
      templateUrl: '/backend/views/modal/conf-delete.html',
      size: 'sm',
      scope: this
    });
    // this.close = function (value) {
    //   callback(value);
    //   modalInstance.close("cancel");
    // };
  };

  var openCustomModal = function (size, title, message) {
    // var actionToPerformOnConfirm = action;
    console.log("in model");
    var modalInstance = $uibModal.open({
      templateUrl: '/backend/views/modal/conf-delete.html',
      size: "lg",
      resolve: {
        title: title,
        message: message
      }
    });
  };

  this.eventModal = function (value) {
    console.log(value);
  };


  this.eventAction = function (action, value) {
    var sendTo = {
      id: action.action
    };
    console.log("ACTION-->", action);
    console.log("ACTION.ACTION-->", action);
    console.log("VALUE-->", value);


    if (action.type == "box") {
      JsonService.modal = action;
      globalfunction.openModal(function (data) {
        console.log(data);
      });
    } else {
      if (value && action && action.fieldsToSend) {
        var keyword = {};
        _.each(action.fieldsToSend, function (n, key) {
          keyword[key] = value[n];
        });
        sendTo.keyword = JSON.stringify(keyword);
      }
      if (action && action.type == "page") {
        console.log("IN PAGE TYPE");
        $state.go("page", sendTo);
      } else if (action && action.type == "custompage") {
        console.log("IN CUSTOMPAGE TYPE");
        $state.go("custompage", sendTo);
      } else if (action && action.type == "statepage") {
        console.log("IN statePAGE TYPE");
        $state.go("statepage", sendTo);
      } else if (action && action.type == "projectpage") {
        console.log("IN PROJECT TYPE");
        $state.go("projectpage", sendTo);
      } else if (action && action.type == "centrepage") {
        console.log("IN Centre TYPE");
        $state.go("centrepage", sendTo);

      }
       else if (action && action.type == "vendorpage") {
        console.log("IN Vendor TYPE");
        $state.go("vendorpage", sendTo);

      }
      
       else if (action && action.type == "apiCallConfirm") {
        globalfunction.confDel(function (value2) {
          if (value2) {
            NavigationService.delete(action.api, value, function (data) {
              if (data.value) {
                toastr.success(JsonService.json.title + " deleted successfully.", JsonService.json.title + " deleted");
                JsonService.refreshView();
              } else {
                toastr.error("There was an error while deleting " + JsonService.json.title, JsonService.json.title + " deleting error");
              }
            });
          }
        });
      }
    }
  };





});