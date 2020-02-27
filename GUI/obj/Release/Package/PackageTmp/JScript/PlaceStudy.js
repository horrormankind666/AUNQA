/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๒๗/๑๑/๒๕๖๑>
Modify date : <๑๗/๐๗/๒๕๖๒>
Description : <รวมรวบฟังก์ชั่นใช้งานสำหรับข้อมูลสถานที่จัดการเรียนการสอน>
=============================================
*/

(function () {
    "use strict";

    angular.module("placeStudyMod", [
        "appMod"
    ])

    .service("placeStudyServ", function ($q, appServ) {
        var self = this;

        self.getDataSource = function (param) {
            param.dataSource    = (param.dataSource === undefined || param.dataSource === "" ? [] : param.dataSource);
            param.action        = (param.action === undefined ? "" : param.action);
            param.params        = (param.params === undefined || param.params.length === 0 ? "" : param.params);

            var deferred = $q.defer();            

            if (param.dataSource.length === 0)
            {
                appServ.getListData({
                    routePrefix: "PlaceStudy",
                    action: param.action,
                    params: param.params
                }).then(function (result) {
                    var dt = [];

                    angular.forEach(result, function (item) {
                        if (param.action === "getlist")
                        {
                            dt.push({
                                id: (item.id ? item.id : ""),
                                code: (item.code ? item.code : ""),
                                name: {
                                    TH: (item.nameTH ? item.nameTH : ""),
                                    EN: (item.nameEN ? item.nameEN : "")
                                },
                                faculty: {
                                    id: (item.facultyId ? item.facultyId : ""),
                                    code: (item.facultyCode ? item.facultyCode : ""),
                                    name: {
                                        TH: (item.facultyNameTH ? item.facultyNameTH : ""),
                                        EN: (item.facultyNameEN ? item.facultyNameEN : "")
                                    }
                                },
                                selectFilter: ((item.nameTH ? item.nameTH : "") +
                                               (item.nameEN ? item.nameEN : ""))
                            });
                        }

                        if (param.action === "get")
                        {
                            dt.push({
                                id: (item.id ? item.id : ""),
                                code: (item.code ? item.code : ""),
                                name: {
                                    TH: (item.nameTH ? item.nameTH : ""),
                                    EN: (item.nameEN ? item.nameEN : "")
                                },
                                faculty: {
                                    id: (item.facultyId ? item.facultyId : ""),
                                    code: (item.facultyCode ? item.facultyCode : ""),
                                    name: {
                                        TH: (item.facultyNameTH ? item.facultyNameTH : ""),
                                        EN: (item.facultyNameEN ? item.facultyNameEN : "")
                                    }
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
            var dt = {
                TH: [],
                EN: []
            };

            angular.forEach(dataSource, function (item) {
                dt.TH.push({
                    label: item.name.TH,
                    value: item
                });

                dt.EN.push({
                    label: item.name.EN,
                    value: item
                });
            });

            return dt;
        };
    });
})();