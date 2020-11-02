/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๒๒/๑๐/๒๕๖๑>
Modify date : <๒๒/๑๐/๒๕๖๑>
Description : <โมเดลข้อมูลอาชีพ>
=============================================
*/

using System.Data;
using System.Data.SqlClient;

namespace API.Models
{
  public class Career
  {
    public static DataSet GetListData()
    {
      DataSet ds = iUtil.ExecuteCommandStoredProcedure(iUtil.infinityConnectionString, "sp_acaGetListCareer", null);

      return ds;
    }

    public static DataSet GetData(string careerId)
    {
      DataSet ds = iUtil.ExecuteCommandStoredProcedure(iUtil.infinityConnectionString, "sp_acaGetCareer",
        new SqlParameter("@id", careerId));

      return ds;
    }
  }
}