/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๐๑/๐๕/๒๕๖๑>
Modify date : <๑๒/๐๗/๒๕๖๒>
Description : <รวมรวบฟังก์ชั่นใช้งานสำหรับประเภทของภาควิชา>
=============================================
*/

(function () {
  "use strict";

  angular.module("departmentTypeMod", [
    "appMod"
  ])

  .service("departmentTypeServ", function ($q, appServ) {
    var self = this;

    self.getDataSource = function (param) {
      param.dataSource  = (param.dataSource === undefined || param.dataSource === "" ? [] : param.dataSource);
      param.action      = (param.action === undefined ? "" : param.action);
      param.params      = (param.params === undefined || param.params.length === 0 ? "" : param.params);

      var deferred = $q.defer();

      if (param.dataSource.length === 0) { 
        appServ.getListData({
          routePrefix: "DepartmentType",
          action: param.action,
          params: param.params
        }).then(function (result) {                    
          var dt = [];

          angular.forEach(result, function (item) {
            if (param.action === "getlist") {
              dt.push({
                id: (item.id ? item.id : ""),
                name: {
                  TH: (item.titleTh ? item.titleTh : ""),
                  EN: (item.titleEn ? item.titleEn.toUpperCase() : "")
                },
                nameHidden: ((item.titleTh ? item.titleTh : "") + (item.titleEn ? item.titleEn : "")),
                selectFilter: ((item.titleTh ? item.titleTh : "") + (item.titleEn ? item.titleEn : ""))
              });
            }

            if (param.action === "get") {
              dt.push({
                id: (item.id ? item.id : ""),
                name: {
                  TH: (item.titleTh ? item.titleTh : ""),
                  EN: (item.titleEn ? item.titleEn.toUpperCase() : "")
                }
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
  });
})();