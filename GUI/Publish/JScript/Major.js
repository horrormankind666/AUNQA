/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๐๙/๐๔/๒๕๖๑>
Modify date : <๓๐/๐๘/๒๕๖๒>
Description : <รวมรวบฟังก์ชั่นใช้งานสำหรับข้อมูลสาขาวิชา>
=============================================
*/

(function () {
    "use strict";

    angular.module("majorMod", [
        "ngTable",
        "appMod"
    ])

    .service("majorServ", function ($q, NgTableParams, appServ) {
        var self = this;

        self.table = {};
        self.tableList = {
            majorVerified: new NgTableParams({}, {}),
            majorPendingVerify: new NgTableParams({}, {}),
            majorVerifyReject: new NgTableParams({}, {})
        };
        self.dataSelect = {
            action: "",
            data: []
        };

        self.getDataSource = function (param) {
            param.dataSource    = (param.dataSource === undefined || param.dataSource === "" ? [] : param.dataSource);
            param.action        = (param.action === undefined ? "" : param.action);
            param.params        = (param.params === undefined || param.params.length === 0 ? "" : param.params);

            var deferred = $q.defer();

            if (param.dataSource.length === 0)
            { 
                appServ.getListData({
                    routePrefix: "Major",
                    action: param.action,
                    params: param.params
                }).then(function (result) {
                    var dt = [];

                    angular.forEach(result, function (item) {
                        var status = "";

                        if (!item.verifyStatus)         status = "P";
                        if (item.verifyStatus === "Y")  status = "Y";
                        if (item.verifyStatus === "N")  status = "N";

                        if (param.action === "getlist")
                        {
                            dt.push({
                                id: (item.id ? item.id : ""),
                                code: (item.codeEn ? item.codeEn : ""),
                                facultyId: (item.facultyId ? item.facultyId : ""),
                                name: {
                                    TH: (item.nameTh ? item.nameTh : ""),
                                    EN: (item.nameEn ? item.nameEn.toUpperCase() : "")
                                },
                                status: status,
                                verifyStatus: (item.verifyStatus ? item.verifyStatus : ""),
                                verifyRemark: (item.verifyRemark ? item.verifyRemark : ""),
                                verifyRemarkBindhtml: (item.verifyRemark ? item.verifyRemark.replace(/\r?\n/g, "<br/>") : ""),
                                selectFilter: ((item.codeEn ? item.codeEn : "") +
                                               (item.nameTh ? item.nameTh : "") +
                                               (item.nameEn ? item.nameEn : ""))
                            });
                        }

                        if (param.action === "get")
                        {
                            dt.push({
                                id: (item.id ? item.id : ""),
                                code: (item.codeEn ? item.codeEn : ""),
                                facultyId: (item.facultyId ? item.facultyId : ""),
                                name: {
                                    TH: (item.nameTh ? item.nameTh : ""),
                                    EN: (item.nameEn ? item.nameEn.toUpperCase() : "")
                                },
                                abbrev: {
                                    TH: (item.abbrevTh ? item.abbrevTh : ""),
                                    EN: (item.abbrevEn ? item.abbrevEn : "")
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