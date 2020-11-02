/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๒๗/๐๘/๒๕๖๒>
Modify date : <๒๔/๐๙/๒๕๖๒>
Description : <รวมรวบฟังก์ชั่นใช้งานสำหรับหน้า index>
=============================================
*/

(function () {
  "use strict";

  var dt = new Date();
  var ver = (dt.getDate() + "/" + (dt.getMonth() + 1) + "/" + dt.getFullYear() + dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds());

  document.write("<link href='CSS/CSS.css?ver=" + ver + "' rel='stylesheet' />");
  document.write("<script type='text/javascript' src='JScript/AppUtil.js?ver=" + ver + "'><\/script>");
  document.write("<script type='text/javascript' src='/AUNQA/GUI/JScript/Dictionary.js?ver=" + ver + "'><\/script>");
  document.write("<script type='text/javascript' src='JScript/HRi.js?ver=" + ver + "'><\/script>");

  if (!String.prototype.includes) {
    Object.defineProperty(String.prototype, "includes", {
      value: function (search, start) {
        if (typeof start !== "number")
          start = 0;

        if (start + search.length > this.length)
          return false;
        else
          return this.indexOf(search, start) !== -1;
      }
    });
  }

  angular.module("hriSearchMod", [
    "ngTable",
    "utilMod",
    "appMod",
    "hriMod"
  ])

  .controller("hriSearchCtrl", function ($rootScope, $scope, $timeout, $q, $location, $compile, $filter, NgTableParams, utilServ, appServ, hriServ) {
    var self = this;

    self.tableList = new NgTableParams({}, {});        

    self.init = function () {
      self.setValue().then(function () {
        self.watchFormChange();
        self.resetValue();

        $timeout(function () {                    
          self.showForm = true;                 

          if (self.formField.keyword) self.action();
        }, 500);
      });
    };
        
    self.watchFormChange = function () {
      $timeout(function () {
        $scope.$watch(function () {
          var watch = [];

          watch.push(self.tableList.settings().$loading);

          return watch;
        }, function () {
          if (self.tableList.settings().$loading) {
            $(".hri .search-info table tbody").hide();
            $(".hri .search-info .pagination").hide();
          }
          else {
            $(".hri .search-info table tbody").show();
            $(".hri .search-info .pagination").show();

            self.table.finishRender();
          }
        }, true);
      }, 0);

      $timeout(function () {
        $scope.$watch(function () {
          var watch = [];

          watch.push(self.formField.keyword);

          return watch;
        }, function () {
          if (!self.table.hide) {
            self.table.hide = true;
            $(".hri .search-info .pagination").hide();
          }
        }, true);
      }, 0);

      $timeout(function () {
        $scope.$watch(function () {
          var watch = [];

          watch.push(self.table.filter.formField.keyword);

          return watch;
        }, function (newValue, oldValue) {
          if (newValue[0] !== oldValue[0]) {
            if (!self.table.hide)
              self.tableList.reload();
          }
        }, true);                
      }, 0);
    };

    self.formField = {
      keyword: ""
    };
        
    self.setValue = function () {
      var deferred = $q.defer();

      self.showForm = false;

      $timeout(function () {
        deferred.resolve();
      }, 0);

      return deferred.promise;
    };

    self.resetValue = function () {
      self.formField.keyword = ($location.search().keyword ? $location.search().keyword : "");
    };

    self.action = function () {
      utilServ.getDialogPreloadingWithDict(["msgPreloading", "searching"]);

      self.table.filter.setValue();
      self.table.hide = true;
      self.tableList.settings().$loading = false;

      self.table.isReload = true;
      self.table.getData();
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
        self.tableList = new NgTableParams(appServ.tableConfig.params, angular.extend(appServ.tableConfig.setting, {
          getData: function (params) {
            return $timeout(function () { }, appServ.tableConfig.timeout).then(function (result) {
              return self.table.reload.getData().then(function () {
                var dt = self.table.dataSource;
                var df = self.table.filter.action(dt);
                var data = df.slice((params.page() - 1) * params.count(), params.page() * params.count());

                params.total(df.length);
                params.totalSearch = dt.length;
                params.totalPage = (Math.ceil(params.total() / params.count()));

                if (params.total() === 0)
                  params.page(1);

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

        self.table.hide = false;
      },
      reload: {
        getData: function () {
          var deferred = $q.defer();

          if (self.table.isReload) {
            var keywordArray = self.formField.keyword.split(",");
            var value = {
              firstName: "",
              lastName: ""
            };

            if (keywordArray.length > 0) {
              value.firstName = utilServ.trim(keywordArray[0]);
              value.lastName  = (utilServ.trim(keywordArray[1]) ? utilServ.trim(keywordArray[1]) : "");
            }

            self.table.dataSource = [];
            self.table.isReload = false;

            hriServ.getDataSource({
              action: "getlist",
              params: {
                firstName: value.firstName,
                lastName: value.lastName
              }
            }).then(function (result) {
              self.table.dataSource = result;

              $timeout(function () {
                  deferred.resolve();
              }, 0);
            });
          }
          else
            $timeout(function () {
              deferred.resolve();
            }, 0);

          return deferred.promise;
        }
      }
    };

    self.personalInformation = {
      getDialogForm: {
        template: appServ.HRi.personalInformation.template,
        action: function () {
          utilServ.getDialogPreloadingWithDict(["msgPreloading", "loading"]);

          $timeout(function () {
            utilServ.http({
              url: self.personalInformation.getDialogForm.template
            }).then(function (result) {
              var title = ["HRi", "personalInformation"];
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
    };        
  })

  .controller("hriPersonalInformationCtrl", function ($timeout, $q, utilServ, appServ, hriServ) {
    var self = this;

    self.init = function () {
      if (appServ.HRi.dataRow.personalId) {
        self.setValue().then(function () {
          if (appServ.HRi.dataRow.personalId) {
            self.showForm = true;
            self.form.finishRender();
          }
          else {
            self.showForm = false;

            appServ.closeDialogPreloading();

            utilServ.dialogErrorWithDict(["HRi", "personalNotFound"], function (e) {
            });
          }
        });
      }
      else
        self.showForm = false;
    };

    self.setValue = function () {
      var deferred = $q.defer();

      self.showForm = false;

      hriServ.getDataSource({
        action: "get",
        params: {
          personalId: appServ.HRi.dataRow.personalId
        }
      }).then(function (result) {
        appServ.HRi.dataRow = (result[0] ? result[0] : {});

        deferred.resolve();
      });

      return deferred.promise;
    };

    self.form = {
      finishRender: function () {
        appServ.closeDialogPreloading();

        $timeout(function () {
          if ($("#" + utilServ.idDialogForm).is(":visible") === false) {
            utilServ.dialogFormWithDict(appServ.dialogFormOptions, function (e) { });
          }
        }, 0);
      }
    };
  });
})();