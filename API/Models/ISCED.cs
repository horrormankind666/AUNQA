/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๖/๑๐/๒๕๖๑>
Modify date : <๑๖/๑๐/๒๕๖๑>
Description : <โมเดลข้อมูล ISCED>
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
    public class ISCED
    {
        public static DataSet GetListData()
        {
            DataSet ds = iUtil.ExecuteCommandStoredProcedure(iUtil.infinityConnectionString, "sp_acaGetListISCED", null);

            return ds;
        }

        public static DataSet GetData(string iscedId)
        {
            DataSet ds = iUtil.ExecuteCommandStoredProcedure(iUtil.infinityConnectionString, "sp_acaGetISCED",
                new SqlParameter("@id", iscedId));

            return ds;
        }
    }
}