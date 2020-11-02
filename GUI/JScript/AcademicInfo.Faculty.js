/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๒๒/๐๘/๒๕๖๑>
Modify date : <๐๙/๐๘/๒๕๖๒>
Description : <รวมรวบฟังก์ชั่นใช้งานสำหรับข้อมูลการศึกษาในส่วนของข้อมูลคณะ>
=============================================
*/

(function () {
  "use strict";

  angular.module("academicInfo.facultyMod", [
    "ngTable",
    "utilMod",
    "appMod",
    "dictMod",
    "pageRouteMod",
    "branchMod",
    "facultyMod"
  ])

  .controller("academicInfo.facultyCtrl", function ($scope, $timeout, $q, $filter, NgTableParams, utilServ, appServ, dictServ, pageRouteServ, branchServ, facultyServ) {
    var self = this;
        
    pageRouteServ.setMenuActive({
      menuName: (pageRouteServ.pageObject.faculty.class + "-menu")
    });

    self.init = function () {
      if (appServ.isUser) {
        this.setValue().then(function () {
          self.watchFormChange();                    
          self.resetValue();
          self.showForm = true;
          self.table.hide = false;

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

          watch.push(self.table.isReload);
          watch.push(facultyServ.tableList.facultyVerified.settings().$loading);

          return watch;
        }, function () {
          if (self.table.isReload) {
            facultyServ.tableList.facultyVerified.settings().$loading = false;

            var obj = self.table.reload;

            obj.isPreloading = true;
            obj.isResetDataSource = true;
            obj.order = [{
              table: "facultyVerified",
              isFirstPage: true
            }];
            obj.action().then(function () {
              self.table.hide = false;
            });
          }

          if (facultyServ.tableList.facultyVerified.settings().$loading) {                        
            $(".academicinfo.faculty.verified table tbody").hide();
            $(".academicinfo.faculty.verified .pagination").hide();
          }
          else {
            $(".academicinfo.faculty.verified table tbody").show();
            $(".academicinfo.faculty.verified .pagination").show();                

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
            obj.isResetDataSource = false;
            obj.order = [{
              table: "facultyVerified",
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
      self.table.dataSource = [];
      self.table.reload.getData().then(function () {
        self.table.getData();                

        $timeout(function () {
          deferred.resolve();
        }, 0);
      });
            
      return deferred.promise;
    };

    self.resetValue = function () {
      utilServ.gotoTopPage();
    };

    self.table = {
      isReload: false,
      hide: true,
      dataSource: [],
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
        facultyServ.tableList.facultyVerified = new NgTableParams(appServ.tableConfig.params, angular.extend(appServ.tableConfig.setting, {
          getData: function (params) {
            return $timeout(function () { }, appServ.tableConfig.timeout).then(function (result) {
              return  self.table.reload.getData().then(function () {
                var dt = self.table.dataSource;
                var df = self.table.filter.action(dt);
                var data = df.slice((params.page() - 1) * params.count(), params.page() * params.count());

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
      },
      reload: {
        isPreloading: false,
        isResetDataSource: false,
        order: [],
        action: function () {
          var deferred = $q.defer();

          if (this.isPreloading) utilServ.getDialogPreloadingWithDict(["msgPreloading", "loading"]);
          if (this.isResetDataSource) self.table.dataSource = [];

          this.getData().then(function () {
            angular.forEach(self.table.reload.order, function (item) {
              facultyServ.tableList[item.table].reload();
              if (facultyServ.tableList[item.table].total() === 0) item.isFirstPage = true;
              if (item.isFirstPage) facultyServ.tableList[item.table].page(1);
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
            self.table.dataSource = [];
          }

          facultyServ.getDataSource({
            dataSource: self.table.dataSource,
            action: "getlist"
          }).then(function (result) {
            self.table.dataSource = result;

            $timeout(function () {
              deferred.resolve();
            }, 0);
          });

          return deferred.promise;
        }
      }
    };

    self.addedit = {
      showForm: false,
      template: {
        content: "",                
        action: "",
        init: function () {
          if (appServ.isUser && self.addedit.showForm) {
            utilServ.getDialogPreloadingWithDict(["msgPreloading", "loading"]);

            this.content = pageRouteServ.pageObject.faculty.addedit.template;
          }
        },
        remove: function () {                    
          pageRouteServ.setMenuActiveAction({
            menuName: (pageRouteServ.pageObject.faculty.class + "-menu")
          });

          utilServ.removeCacheTemplate(this.content);
          this.content = "";
        }
      },
      init: function () {
        if (appServ.isUser) {
          var action = self.addedit.template.action;

          if (action === "add" || action === "edit")
            pageRouteServ.setMenuActiveAction({
                menuName: (pageRouteServ.pageObject.faculty.class + "-menu"),
                action: action
            });

          this.setValue().then(function () {
            self.addedit[action].setValue().then(function () {
              self.addedit.getDataMaster().then(function () {
                self.addedit.watchFormChange();
                self.addedit.resetValue();
                self.addedit.showForm = true;

                appServ.closeDialogPreloading();
              });
            });
          });
        }
        else
          self.addedit.showForm = false;
      },
      formField: {
        id: "",
        code: "",
        name: {
          TH: "",
          EN: ""
        },
        abbrev: {
          TH: "",
          EN: ""
        },
        concise: {
          TH: "",
          EN: ""
        },
        branchSelected: {}
      },
      formValue: {
        id: "",
        code: "",
        name: {
          TH: "",
          EN: ""
        },
        abbrev: {
          TH: "",
          EN: ""
        },
        concise: {
          TH: "",
          EN: ""
        },
        branchSelected: {}
      },
      formValidate: {
        setValue: function () {
          this.resetValue();
        },
        resetValue: function () {
          this.showSaveError = false;
          this.isValid = {
            code: true,
            name: {
              TH: true,
              EN: true
            },
            concise: {
              TH: true,
              EN: true
            }
          };
        }
      },
      watchFormChange: function () {
        $timeout(function () {
          $scope.$watch(function () {
            var watch = [];

            watch.push(self.addedit.formField.code);
            watch.push(self.addedit.formField.name.TH);
            watch.push(self.addedit.formField.name.EN);
            watch.push(self.addedit.formField.abbrev.TH);
            watch.push(self.addedit.formField.abbrev.EN);
            watch.push(self.addedit.formField.concise.TH);
            watch.push(self.addedit.formField.concise.EN);
            watch.push(self.addedit.formField.branchSelected.selected);

            return watch;
          }, function () {
            var exit = false;

            if (!exit) {
              if ((self.addedit.formField.code !== self.addedit.formValue.code) ||
                  (self.addedit.formField.name.TH !== self.addedit.formValue.name.TH) ||
                  (self.addedit.formField.name.EN !== self.addedit.formValue.name.EN) ||
                  (self.addedit.formField.abbrev.TH !== self.addedit.formValue.abbrev.TH) ||
                  (self.addedit.formField.abbrev.EN !== self.addedit.formValue.abbrev.EN) ||
                  (self.addedit.formField.concise.TH !== self.addedit.formValue.concise.TH) ||
                  (self.addedit.formField.concise.EN !== self.addedit.formValue.concise.EN) ||
                  (self.addedit.formField.branchSelected.selected !== self.addedit.formValue.branchSelected.selected))
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
      getDataMaster: function () {
        var deferred = $q.defer();
                
        branchServ.getDataSource({
          action: "getlist"
        }).then(function (result) {
          appServ.table.dataSource["branch"] = angular.copy(result);
                    
          $timeout(function () {
              deferred.resolve();
          }, 0);
        });

        return deferred.promise;
      },
      resetValue: function () {
        var dataRow = {};

        if (this.isEdit)    dataRow = this.edit.dataRow;
        if (this.isDelete)  dataRow = this.delete.dataRow;

        this.formValue.id = (dataRow.id ? dataRow.id : "");
        this.formField.id = this.formValue.id;

        if (this.isAdd || this.isEdit) {
          this.formValue.code = (dataRow.code ? dataRow.code : "");
          this.formField.code = this.formValue.code;

          this.formValue.name.TH = (dataRow.name ? dataRow.name.TH : "");
          this.formField.name.TH = this.formValue.name.TH;

          this.formValue.name.EN = (dataRow.name ? dataRow.name.EN : "");
          this.formField.name.EN = this.formValue.name.EN;

          this.formValue.abbrev.TH = (dataRow.abbrev ? dataRow.abbrev.TH : "");
          this.formField.abbrev.TH = this.formValue.abbrev.TH;

          this.formValue.abbrev.EN = (dataRow.abbrev ? dataRow.abbrev.EN : "");
          this.formField.abbrev.EN = this.formValue.abbrev.EN;

          this.formValue.concise.TH = (dataRow.concise ? dataRow.concise.TH : "");
          this.formField.concise.TH = this.formValue.concise.TH;

          this.formValue.concise.EN = (dataRow.concise ? dataRow.concise.EN : "");
          this.formField.concise.EN = this.formValue.concise.EN;

          this.formValue.branchSelected.selected = (dataRow.branchId ? utilServ.getObjectByValue(appServ.table.dataSource.branch, "id", dataRow.branchId)[0] : undefined);                                                                                                                                                           
          this.formField.branchSelected.selected = this.formValue.branchSelected.selected;

          this.formValidate.resetValue();
          utilServ.gotoTopPage();
        }
      },
      getValue: function () {
        var result = {
          id: (this.formField.id ? this.formField.id : ""),
          facultyCode: (this.formField.code ? this.formField.code : ""),
          nameTh: (this.formField.name.TH ? this.formField.name.TH : ""),
          nameEn: (this.formField.name.EN ? this.formField.name.EN : ""),
          abbrevTh: (this.formField.abbrev.TH ? this.formField.abbrev.TH : ""),
          abbrevEn: (this.formField.abbrev.EN ? this.formField.abbrev.EN : ""),
          conciseTh: (this.formField.concise.TH ? this.formField.concise.TH : ""),
          conciseEn: (this.formField.concise.EN ? this.formField.concise.EN : ""),
          branchId: (this.formField.branchSelected.selected ? this.formField.branchSelected.selected.id : "")
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

          facultyServ.getDataSource({
            action: "get",
            params: [
              "",
              ("facultyId=" + self.addedit.formValue.id)
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
            if (!self.addedit.formField.code) { self.addedit.formValidate.isValid.code = false; i++; }
            if (!self.addedit.formField.name.TH) { self.addedit.formValidate.isValid.name.TH = false; i++; }
            if (!self.addedit.formField.name.EN) { self.addedit.formValidate.isValid.name.EN = false; i++; }
            if (!self.addedit.formField.concise.TH) { self.addedit.formValidate.isValid.concise.TH = false; i++; }
            if (!self.addedit.formField.concise.EN) { self.addedit.formValidate.isValid.concise.EN = false; i++; }
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
                  routePrefix: "Faculty",
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
                        table: "facultyVerified",
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
  });
})();