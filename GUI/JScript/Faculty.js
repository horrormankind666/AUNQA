/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๓๐/๐๓/๒๕๖๑>
Modify date : <๑๙/๐๗/๒๕๖๑>
Description : <รวมรวบฟังก์ชั่นใช้งานสำหรับข้อมูลคณะ>
=============================================
*/

(function () {
  "use strict";

  angular.module("facultyMod", [
    "ngTable",
    "appMod"
  ])

  .service("facultyServ", function ($q, NgTableParams, appServ) {
    var self = this;

    self.tableList = {
      facultyVerified: new NgTableParams({}, {})
    };
    self.isFaculty = false;
    self.facultyInfo = {};

    self.isFacultyRoute = function (facultyId) {
      return self.getDataSource({
        action: "get",
        params: [
          "",
          ("facultyId=" + facultyId)
        ].join("&")
      }).then(function (result) {
        var dr = {};

        if (result.length > 0) {
          self.isFaculty = true;
          dr = result[0];
        }
        else
          self.isFaculty = false;

        self.facultyInfo = dr;
      });
    };

    self.getDataSource = function (param) {
      param.dataSource  = (param.dataSource === undefined || param.dataSource === "" ? [] : param.dataSource);
      param.action      = (param.action === undefined ? "" : param.action);
      param.params      = (param.params === undefined || param.params.length === 0 ? "" : param.params);

      var deferred = $q.defer();

      if (param.dataSource.length === 0) {
        appServ.getListData({
          routePrefix: "Faculty",
          action: param.action,
          params: param.params
        }).then(function (result) {
          var dt = [];

          angular.forEach(result, function (item) {
            if (param.action === "getlist") {
              dt.push({
                id: (item.id ? item.id : ""),
                code: (item.facultyCode ? item.facultyCode : ""),
                name: {
                  TH: (item.nameTh ? item.nameTh : ""),
                  EN: (item.nameEn ? item.nameEn.toUpperCase() : "")
                },
                selectFilter: ((item.facultyCode ? item.facultyCode : "") +
                               (item.nameTh ? item.nameTh : "") +
                               (item.nameEn ? item.nameEn : ""))
              });
            }
 
            if (param.action === "get") {
              dt.push({
                id: (item.id ? item.id : ""),
                code: (item.facultyCode ? item.facultyCode : ""),
                name: {
                  TH: (item.nameTh ? item.nameTh : ""),
                  EN: (item.nameEn ? item.nameEn.toUpperCase() : "")
                },
                abbrev: {
                  TH: (item.abbrevTh ? item.abbrevTh : ""),
                  EN: (item.abbrevEn ? item.abbrevEn : "")
                },
                concise: {
                  TH: (item.conciseTh ? item.conciseTh : ""),
                  EN: (item.conciseEn ? item.conciseEn : "")
                },
                branchId: (item.branchId ? item.branchId : "")
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