angular.module('phonecatControllers', ['templateservicemod', 'navigationservice', 'ui.bootstrap', 'ngAnimate', 'ngSanitize', 'angular-flexslider', 'ui.swiper'])

    .controller('HomeCtrl', function ($scope, TemplateService, NavigationService, $timeout) {
        $scope.template = TemplateService.changecontent("home"); //Use same name of .html file
        $scope.menutitle = NavigationService.makeactive("Home"); //This is the Title of the Website
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.mySlides = [
            'http://flexslider.woothemes.com/images/kitchen_adventurer_cheesecake_brownie.jpg',
            'http://flexslider.woothemes.com/images/kitchen_adventurer_lemon.jpg',
            'http://flexslider.woothemes.com/images/kitchen_adventurer_donut.jpg',
            'http://flexslider.woothemes.com/images/kitchen_adventurer_caramel.jpg'
        ];
    })

    .controller('FormCtrl', function ($scope, TemplateService, NavigationService, $timeout) {
        $scope.template = TemplateService.changecontent("form"); //Use same name of .html file
        $scope.menutitle = NavigationService.makeactive("Form"); //This is the Title of the Website
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.formSubmitted = false;

        $scope.submitForm = function (data) {
            console.log(data);
            $scope.formSubmitted = true;
        }
    })

    .controller('InstituteFormCtrl', function ($scope, TemplateService, NavigationService, $uibModal, $timeout) {
        $scope.template = TemplateService.changecontent("institute-form"); //Use same name of .html file
        $scope.menutitle = NavigationService.makeactive("Institute Form"); //This is the Title of the Website
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        var institutetoVendors = {
            vendorName: "Vendor1",
            installmentNo: "installmentNo",
            amount: "amount",
            transactionRececived: "transactionRececived",
            remarks: "remarks",
            file: "file"
        }
        var projectExpenses = {
            name: "Project Expense 1",
            installmentNo: "installmentNo",
            amount: "amount",
            transactionSent: "transactionSent",
            transactionRececived: "transactionRececived",
            remarks: "remarks",
            file: "file",
            institutetoVendors: [institutetoVendors]
        }

        var project = {
            name: "Project1",
            projectType: "projectType",
            assetType: "assetType",
            photo1: "photo1",
            photo2: "photo2",
            valueProject: "valueProject",
            dueDate: "dueDate",
            projectExpenses: [projectExpenses],
        }


        $scope.projects = [project];

        $scope.addNewProject = function (index) {
            $scope.projects.push(project);
        };
        $scope.removeProject = function (index) {
            $scope.projects.splice(index, 1);
            console.log(index, 'deleted');
        };

        $scope.addNewProjectExpense = function (arr) {
            arr.push(projectExpenses);
        };
        $scope.removeProjectExpense = function (arry, index) {
            console.log(arry, 'deleted');
            arry.splice(index, 1);
            console.log(arry, 'deleted');
        };


        $scope.addNewinstitutetoVendors = function (arr1) {
            arr1.push(institutetoVendors);
        };
        $scope.removeinstitutetoVendors = function (arry, index) {
            console.log(arry, 'deleted');
            arry.splice(index, 1);
            console.log(arry, 'deleted');
        };




        var state = {
            name: "Center to State 1",
            installmentNo: "installmentNo",
            amount: "amount",
            transactionSent: "transactionSent",
            transactionRececived: "transactionRececived",
            remarks: "remarks",
            file: "file"
        };
        $scope.states = [state]
        $scope.addNewState = function (index) {
            $scope.states.push(state);
        };

        $scope.removeState = function (index) {
            $scope.states.splice(index, 1);
        };

        var institute = {
            name: "State to Institute 1",
            installmentNo: "",
            amount: "",
            transactionSent: "",
            transactionRececived: "",
            remarks: "",
            file: ""

        }
        $scope.institutes = [institute];

        $scope.addNewInstitute = function (index) {
            $scope.institutes.push(institute);
        };

        $scope.removeInstitute = function (index) {
            $scope.institutes.splice(index, 1);
        };

    })

    .controller('headerctrl', function ($scope, TemplateService) {
        $scope.template = TemplateService;
        $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $(window).scrollTop(0);
        });
        $.fancybox.close(true);
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


    })

;