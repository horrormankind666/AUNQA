/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๖/๑๐/๒๕๖๑>
Modify date : <๑๕/๐๗/๒๕๖๒>
Description : <รวมรวบฟังก์ชั่นใช้งานสำหรับข้อมูล ISCED>
=============================================
*/

(function () {
    "use strict";

    angular.module("iscedMod", [
        "appMod"
    ])

    .service("iscedServ", function ($q, appServ) {
        var self = this;

        self.getDataSource = function (param) {
            param.dataSource    = (param.dataSource === undefined || param.dataSource === "" ? [] : param.dataSource);
            param.action        = (param.action === undefined ? "" : param.action);
            param.params        = (param.params === undefined || param.params.length === 0 ? "" : param.params);

            var deferred = $q.defer();

            if (param.dataSource.length === 0)
            { 
                appServ.getListData({
                    routePrefix: "ISCED",
                    action: param.action,
                    params: param.params
                }).then(function (result) {                    
                    var dt = [];

                    angular.forEach(result, function (item) {
                        if (param.action === "getlist")
                        {
                            dt.push({
                                id: (item.id ? item.id : ""),
                                iscedId: (item.iscedId ? item.iscedId : ""),
                                name: {
                                    TH: (item.nameTh ? item.nameTh : ""),
                                    EN: (item.nameEn ? item.nameEn : "")
                                },
                                activeStatus: (item.activeStatus ? item.activeStatus : ""),
                                selectFilter: ((item.id ? item.id : "") +
                                               (item.nameTh ? item.nameTh : "") +
                                               (item.nameEn ? item.nameEn : ""))
                            });
                        }

                        if (param.action === "get")
                        {
                            dt.push({
                                id: (item.id ? item.id : ""),
                                iscedId: (item.iscedId ? item.iscedId : ""),
                                name: {
                                    TH: (item.nameTh ? item.nameTh : ""),
                                    EN: (item.nameEn ? item.nameEn : "")
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