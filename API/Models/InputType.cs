/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๘/๑๐/๒๕๖๑>
Modify date : <๑๘/๑๐/๒๕๖๑>
Description : <โมเดลข้อมูล Input Type>
=============================================
*/

using System.Data;
using System.Data.SqlClient;

namespace API.Models
{
  public class InputType
  {
    public static DataSet GetListData(string contentType, string curYear, string xmlData, string dLevel)
    {
      DataSet ds = iUtil.ExecuteCommandStoredProcedure(iUtil.infinityConnectionString, "sp_acaGetListInputType",
        new SqlParameter("@contentType",  contentType),
        new SqlParameter("@curYear",      curYear),
        new SqlParameter("@xmlData",      xmlData),
        new SqlParameter("@dLevel",       dLevel));

      return ds;
    }
  }
}