/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๓/๐๓/๒๕๖๒>
Modify date : <๑๓/๐๓/๒๕๖๒>
Description : <โมเดลข้อมูล Appendix>
=============================================
*/

using System.Data;
using System.Data.SqlClient;

namespace API.Models
{
  public class Appendix
  {
    public static DataSet GetListData(string groupType, string xmlData)
    {
      DataSet ds = iUtil.ExecuteCommandStoredProcedure(iUtil.infinityConnectionString, "sp_acaTQFGetListAppendix",
        new SqlParameter("@groupType",  groupType),
        new SqlParameter("@xmlData",    xmlData));

      return ds;
    }

    public static DataSet GetData(string appendixId, string xmlData)
    {
      DataSet ds = iUtil.ExecuteCommandStoredProcedure(iUtil.infinityConnectionString, "sp_acaTQFGetAppendix",
        new SqlParameter("@id",       appendixId),
        new SqlParameter("@xmlData",  xmlData));

      return ds;
    }
  }
}