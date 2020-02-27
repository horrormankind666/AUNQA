/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๒/๑๐/๒๕๖๑>
Modify date : <๒๒/๑๐/๒๕๖๒>
Description : <รวมรวบฟังก์ชั่นใช้งานสำหรับข้อมูลมคอ.ในส่วนของมคอ. 2>
=============================================
*/

(function () {
    "use strict";

    angular.module("TQFInfo.TQF3Mod", [
        "utilMod",
        "appMod",
        "dictMod",
        "pageRouteMod",
        "facultyMod",
        "courseMod",
        "TQFMod",
        "inputTypeMod"
    ])

    .controller("TQFInfo.TQF3Ctrl", function ($scope, $timeout, $q, $location, utilServ, appServ, dictServ, pageRouteServ, facultyServ, courseServ, TQFServ) {
        var self = this;

        pageRouteServ.setMenuActive({
            menuName: (pageRouteServ.pageObject.TQF3.class + "-menu")
        });            

        self.maxSection = 7,
        self.accordionGroup = {};

        self.init = function () {
            if (appServ.isUser)
            {
                if (courseServ.isEdit || courseServ.isUpdate)
                {
                    if (courseServ.isCourse)
                    {
                        if (courseServ.isEdit)      self.addedit.template.action = "edit";
                        if (courseServ.isUpdate)    self.addedit.template.action = "update";

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

                        utilServ.dialogErrorWithDict(["course", "courseNotFound"], function (e) {
                        });
                    }
                }
                else
                {
                    if (courseServ.isCourse)
                        $location.path("/AcademicInfo/Course/" + facultyServ.facultyInfo.id).replace();
                    else
                    {
                        self.setValue().then(function () {           
                            self.watchFormChange();
                            self.resetValue();
                            facultyServ.isFaculty = false;
                            courseServ.isCourse = false;
                            self.showForm = true;

                            self.tabSelect.selected("courseVerified");
                        });
                    }
                }    
            }
        };

        self.watchFormChange = function () {
            $timeout(function () {
                $scope.$watch(function () {
                    var watch = [];

                    //watch.push(self.table.isReload);
                    watch.push(self.addedit.isEdit);
                    watch.push(self.addedit.isUpdate);

                    return watch;
                }, function () {
                    /*
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
                    */
                    if (self.addedit.isEdit || self.addedit.isUpdate)
                    {
                        pageRouteServ.setMenuActive({
                            menuName: (pageRouteServ.pageObject.TQF3.class + "-menu"),
                            isSubSubMenu: true
                        });
                        dictServ.dict.menuTmp = {
                            TH: courseServ.dataRow.code.aka.TH,
                            EN: courseServ.dataRow.code.aka.EN
                        };
                    }
                }, true);
            }, 0);
        };

        self.addedit = {
            showForm: false,
            disabled: false,
            template: {
                content: "",
                action: "",
                init: function () {
                    if (appServ.isUser && facultyServ.isFaculty && courseServ.isCourse && self.addedit.showForm)
                    {
                        utilServ.getDialogPreloadingWithDict(["msgPreloading", "loading"]);

                        self.addedit.template.content = pageRouteServ.pageObject.TQF3.addedit.template;
                    }
                },
                remove: function () {
                    facultyServ.isFaculty = false;
                    courseServ.isCourse = false;
                    courseServ.dataRow = {};
                    this.action = "";
                    self.addedit.isEdit = false;
                    self.addedit.isUpdate = false;                    

                    pageRouteServ.setMenuActiveAction({
                        menuName: (pageRouteServ.pageObject.TQF3.class + "-menu"),
                        isSubSubMenu: true
                    });
                    pageRouteServ.setMenuActive({
                        menuName: (pageRouteServ.pageObject.TQF3.class + "-menu")
                    });
                    dictServ.dict.menuTmp = {};

                    utilServ.removeCacheTemplate(this.content);
                    this.content = "";
                }
            },            
            init: function () {
                if (appServ.isUser && facultyServ.isFaculty && courseServ.isCourse)
                {
                    var action = self.addedit.template.action;

                    if (action === "edit" || action === "update")
                    {
                        pageRouteServ.setMenuActiveAction({
                            menuName: (pageRouteServ.pageObject.TQF3.class + "-menu"),
                            isSubSubMenu: true,
                            action: (courseServ.dataRow.status === "Y" ? "verified" : (courseServ.dataRow.status === "P" ? "pendingverify" : action)),
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
                this.disabled = (courseServ.dataRow.status === "Y" || courseServ.dataRow.status === "P" ? true : false);
                
                TQFServ.TQF3.accordionGroup.isOpen = true;

                angular.forEach(utilServ.getArrayNumber(self.maxSection), function (item) {
                    self.accordionGroup["section" + item] = {
                        isOpen: false
                    };
                });
                
                if (!courseServ.isEdit && !courseServ.isUpdate && courseServ.isCourse)
                {
                    courseServ.getDataSourceOnGroup(-1).then(function () {
                        facultyServ.facultyInfo.id = courseServ.dataRow.facultyId;
                        
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
    })

    .controller("TQFInfo.TQF3.group1Ctrl", function ($timeout, $q, $filter, utilServ, appServ, pageRouteServ, facultyServ, courseServ, TQFServ, inputTypeServ) {
        var self = this;

        self.owner = "tqf3g1";
        self.maxSection = 10,
        self.accordionGroup = {};

        self.addedit = {
            showForm: false,
            template: {
                content: "",
                action: "",
                init: function () {
                    if (appServ.isUser && facultyServ.isFaculty && courseServ.isCourse && self.addedit.showForm)
                    {                        
                        utilServ.getDialogPreloadingWithDict(["msgPreloading", "loading"]);

                        this.content = pageRouteServ.pageObject.TQF3.group1.addedit.template;
                    }
                },
                remove: function () {
                    utilServ.removeCacheTemplate(this.content);
                    this.content = "";
                }
            },
            init: function () {
                if (appServ.isUser && facultyServ.isFaculty && courseServ.isCourse)
                {
                    var action = self.addedit.template.action;

                    this.setValue().then(function () {
                        self.addedit[action].setValue();                        
                        courseServ.isCourse = TQFServ.isCourseOnGroup(self, courseServ.dataRow);

                        if (courseServ.isCourse)
                        {
                            self.addedit.getDataMaster().then(function () {
                                /*
                                angular.forEach(utilServ.getArrayNumber(self.maxSection), function (item) {
                                    self.addedit["section" + item].setValue();
                                });
                                */
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
                /*
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
                */
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
                /*
                angular.forEach(utilServ.getArrayNumber(self.maxSection), function (item) {
                    self.accordionGroup["section" + item] = {
                        isOpen: false
                    };
                });

                programServ.getDataSourceOnGroup(1).then(function () {
                    $timeout(function () {
                        deferred.resolve();
                    }, 0);
                });
                */

                $timeout(function () {
                    deferred.resolve();
                }, 0);

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
                    appServ.table.dataSource["literacy"] = angular.copy($filter("filter")(result, { groupType: "literacyGrouping" }));

                    $timeout(function () {
                        deferred.resolve();
                    }, 0);
                });

                return deferred.promise;
            },
            resetValue: function () {
                if (this.isAdd || this.isEdit || this.isUpdate)
                {
                    /*
                    angular.forEach(utilServ.getArrayNumber(self.maxSection), function (item) {
                        self.addedit["section" + item].resetValue();
                        self.accordionGroup["section" + item].isOpen = false;
                    });
                    */
                }
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
            }
        };
    })

    .controller("TQFInfo.TQF3.group2Ctrl", function ($timeout, $q, utilServ, appServ, pageRouteServ, facultyServ, courseServ, TQFServ) {
        var self = this;

        self.owner = "tqf3g2";

        self.addedit = {
            showForm: false,
            template: {
                content: "",
                action: "",
                init: function () {
                    if (appServ.isUser && facultyServ.isFaculty && courseServ.isCourse && self.addedit.showForm)
                    {                        
                        utilServ.getDialogPreloadingWithDict(["msgPreloading", "loading"]);

                        this.content = pageRouteServ.pageObject.TQF3.group2.addedit.template;
                    }
                },
                remove: function () {
                    utilServ.removeCacheTemplate(this.content);
                    this.content = "";
                }
            },
            init: function () {
                if (appServ.isUser && facultyServ.isFaculty && courseServ.isCourse)
                {
                    var action = self.addedit.template.action;

                    this.setValue().then(function () {
                        self.addedit[action].setValue();                        
                        courseServ.isCourse = TQFServ.isCourseOnGroup(self, courseServ.dataRow);

                        if (courseServ.isCourse)
                        {
                            //self.addedit.getDataMaster().then(function () {
                                self.addedit.watchFormChange();
                                self.addedit.resetValue();
                                self.addedit.showForm = true;

                                appServ.closeDialogPreloading();
                            //});
                        }
                    });
                }
                else
                    self.addedit.showForm = false;
            },
            watchFormChange: function () {
                /*
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
                */
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
                /*
                programmeServ.getDataSourceOnGroup(5).then(function () {
                    $timeout(function () {
                        deferred.resolve();
                    }, 0);
                });
                */

                $timeout(function () {
                    deferred.resolve();
                }, 0);

                return deferred.promise;
            },
            resetValue: function () {
                if (this.isAdd || this.isEdit || this.isUpdate)
                {
                    /*
                    angular.forEach(appServ.table.dataSource.criterialEvaluate, function (item) {
                        self.addedit.formValue.criterialEvaluate[item.id] = "";
                        self.addedit.formField.criterialEvaluate[item.id] = self.addedit.formValue.criterialEvaluate[item.id];
                    });
                    */
                    $timeout(function () {
                        autosize.update($("textarea"));
                    }, 0);

                    this.formValidate.resetValue();
                    utilServ.gotoTopPage();
                }
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
            }
        };
    })

    .controller("TQFInfo.TQF3.group3Ctrl", function ($timeout, $q, utilServ, appServ, pageRouteServ, facultyServ, courseServ, TQFServ) {
        var self = this;

        self.owner = "tqf3g3";

        self.addedit = {
            showForm: false,
            template: {
                content: "",
                action: "",
                init: function () {
                    if (appServ.isUser && facultyServ.isFaculty && courseServ.isCourse && self.addedit.showForm)
                    {                        
                        utilServ.getDialogPreloadingWithDict(["msgPreloading", "loading"]);

                        this.content = pageRouteServ.pageObject.TQF3.group3.addedit.template;
                    }
                },
                remove: function () {
                    utilServ.removeCacheTemplate(this.content);
                    this.content = "";
                }
            },
            init: function () {
                if (appServ.isUser && facultyServ.isFaculty && courseServ.isCourse)
                {
                    var action = self.addedit.template.action;

                    this.setValue().then(function () {
                        self.addedit[action].setValue();                        
                        courseServ.isCourse = TQFServ.isCourseOnGroup(self, courseServ.dataRow);

                        if (courseServ.isCourse)
                        {
                            //self.addedit.getDataMaster().then(function () {
                                self.addedit.watchFormChange();
                                self.addedit.resetValue();
                                self.addedit.showForm = true;

                                appServ.closeDialogPreloading();
                            //});
                        }
                    });
                }
                else
                    self.addedit.showForm = false;
            },
            watchFormChange: function () {
                /*
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
                */
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
                /*
                programmeServ.getDataSourceOnGroup(5).then(function () {
                    $timeout(function () {
                        deferred.resolve();
                    }, 0);
                });
                */

                $timeout(function () {
                    deferred.resolve();
                }, 0);

                return deferred.promise;
            },
            resetValue: function () {
                if (this.isAdd || this.isEdit || this.isUpdate)
                {
                    this.formValidate.resetValue();
                    utilServ.gotoTopPage();
                }
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
            }
        };
        })

    .controller("TQFInfo.TQF3.group4Ctrl", function ($timeout, $q, utilServ, appServ, pageRouteServ, facultyServ, courseServ, TQFServ) {
        var self = this;

        self.owner = "tqf3g4";

        self.addedit = {
            showForm: false,
            template: {
                content: "",
                action: "",
                init: function () {
                    if (appServ.isUser && facultyServ.isFaculty && courseServ.isCourse && self.addedit.showForm)
                    {                        
                        utilServ.getDialogPreloadingWithDict(["msgPreloading", "loading"]);

                        this.content = pageRouteServ.pageObject.TQF3.group4.addedit.template;
                    }
                },
                remove: function () {
                    utilServ.removeCacheTemplate(this.content);
                    this.content = "";
                }
            },
            init: function () {
                if (appServ.isUser && facultyServ.isFaculty && courseServ.isCourse)
                {
                    var action = self.addedit.template.action;

                    this.setValue().then(function () {
                        self.addedit[action].setValue();                        
                        courseServ.isCourse = TQFServ.isCourseOnGroup(self, courseServ.dataRow);

                        if (courseServ.isCourse)
                        {
                            //self.addedit.getDataMaster().then(function () {
                                self.addedit.watchFormChange();
                                self.addedit.resetValue();
                                self.addedit.showForm = true;

                                appServ.closeDialogPreloading();
                            //});
                        }
                    });
                }
                else
                    self.addedit.showForm = false;
            },
            watchFormChange: function () {
                /*
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
                */
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
                /*
                programmeServ.getDataSourceOnGroup(5).then(function () {
                    $timeout(function () {
                        deferred.resolve();
                    }, 0);
                });
                */

                $timeout(function () {
                    deferred.resolve();
                }, 0);

                return deferred.promise;
            },
            resetValue: function () {
                if (this.isAdd || this.isEdit || this.isUpdate)
                {
                    this.formValidate.resetValue();
                    utilServ.gotoTopPage();
                }
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
            }
        };
        })

    .controller("TQFInfo.TQF3.group5Ctrl", function ($timeout, $q, utilServ, appServ, pageRouteServ, facultyServ, courseServ, TQFServ) {
        var self = this;

        self.owner = "tqf3g5";

        self.addedit = {
            showForm: false,
            template: {
                content: "",
                action: "",
                init: function () {
                    if (appServ.isUser && facultyServ.isFaculty && courseServ.isCourse && self.addedit.showForm)
                    {                        
                        utilServ.getDialogPreloadingWithDict(["msgPreloading", "loading"]);

                        this.content = pageRouteServ.pageObject.TQF3.group5.addedit.template;
                    }
                },
                remove: function () {
                    utilServ.removeCacheTemplate(this.content);
                    this.content = "";
                }
            },
            init: function () {
                if (appServ.isUser && facultyServ.isFaculty && courseServ.isCourse)
                {
                    var action = self.addedit.template.action;

                    this.setValue().then(function () {
                        self.addedit[action].setValue();                        
                        courseServ.isCourse = TQFServ.isCourseOnGroup(self, courseServ.dataRow);

                        if (courseServ.isCourse)
                        {
                            //self.addedit.getDataMaster().then(function () {
                                self.addedit.watchFormChange();
                                self.addedit.resetValue();
                                self.addedit.showForm = true;

                                appServ.closeDialogPreloading();
                            //});
                        }
                    });
                }
                else
                    self.addedit.showForm = false;
            },
            watchFormChange: function () {
                /*
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
                */
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
                /*
                programmeServ.getDataSourceOnGroup(5).then(function () {
                    $timeout(function () {
                        deferred.resolve();
                    }, 0);
                });
                */

                $timeout(function () {
                    deferred.resolve();
                }, 0);

                return deferred.promise;
            },
            resetValue: function () {
                if (this.isAdd || this.isEdit || this.isUpdate)
                {
                    this.formValidate.resetValue();
                    utilServ.gotoTopPage();
                }
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
            }
        };
        })

    .controller("TQFInfo.TQF3.group6Ctrl", function ($timeout, $q, utilServ, appServ, pageRouteServ, facultyServ, courseServ, TQFServ) {
        var self = this;

        self.owner = "tqf3g6";

        self.addedit = {
            showForm: false,
            template: {
                content: "",
                action: "",
                init: function () {
                    if (appServ.isUser && facultyServ.isFaculty && courseServ.isCourse && self.addedit.showForm)
                    {                        
                        utilServ.getDialogPreloadingWithDict(["msgPreloading", "loading"]);

                        this.content = pageRouteServ.pageObject.TQF3.group6.addedit.template;
                    }
                },
                remove: function () {
                    utilServ.removeCacheTemplate(this.content);
                    this.content = "";
                }
            },
            init: function () {
                if (appServ.isUser && facultyServ.isFaculty && courseServ.isCourse)
                {
                    var action = self.addedit.template.action;

                    this.setValue().then(function () {
                        self.addedit[action].setValue();                        
                        courseServ.isCourse = TQFServ.isCourseOnGroup(self, courseServ.dataRow);

                        if (courseServ.isCourse)
                        {
                            //self.addedit.getDataMaster().then(function () {
                                self.addedit.watchFormChange();
                                self.addedit.resetValue();
                                self.addedit.showForm = true;

                                appServ.closeDialogPreloading();
                            //});
                        }
                    });
                }
                else
                    self.addedit.showForm = false;
            },
            watchFormChange: function () {
                /*
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
                */
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
                /*
                programmeServ.getDataSourceOnGroup(5).then(function () {
                    $timeout(function () {
                        deferred.resolve();
                    }, 0);
                });
                */

                $timeout(function () {
                    deferred.resolve();
                }, 0);

                return deferred.promise;
            },
            resetValue: function () {
                if (this.isAdd || this.isEdit || this.isUpdate)
                {
                    this.formValidate.resetValue();
                    utilServ.gotoTopPage();
                }
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
            }
        };
        })

    .controller("TQFInfo.TQF3.group7Ctrl", function ($timeout, $q, utilServ, appServ, pageRouteServ, facultyServ, courseServ, TQFServ) {
        var self = this;

        self.owner = "tqf3g7";

        self.addedit = {
            showForm: false,
            template: {
                content: "",
                action: "",
                init: function () {
                    if (appServ.isUser && facultyServ.isFaculty && courseServ.isCourse && self.addedit.showForm)
                    {                        
                        utilServ.getDialogPreloadingWithDict(["msgPreloading", "loading"]);

                        this.content = pageRouteServ.pageObject.TQF3.group7.addedit.template;
                    }
                },
                remove: function () {
                    utilServ.removeCacheTemplate(this.content);
                    this.content = "";
                }
            },
            init: function () {
                if (appServ.isUser && facultyServ.isFaculty && courseServ.isCourse)
                {
                    var action = self.addedit.template.action;

                    this.setValue().then(function () {
                        self.addedit[action].setValue();                        
                        courseServ.isCourse = TQFServ.isCourseOnGroup(self, courseServ.dataRow);

                        if (courseServ.isCourse)
                        {
                            //self.addedit.getDataMaster().then(function () {
                                self.addedit.watchFormChange();
                                self.addedit.resetValue();
                                self.addedit.showForm = true;

                                appServ.closeDialogPreloading();
                            //});
                        }
                    });
                }
                else
                    self.addedit.showForm = false;
            },
            watchFormChange: function () {
                /*
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
                */
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
                /*
                programmeServ.getDataSourceOnGroup(5).then(function () {
                    $timeout(function () {
                        deferred.resolve();
                    }, 0);
                });
                */

                $timeout(function () {
                    deferred.resolve();
                }, 0);

                return deferred.promise;
            },
            resetValue: function () {
                if (this.isAdd || this.isEdit || this.isUpdate)
                {
                    this.formValidate.resetValue();
                    utilServ.gotoTopPage();
                }
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
            }
        };
    });
})();