/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๒๖/๐๓/๒๕๖๑>
Modify date : <๒๒/๑๐/๒๕๖๒>
Description : <รวมรวบฟังก์ชั่นใช้งานสำหรับจัดการเมนูของระบบ>
=============================================
*/

(function () {
    "use strict";

    angular.module("pageRouteMod", [
        "ngRoute",
        "ngAnimate",
        "utilMod",
        "appMod",
        "dictMod"
    ])

    .directive("menu", function ($timeout, appServ) {
        return {
            link: function (scope, element, attr) {
                var elm = angular.element(element);

                $timeout(function () {
                    elm.on("click", function (e) {   
                        if ((elm.hasClass("mainmenu") === true || elm.hasClass("submenu") === true))
                        {
                            $("main section .panel-col.col-menu .slidemenu .nav li a").removeClass("active");
                            elm.addClass("active");
                        }
                        if (elm.hasClass("mainsubmenu") === true)
                        {
                            if (elm.hasClass("collapsed") === true)
                                elm.find(".col-iconright i").removeClass("fa-chevron-right").addClass("fa-chevron-down");
                            else
                                elm.find(".col-iconright i").removeClass("fa-chevron-down").addClass("fa-chevron-right");
                        }
                    });
                }, 0);
            }
        };
    })

    .config(function ($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix("");
        $routeProvider
        .when("/Main", {
            templateUrl: "Module/Main.html",
            requireSignIn: true,
            permission: ["main"],
            resolve: {
                '': function ($q, $route, appServ, pageRouteServ) {
                    return $q.all([
                        appServ.isAuthenRoute({
                            requireSignIn: true,
                            permission: pageRouteServ.pageObject.main.permission
                        })
                    ]);
                }
            }
        })
        .when("/AcademicInfo/Faculty", {
            templateUrl: "Module/AcademicInfo.Faculty.html",
            requireSignIn: true,
            permission: ["academicInfo"],
            resolve: {
                '': function ($q, $route, appServ, pageRouteServ) {
                    return $q.all([
                        appServ.isAuthenRoute({
                            requireSignIn: true,
                            permission: pageRouteServ.pageObject.faculty.permission
                        })
                    ]);
                }
            }
        })
        .when("/AcademicInfo/Department/:facultyId", {
            templateUrl: "Module/AcademicInfo.Department.html",
            requireSignIn: true,
            permission: ["academicInfo"],
            resolve: {
                '': function ($q, $route, appServ, pageRouteServ, facultyServ) {
                    return $q.all([
                        appServ.isAuthenRoute({
                            requireSignIn: true,
                            permission: pageRouteServ.pageObject.department.permission
                        }),
                        facultyServ.isFacultyRoute($route.current.params.facultyId)
                    ]);
                }
            }
        })
        .when("/AcademicInfo/Major/:facultyId", {
            templateUrl: "Module/AcademicInfo.Major.html",
            requireSignIn: true,
            permission: ["academicInfo"],
            resolve: {
                '': function ($q, $route, appServ, pageRouteServ, facultyServ) {
                    return $q.all([
                        appServ.isAuthenRoute({
                            requireSignIn: true,
                            permission: pageRouteServ.pageObject.major.permission
                        }),
                        facultyServ.isFacultyRoute($route.current.params.facultyId)
                    ]);
                }
            }
        })
        .when("/AcademicInfo/Course/:facultyId", {
            templateUrl: "Module/AcademicInfo.Course.html",
            requireSignIn: true,
            permission: ["academicInfo"],
            resolve: {
                '': function ($q, $route, appServ, pageRouteServ, facultyServ) {
                    return $q.all([
                        appServ.isAuthenRoute({
                            requireSignIn: true,
                            permission: pageRouteServ.pageObject.course.permission
                        }),
                        facultyServ.isFacultyRoute($route.current.params.facultyId)
                    ]);
                }
            }
        })
        .when("/AcademicInfo/Programme/:facultyId", {
            templateUrl: "Module/AcademicInfo.Programme.html",
            requireSignIn: true,
            permission: ["academicInfo"],
            resolve: {
                '': function ($q, $route, appServ, pageRouteServ, facultyServ) {
                    return $q.all([
                        appServ.isAuthenRoute({
                            requireSignIn: true,
                            permission: pageRouteServ.pageObject.programme.permission
                        }),
                        facultyServ.isFacultyRoute($route.current.params.facultyId)
                    ]);
                }
            }
        })   
        .when("/TQFInfo/TQF2", {
            templateUrl: "Module/TQFInfo.TQF2.html",
            requireSignIn: true,
            permission: ["TQFInfo"],
            resolve: {
                '': function ($q, appServ, pageRouteServ, programmeServ) {
                    return $q.all([
                        appServ.isAuthenRoute({
                            requireSignIn: true,
                            permission: pageRouteServ.pageObject.TQF2.permission
                        }),
                        programmeServ.isProgram = false,
                        programmeServ.isEdit = false,
                        programmeServ.isUpdate = false
                    ]);
                }
            }
        })
        .when("/TQFInfo/TQF2/:action/programPresent/:programId", {
            templateUrl: "Module/TQFInfo.TQF2.html",
            requireSignIn: true,
            permission: ["TQFInfo"],
            resolve: {
                '': function ($q, $route, appServ, pageRouteServ, programmeServ) {
                    return $q.all([
                        appServ.isAuthenRoute({
                            requireSignIn: true,
                            permission: pageRouteServ.pageObject.TQF2.permission
                        }),
                        programmeServ.isProgramRoute($route.current.params.action, "programPresent", "", $route.current.params.programId, "")
                    ]);
                }
            }
        })
        .when("/TQFInfo/TQF2/:action/master/:programId/:courseYear", {
            templateUrl: "Module/TQFInfo.TQF2.html",
            requireSignIn: true,
            permission: ["TQFInfo"],
            resolve: {
                '': function ($q, $route, appServ, pageRouteServ, programmeServ) {
                    return $q.all([
                        appServ.isAuthenRoute({
                            requireSignIn: true,
                            permission: pageRouteServ.pageObject.TQF2.permission
                        }),
                        programmeServ.isProgramRoute($route.current.params.action, "master", "", $route.current.params.programId, $route.current.params.courseYear)
                    ]);
                }
            }
        })
        .when("/TQFInfo/TQF2/:action/temp/:id", {
            templateUrl: "Module/TQFInfo.TQF2.html",
            requireSignIn: true,
            permission: ["TQFInfo"],
            resolve: {
                '': function ($q, $route, appServ, pageRouteServ, programmeServ) {
                    return $q.all([
                        appServ.isAuthenRoute({
                            requireSignIn: true,
                            permission: pageRouteServ.pageObject.TQF2.permission
                        }),
                        programmeServ.isProgramRoute($route.current.params.action, "temp", $route.current.params.id, "", "")
                    ]);
                }
            }
        })
        .when("/TQFInfo/TQF3", {
            templateUrl: "Module/TQFInfo.TQF3.html",
            requireSignIn: true,
            permission: ["TQFInfo"],
            resolve: {
                '': function ($q, appServ, pageRouteServ) {
                    return $q.all([
                        appServ.isAuthenRoute({
                            requireSignIn: true,
                            permission: pageRouteServ.pageObject.TQF3.permission
                        })
                    ]);
                }
            }
        })
        .when("/TQFInfo/TQF3/:action/master/:courseId", {
            templateUrl: "Module/TQFInfo.TQF3.html",
            requireSignIn: true,
            permission: ["TQFInfo"],
            resolve: {
                '': function ($q, $route, appServ, pageRouteServ, courseServ) {
                    return $q.all([
                        appServ.isAuthenRoute({
                            requireSignIn: true,
                            permission: pageRouteServ.pageObject.TQF3.permission
                        }),
                        courseServ.isCourseRoute($route.current.params.action, "master", "", $route.current.params.courseId)
                    ]);
                }
            }
        })
        .otherwise({
            redirectTo: "/Main"
        });
    })

    .service("pageRouteServ", function ($timeout, appServ) {
        var self = this;        

        self.menuList = {
            menu: ["academicInfo", "TQFInfo", "configuration"],
            academicInfo: {
                menu: ["faculty"]
            },
            TQFInfo: {
                //menu: ["TQF1", "TQF2", "TQF3", "TQF4", "TQF5", "TQF6", "TQF7"]
                menu: ["TQF2", "TQF3"]
            }
        };
        
        self.pageObject = {
            main: {
                class: "main",
                permission: "*",
                url: "Main"
            },            
            academicInfo: {
                class: "academicinfo",
                icon: "fa fa-book",
                nameDict: ["academicInfo"],
                permission: appServ.permission.admin,
                url: "AcademicInfo"
            },
            faculty: {
                class: "faculty",
                icon: "fa fa-circle",
                nameDict: ["faculty"],
                permission: appServ.permission.admin,
                url: "AcademicInfo/Faculty",
                addedit: {
                    template: "Module/AcademicInfo.Faculty.AddEdit.html"
                },
                verified: {
                    class: "verified"
                }
            },
            department: {
                class: "department",
                nameDict: ["department"],
                permission: appServ.permission.admin,
                url: "AcademicInfo/Department",
                addedit: {
                    template: "Module/AcademicInfo.Department.AddEdit.html"
                },
                verified: {
                    class: "verified",
                    template: "Module/AcademicInfo.Department.Verified.html"
                },
                pendingVerify: {
                    class: "pendingverify",
                    template: "Module/AcademicInfo.Department.PendingVerify.html"
                },
                verifyReject: {
                    class: "verifyreject",
                    template: "Module/AcademicInfo.Department.VerifyReject.html"
                }
            },
            major: {
                class: "major",
                nameDict: ["major"],
                permission: appServ.permission.admin,
                url: "AcademicInfo/Major",
                addedit: {
                    template: "Module/AcademicInfo.Major.AddEdit.html"
                },
                verified: {
                    class: "verified",
                    template: "Module/AcademicInfo.Major.Verified.html"
                },
                pendingVerify: {
                    class: "pendingverify",
                    template: "Module/AcademicInfo.Major.PendingVerify.html"
                },
                verifyReject: {
                    class: "verifyreject",
                    template: "Module/AcademicInfo.Major.VerifyReject.html"
                }
            },
            subject: {
                class: "subject",
                template: "Module/Subject.html"
            },
            course: {
                class: "course",
                nameDict: ["course"],
                permission: appServ.permission.admin,
                url: "AcademicInfo/Course",
                template: "Module/Course.html",
                addedit: {
                    template: "Module/AcademicInfo.Course.AddEdit.html"
                },
                verified: {
                    class: "verified",
                    template: "Module/AcademicInfo.Course.Verified.html"
                },
                pendingVerify: {
                    class: "pendingverify",
                    template: "Module/AcademicInfo.Course.PendingVerify.html"
                },
                sendingVerify: {
                    class: "sendingverify",
                    template: "Module/AcademicInfo.Course.SendingVerify.html"
                },
                transactionHistory: {
                    class: "transactionhistory",
                    template: "Module/AcademicInfo.Course.TransactionHistory.html"
                },
                sendVerifyReject: {
                    class: "sendverifyreject",
                    template: "Module/AcademicInfo.Course.SendVerifyReject.html"
                }
            },
            instructor: {
                class: "instructor",
                template: "Module/Instructor.html"
            },
            kpi: {
                class: "kpi",
                template: "Module/KPI.html"
            },
            programme: {
                class: "programme",
                nameDict: ["program"],
                permission: appServ.permission.admin,
                url: "AcademicInfo/Programme",
                addedit: {
                    template: "Module/AcademicInfo.Programme.AddEdit.html"
                },
                verified: {
                    class: "verified",
                    template: "Module/AcademicInfo.Programme.Verified.html"
                },
                pendingVerify: {
                    class: "pendingverify",
                    template: "Module/AcademicInfo.Programme.PendingVerify.html"
                },
                sendingVerify: {
                    class: "sendingverify",
                    template: "Module/AcademicInfo.Programme.SendingVerify.html"
                },
                transactionHistory: {
                    class: "transactionhistory",
                    template: "Module/AcademicInfo.Programme.TransactionHistory.html"
                },
                sendVerifyReject: {
                    class: "sendverifyreject",
                    template: "Module/AcademicInfo.Programme.SendVerifyReject.html"
                }
            },
            TQFInfo: {
                class: "tqfinfo",
                icon: "fa fa-edit",
                nameDict: ["TQFInfo"],
                permission: "*",
                url: "TQFInfo"
            },
            TQF1: {
                class: "tqf1",
                icon: "fa fa-circle",
                nameDict: ["TQF1"],
                permission: "*",
                url: "TQF1"
            },
            TQF2: {
                class: "tqf2",
                icon: "fa fa-circle",
                nameDict: ["TQF2"],
                permission: "*",
                url: "TQFInfo/TQF2",
                programme: {
                    verified: {
                        template: "Module/TQFInfo.TQF2.Programme.Verified.html"
                    },
                    pendingVerify: {
                        template: "Module/TQFInfo.TQF2.Programme.PendingVerify.html"
                    },
                    sendingVerify: {
                        template: "Module/TQFInfo.TQF2.Programme.SendingVerify.html"
                    }
                },
                addedit: {
                    template: "Module/TQFInfo.TQF2.AddEdit.html"
                },
                group1: {
                    class: "group01",
                    addedit: {
                        template: "Module/TQFInfo.TQF2.Group1.AddEdit.html"
                    }
                },
                group2: {
                    class: "group02",
                    addedit: {
                        template: "Module/TQFInfo.TQF2.Group2.AddEdit.html"
                    }
                },
                group3: {
                    class: "group03",
                    addedit: {
                        template: "Module/TQFInfo.TQF2.Group3.AddEdit.html"
                    }
                },
                group4: {
                    class: "group04",
                    addedit: {
                        template: "Module/TQFInfo.TQF2.Group4.AddEdit.html"
                    }
                },
                group5: {
                    class: "group05",
                    addedit: {
                        template: "Module/TQFInfo.TQF2.Group5.AddEdit.html"
                    }
                },
                group6: {
                    class: "group06",
                    addedit: {
                        template: "Module/TQFInfo.TQF2.Group6.AddEdit.html"
                    }
                },
                group7: {
                    class: "group07",
                    addedit: {
                        template: "Module/TQFInfo.TQF2.Group7.AddEdit.html"
                    }
                },
                group8: {
                    class: "group08",
                    addedit: {
                        template: "Module/TQFInfo.TQF2.Group8.AddEdit.html"
                    }
                }
            },
            TQF3: {
                class: "tqf3",
                icon: "fa fa-circle",
                nameDict: ["TQF3"],
                permission: "*",
                url: "TQFInfo/TQF3",
                course: {
                    verified: {
                        template: "Module/TQFInfo.TQF3.Course.Verified.html"
                    },
                    pendingVerify: {
                        template: "Module/TQFInfo.TQF3.Course.PendingVerify.html"
                    },
                    sendingVerify: {
                        template: "Module/TQFInfo.TQF3.Course.SendingVerify.html"
                    }
                },
                addedit: {
                    template: "Module/TQFInfo.TQF3.AddEdit.html"
                },
                group1: {
                    class: "group01",
                    addedit: {
                        template: "Module/TQFInfo.TQF3.Group1.AddEdit.html"
                    }
                },
                group2: {
                    class: "group02",
                    addedit: {
                        template: "Module/TQFInfo.TQF3.Group2.AddEdit.html"
                    }
                },
                group3: {
                    class: "group03",
                    addedit: {
                        template: "Module/TQFInfo.TQF3.Group3.AddEdit.html"
                    }
                },
                group4: {
                    class: "group04",
                    addedit: {
                        template: "Module/TQFInfo.TQF3.Group4.AddEdit.html"
                    }
                },
                group5: {
                    class: "group05",
                    addedit: {
                        template: "Module/TQFInfo.TQF3.Group5.AddEdit.html"
                    }
                },
                group6: {
                    class: "group06",
                    addedit: {
                        template: "Module/TQFInfo.TQF3.Group6.AddEdit.html"
                    }
                },
                group7: {
                    class: "group07",
                    addedit: {
                        template: "Module/TQFInfo.TQF3.Group7.AddEdit.html"
                    }
                }
            },
            TQF4: {
                class: "tqf4",
                icon: "fa fa-circle",
                nameDict: ["TQF4"],
                permission: "*",
                url: "TQF4"
            },
            TQF5: {
                class: "tqf5",
                icon: "fa fa-circle",
                nameDict: ["TQF5"],
                permission: "*",
                url: "TQF5"
            },
            TQF6: {
                class: "tqf6",
                icon: "fa fa-circle",
                nameDict: ["TQF6"],
                permission: "*",
                url: "TQF6"
            },
            TQF7: {
                class: "tqf7",
                icon: "fa fa-circle",
                nameDict: ["TQF7"],
                permission: "*",
                url: "TQF7"
            },
            configuration: {
                class: "configuration",
                icon: "fa fa-cog",
                nameDict: ["configuration"],
                permission: "*",
                url: "Configuration"
            }
        };
        
        //ฟังก์ชั่นสำหรับเปิดปิดเมนู
        self.setSlideMenuOnOff = function () {
            $timeout(function () {
                if ($("main section .panel-col.col-menu").is(":visible") === false)
                    self.setSlideMenuOn();
                else
                    self.setSlideMenuOff();
            }, 0);
        };

        //ฟังก์ชั่นสำหรับเปิดเมนู
        self.setSlideMenuOn = function () {
            $timeout(function () {
                $("main section .panel-col.col-menu").show();
                appServ.slideLeftActive = true;
            }, 0);
        };

        //ฟังก์ชั่นสำหรับปิดเมนู
        self.setSlideMenuOff = function () {
            $timeout(function () {
                $("main section .panel-col.col-menu").hide();
                appServ.slideLeftActive = false;
            }, 0);
        };

        //ฟังก์ชั่นสำหรับแอ็คทีฟเมนู
        //โดยมีพารามิเตอร์ดังนี้
        //1. param รับค่าพารามิเตอร์ต่าง ๆ ที่ต้องการ
        //menuName      รับค่าชื่อเมนู
        //addMessage    รับค่าข้อความของเมนูที่ต้องการต่อจากข้อความเดิม
        //isSubSubMenu  รับค่าว่าเป็น Sub ของ Sub เมนูหรือไม่
        self.setMenuActive = function (param) {
            param.menuName      = (param.menuName === undefined ? "" : param.menuName);
            param.isSubSubMenu  = (param.menuName === undefined ? false : param.isSubSubMenu);

            var menu = "main section .panel-col.col-menu .slidemenu .nav li";

            $(menu + " a").removeClass("active");
            $(menu + " .subsubmenu").removeClass("active").addClass("hidden");

            if (param.menuName.length > 0)
            {
                var menuClass = "";

                menuClass = (menu + " a." + param.menuName);

                if (param.message)
                    $(menuClass + " .panel-table .panel-col:eq(1) span").html(param.message);

                if (!param.isSubSubMenu)
                {
                    if ($(menuClass).hasClass("submenu") === true)
                    {                    
                        $(menu + " ul#" + $(menuClass).data("parent")).addClass("in");
                        $(menuClass).addClass("active");
                    }
                    else
                        $(menuClass).addClass("active");
                }                            

                if (param.isSubSubMenu) $(menu + " .subsubmenu." + param.menuName).removeClass("hidden").addClass("active");
            }           
        };

        //ฟังก์ชั่นสำหรับแสดงข้อความที่เมนูแอ็คทีฟ
        //โดยมีพารามิเตอร์ดังนี้
        //1. param รับค่าพารามิเตอร์ต่าง ๆ ที่ต้องการ
        //menuName      รับค่าชื่อเมนู
        //isSubSubMenu  รับค่าว่าเป็น Sub ของ Sub เมนูหรือไม่
        //action        รับค่าการกระทำ
        self.setMenuActiveAction = function (param) {
            param.menuName      = (param.menuName === undefined ? "" : param.menuName);
            param.isSubSubMenu  = (param.menuName === undefined ? false : param.isSubSubMenu);
            param.action        = (param.action === undefined ? "" : param.action);
            param.by            = (param.by === undefined ? false : param.by);

            var menu = "main section .panel-col.col-menu .slidemenu .nav li";
            
            if (param.menuName.length > 0)
            {
                var menuClass;

                if (!param.isSubSubMenu)
                    menuClass = (menu + " a." + param.menuName);
                else
                    menuClass = (menu + " .subsubmenu." + param.menuName);

                menuClass += " .menuactiveaction";

                $(menuClass).removeClass("hidden");
                $(menuClass + " span").addClass("hidden");

                if (param.action)
                {
                    $(menuClass).removeClass("hidden");
                    $(menuClass + " span." + param.action).removeClass("hidden");

                    if (param.by)
                        $(menuClass + " span.by").removeClass("hidden");
                }
            }           
        };

        //ฟังก์ชั่นสำหรับดึงสิทธิ์ผู้่ใช้งานตามหน้า
        //โดยมีพารามิเตอร์ดังนี้
        //1. pageName รับค่าชื่อหน้าที่ต้องการดึงสิทธิ์
        self.getPermissionInPage = function (pageName) {
            var permission;
            var tmp = this.pageObject;
            var i;

            if (pageName !== undefined)
                permission = tmp[pageName].permission;

            return permission;
        };
    })

    .run(function ($rootScope, $timeout, $location, $templateCache, utilServ, appServ) {
        $rootScope.$on("$routeChangeStart", function (event, nextRoute, currentRoute) {
            appServ.closeDialogPreloading();
            appServ.showView = true;
            
            $(".menuactiveaction.add, .menuactiveaction.edit, .menuactiveaction.update").addClass("hidden");
            
            $timeout(function () {
                appServ.showPreloading = true;
            }, 0);
            utilServ.getDialogPreloadingWithDict(["msgPreloading", "loading"]);
            
            if (nextRoute.templateUrl === undefined)                
                $location.path("/").replace();
            else
                nextRoute.templateUrl = (nextRoute.templateUrl + "?ver=" + utilServ.dateTimeOnURL);            
        });
        
        $rootScope.$on("$routeChangeSuccess", function (nextRoute, currentRoute) {                        
            $templateCache.remove(currentRoute.templateUrl);
            appServ.showView = true;

            if ($location.path() !== "/" && currentRoute.requireSignIn === true && appServ.authenInfo.status === false)
            {                                    
                appServ.closeDialogPreloading();
                
                utilServ.dialogErrorWithDict(appServ.authenInfo.error.msg, function (e) {                    
                });
            }
            else
            {                            
                if (currentRoute.requireSignIn === true && appServ.authenInfo.status === true)
                {
                    if ($location.path() === "/")
                        $location.path("/Main").replace();
                }
            }            
        });
    });
})();