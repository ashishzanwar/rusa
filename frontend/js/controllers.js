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

            NavigationService.apiCall("Form/save", state, function (data) {
                $scope.districtData = data.data;
                $scope.generateField = true;

            });

            $scope.formSubmitted = true;
        }



    })

    .controller('InstituteFormCtrl', function ($scope, TemplateService, NavigationService, $uibModal, $timeout) {
        $scope.template = TemplateService.changecontent("institute-form"); //Use same name of .html file
        $scope.menutitle = NavigationService.makeactive("Institute Form"); //This is the Title of the Website
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.stateData;
        $scope.districtData;
        $scope.instituteData;
        $scope.keycomponentsData;
        $scope.pabData;
        $scope.centerShare;
        $scope.stateShare;
        $scope.projectType;
        $scope.assetType;
        $scope.allocation;
        $scope.JSON = {};

        var institutetoVendors = {
            vendorName: "",
            installmentNo: "",
            amount: "",
            transactionRececived: "",
            remarks: "",
            file: ""
        };


        var projectExpenses = {
            name: "",
            installmentNo: "",
            amount: "",
            transactionSent: "",
            transactionRececived: "",
            remarks: "",
            file: "",
            institutetoVendors: [_.cloneDeep(institutetoVendors)]
        };



        var institute = {
            name: "State to Institute 1",
            installmentNo: "",
            amount: "",
            transactionSent: "",
            transactionRececived: "",
            remarks: "",
            file: ""

        };
        var project = {

            name: "",
            projectType: "",
            assetType: "",
            photo1: "",
            photo2: "",
            valueProject: "",
            dueDate: "",
            projectExpenses: [_.cloneDeep(projectExpenses)],
        };
        var state = {
            name: "",
            installmentNo: "",
            amount: "",
            transactionSent: "",
            transactionRececived: "",
            remarks: "",
            file: ""
        };

        $scope.formData = {
            projects: [_.cloneDeep(project)],
            centerToState: [_.cloneDeep(state)],
            stateToInstitute: [_.cloneDeep(institute)]

        };




        NavigationService.boxCall("State/findAllState", function (data) {
            $scope.stateData = data.data;
            $scope.generateField = true;

        });

        NavigationService.boxCall("District/findAllDistrict", function (data) {
            $scope.districtData = data.data;
            $scope.generateField = true;

        });

        NavigationService.boxCall("Institute/findAllInstitute", function (data) {
            $scope.instituteData = data.data;
            $scope.generateField = true;

        });


        NavigationService.boxCall("Keycomponents/findAllKeycomponents", function (data) {
            $scope.keycomponentsData = data.data;
            $scope.generateField = true;

        });

        NavigationService.boxCall("Pab/findAllPab", function (data) {
            $scope.pabData = data.data;
            $scope.generateField = true;

        });
        NavigationService.boxCall("ProjectType/findAllProjectType", function (data) {
            $scope.projectType = data.data;
            $scope.generateField = true;

        });
        NavigationService.boxCall("AssetType/findAllAssetType", function (data) {
            $scope.assetType = data.data;
            $scope.generateField = true;

        });

        $scope.searchData = function (data) {
            console.log("data", data);
            state = {};
            state.state = data;

            NavigationService.apiCall("District/findAllDistrict", state, function (data) {
                $scope.districtData = data.data;
                $scope.generateField = true;

            });


            NavigationService.apiCall("State/findOneSelectedState", state, function (data) {
                // $scope.districtData = data.data;
                // console.log("console", data.data);
                // console.log(data.data.centerShare);
                // console.log(data.data.stateShare);
                $scope.centerShare = data.data.centerShare;
                $scope.stateShare = data.data.stateShare;

                $scope.generateField = true;

            });


            JSON.state = data;
        }
        $scope.createDistrict = function (data) {
            JSON.district = data;
            district = {};
            console.log("data", data);
            district.district = data;
            // in
            NavigationService.apiCall("Institute/findAllInstitute", district, function (data) {
                $scope.instituteData = data.data;
                $scope.generateField = true;
                console.log("INSS", data.data);
            });




        };
        $scope.createInstituteType = function (data) {

            JSON.institute = data;
            institute = {};
            institute.district = JSON.district;
            institute.type = data


            NavigationService.apiCall("Institute/findAllInstitute", institute, function (data) {
                $scope.instituteData = data.data;
                $scope.generateField = true;
                console.log("INSS", data.data);
            });

        };

        $scope.createInstitute = function (data) {

            JSON.institute = data;
            // institute = {};
            // institute.district = JSON.district;
            // institute.type =


            // NavigationService.apiCall("Institute/findAllInstitute", district, function (data) {
            //     $scope.instituteData = data.data;
            //     $scope.generateField = true;
            //     console.log("INSS", data.data);
            // });

        };
        $scope.createPab = function (data) {
            JSON.pab = data;
        };
        $scope.createKeyComponents = function (data) {
            JSON.keycomponents = data;
        };
        $scope.createAllocation = function (data) {
            JSON.allocation = data;
        };
        $scope.createProjectType = function (data) {
            JSON.projectType = data;
        };
        $scope.createAssetType = function (data) {
            JSON.assetType = data;
            console.log("JSON", JSON);
        };


        $scope.submitForm = function (data) {
            // JSON.assetType = data;
            console.log("FINAL BIG JSOn", data);
            // var jsonData = {};
            // jsonData.json = data;
            json = {};

            // var abc = data.toString();


            // var abc = JSON.parse(data);

            json.json = data;
            NavigationService.apiCall("Form/save", json, function (data) {
                // $scope.districtData = data.data;
                $scope.generateField = true;

            });


        };





        $scope.abc = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];



        $scope.addNewProject = function () {
            $scope.formData.projects.push(project);
        };
        $scope.removeProject = function (index) {
            $scope.formData.projects.splice(index, 1);
            console.log(index, 'deleted');
        };

        $scope.addNewProjectExpense = function (arr) {
            arr.push({
                vendorName: "Vendor",
                institutetoVendors: [_.cloneDeep(institutetoVendors)]
            });
        };
        $scope.removeProjectExpense = function (arry, index) {
            console.log(arry, 'deleted');
            arry.splice(index, 1);
            console.log(arry, 'deleted');
        };


        $scope.addNewinstitutetoVendors = function (arr1) {
            arr1.push({});
        };
        $scope.removeinstitutetoVendors = function (arry, index) {
            console.log(arry, 'deleted');
            arry.splice(index, 1);
            console.log(arry, 'deleted');
        };


        $scope.states = [state];
        $scope.addNewState = function (index) {

            $scope.formData.centerToState.push(state);
            // $scope.states.push({});
        };

        $scope.removeState = function (index) {
            $scope.states.splice(index, 1);
        };

        $scope.institutes = [institute];

        $scope.addNewInstitute = function (index) {

            $scope.formData.stateToInstitute.push(institute);
            // $scope.institutes.push({});
        };

        $scope.removeInstitute = function (index) {
            $scope.institutes.splice(index, 1);
        };
        // console.log(allState);

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