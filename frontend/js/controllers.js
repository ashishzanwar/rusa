angular.module('phonecatControllers', ['templateservicemod', 'navigationservice', 'ui.bootstrap', 'ngAnimate', 'ngSanitize', 'angular-flexslider', 'ui.swiper', 'cleave.js', 'ui.date'])

    .controller('HomeCtrl', function ($scope, TemplateService, NavigationService, $timeout, $state) {
        $scope.template = TemplateService.changecontent("home"); //Use same name of .html file
        $scope.menutitle = NavigationService.makeactive("Home"); //This is the Title of the Website
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $state.go("institute-form");

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
        };
    })
    .controller('InstituteFormCtrl', function ($scope, TemplateService, NavigationService, $uibModal, $timeout, $stateParams, $state) {
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
        $scope.state;



        $scope.printForm = function () {
            print();
        };

        $scope.calculateUtilization = function () {
            var sum = 0;
            if ($scope.formData.projects.length > 0 && $scope.formData.projects[0] && $scope.formData.projects[0].projectExpenses.length > 0 && $scope.formData.projects[0].projectExpenses[0].institutetoVendors.length > 0 && $scope.formData.projects[0].projectExpenses[0].institutetoVendors[0].amount) {
                _.each($scope.formData.projects, function (project) {
                    _.each(project.projectExpenses, function (projectExpense) {
                        _.each(projectExpense.institutetoVendors, function (institutetoVendor) {
                            var num = parseFloat(institutetoVendor.amount);
                            if (!_.isNaN(num)) {
                                sum += num;
                            }

                        });
                    });
                });
            }

            var x = sum;
            x = x.toString();
            var afterPoint = '';
            if (x.indexOf('.') > 0)
                afterPoint = x.substring(x.indexOf('.'), x.length);
            x = Math.floor(x);
            x = x.toString();
            var lastThree = x.substring(x.length - 3);
            var otherNumbers = x.substring(0, x.length - 3);
            if (otherNumbers != '')
                lastThree = ',' + lastThree;
            var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;
            return res;
        };

        $scope.options = {
            indian: {
                numeral: true,
                numeralThousandsGroupStyle: 'lakh'
            },
            mobile: {
                // numeral: true,
                prefix: '+91',
                blocks: [3, 4, 3, 3],
            }
        };

        $scope.calcShareAmount = function (amount) {
            $scope.centerShareAmount = (amount * parseInt($scope.centerShare) / 100).toFixed(2);
            $scope.stateShareAmount = (amount * (100 - parseInt($scope.centerShare)) / 100).toFixed(2);
            console.log(amount);
            console.log($scope.centerShare);

        };

        if ($stateParams.isModerator == "Moderator") {
            $scope.isModerator = true;
        }

        if ($stateParams.id) {
            $scope.isEdit = true;
            NavigationService.getOneForm($stateParams.id, function (data) {
                console.log("Params data", data);

                $scope.formEdit = data.data;
                $scope.formData = data.data.json;
                $scope.state = data.data.json.stateId._id;
                $scope.district = data.data.json.districtId._id;
                $scope.instituteType = data.data.json.instituteType;
                $scope.searchData($scope.state);
                if ($scope.formEdit.status != "To Be Moderated") {
                    $scope.submitText = "This Form Can Not Be Modified.";
                }


                console.log("State id", $scope.state);

                state.state = $scope.state;
                state._id = $scope.state;



                // NavigationService.apiCall("State/findOneStateMod", state, function (data) {
                //     $scope.percent = data.data;
                //     $scope.centerShareAmount = data.data.centerShare;
                //     $scope.stateShareAmount = data.data.stateShare;
                //     console.log("KNJKBJK", $scope.percent);
                //     $scope.generateField = true;

                // });
                NavigationService.apiCall("District/findAllDistrict", state, function (data) {
                    $scope.districtData = data.data;
                    $scope.generateField = true;

                });


                institute.district = $scope.district;



                NavigationService.apiCall("Institute/findAllInstitute", institute, function (data) {
                    $scope.instituteData = data.data;
                    $scope.generateField = true;
                    console.log("INSS", data.data);
                });

            });



        }

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
            contact: {},
            utilization: {},
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

                $scope.calcShareAmount($scope.formData.allocation);

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

        $scope.submitForm = function (data, otherValue) {
            // JSON.assetType = data;
            $scope.submitText = "Form Sent for Submission.";
            console.log("FINAL BIG JSOn", data);


            // var jsonData = {};
            // jsonData.json = data;
            json = {};

            // var abc = data.toString();


            // var abc = JSON.parse(data);
            if ($scope.isEdit) {
                json = $scope.formEdit;
            }

            if (otherValue == "Moderation") {
                json.status = "Moderation Completed";
            }
            if (otherValue == "Trash") {
                json.status = "Trashed";
            }
            json.json = data;

            NavigationService.apiCall("Form/save", json, function (data) {
                // $scope.districtData = data.data;
                $scope.submitText = "Form Submitted Successfully.";
                $scope.generateField = true;
                if (otherValue == "Moderation") {
                    $scope.submitText = "Form Moderated Successfully.";
                }
                if (otherValue == "Trash") {
                    $scope.submitText = "Form Trashed Successfully.";
                }
                if ($scope.isModerator) {
                    window.location.href = adminurl + "../backend/#!/page/viewForm//";
                }
            });


        };





        $scope.abc = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];



        $scope.addNewProject = function () {
            $scope.formData.projects.push(_.cloneDeep(project));
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

            $scope.formData.centerToState.push(_.cloneDeep(state));
            // $scope.states.push({});
        };

        $scope.removeState = function (index) {
            $scope.states.splice(index, 1);
        };

        $scope.institutes = [institute];

        $scope.addNewInstitute = function (index) {

            $scope.formData.stateToInstitute.push(_.cloneDeep(institute));
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