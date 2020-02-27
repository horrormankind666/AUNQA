/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๒๖/๐๓/๒๕๖๑>
Modify date : <๐๘/๑๐/๒๕๖๒>
Description : <รวมรวบฟังก์ชั่นใช้งานสำหรับหน้า index>
=============================================
*/

(function () {
    "use strict";

    var dt = new Date();
    var ver = (dt.getDate() + "/" + (dt.getMonth() + 1) + "/" + dt.getFullYear() + dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds());

    document.write("<link href='CSS/CSS.css?ver=" + ver + "' rel='stylesheet' />");
    document.write("<script type='text/javascript' src='JScript/AppUtil.js?ver=" + ver + "'><\/script>");
    document.write("<script type='text/javascript' src='JScript/Dictionary.js?ver=" + ver + "'><\/script>");
    document.write("<script type='text/javascript' src='JScript/PageRoute.js?ver=" + ver + "'><\/script>");
    document.write("<script type='text/javascript' src='JScript/Main.js?ver=" + ver + "'><\/script>");
    document.write("<script type='text/javascript' src='JScript/Branch.js?ver=" + ver + "'><\/script>");
    document.write("<script type='text/javascript' src='JScript/Faculty.js?ver=" + ver + "'><\/script>");
    document.write("<script type='text/javascript' src='JScript/DepartmentType.js?ver=" + ver + "'><\/script>");
    document.write("<script type='text/javascript' src='JScript/Department.js?ver=" + ver + "'><\/script>");    
    document.write("<script type='text/javascript' src='JScript/Major.js?ver=" + ver + "'><\/script>");
    document.write("<script type='text/javascript' src='JScript/Programme.js?ver=" + ver + "'><\/script>");
    document.write("<script type='text/javascript' src='JScript/Course.js?ver=" + ver + "'><\/script>");
    document.write("<script type='text/javascript' src='JScript/TQF.js?ver=" + ver + "'><\/script>");
    document.write("<script type='text/javascript' src='JScript/ISCED.js?ver=" + ver + "'><\/script>");
    document.write("<script type='text/javascript' src='JScript/Degree.js?ver=" + ver + "'><\/script>");
    document.write("<script type='text/javascript' src='JScript/MajorSubject.js?ver=" + ver + "'><\/script>");
    document.write("<script type='text/javascript' src='JScript/InputType.js?ver=" + ver + "'><\/script>");
    document.write("<script type='text/javascript' src='JScript/Country.js?ver=" + ver + "'><\/script>");
    document.write("<script type='text/javascript' src='JScript/ApprovedStatus.js?ver=" + ver + "'><\/script>");
    document.write("<script type='text/javascript' src='JScript/Career.js?ver=" + ver + "'><\/script>");
    document.write("<script type='text/javascript' src='JScript/Instructor.js?ver=" + ver + "'><\/script>");
    document.write("<script type='text/javascript' src='JScript/CoursePosition.js?ver=" + ver + "'><\/script>");
    document.write("<script type='text/javascript' src='/Infinity/AUNQA/HRi/JScript/HRi.js?ver=" + ver + "'><\/script>");
    document.write("<script type='text/javascript' src='JScript/PlaceStudy.js?ver=" + ver + "'><\/script>");
    document.write("<script type='text/javascript' src='JScript/PLOs.js?ver=" + ver + "'><\/script>");
    document.write("<script type='text/javascript' src='JScript/KPI.js?ver=" + ver + "'><\/script>");
    document.write("<script type='text/javascript' src='JScript/Appendix.js?ver=" + ver + "'><\/script>");
    document.write("<script type='text/javascript' src='JScript/Subject.js?ver=" + ver + "'><\/script>");    
    document.write("<script type='text/javascript' src='JScript/AcademicInfo.Faculty.js?ver=" + ver + "'><\/script>");    
    document.write("<script type='text/javascript' src='JScript/AcademicInfo.Department.js?ver=" + ver + "'><\/script>");
    document.write("<script type='text/javascript' src='JScript/AcademicInfo.Major.js?ver=" + ver + "'><\/script>");
    document.write("<script type='text/javascript' src='JScript/AcademicInfo.Course.js?ver=" + ver + "'><\/script>");
    document.write("<script type='text/javascript' src='JScript/AcademicInfo.Programme.js?ver=" + ver + "'><\/script>");
    document.write("<script type='text/javascript' src='JScript/TQFInfo.TQF2.js?ver=" + ver + "'><\/script>");
    document.write("<script type='text/javascript' src='JScript/TQFInfo.TQF3.js?ver=" + ver + "'><\/script>");

    if (!String.prototype.includes)
    {
        Object.defineProperty(String.prototype, "includes", {
            value: function (search, start) {
                if (typeof start !== "number")
                    start = 0;

                if (start + search.length > this.length)
                    return false;
                else
                    return this.indexOf(search, start) !== -1;
            }
        });
    }
})();