/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๒๒/๑๐/๒๕๖๑>
Modify date : <๓๐/๐๔/๒๕๖๑>
Description : <โมเดลข้อมูลการอนุมัติหลักสูตร>
=============================================
*/

using System.Data;
using System.Data.SqlClient;

namespace API.Models
{
  public class ApprovedStatus
  {
    public static DataSet GetListData(string groupStatus, string curYear)
    {
      DataSet ds = iUtil.ExecuteCommandStoredProcedure(iUtil.infinityConnectionString, "sp_acaGetListApprovedStatus",
        new SqlParameter("@groupStatus",  groupStatus),
        new SqlParameter("@curYear",      curYear));

      return ds;
    }

    public static DataSet GetData(string approvedStatusId)
    {
      DataSet ds = iUtil.ExecuteCommandStoredProcedure(iUtil.infinityConnectionString, "sp_acaGetApprovedStatus",
        new SqlParameter("@id", approvedStatusId));

      return ds;
    }
  }
}