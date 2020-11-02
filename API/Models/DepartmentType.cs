/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๓๐/๐๔/๒๕๖๑>
Modify date : <๑๗/๐๘/๒๕๖๑>
Description : <โมเดลข้อมูลประเภทของภาควิชา>
=============================================
*/

using System.Data;

namespace API.Models
{
  public class DepartmentType
  {
    public static DataSet GetListData()
    {
      DataSet ds = iUtil.ExecuteCommandStoredProcedure(iUtil.infinityConnectionString, "sp_acaGetListDepartmentType", null); 

      return ds;
    }
  }
}