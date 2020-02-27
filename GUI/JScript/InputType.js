/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๘/๑๐/๒๕๖๑>
Modify date : <๑๗/๐๗/๒๕๖๒>
Description : <รวมรวบฟังก์ชั่นใช้งานสำหรับข้อมูล Input Type>
=============================================
*/

(function () {
    "use strict";

    angular.module("inputTypeMod", [
        "appMod"
    ])

    .service("inputTypeServ", function ($q, appServ) {
        var self = this;

        self.getDataSource = function (param) {
            param.dataSource    = (param.dataSource === undefined || param.dataSource === "" ? [] : param.dataSource);
            param.action        = (param.action === undefined ? "" : param.action);
            param.params        = (param.params === undefined || param.params.length === 0 ? "" : param.params);

            var deferred = $q.defer();

            if (param.dataSource.length === 0)
            { 
                appServ.getListData({
                    routePrefix: "InputType",
                    action: param.action,
                    params: param.params
                }).then(function (result) {                    
                    var dt = [];

                    angular.forEach(result, function (item) {
                        if (param.action === "getlist")
                        {
                            dt.push({
                                id: (item.id ? item.id : ""),
                                dLevel: (item.dLevel ? item.dLevel : ""),
                                code: (item.code ? item.code : ""),
                                title: {
                                    TH: (item.titleTh ? item.titleTh : ""),
                                    EN: (item.titleEn ? item.titleEn : "")
                                },
                                isRemark: (item.isRemark ? item.isRemark : ""),
                                remark: (item.remark ? item.remark : ""),
                                groupType: (item.groupType ? item.groupType : ""),
                                input: (item.input ? item.input : ""),
                                selected: (item.selected ? item.selected : ""),
                                value: (item.value ? item.value : ""),
                                indent: (item.indent ? item.indent : ""),
                                startYear: (item.startYear ? item.startYear : ""),
                                endYear: (item.endYear ? item.endYear : ""),
                                activeStatus: (item.activeStatus ? item.activeStatus : ""),
                                cancelStatus: (item.cancelStatus ? item.cancelStatus : ""),
                                selectFilter: ((item.id ? item.id : "") +
                                               (item.dLevel ? item.dLevel : "") +
                                               (item.titleTh ? item.titleTh : "") +
                                               (item.titleEn ? item.titleEn : ""))
                            });
                        }

                        if (param.action === "get")
                        {
                            dt.push({
                                id: (item.id ? item.id : ""),
                                dLevel: (item.dLevel ? item.dLevel : ""),
                                code: (item.code ? item.code : ""),
                                title: {
                                    TH: (item.titleTh ? item.titleTh : ""),
                                    EN: (item.titleEn ? item.titleEn : "")
                                },
                                isRemark: (item.isRemark ? item.isRemark : ""),
                                remark: (item.remark ? item.remark : ""),
                                groupType: (item.groupType ? item.groupType : ""),
                                input: (item.input ? item.input : ""),
                                selected: (item.selected ? item.selected : ""),
                                value: (item.value ? item.value : ""),
                                indent: (item.indent ? item.indent : ""),
                                startYear: (item.startYear ? item.startYear : ""),
                                endYear: (item.endYear ? item.endYear : ""),
                                activeStatus: (item.activeStatus ? item.activeStatus : ""),
                                cancelStatus: (item.cancelStatus ? item.cancelStatus : "")
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