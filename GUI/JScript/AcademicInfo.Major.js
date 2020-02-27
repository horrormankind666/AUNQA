/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๐๙/๐๔/๒๕๖๑>
Modify date : <๓๐/๐๘/๒๕๖๒>
Description : <รวมรวบฟังก์ชั่นใช้งานสำหรับข้อมูลการศึกษาในส่วนของข้อมูลสาขาวิชา>
=============================================
*/

(function () {
    "use strict";

    angular.module("academicInfo.majorMod", [
        "ngTable",
        "utilMod",
        "appMod",
        "dictMod",
        "pageRouteMod",
        "facultyMod",
        "majorMod"
    ])

    .controller("academicInfo.majorCtrl", function ($scope, $timeout, $q, $compile, utilServ, appServ, dictServ, pageRouteServ, facultyServ, majorServ) {
        var self = this;
        
        pageRouteServ.setMenuActive({
            menuName: (pageRouteServ.pageObject.faculty.class + "-menu"),
            isSubSubMenu: true
        });
        dictServ.dict.menuTmp = {
            TH: (dictServ.dict.major.TH + (facultyServ.facultyInfo.code ? (" : " + facultyServ.facultyInfo.code) : "")),
            EN: (dictServ.dict.major.EN + (facultyServ.facultyInfo.code ? (" : " + facultyServ.facultyInfo.code) : ""))
        };

        self.init = function () {
            if (appServ.isUser)
            {
                if (facultyServ.isFaculty)
                {
                    self.setValue().then(function () {          
                        self.watchFormChange();           
                        self.resetValue();
                        self.showForm = true;
                        self.table.hide = false;

                        self.tabSelect.selected("verified");
                    });
                }
                else
                {
                    self.showForm = false;

                    appServ.closeDialogPreloading();

                    utilServ.dialogErrorWithDict(["faculty", "facultyNotFound"], function (e) {
                    });
                } 
            }
        };

        self.tabSelect = {
            activeTabIndex: 0,
            selected: function (tabName) {
                if (self[tabName].template.content.length === 0)
                    utilServ.getDialogPreloadingWithDict(["msgPreloading", "loading"]);
                
                if (tabName === "verified")         this.activeTabIndex = 0;
                if (tabName === "pendingVerify")    this.activeTabIndex = 1;

                self[tabName].template.init();
            }
        };

        self.watchFormChange = function () {
            $timeout(function () {
                $scope.$watch(function () {
                    var watch = [];

                    watch.push(self.table.isReload);

                    return watch;
                }, function () {
                    if (self.table.isReload)
                    {
                        majorServ.tableList.majorVerified.settings().$loading = false;
                        majorServ.tableList.majorPendingVerify.settings().$loading = false;

                        var obj = self.table.reload;

                        obj.isPreloading = true;
                        obj.isResetDataSource = true;
                        obj.order = [{
                            table: "majorVerified",
                            isFirstPage: true
                        }, {
                            table: "majorPendingVerify",
                            isFirstPage: true
                        }];
                        obj.action().then(function () {
                            self.table.hide = false;
                        });
                    }
                }, true);
            }, 0);
        };

        self.setValue = function () {
            var deferred = $q.defer();

            self.showForm = false;
            
            self.table.dataSource = [];
            self.table.reload.getData().then(function () {                                
                majorServ.table = self.table;

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
            dataSource: [],
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
                            majorServ.tableList[item.table].reload();
                            if (majorServ.tableList[item.table].total() === 0) item.isFirstPage = true;
                            if (item.isFirstPage) majorServ.tableList[item.table].page(1);
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
                        self.table.dataSource = [];                        
                    }

                    majorServ.getDataSource({
                        dataSource: self.table.dataSource,
                        action: "getlist",
                        params: [
                            "",
                            ("facultyId=" + facultyServ.facultyInfo.id)
                        ].join("&")
                    }).then(function (result) {
                        self.table.dataSource = result;                        

                        $timeout(function () {
                            deferred.resolve();
                        }, 0);
                    });

                    return deferred.promise;
                }
            }
        };

        self.verified = {
            template: {
                content: "",
                init: function () {
                    if (appServ.isUser && facultyServ.isFaculty)
                        this.content = pageRouteServ.pageObject.major.verified.template;
                }
            }
        };

        self.pendingVerify = {
            template: {
                content: "",
                init: function () {
                    if (appServ.isUser && facultyServ.isFaculty)
                        this.content = pageRouteServ.pageObject.major.pendingVerify.template;
                }
            }
        };

        self.addedit = {
            showForm: false,
            template: {
                content: "",          
                action: "",
                init: function () {
                    if (appServ.isUser && facultyServ.isFaculty && self.addedit.showForm)
                    {
                        utilServ.getDialogPreloadingWithDict(["msgPreloading", "loading"]);

                        this.content = pageRouteServ.pageObject.major.addedit.template;
                    }
                },
                remove: function () {                    
                    pageRouteServ.setMenuActiveAction({
                        menuName: (pageRouteServ.pageObject.faculty.class + "-menu"),
                        isSubSubMenu: true
                    });

                    utilServ.removeCacheTemplate(this.content);
                    this.content = "";
                }
            },
            init: function () {
                if (appServ.isUser && facultyServ.isFaculty)
                {
                    var action = self.addedit.template.action;

                    if (action === "add" || action === "edit")
                        pageRouteServ.setMenuActiveAction({
                            menuName: (pageRouteServ.pageObject.faculty.class + "-menu"),
                            isSubSubMenu: true,
                            action: action
                        });

                    this.setValue().then(function () {
                        self.addedit[action].setValue().then(function () {
                            self.addedit.watchFormChange();
                            self.addedit.resetValue();
                            self.addedit.showForm = true;

                            appServ.closeDialogPreloading();
                        });
                    });
                }
                else
                    self.addedit.showForm = false;
            },
            formField: {
                id: "",
                code: "",
                name: {
                    TH: "",
                    EN: ""
                },
                abbrev: {
                    TH: "",
                    EN: ""
                }
            },
            formValue: {
                id: "",
                code: "",
                name: {
                    TH: "",
                    EN: ""
                },
                abbrev: {
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

                        watch.push(self.addedit.formField.code);
                        watch.push(self.addedit.formField.name.TH);
                        watch.push(self.addedit.formField.name.EN);
                        watch.push(self.addedit.formField.abbrev.TH);
                        watch.push(self.addedit.formField.abbrev.EN);

                        return watch;
                    }, function () {
                        var exit = false;

                        if (!exit)
                        {
                            if ((self.addedit.formField.code !== self.addedit.formValue.code) ||
                                (self.addedit.formField.name.TH !== self.addedit.formValue.name.TH) ||
                                (self.addedit.formField.name.EN !== self.addedit.formValue.name.EN) ||
                                (self.addedit.formField.abbrev.TH !== self.addedit.formValue.abbrev.TH) ||
                                (self.addedit.formField.abbrev.EN !== self.addedit.formValue.abbrev.EN))
                                exit = true;
                        }

                        //self.addedit.isFormChanged = exit;
                        //self.addedit.formValidate.resetValue();
                    }, true);
                }, 0);
            },
            setValue: function () {
                var deferred = $q.defer();

                this.isAdd = false;
                this.isEdit = false;
                this.isDelete = false;
                this.isFormChanged = false;

                this.formValidate.setValue();

                $timeout(function () {
                    deferred.resolve();
                }, 0);

                return deferred.promise;
            },
            resetValue: function () {
                var dataRow = {};

                if (this.isEdit)    dataRow = this.edit.dataRow;
                if (this.isDelete)  dataRow = this.delete.dataRow;
                
                this.formValue.id = (Object.keys(dataRow).length > 0 && dataRow.id ? dataRow.id : "");
                this.formField.id = this.formValue.id;
                
                if (this.isAdd || this.isEdit)
                {
                    this.formValue.code = (dataRow.code ? dataRow.code : "");
                    this.formField.code = this.formValue.code;

                    this.formValue.name.TH = (dataRow.name ? dataRow.name.TH : "");
                    this.formField.name.TH = this.formValue.name.TH;

                    this.formValue.name.EN = (dataRow.name ? dataRow.name.EN : "");
                    this.formField.name.EN = this.formValue.name.EN;

                    this.formValue.abbrev.TH = (dataRow.abbrev ? dataRow.abbrev.TH : "");
                    this.formField.abbrev.TH = this.formValue.abbrev.TH;

                    this.formValue.abbrev.EN = (dataRow.abbrev ? dataRow.abbrev.EN : "");
                    this.formField.abbrev.EN = this.formValue.abbrev.EN;

                    this.formValidate.resetValue();
                    utilServ.gotoTopPage();
                }
            },
            getValue: function () {
                var result = {
                    id: (this.formField.id ? this.formField.id : ""),
                    facultyId: facultyServ.facultyInfo.id,
                    codeEn: (this.formField.code ? this.formField.code : ""),
                    nameTh: (this.formField.name.TH ? this.formField.name.TH : ""),
                    nameEn: (this.formField.name.EN ? this.formField.name.EN : ""),
                    abbrevTh: (this.formField.abbrev.TH ? this.formField.abbrev.TH : ""),
                    abbrevEn: (this.formField.abbrev.EN ? this.formField.abbrev.EN : ""),                    
                };

                return result;
            },
            add: {
                init: function () {
                    self.addedit.init();
                },
                setValue: function () {
                    var deferred = $q.defer();

                    self.addedit.isAdd = true;
                    self.addedit.isEdit = false;
                    self.addedit.isDelete = false;

                    $timeout(function () {
                        deferred.resolve();
                    }, 0);

                    return deferred.promise;
                }
            },
            edit: {
                dataRow: {},                
                init: function () {
                    self.addedit.init();
                },
                setValue: function () {
                    var deferred = $q.defer();

                    self.addedit.isAdd = false;
                    self.addedit.isEdit = true;
                    self.addedit.isDelete = false;

                    majorServ.getDataSource({
                        action: "get",
                        params: [
                            "",
                            ("majorId=" + self.addedit.formValue.id)
                        ].join("&")
                    }).then(function (result) {
                        self.addedit.edit.dataRow = (result[0] ? result[0] : {});

                        $timeout(function () {
                            deferred.resolve();
                        }, 0);
                    });

                    return deferred.promise;
                }
            },
            delete: {
                dataRow: {},
                init: function () {
                    this.setValue();
                },
                setValue: function () {                    
                    self.addedit.isAdd = false;
                    self.addedit.isEdit = false;
                    self.addedit.isDelete = true;

                    self.addedit.resetValue();
                }
            },
            saveChange: {
                validate: function () {
                    var i = 0;

                    if (self.addedit.isAdd || self.addedit.isEdit)
                    {
                        if (!self.addedit.formField.code) { self.addedit.formValidate.isValid.code = false; i++; }
                        if (!self.addedit.formField.name.TH) { self.addedit.formValidate.isValid.name.TH = false; i++; }
                        if (!self.addedit.formField.name.EN) { self.addedit.formValidate.isValid.name.EN = false; i++; }
                    }

                    self.addedit.formValidate.showSaveError = (i > 0 ? true : false);

                    return (i > 0 ? false : true);
                },
                action: function () {
                    if (this.validate())
                    {              
                        var action;

                        if (self.addedit.isAdd)     action = "add";
                        if (self.addedit.isEdit)    action = "edit";
                        if (self.addedit.isDelete)  action = "remove";

                        utilServ.dialogConfirmWithDict([action, "confirm"], function (result) {
                            if (result)
                            {                                                                
                                var data = self.addedit.getValue();

                                if (self.addedit.isDelete)
                                    utilServ.getDialogPreloadingWithDict(["msgPreloading", "removing"]);

                                appServ.save.action({
                                    routePrefix: "Major",
                                    action: action,
                                    data: [data]
                                }).then(function (result) {
                                    if (result.status)
                                    {
                                        if (self.addedit.isAdd || self.addedit.isEdit)
                                        {                                            
                                            var action = self.addedit.template.action;

                                            self.addedit[action].setValue().then(function () {
                                                self.addedit.isFormChanged = false;
                                                self.addedit.resetValue();
                                            });
                                        }
                                        if (self.addedit.isDelete)
                                        {
                                            var obj = self.table.reload;

                                            obj.isPreloading = false;
                                            obj.isResetDataSource = true;
                                            obj.order = [{
                                                table: "majorVerified",
                                                isFirstPage: false
                                            }, {
                                                table: "majorPendingVerify",
                                                isFirstPage: false
                                            }];
                                            obj.action();
                                        }
                                    }
                                });
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

        self.verifyReject = {
            getDialogForm: {
                template: pageRouteServ.pageObject.major.verifyReject.template,
                validate: function () {
                    if (majorServ.dataSelect.data.length === 0)
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
                                    url: self.verifyReject.getDialogForm.template
                                }).then(function (result) {
                                    var title = ["major", majorServ.dataSelect.action];
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

    .controller("academicInfo.major.verifiedCtrl", function ($scope, $timeout, $q, $filter, NgTableParams, utilServ, appServ, facultyServ, majorServ) {
        var self = this;

        self.init = function () {
            if (appServ.isUser && facultyServ.isFaculty)
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

                    watch.push(majorServ.tableList.majorVerified.settings().$loading);

                    return watch;
                }, function () {
                    if (majorServ.tableList.majorVerified.settings().$loading)
                    {   
                        $(".academicinfo.major.verified table tbody").hide();
                        $(".academicinfo.major.verified .pagination").hide();
                    }
                    else
                    {
                        $(".academicinfo.major.verified table tbody").show();
                        $(".academicinfo.major.verified .pagination").show();                

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
                        var obj = majorServ.table.reload;

                        obj.isPreloading = false;
                        obj.isResetDataSource = false;
                        obj.order = [{
                            table: "majorVerified",
                            isFirstPage: true
                        }];
                        obj.action();
                    }
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
                        selectFilter: (this.formField.keyword ? this.formField.keyword : "!null"),
                        status: "Y"
                    });
                }
            },
            getData: function () {
                majorServ.tableList.majorVerified = new NgTableParams(appServ.tableConfig.params, angular.extend(appServ.tableConfig.setting, {
                    getData: function (params) {
                        return $timeout(function () { }, appServ.tableConfig.timeout).then(function (result) {                            
                            return majorServ.table.reload.getData().then(function () {
                                var dt = majorServ.table.dataSource;
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

    .controller("academicInfo.major.pendingVerifyCtrl", function ($scope, $timeout, $q, $filter, NgTableParams, utilServ, appServ, facultyServ, majorServ) {
        var self = this;
        
        self.init = function () {
            if (appServ.isUser && facultyServ.isFaculty)
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

                    watch.push(majorServ.tableList.majorPendingVerify.settings().$loading);
                    watch.push(majorServ.dataSelect.data);

                    return watch;
                }, function () {
                    if (majorServ.tableList.majorPendingVerify.settings().$loading)
                    {                        
                        $(".academicinfo.major.pendingverify table tbody").hide();
                        $(".academicinfo.major.pendingverify .pagination").hide();
                    }
                    else
                    {
                        $(".academicinfo.major.pendingverify table tbody").show();
                        $(".academicinfo.major.pendingverify .pagination").show();                

                        self.table.finishRender();
                    }

                    if (majorServ.dataSelect.data.length === 0)
                        self.uncheckboxAll();
                }, true);

                $scope.$watch(function () {
                    return [
                        self.table.filter.formField.keyword,
                        self.table.filter.formField.verifyStatusSelected.selected
                    ];
                }, function (newValue, oldValue) {
                    if ((newValue[0] !== oldValue[0]) ||
                        (newValue[1] !== oldValue[1]))
                    {
                        var obj = majorServ.table.reload;

                        obj.isPreloading = false;
                        obj.isResetDataSource = false;
                        obj.order = [{
                            table: "majorPendingVerify",
                            isFirstPage: true
                        }];
                        obj.action();
                        self.uncheckboxAll();
                    }
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
                    verifyStatusSelected: {}
                },
                setValue: function () {                    
                    this.resetValue();
                    this.showForm = false;
                },
                resetValue: function () {
                    this.formField.keyword = "";
                    this.formField.verifyStatusSelected = {};
                },
                action: function (dataTable) {
                    return $filter("filter")(dataTable, {
                        selectFilter: (this.formField.keyword ? this.formField.keyword : "!null"),
                        status: (this.formField.verifyStatusSelected.selected ? this.formField.verifyStatusSelected.selected.id : "!Y")
                    });
                }
            },
            getData: function () {
                majorServ.tableList.majorPendingVerify = new NgTableParams(appServ.tableConfig.params, angular.extend(appServ.tableConfig.setting, {
                    getData: function (params) {
                        return $timeout(function () { }, appServ.tableConfig.timeout).then(function (result) {
                            return majorServ.table.reload.getData().then(function () {
                                var dt = majorServ.table.dataSource;
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
                return dr.status !== "Y";
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
                return dr.status !== "Y";
            });

            utilServ.uncheckboxAll({
                data: data,
                checkboxesRoot: self.table.formField.checkboxes.checked,
                checkboxesChild: self.table.formField.checkboxes.items,
                field: "id"
            });
        };

        self.uncheckboxAll = function () {
            if ($(".academicinfo.major.pendingverify .table .inputcheckbox:checked").length > 0)
            {
                if (self.table.formField.checkboxes.checked) self.table.formField.checkboxes.checked = false;
                self.checkboxChildOnOffByRoot();
            }
        };

        self.verifyReject = {
            setValue: function (action) {       
                var data = self.table.temp.filter(function (dr) {
                    return dr.status !== "Y";
                });

                majorServ.dataSelect = {
                    action: action,
                    data: utilServ.getValueCheckboxTrue(data, "id", self.table.formField.checkboxes.items)
                };
            }
        };
    })

    .controller("academicInfo.major.verifyRejectCtrl", function ($scope, $timeout, $q, $filter, NgTableParams, utilServ, appServ, facultyServ, majorServ) {
        var self = this;

        self.init = function () {
            if (appServ.isUser && facultyServ.isFaculty)
            {
                self.setValue().then(function () {                    
                    self.watchFormChange();
                    self.resetValue();
                    self.showForm = true;      
                    self.table.hide = false;
                });
            }
            else
                self.showForm = false;
        };

        self.formField = {
            verifyRemark: ""
        };

        self.formValidate = {
            setValue: function () {
                this.resetValue();
            },
            resetValue: function () {
                this.showSaveError = false;
                this.isValid = {
                    verifyRemark: true
                };
            }
        };

        self.watchFormChange = function () {
            $timeout(function () {
                $scope.$watch(function () {
                    var watch = [];

                    watch.push(majorServ.tableList.majorVerifyReject.settings().$loading);

                    return watch;
                }, function () {
                    if (majorServ.tableList.majorVerifyReject.settings().$loading)
                    {                        
                        $(".academicinfo.major.verifyreject table tbody").hide();
                        $(".academicinfo.major.verifyreject .pagination").hide();
                    }
                    else
                    {
                        $(".academicinfo.major.verifyreject table tbody").show();
                        $(".academicinfo.major.verifyreject .pagination").show();                

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
                        obj.action();
                    }
                }, true);
            }, 0);
        };

        self.setValue = function () {
            var deferred = $q.defer();

            self.showForm = false;

            self.formValidate.setValue();

            angular.forEach(majorServ.dataSelect.data, function (item) {
                self.table.temp.push(
                    $filter("filter")(majorServ.table.dataSource, {
                        id: item
                    })[0]
                );
            });                

            self.table.filter.setValue();
            self.table.getData();

            $timeout(function () {
                deferred.resolve();
            }, 0);
            
            return deferred.promise;
        };

        self.resetValue = function () {
            self.formField.verifyRemark = "";
        };

        self.table = {
            temp: [],
            hide: true,
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
                majorServ.tableList.majorVerifyReject = new NgTableParams(appServ.tableConfig.params, angular.extend(appServ.tableConfig.setting, {
                    getData: function (params) {
                        return $timeout(function () { }, appServ.tableConfig.timeout).then(function (result) {                            
                            var dt = self.table.temp;
                            var df = self.table.filter.action(dt);
                            var data = df.slice((params.page() - 1) * params.count(), params.page() * params.count());

                            params.total(df.length);
                            params.totalSearch = dt.length;
                            params.totalPage = (Math.ceil(params.total() / params.count()));

                            return data;
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
                action: function () {
                    if (this.isPreloading) utilServ.getDialogPreloadingWithDict(["msgPreloading", "loading"]);

                    majorServ.tableList.majorVerifyReject.reload();
                    majorServ.tableList.majorVerifyReject.page(1);
                }
            }
        };

        self.getValue = function () {
            var result = [];
            var verifyStatus = "";
            var verifyRemark = "";

            if (majorServ.dataSelect.action === "verify")
            {
                verifyStatus = "Y";
                verifyRemark = null;
            }
            if (majorServ.dataSelect.action === "reject")
            {
                verifyStatus = "N";
                verifyRemark = self.formField.verifyRemark;
            }

            angular.forEach(majorServ.dataSelect.data, function (item) {
                result.push({
                    id: item,
                    verifyStatus: verifyStatus,
                    verifyRemark: verifyRemark
                });
            });

            return result;
        };

        self.saveChange = {
            validate: function () {
                var i = 0;

                if (majorServ.dataSelect.action === "reject")
                {
                    if (!self.formField.verifyRemark) { self.formValidate.isValid.verifyRemark = false; i++; }
                }

                self.formValidate.showSaveError = (i > 0 ? true : false);

                return (i > 0 ? false : true);
            },
            action: function () {
                if (this.validate())
                {
                    utilServ.dialogConfirmWithDict(["edit", "confirm"], function (result) {
                        if (result)
                        {                              
                            var data = self.getValue();

                            appServ.save.action({
                                routePrefix: "Major",
                                action: "verify",
                                data: data
                            }).then(function (result) {
                                if (result.status)
                                {
                                    majorServ.dataSelect.action = "";
                                    majorServ.dataSelect.data = [];
                                    
                                    var obj = majorServ.table.reload;

                                    obj.isPreloading = false;
                                    obj.isResetDataSource = true;
                                    obj.order = [{
                                        table: "majorPendingVerify",
                                        isFirstPage: false
                                    }, {
                                        table: "majorVerified",
                                        isFirstPage: false
                                        }];
                                    obj.action().then(function () {
                                        $("#" + utilServ.idDialogForm + ".modal").modal("hide");
                                    });                                    
                                }
                            });
                        }
                    });                            
                }
                else
                    utilServ.dialogErrorWithDict(["save", "error"], function () { });
            }
        };
    });
})();