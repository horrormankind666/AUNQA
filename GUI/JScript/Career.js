/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๒๒/๑๐/๒๕๖๑>
Modify date : <๑๗/๐๗/๒๕๖๒>
Description : <รวมรวบฟังก์ชั่นใช้งานสำหรับข้อมูลอาชีพ>
=============================================
*/

(function () {
  "use strict";

  angular.module("careerMod", [
    "appMod"
  ])

  .service("careerServ", function ($q, appServ) {
    var self = this;

    self.getDataSource = function (param) {
      param.dataSource  = (param.dataSource === undefined || param.dataSource === "" ? [] : param.dataSource);
      param.action      = (param.action === undefined ? "" : param.action);
      param.params      = (param.params === undefined || param.params.length === 0 ? "" : param.params);

      var deferred = $q.defer();

      if (param.dataSource.length === 0) { 
        appServ.getListData({
          routePrefix: "Career",
          action: param.action,
          params: param.params
        }).then(function (result) {                    
          var dt = [];

          angular.forEach(result, function (item) {
            if (param.action === "getlist") {
              dt.push({
                id: (item.id ? item.id : ""),
                name: {
                  TH: (item.nameTh ? item.nameTh : ""),
                  EN: (item.nameEn ? item.nameEn : "")
                },
                selectFilter: ((item.id ? item.id : "") +
                               (item.nameTh ? item.nameTh : "") +
                               (item.nameEn ? item.nameEn : ""))
              });
            }

            if (param.action === "get") {
              dt.push({
                id: (item.id ? item.id : ""),
                name: {
                  TH: (item.nameTh ? item.nameTh : ""),
                  EN: (item.nameEn ? item.nameEn : "")
                }
              });
            }
          });

          param.dataSource = dt;

          deferred.resolve({
            dataSource: param.dataSource,
            autocomplete: self.getAutocomplete(param.dataSource)
          });
        });
      }
      else
        deferred.resolve({
          dataSource: param.dataSource,
          autocomplete: self.getAutocomplete(param.dataSource)
        });

      return deferred.promise;
    };

    self.getAutocomplete = function (dataSource) {
      var array = {
        TH: [],
        EN: []
      };
      var dt = {
        TH: [],
        EN: []
      };

      angular.forEach(dataSource, function (item) {
        array.TH.push({
          label: item.name.TH,
          value: item
        });

        array.EN.push({
          label: item.name.EN,
          value: item
        });
      });

      var groups = _.groupBy(array.TH, "label");

      _.forOwn(groups, function (value, key) {
        dt.TH.push({
          label: key,
          value: key
        });

        dt.EN.push({
          label: key,
          value: key
        });
      });

      return dt;
    };
  });
})();