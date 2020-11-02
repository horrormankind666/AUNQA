/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๐/๐๔/๒๕๖๑>
Modify date : <๑๘/๑๐/๒๕๖๒>
Description : <รวมรวบฟังก์ชั่นใช้งานสำหรับข้อมูลการศึกษาในส่วนของข้อมูลรายวิชา>
=============================================
*/

(function () {
  "use strict";

  angular.module("academicInfo.courseMod", [
    "ngTable",
    "utilMod",
    "appMod",
    "dictMod",
    "pageRouteMod",
    "facultyMod",
    "courseMod"
  ])

  .controller("academicInfo.courseCtrl", function ($scope, $timeout, $q, $compile, utilServ, appServ, dictServ, pageRouteServ, facultyServ, courseServ) {
    var self = this;
        
    pageRouteServ.setMenuActive({
      menuName: (pageRouteServ.pageObject.faculty.class + "-menu"),
      isSubSubMenu: true
    });
    dictServ.dict.menuTmp = {
      TH: (dictServ.dict.course.TH + (facultyServ.facultyInfo.code ? (" : " + facultyServ.facultyInfo.code) : "")),
      EN: (dictServ.dict.course.EN + (facultyServ.facultyInfo.code ? (" : " + facultyServ.facultyInfo.code) : ""))
    };

    courseServ.dataRow = {};

    self.init = function () {
      if (appServ.isUser) {
        if (facultyServ.isFaculty) {                
            self.setValue().then(function () {                                        
              self.watchFormChange();
              self.resetValue();
              self.showForm = true;
              self.table.hide = false;

              self.tabSelect.selected("verified");
            });
        }
        else {
          self.showForm = false;

          appServ.closeDialogPreloading();

          utilServ.dialogErrorWithDict(["faculty", "facultyNotFound"], function (e) {
          });
        } 
      }
    };

    self.tabSelect = {
      activeTabIndex: 0,
      selected: function (tabName) {
        if (self[tabName].template.content.length === 0)
          utilServ.getDialogPreloadingWithDict(["msgPreloading", "loading"]);
                
        if (tabName === "verified")           this.activeTabIndex = 0;
        if (tabName === "pendingVerify")      this.activeTabIndex = 1;
        if (tabName === "sendingVerify")      this.activeTabIndex = 2;
        if (tabName === "transactionHistory") this.activeTabIndex = 3;

        self[tabName].template.init();
      }
    };

    self.watchFormChange = function () {
      $timeout(function () {
        $scope.$watch(function () {
          var watch = [];

          watch.push(self.table.isReload);

          return watch;
        }, function () {
          if (self.table.isReload) {
            courseServ.tableList.courseVerified.settings().$loading = false;
            courseServ.tableList.coursePendingVerify.settings().$loading = false;
            courseServ.tableList.courseSendingVerify.settings().$loading = false;
            courseServ.tableList.courseTransactionHistory.settings().$loading = false;
                        
            var obj = self.table.reload;

            obj.isPreloading = true;
            obj.isResetDataSource = true;
            obj.tableType = "master";
            obj.order = [{
              table: "courseVerified",
              isFirstPage: true
            }];
            obj.action().then(function () {
              /*
              obj.tableType = "temp";
              obj.order = [{
                  table: "coursePendingVerify",
                  isFirstPage: true
              }, {
                  table: "courseSendingVerify",
                  isFirstPage: true
              }, {
                  table: "courseTransactionHistory",
                  isFirstPage: true
              }];
              obj.action().then(function () {
              */
                self.table.hide = false;
              //});
            });
          }
        }, true);
      }, 0);
    };

    self.setValue = function () {
      var deferred = $q.defer();

      self.showForm = false;
      self.table.master.dataSource = [];
      self.table.reload.tableType = "master";
      self.table.reload.getData().then(function () {
        /*
        self.table.temp.dataSource = [];
        self.table.reload.tableType = "temp";
        self.table.reload.getData().then(function () {
        */
          courseServ.table = self.table;
            
          $timeout(function () {
            deferred.resolve();
          }, 0);
        //});
      });

      return deferred.promise;
    };

    self.resetValue = function () {
      utilServ.gotoTopPage();
    };

    self.table = {
      isReload: false,
      hide: true,
      master: {
        dataSource: []
      },
      temp: {
        dataSource: []
      },
      reload: {
        isPreloading: false,
        isResetDataSource: false,
        tableType: "",
        order: [],
        action: function () {
          var deferred = $q.defer();

          if (this.isPreloading) utilServ.getDialogPreloadingWithDict(["msgPreloading", "loading"]);
          if (this.isResetDataSource) self.table[this.tableType].dataSource = [];

          this.getData().then(function () {
            angular.forEach(self.table.reload.order, function (item) {
              courseServ.tableList[item.table].reload();
              if (courseServ.tableList[item.table].total() === 0) item.isFirstPage = true;
              if (item.isFirstPage) courseServ.tableList[item.table].page(1);
            });

            $timeout(function () {
              deferred.resolve();
            }, 0);
          });

          return deferred.promise;
        },
        getData: function () {
          var deferred = $q.defer();

          if (self.table.isReload) {
            self.table.isReload = false;
            self.table[this.tableType].dataSource = [];                        
          }

          courseServ.getDataSource({
            tableType: this.tableType,
            dataSource: self.table[this.tableType].dataSource,
            action: "getlist",
            params: [
                "",
                ("facultyId=" + facultyServ.facultyInfo.id)
            ].join("&")
          }).then(function (result) {
            self.table[self.table.reload.tableType].dataSource = result;

            $timeout(function () {
              deferred.resolve();
            }, 0);
          });

          return deferred.promise;
        }
      }
    };

    self.verified = {
      template: {
        content: "",
        init: function () {                    
          if (appServ.isUser && facultyServ.isFaculty)
            this.content = pageRouteServ.pageObject.course.verified.template;
        }
      }
    };

    self.pendingVerify = {
      template: {
        content: "",
        init: function () {
          if (appServ.isUser && facultyServ.isFaculty)
            this.content = pageRouteServ.pageObject.course.pendingVerify.template;
        }
      }
    };

    self.sendingVerify = {
      template: {
        content: "",
        init: function () {
          if (appServ.isUser && facultyServ.isFaculty)
            this.content = pageRouteServ.pageObject.course.sendingVerify.template;
        }
      }
    };

    self.transactionHistory = {
      template: {
        content: "",
        init: function () {
          if (appServ.isUser && facultyServ.isFaculty)
            this.content = pageRouteServ.pageObject.course.transactionHistory.template;
        }
      }
    };
    /*
    self.addedit = {
      showForm: false,
      template: {
        content: "",          
        action: "",
        init: function () {
          if (appServ.isUser && facultyServ.isFaculty && self.addedit.showForm) {
            utilServ.getDialogPreloadingWithDict(["msgPreloading", "loading"]);

            this.content = pageRouteServ.pageObject.course.addedit.template;
          }
        },
        remove: function () {                    
          pageRouteServ.setMenuActiveAction({
            menuName: (pageRouteServ.pageObject.faculty.class + "-menu"),
            isSubSubMenu: true
          });

          utilServ.removeCacheTemplate(this.content);
          this.content = "";
        }
      },
      init: function () {
        if (appServ.isUser && facultyServ.isFaculty) {
          var action = self.addedit.template.action;

          if (action === "add" || action === "edit")
            pageRouteServ.setMenuActiveAction({
                menuName: (pageRouteServ.pageObject.faculty.class + "-menu"),
                isSubSubMenu: true,
                action: action
            });

          this.setValue().then(function () {
            self.addedit[action].setValue().then(function () {
              self.addedit.watchFormChange();
              self.addedit.resetValue();
              self.addedit.showForm = true;

              appServ.closeDialogPreloading();
            });
          });
        }
        else
          self.addedit.showForm = false;
      },
      formField: {
        id: "",
        code: {
          TH: "",
          EN: ""
        },
        name: {
          TH: "",
          EN: ""
        },
        abbrev: {
          TH: "",
          EN: ""
        },
        credit: "",
        lectureCredit: "",
        labCredit: "",
        seminarCredit: ""
      },
      formValue: {
        id: "",
        code: {
          TH: "",
          EN: ""
        },
        name: {
          TH: "",
          EN: ""
        },
        abbrev: {
          TH: "",
          EN: ""
        },
        credit: "",
        lectureCredit: "",
        labCredit: "",
        seminarCredit: ""
      },
      formValidate: {
        setValue: function () {
          this.resetValue();
        },
        resetValue: function () {
          this.showSaveError = false;
          this.isValid = {
            code: {
              EN: true
            },
            name: {
              EN: true
            },
            credit: true
          };
        }
      },
      watchFormChange: function () {
        $timeout(function () {
          $scope.$watch(function () {
            var watch = [];

            watch.push(self.addedit.formField.code.TH);
            watch.push(self.addedit.formField.code.EN);
            watch.push(self.addedit.formField.name.TH);
            watch.push(self.addedit.formField.name.EN);
            watch.push(self.addedit.formField.abbrev.TH);
            watch.push(self.addedit.formField.abbrev.EN);
            watch.push(self.addedit.formField.credit);
            watch.push(self.addedit.formField.lectureCredit);
            watch.push(self.addedit.formField.labCredit);
            watch.push(self.addedit.formField.seminarCredit);

            return watch;
          }, function () {
            var exit = false;

            if (!exit) {
              if ((self.addedit.formField.code.TH !== self.addedit.formValue.code.TH) ||
                  (self.addedit.formField.code.EN !== self.addedit.formValue.code.EN) ||
                  (self.addedit.formField.name.TH !== self.addedit.formValue.name.TH) ||
                  (self.addedit.formField.name.EN !== self.addedit.formValue.name.EN) ||
                  (self.addedit.formField.abbrev.TH !== self.addedit.formValue.abbrev.TH) ||
                  (self.addedit.formField.abbrev.EN !== self.addedit.formValue.abbrev.EN) ||
                  (self.addedit.formField.credit !== self.addedit.formValue.credit) ||
                  (self.addedit.formField.lectureCredit !== self.addedit.formValue.lectureCredit) ||
                  (self.addedit.formField.labCredit !== self.addedit.formValue.labCredit) ||
                  (self.addedit.formField.seminarCredit !== self.addedit.formValue.seminarCredit))
                  exit = true;
            }

            //self.addedit.isFormChanged = exit;
            //self.addedit.formValidate.resetValue();
          }, true);
        }, 0);
      },
      setValue: function () {
        var deferred = $q.defer();

        this.isAdd = false;
        this.isEdit = false;
        this.isDelete = false;
        this.isFormChanged = false;

        this.formValidate.setValue();

        $timeout(function () {
          deferred.resolve();
        }, 0);

        return deferred.promise;
      },
      resetValue: function () {
        var dataRow = {};

        if (this.isEdit)    dataRow = this.edit.dataRow;
        if (this.isDelete)  dataRow = this.delete.dataRow;
                
        this.formValue.id = (Object.keys(dataRow).length > 0 && dataRow.id ? dataRow.id : "");
        this.formField.id = this.formValue.id;
                
        if (this.isAdd || this.isEdit) {
          this.formValue.code.TH = (dataRow.code ? dataRow.code.TH : "");
          this.formField.code.TH = this.formValue.code.TH;

          this.formValue.code.EN = (dataRow.code ? dataRow.code.EN : "");
          this.formField.code.EN = this.formValue.code.EN;

          this.formValue.name.TH = (dataRow.name ? dataRow.name.TH : "");
          this.formField.name.TH = this.formValue.name.TH;

          this.formValue.name.EN = (dataRow.name ? dataRow.name.EN : "");
          this.formField.name.EN = this.formValue.name.EN;

          this.formValue.abbrev.TH = (dataRow.abbrev ? dataRow.abbrev.TH : "");
          this.formField.abbrev.TH = this.formValue.abbrev.TH;

          this.formValue.abbrev.EN = (dataRow.abbrev ? dataRow.abbrev.EN : "");
          this.formField.abbrev.EN = this.formValue.abbrev.EN;

          this.formValue.credit = (dataRow.credit ? dataRow.credit : "");
          this.formField.credit = this.formValue.credit;

          this.formValue.lectureCredit = (dataRow.lectureCredit ? dataRow.lectureCredit : "");
          this.formField.lectureCredit = this.formValue.lectureCredit;

          this.formValue.labCredit = (dataRow.labCredit ? dataRow.labCredit : "");
          this.formField.labCredit = this.formValue.labCredit;

          this.formValue.seminarCredit = (dataRow.seminarCredit ? dataRow.seminarCredit : "");                                                                                                                                                                                    
          this.formField.seminarCredit = this.formValue.seminarCredit;

          this.formValidate.resetValue();
          utilServ.gotoTopPage();
        }
      },
      getValue: function () {
        var result = {
          id: (this.formField.id ? this.formField.id : ""),
          facultyId: facultyServ.facultyInfo.id,
          codeTh: (this.formField.code.TH ? this.formField.code.TH : ""),
          codeEn: (this.formField.code.EN ? this.formField.code.EN : ""),
          nameTh: (this.formField.name.TH ? this.formField.name.TH : ""),
          nameEn: (this.formField.name.EN ? this.formField.name.EN : ""),
          abbrevTh: (this.formField.abbrev.TH ? this.formField.abbrev.TH : ""),
          abbrevEn: (this.formField.abbrev.EN ? this.formField.abbrev.EN : ""),
          credit: (this.formField.credit ? this.formField.credit : ""),
          lectureCredit: (this.formField.lectureCredit ? this.formField.lectureCredit : ""),
          labCredit: (this.formField.labCredit ? this.formField.labCredit : ""),
          seminarCredit: (this.formField.seminarCredit ? this.formField.seminarCredit : "")
        };

        return result;
      },
      add: {
        init: function () {
          self.addedit.init();
        },
        setValue: function () {
          var deferred = $q.defer();

          self.addedit.isAdd = true;
          self.addedit.isEdit = false;
          self.addedit.isDelete = false;

          $timeout(function () {
            deferred.resolve();
          }, 0);

          return deferred.promise;
        }
      },
      edit: {
        dataRow: {},                
        init: function () {
          self.addedit.init();
        },
        setValue: function () {
          var deferred = $q.defer();

          self.addedit.isAdd = false;
          self.addedit.isEdit = true;
          self.addedit.isDelete = false;

          courseServ.getDataSource({
            action: "get",
            params: [
                "",
                ("courseId=" + self.addedit.formValue.id)
            ].join("&")
          }).then(function (result) {
            self.addedit.edit.dataRow = (result[0] ? result[0] : {});

            $timeout(function () {
              deferred.resolve();
            }, 0);
          });

          return deferred.promise;
        }
      },
      delete: {
        dataRow: {},
        init: function () {
          this.setValue();
        },
        setValue: function () {                    
          self.addedit.isAdd = false;
          self.addedit.isEdit = false;
          self.addedit.isDelete = true;

          self.addedit.resetValue();
        }
      },
      saveChange: {
        validate: function () {
          var i = 0;
                    
          if (self.addedit.isAdd || self.addedit.isEdit) {
            if (!self.addedit.formField.code.EN) { self.addedit.formValidate.isValid.code.EN = false; i++; }
            if (!self.addedit.formField.name.EN) { self.addedit.formValidate.isValid.name.EN = false; i++; }
            if (!self.addedit.formField.credit) { self.addedit.formValidate.isValid.credit = false; i++; }
          }

          self.addedit.formValidate.showSaveError = (i > 0 ? true : false);

          return (i > 0 ? false : true);
        },
        action: function () {
          if (this.validate()) {              
            var action;

            if (self.addedit.isAdd)     action = "add";
            if (self.addedit.isEdit)    action = "edit";
            if (self.addedit.isDelete)  action = "remove";

            utilServ.dialogConfirmWithDict([action, "confirm"], function (result) {
              if (result) {                                                                
                var data = self.addedit.getValue();

                if (self.addedit.isDelete)
                  utilServ.getDialogPreloadingWithDict(["msgPreloading", "removing"]);

                appServ.save.action({
                  routePrefix: "Course",
                  action: action,
                  data: [data]
                }).then(function (result) {
                  if (result.status) {
                    if (self.addedit.isAdd || self.addedit.isEdit) {                                            
                      var action = self.addedit.template.action;

                      self.addedit[action].setValue().then(function () {
                        self.addedit.isFormChanged = false;
                        self.addedit.resetValue();
                      });
                    }
                    if (self.addedit.isDelete) {
                      var obj = self.table.reload;

                      obj.isPreloading = false;
                      obj.isResetDataSource = true;
                      obj.order = [{
                        table: "courseVerified",
                        isFirstPage: false
                      }, {
                        table: "coursePendingVerify",
                        isFirstPage: false
                      }];
                      obj.action();
                    }
                  }
                });
              }
            });                                                    
          }
          else {
            utilServ.gotoTopPage();
            utilServ.dialogErrorWithDict(["save", "error"], function () { });
          }
        }
      }
    };
    */
    self.addedit = {
      showForm: false,
      template: {
        content: "",          
        action: "",
        init: function () {
          if (appServ.isUser && facultyServ.isFaculty && self.addedit.showForm) {
            utilServ.getDialogPreloadingWithDict(["msgPreloading", "loading"]);
                        
            this.content = pageRouteServ.pageObject.course.addedit.template;
          }
        },
        remove: function () {                    
          pageRouteServ.setMenuActiveAction({
            menuName: (pageRouteServ.pageObject.faculty.class + "-menu"),
            isSubSubMenu: true
          });

          utilServ.removeCacheTemplate(this.content);
          this.content = "";
        }
      },
      init: function () {
        if (appServ.isUser && facultyServ.isFaculty) {                    
          var action = self.addedit.template.action;

          if (action === "add")
            pageRouteServ.setMenuActiveAction({
              menuName: (pageRouteServ.pageObject.faculty.class + "-menu"),
              isSubSubMenu: true,
              action: "add"
            });

          this.setValue().then(function () {
            self.addedit[action].setValue();
            self.addedit.resetValue();
            self.addedit.showForm = true;
          });
        }
        else
          self.addedit.showForm = false;
      },
      setValue: function () {
        var deferred = $q.defer();

        this.isAdd = false;
        this.isEdit = false;
        this.isUpdate = false;
        this.isDelete = false;

        $timeout(function () {
          deferred.resolve();
        }, 0);

        return deferred.promise;
      },
      resetValue: function () {
      },
      add: {
        init: function () {
          self.addedit.init();
        },
        setValue: function () {
          self.addedit.isAdd = true;
        }                
      }
    };

    self.sendVerifyReject = {
      getDialogForm: {
        template: pageRouteServ.pageObject.course.sendVerifyReject.template,
        validate: function () {
          if (courseServ.dataSelect.data.length === 0) {
            utilServ.dialogErrorWithDict(["entries", "selectError"], function () { });
            return false;
          }

          return true;
        },
        action: function () {                    
          if (appServ.isUser && facultyServ.isFaculty) {
            if (this.validate()) {
              utilServ.getDialogPreloadingWithDict(["msgPreloading", "loading"]);
                            
              $timeout(function () {
                utilServ.http({
                  url: self.sendVerifyReject.getDialogForm.template
                }).then(function (result) {
                  var title = ["course", courseServ.dataSelect.action];
                  var content = $compile($(".template-content").html(result.data).contents())($scope);
                                    
                  appServ.dialogFormOptions = {
                    cssClass: "",
                    title: title,
                    content: content
                  };
                });
              }, 0);
            }
          }
        }
      }
    };
  })

  .controller("academicInfo.course.verifiedCtrl", function ($scope, $timeout, $q, $filter, NgTableParams, utilServ, appServ, facultyServ, courseServ) {
    var self = this;

    self.init = function () {                        
      if (appServ.isUser && facultyServ.isFaculty) {
        self.setValue().then(function () {                    
          self.watchFormChange();                    
          self.resetValue();
          self.showForm = true;
                    
          appServ.closeDialogPreloading();
        });
      }
      else
        self.showForm = false;
    };
        
    self.watchFormChange = function () {            
      $timeout(function () {
        $scope.$watch(function () {
          var watch = [];

          watch.push(courseServ.tableList.courseVerified.settings().$loading);

          return watch;
        }, function () {
          if (courseServ.tableList.courseVerified.settings().$loading) {   
            $(".academicinfo.course.verified table tbody").hide();
            $(".academicinfo.course.verified .pagination").hide();
          }
          else {
            $(".academicinfo.course.verified table tbody").show();
            $(".academicinfo.course.verified .pagination").show();

            self.table.finishRender();
          }
        }, true);

        $scope.$watch(function () {
          return [
            self.table.filter.formField.keyword
          ];
        }, function (newValue, oldValue) {
          if (newValue[0] !== oldValue[0]) {
            var obj = courseServ.table.reload;

            obj.isPreloading = false;
            obj.isResetDataSource = false;
            obj.tableType = "master";
            obj.order = [{
              table: "courseVerified",
              isFirstPage: true
            }];
            obj.action();
          }
        }, true);
      }, 0);
    };

    self.setValue = function () {
      var deferred = $q.defer();

      self.showForm = false;
            
      self.table.filter.setValue();
      self.table.getData();

      $timeout(function () {
        deferred.resolve();
      }, 0);
            
      return deferred.promise;
    };

    self.resetValue = function () {
      utilServ.gotoTopPage();
    };

    self.table = {
      temp: [],
      filter: {
        formField: {
          keyword: ""
        },
        setValue: function () {                    
          this.resetValue();
          this.showForm = false;
        },
        resetValue: function () {
          this.formField.keyword = "";
        },
        action: function (dataTable) {
          return $filter("filter")(dataTable, {
              selectFilter: (this.formField.keyword ? this.formField.keyword : "!null")
          });
        }
      },
      getData: function () {
        courseServ.tableList.courseVerified = new NgTableParams(appServ.tableConfig.params, angular.extend(appServ.tableConfig.setting, {
          getData: function (params) {
            return $timeout(function () { }, appServ.tableConfig.timeout).then(function (result) {           
              courseServ.table.reload.tableType = "master";
              return courseServ.table.reload.getData().then(function () {
                var dt = courseServ.table.master.dataSource;
                var df = self.table.filter.action(dt);
                var data = df.slice((params.page() - 1) * params.count(), params.page() * params.count());

                self.table.temp = df;

                params.total(df.length);
                params.totalSearch = dt.length;
                params.totalPage = (Math.ceil(params.total() / params.count()));                                

                return data;
              });
            });
          }
        }));
      },
      finishRender: function () {
        appServ.closeDialogPreloading();
        utilServ.setSectionLayout();
        utilServ.gotoTopPage();
      }
    };
  })

  .controller("academicInfo.course.pendingVerifyCtrl", function ($scope, $timeout, $q, $filter, NgTableParams, utilServ, appServ, facultyServ, courseServ) {
    var self = this;

    self.init = function () {
      if (appServ.isUser && facultyServ.isFaculty) {
        self.setValue().then(function () {                    
          self.watchFormChange();                    
          self.resetValue();
          self.showForm = true;                            

          appServ.closeDialogPreloading();
        });
      }
      else
        self.showForm = false;
    };

    self.watchFormChange = function () {
      $timeout(function () {
        $scope.$watch(function () {
          var watch = [];

          watch.push(courseServ.tableList.coursePendingVerify.settings().$loading);
          watch.push(courseServ.dataSelect.data);

          return watch;
        }, function () {
          if (courseServ.tableList.coursePendingVerify.settings().$loading) {                        
            $(".academicinfo.course.pendingverify table tbody").hide();
            $(".academicinfo.course.pendingverify .pagination").hide();
          }
          else {
            $(".academicinfo.course.pendingverify table tbody").show();
            $(".academicinfo.course.pendingverify .pagination").show();                

            self.table.finishRender();
          }

          if (courseServ.dataSelect.data.length === 0)
            self.uncheckboxAll();
        }, true);

        $scope.$watch(function () {
          return [
            self.table.filter.formField.keyword,
            self.table.filter.formField.verifyStatusSelected.selected
          ];
        }, function (newValue, oldValue) {
          if ((newValue[0] !== oldValue[0]) ||
              (newValue[1] !== oldValue[1])) {
            var obj = courseServ.table.reload;

            obj.isPreloading = false;
            obj.isResetDataSource = false;
            obj.tableType = "temp";
            obj.order = [{
              table: "coursePendingVerify",
              isFirstPage: true
            }];
            obj.action();
            self.uncheckboxAll();
          }
        }, true);
      }, 0);
    };

    self.setValue = function () {
      var deferred = $q.defer();

      self.showForm = false;
            
      self.table.filter.setValue();
      //self.table.getData();
            
      $timeout(function () {
        deferred.resolve();
      }, 0);
            
      return deferred.promise;
    };

    self.resetValue = function () {
      utilServ.gotoTopPage();
    };

    self.table = {
      temp: [],            
      formField: {
        toggle: {},
        checkboxes: {
          checked: false,
          items: {}
        }
      },
      filter: {
        formField: {
          keyword: "",
          verifyStatusSelected: {}
        },
        setValue: function () {                    
          this.resetValue();
          this.showForm = false;
        },
        resetValue: function () {
          this.formField.keyword = "";
          this.formField.verifyStatusSelected = {};
        },
        action: function (dataTable) {
          return $filter("filter")(dataTable, {
            selectFilter: (this.formField.keyword ? this.formField.keyword : "!null"),
            cancelStatus: "!Y",
            verifyStatus: "!Y",
            status: (this.formField.verifyStatusSelected.selected ? this.formField.verifyStatusSelected.selected.id : "!S")
          });
        }
      },
      getData: function () {
        courseServ.tableList.coursePendingVerify = new NgTableParams(appServ.tableConfig.params, angular.extend(appServ.tableConfig.setting, {
          getData: function (params) {
            return $timeout(function () { }, appServ.tableConfig.timeout).then(function (result) {
              courseServ.table.reload.tableType = "temp";
              return courseServ.table.reload.getData().then(function () {
                var dt = courseServ.table.temp.dataSource;
                var df = self.table.filter.action(dt);
                var data = df.slice((params.page() - 1) * params.count(), params.page() * params.count());

                self.table.temp = df;

                params.total(df.length);
                params.totalSearch = dt.length;
                params.totalPage = (Math.ceil(params.total() / params.count()));

                return data;
              });
            });
          }
        }));
      },
      finishRender: function () {
        appServ.closeDialogPreloading();
        utilServ.setSectionLayout();
        utilServ.gotoTopPage();
      }
    };

    self.checkboxRootOnOffByChild = function () {            
      var data = self.table.temp.filter(function (dr) {
        return dr.status !== "Y";
      });

      self.table.formField.checkboxes.checked = utilServ.uncheckboxRoot({
        data: data,
        checkboxesRoot: self.table.formField.checkboxes.checked,
        checkboxesChild: self.table.formField.checkboxes.items,
        field: "id"
      });
    };

    self.checkboxChildOnOffByRoot = function () {
      var data = self.table.temp.filter(function (dr) {
        return dr.status !== "Y";
      });

      utilServ.uncheckboxAll({
        data: data,
        checkboxesRoot: self.table.formField.checkboxes.checked,
        checkboxesChild: self.table.formField.checkboxes.items,
        field: "id"
      });
    };

    self.uncheckboxAll = function () {
      if ($(".academicinfo.course.pendingverify .table .inputcheckbox:checked").length > 0) {
        if (self.table.formField.checkboxes.checked) self.table.formField.checkboxes.checked = false;                
        self.checkboxChildOnOffByRoot();
      }
    };

    self.verifyReject = {
      setValue: function (action) {       
        var data = self.table.temp.filter(function (dr) {
          return dr.status !== "Y";
        });
                
        courseServ.dataSelect = {
          action: action,
          data: utilServ.getValueCheckboxTrue(data, "id", self.table.formField.checkboxes.items)
        };
      }
    };
  })

  .controller("academicInfo.course.sendingVerifyCtrl", function ($scope, $timeout, $q, $filter, NgTableParams, utilServ, appServ, facultyServ, courseServ) {
    var self = this;

    self.init = function () {
      if (appServ.isUser && facultyServ.isFaculty) {
        self.setValue().then(function () {                    
          self.watchFormChange();                    
          self.resetValue();
          self.showForm = true;                            

          appServ.closeDialogPreloading();
        });
      }
      else
        self.showForm = false;
    };

    self.watchFormChange = function () {
      $timeout(function () {
        $scope.$watch(function () {
          var watch = [];

          watch.push(courseServ.tableList.courseSendingVerify.settings().$loading);
          watch.push(courseServ.dataSelect.data);

          return watch;
        }, function () {
          if (courseServ.tableList.courseSendingVerify.settings().$loading) {                        
            $(".academicinfo.course.sendingverify table tbody").hide();
            $(".academicinfo.course.sendingverify .pagination").hide();
          }
          else {
            $(".academicinfo.course.sendingverify table tbody").show();
            $(".academicinfo.course.sendingverify .pagination").show();                

            self.table.finishRender();
          }

          if (courseServ.dataSelect.data.length === 0)
            self.uncheckboxAll();
        }, true);

        $scope.$watch(function () {
          return [
            self.table.filter.formField.keyword
          ];
        }, function (newValue, oldValue) {
          if (newValue[0] !== oldValue[0]) {
            var obj = courseServ.table.reload;

            obj.isPreloading = false;
            obj.isResetDataSource = false;
            obj.tableType = "temp";
            obj.order = [{
              table: "courseSendingVerify",
              isFirstPage: true
            }];
            obj.action();
            self.uncheckboxAll();
          }
        }, true);
      }, 0);
    };

    self.setValue = function () {
      var deferred = $q.defer();

      self.showForm = false;
            
      self.table.filter.setValue();
      //self.table.getData();
            
      $timeout(function () {
        deferred.resolve();
      }, 0);
            
      return deferred.promise;
    };

    self.resetValue = function () {
      utilServ.gotoTopPage();
    };

    self.table = {
      temp: [],            
      formField: {
        toggle: {},
        checkboxes: {
          checked: false,
          items: {}
        }
      },
      filter: {
        formField: {
          keyword: ""
        },
        setValue: function () {                    
          this.resetValue();
          this.showForm = false;
        },
        resetValue: function () {
          this.formField.keyword = "";
        },
        action: function (dataTable) {
          return $filter("filter")(dataTable, {
            selectFilter: (this.formField.keyword ? this.formField.keyword : "!null"),
            cancelStatus: "!Y",
            status: "S"
          });
        }
      },
      getData: function () {
        courseServ.tableList.courseSendingVerify = new NgTableParams(appServ.tableConfig.params, angular.extend(appServ.tableConfig.setting, {
          getData: function (params) {
            return $timeout(function () { }, appServ.tableConfig.timeout).then(function (result) {
              courseServ.table.reload.tableType = "temp";
              return courseServ.table.reload.getData().then(function () {
                var dt = courseServ.table.temp.dataSource;
                var df = self.table.filter.action(dt);
                var data = df.slice((params.page() - 1) * params.count(), params.page() * params.count());

                self.table.temp = df;

                params.total(df.length);
                params.totalSearch = dt.length;
                params.totalPage = (Math.ceil(params.total() / params.count()));

                return data;
              });
            });
          }
        }));
      },
      finishRender: function () {
        appServ.closeDialogPreloading();
        utilServ.setSectionLayout();
        utilServ.gotoTopPage();
      }
    };

    self.checkboxRootOnOffByChild = function () {            
      var data = self.table.temp.filter(function (dr) {
        return dr.status === "S";
      });

      self.table.formField.checkboxes.checked = utilServ.uncheckboxRoot({
        data: data,
        checkboxesRoot: self.table.formField.checkboxes.checked,
        checkboxesChild: self.table.formField.checkboxes.items,
        field: "id"
      });
    };

    self.checkboxChildOnOffByRoot = function () {
      var data = self.table.temp.filter(function (dr) {
        return dr.status === "S";
      });

      utilServ.uncheckboxAll({
        data: data,
        checkboxesRoot: self.table.formField.checkboxes.checked,
        checkboxesChild: self.table.formField.checkboxes.items,
        field: "id"
      });
    };

    self.uncheckboxAll = function () {            
      if ($(".academicinfo.course.sendingverify .table .inputcheckbox:checked").length > 0) {                
        if (self.table.formField.checkboxes.checked) self.table.formField.checkboxes.checked = false;                
        self.checkboxChildOnOffByRoot();
      }
    };

    self.sendVerify = {
      setValue: function (action) {                
        var data = self.table.temp.filter(function (dr) {
          return dr.status === "S";
        });

        courseServ.dataSelect = {
          action: action,
          data: utilServ.getValueCheckboxTrue(data, "id", self.table.formField.checkboxes.items)
        };
      }
    };
  })

  .controller("academicInfo.course.transactionHistoryCtrl", function ($scope, $timeout, $q, $filter, NgTableParams, utilServ, appServ, facultyServ, courseServ) {
    var self = this;

    self.init = function () {
      if (appServ.isUser && facultyServ.isFaculty) {
        self.setValue().then(function () {                    
          self.watchFormChange();                    
          self.resetValue();
          self.showForm = true;

          appServ.closeDialogPreloading();
        });
      }
      else
        self.showForm = false;
    };

    self.watchFormChange = function () {
      $timeout(function () {
        $scope.$watch(function () {
          var watch = [];

          watch.push(courseServ.tableList.courseTransactionHistory.settings().$loading);

          return watch;
        }, function () {
          if (courseServ.tableList.courseTransactionHistory.settings().$loading) {                        
            $(".academicinfo.course.transactionhistory table tbody").hide();
            $(".academicinfo.course.transactionhistory .pagination").hide();
          }
          else {
            $(".academicinfo.course.transactionhistory table tbody").show();
            $(".academicinfo.course.transactionhistory .pagination").show();                

            self.table.finishRender();
          }
        }, true);

        $scope.$watch(function () {
          return [
            self.table.filter.formField.keyword,
            self.table.filter.formField.verifyStatusSelected.selected
          ];
        }, function (newValue, oldValue) {
          if ((newValue[0] !== oldValue[0]) ||
              (newValue[1] !== oldValue[1])) {
            var obj = courseServ.table.reload;

            obj.isPreloading = false;
            obj.isResetDataSource = false;
            obj.tableType = "temp";
            obj.order = [{
              table: "courseTransactionHistory",
              isFirstPage: true
            }];
            obj.action();
          }
        }, true);
      }, 0);
    };

    self.setValue = function () {
      var deferred = $q.defer();

      self.showForm = false;
            
      self.table.filter.setValue();
      //self.table.getData();
            
      $timeout(function () {
        deferred.resolve();
      }, 0);
            
      return deferred.promise;
    };

    self.resetValue = function () {
      utilServ.gotoTopPage();
    };

    self.table = {
      temp: [], 
      formField: {
        toggle: {}
      },            
      filter: {
        formField: {
          keyword: "",
          verifyStatusSelected: {}
        },
        setValue: function () {                    
          this.resetValue();
          this.showForm = false;
        },
        resetValue: function () {
          this.formField.keyword = "";
          this.formField.verifyStatusSelected = {};
        },
        action: function (dataTable) {
          return $filter("filter")(dataTable, {
            selectFilter: (this.formField.keyword ? this.formField.keyword : "!null"),
            status: (this.formField.verifyStatusSelected.selected ? this.formField.verifyStatusSelected.selected.id : "!null")
          });
        }
      },
      getData: function () {
        courseServ.tableList.courseTransactionHistory = new NgTableParams(appServ.tableConfig.params, angular.extend(appServ.tableConfig.setting, {
          getData: function (params) {
            return $timeout(function () { }, appServ.tableConfig.timeout).then(function (result) {
              courseServ.table.reload.tableType = "temp";
              return courseServ.table.reload.getData().then(function () {
                var dt = courseServ.table.temp.dataSource;
                var df = self.table.filter.action(dt);
                var data = df.slice((params.page() - 1) * params.count(), params.page() * params.count());

                self.table.temp = df;

                params.total(df.length);
                params.totalSearch = dt.length;
                params.totalPage = (Math.ceil(params.total() / params.count()));

                return data;
              });
            });
          }
        }));
      },
      finishRender: function () {
        appServ.closeDialogPreloading();
        utilServ.setSectionLayout();
        utilServ.gotoTopPage();
      }
    };
  })

  .controller("academicInfo.course.sendVerifyRejectCtrl", function ($scope, $timeout, $q, $filter, NgTableParams, utilServ, appServ, dictServ, facultyServ, courseServ) {
    var self = this;
    /*                
    self.init = function () {                                       
      if (appServ.isUser && facultyServ.isFaculty) {
        self.setValue().then(function () {
          self.watchFormChange();
          self.resetValue();
          self.showForm = true;
          self.table.hide = false;
        });
      }
      else
        self.showForm = false;
    };

    self.formField = {
      verifyRemark: ""
    };

    self.formValidate = {
      setValue: function () {
        this.resetValue();
      },
      resetValue: function () {
        this.showSaveError = false;
        this.isValid = {
          verifyRemark: true
        };
      }
    };

    self.watchFormChange = function () {
      $timeout(function () {
        $scope.$watch(function () {
          var watch = [];

          watch.push(courseServ.tableList.courseVerifyReject.settings().$loading);

          return watch;
        }, function () {
          if (courseServ.tableList.courseVerifyReject.settings().$loading) {                        
            $(".academicinfo.course.verifyreject table tbody").hide();
            $(".academicinfo.course.verifyreject .pagination").hide();
          }
          else {
            $(".academicinfo.course.verifyreject table tbody").show();
            $(".academicinfo.course.verifyreject .pagination").show();                

            self.table.finishRender();
          }
        }, true);

        $scope.$watch(function () {
          return [
            self.table.filter.formField.keyword
          ];
        }, function (newValue, oldValue) {
          if (newValue[0] !== oldValue[0]) {
            var obj = self.table.reload;

            obj.isPreloading = false;
            obj.action();
          }
        }, true);
      }, 0);
    };

    self.setValue = function () {
      var deferred = $q.defer();

      self.table.temp = [];
      self.showForm = false;

      self.formValidate.setValue();            

      angular.forEach(courseServ.dataSelect.data, function (item) {
        self.table.temp.push(
          $filter("filter")(courseServ.table.dataSource, {
            id: item
          })[0]
        );
      });                

      self.table.filter.setValue();
      self.table.getData();

      $timeout(function () {
        deferred.resolve();
      }, 0);
            
      return deferred.promise;
    };

    self.resetValue = function () {
      self.formField.verifyRemark = "";
    };

    self.table = {
      temp: [],
      hide: true,
      filter: {
        formField: {
          keyword: ""
        },
        setValue: function () {                    
          this.resetValue();
          this.showForm = false;
        },
        resetValue: function () {
          this.formField.keyword = "";
        },
        action: function (dataTable) {
          return $filter("filter")(dataTable, {
            selectFilter: (this.formField.keyword ? this.formField.keyword : "!null")                        
          });
        }
      },
      getData: function () {
        courseServ.tableList.courseVerifyReject = new NgTableParams(appServ.tableConfig.params, angular.extend(appServ.tableConfig.setting, {
          getData: function (params) {
            return $timeout(function () { }, appServ.tableConfig.timeout).then(function (result) {                            
              var dt = self.table.temp;
              var df = self.table.filter.action(dt);
              var data = df.slice((params.page() - 1) * params.count(), params.page() * params.count());

              params.total(df.length);
              params.totalSearch = dt.length;
              params.totalPage = (Math.ceil(params.total() / params.count()));

              return data;
            });
          }
        }));
      },
      finishRender: function () {
        appServ.closeDialogPreloading();

        $timeout(function () {
          if ($("#" + utilServ.idDialogForm).is(":visible") === false) {
            utilServ.dialogFormWithDict(appServ.dialogFormOptions, function (e) { });
          }
        }, 0);
      },
      reload: {
        isPreloading: false,
        action: function () {
          if (this.isPreloading) utilServ.getDialogPreloadingWithDict(dictServ.dict.msgPreloading.loading);

          courseServ.tableList.courseVerifyReject.reload();
          courseServ.tableList.courseVerifyReject.page(1);
        }
      }
    };

    self.getValue = function () {
      var result = [];
      var verifyStatus = "";
      var verifyRemark = "";

      if (courseServ.dataSelect.action === "verify") {
        verifyStatus = "Y";
        verifyRemark = null;
      }
      if (courseServ.dataSelect.action === "reject") {
        verifyStatus = "N";
        verifyRemark = self.formField.verifyRemark;
      }

      angular.forEach(courseServ.dataSelect.data, function (item) {
        result.push({
          id: item,
          verifyStatus: verifyStatus,
          verifyRemark: verifyRemark
        });
      });

      return result;
    };

    self.saveChange = {
      validate: function () {
        var i = 0;

        if (courseServ.dataSelect.action === "reject") {
          if (!self.formField.verifyRemark) { self.formValidate.isValid.verifyRemark = false; i++; }
        }

        self.formValidate.showSaveError = (i > 0 ? true : false);

        return (i > 0 ? false : true);
      },
      action: function () {
        if (this.validate()) {
          utilServ.dialogConfirmWithDict(appServ.getLabel(["edit", "confirm"]), function (result) {
            if (result) {
              var data = self.getValue();

              appServ.save.action({
                routePrefix: "Course",
                action: "verify",
                data: data
              }).then(function (result) {
                if (result.status) {
                  courseServ.dataSelect.action = "";
                  courseServ.dataSelect.data = [];

                  var obj = courseServ.table.reload;

                  obj.isPreloading = false;
                  obj.isResetDataSource = true;
                  obj.order = [{
                    table: "coursePendingVerify",
                    isFirstPage: false
                  }, {
                    table: "courseVerified",
                    isFirstPage: false
                  }];
                  obj.action().then(function () {
                    $("#" + utilServ.idDialogForm + ".modal").modal("hide");
                  });           
                }
              });
            }
          });                            
        }
        else
          utilServ.dialogErrorWithDict(appServ.getLabel(["save", "error"]), function () { });
      }
    };
    */
  });
})();