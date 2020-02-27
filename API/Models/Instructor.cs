/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๒๔/๑๐/๒๕๖๑>
Modify date : <๐๙/๑๐/๒๕๖๑>
Description : <โมเดลข้อมูลอาจารย์>
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
    public class Instructor
    {
        public static DataSet GetListData(string keyword, string facultyId)
        {
            DataSet ds = iUtil.ExecuteCommandStoredProcedure(iUtil.infinityConnectionString, "sp_acaGetListInstructor",
                new SqlParameter("@keyword",    keyword),
                new SqlParameter("@facultyId",  facultyId));

            return ds;
        }

        public static DataSet GetData(string instructorId)
        {
            DataSet ds = iUtil.ExecuteCommandStoredProcedure(iUtil.infinityConnectionString, "sp_acaGetInstructor",
                new SqlParameter("@id", instructorId));

            return ds;
        }
    }
}