/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๒๖/๐๓/๒๕๖๑>
Modify date : <๐๕/๑๑/๒๕๖๒>
Description : <รวมรวบฟังก์ชั่นใช้งานทั่วไปของระบบ>
=============================================
*/

(function () {
  "use strict";

  angular.module("appMod", [
    "base64",
    "ngCookies",
    "ngSanitize",
    "ngRoute",
    "ngAnimate",       
    "ui.select",
    "ui.bootstrap",
    "autoCompleteModule",
    "utilMod",
    "dictMod",
    "pageRouteMod",
    "mainMod",
    "branchMod",        
    "facultyMod",
    "departmentTypeMod",
    "departmentMod",
    "majorMod",
    "courseMod",
    "programmeMod",
    "TQFMod",
    "iscedMod",
    "degreeMod",
    "majorSubjectMod",
    "inputTypeMod",
    "countryMod",
    "approvedStatusMod",
    "careerMod",
    "instructorMod",
    "coursePositionMod",
    "hriMod",
    "placeStudyMod",
    "plosMod",
    "subjectMod",
    "kpiMod",
    "appendixMod",
    "academicInfo.facultyMod",
    "academicInfo.departmentMod",
    "academicInfo.majorMod",
    "academicInfo.courseMod",
    "academicInfo.programmeMod",
    "TQFInfo.TQF2Mod",
    "TQFInfo.TQF3Mod"
  ])

  .directive("appMain", function ($window, utilServ, appServ) {
    return {
      link: function (scope, element, attr) {
        angular.element($window).on("resize", function () {
          try {
            appServ.watchChangeScreen();
          }
          catch (e) {
          }
        });            

        scope.$watch(function () {
          return [appServ.langTH, appServ.langEN];
        }, function (newValue, oldValue) {             
          if ((newValue[0] !== oldValue[0]) || (newValue[1] !== oldValue[1])) {
            appServ.setLanguageOnHeaderFooter();
            utilServ.setLanguageOnDialog();
            angular.forEach($(".date"), function (elm) {
              angular.element(elm).data("DateTimePicker").locale(utilServ.lang.toLowerCase());
            });
          }

          appServ.watchChangeScreen(); 
        }, true);
      }
    };
  })

  .directive("appContent", function ($timeout, appServ) {
    return {
      link: function (scope, element, attr) {
        scope.$watch(function () {
          return appServ.showView;
        }, function (newValue, oldValue) {
          if (newValue === false) $("main").addClass("hidden");
          if (newValue === true)  $("main").removeClass("hidden");

          appServ.watchChangeScreen();
        }, true);
      }
    };
  })

  .service("appServ", function ($rootScope, $window, $cookies, $timeout, $anchorScroll, $q, $route, $templateCache, utilServ, dictServ, hriServ) {
    var self = this;

    utilServ.lang = "TH";

    self.langTH = false;
    self.langEN = false;
    self.pathAPI = "AUNQA/API";/*"Infinity/AUNQA/API";*/
    self.pathImagePerloadingInline = "Image/PreloadingInline.gif";/*"../Infinity/AUNQA/GUI/Image/PreloadingInline.gif";*/
    self.pathHRI = "../HRI";/*"../Infinity/AUNQA/HRI";*/
    self.systemGroup = "AUNQA";
    self.showPreloading = true;
    self.showView = false;
    self.slideLeftToggle = false;
    self.slideLeftActive = true;
    self.menuCollapse = false;
    self.timeoutInit = 0;
    self.labelStyle = "";
    self.windowWidth = 0;
    self.createdBy = "";
    self.datetimepickerOptions = {
      format: "DD/MM/YYYY",
      ignoreReadonly: true,
      useCurrent: false,
      locale: utilServ.lang.toLowerCase()
    };
    self.table = {
      dataSource: function (data) {
        return this.dataSource[data] = [];
      },
      autocomplete: function (data) {
        return this.autocomplete[data] = [];
      }
    },
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
    self.autoCompleteOptions = function (data) {
      return {
        minimumChars: 0,
        maxItemsToRender: 100,
        activateOnFocus: true,
        dropdownHeight: "202px",                
        selectedTextAttr: "label",
        itemTemplate: $templateCache.get('Autocomplete.Dropdown.Template.html'),
        noMatchTemplateEnabled: false,
        data: function (searchText) {                                 
          return _.filter(data, function (item) {                        
            return item.label.includes(searchText);
          });
        }
      };
    };
    self.authenInfo = {};
    self.isUser = false;        
    self.userInfo = {};
    self.getUserInfo = self.userInfo;
    self.maxClassYear = 6;
    self.maxSemester = 3;
    self.yearList = utilServ.getListYear("", 10, ((new Date().getFullYear() + 543) - 2500));
    self.permission = {
      admin: "ADMIN",
      user: "USER"
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

      $window.document.title = dictServ.dict.systemName[utilServ.lang];
      self.labelStyle = utilServ.getLabelStyle();
    };

    //ฟังก์ชั่นสำหรับแสดงข้อความเป็นภาษาที่กำหนดไว้ในส่วนของเนื้อหาส่วนหัวและส่วนท้าย
    self.setLanguageOnHeaderFooter = function () {
      $("main nav.navbar .navbar-top .lang").addClass("hidden");
      $("main nav.navbar .navbar-header .lang").addClass("hidden");

      $("main nav.navbar .navbar-top .lang-" + utilServ.lang.toLowerCase()).removeClass("hidden");
      $("main nav.navbar .navbar-header .lang-" + utilServ.lang.toLowerCase()).removeClass("hidden");
    };

    //ฟังก์ชั่นสำหรับปรับขนาดของสไลด์เมนู
    self.setSlideMenuLayout = function () {
      $timeout(function () {
        if ($("main section .panel-col.col-menu").hasClass("hidden") === false) {
          $("main section .panel-col.col-menu").height($(window).height() - $("main .sticky").outerHeight() - 30);
          if ($(window).width() <= 702) {
            $("main section .panel-col.col-menu").hide();
            self.slideLeftActive = false;
            self.windowWidth = $(window).width();
          }
          else {
            if (self.windowWidth <= 702) {
              $("main section .panel-col.col-menu").show();
              self.slideLeftActive = true;
              self.windowWidth = $(window).width();
            }
          }
        }
      }, 0);
    };

    //ฟังก์ชั่นสำหรับกำหนดข้อมูลของผู้ใช้งานหลังจากเข้าสู่ระบบ
    //โดยมีพารามิเตอร์ดังนี้
    //1. userData รับค่าข้อมูลผู้ใช้งาน
    self.setUserInfo = function (userData) {
      var personId = "";
      var username = "";
      var fullnameTH = "";
      var fullnameEN = "";
      var facultyId = "";
      var programId = "";
      var depId = "";
      var permission = "";
      var systemGroup = "";

      if (userData) {
        personId    = (userData.PersonId ? userData.PersonId : "");
        username    = (userData.Username ? userData.Username : "");
        fullnameTH  = (userData.FullnameTH ? userData.FullnameTH : "");
        fullnameEN  = (userData.FullnameEN ? userData.FullnameEN : "");
        facultyId   = (userData.FacultyId ? userData.FacultyId : "");
        programId   = (userData.ProgramId ? userData.ProgramId : "");
        depId       = (userData.DepId ? userData.DepId : "");
        permission  = (userData.Userlevel ? userData.Userlevel : "");
        systemGroup = (userData.SystemGroup ? userData.SystemGroup : "");
      }

      self.userInfo = {
        personId: personId,
        username: username,
        fullname: {
          TH: fullnameTH,
          EN: fullnameEN
        },
        facultyId: facultyId,
        programId: programId,
        depId: depId,
        permission: permission,
        systemGroup: systemGroup
      };

      self.getUserInfo = self.userInfo;
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

    //ฟังก์ชั่นสำหรับออกจากระบบ
    self.getSignOut = function () {
      if (utilServ.isHasCookie({ cookieName: self.cookieName }) === true)
        $cookies.remove(self.cookieName, { path: self.cookiePath });

      self.setUserInfo({});
    };

    //ฟังก์ชั่นสำหรับแสดงข้อมูลที่ได้หลังจากนำข้อมูลในอะเรย์มาจอยกัน
    self.getDataOnJoinArray = function (array, key) {
      var list = [];
      var data = "";

      angular.forEach(array, function (item1) {
        data = "";
        angular.forEach(key, function (item2) {
          data += item1[item2];
        });

        list.push(data);
      });

      return (list.join(""));
    };

    //ฟังก์ชั่นสำหรับเรียกดูข้อมูลต่าง ๆ จากฐานข้อมูล
    //โดยมีพารามิเตอร์ดังนี้
    //1. param รับค่าพารามิเตอร์ต่าง ๆ ที่ต้องการ
    //routePrefix   รับค่าข้อมูลที่ต้องการดู
    //action        รับค่ารูปแบบการเรียกดูข้อมูล
    //params        รับค่าพารามิเตอร์ที่ต้องใช้สำหรับเรียกดูข้อมูล
    self.getListData = function (param) {
      param.routePrefix = (param.routePrefix === undefined ? "" : param.routePrefix);
      param.action      = (param.action === undefined ? "" : param.action);
      param.params      = (param.params === undefined || param.params.length === 0 ? "" : param.params);

      var deferred = $q.defer();
      var dt = [];
      var url = (utilServ.getURLAPI(self.pathAPI) + param.routePrefix + "/");
      var route = "";
      var requireSignIn = $route.current.requireSignIn;

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

      url += (route + "?ver=" + utilServ.dateTimeOnURL + param.params);

      self.isActionValidateAuthen().then(function (result) {
        if (result && requireSignIn) {
          utilServ.http({
            url: url
          }).then(function (result) {
            deferred.resolve(result.data.data !== undefined && result.data.data !== null ? result.data.data : []);
          });
        }
        else
          deferred.resolve(dt);
      });

      return deferred.promise;
    };

    //ฟังก์ชั่นสำหรับตรวจสอบการเปลี่ยนแปลง
    self.watchChangeScreen = function () {            
      utilServ.setSectionLayout();

      if (self.isUser)
        self.setSlideMenuLayout();
    };

    self.isAuthenRoute = function (param) {
      param.requireSignIn = (param.requireSignIn === undefined ? false : param.requireSignIn);
      param.permission    = (param.permission === undefined ? "*" : param.permission);

      var deferred = $q.defer();            
      var res = {};
            
      return self.isAuthen({
        requireSignIn: param.requireSignIn,
        permission: param.permission
      }).then(function (result) {
        self.authenInfo = result;
      });
    };

    //ฟังก์ชั่นสำหรับตรวจสอบการยืนยันตัวตน
    //โดยมีพารามิเตอร์ดังนี้
    //1. param รับค่าพารามิเตอร์ต่าง ๆ ที่ต้องการ
    //requireSignIn รับค่าต้องการมีการเข้าสู่ระบบหรือไม่
    //permission    รับค่าสิทธิ์ของผู้ใช้งาน
    self.isAuthen = function (param) {
      param.requireSignIn = (param.requireSignIn === undefined ? false : param.requireSignIn);
      param.permission    = (param.permission === undefined ? "*" : param.permission);

      var deferred = $q.defer();
      var res = {};
      var account = {};

      utilServ.http({
        url: (utilServ.getURLAPI(self.pathAPI) + "AuthenStudentSystem/GetAccount?ver=" + utilServ.dateTimeOnURL)
      }).then(function (result) {
        res = result.data.data;

        if (res && res[0]) {
          account = res[0];

          if (param.requireSignIn === true) {                        
            res.status = true;
            res.status = (res.status && account.Username ? res.status : false);
            res.status = (res.status && account.FacultyId ? res.status : false);
            res.status = (res.status && account.Userlevel ? res.status : false);
            res.status = (res.status && account.SystemGroup ? res.status : false);
            res.status = (res.status && (account.SystemGroup === self.systemGroup) ? res.status : false);
                        
            if (res.status) {
              if (!self.getUserInfo.permission || (self.getUserInfo.permission === account.Userlevel)) {
                self.setUserInfo(account);
                            
                if (param.permission === "*")
                  res.status = true;
                else {
                  if (param.permission.indexOf(self.getUserInfo.permission) > -1)
                    res.status = true;
                  else {
                    res.status = false;
                    res.error = {
                      msg: ["authen", "permissionNotFound"]
                    };
                  }
                }
              }
              else {
                res.status = false;
                res.error = {
                  msg: ["authen", "permissionInvalid"]
                };
              }
            }
            else {
              self.getSignOut();

              res.status = false;
              res.error = {
                  msg: ["authen", "permissionNotFound"]
              };
            }
          }
        }
        else {
          self.getSignOut();

          res.status = false;
          res.error = {
            msg: ["authen", "accessNotFound"]
          };
        }

        self.isUser = res.status;
        self.slideLeftToggle = res.status;
        self.slideLeftActive = self.slideLeftActive;

        deferred.resolve(res);
      });
                    
      return deferred.promise;
    };

    //ฟังก์ชั่นสำหรับตรวจสอบสิทธิ์การเข้าใช้งานระบบก่อนการทำงานใด ๆ
    self.isActionValidateAuthen = function () {
      var deferred = $q.defer();
      var requireSignIn = $route.current.requireSignIn;
      var permission = $rootScope.$pageRouteServ.getPermissionInPage($route.current.permission);
      /*
      self.isAuthen({
        requireSignIn: requireSignIn,
        permission: permission
      }).then(function (result) {
        if (result.status === false && requireSignIn === true)
          self.closeDialogPreloading();

        deferred.resolve(result.status);
      });
      */
      deferred.resolve(true);

      return deferred.promise;
    };

    //ฟังก์ชั่นสำหรับการบันทึกข้อมูล
    self.save = {
      action: function (param) {
        param.routePrefix         = (param.routePrefix === undefined ? "" : param.routePrefix);
        param.action              = (param.action === undefined ? "" : param.action);
        param.data                = (param.data === undefined || param.data === "" ? {} : param.data);
        param.showMessageSuccess  = (param.showMessageSuccess === undefined ? true : param.showMessageSuccess);

        var deferred = $q.defer();
        var url = (utilServ.getURLAPI(self.pathAPI) + param.routePrefix + "/");
        var method = "";
        var route = "";
        var res = {};
        var data = {
          data: param.data
        };
        var requireSignIn = $route.current.requireSignIn;

        switch (param.action) {
          case "add": {
            method  = "POST";
            route   = "PostData";
            break;
          }
          case "edit": {
            method  = "PUT";
            route   = "PutData";
            break;
          }
          case "update": {
            method  = "PUT";
            route   = "UpdateData";
            break;
          }
          case "remove": {
            method  = "DELETE";
            route   = "DeleteData";
            break;
          }
          case "verify": {
            method  = "PUT";
            route   = "VerifyData";
            break;
          }
          case "sendVerify": {
            method  = "PUT";
            route   = "SendVerifyData";
            break;
          }
          case "setCancelStatus": {
            method  = "PUT";
            route   = "SetCancelStatus";
            break;
          }
          case "setAsDefault": {
            method = "PUT";
            route = "SetAsDefault";
            break;
          }
        }

        url += (route + "?ver=" + utilServ.dateTimeOnURL);

        utilServ.getDialogPreloadingWithDict(["msgPreloading", "saving"]);
                
        self.isActionValidateAuthen().then(function (result) {                    
          if (result && requireSignIn) {
            utilServ.http({
              url: url,
              method: method,
              data: data
            }).then(function (result) {
              self.closeDialogPreloading();
                            
              res = (result.data.data !== undefined && result.data.data !== null ? result.data.data[0] : {});

              var status = false;

              if (res) {
                if (res.resMessage === "Success" && res.resErrorNumber === null)
                  status = true;
              }

              angular.extend(res, {
                status: status
              });
              
              if (result.data.status) {
                if (method === "POST" || method === "PUT" || method === "DELETE") {
                  if (method === "POST" || method === "PUT") {
                    if (status) {                                        
                      if (param.showMessageSuccess)
                        utilServ.dialogMessageWithDict(["saveSuccess"], function () {
                          deferred.resolve(res);
                        });
                      else
                        deferred.resolve(res);
                    }
                    else
                      utilServ.dialogErrorWithDict(["saveNotSuccess"], function () {
                        deferred.resolve(res);
                      });
                  }                            
                  if (method === "DELETE") {
                    if (status) {                                        
                      if (param.showMessageSuccess)
                        utilServ.dialogMessageWithDict(["deleteSuccess"], function () {
                          deferred.resolve(res);
                        });
                      else
                        deferred.resolve(res);
                    }
                    else
                      utilServ.dialogErrorWithDict(["deleteNotSuccess"], function () {
                        deferred.resolve(res);
                      });
                  }
                }
                else {
                  if (status)
                    utilServ.dialogMessageWithDict(["processingSuccessful"], function () {
                      deferred.resolve(res);
                    });
                  else
                    utilServ.dialogErrorWithDict(["processingNotSuccessful"], function () {
                      deferred.resolve(res);
                    });
                }
              }
              else
                utilServ.dialogErrorWithDict(["authen", result.data.message], function () {
                  deferred.resolve(res);
                });
            });
          }
          else {
            self.closeDialogPreloading();

            res.status = false;

            deferred.resolve(res);
          }
        });                
        
        return deferred.promise;
      }         
    };

    self.gotoAnchor = function (id) {
      $anchorScroll(id);
    };
  })

  .run(function ($rootScope, $routeParams, utilServ, appServ, dictServ, pageRouteServ, facultyServ, departmentServ, majorServ, programmeServ, courseServ, instructorServ, subjectServ, kpiServ, TQFServ) {
    $rootScope.$routeParams = $routeParams;
    $rootScope.$utilServ = utilServ;
    $rootScope.$appServ = appServ;
    $rootScope.$dictServ = dictServ;
    $rootScope.$pageRouteServ = pageRouteServ;
    $rootScope.$facultyServ = facultyServ;
    $rootScope.$departmentServ = departmentServ;
    $rootScope.$majorServ = majorServ;
    $rootScope.$programmeServ = programmeServ;
    $rootScope.$courseServ = courseServ;        
    $rootScope.$instructorServ = instructorServ;
    $rootScope.$subjectServ = subjectServ;
    $rootScope.$kpiServ = kpiServ;
    $rootScope.$TQFServ = TQFServ;

    appServ.setLanguageDefault({});
    appServ.setLanguageOnHeaderFooter();                      
    $("main section .panel-col.col-menu .slidemenu").scrollbar();
    appServ.watchChangeScreen();
  });
})();