/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๐๘/๐๗/๒๕๖๒>
Modify date : <๐๘/๐๗/๒๕๖๒>
Description : <โมเดลข้อมูลตำแหน่งในหลักสูตรของอาจารย์>
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
    public class CoursePosition
    {
        public static DataSet GetListData(string group)
        {
            DataSet ds = iUtil.ExecuteCommandStoredProcedure(iUtil.infinityConnectionString, "sp_acaPosition",
                new SqlParameter("@group", @group));

            return ds;
        }
    }
}