/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๐๓/๑๐/๒๕๖๑>
Modify date : <๐๘/๑๐/๒๕๖๒>
Description : <รวมรวบฟังก์ชั่นใช้งานสำหรับข้อมูลการศึกษาในส่วนของข้อมูลหลักสูตร>
=============================================
*/

(function () {
  "use strict";

  angular.module("academicInfo.programmeMod", [
    "ngTable",
    "utilMod",
    "appMod",
    "dictMod",
    "pageRouteMod",
    "facultyMod",
    "programmeMod"
  ])

  .controller("academicInfo.programmeCtrl", function ($scope, $timeout, $q, $compile, utilServ, appServ, dictServ, pageRouteServ, facultyServ, programmeServ) {
    var self = this;

    pageRouteServ.setMenuActive({
      menuName: (pageRouteServ.pageObject.faculty.class + "-menu"),
      isSubSubMenu: true
    });
    dictServ.dict.menuTmp = {
      TH: (dictServ.dict.program.TH + (facultyServ.facultyInfo.code ? (" : " + facultyServ.facultyInfo.code) : "")),
      EN: (dictServ.dict.program.EN + (facultyServ.facultyInfo.code ? (" : " + facultyServ.facultyInfo.code) : ""))
    };

    programmeServ.dataRow = {};

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
            programmeServ.tableList.programmeVerified.settings().$loading = false;
            programmeServ.tableList.programmePendingVerify.settings().$loading = false;
            programmeServ.tableList.programmeSendingVerify.settings().$loading = false;
            programmeServ.tableList.programmeTransactionHistory.settings().$loading = false;

            var obj = self.table.reload;

            obj.isPreloading = true;
            obj.isResetDataSource = true;
            obj.tableType = "master";
            obj.order = [{
              table: "programmeVerified",
              isFirstPage: true
            }];
            obj.action().then(function () {
              obj.tableType = "temp";
              obj.order = [{
                table: "programmePendingVerify",
                isFirstPage: true
              }, {
                table: "programmeSendingVerify",
                isFirstPage: true
              },  {
                table: "programmeTransactionHistory",
                isFirstPage: true
              }];
              obj.action().then(function () {
                self.table.hide = false;
              });
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
        self.table.temp.dataSource = [];
        self.table.reload.tableType = "temp";
        self.table.reload.getData().then(function () {                                        
          programmeServ.table = self.table;

          $timeout(function () {
            deferred.resolve();
          }, 0);
        });
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
              programmeServ.tableList[item.table].reload();
              if (programmeServ.tableList[item.table].total() === 0) item.isFirstPage = true;
              if (item.isFirstPage) programmeServ.tableList[item.table].page(1);
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

          programmeServ.getDataSource({
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
            this.content = pageRouteServ.pageObject.programme.verified.template;
        }
      }
    };

    self.pendingVerify = {
      template: {
        content: "",
        init: function () {
          if (appServ.isUser && facultyServ.isFaculty)
            this.content = pageRouteServ.pageObject.programme.pendingVerify.template;
        }
      }
    };

    self.sendingVerify = {
      template: {
        content: "",
        init: function () {
          if (appServ.isUser && facultyServ.isFaculty)
            this.content = pageRouteServ.pageObject.programme.sendingVerify.template;
        }
      }
    };

    self.transactionHistory = {
      template: {
        content: "",
        init: function () {
          if (appServ.isUser && facultyServ.isFaculty)
            this.content = pageRouteServ.pageObject.programme.transactionHistory.template;
        }
      }
    };

    self.addedit = {
      showForm: false,
      template: {
        content: "",          
        action: "",
        init: function () {
          if (appServ.isUser && facultyServ.isFaculty && self.addedit.showForm) {
            utilServ.getDialogPreloadingWithDict(["msgPreloading", "loading"]);
                        
            this.content = pageRouteServ.pageObject.programme.addedit.template;
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
          /*
          self.addedit.isEdit = false;
          self.addedit.isUpdate = false;
          self.addedit.isDelete = false;
          */
        }                
      }/*,
      edit: {
        init: function () {
          pageRouteServ.setMenuActiveAction({
            menuName: (pageRouteServ.pageObject.faculty.class + "-menu"),
            isSubSubMenu: true,
            action: "edit"
          });

          self.addedit.init();
        },
        setValue: function () {
          self.addedit.isAdd = false;
          self.addedit.isEdit = true;
          self.addedit.isUpdate = false;
          self.addedit.isDelete = false;
        }
      },
      update: {
        init: function () {
          pageRouteServ.setMenuActiveAction({
            menuName: (pageRouteServ.pageObject.faculty.class + "-menu"),
            isSubSubMenu: true,
            action: "update"
          });

          self.addedit.init();
        },
        setValue: function () {
          self.addedit.isAdd = false;
          self.addedit.isEdit = false;
          self.addedit.isUpdate = true;
          self.addedit.isDelete = false;
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
          self.addedit.isUpdate = false;
          self.addedit.isDelete = true;
        }
      }
      */
    };

    self.sendVerifyReject = {
      getDialogForm: {
        template: pageRouteServ.pageObject.programme.sendVerifyReject.template,
        validate: function () {
          if (programmeServ.dataSelect.data.length === 0) {
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
                  var title = ["program", programmeServ.dataSelect.action];
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

  .controller("academicInfo.programme.verifiedCtrl", function ($scope, $timeout, $q, $filter, NgTableParams, utilServ, appServ, facultyServ, programmeServ) {
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

          watch.push(programmeServ.tableList.programmeVerified.settings().$loading);

          return watch;
        }, function () {
          if (programmeServ.tableList.programmeVerified.settings().$loading) {   
            $(".academicinfo.programme.verified table tbody").hide();
            $(".academicinfo.programme.verified .pagination").hide();
          }
          else {
            $(".academicinfo.programme.verified table tbody").show();
            $(".academicinfo.programme.verified .pagination").show();                

            self.table.finishRender();
          }
        }, true);

        $scope.$watch(function () {
          return [
            self.table.filter.formField.keyword
          ];
        }, function (newValue, oldValue) {
          if (newValue[0] !== oldValue[0]) {
            var obj = programmeServ.table.reload;

            obj.isPreloading = false;
            obj.isResetDataSource = false;
            obj.tableType = "master";
            obj.order = [{
              table: "programmeVerified",
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
        programmeServ.tableList.programmeVerified = new NgTableParams(appServ.tableConfig.params, angular.extend(appServ.tableConfig.setting, {
          getData: function (params) {
            return $timeout(function () { }, appServ.tableConfig.timeout).then(function (result) {
              programmeServ.table.reload.tableType = "master";
              return programmeServ.table.reload.getData().then(function () {
                var dt = programmeServ.table.master.dataSource;
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

  .controller("academicInfo.programme.pendingVerifyCtrl", function ($scope, $timeout, $q, $filter, NgTableParams, utilServ, appServ, facultyServ, programmeServ) {
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

          watch.push(programmeServ.tableList.programmePendingVerify.settings().$loading);
          watch.push(programmeServ.dataSelect.data);

          return watch;
        }, function () {
          if (programmeServ.tableList.programmePendingVerify.settings().$loading) {                        
            $(".academicinfo.programme.pendingverify table tbody").hide();
            $(".academicinfo.programme.pendingverify .pagination").hide();
          }
          else {
            $(".academicinfo.programme.pendingverify table tbody").show();
            $(".academicinfo.programme.pendingverify .pagination").show();                

            self.table.finishRender();
          }

          if (programmeServ.dataSelect.data.length === 0)
            self.uncheckboxAll();
        }, true);

        $scope.$watch(function () {
          return [
            self.table.filter.formField.keyword,
            self.table.filter.formField.modeSelected.selected,
            self.table.filter.formField.verifyStatusSelected.selected
          ];
        }, function (newValue, oldValue) {
          if ((newValue[0] !== oldValue[0]) ||
              (newValue[1] !== oldValue[1]) ||
              (newValue[2] !== oldValue[2])) {
            var obj = programmeServ.table.reload;

            obj.isPreloading = false;
            obj.isResetDataSource = false;
            obj.tableType = "temp";
            obj.order = [{
              table: "programmePendingVerify",
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
          modeSelected: {},
          verifyStatusSelected: {}
        },
        setValue: function () {                    
          this.resetValue();
          this.showForm = false;
        },
        resetValue: function () {
          this.formField.keyword = "";
          this.formField.modeSelected = {};
          this.formField.verifyStatusSelected = {};
        },
        action: function (dataTable) {
          return $filter("filter")(dataTable, {
            selectFilter: (this.formField.keyword ? this.formField.keyword : "!null"),
            mode: (this.formField.modeSelected.selected ? this.formField.modeSelected.selected.id : "!null"),
            cancelStatus: "!Y",
            verifyStatus: "!Y",
            status: (this.formField.verifyStatusSelected.selected ? this.formField.verifyStatusSelected.selected.id : "!S")
          });
        }
      },
      getData: function () {
        programmeServ.tableList.programmePendingVerify = new NgTableParams(appServ.tableConfig.params, angular.extend(appServ.tableConfig.setting, {
          getData: function (params) {
            return $timeout(function () { }, appServ.tableConfig.timeout).then(function (result) {
              programmeServ.table.reload.tableType = "temp";
              return programmeServ.table.reload.getData().then(function () {
                var dt = programmeServ.table.temp.dataSource;
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
      if ($(".academicinfo.programme.pendingverify .table .inputcheckbox:checked").length > 0) {
        if (self.table.formField.checkboxes.checked) self.table.formField.checkboxes.checked = false;                
        self.checkboxChildOnOffByRoot();
      }
    };

    self.verifyReject = {
      setValue: function (action) {                
        var data = self.table.temp.filter(function (dr) {
          return dr.status !== "Y";
        });

        programmeServ.dataSelect = {
          action: action,
          data: utilServ.getValueCheckboxTrue(data, "id", self.table.formField.checkboxes.items)
        };
      }
    };
  })

  .controller("academicInfo.programme.sendingVerifyCtrl", function ($scope, $timeout, $q, $filter, NgTableParams, utilServ, appServ, facultyServ, programmeServ) {
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

          watch.push(programmeServ.tableList.programmeSendingVerify.settings().$loading);
          watch.push(programmeServ.dataSelect.data);

          return watch;
        }, function () {
          if (programmeServ.tableList.programmeSendingVerify.settings().$loading) {                        
            $(".academicinfo.programme.sendingverify table tbody").hide();
            $(".academicinfo.programme.sendingverify .pagination").hide();
          }
          else {
            $(".academicinfo.programme.sendingverify table tbody").show();
            $(".academicinfo.programme.sendingverify .pagination").show();                

            self.table.finishRender();
          }

          if (programmeServ.dataSelect.data.length === 0)
            self.uncheckboxAll();
        }, true);

        $scope.$watch(function () {
          return [
            self.table.filter.formField.keyword,
            self.table.filter.formField.modeSelected.selected
          ];
        }, function (newValue, oldValue) {
          if ((newValue[0] !== oldValue[0]) ||
              (newValue[1] !== oldValue[1])) {
            var obj = programmeServ.table.reload;

            obj.isPreloading = false;
            obj.isResetDataSource = false;
            obj.tableType = "temp";
            obj.order = [{
              table: "programmeSendingVerify",
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
          modeSelected: {}
        },
        setValue: function () {                    
          this.resetValue();
          this.showForm = false;
        },
        resetValue: function () {
          this.formField.keyword = "";
          this.formField.modeSelected = {};
        },
        action: function (dataTable) {
          return $filter("filter")(dataTable, {
            selectFilter: (this.formField.keyword ? this.formField.keyword : "!null"),
            mode: (this.formField.modeSelected.selected ? this.formField.modeSelected.selected.id : "!null"),
            cancelStatus: "!Y",
            status: "S"
          });
        }
      },
      getData: function () {
        programmeServ.tableList.programmeSendingVerify = new NgTableParams(appServ.tableConfig.params, angular.extend(appServ.tableConfig.setting, {
          getData: function (params) {
            return $timeout(function () { }, appServ.tableConfig.timeout).then(function (result) {
              programmeServ.table.reload.tableType = "temp";
              return programmeServ.table.reload.getData().then(function () {
                var dt = programmeServ.table.temp.dataSource;
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
      if ($(".academicinfo.programme.sendingverify .table .inputcheckbox:checked").length > 0) {                
        if (self.table.formField.checkboxes.checked) self.table.formField.checkboxes.checked = false;                
        self.checkboxChildOnOffByRoot();
      }
    };

    self.sendVerify = {
      setValue: function (action) {                
        var data = self.table.temp.filter(function (dr) {
          return dr.status === "S";
        });

        programmeServ.dataSelect = {
          action: action,
          data: utilServ.getValueCheckboxTrue(data, "id", self.table.formField.checkboxes.items)
        };
      }
    };
  })

  .controller("academicInfo.programme.transactionHistoryCtrl", function ($scope, $timeout, $q, $filter, NgTableParams, utilServ, appServ, facultyServ, programmeServ) {
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

          watch.push(programmeServ.tableList.programmeTransactionHistory.settings().$loading);

          return watch;
        }, function () {
          if (programmeServ.tableList.programmeTransactionHistory.settings().$loading) {                        
            $(".academicinfo.programme.transactionhistory table tbody").hide();
            $(".academicinfo.programme.transactionhistory .pagination").hide();
          }
          else {
            $(".academicinfo.programme.transactionhistory table tbody").show();
            $(".academicinfo.programme.transactionhistory .pagination").show();                

            self.table.finishRender();
          }
        }, true);

        $scope.$watch(function () {
          return [
            self.table.filter.formField.keyword,
            self.table.filter.formField.modeSelected.selected,
            self.table.filter.formField.verifyStatusSelected.selected
          ];
        }, function (newValue, oldValue) {
          if ((newValue[0] !== oldValue[0]) ||
              (newValue[1] !== oldValue[1]) ||
              (newValue[2] !== oldValue[2])) {
            var obj = programmeServ.table.reload;

            obj.isPreloading = false;
            obj.isResetDataSource = false;
            obj.tableType = "temp";
            obj.order = [{
              table: "programmeTransactionHistory",
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
      formField: {
        toggle: {}
      },            
      filter: {
        formField: {
          keyword: "",
          modeSelected: {},
          verifyStatusSelected: {}
        },
        setValue: function () {                    
          this.resetValue();
          this.showForm = false;
        },
        resetValue: function () {
          this.formField.keyword = "";
          this.formField.modeSelected = {};
          this.formField.verifyStatusSelected = {};
        },
        action: function (dataTable) {
          return $filter("filter")(dataTable, {
            selectFilter: (this.formField.keyword ? this.formField.keyword : "!null"),
            mode: (this.formField.modeSelected.selected ? this.formField.modeSelected.selected.id : "!null"),
            status: (this.formField.verifyStatusSelected.selected ? this.formField.verifyStatusSelected.selected.id : "!null")
          });
        }
      },
      getData: function () {
        programmeServ.tableList.programmeTransactionHistory = new NgTableParams(appServ.tableConfig.params, angular.extend(appServ.tableConfig.setting, {
          getData: function (params) {
            return $timeout(function () { }, appServ.tableConfig.timeout).then(function (result) {
              programmeServ.table.reload.tableType = "temp";
              return programmeServ.table.reload.getData().then(function () {
                var dt = programmeServ.table.temp.dataSource;
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

  .controller("academicInfo.programme.sendVerifyRejectCtrl", function ($scope, $timeout, $q, $filter, NgTableParams, utilServ, appServ, facultyServ, programmeServ) {
    var self = this;

    $scope.datepicker = {
      date: ""
    };

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
      notiAppointment: "",
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

          watch.push(programmeServ.tableList.programmeSendVerifyReject.settings().$loading);

          return watch;
        }, function () {
          if (programmeServ.tableList.programmeSendVerifyReject.settings().$loading) {                        
            $(".academicinfo.programme.sendverifyreject table tbody").hide();
            $(".academicinfo.programme.sendverifyreject .pagination").hide();
          }
          else {
            $(".academicinfo.programme.sendverifyreject table tbody").show();
            $(".academicinfo.programme.sendverifyreject .pagination").show();                

            self.table.finishRender();
          }
        }, true);

        $scope.$watch(function () {
          return [
            self.table.filter.formField.keyword,
            self.table.filter.formField.modeSelected.selected
          ];
        }, function (newValue, oldValue) {
          if ((newValue[0] !== oldValue[0]) ||
              (newValue[1] !== oldValue[1])) {
            var obj = self.table.reload;

            obj.isPreloading = false;
            obj.action();
          }
        }, true);
      }, 0);
    };

    self.setValue = function () {
      var deferred = $q.defer();

      self.showForm = false;

      self.formValidate.setValue();

      angular.forEach(programmeServ.dataSelect.data, function (item) {
        self.table.temp.push(
          $filter("filter")(programmeServ.table.temp.dataSource, {
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
          keyword: "",
          modeSelected: {}
        },
        setValue: function () {                    
          this.resetValue();
          this.showForm = false;
        },
        resetValue: function () {
          this.formField.keyword = "";
          this.formField.modeSelected = {};
        },
        action: function (dataTable) {
          return $filter("filter")(dataTable, {
            selectFilter: (this.formField.keyword ? this.formField.keyword : "!null"),
            mode: (this.formField.modeSelected.selected ? this.formField.modeSelected.selected.id : "!null")
          });
        }
      },
      getData: function () {
        programmeServ.tableList.programmeSendVerifyReject = new NgTableParams(appServ.tableConfig.params, angular.extend(appServ.tableConfig.setting, {
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
          if (this.isPreloading) utilServ.getDialogPreloadingWithDict(["msgPreloading", "loading"]);

          programmeServ.tableList.programmeSendVerifyReject.reload();
          programmeServ.tableList.programmeSendVerifyReject.page(1);
        }
      }
    };

    self.getValue = function () {
      var result = [];
      var verifyStatus = "";
      var notiAppointment = "";
      var notiDate = "";
      var verifyRemark = "";

      if (programmeServ.dataSelect.action === "verify") {
        verifyStatus    = "Y";
        notiAppointment = (self.formField.notiAppointment ? self.formField.notiAppointment : null);
        notiDate        = ($scope.datepicker.date ? $scope.datepicker.date : null);
        verifyRemark    = (self.formField.verifyRemark ? self.formField.verifyRemark : null);
      }
      if (programmeServ.dataSelect.action === "reject") {
        verifyStatus    = "N";
        notiAppointment = null;
        notiDate        = null;
        verifyRemark    = self.formField.verifyRemark;
      }
      if (programmeServ.dataSelect.action === "sendVerify") {
        verifyStatus    = null;
        notiAppointment = null;
        notiDate        = null;
        verifyRemark    = null;
      }

      angular.forEach(programmeServ.dataSelect.data, function (item) {
        result.push({
          id: item,
          verifyStatus: verifyStatus,
          notiAppointment: notiAppointment,
          notiDate: notiDate,
          verifyRemark: verifyRemark
        });
      });

      return result;
    };

    self.saveChange = {
      validate: function () {
        var i = 0;

        if (programmeServ.dataSelect.action === "reject") {
          if (!self.formField.verifyRemark) { self.formValidate.isValid.verifyRemark = false; i++; }
        }

        self.formValidate.showSaveError = (i > 0 ? true : false);

        return (i > 0 ? false : true);
      },
      action: function () {
        if (this.validate()) {
          var action = "";

          if (programmeServ.dataSelect.action === "verify")     action = "verify";
          if (programmeServ.dataSelect.action === "reject")     action = "verify";
          if (programmeServ.dataSelect.action === "sendVerify") action = programmeServ.dataSelect.action;

          programmeServ.saveChange.action({
            action: action,
            data: self.getValue()
          }).then(function (result) {
            if (result.status) {
              programmeServ.dataSelect.action = "";
              programmeServ.dataSelect.data = [];

              $("#" + utilServ.idDialogForm + ".modal").modal("hide");

              var obj = programmeServ.table.reload;

              obj.isPreloading = false;
              obj.isResetDataSource = true;
              obj.tableType = "temp";
              obj.order = [{
                table: "programmePendingVerify",
                isFirstPage: true
              }, {
                table: "programmeSendingVerify",
                isFirstPage: true
              }, {
                table: "programmeTransactionHistory",
                isFirstPage: true
              }];
              obj.action();
            }
        });
        }
        else
          utilServ.dialogErrorWithDict(["save", "error"], function () { });
      }
    };
  });
})();