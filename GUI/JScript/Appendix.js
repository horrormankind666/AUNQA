/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๓/๐๓/๒๕๖๒>
Modify date : <๑๗/๐๗/๒๕๖๒>
Description : <รวมรวบฟังก์ชั่นใช้งานสำหรับข้อมูล Appendix>
=============================================
*/

(function () {
  "use strict";

  angular.module("appendixMod", [
    "appMod"
  ])

  .service("appendixServ", function ($q, $filter, appServ) {
    var self = this;

    self.getDataSource = function (param) {
      param.dataSource  = (param.dataSource === undefined || param.dataSource === "" ? [] : param.dataSource);
      param.action      = (param.action === undefined ? "" : param.action);
      param.params      = (param.params === undefined || param.params.length === 0 ? "" : param.params);

      var deferred = $q.defer();

      if (param.dataSource.length === 0) { 
        appServ.getListData({
          routePrefix: "Appendix",
          action: param.action,
          params: param.params
        }).then(function (result) {                    
          var dt = [];

          angular.forEach(result, function (item) {
            if (param.action === "getlist") {
              dt.push({
                id: (item.id ? item.id : ""),
                code: {
                  TH: (item.codeTh ? item.codeTh : ""),
                  EN: (item.codeEn ? item.codeEn : "")
                },
                title: {
                  TH: (item.titleTh ? item.titleTh : ""),
                  EN: (item.titleEn ? item.titleEn : "")
                },
                indent: (item.indent ? item.indent : ""),
                level: (item.level ? item.level : ""),
                remark: (item.remark ? item.remark : ""),
                groupType: (item.groupType ? item.groupType : ""),
                refId: (item.refId ? item.refId : ""),
                cancelStatus: (item.cancelStatus ? item.cancelStatus : ""),
                refOtherType: (item.refOtherType ? item.refOtherType : ""),
                xmlAppendixContent: self.getListAppendixContent(item.xmlAppendixContent ? ($.xml2json("<root>" + item.xmlAppendixContent + "</root>")) : ""),
                selectFilter: ((item.id ? item.id : "") +
                               (item.codeTh ? item.codeTh : "") +
                               (item.codeEn ? item.codeEn : "") +
                               (item.titleTh ? item.titleTh : "") +
                               (item.titleEn ? item.titleEn : ""))
              });
            }

            if (param.action === "get") {
              dt.push({
                id: (item.id ? item.id : ""),
                code: {
                  TH: (item.codeTh ? item.codeTh : ""),
                  EN: (item.codeEn ? item.codeEn : "")
                },
                title: {
                  TH: (item.titleTh ? item.titleTh : ""),
                  EN: (item.titleEn ? item.titleEn : "")
                },
                indent: (item.indent ? item.indent : ""),
                level: (item.level ? item.level : ""),
                remark: (item.remark ? item.remark : ""),
                groupType: (item.groupType ? item.groupType : ""),
                refId: (item.refId ? item.refId : ""),
                cancelStatus: (item.cancelStatus ? item.cancelStatus : ""),
                refOtherType: (item.refOtherType ? item.refOtherType : ""),
                xmlAppendixContent: self.getListAppendixContent(item.xmlAppendixContent ? ($.xml2json("<root>" + item.xmlAppendixContent + "</root>")) : "")
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

    self.getListAppendixContent = function (json) {
      var dt = [];

      if (json) {
        angular.forEach($filter("filter")(json.row, { activeStatus: "Y" }), function (item) {
          dt.push({
            id: item.id,
            dLevel: item.dLevel,
            code: item.code,
            title: {
              TH: item.titleTh,
              EN: item.titleEn
            },
            isRemark: item.isRemark,
            groupType: item.groupType,
            input: item.input,
            value: item.value,
            indent: item.indent,
            activeStatus: item.activeStatus,
            chkStatus: item.chkStatus
          });
        });
      }

      return dt;
    };
  });
})();