/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๒/๑๐/๒๕๖๑>
Modify date : <๐๓/๑๐/๒๕๖๒>
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
        "TQFMod"
    ])

    .controller("TQFInfo.TQF3Ctrl", function (appServ, pageRouteServ) {
        var self = this;

        pageRouteServ.setMenuActive({
            menuName: (pageRouteServ.pageObject.TQF3.class + "-menu")
        });            

        self.maxSection = 7,
        self.accordionGroup = {};

        self.init = function () {
            if (appServ.isUser)
            {
                appServ.closeDialogPreloading();
            }
        };

        self.addedit = {
            showForm: false,
            disabled: false
        };
    })

    .controller("TQFInfo.TQF3.group1Ctrl", function ($scope, $timeout, $q, $location, $filter, utilServ, appServ, dictServ, pageRouteServ, facultyServ, courseServ, TQFServ) {
        var self = this;

        self.owner = "tqf3g1";
        self.maxSection = 9,
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
                        /*
                        programServ.isProgram = TQFServ.isProgramOnGroup(self, programServ.dataRow);

                        if (programServ.isProgram)
                        {
                            self.addedit.getDataMaster().then(function () {
                                angular.forEach(utilServ.getArrayNumber(self.maxSection), function (item) {
                                    self.addedit["section" + item].setValue();
                                });
                        */
                                self.addedit.watchFormChange();
                                self.addedit.resetValue();
                                self.addedit.showForm = true;

                                appServ.closeDialogPreloading();
                        /*
                            });
                        }
                        */
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
            }
        };
    });
})();