/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๐๓/๐๔/๒๕๖๑>
Modify date : <๓๐/๐๗/๒๕๖๒>
Description : <โมเดลข้อมูลคณะ>
=============================================
*/

using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Web;

namespace API.Models
{
    public class Faculty
    {
        public string id { get; set; }
        public string uId { get; set; }
        public string facultyCode { get; set; }
        public string nameTh { get; set; }
        public string nameEn { get; set; }
        public string abbrevTh { get; set; }
        public string abbrevEn { get; set; }
        public string conciseTh { get; set; }
        public string conciseEn { get; set; }
        public string branchId { get; set; }

        public static DataSet GetListData()
        {
            DataSet ds = iUtil.ExecuteCommandStoredProcedure(iUtil.infinityConnectionString, "sp_acaGetListFaculty",
                new SqlParameter("@uId", "U0001"));

            return ds;
        }

        public static DataSet GetData(string facultyId)
        {
            DataSet ds = iUtil.ExecuteCommandStoredProcedure(iUtil.infinityConnectionString, "sp_acaGetFaculty",
                new SqlParameter("@facultyId", facultyId));

            return ds;
        }

        public static DataSet SetData(string method, List<Faculty> data, dynamic account)
        {
            UtilService.iUtil iUtilService = new UtilService.iUtil();
            StringBuilder xmlData = new StringBuilder();
            StringBuilder xmlUser = new StringBuilder();
            string mode = String.Empty;

            if (method.Equals("POST"))      mode = "add";
            if (method.Equals("PUT"))       mode = "edit";
            if (method.Equals("DELETE"))    mode = "del";

            foreach (var d in data)
            {
                xmlData.Append(
                "<row>" +
                (d.id != null ? ("<id>" + d.id + "</id>") : String.Empty) +
                "<uId>U0001</uId>" +
                (d.facultyCode != null ? ("<facultyCode>" + d.facultyCode + "</facultyCode>") : String.Empty) +
                (d.nameTh != null ? ("<nameTh>" + d.nameTh + "</nameTh>") : String.Empty) +
                (d.nameEn != null ? ("<nameEn>" + d.nameEn + "</nameEn>") : String.Empty) +
                (d.abbrevTh != null ? ("<abbrevTh>" + d.abbrevTh + "</abbrevTh>") : String.Empty) +
                (d.abbrevEn != null ? ("<abbrevEn>" + d.abbrevEn + "</abbrevEn>") : String.Empty) +
                (d.conciseTh != null ? ("<conciseTh>" + d.conciseTh + "</conciseTh>") : String.Empty) +
                (d.conciseEn != null ? ("<conciseEn>" + d.conciseEn + "</conciseEn>") : String.Empty) +
                (d.branchId != null ? ("<branchId>" + d.branchId + "</branchId>") : String.Empty) +
                "</row>");
            }

            xmlUser.AppendFormat(
            "<row>" +
            "<username>{0}</username>" +
            "<ip>{1}</ip>" +
            "</row>",
            account.Username,
            iUtilService.GetIP());
            
            DataSet ds = iUtil.ExecuteCommandStoredProcedure(iUtil.infinityConnectionString, "sp_acaSetFaculty",
                new SqlParameter("@xmlData",    xmlData.ToString()),
                new SqlParameter("@xmlUser",    xmlUser.ToString()),
                new SqlParameter("@mode",       mode));
            
            return ds;
        }
    }
}