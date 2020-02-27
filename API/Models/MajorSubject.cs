/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๒๒/๐๗/๒๕๖๒>
Modify date : <๒๒/๐๗/๒๕๖๒>
Description : <โมเดลข้อมูลวิชาเอก>
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
    public class MajorSubject
    {
        public static DataSet GetListData()
        {
            DataSet ds = iUtil.ExecuteCommandStoredProcedure(iUtil.infinityConnectionString, "sp_acaGetListProgram",
                new SqlParameter("@uId", "U0001"));

            return ds;
        }
    }
}