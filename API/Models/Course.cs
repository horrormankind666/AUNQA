/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๐๙/๑๐/๒๕๖๒>
Modify date : <๐๙/๑๐/๒๕๖๒>
Description : <โมเดลข้อมูลรายวิชา TQF3>
=============================================
*/

using System;
using System.Data;
using System.Data.SqlClient;

namespace API.Models
{
  public class Course
  {
    public static DataSet GetListData(string tableType, string facultyId)
    {
      string sp = String.Empty;

      switch (tableType)
      {
        case "master" : { sp = "sp_acaTQFGetListCourse"; break; }
        case "temp"   : { sp = "sp_acaTQFGetListCourseTemp"; break; }
      }

      DataSet ds = iUtil.ExecuteCommandStoredProcedure(iUtil.infinityConnectionString, sp,
        new SqlParameter("@facultyId", facultyId));

      return ds;
    }

    public static DataSet GetData(string tableType, string id, string courseId, string username)
    {
      DataSet ds = new DataSet();

      if (tableType.Equals("master"))
      { 
        ds = iUtil.ExecuteCommandStoredProcedure(iUtil.infinityConnectionString, "sp_acaTQFGetCourse",
          new SqlParameter("@courseId", courseId));
      }
      if (tableType.Equals("temp"))
      {
        ds = iUtil.ExecuteCommandStoredProcedure(iUtil.infinityConnectionString, "sp_acaTQFGetCourseTemp",
          new SqlParameter("@id",       id),
          new SqlParameter("@username", username));	
      }

      return ds;
    }
  }
}