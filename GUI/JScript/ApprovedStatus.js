/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๒๒/๑๐/๒๕๖๑>
Modify date : <๑๗/๐๗/๒๕๖๒>
Description : <รวมรวบฟังก์ชั่นใช้งานสำหรับข้อมูลการอนุมัติหลักสูตร>
=============================================
*/

(function () {
  "use strict";

  angular.module("approvedStatusMod", [
    "appMod"
  ])

  .service("approvedStatusServ", function ($q, appServ) {
    var self = this;

    self.getDataSource = function (param) {
      param.dataSource  = (param.dataSource === undefined || param.dataSource === "" ? [] : param.dataSource);
      param.action      = (param.action === undefined ? "" : param.action);
      param.params      = (param.params === undefined || param.params.length === 0 ? "" : param.params);

      var deferred = $q.defer();

      if (param.dataSource.length === 0)
      { 
        appServ.getListData({
          routePrefix: "ApprovedStatus",
          action: param.action,
          params: param.params
        }).then(function (result) {                    
          var dt = [];

          angular.forEach(result, function (item) {
            if (param.action === "getlist") {
              dt.push({
                id: (item.id ? item.id : ""),
                title: {
                  TH: (item.titleTh ? item.titleTh : ""),
                  EN: (item.titleEn ? item.titleEn : "")
                },
                isOrdinal: (item.isOrdinal ? item.isOrdinal : ""),
                ordinalApproved: (item.ordinalApproved ? item.ordinalApproved : ""),
                isDate: (item.isDate ? item.isDate : ""),
                dateApproved: (item.dateApproved ? item.dateApproved : ""),
                groupStatus: (item.groupStatus ? item.groupStatus : ""),
                startYear: (item.startYear ? item.startYear : ""),
                endYear: (item.endYear ? item.endYear : ""),
                indent: (item.indent ? item.indent : ""),
                cancelStatus: (item.cancelStatus ? item.cancelStatus : ""),
                selectFilter: ((item.id ? item.id : "") +
                               (item.titleTh ? item.titleTh : "") +
                               (item.titleEn ? item.titleEn : ""))
              });
            }

            if (param.action === "get") {
              dt.push({
                id: (item.id ? item.id : ""),
                title: {
                  TH: (item.titleTh ? item.titleTh : ""),
                  EN: (item.titleEn ? item.titleEn : "")
                },
                isOrdinal: (item.isOrdinal ? item.isOrdinal : ""),
                ordinalApproved: (item.ordinalApproved ? item.ordinalApproved : ""),
                isDate: (item.isDate ? item.isDate : ""),
                dateApproved: (item.dateApproved ? item.dateApproved : ""),
                groupStatus: (item.groupStatus ? item.groupStatus : ""),
                startYear: (item.startYear ? item.startYear : ""),
                endYear: (item.endYear ? item.endYear : ""),
                indent: (item.indent ? item.indent : "")
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