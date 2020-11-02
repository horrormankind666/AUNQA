/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๐๕/๐๔/๒๕๖๑>
Modify date : <๐๘/๑๐/๒๕๖๒>
Description : <โมเดลข้อมูลรายวิชา>
=============================================
*/

using System.Data;
using System.Data.SqlClient;

namespace API.Models
{
  public class Subject
  {
    public static DataSet GetListData(string facultyId)
    {
      DataSet ds = iUtil.ExecuteCommandStoredProcedure(iUtil.infinityConnectionString, "sp_acaGetListSubject",
        new SqlParameter("@uId",        "U0001"),
        new SqlParameter("@facultyId",  facultyId));

      return ds;
    }

    public static DataSet GetData(string subjectId)
    {
      DataSet ds = iUtil.ExecuteCommandStoredProcedure(iUtil.infinityConnectionString, "sp_acaGetSubject",
        new SqlParameter("@subjectId", subjectId));

      return ds;
    }
  }
}