/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๒๗/๑๑/๒๕๖๑>
Modify date : <๒๗/๑๑/๒๕๖๑>
Description : <โมเดลข้อมูลสถานที่จัดการเรียนการสอน>
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
    public class PlaceStudy
    {
        public static DataSet GetListData()
        {
            DataSet ds = iUtil.ExecuteCommandStoredProcedure(iUtil.infinityConnectionString, "sp_acaGetListPlaceStudy", null);

            return ds;
        }
    }
}