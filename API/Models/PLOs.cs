/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๐๘/๐๒/๒๕๖๒>
Modify date : <๐๘/๐๒/๒๕๖๒>
Description : <โมเดลข้อมูล PLOs>
=============================================
*/

using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace API.Models
{
    public class PLOs
    {
        public static DataSet GetListData(string tqfProgramId)
        {
            DataSet ds = iUtil.ExecuteCommandStoredProcedure(iUtil.infinityConnectionString, "sp_acaTQFGetListPLOs",
                new SqlParameter("@tqfProgramId", tqfProgramId));

            return ds;
        }

        public static DataSet GetData(string plosId)
        {
            DataSet ds = iUtil.ExecuteCommandStoredProcedure(iUtil.infinityConnectionString, "sp_acaTQFGetPLOs",
                new SqlParameter("@id", plosId));

            return ds;
        }
    }
}