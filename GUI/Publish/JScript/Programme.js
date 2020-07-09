/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๗/๐๔/๒๕๖๑>
Modify date : <๒๑/๑๐/๒๕๖๒>
Description : <รวมรวบฟังก์ชั่นใช้งานสำหรับข้อมูลหลักสูตร>
=============================================
*/

(function () {
    "use strict";

    angular.module("programmeMod", [
        "ngTable",
        "utilMod",
        "appMod",
        "dictMod",
        "facultyMod",
        "TQFMod"
    ])

    .service("programmeServ", function ($q, $filter, NgTableParams, utilServ, appServ, facultyServ, TQFServ) {
        var self = this;

        self.table = {};
        self.tableList = {
            programmeVerified: new NgTableParams({}, {}),
            programmePendingVerify: new NgTableParams({}, {}),
            programmeSendingVerify: new NgTableParams({}, {}),
            programmeTransactionHistory: new NgTableParams({}, {}),
            programmeSendVerifyReject: new NgTableParams({}, {})
        };
        self.dataSelect = {
            action: "",
            data: []
        };        
        self.dialogForm = {
            cssClass: "",
            title: "",
            content: ""
        };
        self.dataRow = {};
        self.isProgram = false;
        self.isProgramTemp = false;
        self.isEdit = false;
        self.isUpdate = false;

        self.isProgramRoute = function (action, tableType, id, programId, courseYear) {
            return self.getDataSource({
                tableType: tableType,
                action: "get",
                params: [
                    "",
                    ("id=" + id),
                    ("programId=" + programId),
                    ("courseYear=" + courseYear)
                ].join("&")
            }).then(function (result) {
                var dr = {};
                
                if (result.length > 0)
                {
                    self.isProgram = true;                            
                    dr = result[0];

                    if (dr.mode)
                    {
                        if ((!dr.programId && action !== "edit") ||
                            (dr.programId && dr.mode !== action)) 
                        {
                            self.isProgram = false;
                            dr = {};
                        }
                    }                        

                    if (self.isProgram)
                        facultyServ.facultyInfo.id = dr.facultyId;
                }
                else
                    self.isProgram = false;

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
                    routePrefix: "Programme",
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
                                mode: (item.mode ? item.mode : ""),
                                id: (item.id ? item.id : ""),
                                facultyId: (item.facultyId ? item.facultyId : ""),
                                programId: (item.programId ? item.programId : ""),
                                programCode: (item.programCode ? item.programCode : ""),
                                programFullCode: ((item.programCode ? (item.programCode + " ") : "") + (item.majorCode ? (item.majorCode + " ") : "") + (item.groupNum ? item.groupNum : "")),
                                majorId: (item.majorId ? item.majorId : ""),
                                majorCode: (item.majorCode ? item.majorCode : ""),
                                groupNum: (item.groupNum ? item.groupNum : ""),
                                name: {
                                    TH: (item.nameTh ? item.nameTh : ""),
                                    EN: (item.nameEn ? item.nameEn.toUpperCase() : "")
                                },
                                abbrev: {
                                    TH: (item.abbrevTh ? item.abbrevTh : ""),
                                    EN: (item.abbrevEn ? item.abbrevEn : "")
                                },
                                courseYear: (item.courseYear ? item.courseYear : ""),
                                courseYearPresent: (item.courseYearPresent ? item.courseYearPresent : ""),                                
                                createdBy: (item.createdBy ? item.createdBy : ""),
                                createdDate: (item.createdDate ? item.createdDate : ""),
                                status: status,
                                verifyStatus: (item.verifyStatus ? item.verifyStatus : ""),
                                verifyBy: (item.verifyBy ? item.verifyBy : ""),
                                verifyDate: (item.verifyDate ? item.verifyDate : ""),
                                verifyRemark: (item.verifyRemark ? item.verifyRemark : ""),
                                verifyRemarkBindhtml: (item.verifyRemark ? item.verifyRemark.replace(/\r?\n/g, "<br/>") : ""),
                                sendVerifyStatus: (item.sendVerifyStatus ? item.sendVerifyStatus : ""),
                                sendVerifyBy: (item.sendVerifyBy ? item.sendVerifyBy : ""),
                                sendVerifyDate: (item.sendVerifyDate ? item.sendVerifyDate : ""),
                                selectFilter: (((item.programCode ? (item.programCode + " ") : "") + (item.majorCode ? (item.majorCode + " ") : "") + (item.groupNum ? item.groupNum : "")) +
                                               (item.nameTh ? item.nameTh : "") +
                                               (item.nameEn ? item.nameEn : "") +
                                               (item.courseYear ? item.courseYear : "") + 
                                               (item.createdBy ? item.createdBy : "") + 
                                               (item.createdDate ? $filter("date")(item.createdDate, "dd-MM-yyyy HH:mm:ss") : "") +
                                               (item.verifyBy ? item.verifyBy : "") +
                                               (item.verifyDate ? $filter("date")(item.verifyDate, "dd-MM-yyyy HH:mm:ss") : ""))
                            });
                        }

                        if (param.action === "get")
                        {
                            appServ.createdBy = (item.createdBy ? item.createdBy : "");

                            var json1 = {
                                tableType: param.tableType,
                                mode: (item.mode ? item.mode : ""),
                                id: (item.id ? item.id : ""),
                                facultyId: (item.facultyId ? item.facultyId : ""),
                                programId: (item.programId ? item.programId : ""),
                                programCode: (item.programCode ? item.programCode : ""),
                                programFullCode: ((item.programCode ? (item.programCode + " ") : "") + (item.majorCode ? (item.majorCode + " ") : "") + (item.groupNum ? item.groupNum : "")),
                                majorId: (item.majorId ? item.majorId : ""),
                                majorCode: (item.majorCode ? item.majorCode : ""),
                                groupNum: (item.groupNum ? item.groupNum : ""),
                                name: {
                                    TH: (item.nameTh ? item.nameTh : ""),
                                    EN: (item.nameEn ? item.nameEn.toUpperCase() : "")
                                },
                                courseYear: (item.courseYear ? item.courseYear : ""),
                                createdBy: appServ.createdBy,
                                status: status,
                                verifyStatus: (item.verifyStatus ? item.verifyStatus : ""),
                                sendVerifyStatus: (item.sendVerifyStatus ? item.sendVerifyStatus : "")
                            };
                            var json2 = {};

                            if (!param.group || param.group === 1)
														{
                                angular.extend(json2, {
                                    abbrev: {
                                        TH: (item.abbrevTh ? item.abbrevTh : ""),
                                        EN: (item.abbrevEn ? item.abbrevEn : "")
                                    },
                                    degreeName: {
                                        TH: (item.degreeNameTh ? item.degreeNameTh : ""),
                                        EN: (item.degreeNameEn ? item.degreeNameEn : "")
                                    },
                                    degreeAbbrev: {
                                        TH: (item.degreeAbbrevTh ? item.degreeAbbrevTh : ""),
                                        EN: (item.degreeAbbrevEn ? item.degreeAbbrevEn : "")
                                    },
                                    xmlISCED: self.getDataTableFromJSON.isced((item.xmlISCED ? ($.xml2json("<root>" + item.xmlISCED + "</root>")) : ""), "xmlISCED"),
                                    xmlMajorSubject: self.getDataTableFromJSON.majorSubject((item.xmlMajorSubject ? ($.xml2json("<root>" + item.xmlMajorSubject + "</root>")) : ""), "xmlMajorSubject"),
                                    courseCredit: (item.courseCredit ? item.courseCredit : ""),
                                    xmlProgramType: self.getDataTableFromJSON.programType((item.xmlProgramType ? ($.xml2json("<root>" + item.xmlProgramType + "</root>")) : ""), "xmlProgramType"),
                                    xmlLanguages: TQFServ.inputTypeRemark.getDataTableFromJSON((item.xmlLanguages ? ($.xml2json("<root>" + item.xmlLanguages + "</root>")) : ""), "xmlLanguages"),
                                    xmlAdmissionType: TQFServ.inputTypeRemark.getDataTableFromJSON((item.xmlAdmissionType ? ($.xml2json("<root>" + item.xmlAdmissionType + "</root>")) : ""), "xmlAdmissionType"),
                                    xmlCooperationType: TQFServ.inputTypeRemark.getDataTableFromJSON((item.xmlCooperationType ? ($.xml2json("<root>" + item.xmlCooperationType + "</root>")) : ""), "xmlCooperationType"),
                                    xmlCooperationInitute: self.getDataTableFromJSON.cooperationInitute((item.xmlCooperationInitute ? ($.xml2json("<root>" + item.xmlCooperationInitute + "</root>")) : ""), "xmlCooperationInitute"),
                                    xmlCooperationPattern: self.getDataTableFromJSON.cooperationPattern((item.xmlCooperationPattern ? ($.xml2json("<root>" + item.xmlCooperationPattern + "</root>")) : ""), "xmlCooperationPattern"),
                                    xmlGraduateType: TQFServ.inputTypeRemark.getDataTableFromJSON((item.xmlGraduateType ? ($.xml2json("<root>" + item.xmlGraduateType + "</root>")) : ""), "xmlGraduateType"),
                                    xmlCourseManagement: TQFServ.inputTypeRemark.getDataTableFromJSON((item.xmlCourseManagement ? ($.xml2json("<root>" + item.xmlCourseManagement + "</root>")) : ""), "xmlCourseManagement"),
                                    xmlApprovedCourses: self.getDataTableFromJSON.approvedCourses((item.xmlApprovedCourses ? ($.xml2json("<root>" + item.xmlApprovedCourses + "</root>")) : ""), "xmlApprovedCourses"),
                                    xmlCareer: self.getDataTableFromJSON.career((item.xmlCareer ? ($.xml2json("<root>" + item.xmlCareer + "</root>")) : ""), "xmlCareer"),
                                    xmlInstructorResponsible: self.getDataTableFromJSON.instructorResponsible((item.xmlInstructorResponsible ? ($.xml2json("<root>" + item.xmlInstructorResponsible + "</root>")) : ""), "xmlInstructorResponsible"),
                                    xmlPlaceStudy: self.getDataTableFromJSON.placeStudy((item.xmlPlaceStudy ? ($.xml2json("<root>" + item.xmlPlaceStudy + "</root>")) : ""), "xmlPlaceStudy"),
                                    xmlExternalSituation: TQFServ.inputTypeRemark.getDataTableFromJSON((item.xmlExternalSituation ? ($.xml2json("<root>" + item.xmlExternalSituation + "</root>")) : ""), "xmlExternalSituation"),
                                    xmlImpactCurriculum: TQFServ.inputTypeRemark.getDataTableFromJSON((item.xmlImpactCurriculum ? ($.xml2json("<root>" + item.xmlImpactCurriculum + "</root>")) : ""), "xmlImpactCurriculum"),
                                    xmlRefOtherCourses: TQFServ.inputTypeRemark.getDataTableFromJSON((item.xmlRefOtherCourses ? ($.xml2json("<root>" + item.xmlRefOtherCourses + "</root>")) : ""), "xmlRefOtherCourses")
                                });
                            }
                            if (!param.group || param.group === 2)
                            {
                                angular.extend(json2, {
                                    philosopyCourses: (item.philosopyCourses ? item.philosopyCourses : ""),
                                    xmlProgramObjectives: self.getDataTableFromJSON.programObjectives((item.xmlProgramObjectives ? ($.xml2json("<root>" + item.xmlProgramObjectives + "</root>")) : ""), "xmlProgramObjectives"),
                                    xmlPLOs: self.getDataTableFromJSON.plos((item.xmlPLOs ? ($.xml2json("<root>" + item.xmlPLOs + "</root>")) : ""), "xmlPLOs"),
                                    xmlDevelopPlan: self.getDataTableFromJSON.developPlan((item.xmlDevelopPlan ? ($.xml2json("<root>" + item.xmlDevelopPlan + "</root>")) : ""), "xmlDevelopPlan")
                                });
                            }

                            dt.push(angular.extend({}, json1, json2));
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

        self.getDataSourceOnGroup = function (group) {
            var deferred = $q.defer();
            
            if (Object.keys(self.dataRow).length > 0 && group)
            {
                self.getDataSource({
                    tableType: self.dataRow.tableType,
                    action: "get",
                    params: [
                        "",
                        ("id=" + self.dataRow.id),
                        ("programId=" + self.dataRow.programId),
                        ("courseYear=" + self.dataRow.courseYear)
                    ].join("&"),
                    group: group
                }).then(function (result) {
                    self.dataRow = (result.length > 0 ? result[0] : {});

                    deferred.resolve();
                });
            }
            else
            {
                self.dataRow = {};

                deferred.resolve();
            }

            return deferred.promise;
        };

        self.getDataTableFromJSON = {
            setValue: function (json, firstNode) {
                var data = [];

                if (json && firstNode)  angular.copy(json[firstNode].row, data);
                if (json && !firstNode) angular.copy(json.row, data);

                return data;
            },
            isced: function (json, firstNode) {
                var dt = [];
                var data = this.setValue(json, firstNode);

                if (json)
                {
                    if (data.length > 0)
                    {
                        angular.forEach(data, function (item) {
                            dt.push({
                                id: item.id,
                                name: {
                                    TH: item.nameTH,
                                    EN: item.nameEN
                                },
                                grouped: item.grouped
                            });
                        });
                    }
                    else
                        dt.push({
                            id: data.id,
                            name: {
                                TH: data.nameTH,
                                EN: data.nameEN
                            },
                            grouped: data.grouped
                        });
                }

                return dt;
            },
            majorSubject: function (json, firstNode) {
                var dt = [];
                var data = this.setValue(json, firstNode);

                if (json)
                {
                    if (data.length > 0)
                    {
                        angular.forEach(data, function (item) {
                            dt.push({
                                id: item.id,
                                name: {
                                    TH: item.nameTH,
                                    EN: item.nameEN
                                }
                            });
                        });
                    }
                    else
                        dt.push({
                            id: data.id,
                            name: {
                                TH: data.nameTH,
                                EN: data.nameEN
                            }
                        });
                }

                return dt;
            },
            programType: function (json, firstNode) {
                var dt = {};
                var data = this.setValue(json, firstNode);

                if (json)
                {
                    dt = {
                        programModel: {
                            TH: data.programModelTH,
                            EN: data.programModelEN
                        },
                        programType: {
                            TH: data.programTypeTH,
                            EN: data.programTypeEN
                        }
                    };
                }

                return dt;
            },
            cooperationInitute: function (json, firstNode) {
                var dt = {};
                var data = this.setValue(json, firstNode);

                if (json)
                {
                    dt = {
                        cooperationTypeCode: data.cooperationTypeCode,
                        xmlInstitute: self.getDataTableFromJSON.institute(data.xmlInstitute, "")
                    };
                }

                return dt;
            },
            institute: function (json, firstNode) {
                var dt = [];
                var data = this.setValue(json, firstNode);

                if (json)
                {
                    if (data.length > 0)
                    {
                        angular.forEach(data, function (item) {
                            dt.push({
                                id: (
                                    item.countryId +
                                    item.name
                                ),
                                countryId: item.countryId,
                                countryName: {
                                    TH: item.countryNameTH,
                                    EN: item.countryNameEN
                                },
                                name: item.name
                            });
                        });
                    }
                    else
                        dt.push({
                            id: (
                                data.countryId +
                                data.name
                            ),
                            countryId: data.countryId,
                            countryName: {
                                TH: data.countryNameTH,
                                EN: data.countryNameEN
                            },
                            name: data.name
                        });
                }

                return dt;
            },
            cooperationPattern: function (json, firstNode) {
                var dt = {};
                var data = this.setValue(json, firstNode);

                if (json)
                {
                    dt = {
                        cooperationTypeCode: data.cooperationTypeCode,
                        xmlCooperationPattern: TQFServ.inputTypeRemark.getDataTableFromJSON(data.xmlCooperationPattern, "")
                    };
                }

                return dt;
            },
            approvedCourses: function (json, firstNode) {
                var dt = {};
                var data = this.setValue(json, firstNode);

                if (json)
                {
                    dt = {
                        courseYear: data.courseYear,
                        prevCourseYear: data.prevCourseYear,
                        startSemester: data.startSemester,
                        startAcaYear: data.startAcaYear,
                        xmlApprovedOrdinal: self.getDataTableFromJSON.approvedCoursesOrdinal(data.xmlApprovedOrdinal, ""),
                        xmlApprovedDate: self.getDataTableFromJSON.approvedCoursesDate(data.xmlApprovedDate, "")
                    };
                }

                return dt;
            },
            approvedCoursesOrdinal: function (json, firstNode) {
                var dt = [];
                var data = this.setValue(json, firstNode);

                if (json)
                {
                    if (data.length > 0)
                    {
                        angular.forEach(data, function (item) {
                            dt.push({
                                approvedStatusId: item.approvedStatusId,
                                time: item.time,
                                year: item.year
                            });
                        });
                    }
                    else
                        dt.push({
                            approvedStatusId: data.approvedStatusId,
                            time: data.time,
                            year: data.year
                        });
                }

                return dt;
            },
            approvedCoursesDate: function (json, firstNode) {
                var dt = [];
                var data = this.setValue(json, firstNode);

                if (json)
                {
                    if (data.length > 0)
                    {
                        angular.forEach(data, function (item) {
                            dt.push({
                                approvedStatusId: item.approvedStatusId,
                                date: item.date
                            });
                        });
                    }
                    else
                        dt.push({
                            approvedStatusId: data.approvedStatusId,
                            date: data.date
                        });
                }

                return dt;
            },
            career: function (json, firstNode) {
                var dt = [];
                var data = this.setValue(json, firstNode);

                if (json)
                {
                    if (data.length > 0)
                    {
                        angular.forEach(data, function (item) {
                            dt.push({
                                id: item.name,
                                name: item.name
                            });
                        });
                    }
                    else
                        dt.push({
                            id: data.name,
                            name: data.name
                        });
                }

                return dt;
            },
            instructorResponsible: function (json, firstNode) {
                var dt = [];
								var data = this.setValue(json, firstNode);

                if (json)
                {
                    if (data.length > 0)
                    {
                        angular.forEach(data, function (item) {
                            dt.push({
                                id: parseInt(item.id),
                                personId: item.personId,
                                titlePrefix: item.titlePrefix,
                                firstName: {
                                    TH: item.firstNameTH,
                                    EN: item.firstNameEN
                                },
                                middleName: {
                                    TH: item.middleNameTH,
                                    EN: item.middleNameEN
                                },
                                lastName: {
                                    TH: item.lastNameTH,
                                    EN: item.lastNameEN
                                },
                                fullName: {
                                    TH: item.fullNameTH,
                                    EN: item.fullNameEN
                                },
                                position: item.position,
                                coursePosition: {
                                    id: item.coursePositionId,
                                    name: {
                                        TH: item.coursePositionNameTH,
                                        EN: item.coursePositionNameEN
                                    },
                                    group: item.coursePositionGroup
                                },
                                faculty: {
                                    id: item.facultyId,
                                    name: {
                                        TH: item.facultyNameTH,
                                        EN: item.facultyNameEN
                                    }
                                },
                                department: {
                                    id: item.departmentId,
                                    name: {
                                        TH: item.departmentNameTH,
                                        EN: item.departmentNameEN
                                    }
                                },
                                instructorType: {
                                    type: item.instructorType,
                                    name: {
                                        TH: item.instructorTypeNameTH,
                                        EN: item.instructorTypeNameEN
                                    }
                                },
                                addrContact: item.addrContact,
                                addrOffice: item.addrOffice,
                                telephone: item.telephone,
                                email: item.email,
                                HRiId: (item.hriID ? item.hriID : "")
                            });
                        });
                    }
										else
                        dt.push({
                            id: (data.id ? parseInt(data.id) : ""),
                            personId: (data.personId ? data.personId : ""),
                            titlePrefix: (data.titlePrefix ? data.titlePrefix : ""),
                            firstName: {
                                TH: (data.firstNameTH ? data.firstNameTH : ""),
                                EN: (data.firstNameEN ? data.firstNameEN : "")
                            },
                            middleName: {
                                TH: (data.middleNameTH ? data.middleNameTH : ""),
                                EN: (data.middleNameEN ? data.middleNameEN : "")
                            },
                            lastName: {
                                TH: (data.lastNameTH ? data.lastNameTH : ""),
                                EN: (data.lastNameEN ? data.lastNameEN : "")
                            },
                            fullName: {
                                TH: (data.fullNameTH ? data.fullNameTH : ""),
                                EN: (data.fullNameEN ? data.fullNameEN : "")
                            },
                            position: (data.position ? data.position : ""),
                            coursePosition: {
                                id: (data.coursePositionId ? data.coursePositionId : ""),
                                name: {
                                    TH: (data.coursePositionNameTH ? data.coursePositionNameTH : ""),
                                    EN: (data.coursePositionNameEN ? data.coursePositionNameEN : "")
                                },
                                group: (data.coursePositionGroup ? data.coursePositionGroup : "")
                            },
                            faculty: {
                                id: (data.facultyId ? data.facultyId : ""),
                                name: {
                                    TH: (data.facultyNameTH ? data.facultyNameTH : ""),
                                    EN: (data.facultyNameEN ? data.facultyNameEN : "")
                                }
                            },
                            department: {
															id: (data.departmentId ? data.departmentId : ""),
                                name: {
                                    TH: (data.departmentNameTH ? data.departmentNameTH : ""),
                                    EN: (data.departmentNameEN ? data.departmentNameEN : "")
                                }
                            },
                            instructorType: {
                                type: (data.instructorType ? data.instructorType : ""),
                                name: {
                                    TH: (data.instructorTypeNameTH ? data.instructorTypeNameTH : ""),
                                    EN: (data.instructorTypeNameEN ? data.instructorTypeNameEN : "")
                                }
                            },
                            addrContact: (data.addrContact ? data.addrContact : ""),
                            addrOffice: (data.addrOffice ? data.addrOffice : ""),
                            telephone: (data.telephone ? data.telephone : ""),
                            email: (data.email ? data.email : ""),
                            HRiId: (data.hriID ? data.hriID : "")
                        });
                }

                return dt;
            },
            placeStudy: function (json, firstNode) {
                var dt = [];
                var data = this.setValue(json, firstNode);

                if (json)
                {
                    if (data.length > 0)
                    {
                        angular.forEach(data, function (item) {
                            dt.push({
                                id: (
                                    item.nameTH +
                                    item.nameEN +
                                    (item.facultyId + item.facultyCode) +
                                    (item.facultyNameTH + item.facultyNameEN)
                                ),
                                name: {
                                    TH: item.nameTH,
                                    EN: item.nameEN
                                },
                                faculty: {
                                    id: item.facultyId,
                                    code: item.facultyCode,
                                    name: {
                                        TH: item.facultyNameTH,
                                        EN: item.facultyNameEN
                                    }
                                }
                            });
                        });
                    }
                    else
                        dt.push({
                            id: (
                                data.nameTH +
                                data.nameEN +
                                (data.facultyId + data.facultyCode) +
                                (data.facultyNameTH + data.facultyNameEN)
                            ),
                            name: {
                                TH: data.nameTH,
                                EN: data.nameEN
                            },
                            faculty: {
                                id: data.facultyId,
                                code: data.facultyCode,
                                name: {
                                    TH: data.facultyNameTH,
                                    EN: data.facultyNameEN
                                }
                            }
                        });
                }

                return dt;
            },
            programObjectives: function (json, firstNode) {
                var dt = [];
                var data = this.setValue(json, firstNode);

                if (json)
                {
                    if (data.length > 0)
                    {
                        angular.forEach(data, function (item) {
                            dt.push({
                                id: (
                                    item.nameTH +
                                    item.nameEN
                                ),
                                code: "",
                                name: {
                                    TH: item.nameTH,
                                    EN: item.nameEN
                                }
                            });
                        });
                    }
                    else
                        dt.push({
                            id: (
                                data.nameTH +
                                data.nameEN
                            ),
                            code: "",
                            name: {
                                TH: data.nameTH,
                                EN: data.nameEN
                            }
                        });
                }

                return dt;
            },
            plos: function (json, firstNode) {
                var dt = [];
                var data = this.setValue(json, firstNode);

                if (json)
                {
                    if (data.length > 0)
                    {
                        angular.forEach(data, function (item) {
                            dt.push({
                                id: item.code,
                                code: item.code,
                                name: {
                                    TH: item.nameTH,
                                    EN: item.nameEN
                                },
                                xmlSubPLOs: (item.xmlSubPLOs ? self.getDataTableFromJSON.subplos(item.xmlSubPLOs.row) : "")
                            });
                        });
                    }
                    else
                        dt.push({
                            id: data.code,
                            code: data.code,
                            name: {
                                TH: data.nameTH,
                                EN: data.nameEN
                            },
                            xmlSubPLOs: (data.xmlSubPLOs ? self.getDataTableFromJSON.subplos(data.xmlSubPLOs.row) : "")
                        });
                }

                return dt;
            },
            subplos: function (data) {
                var dt = [];

                if (data.length > 0)
                {
                    angular.forEach(data, function (item) {
                        dt.push({
                            id: (
                                item.nameTH +
                                item.nameEN
                            ),
                            name: {
                                TH: item.nameTH,
                                EN: item.nameEN
                            }
                        });
                    });
                }
                else
                    dt.push({
                        id: (
                            data.nameTH +
                            data.nameEN
                        ),
                        name: {
                            TH: data.nameTH,
                            EN: data.nameEN
                        }
                    });

                return dt;
            },
            developPlan: function (json, firstNode) {
                var dt = [];
                var data = this.setValue(json, firstNode);

                if (json)
                {
                    if (data.length > 0)
                    {
                        angular.forEach(data, function (item) {
                            dt.push({
                                id: (
                                    item.planTH +
                                    item.planEN +
                                    item.strategiesTH +
                                    item.strategiesEN +
                                    item.evidencesTH +
                                    item.evidencesEN
                                ),
                                plan: {
                                    TH: item.planTH,
                                    EN: item.planEN
                                },
                                strategies: {
                                    TH: item.strategiesTH,
                                    EN: item.strategiesEN
                                },
                                evidences: {
                                    TH: item.evidencesTH,
                                    EN: item.evidencesEN
                                }
                            });
                        });
                    }
                    else
                        dt.push({
                            id: (
                                data.planTH +
                                data.planEN +
                                data.strategiesTH +
                                data.strategiesEN +
                                data.evidencesTH +
                                data.evidencesEN
                            ),
                            plan: {
                                TH: data.planTH,
                                EN: data.planEN
                            },
                            strategies: {
                                TH: data.strategiesTH,
                                EN: data.strategiesEN
                            },
                            evidences: {
                                TH: data.evidencesTH,
                                EN: data.evidencesEN
                            }
                        });
                }

                return dt;
            }
        };

        self.saveChange = {
            action: function (param) {
                param.action    = (param.action === undefined ? "" : param.action);
                param.data      = (param.data === undefined || param.data === "" ? {} : param.data);

                var deferred = $q.defer();                
                var action = param.action;
                var data = param.data;
                
                if (action === "verify" || action === "reject" || action === "sendVerify")
                    action = "edit";
                else
                    data = [data];
                
                utilServ.dialogConfirmWithDict([action, "confirm"], function (result) {
                    if (result)
                    {
                        if (action === "remove")
                            utilServ.getDialogPreloadingWithDict(["msgPreloading", "removing"]);

                        appServ.save.action({
                            routePrefix: "Programme",
                            action: param.action,
                            data: data
                        }).then(function (result) {                            
                            deferred.resolve(result);
                        });
                    }
                    else
                        deferred.resolve(result);                        
                });  
                
                return deferred.promise;
            }            
        };
    });
})();