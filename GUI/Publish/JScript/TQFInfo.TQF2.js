/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๒/๑๐/๒๕๖๑>
Modify date : <๐๙/๑๐/๒๕๖๒>
Description : <รวมรวบฟังก์ชั่นใช้งานสำหรับข้อมูลมคอ.ในส่วนของมคอ. 2>
=============================================
*/

(function () {
    "use strict";

    angular.module("TQFInfo.TQF2Mod", [
        "ui.utils.masks",        
        "autoCompleteModule",
        "utilMod",
        "appMod",
        "dictMod",
        "pageRouteMod",
        "facultyMod",
        "programmeMod",
        "TQFMod",
        "iscedMod",
        "degreeMod",
        "majorSubjectMod",
        "inputTypeMod",
        "countryMod",
        "approvedStatusMod",
        "careerMod",        
        "instructorMod",        
        "coursePositionMod",
        "hriMod",
        "placeStudyMod",
        "plosMod",
        "kpiMod",
        "appendixMod",
        "subjectMod"
    ])

    .controller("TQFInfo.TQF2Ctrl", function ($scope, $timeout, $q, $compile, $location, utilServ, appServ, dictServ, pageRouteServ, facultyServ, programmeServ, TQFServ) {
        var self = this;

        pageRouteServ.setMenuActive({
            menuName: (pageRouteServ.pageObject.TQF2.class + "-menu")
        });            

        self.maxSection = 8,
        self.accordionGroup = {};

        self.init = function () {
            if (appServ.isUser)
            {                
                if (programmeServ.isEdit || programmeServ.isUpdate)
                {
                    if (programmeServ.isProgram)
                    {
                        if (programmeServ.isEdit)     self.addedit.template.action = "edit";
                        if (programmeServ.isUpdate)   self.addedit.template.action = "update";

                        self.watchFormChange();
                        facultyServ.isFaculty = true;
                        self.showForm = false;
                        self.addedit.showForm = true;
                        self.addedit.template.init();
                    }
                    else
                    {
                        self.showForm = false;
                        self.addedit.showForm = false;

                        appServ.closeDialogPreloading();

                        utilServ.dialogErrorWithDict(["program", "programNotFound"], function (e) {
                        });
                    }
                }
                else
                {
                    if (programmeServ.isProgram)
                        $location.path("/AcademicInfo/Programme/" + facultyServ.facultyInfo.id).replace();
                    else
                    {
                        self.setValue().then(function () {           
                            self.watchFormChange();
                            self.resetValue();
                            facultyServ.isFaculty = false;
                            programmeServ.isProgram = false;
                            self.showForm = true;

                            self.tabSelect.selected("programmeVerified");
                        });
                    }
                }    
            }
        };

        self.watchFormChange = function () {
            $timeout(function () {
                $scope.$watch(function () {
                    var watch = [];

                    watch.push(self.table.isReload);
                    watch.push(self.addedit.isEdit);
                    watch.push(self.addedit.isUpdate);

                    return watch;
                }, function () {                    
                    if (self.table.isReload)
                    {                        
                        programmeServ.tableList.programmeVerified.settings().$loading = false;
                        programmeServ.tableList.programmePendingVerify.settings().$loading = false;
                        programmeServ.tableList.programmeSendingVerify.settings().$loading = false;

                        var obj = self.table.reload;

                        obj.isPreloading = true;
                        obj.isResetDataSource = true;
                        obj.tableType = "master";
                        obj.order = [{
                            table: "programmeVerified",
                            isFirstPage: true
                        }];
                        obj.action().then(function () {
                            obj.tableType = "temp";
                            obj.order = [{
                                table: "programmePendingVerify",
                                isFirstPage: true
                            }, {
                                table: "programmeSendingVerify",
                                isFirstPage: true
                            }];
                            obj.action().then(function () {
                                programmeServ.table.hide = false;
                            });
                        });
                    }

                    if (self.addedit.isEdit || self.addedit.isUpdate)
                    {
                        pageRouteServ.setMenuActive({
                            menuName: (pageRouteServ.pageObject.TQF2.class + "-menu"),
                            isSubSubMenu: true
                        });
                        dictServ.dict.menuTmp = {
                            TH: programmeServ.dataRow.programFullCode,
                            EN: programmeServ.dataRow.programFullCode
                        };
                    }
                }, true);
            }, 0);
        };

        self.tabSelect = {
            activeTabIndex: 0,
            selected: function (tabName) {
                var tabIndex;
                var obj;

                if (tabName === "programmeVerified")
                {
                    tabIndex = 0;
                    obj = self.programme.verified.template;
                }
                if (tabName === "programmePendingVerify")
                {
                    tabIndex = 1;
                    obj = self.programme.pendingVerify.template;
                }

                if (tabName === "programmeSendingVerify")
                {
                    tabIndex = 2;
                    obj = self.programme.sendingVerify.template;
                }

                if (obj.content.length === 0)
                    utilServ.getDialogPreloadingWithDict(["msgPreloading", "loading"]);

                this.activeTabIndex = tabIndex;
                obj.init();
            }
        };
        
        self.setValue = function () {
            var deferred = $q.defer();

            self.showForm = false;

            self.search.setValue().then(function () {
                self.search.watchFormChange();                
                programmeServ.table = self.table;

                $timeout(function () {
                    deferred.resolve();
                }, 0);
            });

            return deferred.promise;
        };
        
        self.resetValue = function () {
            utilServ.gotoTopPage();
        };

        self.table = {
            isReload: false,
            hide: true,
            master: {                
                dataSource: []
            },
            temp: {
                dataSource: []
            },
            reload: {
                isPreloading: false,
                isResetDataSource: false,
                tableType: "",
                order: [],
                action: function () {
                    var deferred = $q.defer();

                    if (this.isPreloading) utilServ.getDialogPreloadingWithDict(["msgPreloading", "loading"]);
                    if (this.isResetDataSource) self.table[this.tableType].dataSource = [];

                    this.getData().then(function () {                        
                        angular.forEach(self.table.reload.order, function (item) {
                            programmeServ.tableList[item.table].reload();
                            if (programmeServ.tableList[item.table].total() === 0) item.isFirstPage = true;
                            if (item.isFirstPage) programmeServ.tableList[item.table].page(1);
                        });

                        $timeout(function () {
                            deferred.resolve();
                        }, 0);                       
                    });

                    return deferred.promise;
                },
                getData: function () {
                    var deferred = $q.defer();

                    if (self.table.isReload)
                    {
                        self.table.isReload = false;
                        self.table[this.tableType].dataSource = [];                        
                    }
                    
                    programmeServ.getDataSource({
                        tableType: this.tableType,
                        dataSource: self.table[this.tableType].dataSource,
                        action: "getlist",
                        params: [
                            "",
                            ("facultyId=" + self.search.getValue().facultyId)
                        ].join("&")
                    }).then(function (result) {                        
                        if (self.table.reload.tableType === "temp")
                            result = result.filter(function (dr) {
                                return dr.status !== "Y";
                            });

                        self.table[self.table.reload.tableType].dataSource = result;
                        
                        $timeout(function () {
                            deferred.resolve();
                        }, 0);
                    });
                    
                    return deferred.promise;
                }
            }
        };

        self.programme = {
            verified: {
                template: {
                    content: "",
                    init: function () {
                        if (appServ.isUser && !programmeServ.isProgram && !programmeServ.isEdit && !programmeServ.isUpdate)
                            this.content = pageRouteServ.pageObject.TQF2.programme.verified.template;
                    }
                }
            },
            pendingVerify: {
                template: {
                    content: "",
                    init: function () {
                        if (appServ.isUser && !programmeServ.isProgram && !programmeServ.isEdit && !programmeServ.isUpdate)
                            this.content = pageRouteServ.pageObject.TQF2.programme.pendingVerify.template;
                    }
                }
            },
            sendingVerify: {
                template: {
                    content: "",
                    init: function () {
                        if (appServ.isUser && !programmeServ.isProgram && !programmeServ.isEdit && !programmeServ.isUpdate)
                            this.content = pageRouteServ.pageObject.TQF2.programme.sendingVerify.template;
                    }
                }
            }
        };

        self.search = {
            formField: {
                facultySelected: {}
            },
            watchFormChange: function () {
                $timeout(function () {
                    $scope.$watch(function () {
                        var watch = [];

                        watch.push(self.search.formField.facultySelected.selected);

                        return watch;
                    }, function (newValue, oldValue) {
                        var exit = false;

                        if (self.search.formField.facultySelected.selected)
                        {
                            facultyServ.isFaculty = true;
                            facultyServ.facultyInfo = self.search.formField.facultySelected.selected;
                        }
                        else
                        {
                            facultyServ.isFaculty = false;
                            facultyServ.facultyInfo = {};
                        }

                        if (!exit)
                        {
                            if (newValue[0] &&
                                (newValue[0] !== oldValue[0]))
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
                this.formField.facultySelected = {};
            },
            getValue: function () {
                var result = {
                    facultyId: (this.formField.facultySelected.selected ? this.formField.facultySelected.selected.id : "")
                };

                return result;
            },
            action: function () {
                utilServ.getDialogPreloadingWithDict(["msgPreloading", "searching"]);
                self.table.hide = true;
                self.table.isReload = true;
            }
        };

        self.addedit = {
            showForm: false,
            disabled: false,
            template: {
                content: "",
                action: "",
                init: function () {
                    if (appServ.isUser && facultyServ.isFaculty && programmeServ.isProgram && self.addedit.showForm)
                    {
                        utilServ.getDialogPreloadingWithDict(["msgPreloading", "loading"]);

                        self.addedit.template.content = pageRouteServ.pageObject.TQF2.addedit.template;
                    }
                },
                remove: function () {
                    facultyServ.isFaculty = false;
                    programmeServ.isProgram = false;
                    programmeServ.dataRow = {};
                    this.action = "";
                    self.addedit.isEdit = false;
                    self.addedit.isUpdate = false;                    

                    pageRouteServ.setMenuActiveAction({
                        menuName: (pageRouteServ.pageObject.TQF2.class + "-menu"),
                        isSubSubMenu: true
                    });
                    pageRouteServ.setMenuActive({
                        menuName: (pageRouteServ.pageObject.TQF2.class + "-menu")
                    });
                    dictServ.dict.menuTmp = {};

                    utilServ.removeCacheTemplate(this.content);
                    this.content = "";
                }
            },            
            init: function () {
                if (appServ.isUser && facultyServ.isFaculty && programmeServ.isProgram)
                {
                    var action = self.addedit.template.action;

                    if (action === "edit" || action === "update")
                    {
                        pageRouteServ.setMenuActiveAction({
                            menuName: (pageRouteServ.pageObject.TQF2.class + "-menu"),
                            isSubSubMenu: true,
                            action: (programmeServ.dataRow.status === "Y" ? "verified" : (programmeServ.dataRow.status === "P" ? "pendingverify" : action)),
                            by: true
                        });
                    }

                    this.setValue().then(function () {
                        self.addedit[action].setValue();
                        self.addedit.resetValue();
                        self.addedit.showForm = true;

                        appServ.closeDialogPreloading();
                    });
                }
                else
                    self.addedit.showForm = false;
            },
            setValue: function () {
                var deferred = $q.defer();

                this.isEdit = false;
                this.isUpdate = false;
                this.disabled = (programmeServ.dataRow.status === "Y" || programmeServ.dataRow.status === "P" ? true : false);
                
                TQFServ.TQF2.accordionGroup.isOpen = true;

                angular.forEach(utilServ.getArrayNumber(self.maxSection), function (item) {
                    self.accordionGroup["section" + item] = {
                        isOpen: false
                    };
                });
                
                if (!programmeServ.isEdit && !programmeServ.isUpdate && programmeServ.isProgram)
                {
                    programmeServ.getDataSourceOnGroup(-1).then(function () {
                        facultyServ.facultyInfo.id = programmeServ.dataRow.facultyId;
                        
                        $timeout(function () {
                            deferred.resolve();
                        }, 0);
                    });
                }
                else
                {                            
                    $timeout(function () {
                        deferred.resolve();
                    }, 0);
                }

                return deferred.promise;
            },
            resetValue: function () {
                angular.forEach(utilServ.getArrayNumber(self.maxSection), function (item) {
                    self.accordionGroup["section" + item].isOpen = false;
                });

                utilServ.gotoTopPage();
            },
            edit: {
                init: function () {
                    self.addedit.init();
                },
                setValue: function () {
                    self.addedit.isEdit = true;
                    self.addedit.isUpdate = false;
                }
            },
            update: {
                init: function () {
                    self.addedit.init();
                },
                setValue: function () {

                    self.addedit.isEdit = false;
                    self.addedit.isUpdate = true;
                }
            }
        };

        self.sendVerifyReject = {
            getDialogForm: {
                template: pageRouteServ.pageObject.programme.sendVerifyReject.template,
                validate: function () {
                    if (programmeServ.dataSelect.data.length === 0)
                    {
                        utilServ.dialogErrorWithDict(["entries", "selectError"], function () { });
                        return false;
                    }

                    return true;
                },
                action: function () {
                    if (appServ.isUser && facultyServ.isFaculty)
                    {
                        if (this.validate())
                        {
                            utilServ.getDialogPreloadingWithDict(["msgPreloading", "loading"]);
                            
                            $timeout(function () {
                                utilServ.http({
                                    url: self.sendVerifyReject.getDialogForm.template
                                }).then(function (result) {
                                    var title = ["program", programmeServ.dataSelect.action];
                                    var content = $compile($(".template-content").html(result.data).contents())($scope);

                                    appServ.dialogFormOptions = {
                                        cssClass: "",
                                        title: title,
                                        content: content
                                    };
                                });
                            }, 0);
                        }
                    }
                }
            }
        };
    })

    .controller("TQFInfo.TQF2.programme.verifiedCtrl", function ($scope, $timeout, $q, $filter, NgTableParams, utilServ, appServ, programmeServ) {
        var self = this;

        self.init = function () {
            if (appServ.isUser && !programmeServ.isProgram)
            {
                self.setValue().then(function () {
                    self.watchFormChange();
                    self.resetValue();
                    self.showForm = true;                    

                    appServ.closeDialogPreloading();
                });
            }
            else
                self.showForm = false;
        };
        
        self.watchFormChange = function () {
            $timeout(function () {
                $scope.$watch(function () {
                    var watch = [];

                    watch.push(programmeServ.tableList.programmeVerified.settings().$loading);

                    return watch;
                }, function () {
                    if (programmeServ.tableList.programmeVerified.settings().$loading)
                    {   
                        $(".tqfinfo.tqf2.programme.verified table tbody").hide();
                        $(".tqfinfo.tqf2.programme.verified .pagination").hide();
                    }
                    else
                    {
                        $(".tqfinfo.tqf2.programme.verified table tbody").show();
                        $(".tqfinfo.tqf2.programme.verified .pagination").show();                

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
                        var obj = programmeServ.table.reload;

                        obj.isPreloading = false;
                        obj.isResetDataSource = false;
                        obj.tableType = "master";
                        obj.order = [{
                            table: "programmeVerified",
                            isFirstPage: true
                        }];
                        obj.action();
                    }
                }, true);
                
                $scope.$watch(function () {
                    return [
                        programmeServ.table.hide
                    ];
                }, function () {
                    if (programmeServ.table.hide)
                    {
                        self.table.filter.setValue();
                        $(".tqfinfo.tqf2.programme.verified .pagination").hide();
                    }
                    else
                        $(".tqfinfo.tqf2.programme.verified .pagination").show();   
                }, true);
            }, 0);
        };
        
        self.setValue = function () {
            var deferred = $q.defer();

            self.showForm = false;
            
            self.table.filter.setValue();
            self.table.getData();
            
            $timeout(function () {
                deferred.resolve();
            }, 0);
            
            return deferred.promise;
        };
        
        self.resetValue = function () {
            utilServ.gotoTopPage();
        };
        
        self.table = {
            temp: [],
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
                programmeServ.tableList.programmeVerified = new NgTableParams(appServ.tableConfig.params, angular.extend(appServ.tableConfig.setting, {
                    getData: function (params) {
                        return $timeout(function () { }, appServ.tableConfig.timeout).then(function (result) {                            
                            programmeServ.table.reload.tableType = "master";
                            return programmeServ.table.reload.getData().then(function () {                                
                                var dt = programmeServ.table.master.dataSource;
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
                utilServ.setSectionLayout();
                utilServ.gotoTopPage();
            }
        };
    })

    .controller("TQFInfo.TQF2.programme.pendingVerifyCtrl", function ($scope, $timeout, $q, $filter, NgTableParams, utilServ, appServ, programmeServ) {
        var self = this;

        self.init = function () {
            if (appServ.isUser && !programmeServ.isProgram)
            {
                self.setValue().then(function () {
                    self.watchFormChange();
                    self.resetValue();
                    self.showForm = true;                            

                    appServ.closeDialogPreloading();
                });
            }
            else
                self.showForm = false;            
        };
        
        self.watchFormChange = function () {
            $timeout(function () {
                $scope.$watch(function () {
                    var watch = [];

                    watch.push(programmeServ.tableList.programmePendingVerify.settings().$loading);

                    return watch;
                }, function () {
                    if (programmeServ.tableList.programmePendingVerify.settings().$loading)
                    {                        
                        $(".tqfinfo.tqf2.programme.pendingverify table tbody").hide();
                        $(".tqfinfo.tqf2.programme.pendingverify .pagination").hide();
                    }
                    else
                    {
                        $(".tqfinfo.tqf2.programme.pendingverify table tbody").show();
                        $(".tqfinfo.tqf2.programme.pendingverify .pagination").show();

                        self.table.finishRender();
                    }
                }, true);

                $scope.$watch(function () {
                    return [
                        self.table.filter.formField.keyword,
                        self.table.filter.formField.modeSelected.selected,
                        self.table.filter.formField.verifyStatusSelected.selected
                    ];
                }, function (newValue, oldValue) {
                    if ((newValue[0] !== oldValue[0]) ||
                        (newValue[1] !== oldValue[1]) ||
                        (newValue[2] !== oldValue[2]))
                    {
                        var obj = programmeServ.table.reload;

                        obj.isPreloading = false;
                        obj.isResetDataSource = false;
                        obj.tableType = "temp";
                        obj.order = [{
                            table: "programmePendingVerify",
                            isFirstPage: true
                        }];
                        obj.action();
                    }
                }, true);

                $scope.$watch(function () {
                    return [
                        programmeServ.table.hide
                    ];
                }, function () {
                    if (programmeServ.table.hide)
                    {
                        self.table.filter.setValue();
                        $(".tqfinfo.tqf2.programme.pendingverify .pagination").hide();
                    }
                    else
                        $(".tqfinfo.tqf2.programme.pendingverify .pagination").show();
                }, true);
            }, 0);
        };
        
        self.setValue = function () {
            var deferred = $q.defer();

            self.showForm = false;
            
            self.table.filter.setValue();
            self.table.getData();
            
            $timeout(function () {
                deferred.resolve();
            }, 0);
            
            return deferred.promise;
        };
        
        self.resetValue = function () {
            utilServ.gotoTopPage();
        };

        self.table = {
            temp: [],            
            filter: {
                formField: {
                    keyword: "",
                    modeSelected: {},
                    verifyStatusSelected: {}
                },
                setValue: function () {                    
                    this.resetValue();
                    this.showForm = false;
                },
                resetValue: function () {
                    this.formField.keyword = "";
                    this.formField.modeSelected = {};
                    this.formField.verifyStatusSelected = {};
                },
                action: function (dataTable) {
                    return $filter("filter")(dataTable, {
                        selectFilter: (this.formField.keyword ? this.formField.keyword : "!null"),
                        mode: (this.formField.modeSelected.selected ? this.formField.modeSelected.selected.id : "!null"),
                        cancelStatus: "!Y",
                        verifyStatus: "!Y",
                        status: (this.formField.verifyStatusSelected.selected ? this.formField.verifyStatusSelected.selected.id : "!S")
                    });
                }
            },
            getData: function () {
                programmeServ.tableList.programmePendingVerify = new NgTableParams(appServ.tableConfig.params, angular.extend(appServ.tableConfig.setting, {
                    getData: function (params) {
                        return $timeout(function () { }, appServ.tableConfig.timeout).then(function (result) {
                            programmeServ.table.reload.tableType = "temp";
                            return programmeServ.table.reload.getData().then(function () {
                                var dt = programmeServ.table.temp.dataSource;
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
                utilServ.setSectionLayout();
                utilServ.gotoTopPage();
            }
        };
    })
    
    .controller("TQFInfo.TQF2.programme.sendingVerifyCtrl", function ($scope, $timeout, $q, $filter, NgTableParams, utilServ, appServ, programmeServ) {
        var self = this;

        self.init = function () {
            if (appServ.isUser && !programmeServ.isProgram)
            {
                self.setValue().then(function () {                    
                    self.watchFormChange();                    
                    self.resetValue();
                    self.showForm = true;                            

                    appServ.closeDialogPreloading();
                });
            }
            else
                self.showForm = false;
        };

        self.watchFormChange = function () {
            $timeout(function () {
                $scope.$watch(function () {
                    var watch = [];

                    watch.push(programmeServ.tableList.programmeSendingVerify.settings().$loading);

                    return watch;
                }, function () {
                    if (programmeServ.tableList.programmeSendingVerify.settings().$loading)
                    {                        
                        $(".tqfinfo.tqf2.programme.sendingverify table tbody").hide();
                        $(".tqfinfo.tqf2.programme.sendingverify .pagination").hide();
                    }
                    else
                    {
                        $(".tqfinfo.tqf2.programme.sendingverify table tbody").show();
                        $(".tqfinfo.tqf2.programme.sendingverify .pagination").show();

                        self.table.finishRender();
                    }

                    if (programmeServ.dataSelect.data.length === 0)
                        self.uncheckboxAll();
                }, true);

                $scope.$watch(function () {
                    return [
                        self.table.filter.formField.keyword,
                        self.table.filter.formField.facultySelected.selected
                    ];
                }, function (newValue, oldValue) {
                    if ((newValue[0] !== oldValue[0]) ||
                        (newValue[1] !== oldValue[1]))
                    {
                        var obj = programmeServ.table.reload;

                        obj.isPreloading = false;
                        obj.isResetDataSource = false;
                        obj.tableType = "temp";
                        obj.order = [{
                            table: "programmeSendingVerify",
                            isFirstPage: true
                        }];
                        obj.action();
                        self.uncheckboxAll();
                    }
                }, true);

                $scope.$watch(function () {
                    return [
                        programmeServ.table.hide
                    ];
                }, function () {
                    if (programmeServ.table.hide)
                    {    
                        self.table.filter.setValue();
                        self.uncheckboxAll();
                        $(".tqfinfo.tqf2.programme.sendingverify .pagination").hide();
                    }
                    else
                        $(".tqfinfo.tqf2.programme.sendingverify .pagination").show();
                }, true);
            }, 0);
        };

        self.setValue = function () {
            var deferred = $q.defer();

            self.showForm = false;
            
            self.table.filter.setValue();
            self.table.getData();
            
            $timeout(function () {
                deferred.resolve();
            }, 0);
            
            return deferred.promise;
        };

        self.resetValue = function () {
            utilServ.gotoTopPage();
        };

        self.table = {
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
                    keyword: "",
                    facultySelected: {}
                },
                setValue: function () {                    
                    this.resetValue();
                    this.showForm = false;
                },
                resetValue: function () {
                    this.formField.keyword = "";
                    this.formField.facultySelected = {};
                },
                action: function (dataTable) {
                    return $filter("filter")(dataTable, {
                        selectFilter: (this.formField.keyword ? this.formField.keyword : "!null"),
                        cancelStatus: "!Y",
                        status: "S"
                    });
                }
            },
            getData: function () {
                programmeServ.tableList.programmeSendingVerify = new NgTableParams(appServ.tableConfig.params, angular.extend(appServ.tableConfig.setting, {
                    getData: function (params) {
                        return $timeout(function () { }, appServ.tableConfig.timeout).then(function (result) {
                            programmeServ.table.reload.tableType = "temp";
                            return programmeServ.table.reload.getData().then(function () {
                                var dt = programmeServ.table.temp.dataSource;
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
                utilServ.setSectionLayout();
                utilServ.gotoTopPage();
            }
        };

        self.checkboxRootOnOffByChild = function () {     
            var data = self.table.temp.filter(function (dr) {
                return dr.status === "S";
            });

            self.table.formField.checkboxes.checked = utilServ.uncheckboxRoot({
                data: data,
                checkboxesRoot: self.table.formField.checkboxes.checked,
                checkboxesChild: self.table.formField.checkboxes.items,
                field: "id"
            });
        };

        self.checkboxChildOnOffByRoot = function () {
            var data = self.table.temp.filter(function (dr) {
                return dr.status === "S";
            });

            utilServ.uncheckboxAll({
                data: data,
                checkboxesRoot: self.table.formField.checkboxes.checked,
                checkboxesChild: self.table.formField.checkboxes.items,
                field: "id"
            });
        };

        self.uncheckboxAll = function () {
            if ($(".tqfinfo.tqf2.programme.sendingverify .table .inputcheckbox:checked").length > 0)
            {
                if (self.table.formField.checkboxes.checked) self.table.formField.checkboxes.checked = false;                
                self.checkboxChildOnOffByRoot();
            }
        };

        self.sendVerify = {
            setValue: function (action) {      
                var data = self.table.temp.filter(function (dr) {
                    return dr.status === "S";
                });
                
                programmeServ.dataSelect = {
                    action: action,
                    data: utilServ.getValueCheckboxTrue(data, "id", self.table.formField.checkboxes.items)
                };
            }
        };
    })

    .controller("TQFInfo.TQF2.group1Ctrl", function ($scope, $timeout, $q, $location, $filter, utilServ, appServ, dictServ, pageRouteServ, facultyServ, programmeServ, TQFServ, iscedServ, majorSubjectServ, inputTypeServ, countryServ, approvedStatusServ, careerServ, instructorServ, coursePositionServ, hriServ, placeStudyServ) {
        var self = this;

        $scope.datepicker = {
            owner: {},
            new: function (key) {
                $scope.datepicker.owner[key] = {
                    date: ""
                };
            }
        };

        self.owner = "tqf2g1";
        self.maxSection = 13,
        self.accordionGroup = {};

        self.addedit = {
            showForm: false,
            template: {
                content: "",
                action: "",
                init: function () {
                    if (appServ.isUser && facultyServ.isFaculty && programmeServ.isProgram && self.addedit.showForm)
                    {                        
                        utilServ.getDialogPreloadingWithDict(["msgPreloading", "loading"]);

                        this.content = pageRouteServ.pageObject.TQF2.group1.addedit.template;
                    }
                },
                remove: function () {
                    utilServ.removeCacheTemplate(this.content);
                    this.content = "";
                }
            },
            init: function () {
                if (appServ.isUser && facultyServ.isFaculty && programmeServ.isProgram)
                {
                    var action = self.addedit.template.action;

                    this.setValue().then(function () {
                        self.addedit[action].setValue();
                        programmeServ.isProgram = TQFServ.isProgramOnGroup(self, programmeServ.dataRow);

                        if (programmeServ.isProgram)
                        {
                            self.addedit.getDataMaster().then(function () {
                                angular.forEach(utilServ.getArrayNumber(self.maxSection), function (item) {
                                    self.addedit["section" + item].setValue();
                                });
                                self.addedit.watchFormChange();
                                self.addedit.resetValue();
                                self.addedit.showForm = true;

                                appServ.closeDialogPreloading();
                            });
                        }
                    });
                }
                else
                    self.addedit.showForm = false;
            },
            watchFormChange: function () {
                angular.forEach(utilServ.getArrayNumber(self.maxSection), function (item) {
                    self.addedit["section" + item].watchFormChange();
                });

                $timeout(function () {                    
                    $scope.$watch(function () {
                        var watch = [];

                        angular.forEach(utilServ.getArrayNumber(self.maxSection), function (item) {
                            watch.push(self.addedit["section" + item].isFormChanged);
                        });

                        return watch;
                    }, function () {
                        var exit = false;                            

                        if (!exit)
                        {
                            angular.forEach(utilServ.getArrayNumber(self.maxSection), function (item) {
                                if (self.addedit["section" + item].isFormChanged)
                                {
                                    exit = true;
                                    return;
                                }
                            });
                        }

                        self.addedit.isFormChanged = exit;
                    }, true);
                }, 0);
            },            
            formField: {
                dLevel: "B"
            },
            formValue: {
            },
            formValidate: {
                setValue: function () {
                    this.resetValue();
                },
                resetValue: function () {
                    this.showSaveError = false;
                    this.isValid = {};
                }
            },
            setValue: function () {
                var deferred = $q.defer();

                this.isAdd = false;
                this.isEdit = false;
                this.isUpdate = false;
                this.isDelete = false;
                this.isFormChanged = false;

                this.formValidate.setValue();

                angular.forEach(utilServ.getArrayNumber(self.maxSection), function (item) {
                    self.accordionGroup["section" + item] = {
                        isOpen: false
                    };
                });

                programmeServ.getDataSourceOnGroup(1).then(function () {
                    $timeout(function () {
                        deferred.resolve();
                    }, 0);
                });

                return deferred.promise;
            },
            getDataMaster: function () {
                var deferred = $q.defer();

                iscedServ.getDataSource({
                    action: "getlist"
                }).then(function (result) {
                    appServ.table.dataSource["isced"] = angular.copy(result);

                    majorSubjectServ.getDataSource({
                        action: "getlist"
                    }).then(function (result) {
                        appServ.table.dataSource["majorSubject"] = angular.copy($filter("filter")(result, { facultyId: facultyServ.facultyInfo.id, dLevel: self.addedit.formField.dLevel }));

                        inputTypeServ.getDataSource({
                            action: "getlist",
                            params: [
                                "",
                                ("curYear=" + utilServ.curYear.TH),
                                ("dLevel=" + self.addedit.formField.dLevel)
                            ].join("&")
                        }).then(function (result) {
                            appServ.table.dataSource["language"] = angular.copy($filter("filter")(result, { groupType: "programLanguages" }));
                            appServ.table.dataSource["admissionType"] = angular.copy($filter("filter")(result, { groupType: "programAdmissionType" }));
                            appServ.table.dataSource["cooperationType"] = angular.copy($filter("filter")(result, { groupType: "cooperationType" }));
                            appServ.table.dataSource["cooperationPattern"] = angular.copy($filter("filter")(result, { groupType: "cooperationPattern" }));
                            appServ.table.dataSource["graduateType"] = angular.copy($filter("filter")(result, { groupType: "graduateType" }));
                            appServ.table.dataSource["courseManagement"] = angular.copy($filter("filter")(result, { groupType: "courseManagement" }));
                            appServ.table.dataSource["externalSituation"] = angular.copy($filter("filter")(result, { groupType: "externalSituation" }));
                            appServ.table.dataSource["impactCurriculum"] = angular.copy($filter("filter")(result, { groupType: "impactCurriculum" }));
                            appServ.table.dataSource["refOtherCourses"] = angular.copy($filter("filter")(result, { groupType: "refOtherCourses" }));

                            countryServ.getDataSource({
                                action: "getlist",
                                params: [
                                    "",
                                    "cancelledStatus=N",
                                    "sortOrderBy=Full Name ( EN )"
                                ].join("&")
                            }).then(function (result) {
                                appServ.table.dataSource["country"] = angular.copy(result);

                                approvedStatusServ.getDataSource({
                                    action: "getlist",
                                    params: [
                                        "",
                                        ("curYear=" + utilServ.curYear.TH)
                                    ].join("&")
                                }).then(function (result) {
                                    appServ.table.dataSource["approvedStatus"] = angular.copy($filter("filter")(result, { groupStatus: "COURSES" }));

                                    careerServ.getDataSource({
                                        action: "getlist"
                                    }).then(function (result) {
                                        appServ.table.dataSource["career"] = angular.copy(result.dataSource);
                                        appServ.table.autocomplete["career"] = angular.copy(result.autocomplete);

                                        coursePositionServ.getDataSource({
                                            action: "getlist",
                                            params: [
                                                "",
                                                "group=Program"
                                            ].join("&")
                                        }).then(function (result) {
                                            appServ.table.dataSource["coursePosition"] = angular.copy(result);

                                            placeStudyServ.getDataSource({
                                                action: "getlist"
                                            }).then(function (result) {
                                                appServ.table.dataSource["placeStudy"] = angular.copy(result.dataSource);
                                                appServ.table.autocomplete["placeStudy"] = angular.copy(result.autocomplete);

                                                facultyServ.getDataSource({
                                                    action: "getlist"
                                                }).then(function (result) {
                                                    appServ.table.dataSource["faculty"] = angular.copy(result);

                                                    $timeout(function () {
                                                        deferred.resolve();
                                                    }, 0);
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });

                return deferred.promise;
            },
            resetValue: function () {
                if (this.isAdd || this.isEdit || this.isUpdate)
                {                    
                    angular.forEach(utilServ.getArrayNumber(self.maxSection), function (item) {
                        self.addedit["section" + item].resetValue();
                        self.accordionGroup["section" + item].isOpen = false;
                    });
                }
            },
            getValue: function () {
                var result = {
                    tableType: (programmeServ.dataRow.tableType ? programmeServ.dataRow.tableType : "temp"),
                    id: (programmeServ.dataRow.id ? programmeServ.dataRow.id : ""),
                    facultyId: facultyServ.facultyInfo.id,
                    programId: (programmeServ.dataRow.programId ? programmeServ.dataRow.programId : ""),
                    majorId: (programmeServ.dataRow.majorId ? programmeServ.dataRow.majorId : ""),
                    majorCode: (programmeServ.dataRow.majorCode ? programmeServ.dataRow.majorCode : ""),
                    groupNum: (programmeServ.dataRow.groupNum ? programmeServ.dataRow.groupNum : ""),
                    abbrevTh: (programmeServ.dataRow.abbrev ? programmeServ.dataRow.abbrev.TH : ""),
                    abbrevEn: (programmeServ.dataRow.abbrev ? programmeServ.dataRow.abbrev.EN : "")                
                };
                
                angular.forEach(utilServ.getArrayNumber(self.maxSection), function (item) {
                    angular.extend(result, self.addedit["section" + item].saveChange.value);
                });

                return result;
            },
            add: {
                init: function () {
                    self.addedit.init();
                },
                setValue: function () {
                    self.addedit.isAdd = true;
                    self.addedit.isEdit = false;
                    self.addedit.isUpdate = false;
                    self.addedit.isDelete = false;
                }
            },
            edit: {
                init: function () {
                    self.addedit.init();
                },
                setValue: function () {
                    self.addedit.isAdd = false;
                    self.addedit.isEdit = true;
                    self.addedit.isUpdate = false;
                    self.addedit.isDelete = false;
                }
            },
            update: {
                init: function () {
                    self.addedit.init();
                },
                setValue: function () {
                    self.addedit.isAdd = false;
                    self.addedit.isEdit = false;
                    self.addedit.isUpdate = true;
                    self.addedit.isDelete = false;
                }
            },
            saveChange: {
                value: {},
                validate: function () {
                    var i = 0;

                    if (self.addedit.isAdd || self.addedit.isEdit || self.addedit.isUpdate)
                    {
                        if (!self.addedit.section1.saveChange.validate()) { self.accordionGroup.section1.isOpen = true; i++; }
                        if (!self.addedit.section2.saveChange.validate()) { self.accordionGroup.section2.isOpen = true; i++; }
                        if (!self.addedit.section7.saveChange.validate()) { self.accordionGroup.section7.isOpen = true; i++; }
                    }

                    return (i > 0 ? false : true);
                },
                action: function () {
                    angular.forEach(utilServ.getArrayNumber(self.maxSection), function (item) {
                        self.addedit["section" + item].saveChange.action();
                    });

                    this.value = angular.copy(self.addedit.getValue());

                    if (this.validate())
                    {
                        var action;

                        if (self.addedit.isAdd)     action = "add";
                        if (self.addedit.isEdit)    action = "edit";
                        if (self.addedit.isUpdate)  action = "update";
                        if (self.addedit.isDelete)  action = "remove";

                        programmeServ.saveChange.action({
                            action: action,
                            data: self.addedit.getValue()
                        }).then(function (result) {
                            if (result.status)
                            {
                                if (result.mode === "add") 
                                {
                                    self.addedit.isAdd = true;
                                    self.addedit.isEdit = false;
                                    self.addedit.isUpdate = false;
                                    self.addedit.isDelete = false;
                                }

                                if (self.addedit.isAdd)
                                    $location.path("/TQFInfo/TQF2/" + (result.action === "add" ? "edit" : result.action) + "/temp/" + result.id).replace();

                                if (self.addedit.isEdit || self.addedit.isUpdate)
                                {
                                    var action = self.addedit.template.action;

                                    placeStudyServ.getDataSource({
                                        action: "getlist"
                                    }).then(function (result) {
                                        appServ.table.dataSource["placeStudy"] = angular.copy(result.dataSource);
                                        appServ.table.autocomplete["placeStudy"] = angular.copy(result.autocomplete);

                                        programmeServ.getDataSourceOnGroup(1).then(function () {
                                            self.addedit[action].setValue();

                                            if (self.addedit.isEdit || self.addedit.isUpdate)
                                            {
                                                dictServ.dict.menuTmp = {
                                                    TH: programmeServ.dataRow.programFullCode,
                                                    EN: programmeServ.dataRow.programFullCode
                                                };
                                            }

                                            angular.forEach(utilServ.getArrayNumber(self.maxSection), function (item) {
                                                self.addedit["section" + item].isFormChanged = false;
                                            });
                                            self.addedit.isFormChanged = false;
                                            self.addedit.resetValue();
                                        });
                                    });
                                }
                            }
                        });
                    }
                    else
                    {
                        utilServ.gotoTopPage();
                        utilServ.dialogErrorWithDict(["save", "error"], function () { });
                    }
                }
            },
            section1: {
                owner: (self.owner + "s1"),
                formField: {
                    code: "",
                    name: {
                        TH: "",
                        EN: ""
                    }
                },
                formValue: {
                    code: "",
                    name: {
                        TH: "",
                        EN: ""
                    }
                },
                formValidate: {
                    setValue: function () {
                        this.resetValue();
                    },
                    resetValue: function () {
                        this.showSaveError = false;
                        this.isValid = {
                            code: true,
                            name: {
                                TH: true,
                                EN: true
                            }
                        };
                    }
                },
                watchFormChange: function () {
                    $timeout(function () {
                        $scope.$watch(function () {
                            var watch = [];

                            watch.push(self.addedit.section1.formField.code);
                            watch.push(self.addedit.section1.formField.name.TH);
                            watch.push(self.addedit.section1.formField.name.EN);

                            return watch;
                        }, function () {
                            var exit = false;

                            if (!exit)
                            {
                                if ((self.addedit.section1.formField.code !== self.addedit.section1.formValue.code) ||
                                    (self.addedit.section1.formField.name.TH !== self.addedit.section1.formValue.name.TH) ||
                                    (self.addedit.section1.formField.name.EN !== self.addedit.section1.formValue.name.EN))
                                    exit = true;
                            }

                            self.addedit.section1.isFormChanged = exit;
                            self.addedit.section1.formValidate.resetValue();
                        }, true);
                    }, 0);
                },
                setValue: function () {
                    this.isFormChanged = false;

                    this.formValidate.setValue();
                },
                resetValue: function () {
                    this.formValue.code = (programmeServ.dataRow.programCode ? programmeServ.dataRow.programCode : "");
                    this.formField.code = this.formValue.code;

                    this.formValue.name.TH = (programmeServ.dataRow.name ? programmeServ.dataRow.name.TH : "");
                    this.formField.name.TH = this.formValue.name.TH;

                    this.formValue.name.EN = (programmeServ.dataRow.name ? programmeServ.dataRow.name.EN : "");
                    this.formField.name.EN = this.formValue.name.EN;

                    this.formValidate.resetValue();
                },
                getValue: function () {
                    var result = {
                        programCode: (this.formField.code ? this.formField.code : ""),
                        nameTh: (this.formField.name.TH ? this.formField.name.TH : ""),
                        nameEn: (this.formField.name.EN ? this.formField.name.EN : "")
                    };

                    return result;
                },
                saveChange: {
                    value: {},
                    validate: function () {
                        var i = 0;

                        if (self.addedit.isAdd || self.addedit.isEdit)
                        {
                            if (this.value.programCode.length !== 5) { self.addedit.section1.formValidate.isValid.code = false; i++; }
                            if (!this.value.nameTh) { self.addedit.section1.formValidate.isValid.name.TH = false; i++; }
                            if (!this.value.nameEn) { self.addedit.section1.formValidate.isValid.name.EN = false; i++; }
                        }

                        self.addedit.section1.formValidate.showSaveError = (i > 0 ? true : false);

                        return (i > 0 ? false : true);
                    },
                    action: function () {
                        this.value = angular.copy(self.addedit.section1.getValue());
                    }
                }
            },
            section2: {
                owner: (self.owner + "s2"),
                formField: {
                    degreeName: {
                        TH: "",
                        EN: ""
                    },
                    degreeAbbrev: {
                        TH: "",
                        EN: ""
                    }
                },
                formValue: {
                    degreeName: {
                        TH: "",
                        EN: ""
                    },
                    degreeAbbrev: {
                        TH: "",
                        EN: ""
                    }
                },
                formValidate: {
                    setValue: function () {
                        this.resetValue();
                    },
                    resetValue: function () {
                        this.showSaveError = false;
                        this.isValid = {
                            degreeName: {
                                TH: true,
                                EN: true
                            },
                            degreeAbbrev: {
                                TH: true,
                                EN: true
                            }
                        };
                    }
                },
                watchFormChange: function () {
                    var iscedObj = self.isced.owner[this.owner];
                    var iscedData = "";

                    $timeout(function () {
                        $scope.$watch(function () {
                            var watch = [];                            

                            watch.push(self.addedit.section2.formField.degreeName.TH);
                            watch.push(self.addedit.section2.formField.degreeName.EN);
                            watch.push(self.addedit.section2.formField.degreeAbbrev.TH);
                            watch.push(self.addedit.section2.formField.degreeAbbrev.EN);

                            iscedData = appServ.getDataOnJoinArray(iscedObj.table.data, ["id"]);
                            watch.push(iscedData);

                            return watch;
                        }, function () {
                            var exit = false;

                            if (!exit)
                            {
                                if ((self.addedit.section2.formField.degreeName.TH !== self.addedit.section2.formValue.degreeName.TH) ||
                                    (self.addedit.section2.formField.degreeName.EN !== self.addedit.section2.formValue.degreeName.EN) ||
                                    (self.addedit.section2.formField.degreeAbbrev.TH !== self.addedit.section2.formValue.degreeAbbrev.TH) ||
                                    (self.addedit.section2.formField.degreeAbbrev.EN !== self.addedit.section2.formValue.degreeAbbrev.EN) ||
                                    (iscedData !== iscedObj.addedit.formValue.iscedData))
                                    exit = true;
                            }

                            self.addedit.section2.isFormChanged = exit;
                            self.addedit.section2.formValidate.resetValue();
                        }, true);
                    }, 0);
                },
                setValue: function () {
                    this.isFormChanged = false;

                    this.formValidate.setValue();
                },
                resetValue: function () {
                    var iscedObj = self.isced.owner[this.owner];

                    this.formValue.degreeName.TH = (programmeServ.dataRow.degreeName ? programmeServ.dataRow.degreeName.TH : "");
                    this.formField.degreeName.TH = this.formValue.degreeName.TH;

                    this.formValue.degreeName.EN = (programmeServ.dataRow.degreeName ? programmeServ.dataRow.degreeName.EN : "");
                    this.formField.degreeName.EN = this.formValue.degreeName.EN;

                    this.formValue.degreeAbbrev.TH = (programmeServ.dataRow.degreeAbbrev ? programmeServ.dataRow.degreeAbbrev.TH : "");
                    this.formField.degreeAbbrev.TH = this.formValue.degreeAbbrev.TH;

                    this.formValue.degreeAbbrev.EN = (programmeServ.dataRow.degreeAbbrev ? programmeServ.dataRow.degreeAbbrev.EN : "");
                    this.formField.degreeAbbrev.EN = this.formValue.degreeAbbrev.EN;

                    iscedObj.table.reload.getData(this.owner, programmeServ.dataRow.xmlISCED);

                    this.formValidate.resetValue();
                },
                getValue: function () {
                    var iscedObj = self.isced.owner[this.owner];
                    var result = {
                        degreeNameTh: (this.formField.degreeName.TH ? this.formField.degreeName.TH : ""),
                        degreeNameEn: (this.formField.degreeName.EN ? this.formField.degreeName.EN : ""),
                        degreeAbbrevTh: (this.formField.degreeAbbrev.TH ? this.formField.degreeAbbrev.TH : ""),
                        degreeAbbrevEn: (this.formField.degreeAbbrev.EN ? this.formField.degreeAbbrev.EN : ""),
                        xmlISCED: iscedObj.addedit.getValue(this.owner)
                    };

                    return result;
                },
                saveChange: {
                    value: {},
                    validate: function () {
                        var i = 0;

                        if (self.addedit.isAdd || self.addedit.isEdit)
                        {
                            if (!this.value.degreeNameTh) { self.addedit.section2.formValidate.isValid.degreeName.TH = false; i++; }
                            if (!this.value.degreeNameEn) { self.addedit.section2.formValidate.isValid.degreeName.EN = false; i++; }
                            if (!this.value.degreeAbbrevTh) { self.addedit.section2.formValidate.isValid.degreeAbbrev.TH = false; i++; }
                            if (!this.value.degreeAbbrevEn) { self.addedit.section2.formValidate.isValid.degreeAbbrev.EN = false; i++; }
                        }

                        self.addedit.section2.formValidate.showSaveError = (i > 0 ? true : false);

                        return (i > 0 ? false : true);
                    },
                    action: function () {
                        this.value = angular.copy(self.addedit.section2.getValue());
                    }
                }
            },
            section3: {
                owner: (self.owner + "s3"),
                formField: {
                },
                formValue: {                    
                },
                formValidate: {
                    setValue: function () {
                        this.resetValue();
                    },
                    resetValue: function () {
                        this.showSaveError = false;
                        this.isValid = {};
                    }
                },
                watchFormChange: function () {
                    var majorSubjectObj = self.majorSubject.owner[this.owner];
                    var subjectData = "";

                    $timeout(function () {
                        $scope.$watch(function () {
                            var watch = [];

                            subjectData = appServ.getDataOnJoinArray(majorSubjectObj.table.data, ["id"]);
                            watch.push(subjectData);

                            return watch;
                        }, function () {
                            var exit = false;

                            if (!exit)
                            {
                                if (subjectData !== majorSubjectObj.addedit.formValue.subjectData)
                                    exit = true;
                            }

                            self.addedit.section3.isFormChanged = exit;
                            self.addedit.section3.formValidate.resetValue();
                        }, true);
                    }, 0);
                },
                setValue: function () {
                    this.isFormChanged = false;

                    this.formValidate.setValue();
                },
                resetValue: function () {
                    var majorSubjectObj = self.majorSubject.owner[this.owner];

                    majorSubjectObj.table.reload.getData(this.owner, programmeServ.dataRow.xmlMajorSubject);

                    this.formValidate.resetValue();
                },
                getValue: function () {
                    var majorSubjectObj = self.majorSubject.owner[this.owner];
                    var result = {
                        xmlMajorSubject: majorSubjectObj.addedit.getValue(this.owner)
                    };

                    return result;
                },
                saveChange: {
                    value: {},
                    validate: function () {
                        var i = 0;

                        return (i > 0 ? false : true);
                    },
                    action: function () {
                        this.value = angular.copy(self.addedit.section3.getValue());
                    }
                }
            },
            section4: {
                owner: (self.owner + "s4"),
                formField: {
                    courseCredit: ""
                },
                formValue: {
                    courseCredit: ""
                },
                formValidate: {
                    setValue: function () {
                        this.resetValue();
                    },
                    resetValue: function () {
                        this.showSaveError = false;
                        this.isValid = {};
                    }
                },
                watchFormChange: function () {
                    $timeout(function () {
                        $scope.$watch(function () {
                            var watch = [];

                            watch.push(self.addedit.section4.formField.courseCredit);

                            return watch;
                        }, function () {
                            var exit = false;

                            if (!exit)
                            {
                                if (self.addedit.section4.formField.courseCredit !== self.addedit.section4.formValue.courseCredit)
                                    exit = true;
                            }

                            self.addedit.section4.isFormChanged = exit;
                            self.addedit.section4.formValidate.resetValue();
                        }, true);
                    }, 0);
                },
                setValue: function () {
                    this.isFormChanged = false;

                    this.formValidate.setValue();
                },
                resetValue: function () {
                    this.formValue.courseCredit = (programmeServ.dataRow.courseCredit ? programmeServ.dataRow.courseCredit : "");
                    this.formField.courseCredit = this.formValue.courseCredit;

                    this.formValidate.resetValue();
                },
                getValue: function () {
                    var result = {
                        courseCredit: (this.formField.courseCredit ? this.formField.courseCredit : "")
                    };

                    return result;
                },
                saveChange: {
                    value: {},
                    validate: function () {
                        var i = 0;

                        return (i > 0 ? false : true);
                    },
                    action: function () {
                        this.value = angular.copy(self.addedit.section4.getValue());
                    }
                }
            },
            section5: {
                owner: (self.owner + "s5"),
                formField: {
                    programModel: {
                        TH: "",
                        EN: ""
                    },
                    programType: {
                        TH: "",
                        EN: ""
                    },
                    language: [],
                    languageSelected: {},
                    languageSelectedLast: {},
                    languageRemark: {},                    
                    admissionType: [],
                    admissionTypeSelected: {},
                    admissionTypeSelectedLast: {},
                    admissionTypeRemark: {},
                    cooperationType: [],
                    cooperationTypeSelected: {},
                    cooperationTypeSelectedLast: {},
                    cooperationTypeRemark: {},
                    graduateType: [],
                    graduateTypeSelected: {},
                    graduateTypeSelectedLast: {},
                    graduateTypeRemark: {},
                    courseManagement: [],
                    courseManagementSelected: {},
                    courseManagementSelectedLast: {},
                    courseManagementRemark: {}
                },
                formValue: {
                    programModel: {
                        TH: "",
                        EN: ""
                    },
                    programType: {
                        TH: "",
                        EN: ""
                    },
                    language: [],
                    languageData: "",
                    admissionType: [],
                    admissionTypeData: "",
                    cooperationType: [],
                    cooperationTypeData: "",
                    graduateType: [],
                    graduateTypeData: "",
                    courseManagement: [],
                    courseManagementData: ""
                },
                formValidate: {
                    setValue: function () {
                        this.resetValue();
                    },
                    resetValue: function () {
                        this.showSaveError = false;
                        this.isValid = {};
                    }
                },
                watchFormChange: function () { 
                    var languageData = "";
                    var admissionTypeData = "";
                    var cooperationTypeData = "";
                    var instituteData = {};
                    var cooperationPatternData = {};
                    var graduateTypeData = "";
                    var courseManagementData = "";

                    $timeout(function () {
                        $scope.$watch(function () {
                            var watch = [];
                            var instituteObj = {};
                            var cooperationPatternObj = {};                            
                            
                            watch.push(self.addedit.section5.formField.programModel.TH);
                            watch.push(self.addedit.section5.formField.programModel.EN);
                            watch.push(self.addedit.section5.formField.programType.TH);
                            watch.push(self.addedit.section5.formField.programType.EN);
                            
                            languageData = appServ.getDataOnJoinArray(self.addedit.section5.formField.language, ["id"]);
                            watch.push(languageData);

                            admissionTypeData = appServ.getDataOnJoinArray(self.addedit.section5.formField.admissionType, ["id"]);
                            watch.push(admissionTypeData);

                            cooperationTypeData = appServ.getDataOnJoinArray(self.addedit.section5.formField.cooperationType, ["id"]);
                            watch.push(cooperationTypeData);
                            
                            angular.forEach(self.addedit.section5.cooperationType, function (item) {
                                instituteObj = self.institute.owner[self.addedit.section5.owner + item];
                                cooperationPatternObj = self.cooperationPattern.owner[self.addedit.section5.owner + item];
                                
                                instituteData[item] = appServ.getDataOnJoinArray(instituteObj.table.data, ["id"]);                                
                                watch.push(instituteData[item]);

                                cooperationPatternData[item] = appServ.getDataOnJoinArray(cooperationPatternObj.addedit.formField.cooperationPattern, ["id"]);
                                watch.push(cooperationPatternData[item]);
                            });                            

                            graduateTypeData = appServ.getDataOnJoinArray(self.addedit.section5.formField.graduateType, ["id"]);
                            watch.push(graduateTypeData);

                            courseManagementData = appServ.getDataOnJoinArray(self.addedit.section5.formField.courseManagement, ["id"]);
                            watch.push(courseManagementData);

                            return watch;
                        }, function () {
                            var exit = false;
                            var instituteObj = {};
                            var cooperationPatternObj = {};

                            if (!exit)
                            {
                                if ((self.addedit.section5.formField.programModel.TH !== self.addedit.section5.formValue.programModel.TH) ||
                                    (self.addedit.section5.formField.programModel.EN !== self.addedit.section5.formValue.programModel.EN) ||
                                    (self.addedit.section5.formField.programType.TH !== self.addedit.section5.formValue.programType.TH) ||
                                    (self.addedit.section5.formField.programType.EN !== self.addedit.section5.formValue.programType.EN) ||
                                    (languageData !== self.addedit.section5.formValue.languageData) ||
                                    (admissionTypeData !== self.addedit.section5.formValue.admissionTypeData) ||
                                    (cooperationTypeData !== self.addedit.section5.formValue.cooperationTypeData) ||
                                    (graduateTypeData !== self.addedit.section5.formValue.graduateTypeData) ||
                                    (courseManagementData !== self.addedit.section5.formValue.courseManagementData))
                                    exit = true;
                            }

                            if (!exit)
                            {
                                angular.forEach(self.addedit.section5.cooperationType, function (item) {
                                    instituteObj = self.institute.owner[self.addedit.section5.owner + item];
                                    cooperationPatternObj = self.cooperationPattern.owner[self.addedit.section5.owner + item];

                                    if ((instituteData[item] !== instituteObj.addedit.formValue.instituteData) ||
                                        (cooperationPatternData[item] !== cooperationPatternObj.addedit.formValue.cooperationPatternData))
                                    {
                                        exit = true;
                                        return;
                                    }
                                });
                            }
                            
                            self.addedit.section5.isFormChanged = exit;
                            self.addedit.section5.formValidate.resetValue();
                        }, true);
                    }, 0);
                },
                setValue: function () {
                    this.isFormChanged = false;
                    this.isCheckedLanguage = {};
                    this.isCheckedAdmissionType = {};
                    this.isCheckedCooperationType = {};                    
                    this.isCheckedGraduateType = {};
                    this.isCheckedCourseManagement = {};
                    this.cooperationType = [];

                    angular.forEach(appServ.table.dataSource.cooperationType, function (item) {
                        if (self.cooperationType[item.code]) self.addedit.section5.cooperationType.push(item.code);
                    });

                    this.formValidate.setValue();
                },
                resetValue: function () {
                    var instituteObj = {};
                    var cooperationPatternObj = {};

                    this.formValue.programModel.TH = (programmeServ.dataRow.xmlProgramType && programmeServ.dataRow.xmlProgramType.programModel ? programmeServ.dataRow.xmlProgramType.programModel.TH : "");
                    this.formField.programModel.TH = this.formValue.programModel.TH;

                    this.formValue.programModel.EN = (programmeServ.dataRow.xmlProgramType && programmeServ.dataRow.xmlProgramType.programModel ? programmeServ.dataRow.xmlProgramType.programModel.EN : "");
                    this.formField.programModel.EN = this.formValue.programModel.EN;

                    this.formValue.programType.TH = (programmeServ.dataRow.xmlProgramType && programmeServ.dataRow.xmlProgramType.programType ? programmeServ.dataRow.xmlProgramType.programType.TH : "");
                    this.formField.programType.TH = this.formValue.programType.TH;

                    this.formValue.programType.EN = (programmeServ.dataRow.xmlProgramType && programmeServ.dataRow.xmlProgramType.programType ? programmeServ.dataRow.xmlProgramType.programType.EN : "");
                    this.formField.programType.EN = this.formValue.programType.EN;

                    this.formValue.language = [];
                    this.formValue.languageData = "";
                    angular.copy(this.formValue.language, this.formField.language);
                    TQFServ.inputTypeRemark.uncheck(appServ.table.dataSource.language, "language", this.formField, this.isCheckedLanguage);
                    TQFServ.inputTypeRemark.check(programmeServ.dataRow.xmlLanguages, appServ.table.dataSource.language, "language", this.formField, this.formValue, this.isCheckedLanguage);

                    this.formValue.admissionType = [];
                    this.formValue.admissionTypeData = "";
                    angular.copy(this.formValue.admissionType, this.formField.admissionType);
                    TQFServ.inputTypeRemark.uncheck(appServ.table.dataSource.admissionType, "admissionType", this.formField, this.isCheckedAdmissionType);
                    TQFServ.inputTypeRemark.check(programmeServ.dataRow.xmlAdmissionType, appServ.table.dataSource.admissionType, "admissionType", this.formField, this.formValue, this.isCheckedAdmissionType);

                    this.formValue.cooperationType = [];
                    this.formValue.cooperationTypeData = "";
                    angular.copy(this.formValue.cooperationType, this.formField.cooperationType);
                    self.cooperationType.uncheck(this.owner, "cooperationType", this.formField);
                    TQFServ.inputTypeRemark.uncheck(appServ.table.dataSource.cooperationType, "cooperationType", this.formField, this.isCheckedCooperationType);                    
                    if (programmeServ.dataRow.xmlCooperationType)
                    {
                        angular.forEach(programmeServ.dataRow.xmlCooperationType, function (item1) {
                            angular.forEach($filter("filter")(appServ.table.dataSource.cooperationType, { id: item1.id }), function (item2) {
                                self.cooperationType.setSelected(self.addedit.section5.owner, item2, "cooperationType", self.addedit.section5.formField);
                                if (programmeServ.dataRow.xmlCooperationInitute)
                                {
                                    if (programmeServ.dataRow.xmlCooperationInitute.cooperationTypeCode === item2.code)
                                    {
                                        instituteObj = self.institute.owner[self.addedit.section5.owner + programmeServ.dataRow.xmlCooperationInitute.cooperationTypeCode];

                                        instituteObj.table.reload.getData((self.addedit.section5.owner + programmeServ.dataRow.xmlCooperationInitute.cooperationTypeCode), programmeServ.dataRow.xmlCooperationInitute.xmlInstitute);
                                    }
                                }
                                if (programmeServ.dataRow.xmlCooperationPattern)
                                {
                                    if (programmeServ.dataRow.xmlCooperationPattern.cooperationTypeCode === item2.code)
                                    {
                                        cooperationPatternObj = self.cooperationPattern.owner[self.addedit.section5.owner + programmeServ.dataRow.xmlCooperationPattern.cooperationTypeCode];

                                        cooperationPatternObj.addedit.resetValue((self.addedit.section5.owner + programmeServ.dataRow.xmlCooperationPattern.cooperationTypeCode), programmeServ.dataRow.xmlCooperationPattern.xmlCooperationPattern);
                                    }
                                }
                            });
                        });
                    }
                    TQFServ.inputTypeRemark.check(programmeServ.dataRow.xmlCooperationType, appServ.table.dataSource.cooperationType, "cooperationType", this.formField, this.formValue, this.isCheckedCooperationType);

                    this.formValue.graduateType = [];
                    this.formValue.graduateTypeData = "";
                    angular.copy(this.formValue.graduateType, this.formField.graduateType);
                    TQFServ.inputTypeRemark.uncheck(appServ.table.dataSource.graduateType, "graduateType", this.formField, this.isCheckedGraduateType);
                    TQFServ.inputTypeRemark.check(programmeServ.dataRow.xmlGraduateType, appServ.table.dataSource.graduateType, "graduateType", this.formField, this.formValue, this.isCheckedGraduateType);

                    this.formValue.courseManagement = [];
                    this.formValue.courseManagementData = "";
                    angular.copy(this.formValue.courseManagement, this.formField.courseManagement);
                    TQFServ.inputTypeRemark.uncheck(appServ.table.dataSource.courseManagement, "courseManagement", this.formField, this.isCheckedCourseManagement);
                    TQFServ.inputTypeRemark.check(programmeServ.dataRow.xmlCourseManagement, appServ.table.dataSource.courseManagement, "courseManagement", this.formField, this.formValue, this.isCheckedCourseManagement);

                    this.formValidate.resetValue();
                },
                getValue: function () {
                    var xmlProgramType = "";

                    if (this.formField.programModel.TH ||
                        this.formField.programModel.EN ||
                        this.formField.programType.TH ||
                        this.formField.programType.EN)
                    {
                        xmlProgramType = (
                            "<row>" +
                            "<programModelTH>" + this.formField.programModel.TH + "</programModelTH>" +
                            "<programModelEN>" + this.formField.programModel.EN + "</programModelEN>" +
                            "<programTypeTH>" + this.formField.programType.TH + "</programTypeTH>" +
                            "<programTypeEN>" + this.formField.programType.EN + "</programTypeEN>" +
                            "</row>"
                        );
                    }

                    var xmlLanguages = TQFServ.inputTypeRemark.getValue("language", this.formField.language, this.formField);
                    var xmlAdmissionType = TQFServ.inputTypeRemark.getValue("admissionType", this.formField.admissionType, this.formField);
                    var xmlCooperationType = TQFServ.inputTypeRemark.getValue("cooperationType", this.formField.cooperationType, this.formField);
                    var instituteObj = {};
                    var cooperationPatternObj = {};
                    var xmlInstitute = "";
                    var xmlCooperationInitute = "";
                    var xmlCooperationPattern = "";
                    var xmlCooperationPatterns = "";
                    var xmlGraduateType = TQFServ.inputTypeRemark.getValue("graduateType", this.formField.graduateType, this.formField);
                    var xmlCourseManagement = TQFServ.inputTypeRemark.getValue("courseManagement", this.formField.courseManagement, this.formField);

                    angular.forEach(this.formField.cooperationType, function (item) {
                        instituteObj = self.institute.owner[self.addedit.section5.owner + item.code];
                        cooperationPatternObj = self.cooperationPattern.owner[self.addedit.section5.owner + item.code];

                        if (instituteObj)
                        {
                            xmlInstitute = instituteObj.addedit.getValue(self.addedit.section5.owner + item.code);
                            if (xmlInstitute)
                            {
                                xmlCooperationInitute += (
                                    "<row>" +
                                    "<cooperationTypeCode>" + item.code + "</cooperationTypeCode>" +
                                    "<xmlInstitute>" + xmlInstitute + "</xmlInstitute>" +
                                    "</row>"
                                );
                            }
                        }

                        if (cooperationPatternObj)
                        {
                            xmlCooperationPattern = TQFServ.inputTypeRemark.getValue("cooperationPattern", cooperationPatternObj.addedit.formField.cooperationPattern, cooperationPatternObj.addedit.formField);
                            if (xmlCooperationPattern)
                            {
                                xmlCooperationPatterns += (
                                    "<row>" +
                                    "<cooperationTypeCode>" + item.code + "</cooperationTypeCode>" +
                                    "<xmlCooperationPattern>" + xmlCooperationPattern + "</xmlCooperationPattern>" +
                                    "</row>"
                                );
                            }
                        }
                    });
                   
                    var result = {
                        xmlProgramType: xmlProgramType,
                        xmlLanguages: xmlLanguages,
                        xmlAdmissionType: xmlAdmissionType,
                        xmlCooperationType: xmlCooperationType,
                        xmlCooperationInitute: xmlCooperationInitute,
                        xmlCooperationPattern: xmlCooperationPatterns,
                        xmlGraduateType: xmlGraduateType,
                        xmlCourseManagement: xmlCourseManagement
                    };

                    return result;
                },
                saveChange: {
                    value: {},
                    validate: function () {
                        var i = 0;

                        return (i > 0 ? false : true);
                    },
                    action: function () {
                        this.value = angular.copy(self.addedit.section5.getValue());
                    }
                }
            },
            section6: {
                owner: (self.owner + "s6"),
                formField: {
                    courseYearSelected: {},
                    prevCourseYearSelected: {},
                    startSemesterSelected: {},
                    startAcaYearSelected: {},
                    approvedOrdinal: {
                        time: {},
                        year: {}
                    }                    
                },
                formValue: {
                    courseYearSelected: {},
                    prevCourseYearSelected: {},
                    startSemesterSelected: {},
                    startAcaYearSelected: {},
                    approvedOrdinal: {
                        time: {},
                        year: {}
                    },
                    approvedDate: {}
                },
                formValidate: {
                    setValue: function () {
                        this.resetValue();
                    },
                    resetValue: function () {
                        this.showSaveError = false;
                        this.isValid = {};
                    }
                },
                watchFormChange: function () { 
                    $timeout(function () {
                        $scope.$watch(function () {
                            var watch = [];

                            watch.push(self.addedit.section6.formField.courseYearSelected.selected);
                            watch.push(self.addedit.section6.formField.prevCourseYearSelected.selected);
                            watch.push(self.addedit.section6.formField.startSemesterSelected.selected);
                            watch.push(self.addedit.section6.formField.startAcaYearSelected.selected);

                            angular.forEach(self.addedit.section6.approvedOrdinal, function (item) {
                                watch.push(self.addedit.section6.formField.approvedOrdinal.time[item]);
                                watch.push(self.addedit.section6.formField.approvedOrdinal.year[item]);
                            });

                            angular.forEach(self.addedit.section6.approvedDate, function (item) {
                                watch.push($scope.datepicker.owner[item].date);
                            });

                            return watch;
                        }, function () {
                            var exit = false;

                            if (!exit)
                            {
                                if ((self.addedit.section6.formField.courseYearSelected.selected !== self.addedit.section6.formValue.courseYearSelected.selected) ||
                                    (self.addedit.section6.formField.prevCourseYearSelected.selected !== self.addedit.section6.formValue.prevCourseYearSelected.selected) ||
                                    (self.addedit.section6.formField.startSemesterSelected.selected !== self.addedit.section6.formValue.startSemesterSelected.selected) ||
                                    (self.addedit.section6.formField.startAcaYearSelected.selected !== self.addedit.section6.formValue.startAcaYearSelected.selected))
                                    exit = true;
                            }

                            if (!exit)
                            {
                                angular.forEach(self.addedit.section6.approvedOrdinal, function (item) {
                                    if ((self.addedit.section6.formField.approvedOrdinal.time[item] !== self.addedit.section6.formValue.approvedOrdinal.time[item]) ||
                                        (self.addedit.section6.formField.approvedOrdinal.year[item] !== self.addedit.section6.formValue.approvedOrdinal.year[item]))
                                    {
                                        exit = true;
                                        return;
                                    }
                                });
                            }

                            if (!exit)
                            {
                                angular.forEach(self.addedit.section6.approvedDate, function (item) {
                                    if ($scope.datepicker.owner[item].date !== self.addedit.section6.formValue.approvedDate[item])
                                    {
                                        exit = true;
                                        return;
                                    }
                                });
                            }

                            self.addedit.section6.isFormChanged = exit;
                            self.addedit.section6.formValidate.resetValue();
                        }, true);
                    }, 0);
                },
                setValue: function () {
                    this.isFormChanged = false;
                    this.approvedOrdinal = [];
                    this.approvedDate = [];                    
                     
                    angular.forEach(appServ.table.dataSource.approvedStatus, function (item) {
                        if (item.isOrdinal === "Y") self.addedit.section6.approvedOrdinal.push(item.id);
                        if (item.isDate === "Y")    self.addedit.section6.approvedDate.push(item.id);
                    });
                    
                    this.formValidate.setValue();
                },
                resetValue: function () {
                    this.formValue.courseYearSelected.selected = (programmeServ.dataRow.xmlApprovedCourses && programmeServ.dataRow.xmlApprovedCourses.courseYear ? utilServ.getObjectByValue(appServ.yearList, "TH", programmeServ.dataRow.xmlApprovedCourses.courseYear)[0] : undefined);
                    this.formField.courseYearSelected.selected = this.formValue.courseYearSelected.selected;

                    this.formValue.prevCourseYearSelected.selected = (programmeServ.dataRow.xmlApprovedCourses && programmeServ.dataRow.xmlApprovedCourses.prevCourseYear ? utilServ.getObjectByValue(appServ.yearList, "TH", programmeServ.dataRow.xmlApprovedCourses.prevCourseYear)[0] : undefined);
                    this.formField.prevCourseYearSelected.selected = this.formValue.prevCourseYearSelected.selected;

                    this.formValue.startSemesterSelected.selected = (programmeServ.dataRow.xmlApprovedCourses && programmeServ.dataRow.xmlApprovedCourses.startSemester ? programmeServ.dataRow.xmlApprovedCourses.startSemester : undefined);
                    this.formField.startSemesterSelected.selected = this.formValue.startSemesterSelected.selected;
                    
                    this.formValue.startAcaYearSelected.selected = (programmeServ.dataRow.xmlApprovedCourses && programmeServ.dataRow.xmlApprovedCourses.startAcaYear ? utilServ.getObjectByValue(appServ.yearList, "TH", programmeServ.dataRow.xmlApprovedCourses.startAcaYear)[0] : undefined);
                    this.formField.startAcaYearSelected.selected = this.formValue.startAcaYearSelected.selected;                    
                    
                    angular.forEach(this.approvedOrdinal, function (item1) {
                        self.addedit.section6.formValue.approvedOrdinal.time[item1] = "";                        
                        self.addedit.section6.formValue.approvedOrdinal.year[item1] = "";                        
                        if (programmeServ.dataRow.xmlApprovedCourses)
                        {
                            angular.forEach($filter("filter")(programmeServ.dataRow.xmlApprovedCourses.xmlApprovedOrdinal, { approvedStatusId: item1 }), function (item2) {
                                if (item2.approvedStatusId === item1)
                                {
                                    self.addedit.section6.formValue.approvedOrdinal.time[item1] = item2.time;
                                    self.addedit.section6.formValue.approvedOrdinal.year[item1] = item2.year;
                                }
                            });
                        }
                        self.addedit.section6.formField.approvedOrdinal.time[item1] = self.addedit.section6.formValue.approvedOrdinal.time[item1];
                        self.addedit.section6.formField.approvedOrdinal.year[item1] = self.addedit.section6.formValue.approvedOrdinal.year[item1];
                    });
                    
                    angular.forEach(this.approvedDate, function (item1) {
                        $timeout(function () {
                            $("#" + self.addedit.section6.owner + "-approveddate-" + item1).data("DateTimePicker").clear();
                        }, 0);      
                        self.addedit.section6.formValue.approvedDate[item1] = "";                        
                        if (programmeServ.dataRow.xmlApprovedCourses)
                        {
                            angular.forEach($filter("filter")(programmeServ.dataRow.xmlApprovedCourses.xmlApprovedDate, { approvedStatusId: item1 }), function (item2) {
                                if (item2.approvedStatusId === item1)
                                    self.addedit.section6.formValue.approvedDate[item1] = item2.date;
                            });
                        }
                        if (self.addedit.section6.formValue.approvedDate[item1])
                        {
                            $timeout(function () {
                                $("#" + self.addedit.section6.owner + "-approveddate-" + item1).data("DateTimePicker").date(self.addedit.section6.formValue.approvedDate[item1]);
                            }, 0);
                        }
                        $scope.datepicker.owner[item1].date = self.addedit.section6.formValue.approvedDate[item1];
                    });                    

                    this.formValidate.resetValue();
                },
                getValue: function () {
                    var xmlApprovedCourses = "";
                    var xmlApprovedOrdinal = "";
                    var xmlApprovedDate = "";

                    angular.forEach(this.approvedOrdinal, function (item) {
                        //if (self.addedit.section6.formField.approvedOrdinal.time[item] &&
                        //    self.addedit.section6.formField.approvedOrdinal.year[item])
                        if (self.addedit.section6.formField.approvedOrdinal.time[item])
                        {
                            xmlApprovedOrdinal += (
                                "<row>" +
                                "<approvedStatusId>" + item + "</approvedStatusId>" +
                                "<time>" + self.addedit.section6.formField.approvedOrdinal.time[item] + "</time>" +
                                "<year>" + (self.addedit.section6.formField.approvedOrdinal.year[item] ? self.addedit.section6.formField.approvedOrdinal.year[item] : '') + "</year>" +
                                "</row>"
                            );
                        }
                    });

                    angular.forEach(this.approvedDate, function (item) {
                        if ($scope.datepicker.owner[item].date)
                        {
                            xmlApprovedDate += (
                                "<row>" +
                                "<approvedStatusId>" + item + "</approvedStatusId>" +
                                "<date>" + $scope.datepicker.owner[item].date + "</date>" +
                                "</row>"
                            );
                        }
                    });

                    if (this.formField.courseYearSelected.selected ||
                        this.formField.prevCourseYearSelected.selected ||
                        this.formField.startSemesterSelected.selected ||
                        this.formField.startAcaYearSelected.selected ||
                        xmlApprovedOrdinal ||
                        xmlApprovedDate)
                    {
                        xmlApprovedCourses = (
                            "<row>" +
                            "<courseYear>" + (this.formField.courseYearSelected.selected ? this.formField.courseYearSelected.selected.TH : "") + "</courseYear>" +
                            "<prevCourseYear>" + (this.formField.prevCourseYearSelected.selected ? this.formField.prevCourseYearSelected.selected.TH : "") + "</prevCourseYear>" +
                            "<startSemester>" + (this.formField.startSemesterSelected.selected ? this.formField.startSemesterSelected.selected : "") + "</startSemester>" +
                            "<startAcaYear>" + (this.formField.startAcaYearSelected.selected ? this.formField.startAcaYearSelected.selected.TH : "") + "</startAcaYear>" +
                            "<xmlApprovedOrdinal>" + xmlApprovedOrdinal + "</xmlApprovedOrdinal>" +
                            "<xmlApprovedDate>" + xmlApprovedDate + "</xmlApprovedDate>" +
                            "</row>"
                        );
                    }

                    var result = {
                        xmlApprovedCourses: xmlApprovedCourses
                    };

                    return result;
                },
                saveChange: {
                    value: {},
                    validate: function () {
                        var i = 0;

                        return (i > 0 ? false : true);
                    },
                    action: function () {
                        this.value = angular.copy(self.addedit.section6.getValue());
                    }
                }
            },
            section7: {
                owner: (self.owner + "s7"),
                formField: {
                    courseYearSelected: {}
                },
                formValue: {
                    courseYearSelected: {}
                },
                formValidate: {
                    setValue: function () {
                        this.resetValue();
                    },
                    resetValue: function () {
                        this.showSaveError = false;
                        this.isValid = {
                            courseYear: true
                        };
                    }
                },
                watchFormChange: function () { 
                    $timeout(function () {
                        $scope.$watch(function () {
                            var watch = [];

                            watch.push(self.addedit.section7.formField.courseYearSelected.selected);

                            return watch;
                        }, function () {
                            var exit = false;

                            if (!exit)
                            {
                                if (self.addedit.section7.formField.courseYearSelected.selected !== self.addedit.section7.formValue.courseYearSelected.selected)
                                    exit = true;
                            }

                            self.addedit.section7.isFormChanged = exit;
                            self.addedit.section7.formValidate.resetValue();
                        }, true);
                    }, 0);
                },
                setValue: function () {                    
                    this.isFormChanged = false;

                    this.formValidate.setValue();
                },
                resetValue: function () {
                    this.formValue.courseYearSelected.selected = (programmeServ.dataRow.courseYear ? utilServ.getObjectByValue(appServ.yearList, "TH", programmeServ.dataRow.courseYear)[0] : undefined);
                    this.formField.courseYearSelected.selected = this.formValue.courseYearSelected.selected;

                    this.formValidate.resetValue();
                },
                getValue: function () {
                    var result = {
                        courseYear: (this.formField.courseYearSelected.selected ? this.formField.courseYearSelected.selected.TH : "")
                    };

                    return result;
                },
                saveChange: {
                    value: {},
                    validate: function () {
                        var i = 0;

                        if (self.addedit.isAdd || self.addedit.isEdit)
                        {
                            if (!this.value.courseYear) { self.addedit.section7.formValidate.isValid.courseYear = false; i++; }
                        }

                        self.addedit.section7.formValidate.showSaveError = (i > 0 ? true : false);

                        return (i > 0 ? false : true);
                    },
                    action: function () {
                        this.value = angular.copy(self.addedit.section7.getValue());
                    }
                }
            },
            section8: {
                owner: (self.owner + "s8"),
                formField: {
                },
                formValue: {                    
                },
                formValidate: {
                    setValue: function () {
                        this.resetValue();
                    },
                    resetValue: function () {
                        this.showSaveError = false;
                        this.isValid = {};
                    }
                },
                watchFormChange: function () {
                    var careerObj = self.career.owner[this.owner];
                    var careerData = "";

                    $timeout(function () {
                        $scope.$watch(function () {
                            var watch = [];

                            careerData = appServ.getDataOnJoinArray(careerObj.table.data, ["id"]);
                            watch.push(careerData);

                            return watch;
                        }, function () {
                            var exit = false;

                            if (!exit)
                            {
                                if (careerData !== careerObj.addedit.formValue.careerData)
                                    exit = true;
                            }

                            self.addedit.section8.isFormChanged = exit;
                            self.addedit.section8.formValidate.resetValue();
                        }, true);
                    }, 0);
                },
                setValue: function () {
                    this.isFormChanged = false;

                    this.formValidate.setValue();
                },
                resetValue: function () {
                    var careerObj = self.career.owner[this.owner];

                    careerObj.table.reload.getData(this.owner, programmeServ.dataRow.xmlCareer);

                    this.formValidate.resetValue();                    
                },
                getValue: function () {
                    var careerObj = self.career.owner[this.owner];
                    var result = {
                        xmlCareer: careerObj.addedit.getValue(this.owner)
                    };

                    return result;
                },
                saveChange: {
                    value: {},
                    validate: function () {
                        var i = 0;

                        return (i > 0 ? false : true);
                    },
                    action: function () {
                        this.value = angular.copy(self.addedit.section8.getValue());
                    }
                }
            },
            section9: {
                owner: (self.owner + "s9"),
                formField: {
                },
                formValue: {
                },
                formValidate: {
                    setValue: function () {
                        this.resetValue();
                    },
                    resetValue: function () {
                        this.showSaveError = false;
                        this.isValid = {};
                    }
                },
                watchFormChange: function () {                    
                    var instructorServObj = instructorServ.form.owner[this.owner];
                    var instructorData = "";

                    instructorServ.form.watchFormChange();

                    $timeout(function () {
                        $scope.$watch(function () {
                            var watch = [];

                            instructorData = appServ.getDataOnJoinArray(instructorServObj.table.data, ["id"]);
                            watch.push(instructorData);

                            angular.forEach(instructorServObj.table.data, function (item) {
                                watch.push(instructorServObj.addedit.formField.coursePositionSelected[item.id].selected);
                            });

                            return watch;
                        }, function () {
                            var exit = false;

                            if (!exit)
                            {
                                if (instructorData !== instructorServObj.addedit.formValue.instructorData)
                                    exit = true;
                            }
                            
                            if (!exit)
                            {
                                angular.forEach(instructorServObj.table.data, function (item) {
                                    if (instructorServObj.addedit.formField.coursePositionSelected[item.id].selected !== instructorServObj.addedit.formValue.coursePositionSelected[item.id].selected)
                                    {
                                        exit = true;
                                        return;
                                    }
                                });
                            }
                            
                            self.addedit.section9.isFormChanged = exit;
                            self.addedit.section9.formValidate.resetValue();
                        }, true);
                    }, 0);                
                },
                setValue: function () {
                    this.isFormChanged = false;

                    this.formValidate.setValue();
                },
                resetValue: function () {
                    var instructorServObj = instructorServ.form.owner[this.owner];

                    instructorServObj.table.reload.getData(this.owner, programmeServ.dataRow.xmlInstructorResponsible);          
                    angular.forEach(instructorServObj.table.data, function (item) {
                        instructorServObj.addedit.formValue.coursePositionSelected[item.id] = {};
                        instructorServObj.addedit.formField.coursePositionSelected[item.id] = {};

                        instructorServObj.addedit.formValue.coursePositionSelected[item.id].selected = (item.coursePosition && item.coursePosition.id ? utilServ.getObjectByValue(appServ.table.dataSource.coursePosition, "id", item.coursePosition.id)[0] : undefined);
                        instructorServObj.addedit.formField.coursePositionSelected[item.id].selected = instructorServObj.addedit.formValue.coursePositionSelected[item.id].selected;

                        instructorServObj.HRi.dataRow[item.id] = {};
                        instructorServObj.HRi.dataRow[item.id].show = false;

                        hriServ.getDataSource({
                            action: "get",
                            params: {
                                personalId: item.HRiId
                            }
                        }).then(function (result) {
                            instructorServObj.HRi.dataRow[item.id] = (result[0] ? result[0] : {});
                            instructorServObj.HRi.dataRow[item.id].show = true;
                        });
                    });
                                        
                    this.formValidate.resetValue();
                },
                getValueHRi: function (data, key) {
                    if (key === "educations")
                        return (data[key] ? data[key][data[key].length - 1] : "");

                    return data[key];
                },
                getValue: function () {
                    var instructorServObj = instructorServ.form.owner[this.owner];
                    var result = {
                        xmlInstructorResponsible: instructorServObj.addedit.getValue(this.owner)
                    };
                    
                    return result;
                },
                saveChange: {
                    value: {},
                    validate: function () {
                        var i = 0;

                        return (i > 0 ? false : true);
                    },
                    action: function () {
                        this.value = angular.copy(self.addedit.section9.getValue());
                    }
                }
            },
            section10: {
                owner: (self.owner + "s10"),
                formField: {
                },
                formValue: {                    
                },
                formValidate: {
                    setValue: function () {
                        this.resetValue();
                    },
                    resetValue: function () {
                        this.showSaveError = false;
                        this.isValid = {};
                    }
                },
                watchFormChange: function () {
                    var placeStudyObj = self.placeStudy.owner[this.owner];
                    var placeStudyData = "";

                    $timeout(function () {
                        $scope.$watch(function () {
                            var watch = [];

                            placeStudyData = appServ.getDataOnJoinArray(placeStudyObj.table.data, ["id"]);
                            watch.push(placeStudyData);

                            return watch;
                        }, function () {
                            var exit = false;

                            if (!exit)
                            {
                                if (placeStudyData !== placeStudyObj.addedit.formValue.placeStudyData)
                                    exit = true;
                            }

                            self.addedit.section10.isFormChanged = exit;
                            self.addedit.section10.formValidate.resetValue();
                        }, true);
                    }, 0);
                },
                setValue: function () {
                    this.isFormChanged = false;

                    this.formValidate.setValue();
                },
                resetValue: function () {
                    var placeStudyObj = self.placeStudy.owner[this.owner];

                    placeStudyObj.table.reload.getData(this.owner, programmeServ.dataRow.xmlPlaceStudy);

                    this.formValidate.resetValue();                    
                },
                getValue: function () {
                    var placeStudyObj = self.placeStudy.owner[this.owner];
                    var result = {
                        xmlPlaceStudy: placeStudyObj.addedit.getValue(this.owner)
                    };

                    return result;
                },
                saveChange: {
                    value: {},
                    validate: function () {
                        var i = 0;

                        return (i > 0 ? false : true);
                    },
                    action: function () {
                        this.value = angular.copy(self.addedit.section10.getValue());
                    }
                }
            },
            section11: {
                owner: (self.owner + "s11"),
                formField: {
                    externalSituation: {}
                },
                formValue: {
                    externalSituation: {}
                },
                formValidate: {
                    setValue: function () {
                        this.resetValue();
                    },
                    resetValue: function () {
                        this.showSaveError = false;
                        this.isValid = {};
                    }
                },
                watchFormChange: function () {
                    $timeout(function () {                        
                        $scope.$watch(function () {
                            var watch = [];

                            angular.forEach(appServ.table.dataSource.externalSituation, function (item) {
                                watch.push(self.addedit.section11.formField.externalSituation[item.id]);
                            });

                            return watch;
                        }, function () {
                            var exit = false;                            

                            if (!exit)
                            {
                                angular.forEach(appServ.table.dataSource.externalSituation, function (item) {
                                    if (self.addedit.section11.formField.externalSituation[item.id] !== self.addedit.section11.formValue.externalSituation[item.id])
                                    {
                                        exit = true;
                                        return;
                                    }
                                });
                            }

                            self.addedit.section11.isFormChanged = exit;
                            self.addedit.section11.formValidate.resetValue();
                        }, true);
                    }, 0);
                },
                setValue: function () {
                    this.isFormChanged = false;

                    this.formValidate.setValue();
                },
                resetValue: function () {
                    angular.forEach(appServ.table.dataSource.externalSituation, function (item1) {
                        self.addedit.section11.formValue.externalSituation[item1.id] = "";
                        if (programmeServ.dataRow.xmlExternalSituation)
                        {
                            angular.forEach($filter("filter")(programmeServ.dataRow.xmlExternalSituation, { id: item1.id }), function (item2) {
                                if (item2.id === item1.id)
                                    self.addedit.section11.formValue.externalSituation[item1.id] = item2.remark;
                            });
                        }
                        self.addedit.section11.formField.externalSituation[item1.id] = self.addedit.section11.formValue.externalSituation[item1.id];
                    });

                    $timeout(function () {
                        autosize.update($(".section11 textarea"));
                    }, 0);

                    this.formValidate.resetValue();
                },
                getValue: function () {
                    var result = {
                        xmlExternalSituation: TQFServ.inputTypeRemark.getValue("externalSituation", appServ.table.dataSource.externalSituation, this.formField)
                    };

                    return result;
                },
                saveChange: {
                    value: {},
                    validate: function () {
                        var i = 0;

                        return (i > 0 ? false : true);
                    },
                    action: function () {
                        this.value = angular.copy(self.addedit.section11.getValue());
                    }
                }
            },
            section12: {
                owner: (self.owner + "s12"),
                formField: {
                    impactCurriculum: {}
                },
                formValue: {
                    impactCurriculum: {}
                },
                formValidate: {
                    setValue: function () {
                        this.resetValue();
                    },
                    resetValue: function () {
                        this.showSaveError = false;
                        this.isValid = {};
                    }
                },
                watchFormChange: function () {
                    $timeout(function () {                        
                        $scope.$watch(function () {
                            var watch = [];

                            angular.forEach(appServ.table.dataSource.impactCurriculum, function (item) {
                                watch.push(self.addedit.section12.formField.impactCurriculum[item.id]);
                            });

                            return watch;
                        }, function () {
                            var exit = false;                            

                            if (!exit)
                            {
                                angular.forEach(appServ.table.dataSource.impactCurriculum, function (item) {                                    
                                    if (self.addedit.section12.formField.impactCurriculum[item.id] !== self.addedit.section12.formValue.impactCurriculum[item.id])
                                    {
                                        exit = true;
                                        return;
                                    }
                                });
                            }

                            self.addedit.section12.isFormChanged = exit;
                            self.addedit.section12.formValidate.resetValue();
                        }, true);
                    }, 0);
                },
                setValue: function () {
                    this.isFormChanged = false;

                    this.formValidate.setValue();
                },
                resetValue: function () {                   
                    angular.forEach(appServ.table.dataSource.impactCurriculum, function (item1) {
                        self.addedit.section12.formValue.impactCurriculum[item1.id] = "";
                        if (programmeServ.dataRow.xmlImpactCurriculum)
                        {
                            angular.forEach($filter("filter")(programmeServ.dataRow.xmlImpactCurriculum, { id: item1.id }), function (item2) {
                                if (item2.id === item1.id)
                                    self.addedit.section12.formValue.impactCurriculum[item1.id] = item2.remark;
                            });
                        }
                        self.addedit.section12.formField.impactCurriculum[item1.id] = self.addedit.section12.formValue.impactCurriculum[item1.id];
                    });

                    $timeout(function () {
                        autosize.update($(".section12 textarea"));
                    }, 0);

                    this.formValidate.resetValue();
                },
                getValue: function () {
                    var result = {
                        xmlImpactCurriculum: TQFServ.inputTypeRemark.getValue("impactCurriculum", appServ.table.dataSource.impactCurriculum, this.formField)
                    };

                    return result;
                },
                saveChange: {
                    value: {},
                    validate: function () {
                        var i = 0;

                        return (i > 0 ? false : true);
                    },
                    action: function () {
                        this.value = angular.copy(self.addedit.section12.getValue());
                    }
                }
            },
            section13: {
                owner: (self.owner + "s13"),
                formField: {
                    refOtherCourses: {}
                },
                formValue: {
                    refOtherCourses: {}
                },
                formValidate: {
                    setValue: function () {
                        this.resetValue();
                    },
                    resetValue: function () {
                        this.showSaveError = false;
                        this.isValid = {};
                    }
                },
                watchFormChange: function () {
                    $timeout(function () {                        
                        $scope.$watch(function () {
                            var watch = [];

                            angular.forEach(appServ.table.dataSource.refOtherCourses, function (item) {
                                watch.push(self.addedit.section13.formField.refOtherCourses[item.id]);
                            });

                            return watch;
                        }, function () {
                            var exit = false;                            

                            if (!exit)
                            {
                                angular.forEach(appServ.table.dataSource.refOtherCourses, function (item) {
                                    if (self.addedit.section13.formField.refOtherCourses[item.id] !== self.addedit.section13.formValue.refOtherCourses[item.id])
                                    {
                                        exit = true;
                                        return;
                                    }
                                });
                            }

                            self.addedit.section13.isFormChanged = exit;
                            self.addedit.section13.formValidate.resetValue();
                        }, true);
                    }, 0);
                },
                setValue: function () {
                    this.isFormChanged = false;

                    this.formValidate.setValue();
                },
                resetValue: function () {
                    angular.forEach(appServ.table.dataSource.refOtherCourses, function (item1) {
                        self.addedit.section13.formValue.refOtherCourses[item1.id] = "";
                        if (programmeServ.dataRow.xmlRefOtherCourses)
                        {
                            angular.forEach($filter("filter")(programmeServ.dataRow.xmlRefOtherCourses, { id: item1.id }), function (item2) {
                                if (item2.id === item1.id)
                                    self.addedit.section13.formValue.refOtherCourses[item1.id] = item2.remark;
                            });
                        }
                        self.addedit.section13.formField.refOtherCourses[item1.id] = self.addedit.section13.formValue.refOtherCourses[item1.id];
                    });

                    $timeout(function () {
                        autosize.update($(".section13 textarea"));
                    }, 0);

                    this.formValidate.resetValue();
                },
                getValue: function () {
                    var result = {
                        xmlRefOtherCourses: TQFServ.inputTypeRemark.getValue("refOtherCourses", appServ.table.dataSource.refOtherCourses, this.formField)
                    };

                    return result;
                },
                saveChange: {
                    value: {},
                    validate: function () {
                        var i = 0;

                        return (i > 0 ? false : true);
                    },
                    action: function () {
                        this.value = angular.copy(self.addedit.section13.getValue());
                    }
                }
            }
        };

        self.isced = {
            owner: {},
            new: function (key) {
                this.owner[key] = {};
                angular.copy(this.isced, this.owner[key]);
            },
            isced: {
                tabSelect: {
                    activeTabIndex: 0,
                    selected: function (tabName) {
                        if (tabName === "main")         this.activeTabIndex = 0;
                        if (tabName === "secondary")    this.activeTabIndex = 1;
                    }
                },
                table: {
                    data: [],
                    reload: {
                        getData: function (owner, dataSource) {
                            var obj = self.isced.owner[owner];

                            angular.copy((dataSource ? dataSource : []), obj.addedit.formValue.iscedTableList);
                            angular.copy(obj.addedit.formValue.iscedTableList, obj.table.data);
                            obj.addedit.formValue.iscedData = appServ.getDataOnJoinArray(obj.table.data, ["id"]);
                        }
                    }
                },
                addedit: {
                    showForm: false,
                    init: function (owner) {
                        this.setValue(owner).then(function () {
                            var obj = self.isced.owner[owner];

                            obj.addedit.watchFormChange(owner);
                            obj.addedit.resetValue(owner);
                        });
                    },
                    formField: {
                        iscedSelected: {},
                        iscedGroupedSelected: {}
                    },
                    formValue: {
                        iscedSelected: {},
                        iscedGroupedSelected: {},
                        iscedTableList: [],
                        iscedData: ""
                    },
                    formValidate: {
                        setValue: function () {
                            this.resetValue();
                        },
                        resetValue: function () {
                            this.showSaveError = false;
                            this.isValid = {                                
                                isced: true,
                                iscedGrouped: true,
                                unique: true
                            };
                        }
                    },
                    watchFormChange: function (owner) {
                        var obj = self.isced.owner[owner];

                        $timeout(function () {
                            $scope.$watch(function () {
                                var watch = [];

                                watch.push(obj.addedit.formField.iscedSelected.selected);
                                watch.push(obj.addedit.formField.iscedGroupedSelected.selected);

                                return watch;
                            }, function () {
                                var exit = false;

                                if (!exit)
                                {
                                    if ((obj.addedit.formField.iscedSelected.selected !== obj.addedit.formValue.iscedSelected.selected) ||
                                        (obj.addedit.formField.iscedGroupedSelected.selected !== obj.addedit.formValue.iscedGroupedSelected.selected))
                                        exit = true;
                                }

                                obj.addedit.isFormChanged = exit;
                                obj.addedit.formValidate.resetValue();
                            }, true);
                        }, 0);
                    },
                    setValue: function (owner) {
                        var deferred = $q.defer();
                        var obj = self.isced.owner[owner];

                        obj.addedit.isFormChanged = false;

                        obj.addedit.formValidate.setValue();

                        $timeout(function () {
                            deferred.resolve();
                        }, 0);

                        return deferred.promise;
                    },
                    resetValue: function (owner) {
                        var obj = self.isced.owner[owner];

                        obj.addedit.formValue.iscedSelected.selected = undefined;
                        obj.addedit.formField.iscedSelected.selected = obj.addedit.formValue.iscedSelected.selected;

                        obj.addedit.formValue.iscedGroupedSelected.selected = undefined;                        
                        obj.addedit.formField.iscedGroupedSelected.selected = obj.addedit.formValue.iscedGroupedSelected.selected;
                    
                        obj.addedit.formValidate.resetValue();
                    },
                    getValue: function (owner) {
                        var obj = self.isced.owner[owner];
                        var result = "";

                        if (obj.table.data.length > 0)
                        {                        
                            angular.forEach(obj.table.data, function (item) {
                                result += (
                                    "<row>" +
                                    "<id>" + item.id + "</id>" +
                                    "<nameTH>" + $filter("capitalize")(item.name.TH) + "</nameTH>" +
                                    "<nameEN>" + $filter("capitalize")(item.name.EN) + "</nameEN>" +
                                    "<grouped>" + item.grouped + "</grouped>" +
                                    "</row>"
                                );
                            });
                        }

                        return result;
                    },
                    saveChange: {
                        validate: function (owner) {
                            var obj = self.isced.owner[owner];
                            var i = 0;

                            if (!obj.addedit.formField.iscedSelected.selected) { obj.addedit.formValidate.isValid.isced = false; i++; }
                            if (!obj.addedit.formField.iscedGroupedSelected.selected) { obj.addedit.formValidate.isValid.iscedGrouped = false; i++; }
                            if (obj.addedit.formField.iscedSelected.selected && utilServ.getObjectByValue(obj.table.data, "id", obj.addedit.formField.iscedSelected.selected.iscedId).length > 0) { obj.addedit.formValidate.isValid.unique = false; i++; }

                            obj.addedit.formValidate.showSaveError = (i > 0 ? true : false);

                            return (i > 0 ? false : true);
                        },
                        action: function (owner) {
                            var obj = self.isced.owner[owner];

                            if (this.validate(owner))
                            {                                              
                                obj.table.data.push({
                                    id: obj.addedit.formField.iscedSelected.selected.iscedId,
                                    name: obj.addedit.formField.iscedSelected.selected.name,
                                    grouped: obj.addedit.formField.iscedGroupedSelected.selected.id
                                });

                                obj.tabSelect.selected(obj.addedit.formField.iscedGroupedSelected.selected.id);
                            }
                        }
                    }                    
                }
            }
        };

        self.majorSubject = {
            owner: {},
            new: function (key) {
                this.owner[key] = {};
                angular.copy(this.majorSubject, this.owner[key]);
            },
            majorSubject: {
                table: {
                    data: [],
                    reload: {
                        getData: function (owner, dataSource) {
                            var obj = self.majorSubject.owner[owner];

                            angular.copy((dataSource ? dataSource : []), obj.addedit.formValue.subjectTableList);
                            angular.copy(obj.addedit.formValue.subjectTableList, obj.table.data);
                            obj.addedit.formValue.subjectData = appServ.getDataOnJoinArray(obj.table.data, ["id"]);
                        }
                    }
                },
                addedit: {
                    showForm: false,
                    init: function (owner) {
                        this.setValue(owner).then(function () {
                            var obj = self.majorSubject.owner[owner];

                            obj.addedit.watchFormChange(owner);
                            obj.addedit.resetValue(owner);
                        });
                    },
                    formField: {
                        subjectSelected: {}
                    },
                    formValue: {
                        subjectSelected: {},
                        subjectTableList: [],
                        subjectData: ""
                    },
                    formValidate: {
                        setValue: function () {
                            this.resetValue();
                        },
                        resetValue: function () {
                            this.showSaveError = false;
                            this.isValid = {
                                subject: true,
                                unique: true
                            };
                        }
                    },
                    watchFormChange: function (owner) {
                        var obj = self.majorSubject.owner[owner];

                        $timeout(function () {
                            $scope.$watch(function () {
                                var watch = [];

                                watch.push(obj.addedit.formField.subjectSelected.selected);

                                return watch;
                            }, function () {
                                var exit = false;

                                if (!exit)
                                {
                                    if (obj.addedit.formField.subjectSelected.selected !== obj.addedit.formValue.subjectSelected.selected)
                                        exit = true;
                                }

                                obj.addedit.isFormChanged = exit;
                                obj.addedit.formValidate.resetValue();
                            }, true);
                        }, 0);
                    },
                    setValue: function (owner) {
                        var deferred = $q.defer();
                        var obj = self.majorSubject.owner[owner];

                        obj.addedit.isFormChanged = false;

                        obj.addedit.formValidate.setValue();

                        $timeout(function () {
                            deferred.resolve();
                        }, 0);

                        return deferred.promise;
                    },
                    resetValue: function (owner) {
                        var obj = self.majorSubject.owner[owner];

                        obj.addedit.formValue.subjectSelected.selected = undefined;
                        obj.addedit.formField.subjectSelected.selected = obj.addedit.formValue.subjectSelected.selected;
                    
                        obj.addedit.formValidate.resetValue();
                    },
                    getValue: function (owner) {
                        var obj = self.majorSubject.owner[owner];
                        var result = "";

                        if (obj.table.data.length > 0)
                        {
                            angular.forEach(obj.table.data, function (item) {
                                result += (
                                    "<row>" +
                                    "<id>" + item.id + "</id>" +
                                    "<nameTH>" + item.name.TH + "</nameTH>" +
                                    "<nameEN>" + item.name.EN + "</nameEN>" +
                                    "</row>"
                                );
                            });
                        }

                        return result;
                    },
                    saveChange: {
                        validate: function (owner) {
                            var obj = self.majorSubject.owner[owner];
                            var i = 0;

                            if (!obj.addedit.formField.subjectSelected.selected) { obj.addedit.formValidate.isValid.subject = false; i++; }
                            if (obj.addedit.formField.subjectSelected.selected && utilServ.getObjectByValue(obj.table.data, "id", obj.addedit.formField.subjectSelected.selected.id).length > 0) { obj.addedit.formValidate.isValid.unique = false; i++; }

                            obj.addedit.formValidate.showSaveError = (i > 0 ? true : false);

                            return (i > 0 ? false : true);
                        },
                        action: function (owner) {
                            var obj = self.majorSubject.owner[owner];

                            if (this.validate(owner))
                            {                                              
                                obj.table.data.push({
                                    id: obj.addedit.formField.subjectSelected.selected.id,
                                    name: obj.addedit.formField.subjectSelected.selected.name
                                });
                            }
                        }
                    }           
                }
            }
        };

        self.cooperationType = {
            SP: {
                showForm: false
            },
            CO: {
                showForm: false
            },
            setSelected: function (owner, data, groupType, formField) {
                var lastField = formField[groupType + "SelectedLast"];

                if (data.input === "radio" && data.id !== lastField.id)
                {                    
                    if (this[data.code])        this[data.code].showForm = true;
                    if (this[lastField.code])   this.uncheck(owner, groupType, formField);
                }
            },
            uncheck: function (owner, groupType, formField) {
                var lastField = formField[groupType + "SelectedLast"];

                if (lastField.code && this[lastField.code])
                {                    
                    var instituteObj = self.institute.owner[owner + lastField.code];
                    var cooperationPatternObj = self.cooperationPattern.owner[owner + lastField.code];

                    this[lastField.code].showForm = false;
                    instituteObj.addedit.resetValue(owner + lastField.code);                    
                    instituteObj.addedit.showForm = false;
                    instituteObj.table.data = [];

                    cooperationPatternObj.addedit.resetValue((owner + lastField.code), "");
                }
            }
        };

        self.institute = {
            owner: {},
            new: function (key) {
                this.owner[key] = {};
                angular.copy(this.institute, this.owner[key]);
            },
            institute: {
                table: {
                    data: [],
                    reload: {
                        getData: function (owner, dataSource) {
                            var obj = self.institute.owner[owner];

                            angular.copy((dataSource ? dataSource : []), obj.addedit.formValue.instituteTableList);
                            angular.copy(obj.addedit.formValue.instituteTableList, obj.table.data);
                            obj.addedit.formValue.instituteData = appServ.getDataOnJoinArray(obj.table.data, ["id"]);
                        }
                    }
                },
                addedit: {
                    showForm: false,
                    init: function (owner) {
                        this.setValue(owner).then(function () {
                            var obj = self.institute.owner[owner];

                            obj.addedit.watchFormChange(owner);
                            obj.addedit.resetValue(owner);
                        });
                    },
                    formField: {
                        countrySelected: {},
                        name: ""
                    },
                    formValue: {
                        countrySelected: {},
                        name: "",
                        instituteTableList: [],
                        instituteData: ""
                    },
                    formValidate: {
                        setValue: function () {
                            this.resetValue();
                        },
                        resetValue: function () {
                            this.showSaveError = false;
                            this.isValid = {
                                country: true,
                                name: true,
                                unique: true
                            };
                        }
                    },
                    watchFormChange: function (owner) {
                        var obj = self.institute.owner[owner];

                        $timeout(function () {
                            $scope.$watch(function () {
                                var watch = [];

                                watch.push(obj.addedit.formField.countrySelected.selected);
                                watch.push(obj.addedit.formField.name);

                                return watch;
                            }, function () {
                                var exit = false;

                                if (!exit)
                                {
                                    if ((obj.addedit.formField.countrySelected.selected !== obj.addedit.formValue.countrySelected.selected) ||
                                        (obj.addedit.formField.name !== obj.addedit.formValue.name))
                                        exit = true;
                                }

                                obj.addedit.isFormChanged = exit;
                                obj.addedit.formValidate.resetValue();
                            }, true);
                        }, 0);
                    },
                    setValue: function (owner) {
                        var deferred = $q.defer();
                        var obj = self.institute.owner[owner];

                        obj.addedit.isFormChanged = false;

                        obj.addedit.formValidate.setValue();

                        $timeout(function () {
                            deferred.resolve();
                        }, 0);

                        return deferred.promise;
                    },
                    resetValue: function (owner) {
                        var obj = self.institute.owner[owner];

                        obj.addedit.formValue.countrySelected.selected = undefined;
                        obj.addedit.formField.countrySelected.selected = obj.addedit.formValue.countrySelected.selected;

                        obj.addedit.formValue.name = "";                        
                        obj.addedit.formField.name = obj.addedit.formValue.name;

                        obj.addedit.formValidate.resetValue();
                    },
                    getValue: function (owner) {
                        var obj = self.institute.owner[owner];
                        var result = "";

                        if (obj.table.data.length > 0)
                        {                        
                            angular.forEach(obj.table.data, function (item) {
                                result += (
                                    "<row>" +
                                    "<countryId>" + item.countryId + "</countryId>" +
                                    "<countryNameTH>" + item.countryName.TH + "</countryNameTH>" +
                                    "<countryNameEN>" + item.countryName.EN + "</countryNameEN>" +
                                    "<name>" + item.name + "</name>" +
                                    "</row>"
                                );
                            });
                        }

                        return result;
                    },
                    saveChange: {
                        validate: function (owner) {
                            var obj = self.institute.owner[owner];
                            var i = 0;
                            var id = (
                                (obj.addedit.formField.countrySelected.selected ? obj.addedit.formField.countrySelected.selected.id : "") +
                                (obj.addedit.formField.countrySelected.selected ? obj.addedit.formField.name : "")
                            );

                            if (!obj.addedit.formField.countrySelected.selected) { obj.addedit.formValidate.isValid.country = false; i++; }
                            if (!obj.addedit.formField.name) { obj.addedit.formValidate.isValid.name = false; i++; }
                            if (utilServ.getObjectByValue(obj.table.data, "id", id).length > 0) { obj.addedit.formValidate.isValid.unique = false; i++; }

                            obj.addedit.formValidate.showSaveError = (i > 0 ? true : false);

                            return (i > 0 ? false : true);
                        },
                        action: function (owner) {
                            var obj = self.institute.owner[owner];

                            if (this.validate(owner))
                            {
                                obj.table.data.push({
                                    id: (
                                        obj.addedit.formField.countrySelected.selected.id +
                                        obj.addedit.formField.name
                                    ),
                                    countryId: obj.addedit.formField.countrySelected.selected.id,
                                    countryName: obj.addedit.formField.countrySelected.selected.name,
                                    name: obj.addedit.formField.name
                                });
                            }
                        }
                    }           
                }
            }
        };

        self.cooperationPattern = {
            owner: {},
            new: function (key) {
                this.owner[key] = {};
                angular.copy(this.cooperationPattern, this.owner[key]);
            },
            cooperationPattern: {
                addedit: {
                    formField: {
                        cooperationPattern: [],
                        cooperationPatternSelected: {},
                        cooperationPatternSelectedLast: {},
                        cooperationPatternRemark: {}
                    },
                    formValue: {
                        cooperationPattern: [],
                        cooperationPatternData: ""
                    },
                    setValue: function (owner) {
                        this.isCheckedCooperationPattern = {};
                    },
                    resetValue: function (owner, dataSource) {
                        var obj = self.cooperationPattern.owner[owner];

                        obj.addedit.formValue.cooperationPattern = [];
                        obj.addedit.formValue.cooperationPatternData = "";
                        angular.copy(obj.addedit.formValue.cooperationPattern, obj.addedit.formField.cooperationPattern);
                        TQFServ.inputTypeRemark.uncheck(appServ.table.dataSource.cooperationPattern, "cooperationPattern", obj.addedit.formField, obj.addedit.isCheckedCooperationPattern);
                        TQFServ.inputTypeRemark.check(dataSource, appServ.table.dataSource.cooperationPattern, "cooperationPattern", obj.addedit.formField, obj.addedit.formValue, obj.addedit.isCheckedCooperationPattern);
                    }
                }
            }
        };

        self.career = {
            owner: {},
            autoCompleteOptions: function (owner, data) {
                return angular.extend(appServ.autoCompleteOptions(data), {
                    itemSelected: function (e) {
                        var data = e.item.value;
                    }
                });
            },
            new: function (key) {
                this.owner[key] = {};
                angular.copy(this.career, this.owner[key]);
            },
            career: {
                table: {
                    data: [],
                    reload: {
                        getData: function (owner, dataSource) {
                            var obj = self.career.owner[owner];

                            angular.copy((dataSource ? dataSource : []), obj.addedit.formValue.careerTableList);
                            angular.copy(obj.addedit.formValue.careerTableList, obj.table.data);
                            obj.addedit.formValue.careerData = appServ.getDataOnJoinArray(obj.table.data, ["id"]);
                        }
                    }
                },
                addedit: {
                    showForm: false,
                    init: function (owner) {
                        this.setValue(owner).then(function () {
                            var obj = self.career.owner[owner];
                        
                            obj.addedit.watchFormChange(owner);
                            obj.addedit.resetValue(owner);
                        });
                    },
                    formField: {
                        name: ""
                    },
                    formValue: {
                        name: "",
                        careerTableList: [],
                        careerData: ""
                    },
                    formValidate: {
                        setValue: function () {
                            this.resetValue();
                        },
                        resetValue: function () {
                            this.showSaveError = false;
                            this.isValid = {
                                name: true,
                                unique: true                            
                            };
                        }
                    },
                    watchFormChange: function (owner) {
                        var obj = self.career.owner[owner];

                        $timeout(function () {
                            $scope.$watch(function () {
                                var watch = [];

                                watch.push(obj.addedit.formField.name);

                                return watch;
                            }, function () {
                                var exit = false;

                                if (!exit)
                                {
                                    if (obj.addedit.formField.name !== obj.addedit.formValue.name)
                                        exit = true;
                                }

                                obj.addedit.isFormChanged = exit;
                                obj.addedit.formValidate.resetValue();
                            }, true);
                        }, 0);
                    },
                    setValue: function (owner) {
                        var deferred = $q.defer();
                        var obj = self.career.owner[owner];

                        obj.addedit.isFormChanged = false;

                        obj.addedit.formValidate.setValue();

                        $timeout(function () {
                            deferred.resolve();
                        }, 0);

                        return deferred.promise;
                    },
                    resetValue: function (owner) {
                        var obj = self.career.owner[owner];

                        obj.addedit.formValue.name = "";
                        obj.addedit.formField.name = obj.addedit.formValue.name;
                    
                        obj.addedit.formValidate.resetValue();
                    },
                    getValue: function (owner) {
                        var obj = self.career.owner[owner];
                        var result = "";

                        if (obj.table.data.length > 0)
                        {                        
                            angular.forEach(obj.table.data, function (item) {
                                result += (
                                    "<row>" +
                                    "<name>" + item.name + "</name>" +
                                    "</row>"
                                );
                            });
                        }

                        return result;
                    },
                    saveChange: {
                        validate: function (owner) {
                            var obj = self.career.owner[owner];
                            var i = 0;

                            if (!obj.addedit.formField.name) { obj.addedit.formValidate.isValid.name = false; i++; }
                            if (utilServ.getObjectByValue(obj.table.data, "id", obj.addedit.formField.name).length > 0) { obj.addedit.formValidate.isValid.unique = false; i++; }

                            obj.addedit.formValidate.showSaveError = (i > 0 ? true : false);

                            return (i > 0 ? false : true);
                        },
                        action: function (owner) {
                            var obj = self.career.owner[owner];

                            if (this.validate(owner))
                            { 
                                obj.table.data.push({
                                    id: obj.addedit.formField.name,
                                    name: obj.addedit.formField.name
                                });
                            }
                        }
                    }           
                }
            }
        };    
        
        self.placeStudy = {
            owner: {},
            autoCompleteOptions: function (owner, data) {
                var obj = self.placeStudy.owner[owner];

                return angular.extend(appServ.autoCompleteOptions(data), {
                    itemSelected: function (e) {
                        var data = e.item.value;

                        obj.addedit.formField.name.TH = data.name.TH;
                        obj.addedit.formField.name.EN = data.name.EN;
                        obj.addedit.formField.departmentSelected.selected = (data.faculty.id ? utilServ.getObjectByValue(appServ.table.dataSource.faculty, "id", data.faculty.id)[0] : undefined);

                        if (obj.addedit.formField.departmentSelected.selected)
                            obj.addedit.department.onSelect(owner);
                        else
                        {
                            obj.addedit.formField.demartmentOtherSelected = "true";
                            obj.addedit.department.setSelected(owner);
                            obj.addedit.formField.demartmentOtherRemark = (data.faculty.name.TH ? data.faculty.name.TH : data.faculty.name.EN);
                        }
                    }
                });
            },
            new: function (key) {
                this.owner[key] = {};
                angular.copy(this.placeStudy, this.owner[key]);
            },
            placeStudy: {
                table: {
                    data: [],
                    reload: {
                        getData: function (owner, dataSource) {
                            var obj = self.placeStudy.owner[owner];

                            angular.copy((dataSource ? dataSource : []), obj.addedit.formValue.placeStudyTableList);
                            angular.copy(obj.addedit.formValue.placeStudyTableList, obj.table.data);
                            obj.addedit.formValue.placeStudyData = appServ.getDataOnJoinArray(obj.table.data, ["id"]);
                        }
                    }
                },
                addedit: {
                    department: {
                        onSelect: function (owner) {
                            var obj = self.placeStudy.owner[owner];

                            obj.addedit.formField.demartmentOtherSelected = "";
                            obj.addedit.formField.demartmentOtherRemark = "";
                            obj.addedit.isCheckedDepartmentOther = false;
                        },
                        setSelected: function (owner) {
                            var obj = self.placeStudy.owner[owner];

                            if (obj.addedit.formField.demartmentOtherSelected)
                            {
                                obj.addedit.formField.departmentSelected.selected = undefined;
                                obj.addedit.formField.demartmentOtherRemark = "";
                                obj.addedit.isCheckedDepartmentOther = true;
                            }
                        }
                    },
                    showForm: false,
                    init: function (owner) {
                        this.setValue(owner).then(function () {
                            var obj = self.placeStudy.owner[owner];

                            obj.addedit.watchFormChange(owner);
                            obj.addedit.resetValue(owner);
                        });
                    },
                    formField: {
                        name: {
                            TH: "",
                            EN: ""
                        },                                
                        departmentSelected: {},
                        demartmentOtherSelected: "",
                        demartmentOtherRemark: ""
                    },
                    formValue: {
                        name: {
                            TH: "",
                            EN: ""
                        },
                        departmentSelected: {},
                        demartmentOtherSelected: "",
                        demartmentOtherRemark: "",
                        placeStudyTableList: [],
                        placeStudyData: ""
                    },
                    formValidate: {
                        setValue: function () {
                            this.resetValue();
                        },
                        resetValue: function () {
                            this.showSaveError = false;
                            this.isValid = {
                                name: {
                                    TH: true,
                                    EN: true
                                },
                                department: true,
                                demartmentOtherRemark: true,
                                unique: true
                            };
                        }
                    },
                    watchFormChange: function (owner) {
                        var obj = self.placeStudy.owner[owner];

                        $timeout(function () {
                            $scope.$watch(function () {
                                var watch = [];

                                watch.push(obj.addedit.formField.name.TH);
                                watch.push(obj.addedit.formField.name.EN);
                                watch.push(obj.addedit.formField.departmentSelected.selected);
                                watch.push(obj.addedit.formField.demartmentOtherSelected);
                                watch.push(obj.addedit.formField.demartmentOtherRemark);

                                return watch;
                            }, function () {
                                var exit = false;

                                if (!exit)
                                {
                                    if ((obj.addedit.formField.name.TH !== obj.addedit.formValue.name.TH) ||
                                        (obj.addedit.formField.name.EN !== obj.addedit.formValue.name.EN) ||
                                        (obj.addedit.formField.departmentSelected.selected !== obj.addedit.formValue.departmentSelected.selected) ||
                                        (obj.addedit.formField.demartmentOtherSelected !== obj.addedit.formValue.demartmentOtherSelected) ||
                                        (obj.addedit.formField.demartmentOtherRemark !== obj.addedit.formValue.demartmentOtherRemark))
                                        exit = true;
                                }

                                obj.addedit.isFormChanged = exit;
                                obj.addedit.formValidate.resetValue();
                            }, true);
                        }, 0);
                    },
                    setValue: function (owner) {
                        var deferred = $q.defer();
                        var obj = self.placeStudy.owner[owner];

                        obj.addedit.isFormChanged = false;
                        obj.addedit.isCheckedDepartmentOther = false;

                        obj.addedit.formValidate.setValue();

                        $timeout(function () {
                            deferred.resolve();
                        }, 0);

                        return deferred.promise;
                    },
                    resetValue: function (owner) {
                        var obj = self.placeStudy.owner[owner];

                        obj.addedit.formValue.name.TH = "";
                        obj.addedit.formField.name.TH = obj.addedit.formValue.name.TH;

                        obj.addedit.formValue.name.EN = "";
                        obj.addedit.formField.name.EN = obj.addedit.formValue.name.EN;

                        obj.addedit.formValue.departmentSelected.selected = undefined;
                        obj.addedit.formField.departmentSelected.selected = obj.addedit.formValue.departmentSelected.selected;

                        obj.addedit.formValue.demartmentOtherSelected = "";
                        obj.addedit.formField.demartmentOtherSelected = obj.addedit.formValue.demartmentOtherSelected;

                        obj.addedit.formValue.demartmentOtherRemark = "";
                        obj.addedit.formField.demartmentOtherRemark = obj.addedit.formValue.demartmentOtherRemark;

                        obj.addedit.isCheckedDepartmentOther = false;
                                                                                                                       
                        obj.addedit.formValidate.resetValue();
                    },
                    getValue: function (owner) {
                        var obj = self.placeStudy.owner[owner];
                        var result = "";

                        if (obj.table.data.length > 0)
                        {
                            angular.forEach(obj.table.data, function (item) {
                                result += (
                                    "<row>" +
                                    "<nameTH>" + item.name.TH + "</nameTH>" +
                                    "<nameEN>" + item.name.EN + "</nameEN>" +
                                    "<facultyId>" + item.faculty.id + "</facultyId>" +
                                    "<facultyCode>" + item.faculty.code + "</facultyCode>" +
                                    "<facultyNameTH>" + item.faculty.name.TH + "</facultyNameTH>" +
                                    "<facultyNameEN>" + item.faculty.name.EN + "</facultyNameEN>" +
                                    "</row>"
                                );
                            });
                        }

                        return result;
                    },
                    saveChange: {
                        validate: function (owner) {
                            var obj = self.placeStudy.owner[owner];
                            var i = 0;
                            var id = (
                                obj.addedit.formField.name.TH +
                                obj.addedit.formField.name.EN +
                                (obj.addedit.formField.departmentSelected.selected ? (obj.addedit.formField.departmentSelected.selected.id + obj.addedit.formField.departmentSelected.selected.code) : "") +
                                (obj.addedit.formField.departmentSelected.selected ? (obj.addedit.formField.departmentSelected.selected.name.TH + obj.addedit.formField.departmentSelected.selected.name.EN) : obj.addedit.formField.demartmentOtherRemark)
                            );

                            if (!obj.addedit.formField.name.TH) { obj.addedit.formValidate.isValid.name.TH = false; i++; }
                            if (!obj.addedit.formField.name.EN) { obj.addedit.formValidate.isValid.name.EN = false; i++; }
                            if (!obj.addedit.formField.departmentSelected.selected && !obj.addedit.formField.demartmentOtherSelected && !obj.addedit.formField.demartmentOtherRemark) { obj.addedit.formValidate.isValid.department = false; i++; }
                            if (!obj.addedit.formField.departmentSelected.selected && obj.addedit.formField.demartmentOtherSelected && !obj.addedit.formField.demartmentOtherRemark) { obj.addedit.formValidate.isValid.demartmentOtherRemark = false; i++; }
                            if (utilServ.getObjectByValue(obj.table.data, "id", id).length > 0) { obj.addedit.formValidate.isValid.unique = false; i++; }

                            obj.addedit.formValidate.showSaveError = (i > 0 ? true : false);

                            return (i > 0 ? false : true);
                        },
                        action: function (owner) {
                            var obj = self.placeStudy.owner[owner];

                            if (this.validate(owner))
                            {
                                obj.table.data.push({
                                    id: (
                                        obj.addedit.formField.name.TH +
                                        obj.addedit.formField.name.EN +
                                        (obj.addedit.formField.departmentSelected.selected ? (obj.addedit.formField.departmentSelected.selected.id + obj.addedit.formField.departmentSelected.selected.code) : "") +
                                        (obj.addedit.formField.departmentSelected.selected ? (obj.addedit.formField.departmentSelected.selected.name.TH + obj.addedit.formField.departmentSelected.selected.name.EN) : obj.addedit.formField.demartmentOtherRemark)
                                    ),
                                    name: {
                                        TH: obj.addedit.formField.name.TH,
                                        EN: obj.addedit.formField.name.EN
                                    },
                                    faculty: {
                                        id: (obj.addedit.formField.departmentSelected.selected ? obj.addedit.formField.departmentSelected.selected.id : ""),
                                        code: (obj.addedit.formField.departmentSelected.selected ? obj.addedit.formField.departmentSelected.selected.code : ""),
                                        name: {
                                            TH: (obj.addedit.formField.departmentSelected.selected ? obj.addedit.formField.departmentSelected.selected.name.TH : obj.addedit.formField.demartmentOtherRemark),
                                            EN: (obj.addedit.formField.departmentSelected.selected ? obj.addedit.formField.departmentSelected.selected.name.EN : obj.addedit.formField.demartmentOtherRemark)
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
            }
        };
    })

    .controller("TQFInfo.TQF2.group2Ctrl", function ($scope, $timeout, $q, $location, utilServ, appServ, pageRouteServ, facultyServ, programmeServ, TQFServ) {
        var self = this;

        self.owner = "tqf2g2";
        self.maxSection = 2;
        self.accordionGroup = {};

        self.addedit = {
            showForm: false,
            template: {
                content: "",
                action: "",
                init: function () {
                    if (appServ.isUser && facultyServ.isFaculty && programmeServ.isProgram && self.addedit.showForm)
                    {
                        utilServ.getDialogPreloadingWithDict(["msgPreloading", "loading"]);

                        this.content = pageRouteServ.pageObject.TQF2.group2.addedit.template;
                    }
                },
                remove: function () {
                    utilServ.removeCacheTemplate(this.content);
                    this.content = "";
                }
            },            
            init: function () {
                if (appServ.isUser && facultyServ.isFaculty && programmeServ.isProgram)
                {
                    var action = self.addedit.template.action;

                    this.setValue().then(function () {
                        self.addedit[action].setValue();
                        programmeServ.isProgram = TQFServ.isProgramOnGroup(self, programmeServ.dataRow);

                        if (programmeServ.isProgram)
                        {
                            angular.forEach(utilServ.getArrayNumber(self.maxSection), function (item) {
                                self.addedit["section" + item].setValue();
                            });

                            self.addedit.watchFormChange();
                            self.addedit.resetValue();
                            self.addedit.showForm = true;

                            appServ.closeDialogPreloading();
                        }
                    });
                }
                else
                    self.addedit.showForm = false;
            },
            watchFormChange: function () {
                angular.forEach(utilServ.getArrayNumber(self.maxSection), function (item) {
                    self.addedit["section" + item].watchFormChange();
                });

                $timeout(function () {                    
                    $scope.$watch(function () {
                        var watch = [];

                        angular.forEach(utilServ.getArrayNumber(self.maxSection), function (item) {
                            watch.push(self.addedit["section" + item].isFormChanged);
                        });

                        return watch;
                    }, function () {
                        var exit = false;                            

                        if (!exit)
                        {
                            angular.forEach(utilServ.getArrayNumber(self.maxSection), function (item) {
                                if (self.addedit["section" + item].isFormChanged)
                                {
                                    exit = true;
                                    return;
                                }
                            });
                        }

                        self.addedit.isFormChanged = exit;
                    }, true);
                }, 0);
            },            
            formField: {
            },
            formValue: {
            },
            formValidate: {
                setValue: function () {
                    this.resetValue();
                },
                resetValue: function () {
                    this.showSaveError = false;
                    this.isValid = {};
                }
            },
            setValue: function () {
                var deferred = $q.defer();

                this.isAdd = false;
                this.isEdit = false;
                this.isUpdate = false;
                this.isDelete = false;
                this.isFormChanged = false;                

                this.formValidate.setValue();

                angular.forEach(utilServ.getArrayNumber(self.maxSection), function (item) {
                    self.accordionGroup["section" + item] = {
                        isOpen: false
                    };
                });

                programmeServ.getDataSourceOnGroup(2).then(function () {
                    $timeout(function () {
                        deferred.resolve();
                    }, 0);
                });
                
                return deferred.promise;
            },
            resetValue: function () {
                if (this.isAdd || this.isEdit || this.isUpdate)
                {
                    angular.forEach(utilServ.getArrayNumber(self.maxSection), function (item) {
                        self.addedit["section" + item].resetValue();
                        self.accordionGroup["section" + item].isOpen = false;
                    });

                    this.formValidate.resetValue();
                    utilServ.gotoTopPage();
                }
            },
            getValue: function () {
                var result = {
                    tableType: (programmeServ.dataRow.tableType ? programmeServ.dataRow.tableType : "temp"),
                    id: (programmeServ.dataRow.id ? programmeServ.dataRow.id : ""),
                    facultyId: facultyServ.facultyInfo.id,
                    programId: (programmeServ.dataRow.programId ? programmeServ.dataRow.programId : ""),
                    programCode: (programmeServ.dataRow.programCode ? programmeServ.dataRow.programCode : ""),
                    majorId: (programmeServ.dataRow.majorId ? programmeServ.dataRow.majorId : ""),
                    majorCode: (programmeServ.dataRow.majorCode ? programmeServ.dataRow.majorCode : ""),
                    groupNum: (programmeServ.dataRow.groupNum ? programmeServ.dataRow.groupNum : ""),
                    courseYear: (programmeServ.dataRow.courseYear ? programmeServ.dataRow.courseYear : "")
                };

                angular.forEach(utilServ.getArrayNumber(self.maxSection), function (item) {
                    angular.extend(result, self.addedit["section" + item].saveChange.value);
                });

                return result;
            },
            add: {
                init: function () {
                    self.addedit.init();
                },
                setValue: function () {
                    self.addedit.isAdd = true;
                    self.addedit.isEdit = false;
                    self.addedit.isUpdate = false;
                    self.addedit.isDelete = false;
                }
            },
            edit: {
                init: function () {
                    self.addedit.init();
                },
                setValue: function () {
                    self.addedit.isAdd = false;
                    self.addedit.isEdit = true;
                    self.addedit.isUpdate = false;
                    self.addedit.isDelete = false;
                }
            },
            update: {
                init: function () {
                    self.addedit.init();
                },
                setValue: function () {
                    self.addedit.isAdd = false;
                    self.addedit.isEdit = false;
                    self.addedit.isUpdate = true;
                    self.addedit.isDelete = false;
                }
            },
            saveChange: {
                value: {},
                validate: function () {
                    var i = 0;

                    if (self.addedit.isAdd || self.addedit.isEdit || self.addedit.isUpdate)
                    {
                        angular.forEach(utilServ.getArrayNumber(self.maxSection), function (item) {
                            if (!self.addedit["section" + item].saveChange.validate())
                            {
                                self.accordionGroup["section" + item].isOpen = true;
                                i++;
                            }
                        });
                    }

                    return (i > 0 ? false : true);
                },
                action: function () {
                    angular.forEach(utilServ.getArrayNumber(self.maxSection), function (item) {
                        self.addedit["section" + item].saveChange.action();
                    });

                    this.value = angular.copy(self.addedit.getValue());

                    if (this.validate())
                    {
                        var action;

                        if (self.addedit.isAdd)     action = "add";
                        if (self.addedit.isEdit)    action = "edit";
                        if (self.addedit.isUpdate)  action = "update";
                        if (self.addedit.isDelete)  action = "remove";

                        programmeServ.saveChange.action({
                            action: action,
                            data: self.addedit.getValue()
                        }).then(function (result) {
                            if (result.status)
                            {
                                if (result.mode === "add")
                                {
                                    self.addedit.isAdd = true;
                                    self.addedit.isEdit = false;
                                    self.addedit.isUpdate = false;
                                    self.addedit.isDelete = false;
                                }

                                if (self.addedit.isAdd)
                                    $location.path("/TQFInfo/TQF2/" + (result.action === "add" ? "edit" : result.action) + "/temp/" + result.id).replace();

                                if (self.addedit.isEdit || self.addedit.isUpdate)
                                {
                                    var action = self.addedit.template.action;

                                    programmeServ.getDataSourceOnGroup(2).then(function () {
                                        self.addedit[action].setValue();
                                        angular.forEach(utilServ.getArrayNumber(self.maxSection), function (item) {
                                            self.addedit["section" + item].isFormChanged = false;
                                        });
                                        self.addedit.isFormChanged = false;
                                        self.addedit.resetValue();
                                    });
                                }
                            }
                        });
                    }
                    else
                    {
                        utilServ.gotoTopPage();
                        utilServ.dialogErrorWithDict(["save", "error"], function () { });
                    }
                }
            },
            section1: {
                owner: (self.owner + "s1"),
                formField: {
                    philosopyCourse: ""
                },
                formValue: {
                    philosopyCourse: ""
                },
                formValidate: {
                    setValue: function () {
                        this.resetValue();
                    },
                    resetValue: function () {
                        this.showSaveError = false;
                        this.isValid = {};
                    }
                },
                watchFormChange: function () {
                    var programObjectivesObj = self.programObjectives.owner[this.owner];
                    var programObjectivesData = "";
                    var plosObj = self.plos.owner[this.owner];
                    var plosData = "";
                    var subplosData = {};

                    $timeout(function () {
                        $scope.$watch(function () {
                            var watch = [];
                            var subplosObj = {};

                            watch.push(self.addedit.section1.formField.philosopyCourse);

                            programObjectivesData = appServ.getDataOnJoinArray(programObjectivesObj.table.data, ["id"]);
                            watch.push(programObjectivesData);

                            plosData = appServ.getDataOnJoinArray(plosObj.table.data, ["id"]);
                            watch.push(plosData);

                            angular.forEach(plosObj.table.data, function (item) {
                                subplosObj = self.subplos.owner[self.addedit.section1.owner + item.code];

                                if (subplosObj)
                                {
                                    subplosData[item.code] = appServ.getDataOnJoinArray(subplosObj.table.data, ["id"]);
                                    watch.push(subplosData[item.code]);
                                }
                            });

                            return watch;
                        }, function () {
                            var exit = false;
                            var subplosObj = {};

                            if (!exit)
                            {
                                if ((self.addedit.section1.formField.philosopyCourse !== self.addedit.section1.formValue.philosopyCourse) ||
                                    (programObjectivesData !== programObjectivesObj.addedit.formValue.programObjectivesData) ||
                                    (plosData !== plosObj.addedit.formValue.plosData))
                                    exit = true;
                            }

                            if (!exit)
                            {
                                angular.forEach(plosObj.table.data, function (item) {
                                    subplosObj = self.subplos.owner[self.addedit.section1.owner + item.code];

                                    if (subplosObj)
                                    {
                                        if (subplosData[item.code] !== subplosObj.addedit.formValue.subplosData)
                                        {
                                            exit = true;
                                            return;
                                        }
                                    }
                                });
                            }

                            self.addedit.section1.isFormChanged = exit;
                            self.addedit.section1.formValidate.resetValue();
                        }, true);
                    }, 0);
                },
                setValue: function () {       
                    this.isFormChanged = false;

                    this.formValidate.setValue();
                },
                resetValue: function () {                    
                    var programObjectivesObj = self.programObjectives.owner[this.owner];
                    var plosObj = self.plos.owner[this.owner];

                    this.formValue.philosopyCourse = (programmeServ.dataRow.philosopyCourses ? programmeServ.dataRow.philosopyCourses : "");
                    this.formField.philosopyCourse = this.formValue.philosopyCourse;

                    programObjectivesObj.table.reload.getData(this.owner, programmeServ.dataRow.xmlProgramObjectives);

                    plosObj.table.reload.getData(this.owner, programmeServ.dataRow.xmlPLOs);

                    $timeout(function () {
                        autosize.update($(".section1 textarea"));
                    }, 0);

                    this.formValidate.resetValue();
                },
                getValue: function () {
                    var programObjectivesObj = self.programObjectives.owner[this.owner];
                    var plosObj = self.plos.owner[this.owner];
                    var result = {
                        philosopyCourses: (this.formField.philosopyCourse ? this.formField.philosopyCourse : ""),
                        xmlProgramObjectives: programObjectivesObj.addedit.getValue(this.owner),
                        xmlPLOs: plosObj.addedit.getValue(this.owner)
                    };

                    return result;
                },
                saveChange: {
                    value: {},
                    validate: function () {
                        var exit = false;

                        if (this.value.philosopyCourses ||
                            this.value.xmlProgramObjectives ||
                            this.value.xmlPLOs)
                            exit = true;

                        return exit;
                    },
                    action: function () {
                        this.value = angular.copy(self.addedit.section1.getValue());
                    }
                }
            },
            section2: {
                owner: (self.owner + "s2"),
                formField: {
                },
                formValue: {
                },
                formValidate: {
                    setValue: function () {
                        this.resetValue();
                    },
                    resetValue: function () {
                        this.showSaveError = false;
                        this.isValid = {};
                    }
                },
                watchFormChange: function () {
                    var developPlanObj = self.developPlan.owner[this.owner];
                    var developPlanData = "";

                    $timeout(function () {
                        $scope.$watch(function () {
                            var watch = [];

                            developPlanData = appServ.getDataOnJoinArray(developPlanObj.table.data, ["id"]);
                            watch.push(developPlanData);

                            return watch;
                        }, function () {
                            var exit = false;
                            
                            if (!exit)
                            {
                                if (developPlanData !== developPlanObj.addedit.formValue.developPlanData)
                                    exit = true;
                            }

                            self.addedit.section2.isFormChanged = exit;
                            self.addedit.section2.formValidate.resetValue();
                        }, true);
                    }, 0);
                },
                setValue: function () {
                    this.isFormChanged = false;

                    this.formValidate.setValue();
                },
                resetValue: function () {
                    var developPlanObj = self.developPlan.owner[this.owner];

                    developPlanObj.table.reload.getData(this.owner, programmeServ.dataRow.xmlDevelopPlan);

                    this.formValidate.resetValue();
                },
                getValue: function () {
                    var developPlanObj = self.developPlan.owner[this.owner];
                    var result = {
                        xmlDevelopPlan: developPlanObj.addedit.getValue(this.owner)
                    };

                    return result;
                },
                saveChange: {
                    value: {},
                    validate: function () {
                        return true;
                    },
                    action: function () {
                        this.value = angular.copy(self.addedit.section2.getValue());
                    }
                }
            }
        };

        self.programObjectives = {
            owner: {},
            new: function (key) {                
                this.owner[key] = {};
                angular.copy(this.programObjectives, this.owner[key]);
            },
            programObjectives: {
                table: {
                    data: [],
                    reload: {
                        getData: function (owner, dataSource) {
                            var obj = self.programObjectives.owner[owner];
                            
                            angular.copy((dataSource ? dataSource : []), obj.addedit.formValue.programObjectivesTableList);
                            angular.copy(obj.addedit.formValue.programObjectivesTableList, obj.table.data);
                            obj.addedit.formValue.programObjectivesData = appServ.getDataOnJoinArray(obj.table.data, ["id"]);
                        }
                    }
                },
                addedit: {                        
                    showForm: false,
                    init: function (owner) {
                        this.setValue(owner).then(function () {
                            var obj = self.programObjectives.owner[owner];

                            obj.addedit.watchFormChange(owner);
                            obj.addedit.resetValue(owner);
                        });
                    },
                    formField: {
                        name: {
                            TH: "",
                            EN: ""
                        }
                    },
                    formValue: {
                        name: {
                            TH: "",
                            EN: ""
                        },                    
                        programObjectivesTableList: [],
                        programObjectivesData: ""
                    },
                    formValidate: {
                        setValue: function () {
                            this.resetValue();
                        },
                        resetValue: function () {
                            this.showSaveError = false;
                            this.isValid = {
                                name: {
                                    TH: true,
                                    EN: true
                                },
                                unique: true
                            };
                        }
                    },
                    watchFormChange: function (owner) {
                        var obj = self.programObjectives.owner[owner];

                        $timeout(function () {
                            $scope.$watch(function () {
                                var watch = [];

                                watch.push(obj.addedit.formField.name.TH);
                                watch.push(obj.addedit.formField.name.EN);

                                return watch;
                            }, function () {
                                var exit = false;

                                if (!exit)
                                {
                                    if ((obj.addedit.formField.name.TH !== obj.addedit.formValue.name.TH) ||
                                        (obj.addedit.formField.name.EN !== obj.addedit.formValue.name.EN))
                                        exit = true;
                                }

                                obj.addedit.isFormChanged = exit;
                                obj.addedit.formValidate.resetValue();
                            }, true);
                        }, 0);
                    },
                    setValue: function (owner) {
                        var deferred = $q.defer();
                        var obj = self.programObjectives.owner[owner];

                        obj.addedit.isFormChanged = false;

                        obj.addedit.formValidate.setValue();

                        $timeout(function () {
                            deferred.resolve();
                        }, 0);

                        return deferred.promise;
                    },
                    resetValue: function (owner) {
                        var obj = self.programObjectives.owner[owner];

                        obj.addedit.formValue.name.TH = "";
                        obj.addedit.formField.name.TH = obj.addedit.formValue.name.TH;

                        obj.addedit.formValue.name.EN = "";                        
                        obj.addedit.formField.name.EN = obj.addedit.formValue.name.EN;

                        $timeout(function () {
                            autosize.update($(".form-programobjectives .addedit textarea"));
                        }, 0);

                        obj.addedit.formValidate.resetValue();
                    },
                    getValue: function (owner) {
                        var obj = self.programObjectives.owner[owner];
                        var result = "";

                        if (obj.table.data.length > 0)
                        {
                            angular.forEach(obj.table.data, function (item) {
                                result += (
                                    "<row>" +
                                    "<nameTH>" + item.name.TH + "</nameTH>" +
                                    "<nameEN>" + item.name.EN + "</nameEN>" +
                                    "</row>"
                                );
                            });
                        }

                        return result;
                    },
                    saveChange: {
                        validate: function (owner) {
                            var obj = self.programObjectives.owner[owner];
                            var i = 0;
                            var id = (
                                obj.addedit.formField.name.TH +
                                obj.addedit.formField.name.EN
                            );

                            if (!obj.addedit.formField.name.TH) { obj.addedit.formValidate.isValid.name.TH = false; i++; }
                            //if (!obj.addedit.formField.name.EN) { obj.addedit.formValidate.isValid.name.EN = false; i++; }
                            if (utilServ.getObjectByValue(obj.table.data, "id", id).length > 0) { obj.addedit.formValidate.isValid.unique = false; i++; }

                            obj.addedit.formValidate.showSaveError = (i > 0 ? true : false);

                            return (i > 0 ? false : true);
                        },
                        action: function (owner) {
                            var obj = self.programObjectives.owner[owner];

                            if (this.validate(owner))
                            {
                                obj.table.data.push({
                                    id: (
                                        obj.addedit.formField.name.TH +
                                        obj.addedit.formField.name.EN
                                    ),
                                    code: "",
                                    name: {
                                        TH: obj.addedit.formField.name.TH,
                                        EN: obj.addedit.formField.name.EN
                                    }
                                });
                            }
                        }
                    }          
                }
            }
        };

        self.plos = {
            owner: {},
            new: function (key) {
                this.owner[key] = {};
                angular.copy(this.plos, this.owner[key]);
            },
            plos: {
                table: {
                    data: [],
                    formField: {
                        toggle: {}
                    },
                    reload: {
                        getData: function (owner, dataSource) {
                            var obj = self.plos.owner[owner];

                            angular.copy((dataSource ? dataSource : []), obj.addedit.formValue.plosTableList);
                            angular.copy(obj.addedit.formValue.plosTableList, obj.table.data);
                            obj.addedit.formValue.plosData = appServ.getDataOnJoinArray(obj.table.data, ["id"]);
                            obj.addedit.formField.maxId = obj.table.data.length;
                        }
                    }
                },
                addedit: {
                    showForm: false,
                    init: function (owner) {
                        this.setValue(owner).then(function () {
                            var obj = self.plos.owner[owner];

                            obj.addedit.watchFormChange(owner);
                            obj.addedit.resetValue(owner);
                        });
                    },
                    formField: {
                        maxId: 0,
                        name: {
                            TH: "",
                            EN: ""
                        }
                    },
                    formValue: {
                        name: {
                            TH: "",
                            EN: ""
                        },
                        plosTableList: [],
                        plosData: ""
                    },
                    formValidate: {
                        setValue: function () {
                            this.resetValue();
                        },
                        resetValue: function () {
                            this.showSaveError = false;
                            this.isValid = {
                                name: {
                                    TH: true,
                                    EN: true
                                },
                                unique: true
                            };
                        }
                    },
                    watchFormChange: function (owner) {
                        var obj = self.plos.owner[owner];

                        $timeout(function () {
                            $scope.$watch(function () {
                                var watch = [];

                                watch.push(obj.addedit.formField.name.TH);
                                watch.push(obj.addedit.formField.name.EN);

                                return watch;
                            }, function () {
                                var exit = false;

                                if (!exit)
                                {
                                    if ((obj.addedit.formField.name.TH !== obj.addedit.formValue.name.TH) ||
                                        (obj.addedit.formField.name.EN !== obj.addedit.formValue.name.EN))
                                        exit = true;
                                }

                                obj.addedit.isFormChanged = exit;
                                obj.addedit.formValidate.resetValue();
                            }, true);
                        }, 0);
                    },
                    setValue: function (owner) {
                        var deferred = $q.defer();
                        var obj = self.plos.owner[owner];

                        obj.addedit.isFormChanged = false;

                        obj.addedit.formValidate.setValue();

                        $timeout(function () {
                            deferred.resolve();
                        }, 0);

                        return deferred.promise;
                    },
                    resetValue: function (owner) {
                        var obj = self.plos.owner[owner];
                    
                        obj.addedit.formValue.name.TH = "";
                        obj.addedit.formField.name.TH = obj.addedit.formValue.name.TH;

                        obj.addedit.formValue.name.EN = "";                        
                        obj.addedit.formField.name.EN = obj.addedit.formValue.name.EN;

                        $timeout(function () {
                            autosize.update($(".form-plos .addedit textarea"));
                        }, 0);

                        obj.addedit.formValidate.resetValue();
                    },
                    getValue: function (owner) {
                        var obj = self.plos.owner[owner];
                        var subplosObj = {};
                        var result = "";
                        var xmlSubPLOs = "";

                        if (obj.table.data.length > 0)
                        {
                            angular.forEach(obj.table.data, function (item) {
                                subplosObj = self.subplos.owner[self.addedit.section1.owner + item.code];                                
                                xmlSubPLOs = subplosObj.addedit.getValue(self.addedit.section1.owner + item.code);

                                result += (
                                    "<row>" +
                                    "<code>" + item.code + "</code>" +
                                    "<nameTH>" + item.name.TH + "</nameTH>" +
                                    "<nameEN>" + item.name.EN + "</nameEN>" +
                                    (xmlSubPLOs ? ("<xmlSubPLOs>" + xmlSubPLOs + "</xmlSubPLOs>") : "") +
                                    "</row>"
                                );
                            });
                        }

                        return result;
                    },
                    saveChange: {
                        validate: function (owner) {
                            var obj = self.plos.owner[owner];
                            var i = 0;
                            var id = (
                                obj.addedit.formField.name.TH +
                                obj.addedit.formField.name.EN
                            );

                            if (!obj.addedit.formField.name.TH) { obj.addedit.formValidate.isValid.name.TH = false; i++; }
                            //if (!obj.addedit.formField.name.EN) { obj.addedit.formValidate.isValid.name.EN = false; i++; }
                            if (utilServ.getObjectByValue(obj.table.data, "id", id).length > 0) { obj.addedit.formValidate.isValid.unique = false; i++; }

                            obj.addedit.formValidate.showSaveError = (i > 0 ? true : false);

                            return (i > 0 ? false : true);
                        },
                        action: function (owner) {
                            var obj = self.plos.owner[owner];

                            if (this.validate(owner))
                            {
                                obj.addedit.formField.maxId += 1;

                                obj.table.data.push({
                                    id: ("PLOs" + obj.addedit.formField.maxId),
                                    code: ("PLOs" + obj.addedit.formField.maxId),
                                    name: {
                                        TH: obj.addedit.formField.name.TH,
                                        EN: obj.addedit.formField.name.EN
                                    }
                                });
                            }
                        }
                    }          
                }
            }
        };

        self.subplos = {
            owner: {},
            new: function (key) {
                this.owner[key] = {};
                angular.copy(this.subplos, this.owner[key]);
            },
            subplos: {
                table: {
                    data: [],
                    reload: {
                        getData: function (owner, dataSource) {
                            var obj = self.subplos.owner[owner];

                            angular.copy((dataSource ? dataSource : []), obj.addedit.formValue.subplosTableList);
                            angular.copy(obj.addedit.formValue.subplosTableList, obj.table.data);
                            obj.addedit.formValue.subplosData = appServ.getDataOnJoinArray(obj.table.data, ["id"]);                            
                        }
                    }
                },
                addedit: {
                    showForm: false,
                    init: function (owner) {
                        this.setValue(owner).then(function () {
                            var obj = self.subplos.owner[owner];

                            obj.addedit.watchFormChange(owner);
                            obj.addedit.resetValue(owner);
                        });
                    },
                    formField: {
                        name: {
                            TH: "",
                            EN: ""
                        }
                    },
                    formValue: {
                        name: {
                            TH: "",
                            EN: ""
                        },
                        subplosTableList: [],
                        subplosData: ""
                    },
                    formValidate: {
                        setValue: function () {
                            this.resetValue();
                        },
                        resetValue: function () {
                            this.showSaveError = false;
                            this.isValid = {
                                name: {
                                    TH: true,
                                    EN: true
                                },
                                unique: true
                            };
                        }
                    },
                    watchFormChange: function (owner) {
                        var obj = self.subplos.owner[owner];

                        $timeout(function () {
                            $scope.$watch(function () {
                                var watch = [];

                                watch.push(obj.addedit.formField.name.TH);
                                watch.push(obj.addedit.formField.name.EN);

                                return watch;
                            }, function () {
                                var exit = false;

                                if (!exit)
                                {
                                    if ((obj.addedit.formField.name.TH !== obj.addedit.formValue.name.TH) ||
                                        (obj.addedit.formField.name.EN !== obj.addedit.formValue.name.EN))
                                        exit = true;
                                }

                                obj.addedit.isFormChanged = exit;
                                obj.addedit.formValidate.resetValue();
                            }, true);
                        }, 0);
                    },
                    setValue: function (owner) {
                        var deferred = $q.defer();
                        var obj = self.subplos.owner[owner];

                        obj.addedit.isFormChanged = false;

                        obj.addedit.formValidate.setValue();

                        $timeout(function () {
                            deferred.resolve();
                        }, 0);

                        return deferred.promise;
                    },
                    resetValue: function (owner) {
                        var obj = self.subplos.owner[owner];
                    
                        obj.addedit.formValue.name.TH = "";
                        obj.addedit.formField.name.TH = obj.addedit.formValue.name.TH;

                        obj.addedit.formValue.name.EN = "";                        
                        obj.addedit.formField.name.EN = obj.addedit.formValue.name.EN;

                        $timeout(function () {
                            autosize.update($(".form-subplos .addedit textarea"));
                        }, 0);

                        obj.addedit.formValidate.resetValue();
                    },
                    getValue: function (owner) {
                        var obj = self.subplos.owner[owner];
                        var result = "";

                        if (obj.table.data.length > 0)
                        {
                            angular.forEach(obj.table.data, function (item) {
                                result += (
                                    "<row>" +
                                    "<nameTH>" + item.name.TH + "</nameTH>" +
                                    "<nameEN>" + item.name.EN + "</nameEN>" +
                                    "</row>"
                                );
                            });
                        }

                        return result;
                    },
                    saveChange: {
                        validate: function (owner) {
                            var obj = self.subplos.owner[owner];
                            var i = 0;
                            var id = (
                                obj.addedit.formField.name.TH +
                                obj.addedit.formField.name.EN
                            );

                            if (!obj.addedit.formField.name.TH) { obj.addedit.formValidate.isValid.name.TH = false; i++; }
                            //if (!obj.addedit.formField.name.EN) { obj.addedit.formValidate.isValid.name.EN = false; i++; }
                            if (utilServ.getObjectByValue(obj.table.data, "id", id).length > 0) { obj.addedit.formValidate.isValid.unique = false; i++; }

                            obj.addedit.formValidate.showSaveError = (i > 0 ? true : false);

                            return (i > 0 ? false : true);
                        },
                        action: function (owner) {
                            var obj = self.subplos.owner[owner];

                            if (this.validate(owner))
                            {
                                obj.table.data.push({
                                    id: (
                                        obj.addedit.formField.name.TH +
                                        obj.addedit.formField.name.EN
                                    ),
                                    name: {
                                        TH: obj.addedit.formField.name.TH,
                                        EN: obj.addedit.formField.name.EN
                                    }
                                });
                            }
                        }
                    }          
                }
            }
        };

        self.developPlan = {
            owner: {},
            new: function (key) {
                this.owner[key] = {};
                angular.copy(this.developPlan, this.owner[key]);
            },
            developPlan: {
                table: {
                    data: [],
                    reload: {
                        getData: function (owner, dataSource) {
                            var obj = self.developPlan.owner[owner];

                            angular.copy((dataSource ? dataSource : []), obj.addedit.formValue.developPlanTableList);
                            angular.copy(obj.addedit.formValue.developPlanTableList, obj.table.data);
                            obj.addedit.formValue.developPlanData = appServ.getDataOnJoinArray(obj.table.data, ["id"]);
                        }
                    }
                },
                addedit: {                    
                    showForm: false,
                    init: function (owner) {
                        this.setValue(owner).then(function () {
                            var obj = self.developPlan.owner[owner];

                            obj.addedit.watchFormChange(owner);
                            obj.addedit.resetValue(owner);
                        });
                    },
                    formField: {
                        plan: {
                            TH: "",
                            EN: ""
                        },
                        strategies: {
                            TH: "",
                            EN: ""
                        },
                        evidences: {
                            TH: "",
                            EN: ""
                        }
                    },
                    formValue: {
                        plan: {
                            TH: "",
                            EN: ""
                        },
                        strategies: {
                            TH: "",
                            EN: ""
                        },
                        evidences: {
                            TH: "",
                            EN: ""
                        },
                        developPlanTableList: [],
                        developPlanData: ""
                    },
                    formValidate: {
                        setValue: function () {
                            this.resetValue();
                        },
                        resetValue: function () {
                            this.showSaveError = false;
                            this.isValid = {
                                plan: {
                                    TH: true,
                                    EN: true
                                },
                                strategies: {
                                    TH: true,
                                    EN: true
                                },
                                evidences: {
                                    TH: true,
                                    EN: true
                                },
                                unique: true
                            };
                        }
                    },
                    watchFormChange: function (owner) {
                        var obj = self.developPlan.owner[owner];

                        $timeout(function () {
                            $scope.$watch(function () {
                                var watch = [];

                                watch.push(obj.addedit.formField.plan.TH);
                                watch.push(obj.addedit.formField.plan.EN);
                                watch.push(obj.addedit.formField.strategies.TH);
                                watch.push(obj.addedit.formField.strategies.EN);
                                watch.push(obj.addedit.formField.evidences.TH);
                                watch.push(obj.addedit.formField.evidences.EN);

                                return watch;
                            }, function () {
                                var exit = false;

                                if (!exit)
                                {
                                    if ((obj.addedit.formField.plan.TH !== obj.addedit.formValue.plan.TH) ||
                                        (obj.addedit.formField.plan.EN !== obj.addedit.formValue.plan.EN) ||
                                        (obj.addedit.formField.strategies.TH !== obj.addedit.formValue.strategies.TH) ||
                                        (obj.addedit.formField.strategies.EN !== obj.addedit.formValue.strategies.EN) ||
                                        (obj.addedit.formField.evidences.TH !== obj.addedit.formValue.evidences.TH) ||
                                        (obj.addedit.formField.evidences.EN !== obj.addedit.formValue.evidences.EN))
                                        exit = true;
                                }

                                obj.addedit.isFormChanged = exit;
                                obj.addedit.formValidate.resetValue();
                            }, true);
                        }, 0);
                    },
                    setValue: function (owner) {
                        var deferred = $q.defer();
                        var obj = self.developPlan.owner[owner];

                        obj.addedit.isFormChanged = false;

                        obj.addedit.formValidate.setValue();

                        $timeout(function () {
                            deferred.resolve();
                        }, 0);

                        return deferred.promise;
                    },
                    resetValue: function (owner) {
                        var obj = self.developPlan.owner[owner];
                    
                        obj.addedit.formValue.plan.TH = "";
                        obj.addedit.formField.plan.TH = obj.addedit.formValue.plan.TH;

                        obj.addedit.formValue.plan.EN = "";
                        obj.addedit.formField.plan.EN = obj.addedit.formValue.plan.EN;

                        obj.addedit.formValue.strategies.TH = "";
                        obj.addedit.formField.strategies.TH = obj.addedit.formValue.strategies.TH;

                        obj.addedit.formValue.strategies.EN = "";
                        obj.addedit.formField.strategies.EN = obj.addedit.formValue.strategies.EN;

                        obj.addedit.formValue.evidences.TH = "";
                        obj.addedit.formField.evidences.TH = obj.addedit.formValue.evidences.TH;

                        obj.addedit.formValue.evidences.EN = "";
                        obj.addedit.formField.evidences.EN = obj.addedit.formValue.evidences.EN;

                        $timeout(function () {
                            autosize.update($(".form-developplan .addedit textarea"));
                        }, 0);

                        obj.addedit.formValidate.resetValue();
                    },
                    getValue: function (owner) {
                        var obj = self.developPlan.owner[owner];
                        var result = "";

                        if (obj.table.data.length > 0)
                        {
                            angular.forEach(obj.table.data, function (item) {
                                result += (
                                    "<row>" +
                                    "<planTH>" + item.plan.TH + "</planTH>" +
                                    "<planEN>" + item.plan.EN + "</planEN>" +
                                    "<strategiesTH>" + item.strategies.TH + "</strategiesTH>" +
                                    "<strategiesEN>" + item.strategies.EN + "</strategiesEN>" +
                                    "<evidencesTH>" + item.evidences.TH + "</evidencesTH>" +
                                    "<evidencesEN>" + item.evidences.EN + "</evidencesEN>" +
                                    "</row>"
                                );
                            });
                        }

                        return result;
                    },
                    saveChange: {
                        validate: function (owner) {
                            var obj = self.developPlan.owner[owner];
                            var i = 0;
                            var id = (
                                obj.addedit.formField.plan.TH +
                                obj.addedit.formField.plan.EN +
                                obj.addedit.formField.strategies.TH +
                                obj.addedit.formField.strategies.EN +
                                obj.addedit.formField.evidences.TH +
                                obj.addedit.formField.evidences.EN
                            );

                            if (!obj.addedit.formField.plan.TH) { obj.addedit.formValidate.isValid.plan.TH = false; i++; }
                            //if (!obj.addedit.formField.plan.EN) { obj.addedit.formValidate.isValid.plan.EN = false; i++; }
                            if (!obj.addedit.formField.strategies.TH) { obj.addedit.formValidate.isValid.strategies.TH = false; i++; }
                            //if (!obj.addedit.formField.strategies.EN) { obj.addedit.formValidate.isValid.strategies.EN = false; i++; }
                            if (!obj.addedit.formField.evidences.TH) { obj.addedit.formValidate.isValid.evidences.TH = false; i++; }
                            //if (!obj.addedit.formField.evidences.EN) { obj.addedit.formValidate.isValid.evidences.EN = false; i++; }
                            if (utilServ.getObjectByValue(obj.table.data, "id", id).length > 0) { obj.addedit.formValidate.isValid.unique = false; i++; }

                            obj.addedit.formValidate.showSaveError = (i > 0 ? true : false);

                            return (i > 0 ? false : true);
                        },
                        action: function (owner) {
                            var obj = self.developPlan.owner[owner];

                            if (this.validate(owner))
                            {
                                obj.table.data.push({
                                    id: (
                                        obj.addedit.formField.plan.TH +
                                        obj.addedit.formField.plan.EN +
                                        obj.addedit.formField.strategies.TH +
                                        obj.addedit.formField.strategies.EN +
                                        obj.addedit.formField.evidences.TH +
                                        obj.addedit.formField.evidences.EN
                                    ),
                                    plan: {
                                        TH: obj.addedit.formField.plan.TH,
                                        EN: obj.addedit.formField.plan.EN
                                    },
                                    strategies: {
                                        TH: obj.addedit.formField.strategies.TH,
                                        EN: obj.addedit.formField.strategies.EN
                                    },
                                    evidences: {
                                        TH: obj.addedit.formField.evidences.TH,
                                        EN: obj.addedit.formField.evidences.EN
                                    }
                                });
                            }
                        }
                    }          
                }
            }
        };
    })

    .controller("TQFInfo.TQF2.group3Ctrl", function ($scope, $timeout, $q, $location, $filter, utilServ, appServ, dictServ, pageRouteServ, facultyServ, programmeServ, TQFServ, inputTypeServ, subjectServ, instructorServ) {
        var self = this;

        self.owner = "tqf2g3";
        self.maxSection = 3;
        self.accordionGroup = {};

        self.addedit = {
            showForm: false,
            template: {
                content: "",
                action: "",
                init: function () {
                    if (appServ.isUser && facultyServ.isFaculty && programmeServ.isProgram && self.addedit.showForm)
                    {
                        utilServ.getDialogPreloadingWithDict(["msgPreloading", "loading"]);

                        this.content = pageRouteServ.pageObject.TQF2.group3.addedit.template;
                    }
                },
                remove: function () {
                    utilServ.removeCacheTemplate(this.content);
                    this.content = "";
                }
            },
            init: function () {
                if (appServ.isUser && facultyServ.isFaculty && programmeServ.isProgram)
                {
                    var action = self.addedit.template.action;

                    this.setValue().then(function () {
                        self.addedit[action].setValue();
                        programmeServ.isProgram = TQFServ.isProgramOnGroup(self, programmeServ.dataRow);

                        if (programmeServ.isProgram)
                        {
                            self.addedit.getDataMaster().then(function () {
                                angular.forEach(utilServ.getArrayNumber(self.maxSection), function (item) {
                                    self.addedit["section" + item].setValue();
                                });

                                self.addedit.watchFormChange();
                                self.addedit.resetValue();
                                self.addedit.showForm = true;

                                appServ.closeDialogPreloading();
                            });
                        }
                    });
                }
                else
                    self.addedit.showForm = false;
            },
            watchFormChange: function () {
                angular.forEach(utilServ.getArrayNumber(self.maxSection), function (item) {
                    self.addedit["section" + item].watchFormChange();
                });

                $timeout(function () {
                    $scope.$watch(function () {
                        var watch = [];

                        angular.forEach(utilServ.getArrayNumber(self.maxSection), function (item) {
                            watch.push(self.addedit["section" + item].isFormChanged);
                        });

                        return watch;
                    }, function () {
                        var exit = false;

                        if (!exit)
                        {
                            angular.forEach(utilServ.getArrayNumber(self.maxSection), function (item) {
                                if (self.addedit["section" + item].isFormChanged)
                                {
                                    exit = true;
                                    return;
                                }
                            });
                        }

                        self.addedit.isFormChanged = exit;
                    }, true);
                }, 0);
            },            
            formField: {
                dLevel: "B"
            },
            formValue: {
            },
            formValidate: {
                setValue: function () {
                    this.resetValue();
                },
                resetValue: function () {
                    this.showSaveError = false;
                    this.isValid = {};
                }
            },
            setValue: function () {
                var deferred = $q.defer();

                this.isAdd = false;
                this.isEdit = false;
                this.isUpdate = false;
                this.isDelete = false;
                this.isFormChanged = false;

                this.formValidate.setValue();

                angular.forEach(utilServ.getArrayNumber(self.maxSection), function (item) {
                    self.accordionGroup["section" + item] = {
                        isOpen: false
                    };
                });

                programmeServ.getDataSourceOnGroup(3).then(function () {
                    $timeout(function () {
                        deferred.resolve();
                    }, 0);
                });

                return deferred.promise;
            },
            getDataMaster: function () {
                var deferred = $q.defer();

                inputTypeServ.getDataSource({
                    action: "getlist",
                    params: [
                        "",
                        ("curYear=" + utilServ.curYear.TH),
                        ("dLevel=" + self.addedit.formField.dLevel)
                    ].join("&")
                }).then(function (result) {
                    appServ.table.dataSource["eduSystem"]       = angular.copy($filter("filter")(result, { groupType: "eduSystem" }));
                    appServ.table.dataSource["devMng"]          = angular.copy($filter("filter")(result, { groupType: "devMng" }));
                    appServ.table.dataSource["eduStudyType"]    = angular.copy($filter("filter")(result, { groupType: "studyType" }));

                    $timeout(function () {
                        deferred.resolve();
                    }, 0);
                });

                return deferred.promise;
            },
            resetValue: function () {
                if (this.isAdd || this.isEdit || this.isUpdate)
                {
                    angular.forEach(utilServ.getArrayNumber(self.maxSection), function (item) {
                        self.addedit["section" + item].resetValue();
                        self.accordionGroup["section" + item].isOpen = false;
                    });

                    this.formValidate.resetValue();
                    utilServ.gotoTopPage();
                }
            },
            getValue: function () {
                var result = {
                    tableType: (programmeServ.dataRow.tableType ? programmeServ.dataRow.tableType : "temp"),
                    id: (programmeServ.dataRow.id ? programmeServ.dataRow.id : ""),
                    facultyId: facultyServ.facultyInfo.id,
                    programId: (programmeServ.dataRow.programId ? programmeServ.dataRow.programId : ""),
                    programCode: (programmeServ.dataRow.programCode ? programmeServ.dataRow.programCode : ""),
                    majorId: (programmeServ.dataRow.majorId ? programmeServ.dataRow.majorId : ""),
                    majorCode: (programmeServ.dataRow.majorCode ? programmeServ.dataRow.majorCode : ""),
                    groupNum: (programmeServ.dataRow.groupNum ? programmeServ.dataRow.groupNum : ""),
                    courseYear: (programmeServ.dataRow.courseYear ? programmeServ.dataRow.courseYear : "")
                };

                angular.forEach(utilServ.getArrayNumber(self.maxSection), function (item) {
                    angular.extend(result, self.addedit["section" + item].saveChange.value);
                });

                return result;
            },
            add: {
                init: function () {
                    self.addedit.init();
                },
                setValue: function () {
                    self.addedit.isAdd = true;
                    self.addedit.isEdit = false;
                    self.addedit.isUpdate = false;
                    self.addedit.isDelete = false;
                }
            },
            edit: {
                init: function () {
                    self.addedit.init();
                },
                setValue: function () {
                    self.addedit.isAdd = false;
                    self.addedit.isEdit = true;
                    self.addedit.isUpdate = false;
                    self.addedit.isDelete = false;
                }
            },
            update: {
                init: function () {
                    self.addedit.init();
                },
                setValue: function () {
                    self.addedit.isAdd = false;
                    self.addedit.isEdit = false;
                    self.addedit.isUpdate = true;
                    self.addedit.isDelete = false;
                }
            },
            saveChange: {
                value: {},
                validate: function () {
                    var i = 0;

                    if (self.addedit.isAdd || self.addedit.isEdit || self.addedit.isUpdate)
                    {
                        angular.forEach(utilServ.getArrayNumber(self.maxSection), function (item) {
                            if (!self.addedit["section" + item].saveChange.validate())
                            {
                                self.accordionGroup["section" + item].isOpen = true;
                                i++;
                            }
                        });
                    }

                    return (i > 0 ? false : true);
                },
                action: function () {
                    angular.forEach(utilServ.getArrayNumber(self.maxSection), function (item) {
                        self.addedit["section" + item].saveChange.action();
                    });

                    this.value = angular.copy(self.addedit.getValue());

                    if (this.validate())
                    {
                        var action;

                        if (self.addedit.isAdd)     action = "add";
                        if (self.addedit.isEdit)    action = "edit";
                        if (self.addedit.isUpdate)  action = "update";
                        if (self.addedit.isDelete)  action = "remove";

                        programmeServ.saveChange.action({
                            action: action,
                            data: self.addedit.getValue()
                        }).then(function (result) {
                            if (result.status)
                            {
                                if (result.mode === "add")
                                {
                                    self.addedit.isAdd = true;
                                    self.addedit.isEdit = false;
                                    self.addedit.isUpdate = false;
                                    self.addedit.isDelete = false;
                                }

                                if (self.addedit.isAdd)
                                    $location.path("/TQFInfo/TQF2/" + (result.action === "add" ? "edit" : result.action) + "/temp/" + result.id).replace();

                                if (self.addedit.isEdit || self.addedit.isUpdate)
                                {
                                    var action = self.addedit.template.action;

                                    programmeServ.getDataSourceOnGroup(3).then(function () {
                                        self.addedit[action].setValue();
                                        angular.forEach(utilServ.getArrayNumber(self.maxSection), function (item) {
                                            self.addedit["section" + item].isFormChanged = false;
                                        });
                                        self.addedit.isFormChanged = false;
                                        self.addedit.resetValue();
                                    });
                                }
                            }
                        });
                    }
                    else
                    {
                        utilServ.gotoTopPage();
                        utilServ.dialogErrorWithDict(["save", "error"], function () { });
                    }
                }
            },
            section1: {
                owner: (self.owner + "s1"),
                formField: {
                    eduSystem: [],
                    eduSystemSelected: {},
                    eduSystemSelectedLast: {},
                    eduSystemRemark: {},
                    summerSelected: "",
                    compareCredit: ""
                },
                formValue: {
                    eduSystem: [],
                    eduSystemData: "",                
                    summer: "",
                    compareCredit: ""
                },
                formValidate: {
                    setValue: function () {
                        this.resetValue();
                    },
                    resetValue: function () {
                        this.showSaveError = false;
                        this.isValid = {};
                    }
                },
                watchFormChange: function () { 
                    var eduSystemData = "";

                    $timeout(function () {
                        $scope.$watch(function () {
                            var watch = [];

                            eduSystemData = appServ.getDataOnJoinArray(self.addedit.section1.formField.eduSystem, ["id"]);
                            watch.push(eduSystemData);

                            watch.push(self.addedit.section1.formField.summerSelected);
                            watch.push(self.addedit.section1.formField.compareCredit);

                            return watch;
                        }, function () {
                            var exit = false;

                            if (!exit)
                            {
                                if ((eduSystemData !== self.addedit.section1.formValue.eduSystemData) ||
                                    (self.addedit.section1.formField.summerSelected !== self.addedit.section1.formValue.summer) ||
                                    (self.addedit.section1.formField.compareCredit !== self.addedit.section1.formValue.compareCredit))
                                    exit = true;
                            }
                            
                            self.addedit.section1.isFormChanged = exit;
                            self.addedit.section1.formValidate.resetValue();
                        }, true);
                    }, 0);
                },
                setValue: function () {
                    this.isFormChanged = false;
                    this.isCheckedEduSystem = {};

                    this.formValidate.setValue();
                },
                resetValue: function () {                    
                    this.formValue.eduSystem = [];
                    this.formValue.eduSystemData = "";
                    angular.copy(this.formValue.eduSystem, this.formField.eduSystem);
                    TQFServ.inputTypeRemark.uncheck(appServ.table.dataSource.eduSystem, "eduSystem", this.formField, this.isCheckedEduSystem);

                    this.formValue.summer = "";
                    this.formField.summerSelected = this.formValue.summer;

                    this.formValue.compareCredit = "";                                                            
                    this.formField.compareCredit = this.formValue.compareCredit;

                    $timeout(function () {
                        autosize.update($(".section1 textarea"));
                    }, 0);

                    this.formValidate.resetValue();
                },
                getValue: function () {
                    var result = {
                        xmlEduSystem: TQFServ.inputTypeRemark.getValue("eduSystem", this.formField.eduSystem, this.formField),
                        isSummer: (this.formField.summerSelected ? this.formField.summerSelected : ""),
                        compareCredit: (this.formField.compareCredit ? this.formField.compareCredit : "")
                    };

                    return result;
                },
                saveChange: {
                    value: {},
                    validate: function () {
                        var exit = false;

                        if (this.value.xmlEduSystem ||
                            this.value.isSummer ||
                            this.value.compareCredit)
                            exit = true;

                        return exit;
                    },
                    action: function () {
                        this.value = angular.copy(self.addedit.section1.getValue());
                    }
                }
            },
            section2: {
                owner: (self.owner + "s2"),
                formField: {
                    devMng: {},
                    costValue: {
                        incomeStudent: "",
                        costStudent: "",
                        costEffective: "",
                        studentsEnrolled: "",
                        notCostEffective: ""
                    },
                    costBudget: {
                        other: ""
                    },
                    eduStudyType: [],
                    eduStudyTypeSelected: {},
                    eduStudyTypeSelectedLast: {},
                    eduStudyTypeRemark: {},
                    creditTransfer: ""
                },
                formValue: {
                    devMng: {},
                    costValue: {
                        incomeStudent: "",
                        costStudent: "",
                        costEffective: "",
                        studentsEnrolled: "",
                        notCostEffective: ""
                    },
                    costBudget: {
                        other: ""
                    },
                    eduStudyType: [],
                    eduStudyTypeData: "",
                    creditTransfer: ""
                },
                formValidate: {
                    setValue: function () {
                        this.resetValue();
                    },
                    resetValue: function () {
                        this.showSaveError = false;
                        this.isValid = {};
                    }
                },
                watchFormChange: function () { 
                    var planQuantityObj = self.planQuantity.owner[this.owner];
                    var planQuantityData = "";                    
                    var costBudgetData = {};                    
                    var eduStudyTypeData = "";

                    $timeout(function () {
                        $scope.$watch(function () {
                            var i = 0;
                            var watch = [];
                            var planQuantity = [];
                            var year = "";
                            var costBudgetObj = {};

                            angular.forEach(appServ.table.dataSource.devMng, function (item) {
                                watch.push(self.addedit.section2.formField.devMng[item.id]);
                            });

                            i = 0;
                            angular.forEach(planQuantityObj.table.data, function (item1) {                                
                                planQuantity[i] = item1.id;

                                if (planQuantityObj.addedit.formField.startYear)
                                {
                                    year = "";
                                    angular.forEach(utilServ.getArrayNumber(planQuantityObj.table.maxCol), function (item2) {
                                        year = ((planQuantityObj.addedit.formField.startYear - 0) + (item2 - 1));
                                        planQuantity[i] += (year + "" + (item1.year[year] ? item1.year[year] : ""));
                                    });
                                }

                                i++;
                            });
                            planQuantityData = planQuantity.join("");
                            watch.push(planQuantityData);

                            watch.push(self.addedit.section2.formField.costValue.incomeStudent);
                            watch.push(self.addedit.section2.formField.costValue.costStudent);
                            watch.push(self.addedit.section2.formField.costValue.costEffective);
                            watch.push(self.addedit.section2.formField.costValue.studentsEnrolled);
                            watch.push(self.addedit.section2.formField.costValue.notCostEffective);

                            angular.forEach(dictServ.dict.costBudget, function (item) {
                                costBudgetObj = self.costBudget.owner[self.addedit.section2.owner + item.id];

                                costBudgetData[item.id] = appServ.getDataOnJoinArray(costBudgetObj.table.data, ["id"]);
                                watch.push(costBudgetData[item.id]);
                            });

                            watch.push(self.addedit.section2.formField.costBudget.other);

                            eduStudyTypeData = appServ.getDataOnJoinArray(self.addedit.section2.formField.eduStudyType, ["id"]);
                            watch.push(eduStudyTypeData);

                            watch.push(self.addedit.section2.formField.creditTransfer);

                            return watch;
                        }, function () {                            
                            var exit = false;
                            var costBudgetObj = {};

                            if (!exit)
                            {
                                if ((planQuantityData !== planQuantityObj.addedit.formValue.planQuantityData) ||
                                    (self.addedit.section2.formField.costValue.incomeStudent !== self.addedit.section2.formValue.costValue.incomeStudent) ||
                                    (self.addedit.section2.formField.costValue.costStudent !== self.addedit.section2.formValue.costValue.costStudent) ||
                                    (self.addedit.section2.formField.costValue.costEffective !== self.addedit.section2.formValue.costValue.costEffective) ||
                                    (self.addedit.section2.formField.costValue.studentsEnrolled !== self.addedit.section2.formValue.costValue.studentsEnrolled) ||
                                    (self.addedit.section2.formField.costValue.notCostEffective !== self.addedit.section2.formValue.costValue.notCostEffective) ||
                                    (self.addedit.section2.formField.costBudget.other !== self.addedit.section2.formValue.costBudget.other) ||
                                    (eduStudyTypeData !== self.addedit.section2.formValue.eduStudyTypeData) ||
                                    (self.addedit.section2.formField.creditTransfer !== self.addedit.section2.formValue.creditTransfer))
                                    exit = true;
                            }

                            if (!exit)
                            {
                                angular.forEach(appServ.table.dataSource.devMng, function (item) {
                                    if (self.addedit.section2.formField.devMng[item.id] !== self.addedit.section2.formValue.devMng[item.id])
                                    {
                                        exit = true;
                                        return;
                                    }
                                });
                            }

                            if (!exit)
                            {
                                angular.forEach(dictServ.dict.costBudget, function (item) {
                                    costBudgetObj = self.costBudget.owner[self.addedit.section2.owner + item.id];

                                    if (costBudgetData[item.id] !== costBudgetObj.addedit.formValue.costBudgetData)
                                    {
                                        exit = true;
                                        return;
                                    }
                                });
                            }
                            
                            self.addedit.section2.isFormChanged = exit;
                            self.addedit.section2.formValidate.resetValue();
                        }, true);
                    }, 0);
                },
                setValue: function () {
                    this.isFormChanged = false;
                    this.isCheckedEduStudyType = {};

                    this.formValidate.setValue();
                },
                resetValue: function () {
                    var planQuantityObj = self.planQuantity.owner[this.owner];
                    var owner = "";
                    var costBudgetObj = {};

                    angular.forEach(appServ.table.dataSource.devMng, function (item) {
                        self.addedit.section2.formValue.devMng[item.id] = "";
                        self.addedit.section2.formField.devMng[item.id] = self.addedit.section2.formValue.devMng[item.id];
                    });

                    planQuantityObj.table.reload.getData(this.owner);

                    this.formValue.costValue.incomeStudent = "";
                    this.formField.costValue.incomeStudent = this.formValue.costValue.incomeStudent;

                    this.formValue.costValue.costStudent = "";
                    this.formField.costValue.costStudent = this.formValue.costValue.costStudent;

                    this.formValue.costValue.costEffective = "";
                    this.formField.costValue.costEffective = this.formValue.costValue.costEffective;

                    this.formValue.costValue.studentsEnrolled = "";
                    this.formField.costValue.studentsEnrolled = this.formValue.costValue.studentsEnrolled;

                    this.formValue.costValue.notCostEffective = "";
                    this.formField.costValue.notCostEffective = this.formValue.costValue.notCostEffective;

                    angular.forEach(dictServ.dict.costBudget, function (item) {
                        owner = (self.addedit.section2.owner + item.id);
                        costBudgetObj = self.costBudget.owner[owner];

                        costBudgetObj.table.reload.getData(owner);
                    });

                    this.formValue.costBudget.other = "";
                    this.formField.costBudget.other = this.formValue.costBudget.other;

                    this.formValue.eduStudyType = [];
                    this.formValue.eduStudyTypeData = "";
                    angular.copy(this.formValue.eduStudyType, this.formField.eduStudyType);
                    TQFServ.inputTypeRemark.uncheck(appServ.table.dataSource.eduStudyType, "eduStudyType", this.formField, this.isCheckedEduStudyType);

                    this.formValue.creditTransfer = "";
                    this.formField.creditTransfer = this.formValue.creditTransfer;

                    $timeout(function () {
                        autosize.update($(".section2 textarea"));
                    }, 0);

                    this.formValidate.resetValue();
                },
                getValue: function () {
                    var planQuantityObj = self.planQuantity.owner[this.owner];
                    var owner = "";
                    var costBudgetObj = {};
                    var xmlCostEffective = "";
                    var xmlCostBudget = "";
                    var xmlCostDebit = "";
                    var xmlCostCredit = "";

                    if (this.formField.costValue.incomeStudent ||
                        this.formField.costValue.costStudent ||
                        this.formField.costValue.costEffective ||
                        this.formField.costValue.studentsEnrolled ||
                        this.formField.costValue.notCostEffective ||
                        this.formField.costBudget.other)
                    {
                        xmlCostEffective = (
                            "<row>" +
                            "<incomeStudent>" + this.formField.costValue.incomeStudent + "</incomeStudent>" +
                            "<costStudent>" + this.formField.costValue.costStudent + "</costStudent>" +
                            "<costEffective>" + this.formField.costValue.costEffective + "</costEffective>" +
                            "<studentsEnrolled>" + this.formField.costValue.studentsEnrolled + "</studentsEnrolled>" +
                            "<notCostEffective>" + this.formField.costValue.notCostEffective + "</notCostEffective>" +
                            "<other>" + this.formField.costBudget.other + "</other>" +
                            "</row>"
                        );
                    }

                    angular.forEach(dictServ.dict.costBudget, function (item) {
                        owner = (self.addedit.section2.owner + item.id);
                        costBudgetObj = self.costBudget.owner[owner];
                        xmlCostBudget = costBudgetObj.addedit.getValue(owner);

                        if (item.id === "costDebit") xmlCostDebit = xmlCostBudget;
                        if (item.id === "costCredit") xmlCostCredit = xmlCostBudget;
                    });

                    var result = {
                        xmlDevMng: TQFServ.inputTypeRemark.getValue("devMng", appServ.table.dataSource.devMng, this.formField),
                        xmlPlanQuantity: planQuantityObj.addedit.getValue(this.owner),
                        xmlCostEffective: xmlCostEffective,
                        xmlCostDebit: xmlCostDebit,
                        xmlCostCredit: xmlCostCredit,
                        xmlEduStudyType: TQFServ.inputTypeRemark.getValue("eduStudyType", this.formField.eduStudyType, this.formField),
                        creditTransfer: (this.formField.creditTransfer ? this.formField.creditTransfer : "")
                    };

                    return result;
                },
                saveChange: {
                    value: {},
                    validate: function () {
                        var exit = false;

                        if (this.value.xmlDevMng ||
                            this.value.xmlPlanQuantity ||
                            this.value.xmlCostEffective ||
                            this.value.xmlCostDebit ||
                            this.value.xmlCostCredit ||
                            this.value.xmlEduStudyType ||
                            this.value.creditTransfer)
                            exit = true;

                        return exit;
                    },
                    action: function () {
                        this.value = angular.copy(self.addedit.section2.getValue());
                    }
                }
            },
            section3: {
                owner: (self.owner + "s3"),
                formField: {
                    courseCredit: {
                        total: "",
                        generalCourses: "",
                        specificCourses: "",
                        electiveCourses: ""
                    }
                },
                formValue: {
                    courseCredit: {
                        total: "",
                        generalCourses: "",
                        specificCourses: "",
                        electiveCourses: ""
                    }
                },
                formValidate: {
                    setValue: function () {
                        this.resetValue();
                    },
                    resetValue: function () {
                        this.showSaveError = false;
                        this.isValid = {};
                    }
                },
                watchFormChange: function () {
                    var subjectGroupObj = self.subjectGroup.owner[this.owner];
                    var subjectGroupData = "";
                    var defineCourseCodesData = {};
                    var planOfStudyData = {};
                    var instructorData = {};

                    subjectServ.form.watchFormChange();                    
                    instructorServ.form.watchFormChange();

                    $timeout(function () {                                 
                        $scope.$watch(function () {
                            var watch = [];
                            var defineCourseCodesObj = {};
                            var subjectServObj = {};
                            var instructorServObj = {};

                            watch.push(self.addedit.section3.formField.courseCredit.total);
                            watch.push(self.addedit.section3.formField.courseCredit.generalCourses);
                            watch.push(self.addedit.section3.formField.courseCredit.specificCourses);
                            watch.push(self.addedit.section3.formField.courseCredit.electiveCourses);

                            subjectGroupData = appServ.getDataOnJoinArray(subjectGroupObj.table.data, ["id"]);
                            watch.push(subjectGroupData);

                            angular.forEach(dictServ.dict.defineCourseCodes.fourMainAlphabets.alphabetGroup, function (item) {
                                defineCourseCodesObj = self.defineCourseCodes.owner[self.addedit.section3.owner + item.id];

                                defineCourseCodesData[item.id] = appServ.getDataOnJoinArray(defineCourseCodesObj.table.data, ["id"]);
                                watch.push(defineCourseCodesData[item.id]);
                            });

                            defineCourseCodesObj = self.defineCourseCodes.owner[self.addedit.section3.owner + self.defineCourseCodes.threeDigitsFollowCourseInitials.owner];
                            defineCourseCodesData[self.defineCourseCodes.threeDigitsFollowCourseInitials.owner] = appServ.getDataOnJoinArray(defineCourseCodesObj.table.data, ["id"]);
                            watch.push(defineCourseCodesData[self.defineCourseCodes.threeDigitsFollowCourseInitials.owner]);

                            angular.forEach(utilServ.getArrayNumber(appServ.maxClassYear), function (item1) {
                                angular.forEach(utilServ.getArrayNumber(appServ.maxSemester), function (item2) {
                                    subjectServObj = subjectServ.form.owner[self.addedit.section3.owner + item1 + item2];

                                    planOfStudyData[item1 + "" + item2] = appServ.getDataOnJoinArray(subjectServObj.table.data, ["id"]);
                                    watch.push(planOfStudyData[item1 + "" + item2]);
                                });
                            });

                            angular.forEach(dictServ.dict.instructor.group, function (item) {
                                if (item.type === "program")
                                {
                                    instructorServObj = instructorServ.form.owner[self.addedit.section3.owner + item.id];

                                    instructorData[item.id] = appServ.getDataOnJoinArray(instructorServObj.table.data, ["id"]);
                                    watch.push(instructorData[item.id]);
                                }
                            });

                            return watch;
                        }, function () {                                
                            var exit = false;
                            var defineCourseCodesObj = {};
                            var subjectServObj = {};
                            var instructorServObj = {};

                            if (!exit)
                            {
                                if ((self.addedit.section3.formField.courseCredit.total !== self.addedit.section3.formValue.courseCredit.total) ||
                                    (self.addedit.section3.formField.courseCredit.generalCourses !== self.addedit.section3.formValue.courseCredit.generalCourses) ||
                                    (self.addedit.section3.formField.courseCredit.specificCourses !== self.addedit.section3.formValue.courseCredit.specificCourses) ||
                                    (self.addedit.section3.formField.courseCredit.electiveCourses !== self.addedit.section3.formValue.courseCredit.electiveCourses) ||
                                    (subjectGroupData !== subjectGroupObj.addedit.formValue.subjectGroupData))
                                    exit = true;
                            }

                            if (!exit)
                            {
                                angular.forEach(dictServ.dict.defineCourseCodes.fourMainAlphabets.alphabetGroup, function (item) {
                                    defineCourseCodesObj = self.defineCourseCodes.owner[self.addedit.section3.owner + item.id];

                                    if (defineCourseCodesData[item.id] !== defineCourseCodesObj.addedit.formValue.defineCourseCodesData)
                                    {
                                        exit = true;
                                        return;
                                    }
                                });
                            }

                            if (!exit)
                            {
                                defineCourseCodesObj = self.defineCourseCodes.owner[self.addedit.section3.owner + self.defineCourseCodes.threeDigitsFollowCourseInitials.owner];

                                if (defineCourseCodesData[self.defineCourseCodes.threeDigitsFollowCourseInitials.owner] !== defineCourseCodesObj.addedit.formValue.defineCourseCodesData)
                                    exit = true;
                            }

                            if (!exit)
                            {
                                angular.forEach(utilServ.getArrayNumber(appServ.maxClassYear), function (item1) {
                                    angular.forEach(utilServ.getArrayNumber(appServ.maxSemester), function (item2) {
                                        subjectServObj = subjectServ.form.owner[self.addedit.section3.owner + item1 + item2];

                                        if (planOfStudyData[item1 + "" + item2] !== subjectServObj.addedit.formValue.subjectData)
                                        {
                                            exit = true;
                                            return;
                                        }
                                    });
                                });
                            }

                            if (!exit)
                            {
                                angular.forEach(dictServ.dict.instructor.group, function (item) {
                                    if (item.type === "program")
                                    {
                                        instructorServObj = instructorServ.form.owner[self.addedit.section3.owner + item.id];

                                        if (instructorData[item.id] !== instructorServObj.addedit.formValue.instructorData)
                                        {
                                            exit = true;
                                            return;
                                        }
                                    }
                                });
                            }
                            
                            self.addedit.section3.isFormChanged = exit;
                            self.addedit.section3.formValidate.resetValue();
                        }, true);
                    }, 0);
                },
                setValue: function () {
                    this.isFormChanged = false;

                    this.formValidate.setValue();
                },
                resetValue: function () {
                    var subjectGroupObj = self.subjectGroup.owner[this.owner];
                    var owner = "";
                    var defineCourseCodesObj = {};
                    var subjectServObj = {};
                    var instructorServObj = {};

                    this.formValue.courseCredit.total = "";
                    this.formField.courseCredit.total = this.formValue.courseCredit.total;

                    this.formValue.courseCredit.generalCourses = "";
                    this.formField.courseCredit.generalCourses = this.formValue.courseCredit.generalCourses;

                    this.formValue.courseCredit.specificCourses = "";
                    this.formField.courseCredit.specificCourses = this.formValue.courseCredit.specificCourses;

                    this.formValue.courseCredit.electiveCourses = "";
                    this.formField.courseCredit.electiveCourses = this.formValue.courseCredit.electiveCourses;

                    subjectGroupObj.table.reload.getData(this.owner);

                    angular.forEach(dictServ.dict.defineCourseCodes.fourMainAlphabets.alphabetGroup, function (item) {
                        owner = (self.addedit.section3.owner + item.id);
                        defineCourseCodesObj = self.defineCourseCodes.owner[owner];

                        defineCourseCodesObj.table.reload.getData(owner);
                    });

                    owner = (this.owner + self.defineCourseCodes.threeDigitsFollowCourseInitials.owner);
                    defineCourseCodesObj = self.defineCourseCodes.owner[owner];

                    defineCourseCodesObj.table.reload.getData(owner);

                    angular.forEach(utilServ.getArrayNumber(appServ.maxClassYear), function (item1) {
                        angular.forEach(utilServ.getArrayNumber(appServ.maxSemester), function (item2) {
                            owner = (self.addedit.section3.owner + item1 + item2);
                            subjectServObj = subjectServ.form.owner[owner];

                            subjectServObj.table.reload.getData(owner);
                        });
                    });

                    angular.forEach(dictServ.dict.instructor.group, function (item) {
                        if (item.type === "program")
                        {
                            owner = (self.addedit.section3.owner + item.id);
                            instructorServObj = instructorServ.form.owner[owner];
                        
                            instructorServObj.table.reload.getData(owner);
                        }
                    });

                    this.formValidate.resetValue();
                },
                getValue: function () {                                        
                    var owner = "";
                    var value = "";                   
                    var xmlValue = "";
                    var xmlCourseCreditStructure = "";

                    if (this.formField.courseCredit.total ||
                        this.formField.courseCredit.generalCourses ||
                        this.formField.courseCredit.specificCourses ||
                        this.formField.courseCredit.electiveCourses)
                    {
                        xmlCourseCreditStructure = (
                            "<row>" +
                            "<total>" + this.formField.courseCredit.total + "</total>" +
                            "<generalCourses>" + this.formField.courseCredit.generalCourses + "</generalCourses>" +
                            "<specificCourses>" + this.formField.courseCredit.specificCourses + "</specificCourses>" +
                            "<electiveCourses>" + this.formField.courseCredit.electiveCourses + "</electiveCourses>" +                    
                            "</row>"
                        );
                    }

                    var subjectGroupObj = self.subjectGroup.owner[this.owner];
                    var defineCourseCodesObj = {};
                    var xmlCourseSubjectStructure = "";                    
                    var xmlSubjectGroup = subjectGroupObj.addedit.getValue(this.owner);
                    var xmlDefineCourseCodes = "";                   

                    angular.forEach(dictServ.dict.defineCourseCodes.fourMainAlphabets.alphabetGroup, function (item) {
                        owner = (self.addedit.section3.owner + item.id);
                        defineCourseCodesObj = self.defineCourseCodes.owner[owner];
                        value = defineCourseCodesObj.addedit.getValue(owner);                        
                        xmlDefineCourseCodes += (value ? ("<" + item.id + ">" + value + "</" + item.id + ">") : "");
                    });

                    owner = (this.owner + self.defineCourseCodes.threeDigitsFollowCourseInitials.owner);
                    defineCourseCodesObj = self.defineCourseCodes.owner[owner];
                    value = defineCourseCodesObj.addedit.getValue(owner);                        
                    xmlDefineCourseCodes += (value ? ("<" + self.defineCourseCodes.threeDigitsFollowCourseInitials.owner + ">" + value + "</" + self.defineCourseCodes.threeDigitsFollowCourseInitials.owner + ">") : "");

                    if (xmlSubjectGroup ||
                        xmlDefineCourseCodes)
                    {
                        xmlCourseSubjectStructure = (
                            "<row>" +
                            "<subjectGroup>" + (xmlSubjectGroup ? xmlSubjectGroup : "") + "</subjectGroup>" +
                            "<defineCourseCodes>" + xmlDefineCourseCodes + "</defineCourseCodes>" +
                            "</row>"
                        );
                    }

                    var subjectServObj = {};
                    var xmlPlanOfStudy = "";

                    angular.forEach(utilServ.getArrayNumber(appServ.maxClassYear), function (item1) {
                        xmlValue = "";

                        angular.forEach(utilServ.getArrayNumber(appServ.maxSemester), function (item2) {
                            owner = (self.addedit.section3.owner + item1 + item2);
                            subjectServObj = subjectServ.form.owner[owner];
                            value = subjectServObj.addedit.getValue(owner);
                            xmlValue += (value ? ("<semester" + item2 + ">" + value + "</semester" + item2 + ">") : "");
                        });

                        xmlPlanOfStudy += (xmlValue ? ("<year" + item1 + ">" + xmlValue + "</year" + item1 + ">") : "");
                    });

                    if (xmlPlanOfStudy)
                    {
                        xmlPlanOfStudy = (
                            "<row>" +
                            xmlPlanOfStudy +
                            "</row>"
                        );
                    }

                    var instructorServObj = {};
                    var xmlInstructor = "";
                    var xmlInstructorCourse = "";
                    var xmlInstructorRegular = "";
                    var xmlInstructorSpectial = "";

                    angular.forEach(dictServ.dict.instructor.group, function (item) {
                        if (item.type === "program")
                        {
                            owner = (self.addedit.section3.owner + item.id);
                            instructorServObj = instructorServ.form.owner[owner];
                            xmlInstructor = instructorServObj.addedit.getValue(owner);

                            if (item.id === "instructorCourse") xmlInstructorCourse = xmlInstructor;
                            if (item.id === "instructorRegular") xmlInstructorRegular = xmlInstructor;
                            if (item.id === "instructorSpectial") xmlInstructorSpectial = xmlInstructor;
                        }
                    });


                    var result = {
                        xmlCourseCreditStructure: xmlCourseCreditStructure,
                        xmlCourseSubjectStructure: xmlCourseSubjectStructure,
                        xmlPlanOfStudy: xmlPlanOfStudy,
                        xmlInstructorCourse: xmlInstructorCourse,
                        xmlInstructorRegular: xmlInstructorRegular,
                        xmlInstructorSpectial: xmlInstructorSpectial
                    };

                    return result;
                },
                saveChange: {
                    value: {},
                    validate: function () {
                        var exit = false;

                        if (this.value.xmlCourseCreditStructure ||
                            this.value.xmlCourseSubjectStructure ||
                            this.value.xmlPlanOfStudy ||
                            this.value.xmlInstructorCourse ||
                            this.value.xmlInstructorRegular ||
                            this.value.xmlInstructorSpectial)
                            exit = true;

                        return exit;
                    },
                    action: function () {
                        this.value = angular.copy(self.addedit.section3.getValue());
                    }
                }
            }
        };

        self.planQuantity = {
            owner: {},
            new: function (key) {
                this.owner[key] = {};
                angular.copy(this.planQuantity, this.owner[key]);
            },            
            planQuantity: {
                table: {
                    maxCol: 5,
                    data: [],
                    reload: {
                        getData: function (owner) {
                            var i = 0;
                            var obj = self.planQuantity.owner[owner];
                            var year = "";
                            var planQuantity = [];
                            var planQuantityData = {};

                            obj.addedit.formValue.startYear = "";
                            obj.addedit.formField.startYear = obj.addedit.formValue.startYear;

                            obj.addedit.formValue.planQuantityTableList = [];                            
                            i = 0;
                            angular.forEach(dictServ.dict.planQuantity.table.numEp, function (item1) {
                                planQuantity[i] = item1.id;
                                planQuantityData["year"] = {};

                                if (obj.addedit.formField.startYear)
                                {
                                    year = "";
                                    angular.forEach(utilServ.getArrayNumber(obj.table.maxCol), function (item2) {
                                        year = ((obj.addedit.formField.startYear - 0) + (item2 - 1));
                                        planQuantity[i] += year;
                                        planQuantityData.year[year] = "";
                                    });
                                }
                            
                                obj.addedit.formValue.planQuantityTableList.push(angular.extend(item1, planQuantityData));
                                i++;
                            });
                            angular.copy(obj.addedit.formValue.planQuantityTableList, obj.table.data);
                            obj.addedit.formValue.planQuantityData = planQuantity.join("");
                        }
                    }
                },
                addedit: {
                    formField: {
                        startYear: ""
                    },
                    formValue: {
                        startYear: "",
                        planQuantityTableList: [],
                        planQuantityData: ""
                    },
                    getValue: function (owner) {
                        var obj = self.planQuantity.owner[owner];
                        var result = "";
                        var year = "";

                        if (obj.table.data.length > 0)
                        {                        
                            if (obj.addedit.formField.startYear)
                            {
                                result += (
                                    "<row>" +
                                    "<startYear>" + obj.addedit.formField.startYear + "</startYear>"
                                );

                                angular.forEach(obj.table.data, function (item1) {
                                    result += (
                                        "<id>" + item1.id + "</id>" +
                                        "<nameTH>" + item1.name.TH + "</nameTH>" +
                                        "<nameEN>" + item1.name.EN + "</nameEN>" +
                                        "<year>"
                                    );

                                    year = "";
                                    angular.forEach(utilServ.getArrayNumber(obj.table.maxCol), function (item2) {
                                        year = ((obj.addedit.formField.startYear - 0) + (item2 - 1));
                                        result += (
                                            "<y" + year + ">" + item1.year[year] + "</y" + year + ">"
                                        );
                                    });

                                    result += (
                                        "</year>"
                                    );
                                });

                                result += (
                                    "</row>"
                                );                                    
                            }
                        }

                        return result;
                    }
                }
            }
        };

        self.costBudget = {
            owner: {},
            new: function (key) {
                this.owner[key] = {};
                angular.copy(this.costBudget, this.owner[key]);
            },
            costBudget: {
                table: {
                    data: [],
                    reload: {
                        getData: function (owner) {
                            var obj = self.costBudget.owner[owner];

                            obj.addedit.formValue.costBudgetTableList = [];
                            obj.addedit.formValue.costBudgetData = "";
                            angular.copy(obj.addedit.formValue.costBudgetTableList, obj.table.data);
                        }
                    }
                },
                addedit: {
                    showForm: false,
                    init: function (owner) {
                        this.setValue(owner).then(function () {
                            var obj = self.costBudget.owner[owner];
                            
                            obj.addedit.watchFormChange(owner);
                            obj.addedit.resetValue(owner);
                        });
                    },
                    formField: {
                        name: {
                            TH: "",
                            EN: ""
                        },
                        amount: "",
                        unit: {
                            TH: ($filter("lowercase")(dictServ.dict.unit.baht.TH) + ' / ' + $filter("lowercase")(dictServ.dict.academicYear.TH)),
                            EN: ($filter("lowercase")(dictServ.dict.unit.baht.EN) + ' / ' + $filter("lowercase")(dictServ.dict.academicYear.EN))
                        }
                    },
                    formValue: {
                        name: {
                            TH: "",
                            EN: ""
                        },
                        amount: "",
                        costBudgetTableList: [],
                        costBudgetData: ""
                    },
                    formValidate: {
                        setValue: function () {
                            this.resetValue();
                        },
                        resetValue: function () {
                            this.showSaveError = false;
                            this.isValid = {
                                name: {
                                    TH: true,
                                    EN: true
                                },
                                amount: true,
                                unique: true
                            };
                        }
                    },
                    watchFormChange: function (owner) {
                        var obj = self.costBudget.owner[owner];

                        $timeout(function () {
                            $scope.$watch(function () {
                                var watch = [];

                                watch.push(obj.addedit.formField.name.TH);
                                watch.push(obj.addedit.formField.name.EN);
                                watch.push(obj.addedit.formField.amount);

                                return watch;
                            }, function () {                                
                                var exit = false;

                                if (!exit)
                                {
                                    if ((obj.addedit.formField.name.TH !== obj.addedit.formValue.name.TH) ||
                                        (obj.addedit.formField.name.EN !== obj.addedit.formValue.name.EN) ||
                                        (obj.addedit.formField.amount !== obj.addedit.formValue.amount))
                                        exit = true;
                                }

                                obj.addedit.isFormChanged = exit;
                                obj.addedit.formValidate.resetValue();
                            }, true);
                        }, 0);
                    },
                    setValue: function (owner) {
                        var deferred = $q.defer();
                        var obj = self.costBudget.owner[owner];

                        obj.addedit.isFormChanged = false;

                        obj.addedit.formValidate.setValue();

                        $timeout(function () {
                            deferred.resolve();
                        }, 0);

                        return deferred.promise;
                    },
                    resetValue: function (owner) {
                        var obj = self.costBudget.owner[owner];

                        obj.addedit.formValue.name.TH = "";
                        obj.addedit.formField.name.TH = obj.addedit.formValue.name.TH;

                        obj.addedit.formValue.name.EN = "";
                        obj.addedit.formField.name.EN = obj.addedit.formValue.name.EN;

                        obj.addedit.formValue.amount = "";                                                
                        obj.addedit.formField.amount = obj.addedit.formValue.amount;
                    
                        obj.addedit.formValidate.resetValue();
                    },
                    getValue: function (owner) {
                        var obj = self.costBudget.owner[owner];
                        var result = "";

                        if (obj.table.data.length > 0)
                        {
                            angular.forEach(obj.table.data, function (item) {
                                result += (
                                    "<row>" +
                                    "<nameTH>" + item.name.TH + "</nameTH>" +
                                    "<nameEN>" + item.name.EN + "</nameEN>" +
                                    "<amount>" + item.amount + "</amount>" +
                                    "<unitTH>" + item.unit.TH + "</unitTH>" +
                                    "<unitEN>" + item.unit.EN + "</unitEN>" +
                                    "</row>"
                                );
                            });
                        }

                        return result;
                    },
                    saveChange: {
                        validate: function (owner) {
                            var obj = self.costBudget.owner[owner];
                            var i = 0;
                            var id = (
                                obj.addedit.formField.name.TH +
                                obj.addedit.formField.name.EN
                            );

                            if (!obj.addedit.formField.name.TH) { obj.addedit.formValidate.isValid.name.TH = false; i++; }
                            if (!obj.addedit.formField.name.EN) { obj.addedit.formValidate.isValid.name.EN = false; i++; }
                            if (!obj.addedit.formField.amount) { obj.addedit.formValidate.isValid.amount = false; i++; }
                            if (utilServ.getObjectByValue(obj.table.data, "id", id).length > 0) { obj.addedit.formValidate.isValid.unique = false; i++; }

                            obj.addedit.formValidate.showSaveError = (i > 0 ? true : false);

                            return (i > 0 ? false : true);
                        },
                        action: function (owner) {
                            var obj = self.costBudget.owner[owner];

                            if (this.validate(owner))
                            {
                                obj.table.data.push({
                                    id: (
                                        obj.addedit.formField.name.TH +
                                        obj.addedit.formField.name.EN
                                    ),
                                    name: {
                                        TH: obj.addedit.formField.name.TH,
                                        EN: obj.addedit.formField.name.EN
                                    },
                                    amount: obj.addedit.formField.amount,
                                    unit: {
                                        TH: obj.addedit.formField.unit.TH,
                                        EN: obj.addedit.formField.unit.EN
                                    }
                                });
                            }
                        }
                    } 
                }
            }
        };

        self.subjectGroup = {
            owner: {},
            new: function (key) {
                this.owner[key] = {};
                angular.copy(this.subjectGroup, this.owner[key]);
            },
            subjectGroup: {
                tabSelect: {
                    activeTabIndex: 0,
                    selected: function (tabName) {
                        if (tabName === "generalCourses")   this.activeTabIndex = 0;
                        if (tabName === "specificCourses")  this.activeTabIndex = 1;
                    }
                },
                table: {
                    data: [],
                    reload: {
                        getData: function (owner) {
                            var obj = self.subjectGroup.owner[owner];

                            obj.addedit.formValue.subjectGroupTableList = [];
                            obj.addedit.formValue.subjectGroupData = "";
                            angular.copy(obj.addedit.formValue.subjectGroupTableList, obj.table.data);
                        }
                    }
                },
                addedit: {
                    showForm: false,
                    init: function (owner) {
                        this.setValue(owner).then(function () {
                            var obj = self.subjectGroup.owner[owner];
                            
                            obj.addedit.watchFormChange(owner);
                            obj.addedit.resetValue(owner);
                        });
                    },
                    formField: {
                        courseSelected: {},
                        name: {
                            TH: "",
                            EN: ""
                        },
                        courseCredit: ""
                    },
                    formValue: {
                        courseSelected: {},
                        name: {
                            TH: "",
                            EN: ""
                        },
                        courseCredit: "",
                        subjectGroupTableList: [],
                        subjectGroupData: ""
                    },
                    formValidate: {
                        setValue: function () {
                            this.resetValue();
                        },
                        resetValue: function () {
                            this.showSaveError = false;
                            this.isValid = {
                                course: true,
                                name: {
                                    TH: true,
                                    EN: true
                                },
                                courseCredit: true,
                                unique: true
                            };
                        }
                    },
                    watchFormChange: function (owner) {
                        var obj = self.subjectGroup.owner[owner];

                        $timeout(function () {
                            $scope.$watch(function () {
                                var watch = [];

                                watch.push(obj.addedit.formField.courseSelected.selected);
                                watch.push(obj.addedit.formField.name.TH);
                                watch.push(obj.addedit.formField.name.EN);
                                watch.push(obj.addedit.formField.courseCredit);

                                return watch;
                            }, function () {                                
                                var exit = false;

                                if (!exit)
                                {
                                    if ((obj.addedit.formField.courseSelected.selected !== obj.addedit.formValue.courseSelected.selected) ||
                                        (obj.addedit.formField.name.TH !== obj.addedit.formValue.name.TH) ||
                                        (obj.addedit.formField.name.EN !== obj.addedit.formValue.name.EN) ||
                                        (obj.addedit.formField.courseCredit !== obj.addedit.formValue.courseCredit))
                                        exit = true;
                                }

                                obj.addedit.isFormChanged = exit;
                                obj.addedit.formValidate.resetValue();
                            }, true);
                        }, 0);
                    },
                    setValue: function (owner) {
                        var deferred = $q.defer();
                        var obj = self.subjectGroup.owner[owner];

                        obj.addedit.isFormChanged = false;

                        obj.addedit.formValidate.setValue();

                        $timeout(function () {
                            deferred.resolve();
                        }, 0);

                        return deferred.promise;
                    },
                    resetValue: function (owner) {
                        var obj = self.subjectGroup.owner[owner];

                        obj.addedit.formValue.courseSelected.selected = undefined;
                        obj.addedit.formField.courseSelected.selected = obj.addedit.formValue.courseSelected.selected;

                        obj.addedit.formValue.name.TH = "";
                        obj.addedit.formField.name.TH = obj.addedit.formValue.name.TH;

                        obj.addedit.formValue.name.EN = "";
                        obj.addedit.formField.name.EN = obj.addedit.formValue.name.EN;

                        obj.addedit.formValue.courseCredit = "";
                        obj.addedit.formField.courseCredit = obj.addedit.formValue.courseCredit;

                        obj.addedit.formValidate.resetValue();
                    },
                    getValue: function (owner) {                       
                        var obj = self.subjectGroup.owner[owner];
                        var result = "";

                        if (obj.table.data.length > 0)
                        {                        
                            angular.forEach(obj.table.data, function (item) {
                                result += (
                                    "<row>" +
                                    "<course>" + item.course + "</course>" +
                                    "<nameTH>" + item.name.TH + "</nameTH>" +
                                    "<nameEN>" + item.name.EN + "</nameEN>" +
                                    "<courseCredit>" + item.courseCredit + "</courseCredit>" +
                                    "</row>"
                                );
                            });
                        }

                        return result;
                    },
                    saveChange: {
                        validate: function (owner) {
                            var obj = self.subjectGroup.owner[owner];
                            var i = 0;
                            var id = (
                                obj.addedit.formField.name.TH +
                                obj.addedit.formField.name.EN
                            );

                            if (!obj.addedit.formField.courseSelected.selected) { obj.addedit.formValidate.isValid.course = false; i++; }
                            if (!obj.addedit.formField.name.TH) { obj.addedit.formValidate.isValid.name.TH = false; i++; }
                            if (!obj.addedit.formField.name.EN) { obj.addedit.formValidate.isValid.name.EN = false; i++; }
                            if (!obj.addedit.formField.courseCredit) { obj.addedit.formValidate.isValid.courseCredit = false; i++; }
                            if (utilServ.getObjectByValue(obj.table.data, "id", id).length > 0) { obj.addedit.formValidate.isValid.unique = false; i++; }

                            obj.addedit.formValidate.showSaveError = (i > 0 ? true : false);

                            return (i > 0 ? false : true);
                        },
                        action: function (owner) {
                            var obj = self.subjectGroup.owner[owner];

                            if (this.validate(owner))
                            {
                                obj.table.data.push({
                                    id: (
                                        obj.addedit.formField.name.TH +
                                        obj.addedit.formField.name.EN
                                    ),
                                    course: obj.addedit.formField.courseSelected.selected.id,
                                    name: {
                                        TH: obj.addedit.formField.name.TH,
                                        EN: obj.addedit.formField.name.EN
                                    },
                                    courseCredit: obj.addedit.formField.courseCredit
                                });
                                
                                obj.tabSelect.selected(obj.addedit.formField.courseSelected.selected.id);
                            }
                        }
                    }                    
                }
            }
        };

        self.defineCourseCodes = {
            owner: {},
            new: function (key) {
                this.owner[key] = {};
                angular.copy(this.defineCourseCodes, this.owner[key]);
            },
            threeDigitsFollowCourseInitials: {
                owner: "threedigitsnumber"
            },
            defineCourseCodes: {
                table: {
                    data: [],
                    reload: {
                        getData: function (owner) {
                            var obj = self.defineCourseCodes.owner[owner];

                            obj.addedit.formValue.defineCourseCodesTableList = [];
                            obj.addedit.formValue.defineCourseCodesData = "";
                            angular.copy(obj.addedit.formValue.defineCourseCodesTableList, obj.table.data);
                        }
                    }
                },
                addedit: {
                    showForm: false,
                    init: function (owner) {
                        this.setValue(owner).then(function () {
                            var obj = self.defineCourseCodes.owner[owner];
                            
                            obj.addedit.watchFormChange(owner);
                            obj.addedit.resetValue(owner);
                        });
                    },
                    formField: {
                        abbreviation: {
                            TH: "",
                            EN: ""
                        },
                        meaning: {
                            TH: "",
                            EN: ""
                        }
                    },
                    formValue: {
                        abbreviation: {
                            TH: "",
                            EN: ""
                        },
                        meaning: {
                            TH: "",
                            EN: ""
                        },
                        defineCourseCodesTableList: [],
                        defineCourseCodesData: ""
                    },
                    formValidate: {
                        setValue: function () {
                            this.resetValue();
                        },
                        resetValue: function () {
                            this.showSaveError = false;
                            this.isValid = {
                                abbreviation: {
                                    TH: true,
                                    EN: true
                                },
                                meaning: {
                                    TH: true,
                                    EN: true
                                },
                                unique: true
                            };
                        }
                    },
                    watchFormChange: function (owner) {
                        var obj = self.defineCourseCodes.owner[owner];

                        $timeout(function () {
                            $scope.$watch(function () {
                                var watch = [];

                                watch.push(obj.addedit.formField.abbreviation.TH);
                                watch.push(obj.addedit.formField.abbreviation.EN);
                                watch.push(obj.addedit.formField.meaning.TH);
                                watch.push(obj.addedit.formField.meaning.EN);

                                return watch;
                            }, function () {                                
                                var exit = false;

                                if (!exit)
                                {
                                    if ((obj.addedit.formField.abbreviation.TH !== obj.addedit.formValue.abbreviation.TH) ||
                                        (obj.addedit.formField.abbreviation.EN !== obj.addedit.formValue.abbreviation.EN) ||
                                        (obj.addedit.formField.meaning.TH !== obj.addedit.formValue.meaning.TH) ||
                                        (obj.addedit.formField.meaning.EN !== obj.addedit.formValue.meaning.EN))
                                        exit = true;
                                }

                                obj.addedit.isFormChanged = exit;
                                obj.addedit.formValidate.resetValue();
                            }, true);
                        }, 0);
                    },
                    setValue: function (owner) {
                        var deferred = $q.defer();
                        var obj = self.defineCourseCodes.owner[owner];

                        obj.addedit.isFormChanged = false;

                        obj.addedit.formValidate.setValue();

                        $timeout(function () {
                            deferred.resolve();
                        }, 0);

                        return deferred.promise;
                    },
                    resetValue: function (owner) {
                        var obj = self.defineCourseCodes.owner[owner];
                        
                        obj.addedit.formValue.abbreviation.TH = "";
                        obj.addedit.formField.abbreviation.TH = obj.addedit.formValue.abbreviation.TH;

                        obj.addedit.formValue.abbreviation.EN = "";
                        obj.addedit.formField.abbreviation.EN = obj.addedit.formValue.abbreviation.EN;

                        obj.addedit.formValue.meaning.TH = "";
                        obj.addedit.formField.meaning.TH = obj.addedit.formValue.meaning.TH;

                        obj.addedit.formValue.meaning.EN = "";                                                                        
                        obj.addedit.formField.meaning.EN = obj.addedit.formValue.meaning.EN;

                        $timeout(function () {
                            autosize.update($(".form-definecoursecodes .addedit textarea"));
                        }, 0);

                        obj.addedit.formValidate.resetValue();
                    },
                    getValue: function (owner) {
                        var obj = self.defineCourseCodes.owner[owner];
                        var result = "";

                        if (obj.table.data.length > 0)
                        {
                            angular.forEach(obj.table.data, function (item) {
                                result += (
                                    "<row>" +
                                    "<abbreviationTH>" + item.abbreviation.TH + "</abbreviationTH>" +
                                    "<abbreviationEN>" + item.abbreviation.EN + "</abbreviationEN>" +
                                    "<meaningTH>" + item.meaning.TH + "</meaningTH>" +
                                    "<meaningEN>" + item.meaning.EN + "</meaningEN>" +
                                    "</row>"
                                );
                            });
                        }

                        return result;
                    },
                    saveChange: {
                        validate: function (owner) {
                            var obj = self.defineCourseCodes.owner[owner];
                            var i = 0;
                            var id = (
                                obj.addedit.formField.abbreviation.TH +
                                obj.addedit.formField.abbreviation.EN
                            );

                            if (!obj.addedit.formField.abbreviation.TH) { obj.addedit.formValidate.isValid.abbreviation.TH = false; i++; }
                            if (!obj.addedit.formField.abbreviation.EN) { obj.addedit.formValidate.isValid.abbreviation.EN = false; i++; }
                            if (!obj.addedit.formField.meaning.TH) { obj.addedit.formValidate.isValid.meaning.TH = false; i++; }
                            if (!obj.addedit.formField.meaning.EN) { obj.addedit.formValidate.isValid.meaning.EN = false; i++; }
                            if (utilServ.getObjectByValue(obj.table.data, "id", id).length > 0) { obj.addedit.formValidate.isValid.unique = false; i++; }

                            obj.addedit.formValidate.showSaveError = (i > 0 ? true : false);

                            return (i > 0 ? false : true);                            
                        },
                        action: function (owner) {
                            var obj = self.defineCourseCodes.owner[owner];

                            if (this.validate(owner))
                            {
                                obj.table.data.push({
                                    id: (
                                        obj.addedit.formField.abbreviation.TH +
                                        obj.addedit.formField.abbreviation.EN
                                    ),
                                    abbreviation: {
                                        TH: obj.addedit.formField.abbreviation.TH,
                                        EN: obj.addedit.formField.abbreviation.EN
                                    },
                                    meaning: {
                                        TH: obj.addedit.formField.meaning.TH,
                                        EN: obj.addedit.formField.meaning.EN
                                    }
                                });
                            }
                        }
                    }                    
                }
            }
        };
    })

    .controller("TQFInfo.TQF2.group4Ctrl", function ($scope, $timeout, $q, $location, $filter, utilServ, appServ, pageRouteServ, facultyServ, programmeServ, TQFServ, inputTypeServ, plosServ) {
        var self = this;

        self.owner = "tqf2g4";
        self.maxSection = 2;
        self.accordionGroup = {};

        self.addedit = {
            showForm: false,
            template: {
                content: "",
                action: "",
                init: function () {
                    if (appServ.isUser && facultyServ.isFaculty && programmeServ.isProgram && self.addedit.showForm)
                    {
                        utilServ.getDialogPreloadingWithDict(["msgPreloading", "loading"]);

                        this.content = pageRouteServ.pageObject.TQF2.group4.addedit.template;
                    }
                },
                remove: function () {
                    utilServ.removeCacheTemplate(this.content);
                    this.content = "";
                }
            },
            init: function () {
                if (appServ.isUser && facultyServ.isFaculty && programmeServ.isProgram)
                {
                    var action = self.addedit.template.action;

                    this.setValue().then(function () {
                        self.addedit[action].setValue();
                        programmeServ.isProgram = TQFServ.isProgramOnGroup(self, programmeServ.dataRow);

                        if (programmeServ.isProgram)
                        {
                            self.addedit.getDataMaster().then(function () {
                                angular.forEach(utilServ.getArrayNumber(self.maxSection), function (item) {
                                    self.addedit["section" + item].setValue();
                                });

                                self.addedit.watchFormChange();
                                self.addedit.resetValue();
                                self.addedit.showForm = true;

                                appServ.closeDialogPreloading();
                            });
                        }
                    });
                }
                else
                    self.addedit.showForm = false;            
            },
            watchFormChange: function () {
                angular.forEach(utilServ.getArrayNumber(self.maxSection), function (item) {
                    self.addedit["section" + item].watchFormChange();
                });

                $timeout(function () {
                    $scope.$watch(function () {
                        var watch = [];

                        angular.forEach(utilServ.getArrayNumber(self.maxSection), function (item) {
                            watch.push(self.addedit["section" + item].isFormChanged);
                        });

                        return watch;
                    }, function () {
                        var exit = false;

                        if (!exit)
                        {
                            angular.forEach(utilServ.getArrayNumber(self.maxSection), function (item) {
                                if (self.addedit["section" + item].isFormChanged)
                                {
                                    exit = true;
                                    return;
                                }
                            });
                        }

                        self.addedit.isFormChanged = exit;
                    }, true);
                }, 0);
            },
            formField: {
                dLevel: "B"
            },
            formValue: {
            },
            formValidate: {
                setValue: function () {
                    this.resetValue();
                },
                resetValue: function () {
                    this.showSaveError = false;
                    this.isValid = {};
                }
            },
            setValue: function () {
                var deferred = $q.defer();

                this.isAdd = false;
                this.isEdit = false;
                this.isUpdate = false;
                this.isDelete = false;
                this.isFormChanged = false;

                this.formValidate.setValue();

                angular.forEach(utilServ.getArrayNumber(self.maxSection), function (item) {
                    self.accordionGroup["section" + item] = {
                        isOpen: false
                    };
                });

                programmeServ.getDataSourceOnGroup(4).then(function () {
                    $timeout(function () {
                        deferred.resolve();
                    }, 0);
                });

                return deferred.promise;
            },
            getDataMaster: function () {
                var deferred = $q.defer();

                plosServ.getDataSource({
                    action: "getlist",
                    params: [
                        "",
                        ("tqfProgramId=" + (Object.keys(programmeServ.dataRow).length > 0 && programmeServ.dataRow.id ? programmeServ.dataRow.id : ""))
                    ].join("&")
                }).then(function (result) {
                    appServ.table.dataSource["plos"] = angular.copy(result);

                    inputTypeServ.getDataSource({
                        action: "getlist",
                        params: [
                            "",
                            ("curYear=" + utilServ.curYear.TH),
                            ("dLevel=" + self.addedit.formField.dLevel)
                        ].join("&")
                    }).then(function (result) {
                        appServ.table.dataSource["strategiesTeaching"]      = angular.copy($filter("filter")(result, { groupType: "stractegyTeach" }));
                        appServ.table.dataSource["strategiesEvaluation"]    = angular.copy($filter("filter")(result, { groupType: "stractegyMeasure" }));

                        $timeout(function () {
                            deferred.resolve();
                        }, 0);
                    });
                });

                return deferred.promise;
            },            
            resetValue: function () {
                if (this.isAdd || this.isEdit || this.isUpdate)
                {
                    angular.forEach(utilServ.getArrayNumber(self.maxSection), function (item) {
                        self.addedit["section" + item].resetValue();
                        self.accordionGroup["section" + item].isOpen = false;
                    });

                    this.formValidate.resetValue();
                    utilServ.gotoTopPage();
                }
            },
            getValue: function () {
                var result = {
                    tableType: (programmeServ.dataRow.tableType ? programmeServ.dataRow.tableType : "temp"),
                    id: (programmeServ.dataRow.id ? programmeServ.dataRow.id : ""),
                    facultyId: facultyServ.facultyInfo.id,
                    programId: (programmeServ.dataRow.programId ? programmeServ.dataRow.programId : ""),
                    programCode: (programmeServ.dataRow.programCode ? programmeServ.dataRow.programCode : ""),
                    majorId: (programmeServ.dataRow.majorId ? programmeServ.dataRow.majorId : ""),
                    majorCode: (programmeServ.dataRow.majorCode ? programmeServ.dataRow.majorCode : ""),
                    groupNum: (programmeServ.dataRow.groupNum ? programmeServ.dataRow.groupNum : ""),
                    courseYear: (programmeServ.dataRow.courseYear ? programmeServ.dataRow.courseYear : "")
                };

                angular.forEach(utilServ.getArrayNumber(self.maxSection), function (item) {
                    angular.extend(result, self.addedit["section" + item].saveChange.value);
                });

                return result;
            },
            add: {
                init: function () {
                    self.addedit.init();
                },
                setValue: function () {
                    self.addedit.isAdd = true;
                    self.addedit.isEdit = false;
                    self.addedit.isUpdate = false;
                    self.addedit.isDelete = false;
                }
            },
            edit: {
                init: function () {
                    self.addedit.init();
                },
                setValue: function () {
                    self.addedit.isAdd = false;
                    self.addedit.isEdit = true;
                    self.addedit.isUpdate = false;
                    self.addedit.isDelete = false;
                }
            },
            update: {
                init: function () {
                    self.addedit.init();
                },
                setValue: function () {
                    self.addedit.isAdd = false;
                    self.addedit.isEdit = false;
                    self.addedit.isUpdate = true;
                    self.addedit.isDelete = false;
                }
            },
            saveChange: {
                value: {},
                validate: function () {
                    var i = 0;

                    if (self.addedit.isAdd || self.addedit.isEdit || self.addedit.isUpdate)
                    {
                        angular.forEach(utilServ.getArrayNumber(self.maxSection), function (item) {
                            if (!self.addedit["section" + item].saveChange.validate())
                            {
                                self.accordionGroup["section" + item].isOpen = true;
                                i++;
                            }
                        });
                    }

                    return (i > 0 ? false : true);
                },
                action: function () {
                    angular.forEach(utilServ.getArrayNumber(self.maxSection), function (item) {
                        self.addedit["section" + item].saveChange.action();
                    });

                    this.value = angular.copy(self.addedit.getValue());

                    if (this.validate())
                    {
                        var action;

                        if (self.addedit.isAdd)     action = "add";
                        if (self.addedit.isEdit)    action = "edit";
                        if (self.addedit.isUpdate)  action = "update";
                        if (self.addedit.isDelete)  action = "remove";

                        programmeServ.saveChange.action({
                            action: action,
                            data: self.addedit.getValue()
                        }).then(function (result) {
                            if (result.status)
                            {
                                if (result.mode === "add")
                                {
                                    self.addedit.isAdd = true;
                                    self.addedit.isEdit = false;
                                    self.addedit.isUpdate = false;
                                    self.addedit.isDelete = false;
                                }

                                if (self.addedit.isAdd)
                                    $location.path("/TQFInfo/TQF2/" + (result.action === "add" ? "edit" : result.action) + "/temp/" + result.id).replace();

                                if (self.addedit.isEdit || self.addedit.isUpdate)
                                {
                                    var action = self.addedit.template.action;

                                    programmeServ.getDataSourceOnGroup(4).then(function () {
                                        self.addedit[action].setValue();
                                        angular.forEach(utilServ.getArrayNumber(self.maxSection), function (item) {
                                            self.addedit["section" + item].isFormChanged = false;
                                        });
                                        self.addedit.isFormChanged = false;
                                        self.addedit.resetValue();
                                    });
                                }
                            }
                        });
                    }
                    else
                    {
                        utilServ.gotoTopPage();
                        utilServ.dialogErrorWithDict(["save", "error"], function () { });
                    }
                }
            },
            section1: {
                owner: (self.owner + "s1"),
                formField: {
                },
                formValue: {
                },
                formValidate: {
                    setValue: function () {
                        this.resetValue();
                    },
                    resetValue: function () {
                        this.showSaveError = false;
                        this.isValid = {};
                    }
                },
                watchFormChange: function () {
                    var specialCharacterObj = self.specialCharacter.owner[this.owner];
                    var specialCharacterData = "";

                    $timeout(function () {
                        $scope.$watch(function () {
                            var watch = [];

                            specialCharacterData = appServ.getDataOnJoinArray(specialCharacterObj.table.data, ["id"]);
                            watch.push(specialCharacterData);

                            return watch;
                        }, function () {
                            var exit = false;

                            if (!exit)
                            {
                                if (specialCharacterData !== specialCharacterObj.addedit.formValue.specialCharacterData)
                                    exit = true;
                            }
                            
                            self.addedit.section1.isFormChanged = exit;
                            self.addedit.section1.formValidate.resetValue();
                        }, true);
                    }, 0);
                },
                setValue: function () {       
                    this.isFormChanged = false;

                    this.formValidate.setValue();
                },
                resetValue: function () {
                    var specialCharacterObj = self.specialCharacter.owner[this.owner];

                    specialCharacterObj.table.reload.getData(this.owner);

                    this.formValidate.resetValue();
                },
                getValue: function () {
                    var specialCharacterObj = self.specialCharacter.owner[this.owner];
                    var result = {
                        xmlCharacter: specialCharacterObj.addedit.getValue(this.owner)
                    };

                    return result;
                },
                saveChange: {
                    value: {},
                    validate: function () {
                        var exit = false;

                        if (this.value.xmlCharacter)
                            exit = true;

                        return exit;
                    },
                    action: function () {
                        this.value = angular.copy(self.addedit.section1.getValue());
                    }
                }
            },
            section2: {
                owner: (self.owner + "s2"),
                formField: {
                },
                formValue: {
                },
                formValidate: {
                    setValue: function () {
                        this.resetValue();
                    },
                    resetValue: function () {
                        this.showSaveError = false;
                        this.isValid = {};
                    }
                },
                watchFormChange: function () {
                    var plosResultObj = self.plosResult.owner[this.owner];
                    var plosResultData = "";

                    $timeout(function () {
                        $scope.$watch(function () {
                            var watch = [];

                            plosResultData = appServ.getDataOnJoinArray(plosResultObj.table.data, ["id"]);
                            watch.push(plosResultData);

                            return watch;
                        }, function () {
                            var exit = false;

                            if (!exit)
                            {
                                if (plosResultData !== plosResultObj.addedit.formValue.plosResultData)
                                    exit = true;
                            }

                            self.addedit.section2.isFormChanged = exit;
                            self.addedit.section2.formValidate.resetValue();
                        }, true);
                    }, 0);
                },
                setValue: function () {
                    this.isFormChanged = false;

                    this.formValidate.setValue();
                },
                resetValue: function () {
                    var plosResultObj = self.plosResult.owner[this.owner];

                    plosResultObj.table.reload.getData(this.owner);
                
                    this.formValidate.resetValue();
                },
                getValue: function () {
                    var plosResultObj = self.plosResult.owner[this.owner];
                    var result = {
                        plosResult: plosResultObj.addedit.getValue(this.owner)
                    };

                    return result;
                },
                saveChange: {
                    value: {},
                    validate: function () {
                        var exit = false;

                        if (this.value.plosResult)
                            exit = true;

                        return exit;
                    },
                    action: function () {
                        this.value = angular.copy(self.addedit.section2.getValue());
                    }
                }
            }
        };

        self.specialCharacter = {
            owner: {},
            new: function (key) {
                this.owner[key] = {};
                angular.copy(this.specialCharacter, this.owner[key]);
            },
            specialCharacter: {
                table: {
                    data: [],
                    reload: {
                        getData: function (owner) {
                            var obj = self.specialCharacter.owner[owner];

                            obj.addedit.formValue.specialCharacterTableList = [];
                            obj.addedit.formValue.specialCharacterData = "";
                            angular.copy(obj.addedit.formValue.specialCharacterTableList, obj.table.data);
                        }
                    }
                },
                addedit: {
                    showForm: false,
                    init: function (owner) {
                        this.setValue(owner).then(function () {
                            var obj = self.specialCharacter.owner[owner];

                            obj.addedit.watchFormChange(owner);
                            obj.addedit.resetValue(owner);
                        });
                    },
                    formField: {
                        characteristics: {
                            TH: "",
                            EN: ""
                        },
                        strategies: {
                            TH: "",
                            EN: ""
                        }
                    },
                    formValue: {
                        characteristics: {
                            TH: "",
                            EN: ""
                        },
                        strategies: {
                            TH: "",
                            EN: ""
                        },
                        specialCharacterTableList: [],
                        specialCharacterData: ""
                    },
                    formValidate: {
                        setValue: function () {
                            this.resetValue();
                        },
                        resetValue: function () {
                            this.showSaveError = false;
                            this.isValid = {
                                characteristics: {
                                    TH: true,
                                    EN: true
                                },
                                strategies: {
                                    TH: true,
                                    EN: true
                                },
                                unique: true
                            };
                        }
                    },
                    watchFormChange: function (owner) {
                        var obj = self.specialCharacter.owner[owner];

                        $timeout(function () {
                            $scope.$watch(function () {
                                var watch = [];

                                watch.push(obj.addedit.formField.characteristics.TH);
                                watch.push(obj.addedit.formField.characteristics.EN);
                                watch.push(obj.addedit.formField.strategies.TH);
                                watch.push(obj.addedit.formField.strategies.EN);

                                return watch;
                            }, function () {
                                var exit = false;

                                if (!exit)
                                {
                                    if ((obj.addedit.formField.characteristics.TH !== obj.addedit.formValue.characteristics.TH) ||
                                        (obj.addedit.formField.characteristics.EN !== obj.addedit.formValue.characteristics.EN) ||
                                        (obj.addedit.formField.strategies.TH !== obj.addedit.formValue.strategies.TH) ||
                                        (obj.addedit.formField.strategies.EN !== obj.addedit.formValue.strategies.EN))
                                        exit = true;
                                }

                                obj.addedit.isFormChanged = exit;
                                obj.addedit.formValidate.resetValue();
                            }, true);
                        }, 0);
                    },
                    setValue: function (owner) {
                        var deferred = $q.defer();
                        var obj = self.specialCharacter.owner[owner];

                        obj.addedit.isFormChanged = false;

                        obj.addedit.formValidate.setValue();

                        $timeout(function () {
                            deferred.resolve();
                        }, 0);

                        return deferred.promise;
                    },
                    resetValue: function (owner) {
                        var obj = self.specialCharacter.owner[owner];
                    
                        obj.addedit.formValue.characteristics.TH = "";
                        obj.addedit.formField.characteristics.TH = obj.addedit.formValue.characteristics.TH;

                        obj.addedit.formValue.characteristics.EN = "";
                        obj.addedit.formField.characteristics.EN = obj.addedit.formValue.characteristics.EN;

                        obj.addedit.formValue.strategies.TH = "";
                        obj.addedit.formField.strategies.TH = obj.addedit.formValue.strategies.TH;

                        obj.addedit.formValue.strategies.EN = "";                                                                        
                        obj.addedit.formField.strategies.EN = obj.addedit.formValue.strategies.EN;

                        $timeout(function () {
                            autosize.update($(".form-specialcharacter .addedit textarea"));
                        }, 0);

                        obj.addedit.formValidate.resetValue();
                    },
                    getValue: function (owner) {
                        var obj = self.specialCharacter.owner[owner];
                        var result = "";

                        if (obj.table.data.length > 0)
                        {
                            angular.forEach(obj.table.data, function (item) {
                                result += (
                                    "<row>" +
                                    "<characteristicsTH>" + item.characteristics.TH + "</characteristicsTH>" +
                                    "<characteristicsEN>" + item.characteristics.EN + "</characteristicsEN>" +
                                    "<strategiesTH>" + item.strategies.TH + "</strategiesTH>" +
                                    "<strategiesEN>" + item.strategies.EN + "</strategiesEN>" +
                                    "</row>"
                                );
                            });
                        }

                        return result;
                    },
                    saveChange: {
                        validate: function (owner) {
                            var obj = self.specialCharacter.owner[owner];
                            var i = 0;
                            var id = (
                                obj.addedit.formField.characteristics.TH +
                                obj.addedit.formField.characteristics.EN +
                                obj.addedit.formField.strategies.TH +
                                obj.addedit.formField.strategies.EN
                            );

                            if (!obj.addedit.formField.characteristics.TH) { obj.addedit.formValidate.isValid.characteristics.TH = false; i++; }
                            if (!obj.addedit.formField.characteristics.EN) { obj.addedit.formValidate.isValid.characteristics.EN = false; i++; }
                            if (!obj.addedit.formField.strategies.TH) { obj.addedit.formValidate.isValid.strategies.TH = false; i++; }
                            if (!obj.addedit.formField.strategies.EN) { obj.addedit.formValidate.isValid.strategies.EN = false; i++; }
                            if (utilServ.getObjectByValue(obj.table.data, "id", id).length > 0) { obj.addedit.formValidate.isValid.unique = false; i++; }

                            obj.addedit.formValidate.showSaveError = (i > 0 ? true : false);

                            return (i > 0 ? false : true);
                        },
                        action: function (owner) {
                            var obj = self.specialCharacter.owner[owner];

                            if (this.validate(owner))
                            {
                                obj.table.data.push({
                                    id: (
                                        obj.addedit.formField.characteristics.TH +
                                        obj.addedit.formField.characteristics.EN +
                                        obj.addedit.formField.strategies.TH +
                                        obj.addedit.formField.strategies.EN
                                    ),
                                    characteristics: {
                                        TH: obj.addedit.formField.characteristics.TH,
                                        EN: obj.addedit.formField.characteristics.EN
                                    },
                                    strategies: {
                                        TH: obj.addedit.formField.strategies.TH,
                                        EN: obj.addedit.formField.strategies.EN
                                    }
                                });
                            }
                        }
                    }          
                }
            }
        };

        self.plosResult = {
            owner: {},
            new: function (key) {
                this.owner[key] = {};
                angular.copy(this.plosResult, this.owner[key]);
            },
            plosResult: {
                table: {
                    data: [],
                    reload: {
                        getData: function (owner) {
                            var obj = self.plosResult.owner[owner];

                            obj.addedit.formValue.plosResultTableList = [];
                            obj.addedit.formValue.plosResultData = "";
                            angular.copy(obj.addedit.formValue.plosResultTableList, obj.table.data);
                        }
                    }
                },
                addedit: {
                    showForm: false,
                    init: function (owner) {
                        this.setValue(owner).then(function () {
                            var obj = self.plosResult.owner[owner];

                            obj.addedit.watchFormChange(owner);
                            obj.addedit.resetValue(owner);
                        });
                    },
                    formField: {
                        plosSelected: {},
                        detail: {
                            TH: "",
                            EN: ""
                        },
                        strategies: {
                            teaching: [],
                            teachingSelected: {},
                            teachingSelectedLast: {},
                            teachingRemark: {},
                            evaluation: [],
                            evaluationSelected: {},
                            evaluationSelectedLast: {},
                            evaluationRemark: {}
                        }
                    },
                    formValue: {
                        plosSelected: {},
                        detail: {
                            TH: "",
                            EN: ""
                        },
                        strategies: {
                            teaching: [],
                            teachingData: "",
                            evaluation: [],
                            evaluationData: ""
                        },
                        plosResultTableList: [],
                        plosResultData: ""
                    },
                    formValidate: {
                        setValue: function () {
                            this.resetValue();
                        },
                        resetValue: function () {
                            this.showSaveError = false;
                            this.isValid = {
                                plos: true,
                                detail: {
                                    TH: true,
                                    EN: true
                                },
                                strategies: {
                                    teaching: true,
                                    evaluation: true
                                },
                                unique: true
                            };
                        }
                    },
                    watchFormChange: function (owner) {
                        var obj = self.plosResult.owner[owner];
                        var strategies = {
                            teachingData: "",
                            evaluationData: ""
                        };
                        
                        $timeout(function () {
                            $scope.$watch(function () {
                                var watch = [];

                                watch.push(obj.addedit.formField.plosSelected.selected);
                                watch.push(obj.addedit.formField.detail.TH);
                                watch.push(obj.addedit.formField.detail.EN);

                                strategies.teachingData = appServ.getDataOnJoinArray(obj.addedit.formField.strategies.teaching, ["id"]);
                                watch.push(strategies.teachingData);

                                strategies.evaluationData = appServ.getDataOnJoinArray(obj.addedit.formField.strategies.evaluation, ["id"]);
                                watch.push(strategies.evaluationData);

                                return watch;
                            }, function () {
                                var exit = false;

                                if (!exit)
                                {
                                    if ((obj.addedit.formField.plosSelected.selected !== obj.addedit.formValue.plosSelected.selected) ||
                                        (obj.addedit.formField.detail.TH !== obj.addedit.formValue.detail.TH) ||
                                        (obj.addedit.formField.detail.EN !== obj.addedit.formValue.detail.EN) ||
                                        (strategies.teachingData !== obj.addedit.formValue.strategies.teachingData) ||
                                        (strategies.evaluationData !== obj.addedit.formValue.strategies.evaluationData))
                                        exit = true;
                                }

                                obj.addedit.isFormChanged = exit;
                                obj.addedit.formValidate.resetValue();
                            }, true);
                        }, 0);
                    },
                    setValue: function (owner) {
                        var deferred = $q.defer();
                        var obj = self.plosResult.owner[owner];

                        obj.addedit.isFormChanged = false;
                        obj.addedit.isCheckedStrategiesTeaching = {};
                        obj.addedit.isCheckedStrategiesEvaluation = {};

                        obj.addedit.formValidate.setValue();

                        $timeout(function () {
                            deferred.resolve();
                        }, 0);

                        return deferred.promise;
                    },
                    resetValue: function (owner) {
                        var obj = self.plosResult.owner[owner];

                        obj.addedit.formValue.plosSelected.selected = undefined;
                        obj.addedit.formField.plosSelected.selected = obj.addedit.formValue.plosSelected.selected;

                        obj.addedit.formValue.detail.TH = "";
                        obj.addedit.formField.detail.TH = obj.addedit.formValue.detail.TH;

                        obj.addedit.formValue.detail.EN = "";
                        obj.addedit.formField.detail.EN = obj.addedit.formValue.detail.EN;

                        obj.addedit.formValue.strategies.teaching = [];
                        obj.addedit.formValue.strategies.teachingData = "";
                        angular.copy(obj.addedit.formValue.strategies.teaching, obj.addedit.formField.strategies.teaching);
                        TQFServ.inputTypeRemark.uncheck(appServ.table.dataSource.strategiesTeaching, "teaching", obj.addedit.formField.strategies, obj.addedit.isCheckedStrategiesTeaching);
                        angular.forEach(appServ.table.dataSource.strategiesTeaching, function (item) {
                            if (item.selected === "Y")
                            {
                                obj.addedit.formValue.strategies.teaching.push(item);
                                obj.addedit.formField.strategies.teachingSelected[item.id] = true;
                                TQFServ.inputTypeRemark.setSelected(item, "teaching", obj.addedit.formField.strategies, obj.addedit.isCheckedStrategiesTeaching);
                            }
                        });                        
                        obj.addedit.formValue.strategies.teachingData = appServ.getDataOnJoinArray(obj.addedit.formValue.strategies.teaching, ["id"]);

                        obj.addedit.formValue.strategies.evaluation = [];
                        obj.addedit.formValue.strategies.evaluationData = "";
                        angular.copy(obj.addedit.formValue.strategies.evaluation, obj.addedit.formField.strategies.evaluation);
                        TQFServ.inputTypeRemark.uncheck(appServ.table.dataSource.strategiesEvaluation, "evaluation", obj.addedit.formField.strategies, obj.addedit.isCheckedStrategiesEvaluation);
                        angular.forEach(appServ.table.dataSource.strategiesEvaluation, function (item) {
                            if (item.selected === "Y")
                            {
                                obj.addedit.formValue.strategies.evaluation.push(item);
                                obj.addedit.formField.strategies.evaluationSelected[item.id] = true;
                                TQFServ.inputTypeRemark.setSelected(item, "evaluation", obj.addedit.formField.strategies, obj.addedit.isCheckedStrategiesEvaluation);
                            }
                        });                        
                        obj.addedit.formValue.strategies.evaluationData = appServ.getDataOnJoinArray(obj.addedit.formValue.strategies.evaluation, ["id"]);

                        $timeout(function () {
                            autosize.update($(".form-plos .addedit textarea"));
                        }, 0);

                        obj.addedit.formValidate.resetValue();
                    },
                    getValue: function (owner) {
                        var obj = self.plosResult.owner[owner];
                        var result = [];

                        if (obj.table.data.length > 0)
                            angular.copy(obj.table.data, result);
                        else
                            result = "";

                        return result;
                    },
                    saveChange: {
                        validate: function (owner) {
                            var obj = self.plosResult.owner[owner];
                            var i = 0;
                            var id = "";

                            if (!obj.addedit.formField.plosSelected.selected) { obj.addedit.formValidate.isValid.plos = false; i++; }
                            if (!obj.addedit.formField.detail.TH) { obj.addedit.formValidate.isValid.detail.TH = false; i++; }
                            if (!obj.addedit.formField.detail.EN) { obj.addedit.formValidate.isValid.detail.EN = false; i++; }
                            if (obj.addedit.formField.strategies.teaching.length === 0) { obj.addedit.formValidate.isValid.strategies.teaching = false; i++; }
                            if (obj.addedit.formField.strategies.evaluation.length === 0) { obj.addedit.formValidate.isValid.strategies.evaluation = false; i++; }
                            if (utilServ.getObjectByValue(obj.table.data, "id", id).length > 0) { obj.addedit.formValidate.isValid.unique = false; i++; }

                            obj.addedit.formValidate.showSaveError = (i > 0 ? true : false);

                            return (i > 0 ? false : true);
                        },
                        action: function (owner) {
                            var obj = self.plosResult.owner[owner];
                            var strategies = {
                                teaching: [],
                                evaluation: []                                   
                            };

                            if (this.validate(owner))
                            {
                                angular.forEach(obj.addedit.formField.strategies.teaching, function (item) {
                                    item.remark = "";

                                    if (item.isRemark === "Y" && obj.addedit.formField.strategies.teachingRemark[item.id])
                                        item.remark = obj.addedit.formField.strategies.teachingRemark[item.id];

                                    strategies.teaching.push(item);
                                });                                

                                angular.forEach(obj.addedit.formField.strategies.evaluation, function (item) {
                                    item.remark = "";

                                    if (item.isRemark === "Y" && obj.addedit.formField.strategies.evaluationRemark[item.id])
                                        item.remark = obj.addedit.formField.strategies.evaluationRemark[item.id];

                                    strategies.evaluation.push(item);
                                });                                

                                obj.table.data.push({
                                    id: obj.addedit.formField.plosSelected.selected.id,
                                    title: {
                                        TH: obj.addedit.formField.plosSelected.selected.title.TH,
                                        EN: obj.addedit.formField.plosSelected.selected.title.EN
                                    },
                                    detail: {
                                        TH: obj.addedit.formField.detail.TH,
                                        EN: obj.addedit.formField.detail.EN
                                    },
                                    strategies: {
                                        teaching: {
                                            json: angular.copy(strategies.teaching),
                                            xml: TQFServ.inputTypeRemark.getValue("teaching", strategies.teaching, obj.addedit.formField.strategies)
                                        },
                                        evaluation: {
                                            json: angular.copy(strategies.evaluation),
                                            xml: TQFServ.inputTypeRemark.getValue("evaluation", strategies.evaluation, obj.addedit.formField.strategies)
                                        }
                                    }
                                });                                
                            }
                        }
                    }      
                }
            }
        };
    })

    .controller("TQFInfo.TQF2.group5Ctrl", function ($scope, $timeout, $q, $location, $filter, utilServ, appServ, pageRouteServ, facultyServ, programmeServ, TQFServ, inputTypeServ) {
        var self = this;

        self.owner = "tqf2g5";

        self.addedit = {
            showForm: false,
            template: {
                content: "",
                action: "",
                init: function () {
                    if (appServ.isUser && facultyServ.isFaculty && programmeServ.isProgram && self.addedit.showForm)
                    {
                        utilServ.getDialogPreloadingWithDict(["msgPreloading", "loading"]);

                        this.content = pageRouteServ.pageObject.TQF2.group5.addedit.template;
                    }
                },
                remove: function () {
                    utilServ.removeCacheTemplate(this.content);
                    this.content = "";
                }
            },
            init: function () {
                if (appServ.isUser && facultyServ.isFaculty && programmeServ.isProgram)
                {
                    var action = self.addedit.template.action;

                    this.setValue().then(function () {
                        self.addedit[action].setValue();
                        programmeServ.isProgram = TQFServ.isProgramOnGroup(self, programmeServ.dataRow);

                        if (programmeServ.isProgram)
                        {
                            self.addedit.getDataMaster().then(function () {
                                self.addedit.watchFormChange();
                                self.addedit.resetValue();
                                self.addedit.showForm = true;

                                appServ.closeDialogPreloading();
                            });
                        }
                    });
                }
                else
                    self.addedit.showForm = false;
            },
            watchFormChange: function () {
                $timeout(function () {
                    $scope.$watch(function () {
                        var watch = [];

                        angular.forEach(appServ.table.dataSource.criterialEvaluate, function (item) {
                            watch.push(self.addedit.formField.criterialEvaluate[item.id]);
                        });

                        return watch;
                    }, function () {                            
                        var exit = false;

                        if (!exit)
                        {
                            angular.forEach(appServ.table.dataSource.criterialEvaluate, function (item) {
                                if (self.addedit.formField.criterialEvaluate[item.id] !== self.addedit.formValue.criterialEvaluate[item.id])
                                {
                                    exit = true;
                                    return;
                                }
                            });
                        }

                        self.addedit.isFormChanged = exit;
                        self.addedit.formValidate.resetValue();
                    }, true);
                }, 0);
            },            
            formField: {
                dLevel: "B",
                criterialEvaluate: {}
            },
            formValue: {
                criterialEvaluate: {}
            },
            formValidate: {
                setValue: function () {
                    this.resetValue();
                },
                resetValue: function () {
                    this.showSaveError = false;
                    this.isValid = {};
                }
            }, 
            setValue: function () {
                var deferred = $q.defer();

                this.isAdd = false;
                this.isEdit = false;
                this.isUpdate = false;
                this.isDelete = false;
                this.isFormChanged = false;

                this.formValidate.setValue();

                programmeServ.getDataSourceOnGroup(5).then(function () {
                    $timeout(function () {
                        deferred.resolve();
                    }, 0);
                });

                return deferred.promise;
            },
            getDataMaster: function () {
                var deferred = $q.defer();

                inputTypeServ.getDataSource({
                    action: "getlist",
                    params: [
                        "",
                        ("curYear=" + utilServ.curYear.TH),
                        ("dLevel=" + self.addedit.formField.dLevel)
                    ].join("&")
                }).then(function (result) {
                    appServ.table.dataSource["criterialEvaluate"] = angular.copy($filter("filter")(result, { groupType: "criterialEvaluate" }));

                    $timeout(function () {
                        deferred.resolve();
                    }, 0);
                });

                return deferred.promise;
            },
            resetValue: function () {
                if (this.isAdd || this.isEdit || this.isUpdate)
                {
                    angular.forEach(appServ.table.dataSource.criterialEvaluate, function (item) {
                        self.addedit.formValue.criterialEvaluate[item.id] = "";
                        self.addedit.formField.criterialEvaluate[item.id] = self.addedit.formValue.criterialEvaluate[item.id];
                    });

                    $timeout(function () {
                        autosize.update($("textarea"));
                    }, 0);

                    this.formValidate.resetValue();
                    utilServ.gotoTopPage();
                }
            },
            getValue: function () {
                var result = {
                    tableType: (programmeServ.dataRow.tableType ? programmeServ.dataRow.tableType : "temp"),
                    id: (programmeServ.dataRow.id ? programmeServ.dataRow.id : ""),
                    facultyId: facultyServ.facultyInfo.id,
                    programId: (programmeServ.dataRow.programId ? programmeServ.dataRow.programId : ""),
                    programCode: (programmeServ.dataRow.programCode ? programmeServ.dataRow.programCode : ""),
                    majorId: (programmeServ.dataRow.majorId ? programmeServ.dataRow.majorId : ""),
                    majorCode: (programmeServ.dataRow.majorCode ? programmeServ.dataRow.majorCode : ""),
                    groupNum: (programmeServ.dataRow.groupNum ? programmeServ.dataRow.groupNum : ""),
                    courseYear: (programmeServ.dataRow.courseYear ? programmeServ.dataRow.courseYear : ""),
                    xmlCriteriaEvaluate: TQFServ.inputTypeRemark.getValue("criterialEvaluate", appServ.table.dataSource.criterialEvaluate, this.formField)
                };

                return result;
            },
            add: {
                init: function () {
                    self.addedit.init();
                },
                setValue: function () {
                    self.addedit.isAdd = true;
                    self.addedit.isEdit = false;
                    self.addedit.isUpdate = false;
                    self.addedit.isDelete = false;
                }
            },
            edit: {
                init: function () {
                    self.addedit.init();
                },
                setValue: function () {
                    self.addedit.isAdd = false;
                    self.addedit.isEdit = true;
                    self.addedit.isUpdate = false;
                    self.addedit.isDelete = false;
                }
            },
            update: {
                init: function () {
                    self.addedit.init();
                },
                setValue: function () {
                    self.addedit.isAdd = false;
                    self.addedit.isEdit = false;
                    self.addedit.isUpdate = true;
                    self.addedit.isDelete = false;
                }
            },
            saveChange: {
                value: {},
                validate: function () {
                    var exit = false;

                    if (self.addedit.isAdd || self.addedit.isEdit || self.addedit.isUpdate)
                    {
                        if (this.value.xmlCriteriaEvaluate)
                            exit = true;
                    }

                    return exit;
                },
                action: function () {
                    this.value = angular.copy(self.addedit.getValue());

                    if (this.validate())
                    {
                        var action;

                        if (self.addedit.isAdd)     action = "add";
                        if (self.addedit.isEdit)    action = "edit";
                        if (self.addedit.isUpdate)  action = "update";
                        if (self.addedit.isDelete)  action = "remove";

                        programmeServ.saveChange.action({
                            action: action,
                            data: self.addedit.getValue()
                        }).then(function (result) {
                            if (result.status)
                            {
                                if (result.mode === "add")
                                {
                                    self.addedit.isAdd = true;
                                    self.addedit.isEdit = false;
                                    self.addedit.isUpdate = false;
                                    self.addedit.isDelete = false;
                                }

                                if (self.addedit.isAdd)
                                    $location.path("/TQFInfo/TQF2/" + (result.action === "add" ? "edit" : result.action) + "/temp/" + result.id).replace();

                                if (self.addedit.isEdit || self.addedit.isUpdate)
                                {
                                    var action = self.addedit.template.action;

                                    programmeServ.getDataSourceOnGroup(5).then(function () {
                                        self.addedit[action].setValue();
                                        self.addedit.isFormChanged = false;
                                        self.addedit.resetValue();
                                    });
                                }
                            }
                        });
                    }
                    else
                    {
                        utilServ.gotoTopPage();
                        utilServ.dialogErrorWithDict(["save", "error"], function () { });
                    }
                }
            }
        };
    })

    .controller("TQFInfo.TQF2.group6Ctrl", function ($scope, $timeout, $q, $location, $filter, utilServ, appServ, pageRouteServ, facultyServ, programmeServ, TQFServ, inputTypeServ) {
        var self = this;

        self.owner = "tqf2g6";

        self.addedit = {
            showForm: false,
            template: {
                content: "",
                action: "",
                init: function () {
                    if (appServ.isUser && facultyServ.isFaculty && programmeServ.isProgram && self.addedit.showForm)
                    {
                        utilServ.getDialogPreloadingWithDict(["msgPreloading", "loading"]);

                        this.content = pageRouteServ.pageObject.TQF2.group6.addedit.template;
                    }
                },
                remove: function () {
                    utilServ.removeCacheTemplate(this.content);
                    this.content = "";
                }
            },
            init: function () {
                if (appServ.isUser && facultyServ.isFaculty && programmeServ.isProgram)
                {
                    var action = self.addedit.template.action;

                    this.setValue().then(function () {
                        self.addedit[action].setValue();
                        programmeServ.isProgram = TQFServ.isProgramOnGroup(self, programmeServ.dataRow);

                        if (programmeServ.isProgram)
                        {
                            self.addedit.getDataMaster().then(function () {
                                self.addedit.watchFormChange();
                                self.addedit.resetValue();
                                self.addedit.showForm = true;

                                appServ.closeDialogPreloading();
                            });
                        }
                    });
                }
                else
                    self.addedit.showForm = false;
            },
            watchFormChange: function () {
                $timeout(function () {
                    $scope.$watch(function () {
                        var watch = [];

                        angular.forEach(appServ.table.dataSource.teacherDevelop, function (item) {
                            watch.push(self.addedit.formField.teacherDevelop[item.id]);
                        });

                        return watch;
                    }, function () {                            
                        var exit = false;

                        if (!exit)
                        {
                            angular.forEach(appServ.table.dataSource.teacherDevelop, function (item) {
                                if (self.addedit.formField.teacherDevelop[item.id] !== self.addedit.formValue.teacherDevelop[item.id])
                                {
                                    exit = true;
                                    return;
                                }
                            });
                        }

                        self.addedit.isFormChanged = exit;
                        self.addedit.formValidate.resetValue();
                    }, true);
                }, 0);
            },            
            formField: {
                dLevel: "B",
                teacherDevelop: {}
            },
            formValue: {
                teacherDevelop: {}
            },
            formValidate: {
                setValue: function () {
                    this.resetValue();
                },
                resetValue: function () {
                    this.showSaveError = false;
                    this.isValid = {};
                }
            },
            setValue: function () {
                var deferred = $q.defer();

                this.isAdd = false;
                this.isEdit = false;
                this.isUpdate = false;
                this.isDelete = false;
                this.isFormChanged = false;

                this.formValidate.setValue();

                programmeServ.getDataSourceOnGroup(6).then(function () {
                    $timeout(function () {
                        deferred.resolve();
                    }, 0);
                });

                return deferred.promise;
            },
            getDataMaster: function () {
                var deferred = $q.defer();

                inputTypeServ.getDataSource({
                    action: "getlist",
                    params: [
                        "",
                        ("curYear=" + utilServ.curYear.TH),
                        ("dLevel=" + self.addedit.formField.dLevel)
                    ].join("&")
                }).then(function (result) {
                    appServ.table.dataSource["teacherDevelop"] = angular.copy($filter("filter")(result, { groupType: "teacherDevelop" }));

                    $timeout(function () {
                        deferred.resolve();
                    }, 0);
                });

                return deferred.promise;
            },
            resetValue: function () {
                if (this.isAdd || this.isEdit || this.isUpdate)
                {
                    angular.forEach(appServ.table.dataSource.teacherDevelop, function (item) {
                        self.addedit.formValue.teacherDevelop[item.id] = "";
                        self.addedit.formField.teacherDevelop[item.id] = self.addedit.formValue.teacherDevelop[item.id];
                    });

                    $timeout(function () {
                        autosize.update($("textarea"));
                    }, 0);

                    this.formValidate.resetValue();
                    utilServ.gotoTopPage();
                }
            },
            getValue: function () {
                var result = {
                    tableType: (programmeServ.dataRow.tableType ? programmeServ.dataRow.tableType : "temp"),
                    id: (programmeServ.dataRow.id ? programmeServ.dataRow.id : ""),
                    facultyId: facultyServ.facultyInfo.id,
                    programId: (programmeServ.dataRow.programId ? programmeServ.dataRow.programId : ""),
                    programCode: (programmeServ.dataRow.programCode ? programmeServ.dataRow.programCode : ""),
                    majorId: (programmeServ.dataRow.majorId ? programmeServ.dataRow.majorId : ""),
                    majorCode: (programmeServ.dataRow.majorCode ? programmeServ.dataRow.majorCode : ""),
                    groupNum: (programmeServ.dataRow.groupNum ? programmeServ.dataRow.groupNum : ""),
                    courseYear: (programmeServ.dataRow.courseYear ? programmeServ.dataRow.courseYear : ""),
                    xmlTeacherDevelop: TQFServ.inputTypeRemark.getValue("teacherDevelop", appServ.table.dataSource.teacherDevelop, this.formField)
                };
                
                return result;
            },
            add: {
                init: function () {
                    self.addedit.init();
                },
                setValue: function () {
                    self.addedit.isAdd = true;
                    self.addedit.isEdit = false;
                    self.addedit.isUpdate = false;
                    self.addedit.isDelete = false;
                }
            },
            edit: {
                init: function () {
                    self.addedit.init();
                },
                setValue: function () {
                    self.addedit.isAdd = false;
                    self.addedit.isEdit = true;
                    self.addedit.isUpdate = false;
                    self.addedit.isDelete = false;
                }
            },
            update: {
                init: function () {
                    self.addedit.init();
                },
                setValue: function () {
                    self.addedit.isAdd = false;
                    self.addedit.isEdit = false;
                    self.addedit.isUpdate = true;
                    self.addedit.isDelete = false;
                }
            },
            saveChange: {
                value: {},
                validate: function () {
                    var exit = false;

                    if (self.addedit.isAdd || self.addedit.isEdit || self.addedit.isUpdate)
                    {
                        if (this.value.xmlTeacherDevelop)
                            exit = true;
                    }

                    return exit;
                },
                action: function () {
                    this.value = angular.copy(self.addedit.getValue());

                    if (this.validate())
                    {
                        var action;

                        if (self.addedit.isAdd)     action = "add";
                        if (self.addedit.isEdit)    action = "edit";
                        if (self.addedit.isUpdate)  action = "update";
                        if (self.addedit.isDelete)  action = "remove";

                        programmeServ.saveChange.action({
                            action: action,
                            data: self.addedit.getValue()
                        }).then(function (result) {
                            if (result.status)
                            {
                                if (result.mode === "add")
                                {
                                    self.addedit.isAdd = true;
                                    self.addedit.isEdit = false;
                                    self.addedit.isUpdate = false;
                                    self.addedit.isDelete = false;
                                }

                                if (self.addedit.isAdd)
                                    $location.path("/TQFInfo/TQF2/" + (result.action === "add" ? "edit" : result.action) + "/temp/" + result.id).replace();

                                if (self.addedit.isEdit || self.addedit.isUpdate)
                                {
                                    var action = self.addedit.template.action;

                                    programmeServ.getDataSourceOnGroup(6).then(function () {
                                        self.addedit[action].setValue();
                                        self.addedit.isFormChanged = false;
                                        self.addedit.resetValue();
                                    });
                                }
                            }
                        });
                    }
                    else
                    {
                        utilServ.gotoTopPage();
                        utilServ.dialogErrorWithDict(["save", "error"], function () { });
                    }
                }
            }
        };
    })

    .controller("TQFInfo.TQF2.group7Ctrl", function ($scope, $timeout, $q, $location, $filter, utilServ, appServ, dictServ, pageRouteServ, facultyServ, programmeServ, TQFServ, inputTypeServ, kpiServ) {
        var self = this;

        self.owner = "tqf2g7";

        self.addedit = {
            showForm: false,
            template: {
                content: "",
                action: "",
                init: function () {
                    if (appServ.isUser && facultyServ.isFaculty && programmeServ.isProgram && self.addedit.showForm)
                    {
                        utilServ.getDialogPreloadingWithDict(["msgPreloading", "loading"]);

                        this.content = pageRouteServ.pageObject.TQF2.group7.addedit.template;
                    }
                },
                remove: function () {
                    utilServ.removeCacheTemplate(this.content);
                    this.content = "";
                }
            },
            init: function () {
                if (appServ.isUser && facultyServ.isFaculty && programmeServ.isProgram)
                {
                    var action = self.addedit.template.action;

                    this.setValue().then(function () {
                        self.addedit[action].setValue();
                        programmeServ.isProgram = TQFServ.isProgramOnGroup(self, programmeServ.dataRow);

                        if (programmeServ.isProgram)
                        {
                            self.addedit.getDataMaster().then(function () {
                                self.addedit.watchFormChange();
                                self.addedit.resetValue();
                                self.addedit.showForm = true;

                                appServ.closeDialogPreloading();
                            });
                        }
                    });
                }
                else
                    self.addedit.showForm = false;
            },
            watchFormChange: function () {                
                var kpiObj = self.kpi.owner[self.owner];
                var kpiData = "";

                $timeout(function () {
                    $scope.$watch(function () {
                        var i = 0;
                        var watch = [];
                        var indicator = [];
                        var year = "";

                        angular.forEach(appServ.table.dataSource.qualityAssurance, function (item) {
                            watch.push(self.addedit.formField.qualityAssurance[item.id]);
                        });
                        
                        i = 0;
                        angular.forEach(kpiObj.table.data, function (item1) {
                            indicator[i] = (item1.id + item1.title.TH + item1.title.EN);                            

                            if (kpiObj.addedit.formField.startYear)
                            {                                
                                year = "";
                                angular.forEach(utilServ.getArrayNumber(kpiObj.table.maxCol), function (item2) {
                                    year = ((kpiObj.addedit.formField.startYear - 0) + (item2 - 1));
                                    indicator[i] += (year + "" + (item1.year[year] ? item1.year[year] : ""));
                                });
                            }
                            
                            i++;
                        });
                        kpiData = indicator.join("");
                        watch.push(kpiData);
                        
                        return watch;
                    }, function () {
                        var exit = false;

                        if (!exit)
                        {
                            angular.forEach(appServ.table.dataSource.qualityAssurance, function (item) {
                                if (self.addedit.formField.qualityAssurance[item.id] !== self.addedit.formValue.qualityAssurance[item.id])
                                {
                                    exit = true;
                                    return;
                                }
                            });
                        }

                        if (!exit)
                        {
                            if (kpiData !== kpiObj.addedit.formValue.kpiData)
                                exit = true;
                        }

                        self.addedit.isFormChanged = exit;
                        self.addedit.formValidate.resetValue();
                    }, true);
                }, 0);
            },            
            formField: {
                dLevel: "B",
                qualityAssurance: {}
            },
            formValue: {
                qualityAssurance: {}
            },
            formValidate: {
                setValue: function () {
                    this.resetValue();
                },
                resetValue: function () {
                    this.showSaveError = false;
                    this.isValid = {};
                }
            },
            setValue: function () {
                var deferred = $q.defer();

                this.isAdd = false;
                this.isEdit = false;
                this.isUpdate = false;
                this.isDelete = false;
                this.isFormChanged = false;

                this.formValidate.setValue();

                programmeServ.getDataSourceOnGroup(7).then(function () {
                    $timeout(function () {
                        deferred.resolve();
                    }, 0);
                });

                return deferred.promise;
            },
            getDataMaster: function () {
                var deferred = $q.defer();

                inputTypeServ.getDataSource({
                    action: "getlist",
                    params: [
                        "",
                        ("curYear=" + utilServ.curYear.TH),
                        ("dLevel=" + self.addedit.formField.dLevel)
                    ].join("&")
                }).then(function (result) {
                    appServ.table.dataSource["qualityAssurance"] = angular.copy($filter("filter")(result, { groupType: "qualityAssur" }));

                    $timeout(function () {
                        deferred.resolve();
                    }, 0);
                });

                return deferred.promise;
            },
            resetValue: function () {
                if (this.isAdd || this.isEdit || this.isUpdate)
                {
                    var kpiObj = self.kpi.owner[self.owner];

                    angular.forEach(appServ.table.dataSource.qualityAssurance, function (item) {
                        self.addedit.formValue.qualityAssurance[item.id] = "";
                        self.addedit.formField.qualityAssurance[item.id] = self.addedit.formValue.qualityAssurance[item.id];
                    });

                    kpiObj.table.reload.getData(self.owner);

                    $timeout(function () {
                        autosize.update($("textarea"));
                    }, 0);

                    this.formValidate.resetValue();
                    utilServ.gotoTopPage();
                }
            },
            getValue: function () {
                var kpiObj = self.kpi.owner[self.owner];
                var result = {
                    tableType: (programmeServ.dataRow.tableType ? programmeServ.dataRow.tableType : "temp"),
                    id: (programmeServ.dataRow.id ? programmeServ.dataRow.id : ""),
                    facultyId: facultyServ.facultyInfo.id,
                    programId: (programmeServ.dataRow.programId ? programmeServ.dataRow.programId : ""),
                    programCode: (programmeServ.dataRow.programCode ? programmeServ.dataRow.programCode : ""),
                    majorId: (programmeServ.dataRow.majorId ? programmeServ.dataRow.majorId : ""),
                    majorCode: (programmeServ.dataRow.majorCode ? programmeServ.dataRow.majorCode : ""),
                    groupNum: (programmeServ.dataRow.groupNum ? programmeServ.dataRow.groupNum : ""),
                    courseYear: (programmeServ.dataRow.courseYear ? programmeServ.dataRow.courseYear : ""),
                    xmlQualityAssurance: TQFServ.inputTypeRemark.getValue("qualityAssurance", appServ.table.dataSource.qualityAssurance, this.formField),
                    startYearKPI: (kpiObj.addedit.formField.startYear ? kpiObj.addedit.formField.startYear : ""),
                    xmlIndicators: kpiObj.addedit.getValue(self.owner)
                };

                return result;
            },
            add: {
                init: function () {
                    self.addedit.init();
                },
                setValue: function () {
                    self.addedit.isAdd = true;
                    self.addedit.isEdit = false;
                    self.addedit.isUpdate = false;
                    self.addedit.isDelete = false;
                }
            },
            edit: {
                init: function () {
                    self.addedit.init();
                },
                setValue: function () {
                    self.addedit.isAdd = false;
                    self.addedit.isEdit = true;
                    self.addedit.isUpdate = false;
                    self.addedit.isDelete = false;
                }
            },
            update: {
                init: function () {
                    self.addedit.init();
                },
                setValue: function () {
                    var deferred = $q.defer();

                    self.addedit.isAdd = false;
                    self.addedit.isEdit = false;
                    self.addedit.isUpdate = true;
                    self.addedit.isDelete = false;
                }
            },
            saveChange: {
                value: {},
                validate: function () {
                    var exit = false;
                    
                    if (self.addedit.isAdd || self.addedit.isEdit || self.addedit.isUpdate)
                    {
                        if (this.value.xmlQualityAssurance ||
                            this.value.xmlIndicators)
                            exit = true;
                    }

                    return exit;
                },
                action: function () {
                    this.value = angular.copy(self.addedit.getValue());
                    
                    if (this.validate())
                    {
                        var action;

                        if (self.addedit.isAdd)     action = "add";
                        if (self.addedit.isEdit)    action = "edit";
                        if (self.addedit.isUpdate)  action = "update";
                        if (self.addedit.isDelete)  action = "remove";
                        
                        programmeServ.saveChange.action({
                            action: action,
                            data: self.addedit.getValue()
                        }).then(function (result) {
                            if (result.status)
                            {
                                if (result.mode === "add")
                                {
                                    self.addedit.isAdd = true;
                                    self.addedit.isEdit = false;
                                    self.addedit.isUpdate = false;
                                    self.addedit.isDelete = false;
                                }

                                if (self.addedit.isAdd)
                                    $location.path("/TQFInfo/TQF2/" + (result.action === "add" ? "edit" : result.action) + "/temp/" + result.id).replace();

                                if (self.addedit.isEdit || self.addedit.isUpdate)
                                {
                                    var action = self.addedit.template.action;

                                    programmeServ.getDataSourceOnGroup(7).then(function () {
                                        self.addedit[action].setValue();
                                        self.addedit.isFormChanged = false;
                                        self.addedit.resetValue();
                                    });
                                }
                            }
                        });                        
                    }
                    else
                    {
                        utilServ.gotoTopPage();
                        utilServ.dialogErrorWithDict(["save", "error"], function () { });
                    }
                }
            }
        };

        self.kpi = {
            owner: {},
            new: function (key) {
                this.owner[key] = {};
                angular.copy(this.kpi, this.owner[key]);
            },            
            kpi: {
                table: {
                    maxCol: 5,                    
                    data: [],
                    reload: {
                        getData: function (owner) {                            
                            var i = 0;
                            var obj = self.kpi.owner[owner];
                            var year = "";
                            var indicator = [];                            
                            var kpiData = {};

                            obj.addedit.formValue.startYear = "";
                            obj.addedit.formField.startYear = obj.addedit.formValue.startYear;

                            obj.addedit.formValue.kpiTableList = [];
                            obj.addedit.formValue.kpiData = "";
                            i = 0;
                            angular.forEach(dictServ.dict.kpi.table.indicator, function (item1) {
                                indicator[i] = (item1.id + item1.title.TH + item1.title.EN);
                                kpiData["year"] = {};

                                if (obj.addedit.formField.startYear)
                                {
                                    year = "";                                    
                                    angular.forEach(utilServ.getArrayNumber(obj.table.maxCol), function (item2) {
                                        year = ((obj.addedit.formField.startYear - 0) + (item2 - 1));
                                        indicator[i] += year;
                                        kpiData.year[year] = "";
                                    });                            
                                }

                                obj.addedit.formValue.kpiTableList.push(angular.extend(item1, kpiData));
                                i++;
                            });
                            angular.copy(obj.addedit.formValue.kpiTableList, obj.table.data);
                            obj.addedit.formValue.kpiData = indicator.join("");
                        }
                    }
                },    
                addedit: {
                    showForm: false,
                    init: function (owner) {
                        this.setValue(owner).then(function () {
                            var obj = self.kpi.owner[owner];

                            obj.addedit.watchFormChange(owner);
                            obj.addedit.resetValue(owner);
                        });
                    },
                    formField: {
                        startYear: ""
                    },
                    formValue: {
                        id: "",
                        name: {
                            TH: "",
                            EN: ""
                        },
                        startYear: "",                        
                        kpiTableList: [],
                        kpiData: ""
                    },
                    formValidate: {
                        setValue: function () {
                            this.resetValue();
                        },
                        resetValue: function () {
                            this.showSaveError = false;
                            this.isValid = {
                                name: {
                                    TH: true,
                                    EN: true
                                },
                                unique: true
                            };
                        }
                    },
                    watchFormChange: function (owner) {               
                        var obj = self.kpi.owner[owner];
                        var kpiServObj = kpiServ.form.owner[owner];

                        kpiServ.form.watchFormChange();

                        $timeout(function () {
                            $scope.$watch(function () {
                                var watch = [];

                                watch.push(kpiServObj.addedit.formField.name.TH);
                                watch.push(kpiServObj.addedit.formField.name.EN);

                                return watch;
                            }, function () {
                                var exit = false;

                                if (!exit)
                                {
                                    if ((kpiServObj.addedit.formField.name.TH !== obj.addedit.formValue.name.TH) ||
                                        (kpiServObj.addedit.formField.name.EN !== obj.addedit.formValue.name.EN))
                                        exit = true;
                                }

                                obj.addedit.isFormChanged = exit;
                                obj.addedit.formValidate.resetValue();
                            }, true);
                        }, 0);
                    },
                    setValue: function (owner) {      
                        var deferred = $q.defer();
                        var obj = self.kpi.owner[owner];

                        obj.addedit.isFormChanged = false;

                        obj.addedit.formValidate.setValue();                        

                        $timeout(function () {
                            deferred.resolve();
                        }, 0);

                        return deferred.promise;
                    },
                    resetValue: function (owner) {
                        var obj = self.kpi.owner[owner];
                        var kpiServObj = kpiServ.form.owner[owner];
                        
                        obj.addedit.formValue.id = "";
                        kpiServObj.addedit.formField.id = obj.addedit.formValue.id;
                        
                        obj.addedit.formValue.name.TH = "";
                        kpiServObj.addedit.formField.name.TH = obj.addedit.formValue.name.TH;
                        
                        obj.addedit.formValue.name.EN = "";                        
                        kpiServObj.addedit.formField.name.EN = obj.addedit.formValue.name.EN;
                        
                        $timeout(function () {
                            autosize.update($(".form-kpi .addedit textarea"));
                        }, 0);                        

                        obj.addedit.formValidate.resetValue();
                    },
                    getValue: function (owner) {
                        var obj = self.kpi.owner[owner];
                        var result = "";
                        var year = "";

                        if (obj.table.data.length > 0)
                        {
                            if (obj.addedit.formField.startYear)
                            {
                                result += (
                                    "<row>"
                                );

                                angular.forEach(obj.table.data, function (item1) {
                                    result += (
                                        "<id>" + item1.id + "</id>" +
                                        "<titleTH>" + item1.title.TH + "</titleTH>" +
                                        "<titleEN>" + item1.title.EN + "</titleEN>" +
                                        "<year>"
                                    );
                                    
                                    year = "";
                                    angular.forEach(utilServ.getArrayNumber(obj.table.maxCol), function (item2) {
                                        year = ((obj.addedit.formField.startYear - 0) + (item2 - 1));
                                        result += (
                                            "<y" + year + ">" + item1.year[year] + "</y" + year + ">"
                                        );
                                    });

                                    result += (
                                        "</year>"
                                    );
                                });

                                result += (
                                    "</row>"
                                );
                            }
                        }
                        
                        return result;
                    },
                    saveChange: {
                        validate: function (owner) {
                            var obj = self.kpi.owner[owner];
                            var kpiServObj = kpiServ.form.owner[owner];
                            var i = 0;

                            if (!kpiServObj.addedit.formField.name.TH) { obj.addedit.formValidate.isValid.name.TH = false; i++; }
                            if (!kpiServObj.addedit.formField.name.EN) { obj.addedit.formValidate.isValid.name.EN = false; i++; }
                            if (utilServ.getObjectByValue(obj.table.data, "id", kpiServObj.addedit.formField.id).length > 0) { obj.addedit.formValidate.isValid.unique = false; i++; }

                            obj.addedit.formValidate.showSaveError = (i > 0 ? true : false);

                            return (i > 0 ? false : true);
                        },
                        action: function (owner) {
                            var obj = self.kpi.owner[owner];
                            var kpiServObj = kpiServ.form.owner[owner];

                            if (this.validate(owner))
                            {
                                obj.table.data.push({
                                    id: kpiServObj.addedit.formField.id,
                                    title: {
                                        TH: kpiServObj.addedit.formField.name.TH,
                                        EN: kpiServObj.addedit.formField.name.EN
                                    },
                                    year: {}
                                });
                            }
                        }
                    }
                }
            }
        };
    })

    .controller("TQFInfo.TQF2.group8Ctrl", function ($scope, $timeout, $q, $location, $filter, utilServ, appServ, pageRouteServ, facultyServ, programmeServ, TQFServ, inputTypeServ) {
        var self = this;

        self.owner = "tqf2g8";

        self.addedit = {
            showForm: false,
            template: {
                content: "",
                action: "",
                init: function () {
                    if (appServ.isUser && facultyServ.isFaculty && programmeServ.isProgram && self.addedit.showForm)
                    {
                        utilServ.getDialogPreloadingWithDict(["msgPreloading", "loading"]);

                        this.content = pageRouteServ.pageObject.TQF2.group8.addedit.template;
                    }
                },
                remove: function () {
                    utilServ.removeCacheTemplate(this.content);
                    this.content = "";
                }
            },
            init: function () {
                if (appServ.isUser && facultyServ.isFaculty && programmeServ.isProgram)
                {
                    var action = self.addedit.template.action;

                    this.setValue().then(function () {
                        self.addedit[action].setValue();
                        programmeServ.isProgram = TQFServ.isProgramOnGroup(self, programmeServ.dataRow);

                        if (programmeServ.isProgram)
                        {
                            self.addedit.getDataMaster().then(function () {
                                self.addedit.watchFormChange();
                                self.addedit.resetValue();
                                self.addedit.showForm = true;

                                appServ.closeDialogPreloading();
                            });
                        }
                    });
                }
                else
                    self.addedit.showForm = false;
            },
            watchFormChange: function () {
                $timeout(function () {
                    $scope.$watch(function () {
                        var watch = [];

                        angular.forEach(appServ.table.dataSource.courseImplement, function (item) {
                            watch.push(self.addedit.formField.courseImplement[item.id]);
                        });

                        return watch;
                    }, function () {
                        var exit = false;

                        if (!exit)
                        {
                            angular.forEach(appServ.table.dataSource.courseImplement, function (item) {
                                if (self.addedit.formField.courseImplement[item.id] !== self.addedit.formValue.courseImplement[item.id])
                                {
                                    exit = true;
                                    return;
                                }
                            });
                        }

                        self.addedit.isFormChanged = exit;
                        self.addedit.formValidate.resetValue();
                    }, true);
                }, 0);
            },
            formField: {
                dLevel: "B",
                courseImplement: {}
            },
            formValue: {
                courseImplement: {}
            },
            formValidate: {
                setValue: function () {
                    this.resetValue();
                },
                resetValue: function () {
                    this.showSaveError = false;
                    this.isValid = {};
                }
            },
            setValue: function () {
                var deferred = $q.defer();

                this.isAdd = false;
                this.isEdit = false;
                this.isUpdate = false;
                this.isDelete = false;
                this.isFormChanged = false;

                this.formValidate.setValue();

                programmeServ.getDataSourceOnGroup(8).then(function () {
                    $timeout(function () {
                        deferred.resolve();
                    }, 0);
                });

                return deferred.promise;
            },
            getDataMaster: function () {
                var deferred = $q.defer();

                inputTypeServ.getDataSource({
                    action: "getlist",
                    params: [
                        "",
                        ("curYear=" + utilServ.curYear.TH),
                        ("dLevel=" + self.addedit.formField.dLevel)
                    ].join("&")
                }).then(function (result) {
                    appServ.table.dataSource["courseImplement"] = angular.copy($filter("filter")(result, { groupType: "courseImplement" }));

                    $timeout(function () {
                        deferred.resolve();
                    }, 0);
                });

                return deferred.promise;
            },
            resetValue: function () {
                if (this.isAdd || this.isEdit || this.isUpdate)
                {
                    angular.forEach(appServ.table.dataSource.courseImplement, function (item) {
                        self.addedit.formValue.courseImplement[item.id] = "";
                        self.addedit.formField.courseImplement[item.id] = self.addedit.formValue.courseImplement[item.id];
                    });

                    $timeout(function () {
                        autosize.update($("textarea"));
                    }, 0);

                    this.formValidate.resetValue();
                    utilServ.gotoTopPage();
                }
            },
            getValue: function () {
                var result = {
                    tableType: (programmeServ.dataRow.tableType ? programmeServ.dataRow.tableType : "temp"),
                    id: (programmeServ.dataRow.id ? programmeServ.dataRow.id : ""),
                    facultyId: facultyServ.facultyInfo.id,
                    programId: (programmeServ.dataRow.programId ? programmeServ.dataRow.programId : ""),
                    programCode: (programmeServ.dataRow.programCode ? programmeServ.dataRow.programCode : ""),
                    majorId: (programmeServ.dataRow.majorId ? programmeServ.dataRow.majorId : ""),
                    majorCode: (programmeServ.dataRow.majorCode ? programmeServ.dataRow.majorCode : ""),
                    groupNum: (programmeServ.dataRow.groupNum ? programmeServ.dataRow.groupNum : ""),
                    courseYear: (programmeServ.dataRow.courseYear ? programmeServ.dataRow.courseYear : ""),
                    xmlCourseImplement: TQFServ.inputTypeRemark.getValue("courseImplement", appServ.table.dataSource.courseImplement, this.formField)
                };                
               
                return result;
            },
            add: {
                init: function () {
                    self.addedit.init();
                },
                setValue: function () {
                    self.addedit.isAdd = true;
                    self.addedit.isEdit = false;
                    self.addedit.isUpdate = false;
                    self.addedit.isDelete = false;
                }
            },
            edit: {
                init: function () {
                    self.addedit.init();
                },
                setValue: function () {
                    self.addedit.isAdd = false;
                    self.addedit.isEdit = true;
                    self.addedit.isUpdate = false;
                    self.addedit.isDelete = false;
                }
            },
            update: {
                init: function () {
                    self.addedit.init();
                },
                setValue: function () {
                    self.addedit.isAdd = false;
                    self.addedit.isEdit = false;
                    self.addedit.isUpdate = true;
                    self.addedit.isDelete = false;
                }
            },
            saveChange: {
                value: {},
                validate: function () {
                    var exit = false;

                    if (self.addedit.isAdd || self.addedit.isEdit || self.addedit.isUpdate)
                    {
                        if (this.value.xmlCourseImplement)
                            exit = true;
                    }

                    return exit;
                },
                action: function () {
                    this.value = angular.copy(self.addedit.getValue());

                    if (this.validate())
                    {
                        var action;

                        if (self.addedit.isAdd)     action = "add";
                        if (self.addedit.isEdit)    action = "edit";
                        if (self.addedit.isUpdate)  action = "update";
                        if (self.addedit.isDelete)  action = "remove";

                        programmeServ.saveChange.action({
                            action: action,
                            data: self.addedit.getValue()
                        }).then(function (result) {
                            if (result.status)
                            {
                                if (result.mode === "add")
                                {
                                    self.addedit.isAdd = true;
                                    self.addedit.isEdit = false;
                                    self.addedit.isUpdate = false;
                                    self.addedit.isDelete = false;
                                }

                                if (self.addedit.isAdd)
                                    $location.path("/TQFInfo/TQF2/" + (result.action === "add" ? "edit" : result.action) + "/temp/" + result.id).replace();

                                if (self.addedit.isEdit || self.addedit.isUpdate)
                                {
                                    var action = self.addedit.template.action;

                                    programmeServ.getDataSourceOnGroup(8).then(function () {
                                        self.addedit[action].setValue();
                                        self.addedit.isFormChanged = false;
                                        self.addedit.resetValue();
                                    });
                                }
                            }
                        });
                    }
                    else
                    {
                        utilServ.gotoTopPage();
                        utilServ.dialogErrorWithDict(["save", "error"], function () { });
                    }
                }
            }
        };
    });
})();