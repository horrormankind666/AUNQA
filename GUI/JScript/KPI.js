/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๘/๐๒/๒๕๖๒>
Modify date : <๐๘/๐๘/๒๕๖๒>
Description : <รวมรวบฟังก์ชั่นใช้งานสำหรับข้อมูล KPI>
=============================================
*/

(function () {
  "use strict";

  angular.module("kpiMod", [
      "ngTable",
      "utilMod",
      "appMod",
      "dictMod",
      "pageRouteMod",
      "facultyMod"
  ])

  .service("kpiServ", function ($rootScope, $timeout, $compile, utilServ, appServ, dictServ, pageRouteServ, facultyServ) {
    var self = this;

    self.dataSelect = {
      action: "",
      data: []
    };
        
    self.form = {
      owner: {},
      new: function (key) {
        self.form.owner[key] = {};
        angular.copy(this.kpi, this.owner[key]);
      },
      getDialogForm: {
        owner: "",
        template: pageRouteServ.pageObject.kpi.template,
        action: function () {                    
          if (appServ.isUser && facultyServ.isFaculty) {
            utilServ.getDialogPreloadingWithDict(["msgPreloading", "loading"]);

            $timeout(function () {
              utilServ.http({
                url: self.form.getDialogForm.template
              }).then(function (result) {
                var title = ["kpi"];
                var content = $compile($(".template-content").html(result.data).contents())($rootScope);

                appServ.dialogFormOptions = {
                  cssClass: "",
                  title: title,
                  content: content
                };
              });
            }, 0);
          }
        }
      },
      watchFormChange: function () {
        $timeout(function () {
          $rootScope.$watch(function () {
            var watch = [];

            watch.push(self.dataSelect.data);

            return watch;
          }, function () {
            if (self.dataSelect.data.length > 0) self.form.setDataTable(self.form.getDialogForm.owner);
          }, true);
        }, 0);
      },
      setDataTable: function (owner) {
        var obj = self.form.owner[owner];
                
        angular.forEach(self.dataSelect.data, function (item) {
          if (utilServ.getObjectByValue(obj.table.data, "id", item.id).length === 0)
            obj.table.data.push(item);

          obj.addedit.formField.id = item.id;
          obj.addedit.formField.name.TH = item.title.TH;
          obj.addedit.formField.name.EN = item.title.EN;                    
        });
        self.dataSelect.data = [];

        $timeout(function () {
          autosize.update($(".form-kpi .addedit textarea"));
        }, 0);
      },
      kpi: {
        table: {
          data: []
        },
        addedit: {
          formField: {
            id: "",
            name: {
              TH: "",
              EN: ""
            }
          }
        }
      }
    };
  })

  .controller("kpiCtrl", function ($scope, $timeout, $q, NgTableParams, utilServ, appServ, dictServ, facultyServ, kpiServ) {
    var self = this;

    self.tableList = new NgTableParams({}, {});

    self.init = function () {
      if (appServ.isUser && facultyServ.isFaculty) {
        self.setValue().then(function () {
          self.watchFormChange();
          self.resetValue();
          self.showForm = true;
        });
      }
      else
        self.showForm = false;
    };

    self.watchFormChange = function () {
      $timeout(function () {
        $scope.$watch(function () {
          var watch = [];

          watch.push(self.tableList.settings().$loading);

          return watch;
        }, function () {                    
            if (self.tableList.settings().$loading) {   
              $(".kpi table tbody").hide();
              $(".kpi .pagination").hide();
            }
            else {
              $(".kpi table tbody").show();
              $(".kpi .pagination").show();                

              self.table.finishRender();
            }
        }, true);
      }, 0);
    };

    self.setValue = function () {
      var deferred = $q.defer();

      self.showForm = false;

      self.table.dataSource = [];
      self.table.reload.getData().then(function () {                
        self.table.getData();
        self.table.hide = false;

        $timeout(function () {
          deferred.resolve();
        }, 0);
      });
            
      return deferred.promise;
    };

    self.resetValue = function () {            
    };

    self.table = {
      dataSource: [],
      hide: true,
      temp: [],
      formField: {
        toggle: {},
        checkboxes: {
          checked: false,
          items: {}
        }
      },
      getData: function () {
        self.tableList = new NgTableParams(appServ.tableConfig.params, angular.extend(appServ.tableConfig.setting, {
          getData: function (params) {
            return $timeout(function () { }, appServ.tableConfig.timeout).then(function (result) {
              return self.table.reload.getData().then(function () {
                var dt = self.table.dataSource;
                var df = dt;
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

        $timeout(function () {
          if ($("#" + utilServ.idDialogForm).is(":visible") === false) {                        
            utilServ.dialogFormWithDict(appServ.dialogFormOptions, function (e) { });
          }
        }, 0);
      },
      reload: {
        getData: function () {
          var deferred = $q.defer();

          angular.copy(dictServ.dict.kpi.table.indicator, self.table.dataSource);

          $timeout(function () {
            deferred.resolve();
          }, 0);

          return deferred.promise;
        }
      }
    };

    self.checkboxRootOnOffByChild = function () {
      self.table.formField.checkboxes.checked = utilServ.uncheckboxRoot({
        data: self.table.temp,
        checkboxesRoot: self.table.formField.checkboxes.checked,
        checkboxesChild: self.table.formField.checkboxes.items,
        field: "id"
      });
    };
        
    self.checkboxChildOnOffByRoot = function () {
      utilServ.uncheckboxAll({
        data: self.table.temp,
        checkboxesRoot: self.table.formField.checkboxes.checked,
        checkboxesChild: self.table.formField.checkboxes.items,
        field: "id"
      });
    };

    self.uncheckboxAll = function () {
      if ($(".kpi .table .inputcheckbox:checked").length > 0) {
        if (self.table.formField.checkboxes.checked) self.table.formField.checkboxes.checked = false;                
        self.checkboxChildOnOffByRoot();
      }
    };

    self.saveChange = {
      validate: function () {
        if (utilServ.getValueCheckboxTrue(self.table.temp, "id", self.table.formField.checkboxes.items).length === 0) {
          utilServ.dialogErrorWithDict(["entries", "selectError"], function () { });
          return false;
        }

        return true;
      },
      action: function () {
        if (this.validate()) {                                        
          var data = [];

          angular.forEach(self.table.temp, function (item) {
            if (self.table.formField.checkboxes.items[item.id])
              data.push(item);
          });

          angular.copy(data, kpiServ.dataSelect.data);

          $("#" + utilServ.idDialogForm + ".modal").modal("hide");
        }
      }
    };
  });
})();