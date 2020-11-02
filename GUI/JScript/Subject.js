/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๐/๐๔/๒๕๖๑>
Modify date : <๐๘/๑๐/๒๕๖๒>
Description : <รวมรวบฟังก์ชั่นใช้งานสำหรับข้อมูลรายวิชา>
=============================================
*/

(function () {
  "use strict";

  angular.module("subjectMod", [
    "ngTable",
    "utilMod",
    "appMod",
    "dictMod",
    "pageRouteMod",
    "facultyMod"
  ])

  .service("subjectServ", function ($rootScope, $timeout, $q, $compile, utilServ, appServ, pageRouteServ, facultyServ) {
    var self = this;

    self.dataSelect = {
      action: "",
      data: []
    };

    self.getDataSource = function (param) {
      param.dataSource  = (param.dataSource === undefined || param.dataSource === "" ? [] : param.dataSource);
      param.action      = (param.action === undefined ? "" : param.action);
      param.params      = (param.params === undefined || param.params.length === 0 ? "" : param.params);

      var deferred = $q.defer();

      if (param.dataSource.length === 0) { 
        appServ.getListData({
          routePrefix: "Subject",
          action: param.action,
          params: param.params
        }).then(function (result) {
          var dt = [];

          angular.forEach(result, function (item) {
            if (param.action === "getlist") {
              dt.push({
                id: (item.id ? item.id : ""),
                code: {
                  TH: (item.codeTh ? item.codeTh : item.codeEn),
                  EN: (item.codeEn ? item.codeEn : item.codeTh)
                },
                facultyId: (item.facultyId ? item.facultyId : ""),
                name: {
                  TH: (item.nameTh ? item.nameTh : item.nameEn.toUpperCase()),
                  EN: (item.nameEn ? item.nameEn.toUpperCase() : item.nameTh)
                },
                credit: ((item.credit || item.credit === "0") ? item.credit : "0"),
                lectureCredit: ((item.lectureCredit || item.lectureCredit === "0") ? item.lectureCredit : "0"),
                labCredit: ((item.labCredit || item.labCredit === "0") ? item.labCredit : "0"),
                seminarCredit: ((item.seminarCredit || item.seminarCredit === "0") ? item.seminarCredit : "0"),
                status: status,
                verifyStatus: "",
                verifyRemark: "",
                verifyRemarkBindhtml: "",
                selectFilter: ((item.codeTh ? item.codeTh : "") +
                               (item.codeEn ? item.codeEn : "") +
                               (item.nameTh ? item.nameTh : "") +
                               (item.nameEn ? item.nameEn : "") +
                               ((item.credit || item.credit === "0") ? item.credit : ""))
              });
            }

            if (param.action === "get") {
              dt.push({
                id: (item.id ? item.id : ""),
                code: {
                  TH: (item.codeTh ? item.codeTh : ""),
                  EN: (item.codeEn ? item.codeEn : "")
                },
                facultyId: (item.facultyId ? item.facultyId : ""),
                name: {
                  TH: (item.nameTh ? item.nameTh : ""),
                  EN: (item.nameEn ? item.nameEn.toUpperCase() : "")
                },
                abbrev: {
                  TH: (item.nameThAbbrv ? item.nameThAbbrv : ""),
                  EN: (item.nameEnAbbrv ? item.nameEnAbbrv : "")
                },
                credit: ((item.credit || item.credit === "0") ? item.credit : "0"),
                lectureCredit: ((item.lectureCredit || item.lectureCredit === "0") ? item.lectureCredit : "0"),
                labCredit: ((item.labCredit || item.labCredit === "0") ? item.labCredit : "0"),
                seminarCredit: ((item.seminarCredit || item.seminarCredit === "0") ? item.seminarCredit : "0")
              });
            }
          });

          param.dataSource = dt;

          deferred.resolve(param.dataSource);
        });
      }
      else
        deferred.resolve(param.dataSource);

      return deferred.promise;
    };

    self.form = {
      owner: {},
      new: function (key) {
        self.form.owner[key] = {};
        angular.copy(this.subject, this.owner[key]);
      },
      getDialogForm: {
        owner: "",
        template: pageRouteServ.pageObject.subject.template,
        action: function () {                    
          if (appServ.isUser && facultyServ.isFaculty) {
            utilServ.getDialogPreloadingWithDict(["msgPreloading", "loading"]);

            $timeout(function () {
              utilServ.http({
                url: self.form.getDialogForm.template
              }).then(function (result) {
                var title = ["course"];
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
        });                    
        self.dataSelect.data = [];
      },
      subject: {
        table: {
          data: [],
          reload: {
            getData: function (owner, dataSource) {
              var obj = self.form.owner[owner];
                            
              angular.copy((dataSource ? dataSource : null), obj.addedit.formValue.subjectTableList);
              angular.copy(obj.addedit.formValue.subjectTableList, obj.table.data);
              obj.addedit.formValue.subjectData = appServ.getDataOnJoinArray(obj.table.data, ["id"]);
            }
          }
        },
        addedit: {
          formField: {
          },
          formValue: {
            subjectTableList: [],
            subjectData: ""
          },
          getValue: function (owner) {
            var obj = self.form.owner[owner];
            var result = "";

            if (obj.table.data.length > 0) {
              angular.forEach(obj.table.data, function (item) {
                result += (
                  "<row>" +
                  "<id>" + item.id + "</id>" +
                  "<codeTH>" + item.code.TH + "</codeTH>" +
                  "<codeEN>" + item.code.EN + "</codeEN>" +
                  "<facultyId>" + item.facultyId + "</facultyId>" +
                  "<nameTH>" + item.name.TH + "</nameTH>" +
                  "<nameEN>" + item.name.EN + "</nameEN>" +
                  "<abbrevTH>" + item.abbrev.TH + "</abbrevTH>" +
                  "<abbrevEN>" + item.abbrev.EN + "</abbrevEN>" +
                  "<credit>" + item.credit + "</credit>" +
                  "<lectureCredit>" + item.lectureCredit + "</lectureCredit>" +
                  "<labCredit>" + item.labCredit + "</labCredit>" +
                  "<seminarCredit>" + item.seminarCredit + "</seminarCredit>"+
                  "</row>"
                );
              });
            }
            else
              result = null;

            return result;
          }
        }
      }
    };        
  })
    
  .controller("subjectCtrl", function ($scope, $timeout, $q, $filter, NgTableParams, utilServ, appServ, facultyServ, subjectServ) {
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
            $(".subject table tbody").hide();
            $(".subject .pagination").hide();
          }
          else {
            $(".subject table tbody").show();
            $(".subject .pagination").show();                

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
              isFirstPage: true
            }];
            obj.action();
            self.uncheckboxAll();
          }
        }, true);

        $scope.$watch(function () {
          return [
            self.table.hide
          ];
        }, function () {
          if (self.table.hide) {
            self.table.filter.setValue();
            self.uncheckboxAll();
            $(".subject .pagination").hide();
          }
          else
            $(".subject .pagination").show();
        }, true);
      }, 0);
    };

    self.setValue = function () {
      var deferred = $q.defer();

      self.showForm = false;
            
      self.table.filter.setValue();
      self.table.dataSource = [];
      self.table.getData();
            
      $timeout(function () {
        deferred.resolve();
      }, 0);
            
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

                self.table.temp = df;

                params.total(df.length);
                params.totalSearch = dt.length;
                params.totalPage = (Math.ceil(params.total() / params.count()));

                self.table.hide = false;

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
        isPreloading: false,
        isResetDataSource: false,
        order: [],
        action: function () {
          var deferred = $q.defer();

          if (this.isPreloading) utilServ.getDialogPreloadingWithDict(["msgPreloading", "loading"]);
          if (this.isResetDataSource) self.table.dataSource = [];

          this.getData().then(function () {
            angular.forEach(self.table.reload.order, function (item) {
              self.tableList.reload();
              if (self.tableList.total() === 0) item.isFirstPage = true;
              if (item.isFirstPage) self.tableList.page(1);
            });

            $timeout(function () {
              deferred.resolve();
            }, 0);
          });

          return deferred.promise;
        },
        getData: function () {
          var deferred = $q.defer();

          subjectServ.getDataSource({
            dataSource: self.table.dataSource,
            action: "getlist",                        
            params: [
              "",
              ("facultyId=" + facultyServ.facultyInfo.id)
            ].join("&")
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
      if ($(".subject .table .inputcheckbox:checked").length > 0) {
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

          angular.copy(data, subjectServ.dataSelect.data);

          $("#" + utilServ.idDialogForm + ".modal").modal("hide");
        }
      }
    };
  });
})();