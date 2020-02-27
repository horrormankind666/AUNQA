/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๓๐/๐๓/๒๕๖๑>
Modify date : <๓๐/๐๘/๒๕๖๒>
Description : <รวมรวบฟังก์ชั่นใช้งานสำหรับข้อมูลภาควิชา>
=============================================
*/

(function () {
    "use strict";

    angular.module("departmentMod", [
        "ngTable",
        "appMod"
    ])

    .service("departmentServ", function ($q, NgTableParams, appServ) {
        var self = this;

        self.table = {};
        self.tableList = {
            departmentVerified: new NgTableParams({}, {}),
            departmentPendingVerify: new NgTableParams({}, {}),
            departmentVerifyReject: new NgTableParams({}, {})
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
                    routePrefix: "Department",
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
                                code: (item.depCode ? item.depCode : ""),
                                facultyId: (item.facultyId ? item.facultyId : ""),
                                name: {
                                    TH: (item.nameTh ? item.nameTh : ""),
                                    EN: (item.nameEn ? item.nameEn.toUpperCase() : "")
                                },
                                status: status,
                                verifyStatus: (item.verifyStatus ? item.verifyStatus : ""),
                                verifyRemark: (item.verifyRemark ? item.verifyRemark : ""),
                                verifyRemarkBindhtml: (item.verifyRemark ? item.verifyRemark.replace(/\r?\n/g, "<br/>") : ""),
                                selectFilter: ((item.depCode ? item.depCode : "") +
                                               (item.nameTh ? item.nameTh : "") +
                                               (item.nameEn ? item.nameEn : ""))
                            });
                        }

                        if (param.action === "get")
                        {
                            dt.push({
                                id: (item.id ? item.id : ""),
                                code: (item.depCode ? item.depCode : ""),
                                facultyId: (item.facultyId ? item.facultyId : ""),
                                name: {
                                    TH: (item.nameTh ? item.nameTh : ""),
                                    EN: (item.nameEn ? item.nameEn.toUpperCase() : "")
                                },
                                abbrev: {
                                    TH: (item.abbrevTh ? item.abbrevTh : ""),
                                    EN: (item.abbrevEn ? item.abbrevEn : "")
                                },
                                startDate: (item.startDate1 ? item.startDate1 : ""),
                                endDate: (item.endDate1 ? item.endDate1 : ""),
                                departmentTypeId: (item.type ? item.type : "")
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