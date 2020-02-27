/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๐๒/๐๙/๒๕๖๒>
Modify date : <๒๔/๐๙/๒๕๖๒>
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
        "hriMod",
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

    .service("appServ", function ($window, $timeout, utilServ, dictServ, hriServ) {
        var self = this;

        utilServ.lang = "TH";

        self.langTH = false;
        self.langEN = false;        
        self.pathAPI = /*Infinity/*/"AUNQA/API";
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
        self.HRi = {
            class: "hri",
            dataRow: {},
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
        hriServ.pathAPI = self.pathAPI;

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

        $rootScope.$on("$routeChangeSuccess", function (currentRoute) {
            appServ.setLanguageDefault({});
            appServ.setLanguageOnHeaderFooter();
            appServ.watchChangeScreen();

            appServ.showView = true;
            $("main section .view").css({ "display": "block" });
        });
    });
})();