/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๐๒/๐๙/๒๕๖๒>
Modify date : <๑๘/๐๙/๒๕๖๒>
Description : <รวมรวบฟังก์ชั่นใช้งานทั่วไปของระบบ>
=============================================
*/

(function () {
    "use strict";

    angular.module("appMod", [
        "base64",
        "ngSanitize",
        "ngAnimate", 
        "ngRoute",
        "ngCookies",
        "ui.bootstrap",
        "utilMod",
        "dictMod",
        "hriSearchMod"
    ])

    .directive("appMain", function ($window, utilServ, appServ) {
        return {
            link: function (scope) {
                angular.element($window).on("resize", function () {
                    try
                    {
                        appServ.watchChangeScreen();
                    }
                    catch (e)
                    {
                    }
                });            

                scope.$watch(function () {
                    return [appServ.langTH, appServ.langEN];
                }, function (newValue, oldValue) {                                 
                    if ((newValue[0] !== oldValue[0]) ||
                        (newValue[1] !== oldValue[1]))
                    {
                        appServ.setLanguageOnHeaderFooter();
                        utilServ.setLanguageOnDialog();
                    }

                    appServ.watchChangeScreen(); 
                }, true);
            }
        };
    })

    .directive("appContent", function ($timeout, appServ) {
        return {
            link: function (scope) {
                scope.$watch(function () {
                    return appServ.showView;
                }, function () {
                    if (appServ.showView === false) $("main").addClass("hidden");
                    if (appServ.showView === true)  $("main").removeClass("hidden");

                    appServ.watchChangeScreen();
                }, true);
            }
        };
    })

    .config(function ($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix("");
        $routeProvider
        .when("/", {
        })
        .otherwise({
            redirectTo: "/"
        });

    })

    .service("appServ", function ($window, $timeout, $q, $filter, utilServ, dictServ) {
        var self = this;

        utilServ.lang = "TH";

        self.langTH = false;
        self.langEN = false;
        self.pathAPI = "Infinity/AUNQA/API";
        self.showView = false;
        self.labelStyle = "";
        self.tableConfig = {
            timeout: 500,
            params: {
                page: 1,
                count: 50
            },
            setting: {
                counts: [],
                paginationMaxBlocks: 6,
                paginationMinBlocks: 2
            }
        };
        self.dialogFormOptions = {
            cssClass: "",
            title: "",
            content: ""
        };
        self.getToken = {
            tokenAccess: ""
        };

        //ฟังก์ชั่นสำหรับปิด Dialog Preloading
        self.closeDialogPreloading = function () {
            utilServ.dialogClose();
            $timeout(function () {
                self.showPreloading = false;
                utilServ.msgPreloading = null;
                $("#" + utilServ.idDialogPreloading).modal("hide");
            }, 0);
        };

        //ฟังก์ชั่นสำหรับกำหนดภาษาที่่ต้องการ
        //โดยมีพารามิเตอร์ดังนี้
        //1. param รับค่าพารามิเตอร์ต่าง ๆ ที่ต้องการ
        //lang  รับค่าภาษา
        self.setLanguageDefault = function (param) {
            param.lang = (param.lang === undefined || param.lang === "" ? utilServ.lang : param.lang);

            self.langTH = false;
            self.langEN = false;
            
            utilServ.setLanguage({
                lang: param.lang
            });

            if (utilServ.lang === "TH") self.langTH = true;
            if (utilServ.lang === "EN") self.langEN = true;

            $window.document.title = dictServ.dict.systemName.HRi[utilServ.lang];
            self.labelStyle = utilServ.getLabelStyle();
        };        

        //ฟังก์ชั่นสำหรับแสดงข้อความเป็นภาษาที่กำหนดไว้ในส่วนของเนื้อหาส่วนหัวและส่วนท้าย
        self.setLanguageOnHeaderFooter = function () {
            $("main .navbar-top .lang").addClass("hidden");
            $("main .navbar-header .lang").addClass("hidden");
            $("main .flag .lang").css({ "display": "none" });

            $("main .navbar-top .lang-" + utilServ.lang.toLowerCase()).removeClass("hidden");
            $("main .navbar-header .lang-" + utilServ.lang.toLowerCase()).removeClass("hidden");
            $("main .flag .lang-" + utilServ.lang.toLowerCase()).css({ "display": "block" });
        };

        //ฟังก์ชั่นสำหรับแสดงข้อความที่กำหนดไว้ตามที่ต้องการ
        //โดยมีพารามิเตอร์ดังนี้
        //1. key รับค่าคีย์ที่ต้องการให้แสดงข้อความ
        self.getLabel = function (key) {
            var word;
            var tmp = dictServ.dict;

            angular.forEach(key, function (item) {
                tmp = tmp[item];
            });

            word = tmp[utilServ.lang];

            return word;
        };

        self.HRi = {
            class: "hri",
            dataRow: {},
            //ฟังก์ชั่นสำหรับเรียกดูข้อมูลจากระบบ HRi
            getListData: function (param) {
                param.action    = (param.action === undefined ? "" : param.action);
                param.params    = (param.params === undefined || param.params === "" ? {} : param.params);

                var deferred = $q.defer();
                var url = (utilServ.getURLAPI(self.pathAPI) + "HRi/");
                var route = "";

                switch (param.action) {
                    case "getlist": {
                        route = "GetListData";
                        break;
                    }
                    case "get": {
                        route = "GetData";
                        break;
                    }
                }

                url += (route + "?ver=" + utilServ.dateTimeOnURL);
                        
                utilServ.http({
                    url: url,
                    method: "POST",
                    data: param.params
                }).then(function (result) {
                    var dt = [];
                    var positions = [];
                    var programs = [];
                    
                    angular.forEach(result.data.data.content, function (item) {
                        if (param.action === "getlist")
                        {
                            dt.push({
                                personalId: (item.personalId ? item.personalId : ""),
                                firstName: {
                                    TH: (item.firstName ? item.firstName : ""),
                                    EN: (item.firstNameEn ? $filter("capitalize")(item.firstNameEn) : "")
                                },
                                lastName: {
                                    TH: (item.lastName ? item.lastName : ""),
                                    EN: (item.lastNameEn ? $filter("capitalize")(item.lastNameEn) : "")
                                },
                                department: {
                                    TH: (item.department ? item.department : ""),
                                    EN: (item.departmentEn ? $filter("capitalize")(item.departmentEn) : "")
                                },
                                selectFilter: (
                                    (item.firstName ? item.firstName : "") +
                                    (item.lastName ? item.lastName : "") +
                                    (item.firstNameEn ? item.firstNameEn : "") +
                                    (item.lastNameEn ? item.lastNameEn : "") + 
                                    (item.department ? item.department : "") + 
                                    (item.departmentEn ? item.departmentEn : "")
                                )
                            });
                        }

                        if (param.action === "get")
                        {
                            angular.forEach(item.positions, function (item) {
                                positions.push({
                                    name: (item.name ? item.name : ""),
                                    fullName: (item.fullname ? $filter("capitalize")(item.fullname) : ""),
                                    type: (item.type ? item.type : ""),
                                    startDate: (item.startDate ? item.startDate : ""),
                                    organization: {
                                        name: (item.organization.name ? item.organization.name : ""),
                                        fullName: (item.organization.fullname ? $filter("capitalize")(item.organization.fullname) : ""),                                        
                                        faculty: {
                                            name: (item.organization.faculty.name ? item.organization.faculty.name : ""),
                                            fullName: (item.organization.faculty.fullname ? $filter("capitalize")(item.organization.faculty.fullname) : "")
                                        }
                                    }
                                });
                            });

                            angular.forEach(item.programs, function (item) {
                                programs.push({
                                    id: (item.id ? item.id : ""),
                                    faculty: {
                                        id: (item.facultyId ? item.facultyId : ""),
                                        name: {
                                            TH: (item.facultyNameTH ? item.facultyNameTH : ""),
                                            EN: (item.facultyNameEN ? $filter("capitalize")(item.facultyNameEN) : "")
                                        }
                                    },
                                    programId: (item.programId ? item.programId : ""),
                                    programCode: (item.programCode ? item.programCode : ""),
                                    programFullCode: ((item.programCode ? (item.programCode + " ") : "") + (item.majorCode ? (item.majorCode + " ") : "") + (item.groupNum ? item.groupNum : "")),
                                    majorId: (item.majorId ? item.majorId : ""),
                                    majorCode: (item.majorCode ? item.majorCode : ""),
                                    groupNum: (item.groupNum ? item.groupNum : ""),
                                    name: {
                                        TH: (item.nameTh ? item.nameTh : ""),
                                        EN: (item.nameEn ? $filter("capitalize")(item.nameEn) : "")
                                    },
                                    courseYear: (item.courseYear ? item.courseYear : ""),
                                    cancelStatus: (item.cancelStatus ? item.cancelStatus : ""),
                                    coursePosition: {
                                        id: (item.coursePositionId ? item.coursePositionId : ""),
                                        name: {
                                            TH: (item.coursePositionNameTH ? item.coursePositionNameTH : ""),
                                            EN: (item.coursePositionNameEN ? item.coursePositionNameEN : ""),
                                        },
                                        group: (item.coursePositionGroup ? item.coursePositionGroup : "")
                                    }
                                });
                            });

                            dt.push({
                                personalId: (item.personalId ? item.personalId : ""),
                                namePrefix: {
                                    academicPosition: (item.titleZ ? item.titleZ : ""),
                                    military: (item.titleS ? item.titleS : ""),
                                    profession: (item.titleV ? item.titleV : ""),
                                    titleConferredByTheKing: (item.titleT ? item.titleT : ""),
                                    ordinary: (item.title ? item.title : "")
                                },
                                gender: (item.gender ? item.gender : ""),
                                firstName: {
                                    TH: (item.firstName ? item.firstName : ""),
                                    EN: (item.firstNameEn ? $filter("capitalize")(item.firstNameEn) : "")
                                },
                                middleName: {
                                    TH: (item.middleName ? item.middleName : ""),
                                    EN: (item.middleNameEn ? $filter("capitalize")(item.middleNameEn) : "")
                                },
                                lastName: {
                                    TH: (item.lastName ? item.lastName : ""),
                                    EN: (item.lastNameEn ? $filter("capitalize")(item.lastNameEn) : "")
                                },
                                dateOfBirth: (item.birthDate ? item.birthDate : ""),
                                countryOfBirth: (item.birthCountry ? $filter("capitalize")(item.birthCountry) : ""),
                                placeOfBirth: (item.birthPlace ? $filter("capitalize")(item.birthPlace) : ""),
                                nationality: (item.nationality ? $filter("capitalize")(item.nationality) : ""),
                                nationalitySecond: (item.nationalitySecond ? $filter("capitalize")(item.nationalitySecond) : ""),
                                nationalityThird: (item.nationalityThird ? $filter("capitalize")(item.nationalityThird) : ""),
                                religious: (item.religious ? item.religious : ""),
                                maritalStatus: (item.marital ? item.marital : ""),
                                positions: positions,
                                programs: programs
                            });
                        }
                    });

                    if (param.action === "getlist")
                    {
                        var output = [];
                        var keys = [];

                        angular.forEach(dt, function (item) {
                            var key = item.personalId;

                            if (keys.indexOf(key) === -1)
                            {
                                keys.push(key);
                                output.push(item);
                            }
                        });

                        dt = output;
                    }

                    deferred.resolve(dt);
                });
                
                return deferred.promise;
            },
            personalInformation: {
                class: "personalinformation",
                template: "HRiPersonalInformation.html"
            },
            personalData: {
                class: "personaldata",
                coursePosition: {
                    class: "courseposition"
                }
            }
        };
        
        //ฟังก์ชั่นสำหรับตรวจสอบการเปลี่ยนแปลง
        self.watchChangeScreen = function () {            
            utilServ.setSectionLayout();
        };
    })

    .run(function ($rootScope, utilServ, appServ, dictServ) {
        $rootScope.$utilServ = utilServ;
        $rootScope.$appServ = appServ;
        $rootScope.$dictServ = dictServ;
                
        $rootScope.$on("$routeChangeStart", function () {            
            appServ.showView = false;
            $("main section .view").css({ "display": "none" });
        });

        $rootScope.$on("$routeChangeSuccess", function () {
            appServ.setLanguageDefault({});
            appServ.setLanguageOnHeaderFooter();
            appServ.watchChangeScreen();

            appServ.showView = true;
            $("main section .view").css({ "display": "block" });
        });
    });
})();