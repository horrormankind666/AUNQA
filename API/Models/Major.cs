/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๐๕/๐๔/๒๕๖๑>
Modify date : <๓๐/๐๗/๒๕๖๒>
Description : <โมเดลข้อมูลสาขาวิชา>
=============================================
*/

using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace API.Models
{
  public class Major
  {
    public string id { get; set; }
    public string uId { get; set; }
    public string codeEn { get; set; }
    public string nameTh { get; set; }
    public string nameEn { get; set; }
    public string abbrevTh { get; set; }
    public string abbrevEn { get; set; }
    public string facultyId { get; set; }
    public string verifyStatus { get; set; }
    public string verifyRemark { get; set; }

    public static DataSet GetListData(string facultyId)
    {
      DataSet ds = iUtil.ExecuteCommandStoredProcedure(iUtil.infinityConnectionString, "sp_acaGetListMajor",
        new SqlParameter("@xmlData", new StringBuilder().AppendFormat("<table><row><facultyId>{0}</facultyId></row></table>", facultyId).ToString()));

      return ds;
    }

    public static DataSet GetData(string majorId)
    {
      DataSet ds = iUtil.ExecuteCommandStoredProcedure(iUtil.infinityConnectionString, "sp_acaGetMajor",
        new SqlParameter("@id", majorId));

      return ds;
    }

    public static DataSet SetData(string method, List<Major> data, dynamic account)
    {
      UtilService.iUtil iUtilService = new UtilService.iUtil();
      StringBuilder xmlData = new StringBuilder();
      StringBuilder xmlUser = new StringBuilder();
      string mode = String.Empty;            

      if (method.Equals("POST"))    mode = "add";
      if (method.Equals("PUT"))     mode = "edit";
      if (method.Equals("DELETE"))  mode = "del";
      if (method.Equals("VERIFY"))  mode = "verify";

      foreach (var d in data)
      {
        xmlData.Append(
        "<row>" +
        (d.id != null ? ("<id>" + d.id + "</id>") : String.Empty) +
        "<uId>U0001</uId>" +
        (d.facultyId != null ? ("<facultyId>" + d.facultyId + "</facultyId>") : String.Empty) +
        (d.codeEn != null ? ("<codeEn>" + d.codeEn + "</codeEn>") : String.Empty) +
        (d.nameTh != null ? ("<nameTh>" + d.nameTh + "</nameTh>") : String.Empty) +
        (d.nameEn != null ? ("<nameEn>" + d.nameEn + "</nameEn>") : String.Empty) +
        (d.abbrevTh != null ? ("<abbrevTh>" + d.abbrevTh + "</abbrevTh>") : String.Empty) +
        (d.abbrevEn != null ? ("<abbrevEn>" + d.abbrevEn + "</abbrevEn>") : String.Empty) +
        (d.verifyStatus != null ? ("<verifyStatus>" + d.verifyStatus + "</verifyStatus>") : String.Empty) +
        (d.verifyRemark != null ? ("<verifyRemark>" + d.verifyRemark + "</verifyRemark>") : String.Empty) +
        "</row>");
      }

      xmlUser.AppendFormat(
      "<row>" +
      "<username>{0}</username>" +
      "<ip>{1}</ip>" +
      "</row>",
      account.Username,
      iUtilService.GetIP());

      DataSet ds = iUtil.ExecuteCommandStoredProcedure(iUtil.infinityConnectionString, "sp_acaSetMajor",
        new SqlParameter("@xmlData",  xmlData.ToString()),
        new SqlParameter("@xmlUser",  xmlUser.ToString()),
        new SqlParameter("@mode",     mode));

      return ds;
    }
  }
}