/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๒๒/๐๗/๒๕๖๒>
Modify date : <๒๒/๐๗/๒๕๖๒>
Description : <รวมรวบฟังก์ชั่นใช้งานสำหรับข้อมูลวิชาเอก>
=============================================
*/

(function () {
  "use strict";

  angular.module("majorSubjectMod", [
    "appMod"
  ])

  .service("majorSubjectServ", function ($q, appServ) {
    var self = this;

    self.getDataSource = function (param) {
      param.dataSource  = (param.dataSource === undefined || param.dataSource === "" ? [] : param.dataSource);
      param.action      = (param.action === undefined ? "" : param.action);
      param.params      = (param.params === undefined || param.params.length === 0 ? "" : param.params);

      var deferred = $q.defer();

      if (param.dataSource.length === 0) { 
        appServ.getListData({
          routePrefix: "MajorSubject",
          action: param.action,
          params: param.params
        }).then(function (result) {                    
          var dt = [];

          angular.forEach(result, function (item) {
            if (param.action === "getlist") {
              dt.push({
                id: (item.id ? item.id : ""),
                facultyId: (item.facultyId ? item.facultyId : ""),
                dLevel: (item.dLevel ? item.dLevel : ""),
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