/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๐/๐๔/๒๕๖๑>
Modify date : <๒๑/๑๐/๒๕๖๒>
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

    .service("courseServ", function ($q, $filter, NgTableParams, appServ, facultyServ) {
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

        self.isCourseRoute = function (action, tableType, id, courseId) {
            return self.getDataSource({
                tableType: tableType,
                action: "get",
                params: [
                    "",
                    ("id=" + id),
                    ("courseId=" + courseId)
                ].join("&")
            }).then(function (result) {
                var dr = {};
                
                if (result.length > 0)
                {
                    self.isCourse = true;                            
                    dr = result[0];

                    if (self.isCourse)
                        facultyServ.facultyInfo.id = dr.facultyId;
                }
                else
                    self.isCourse = false;

                self.dataRow = dr;
                self.isEdit = false;
                self.isUpdate = false;

                if (action === "edit" || action === "update")
                {                    

                    if (action === "edit")
                    {
                        self.isEdit = true;
                        self.isUpdate = false;
                    }
                    if (action === "update")
                    {
                        self.isEdit = false;
                        self.isUpdate = true;
                    }
                }
            });
        };

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
                                facultyId: (item.facultyId ? item.facultyId : ""),
                                courseId: (item.courseId ? item.courseId : ""),
                                code: {
                                    TH: (item.codeTH ? item.codeTH : item.codeEN),
                                    EN: (item.codeEN ? item.codeEN : item.codeTH)
                                },
                                name: {
                                    TH: (item.nameTH ? item.nameTH : item.nameEN.toUpperCase()),
                                    EN: (item.nameEN ? item.nameEN.toUpperCase() : item.nameTH)
                                },
                                credit: ((item.credit || item.credit === "0") ? item.credit : "0"),
                                lectureCredit: ((item.lectureCredit || item.lectureCredit === "0") ? item.lectureCredit : "0"),
                                laboratoryCredit: ((item.laboratoryCredit || item.laboratoryCredit === "0") ? item.laboratoryCredit : "0"),
                                selfstudyCredit: ((item.selfstudyCredit || item.selfstudyCredit === "0") ? item.selfstudyCredit : "0"),
                                status: status,
                                verifyStatus: (item.verifyStatus ? item.verifyStatus : ""),
                                verifyBy: (item.verifyBy ? item.verifyBy : ""),
                                verifyDate: (item.verifyDate ? item.verifyDate : ""),
                                verifyRemark: (item.verifyRemark ? item.verifyRemark : ""),
                                verifyRemarkBindhtml: (item.verifyRemark ? item.verifyRemark.replace(/\r?\n/g, "<br/>") : ""),
                                sendVerifyStatus: (item.sendVerifyStatus ? item.sendVerifyStatus : ""),
                                sendVerifyBy: (item.sendVerifyBy ? item.sendVerifyBy : ""),
                                sendVerifyDate: (item.sendVerifyDate ? item.sendVerifyDate : ""),
                                selectFilter: ((item.codeTH ? item.codeTH : "") +
                                               (item.codeEN ? item.codeEN : "") +
                                               (item.nameTH ? item.nameTH : "") +
                                               (item.nameEN ? item.nameEN : "") +
                                               ((item.credit || item.credit === "0") ? item.credit : "") +
                                               ((item.lectureCredit || item.lectureCredit === "0") ? item.lectureCredit : "") +
                                               ((item.laboratoryCredit || item.laboratoryCredit === "0") ? item.laboratoryCredit : "") +
                                               ((item.selfstudyCredit || item.selfstudyCredit === "0") ? item.selfstudyCredit : "") +
                                               (item.createdBy ? item.createdBy : "") +
                                               (item.createdDate ? $filter("date")(item.createdDate, "dd-MM-yyyy HH:mm:ss") : "") +
                                               (item.verifyBy ? item.verifyBy : "") +
                                               (item.verifyDate ? $filter("date")(item.verifyDate, "dd-MM-yyyy HH:mm:ss") : ""))
                            });
                        }
                        
                        if (param.action === "get")
                        {
                            appServ.createdBy = (item.createdBy ? item.createdBy : "");

                            dt.push({
                                id: (item.id ? item.id : ""),
                                facultyId: (item.facultyId ? item.facultyId : ""),
                                courseId: (item.courseId ? item.courseId : ""),
                                code: {
                                    TH: (item.codeTH ? item.codeTH : ""),
                                    EN: (item.codeEN ? item.codeEN : ""),
                                    aka: {
                                        TH: (item.codeTH ? item.codeTH : item.codeEN),
                                        EN: (item.codeEN ? item.codeEN : item.codeTH)
                                    }
                                },
                                name: {
                                    TH: (item.nameTH ? item.nameTH : ""),
                                    EN: (item.nameEN ? item.nameEN.toUpperCase() : ""),
                                    aka: {
                                        TH: (item.nameTH ? item.nameTH : item.nameEN.toUpperCase()),
                                        EN: (item.nameEN ? item.nameEN.toUpperCase() : item.nameTH)
                                    }
                                },
                                credit: ((item.credit || item.credit === "0") ? item.credit : "0"),
                                lectureCredit: ((item.lectureCredit || item.lectureCredit === "0") ? item.lectureCredit : "0"),
                                laboratoryCredit: ((item.laboratoryCredit || item.laboratoryCredit === "0") ? item.laboratoryCredit : "0"),
                                selfstudyCredit: ((item.selfstudyCredit || item.selfstudyCredit === "0") ? item.selfstudyCredit : "0"),
                                createdBy: appServ.createdBy,
                                status: status,
                                verifyStatus: (item.verifyStatus ? item.verifyStatus : ""),
                                sendVerifyStatus: (item.sendVerifyStatus ? item.sendVerifyStatus : "")
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