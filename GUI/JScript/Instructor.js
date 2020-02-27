/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๒๔/๑๐/๒๕๖๑>
Modify date : <๐๙/๑๐/๒๕๖๒>
Description : <รวมรวบฟังก์ชั่นใช้งานสำหรับข้อมูลอาจารย์>
=============================================
*/

(function () {
    "use strict";

    angular.module("instructorMod", [
        "ngTable",
        "utilMod",
        "appMod",
        "dictMod",
        "pageRouteMod",
        "facultyMod",
        "hriMod"
    ])

    .service("instructorServ", function ($rootScope, $timeout, $q, $compile, utilServ, appServ, pageRouteServ, facultyServ, hriServ) {
        var self = this;

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
                    routePrefix: "Instructor",
                    action: param.action,
                    params: param.params
                }).then(function (result) {                    
                    var dt = [];

                    angular.forEach(result, function (item) {
                        if (param.action === "getlist")
                        {
                            dt.push({
                                id: (item.id ? item.id : ""),
                                personId: (item.personId ? item.personId : ""),
                                titlePrefix: (item.titleDisplay ? item.titleDisplay.toUpperCase() : ""),
                                firstName: {
                                    TH: (item.firstName ? item.firstName.toUpperCase() : ""),
                                    EN: (item.firstNameEN ? item.firstNameEN.toUpperCase() : "")
                                },
                                middleName: {
                                    TH: (item.middleName ? item.middleName.toUpperCase() : ""),
                                    EN: (item.middleNameEN ? item.middleNameEN.toUpperCase() : "")
                                },
                                lastName: {
                                    TH: (item.lastName ? item.lastName.toUpperCase() : ""),
                                    EN: (item.lastNameEN ? item.lastNameEN.toUpperCase() : "")
                                },
                                fullName: {
                                    TH: (item.fullNameTH ? item.fullNameTH.toUpperCase() : ""),
                                    EN: (item.fullNameEN ? item.fullNameEN.toUpperCase() : "")
                                },
                                position: (item.position ? item.position.toUpperCase() : ""),
                                faculty: {
                                    id: (item.facultyId ? item.facultyId : ""),
                                    name: {
                                        TH: (item.facultyNameTH ? item.facultyNameTH : ""),
                                        EN: (item.facultyNameEN ? item.facultyNameEN.toUpperCase() : "")
                                    }
                                },
                                department: {
                                    id: (item.depId ? item.depId : ""),
                                    name: {
                                        TH: (item.departmentNameTH ? item.departmentNameTH : ""),
                                        EN: (item.departmentNameEN ? item.departmentNameEN.toUpperCase() : "")
                                    }
                                },
                                instructorType: {
                                    type: (item.instructorType ? item.instructorType : ""),
                                    name: {
                                        TH: (item.instructorTypeNameTH ? item.instructorTypeNameTH : ""),
                                        EN: (item.instructorTypeNameEN ? item.instructorTypeNameEN : "")
                                    }
                                },
                                addrContact: (item.addrContact ? item.addrContact : ""),
                                addrOffice: (item.addrOffice ? item.addrOffice : ""),
                                telephone: (item.telephone ? item.telephone : ""),
                                email: (item.email ? item.email : ""),
                                HRiId: (item.HRiId ? item.HRiId : ""),
                                selectFilter: ((item.id ? item.id : "") +
                                               (item.titleDisplay ? item.titleDisplay : "") +
                                               (item.fullNameTH ? item.fullNameTH : "") +
                                               (item.fullNameEN ? item.fullNameEN : "") + 
                                               (item.position ? item.position : "") + 
                                               (item.facultyNameTH ? item.facultyNameTH : "") +
                                               (item.facultyNameEN ? item.facultyNameEN : "") +
                                               (item.departmentNameTH ? item.departmentNameTH : "") +
                                               (item.departmentNameEN ? item.departmentNameEN : "") +
                                               (item.instructorTypeNameTH ? item.instructorTypeNameTH : "") +
                                               (item.instructorTypeNameEN ? item.instructorTypeNameEN : "") +
                                               (item.email ? item.email : ""))
                            });
                        }

                        if (param.action === "get")
                        {
                            dt.push({
                                id: (item.id ? item.id : ""),
                                personId: (item.personId ? item.personId : ""),
                                titlePrefix: (item.titleDisplay ? item.titleDisplay.toUpperCase() : ""),
                                firstName: {
                                    TH: (item.firstName ? item.firstName.toUpperCase() : ""),
                                    EN: (item.firstNameEN ? item.firstNameEN.toUpperCase() : "")
                                },
                                middleName: {
                                    TH: (item.middleName ? item.middleName.toUpperCase() : ""),
                                    EN: (item.middleNameEN ? item.middleNameEN.toUpperCase() : "")
                                },
                                lastName: {
                                    TH: (item.lastName ? item.lastName.toUpperCase() : ""),
                                    EN: (item.lastNameEN ? item.lastNameEN.toUpperCase() : "")
                                },
                                fullName: {
                                    TH: (item.fullNameTH ? item.fullNameTH.toUpperCase() : ""),
                                    EN: (item.fullNameEN ? item.fullNameEN.toUpperCase() : "")
                                },
                                position: (item.position ? item.position.toUpperCase() : ""),
                                faculty: {
                                    id: (item.facultyId ? item.facultyId : ""),
                                    name: {
                                        TH: (item.facultyNameTH ? item.facultyNameTH : ""),
                                        EN: (item.facultyNameEN ? item.facultyNameEN.toUpperCase() : "")
                                    }
                                },
                                department: {
                                    id: (item.depId ? item.depId : ""),
                                    name: {
                                        TH: (item.departmentNameTH ? item.departmentNameTH : ""),
                                        EN: (item.departmentNameEN ? item.departmentNameEN.toUpperCase() : "")
                                    }
                                },
                                instructorType: {
                                    type: (item.instructorType ? item.instructorType : ""),
                                    name: {
                                        TH: (item.instructorTypeNameTH ? item.instructorTypeNameTH : ""),
                                        EN: (item.instructorTypeNameEN ? item.instructorTypeNameEN : "")
                                    }
                                },
                                addrContact: (item.addrContact ? item.addrContact : ""),
                                addrOffice: (item.addrOffice ? item.addrOffice : ""),
                                telephone: (item.telephone ? item.telephone : ""),
                                email: (item.email ? item.email : ""),
                                HRiId: (item.HRiId ? item.HRiId : ""),
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
        
        self.form = {
            owner: {},
            new: function (key) {
                self.form.owner[key] = {};
                angular.copy(this.instructor, this.owner[key]);
            },
            getDialogForm: {
                owner: "",
                template: pageRouteServ.pageObject.instructor.template,
                action: function () {                    
                    if (appServ.isUser && facultyServ.isFaculty)
                    {
                        utilServ.getDialogPreloadingWithDict(["msgPreloading", "loading"]);

                        $timeout(function () {
                            utilServ.http({
                                url: self.form.getDialogForm.template
                            }).then(function (result) {
                                var title = ["instructor"];
                                var content = $compile($(".template-content").html(result.data).contents())($rootScope);

                                appServ.dialogFormOptions = {
                                    cssClass: "",
                                    title: title,
                                    content: content
                                };
                            });
                        }, 0);
                    }
                }
            },
            watchFormChange: function () {
                $timeout(function () {
                    $rootScope.$watch(function () {
                        var watch = [];

                        watch.push(self.dataSelect.data);

                        return watch;
                    }, function () {
                        if (self.dataSelect.data.length > 0) self.form.setDataTable(self.form.getDialogForm.owner);
                    }, true);
                }, 0);
            },
            setDataTable: function (owner) {
                var obj = self.form.owner[owner];

                angular.forEach(self.dataSelect.data, function (item) {                    
                    if (utilServ.getObjectByValue(obj.table.data, "id", item.id).length === 0)
                    {
                        obj.table.data.push(item);
                        obj.addedit.formField.coursePositionSelected[item.id] = {};

                        obj.HRi.dataRow[item.id] = {};
                        obj.HRi.dataRow[item.id].show = false;

                        hriServ.getDataSource({
                            action: "get",
                            params: {
                                personalId: item.HRiId
                            }
                        }).then(function (result) {
                            obj.HRi.dataRow[item.id] = (result[0] ? result[0] : {});
                            obj.HRi.dataRow[item.id].show = true;
                        });
                    }
                });
                self.dataSelect.data = [];
            },
            instructor: {
                HRi: {
                    dataRow: {}
                },
                table: {
                    data: [],
                    reload: {
                        getData: function (owner, dataSource) {
                            var obj = self.form.owner[owner];

                            angular.copy((dataSource ? dataSource : null), obj.addedit.formValue.instructorTableList);
                            angular.copy(obj.addedit.formValue.instructorTableList, obj.table.data);
                            obj.addedit.formValue.instructorData = appServ.getDataOnJoinArray(obj.table.data, ["id"]);
                        }
                    }
                },
                addedit: {
                    formField: {
                        coursePositionSelected: {}  
                    },
                    formValue: {
                        instructorTableList: [],
                        instructorData: "",
                        coursePositionSelected: {}
                    },
                    getValue: function (owner) {
                        var obj = self.form.owner[owner];
                        var result = "";

                        if (obj.table.data.length > 0)
                        {
                            angular.forEach(obj.table.data, function (item) {
                                result += (
                                    "<row>" +
                                    "<id>" + item.id + "</id>" +
                                    "<personId>" + item.personId + "</personId>" +
                                    "<titlePrefix>" + item.titlePrefix + "</titlePrefix>" +
                                    "<firstNameTH>" + item.firstName.TH + "</firstNameTH>" +
                                    "<firstNameEN>" + item.firstName.EN + "</firstNameEN>" +
                                    "<middleNameTH>" + item.middleName.TH + "</middleNameTH>" +
                                    "<middleNameEN>" + item.middleName.EN + "</middleNameEN>" +
                                    "<lastNameTH>" + item.lastName.TH + "</lastNameTH>" +
                                    "<lastNameEN>" + item.lastName.EN + "</lastNameEN>" +
                                    "<fullNameTH>" + item.fullName.TH + "</fullNameTH>" +
                                    "<fullNameEN>" + item.fullName.EN + "</fullNameEN>" +
                                    "<position>" + item.position + "</position>" +
                                    "<coursePositionId>" + (obj.addedit.formField.coursePositionSelected[item.id].selected ? obj.addedit.formField.coursePositionSelected[item.id].selected.id : "") + "</coursePositionId>" +
                                    "<coursePositionNameTH>" + (obj.addedit.formField.coursePositionSelected[item.id].selected ? obj.addedit.formField.coursePositionSelected[item.id].selected.name.TH : "") + "</coursePositionNameTH>" +
                                    "<coursePositionNameEN>" + (obj.addedit.formField.coursePositionSelected[item.id].selected ? obj.addedit.formField.coursePositionSelected[item.id].selected.name.EN : "") + "</coursePositionNameEN>" +
                                    "<coursePositionGroup>" + (obj.addedit.formField.coursePositionSelected[item.id].selected ? obj.addedit.formField.coursePositionSelected[item.id].selected.group : "") + "</coursePositionGroup>" +
                                    "<facultyId>" + item.faculty.id + "</facultyId>" +
                                    "<facultyNameTH>" + item.faculty.name.TH + "</facultyNameTH>" +
                                    "<facultyNameEN>" + item.faculty.name.EN + "</facultyNameEN>" +
                                    "<departmentId>" + item.department.id + "</departmentId>" +
                                    "<departmentNameTH>" + item.department.name.TH + "</departmentNameTH>" +
                                    "<departmentNameEN>" + item.department.name.EN + "</departmentNameEN>" +
                                    "<instructorType>" + item.instructorType.type + "</instructorType>" +
                                    "<instructorTypeNameTH>" + item.instructorType.name.TH + "</instructorTypeNameTH>" +
                                    "<instructorTypeNameEN>" + item.instructorType.name.EN + "</instructorTypeNameEN>" +
                                    "<addrContact>" + item.addrContact + "</addrContact>" +
                                    "<addrOffice>" + item.addrOffice + "</addrOffice>" +
                                    "<telephone>" + item.telephone + "</telephone>" +
                                    "<email>" + item.email + "</email>" +
                                    "<hriID>" + item.HRiId + "</hriID>" +
                                    "</row>"
                                );
                            });
                        }

                        return result;
                    }                    
                }
            }
        };        
    })

    .controller("instructorCtrl", function ($scope, $timeout, $q, $filter, NgTableParams, utilServ, appServ, facultyServ, instructorServ) {
        var self = this;

        self.tableList = new NgTableParams({}, {});

        self.init = function () {
            if (appServ.isUser && facultyServ.isFaculty)
            {
                self.setValue().then(function () {
                    self.watchFormChange();
                    self.resetValue();
                    self.showForm = true;
                });
            }
            else
                self.showForm = false;
        };

        self.watchFormChange = function () {
            $timeout(function () {
                $scope.$watch(function () {
                    var watch = [];

                    watch.push(self.tableList.settings().$loading);

                    return watch;
                }, function () {
                    if (self.tableList.settings().$loading)
                    {   
                        $(".instructor table tbody").hide();
                        $(".instructor .pagination").hide();
                    }
                    else
                    {
                        $(".instructor table tbody").show();
                        $(".instructor .pagination").show();

                        self.table.finishRender();
                    }
                }, true);

                $scope.$watch(function () {
                    return [
                        self.table.filter.formField.keyword
                    ];
                }, function (newValue, oldValue) {
                    if (newValue[0] !== oldValue[0])
                    {
                        var obj = self.table.reload;

                        obj.isPreloading = false;
                        obj.isResetDataSource = false;
                        obj.order = [{
                            isFirstPage: true
                        }];
                        obj.action();
                        self.uncheckboxAll();
                    }
                }, true);

                $scope.$watch(function () {
                    return [
                        self.table.hide
                    ];
                }, function () {
                    if (self.table.hide)
                    {
                        self.table.filter.setValue();
                        self.uncheckboxAll();
                        $(".instructor .pagination").hide();
                    }
                    else
                        $(".instructor .pagination").show();
                }, true);
            }, 0);
        };

        self.setValue = function () {
            var deferred = $q.defer();

            self.showForm = false;
            
            self.search.setValue().then(function () {
                self.search.watchFormChange();
                self.table.filter.setValue();
                self.table.dataSource = [];
                self.table.getData();

                $timeout(function () {
                    deferred.resolve();
                }, 0);
            });
            
            return deferred.promise;
        };

        self.resetValue = function () {            
        };

        self.table = {
            dataSource: [],
            hide: true,
            temp: [],
            formField: {
                toggle: {},
                checkboxes: {
                    checked: false,
                    items: {}
                }
            },
            filter: {
                formField: {
                    keyword: ""
                },
                setValue: function () {                    
                    this.resetValue();
                    this.showForm = false;
                },
                resetValue: function () {
                    this.formField.keyword = "";
                },
                action: function (dataTable) {
                    return $filter("filter")(dataTable, {
                        selectFilter: (this.formField.keyword ? this.formField.keyword : "!null")
                    });
                }
            },
            getData: function () {
                self.tableList = new NgTableParams(appServ.tableConfig.params, angular.extend(appServ.tableConfig.setting, {
                    getData: function (params) {
                        return $timeout(function () { }, appServ.tableConfig.timeout).then(function (result) {
                            return self.table.reload.getData().then(function () {
                                var dt = self.table.dataSource;
                                var df = self.table.filter.action(dt);
                                var data = df.slice((params.page() - 1) * params.count(), params.page() * params.count());

                                self.table.temp = df;

                                params.total(df.length);
                                params.totalSearch = dt.length;
                                params.totalPage = (Math.ceil(params.total() / params.count()));

                                return data;
                            });
                        });
                    }
                }));
            },
            finishRender: function () {
                appServ.closeDialogPreloading();

                $timeout(function () {
                    if ($("#" + utilServ.idDialogForm).is(":visible") === false)
                    {                        
                        utilServ.dialogFormWithDict(appServ.dialogFormOptions, function (e) { });
                    }
                }, 0);
            },
            reload: {
                isPreloading: false,
                isResetDataSource: false,
                order: [],
                action: function () {
                    var deferred = $q.defer();

                    if (this.isPreloading) utilServ.getDialogPreloadingWithDict(["msgPreloading", "loading"]);
                    if (this.isResetDataSource) self.table.dataSource = [];

                    this.getData().then(function () {
                        angular.forEach(self.table.reload.order, function (item) {
                            self.tableList.reload();
                            if (self.tableList.total() === 0) item.isFirstPage = true;
                            if (item.isFirstPage) self.tableList.page(1);
                        });

                        $timeout(function () {
                            deferred.resolve();
                        }, 0);
                    });

                    return deferred.promise;
                },
                getData: function () {
                    var deferred = $q.defer();

                    if (self.search.getValue().keyword || self.search.getValue().facultyId)
                    {
                        instructorServ.getDataSource({
                            dataSource: self.table.dataSource,
                            action: "getlist",
                            params: [
                                "",
                                ("keyword=" + self.search.getValue().keyword),
                                ("facultyId=" + self.search.getValue().facultyId)
                            ].join("&")
                        }).then(function (result) {
                            self.table.dataSource = result;                        
                    
                            $timeout(function () {
                                deferred.resolve();
                            }, 0);
                        });
                    }
                    else
                        $timeout(function () {
                            deferred.resolve();
                        }, 0);

                    return deferred.promise;
                }
            }
        };

        self.checkboxRootOnOffByChild = function () {
            self.table.formField.checkboxes.checked = utilServ.uncheckboxRoot({
                data: self.table.temp,
                checkboxesRoot: self.table.formField.checkboxes.checked,
                checkboxesChild: self.table.formField.checkboxes.items,
                field: "id"
            });
        };
        
        self.checkboxChildOnOffByRoot = function () {
            utilServ.uncheckboxAll({
                data: self.table.temp,
                checkboxesRoot: self.table.formField.checkboxes.checked,
                checkboxesChild: self.table.formField.checkboxes.items,
                field: "id"
            });
        };

        self.uncheckboxAll = function () {
            if ($(".instructor .table .inputcheckbox:checked").length > 0)
            {
                if (self.table.formField.checkboxes.checked) self.table.formField.checkboxes.checked = false;                
                self.checkboxChildOnOffByRoot();
            }
        };

        self.search = {
            formField: {
                keyword: "",
                facultySelected: {}
            },
            watchFormChange: function () {
                $timeout(function () {
                    $scope.$watch(function () {
                        var watch = [];

                        watch.push(self.search.formField.keyword);
                        watch.push(self.search.formField.facultySelected.selected);

                        return watch;
                    }, function (newValue, oldValue) {
                        var exit = false;

                        if (!exit)
                        {
                            if ((newValue[0] || newValue[1]) &&
                                (newValue[0] !== oldValue[0]) ||
                                (newValue[1] !== oldValue[1]))
                                exit = true;
                        }

                        self.search.isFormChanged = exit;
                        self.table.hide = true;
                    }, true);
                }, 0);
            },
            setValue: function () {
                var deferred = $q.defer();

                this.resetValue();
                this.showForm = false;     

                this.isFormChanged = false;

                facultyServ.getDataSource({
                    action: "getlist"
                }).then(function (result) {
                    appServ.table.dataSource["faculty"] = angular.copy(result);

                    $timeout(function () {
                        deferred.resolve();
                    }, 0);
                });

                return deferred.promise;
            },
            resetValue: function () {
                this.formField.keyword = "";
                this.formField.facultySelected = {};
            },
            getValue: function () {
                var result = {
                    keyword: (this.formField.keyword ? this.formField.keyword : ""),
                    facultyId: (this.formField.facultySelected.selected ? this.formField.facultySelected.selected.id : "")
                };

                return result;
            },
            action: function () {
                utilServ.getDialogPreloadingWithDict(["msgPreloading", "searching"]);

                self.table.hide = true;
                self.uncheckboxAll();
                self.table.reload.isPreloading = true;
                self.table.reload.isResetDataSource = true;
                self.table.reload.order = [{
                    isFirstPage: true
                }];
                self.table.reload.action().then(function () {
                    self.table.hide = false;
                });
            }
        };

        self.saveChange = {
            validate: function () {
                if (utilServ.getValueCheckboxTrue(self.table.temp, "id", self.table.formField.checkboxes.items).length === 0)
                {
                    utilServ.dialogErrorWithDict(["entries", "selectError"], function () { });
                    return false;
                }

                return true;
            },
            action: function () {
                if (this.validate())
                {                                        
                    var data = [];

                    angular.forEach(self.table.temp, function (item) {
                        if (self.table.formField.checkboxes.items[item.id])
                            data.push(item);
                    });

                    angular.copy(data, instructorServ.dataSelect.data);

                    $("#" + utilServ.idDialogForm + ".modal").modal("hide");
                }
            }
        };
    });
})();