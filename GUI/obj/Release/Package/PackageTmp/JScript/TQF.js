/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๒๔/๑๒/๒๕๖๑>
Modify date : <๐๑/๑๐/๒๕๖๒>
Description : <รวมรวบฟังก์ชั่นใช้งานสำหรับข้อมูลมคอ.>
=============================================
*/

(function () {
    "use strict";

    angular.module("TQFMod", [
        "utilMod",
        "appMod",
        "dictMod",
        "pageRouteMod"
    ])

    .service("TQFServ", function ($filter, utilServ, appServ, dictServ, pageRouteServ) {
        var self = this;

        self.TQF2 = {
            accordionGroup: {
                isOpen: true
            }
        };

        self.TQF3 = {
            accordionGroup: {
                isOpen: true
            }
        };

        self.inputTypeRemark = {
            setSelected: function(data, groupType, formField, isCheckedField) {
                var isSelect = formField[groupType + "Selected"];
                var lastField = formField[groupType + "SelectedLast"];
                var remarkField = formField[groupType + "Remark"];

                if (data.input === "checkbox")
                {
                    isCheckedField[data.id] = (isSelect[data.id] ? true : false);
                    remarkField[data.id] = "";

                    if (isCheckedField[data.id] === true)   formField[groupType].push(data);
                    if (isCheckedField[data.id] === false)  utilServ.removeItemFromArray(formField[groupType], data);
                }

                if (data.input === "radio" && data.id !== lastField.id)
                {
                    isCheckedField[data.id] = (isSelect ? true : false);
                    isCheckedField[lastField.id] = false;
                    remarkField[data.id] = "";
                    remarkField[lastField.id] = "";

                    formField[groupType] = [];
                    formField[groupType].push(data);

                    formField[groupType + "SelectedLast"] = data;
                }
            },
            uncheck: function (data, groupType, formField, isCheckedField) {
                var exit = false;
                var isSelect = formField[groupType + "Selected"];
                var remarkField = formField[groupType + "Remark"];

                angular.forEach(data, function (item) {
                    if (item.input === "checkbox")  isSelect[item.id] = false;
                    if (item.input === "radio" && !exit)
                    {
                        formField[groupType + "Selected"] = null;
                        formField[groupType + "SelectedLast"] = {};

                        exit = true;
                    }
                    
                    remarkField[item.id] = "";
                    isCheckedField[item.id] = false;                    
                });
            },
            check: function (dataSource, data, groupType, formField, formValue, isCheckedField) {
                var isSelect = formField[groupType + "Selected"];
                var remarkField = formField[groupType + "Remark"];

                if (dataSource)
                {
                    angular.forEach(dataSource, function (item1) {
                        angular.forEach($filter("filter")(data, { id: item1.id }), function (item2) {
                            formValue[groupType].push(item2);
                            if (item2.input === "checkbox") isSelect[item2.id] = true;
                            if (item2.input === "radio")    formField[groupType + "Selected"] = item2.id;
                            self.inputTypeRemark.setSelected(item2, groupType, formField, isCheckedField);
                            remarkField[item2.id] = item1.remark;
                        });
                    });
                    formValue[groupType + "Data"] = appServ.getDataOnJoinArray(formValue[groupType], ["id"]);
                }
            },

            getValue: function (groupType, dataSource, formField) {
                var result = "";
                var remarkField = formField[groupType + "Remark"];
                var remark = "";
                var add = false;

                if (dataSource.length > 0)
                {
                    angular.forEach(dataSource, function (item) {
                        remark = "";
                        add = false;

                        if (item.input === "checkbox" || item.input === "radio")
                        {
                            remark = (item.isRemark === "Y" ? remarkField[item.id] : "");
                            add = true;
                        }

                        if (item.input === "text" || item.input === "textarea")
                        {
                            remark = formField[groupType][item.id];
                            add = (remark ? true : false);
                        }

                        if (add)
                        {
                            result += (
                                "<row>" +
                                "<id>" + item.id + "</id>" +
                                "<nameTH>" + item.title.TH + "</nameTH>" +
                                "<nameEN>" + item.title.EN + "</nameEN>" +
                                "<remark>" + remark + "</remark>" +                            
                                "</row>"
                            );
                        }
                    });                        
                }

                return result;
            },
            getDataTableFromJSON: function (json, firstNode) {
                var dt = [];
                var data = [];

                if (json)
                {                    
                    if (firstNode)  angular.copy(json[firstNode].row, data);
                    if (!firstNode) angular.copy(json.row, data);

                    if (data.length > 0)
                        angular.copy(data, dt);
                    else
                        dt.push({
                            id: data.id,
                            nameTH: data.nameTH,
                            nameEN: data.nameEN,
                            remark: data.remark
                        });
                }

                return dt;
            }
        };

        self.isProgramOnGroup = function (groupCtrl, data) {
            var isProgram = true;

            if (groupCtrl.addedit.isEdit || groupCtrl.addedit.isUpdate || groupCtrl.addedit.isDelete)
            {
                if (Object.keys(data).length === 0)
                    isProgram = false;
            }

            if (!isProgram)
            {
                groupCtrl.addedit.showForm = false;

                pageRouteServ.setMenuActiveAction({
                    menuName: (pageRouteServ.pageObject.TQF2.class + "-menu"),
                    isSubSubMenu: true
                });
                pageRouteServ.setMenuActive({
                    menuName: (pageRouteServ.pageObject.TQF2.class + "-menu")
                });
                dictServ.dict.menuTmp = {};

                appServ.closeDialogPreloading();

                utilServ.dialogErrorWithDict(["program", "programNotFound"], function (e) {
                });
            }

            return isProgram;
        };
    });
}) ();