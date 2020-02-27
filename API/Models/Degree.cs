/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๒๒/๐๗/๒๕๖๒>
Modify date : <๒๒/๐๗/๒๕๖๒>
Description : <โมเดลข้อมูลระดับการศึกษา>
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
    public class Degree
    {
        public static DataSet GetListData()
        {
            DataSet ds = iUtil.ExecuteCommandStoredProcedure(iUtil.infinityConnectionString, "sp_acaGetListDegree", null);

            return ds;
        }

        public static DataSet GetData(string degreeId)
        {
            DataSet ds = iUtil.ExecuteCommandStoredProcedure(iUtil.infinityConnectionString, "sp_acaGetDegree",
                new SqlParameter("@id", degreeId));

            return ds;
        }

    }
}