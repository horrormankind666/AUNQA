/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๒๔/๐๔/๒๕๖๑>
Modify date : <๑๗/๐๘/๒๕๖๑>
Description : <โมเดลข้อมูลสาขา>
=============================================
*/

using System.Data;
using System.Data.SqlClient;

namespace API.Models
{
  public class Branch
  {
    public static DataSet GetListData()
    {
      DataSet ds = iUtil.ExecuteCommandStoredProcedure(iUtil.infinityConnectionString, "sp_acaGetListBranch",
        new SqlParameter("@rankingTypeId", "MUA-01"));

      return ds;
    }

    public static DataSet GetData(string branchId)
    {
      DataSet ds = iUtil.ExecuteCommandStoredProcedure(iUtil.infinityConnectionString, "sp_acaGetBranch",
        new SqlParameter("@id", branchId));

      return ds;
    }
  }
}