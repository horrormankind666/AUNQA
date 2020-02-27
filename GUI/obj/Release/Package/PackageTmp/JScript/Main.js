/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๒๙/๐๓/๒๕๖๑>
Modify date : <๑๕/๑๑/๒๕๖๑>
Description : <รวมรวบฟังก์ชั่นใช้งานสำหรับหน้าแรก>
=============================================
*/

(function () {
    "use strict";

    angular.module("mainMod", [       
        "utilMod",
        "appMod",
        "pageRouteMod"
    ])

    .controller("mainCtrl", function ($scope, $timeout, $q, utilServ, appServ, pageRouteServ) {
        var self = this;

        pageRouteServ.setMenuActive({});

        self.mobileSelect = "";

        self.init = function () {
            if (appServ.isUser)
            {
                self.setValue().then(function () {                    
                    self.resetValue();
                    self.showForm = true;                    

                    appServ.closeDialogPreloading();
                });
            }
            else
                self.showForm = false;
        };

        self.setValue = function () {
            var deferred = $q.defer();

            self.showForm = false;

            $timeout(function () {                
                deferred.resolve();
            }, 0);

            return deferred.promise;
        };

        self.resetValue = function () {            
            utilServ.gotoTopPage();            
        };
    });
})();