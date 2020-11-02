/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๐๘/๐๒/๒๕๖๒>
Modify date : <๑๗/๐๗/๒๕๖๒>
Description : <รวมรวบฟังก์ชั่นใช้งานสำหรับข้อมูล PLOs>
=============================================
*/

(function () {
  "use strict";

  angular.module("plosMod", [
    "appMod"
  ])

  .service("plosServ", function ($q, appServ) {
    var self = this;

    self.getDataSource = function (param) {
      param.dataSource  = (param.dataSource === undefined || param.dataSource === "" ? [] : param.dataSource);
      param.action      = (param.action === undefined ? "" : param.action);
      param.params      = (param.params === undefined || param.params.length === 0 ? "" : param.params);

      var deferred = $q.defer();

      if (param.dataSource.length === 0) { 
        appServ.getListData({
          routePrefix: "PLOs",
          action: param.action,
          params: param.params
        }).then(function (result) {                    
          var dt = [];

          angular.forEach(result, function (item) {
            if (param.action === "getlist") {
              dt.push({
                id: (item.id ? item.id : ""),
                tqfProgramId: (item.tqfProgramId ? item.tqfProgramId : ""),
                code: (item.code ? item.code : ""),
                title: {
                  TH: (item.titleTh ? item.titleTh : ""),
                  EN: (item.titleEn ? item.titleEn : "")
                },
                detail: (item.detail ? item.detail : ""),
                xmlSubPLOs: (item.xmlSubPLOs ? item.xmlSubPLOs : ""),
                xmlStractegyTeach: (item.xmlStractegyTeach ? item.xmlStractegyTeach : ""),
                xmlStractegyEvaluate: (item.xmlStractegyEvaluate ? item.xmlStractegyEvaluate : ""),
                selectFilter: ((item.id ? item.id : "") +
                               (item.code ? item.code : "") +
                               (item.titleTh ? item.titleTh : "") +
                               (item.titleEn ? item.titleEn : ""))
              });
            }

            if (param.action === "get") {
              dt.push({
                id: (item.id ? item.id : ""),
                tqfProgramId: (item.tqfProgramId ? item.tqfProgramId : ""),
                code: (item.code ? item.code : ""),
                title: {
                  TH: (item.titleTh ? item.titleTh : ""),
                  EN: (item.titleEn ? item.titleEn : "")
                },
                detail: (item.detail ? item.detail : ""),
                xmlSubPLOs: (item.xmlSubPLOs ? item.xmlSubPLOs : ""),
                xmlStractegyTeach: (item.xmlStractegyTeach ? item.xmlStractegyTeach : ""),
                xmlStractegyEvaluate: (item.xmlStractegyEvaluate ? item.xmlStractegyEvaluate : "")
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