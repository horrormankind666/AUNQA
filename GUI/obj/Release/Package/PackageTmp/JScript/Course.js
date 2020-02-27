/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๐/๐๔/๒๕๖๑>
Modify date : <๐๘/๑๐/๒๕๖๒>
Description : <รวมรวบฟังก์ชั่นใช้งานสำหรับข้อมูลรายวิชา>
=============================================
*/

(function () {
    "use strict";

    angular.module("courseMod", [
        "ngTable",
        "utilMod",
        "appMod",
        "dictMod",
        "pageRouteMod",
        "facultyMod"
    ])

    .service("courseServ", function ($rootScope, $timeout, $q, $compile, NgTableParams, utilServ, appServ, pageRouteServ, facultyServ) {
        var self = this;

        self.table = {};
        self.tableList = {
            courseVerified: new NgTableParams({}, {}),
            coursePendingVerify: new NgTableParams({}, {}),
            courseSendingVerify: new NgTableParams({}, {}),
            courseTransactionHistory: new NgTableParams({}, {}),
            courseSendVerifyReject: new NgTableParams({}, {})
        };
        self.dataSelect = {
            action: "",
            data: []
        };
        self.dataRow = {};
        self.isCourse = false;
        self.isCourseTemp = false;
        self.isEdit = false;
        self.isUpdate = false;

        self.getDataSource = function (param) {
            param.tableType     = (param.tableType === undefined || param.tableType === "" ? "master" : param.tableType);
            param.dataSource    = (param.dataSource === undefined || param.dataSource === "" ? [] : param.dataSource);
            param.action        = (param.action === undefined ? "" : param.action);
            param.params        = (param.params === undefined || param.params.length === 0 ? "" : param.params);
            param.group         = (param.group === undefined || param.group === "" ? "" : param.group);

            var deferred = $q.defer();

            if (param.dataSource.length === 0)
            { 
                appServ.getListData({
                    routePrefix: "Course",
                    action: param.action,
                    params: ("&tableType=" + param.tableType + param.params)
                }).then(function (result) {
                    var dt = [];

                    angular.forEach(result, function (item) {
                        var status = "";

                        if (!item.verifyStatus && !item.sendVerifyStatus)               status = "S";
                        if (!item.verifyStatus && item.sendVerifyStatus === "Y")        status = "P";
                        if (item.verifyStatus === "Y" && item.sendVerifyStatus === "Y") status = "Y";
                        if (item.verifyStatus === "N" && item.sendVerifyStatus === "Y") status = "N";

                        if (param.action === "getlist")
                        {
                            dt.push({
                                tableType: param.tableType,
                                id: (item.id ? item.id : ""),
                                code: {
                                    TH: (item.codeTh ? item.codeTh : ""),
                                    EN: (item.codeEn ? item.codeEn : "")
                                },
                                facultyId: (item.facultyId ? item.facultyId : ""),
                                name: {
                                    TH: (item.nameTh ? item.nameTh : ""),
                                    EN: (item.nameEn ? item.nameEn.toUpperCase() : "")
                                },
                                credit: ((item.credit || item.credit === "0") ? item.credit : "0"),
                                lectureCredit: ((item.lectureCredit || item.lectureCredit === "0") ? item.lectureCredit : "0"),
                                labCredit: ((item.labCredit || item.labCredit === "0") ? item.labCredit : "0"),
                                seminarCredit: ((item.seminarCredit || item.seminarCredit === "0") ? item.seminarCredit : "0"),
                                status: status,
                                verifyStatus: "",
                                verifyRemark: "",
                                verifyRemarkBindhtml: "",
                                selectFilter: ((item.codeTh ? item.codeTh : "") +
                                               (item.codeEn ? item.codeEn : "") +
                                               (item.nameTh ? item.nameTh : "") +
                                               (item.nameEn ? item.nameEn : "") +
                                               ((item.credit || item.credit === "0") ? item.credit : ""))
                            });
                        }

                        if (param.action === "get")
                        {
                            dt.push({
                                id: (item.id ? item.id : ""),
                                code: {
                                    TH: (item.codeTh ? item.codeTh : ""),
                                    EN: (item.codeEn ? item.codeEn : "")
                                },
                                facultyId: (item.facultyId ? item.facultyId : ""),
                                name: {
                                    TH: (item.nameTh ? item.nameTh : ""),
                                    EN: (item.nameEn ? item.nameEn.toUpperCase() : "")
                                },
                                abbrev: {
                                    TH: (item.nameThAbbrv ? item.nameThAbbrv : ""),
                                    EN: (item.nameEnAbbrv ? item.nameEnAbbrv : "")
                                },
                                credit: ((item.credit || item.credit === "0") ? item.credit : "0"),
                                lectureCredit: ((item.lectureCredit || item.lectureCredit === "0") ? item.lectureCredit : "0"),
                                labCredit: ((item.labCredit || item.labCredit === "0") ? item.labCredit : "0"),
                                seminarCredit: ((item.seminarCredit || item.seminarCredit === "0") ? item.seminarCredit : "0")
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