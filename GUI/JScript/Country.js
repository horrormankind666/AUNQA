/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๙/๑๐/๒๕๖๑>
Modify date : <๑๗/๐๗/๒๕๖๒>
Description : <รวมรวบฟังก์ชั่นใช้งานสำหรับข้อมูลประเทศ>
=============================================
*/

(function () {
  "use strict";

  angular.module("countryMod", [
    "appMod"
  ])

  .service("countryServ", function ($q, appServ) {
    var self = this;

    self.getDataSource = function (param) {
      param.dataSource  = (param.dataSource === undefined || param.dataSource === "" ? [] : param.dataSource);
      param.action      = (param.action === undefined ? "" : param.action);
      param.params      = (param.params === undefined || param.params.length === 0 ? "" : param.params);

      var deferred = $q.defer();

      if (param.dataSource.length === 0) { 
        appServ.getListData({
          routePrefix: "Country",
          action: param.action,
          params: param.params
        }).then(function (result) {                    
          var dt = [];

          angular.forEach(result, function (item) {
            if (param.action === "getlist") {
              dt.push({
                id: (item.id ? item.id : ""),
                name: {
                  TH: (item.countryNameTH ? item.countryNameTH : ""),
                  EN: (item.countryNameEN ? item.countryNameEN : "")
                },
                isoCountryCodes2Letter: (item.isoCountryCodes2Letter ? item.isoCountryCodes2Letter : ""),
                isoCountryCodes3Letter: (item.isoCountryCodes3Letter ? item.isoCountryCodes3Letter : ""),
                selectFilter: ((item.countryNameTH ? item.countryNameTH : "") +
                               (item.countryNameEN ? item.countryNameEN : ""))
              });
            }

            if (param.action === "get") {
              dt.push({
                id: (item.id ? item.id : ""),
                name: {
                  TH: (item.countryNameTH ? item.countryNameTH : ""),
                  EN: (item.countryNameEN ? item.countryNameEN : "")
                },
                isoCountryCodes2Letter: (item.isoCountryCodes2Letter ? item.isoCountryCodes2Letter : ""),
                isoCountryCodes3Letter: (item.isoCountryCodes3Letter ? item.isoCountryCodes3Letter : "")
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