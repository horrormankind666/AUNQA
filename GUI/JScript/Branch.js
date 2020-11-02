/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๒๔/๐๔/๒๕๖๑>
Modify date : <๑๑/๐๗/๒๕๖๒>
Description : <รวมรวบฟังก์ชั่นใช้งานสำหรับข้อมูลสาขา>
=============================================
*/

(function () {
  "use strict";

  angular.module("branchMod", [
    "appMod"
  ])

  .service("branchServ", function ($q, appServ) {
    var self = this;

    self.getDataSource = function (param) {
      param.dataSource  = (param.dataSource === undefined || param.dataSource === "" ? [] : param.dataSource);
      param.action      = (param.action === undefined ? "" : param.action);
      param.params      = (param.params === undefined || param.params.length === 0 ? "" : param.params);

      var deferred = $q.defer();

      if (param.dataSource.length === 0) { 
        appServ.getListData({
          routePrefix: "Branch",
          action: param.action,
          params: param.params
        }).then(function (result) {                    
          var dt = [];

          angular.forEach(result, function (item) {
            if (param.action === "getlist") {
              dt.push({
                id: (item.id ? item.id : ""),
                code: (item.branchCode ? item.branchCode : ""),
                name: {
                  TH: (item.nameTh ? item.nameTh : ""),
                  EN: (item.nameEn ? item.nameEn.toUpperCase() : "")
                },
                nameHidden: ((item.nameTh ? item.nameTh : "") +
                             (item.nameEn ? item.nameEn : "")),
                selectFilter: ((item.id ? item.id : "") +
                               (item.nameTh ? item.nameTh : "") +
                               (item.nameEn ? item.nameEn : ""))
              });
            }

            if (param.action === "get") {
              dt.push({
                id: (item.id ? item.id : ""),
                code: (item.branchCode ? item.branchCode : ""),
                name: {
                  TH: (item.nameTh ? item.nameTh : ""),
                  EN: (item.nameEn ? item.nameEn.toUpperCase() : "")
                },
                groupType: (item.rankingTypeId ? item.rankingTypeId : "")
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