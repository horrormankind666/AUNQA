/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๙/๑๐/๒๕๖๑>
Modify date : <๑๙/๐๖/๒๕๖๒>
Description : <โมเดลข้อมูลประเทศ>
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
    public class Country
    {
        public static DataSet GetListData(
            string keyword,
            string cancelledStatus,
            string sortOrderBy,
            string sortExpression
        )
        {
            UtilService.iUtil iUtilService = new UtilService.iUtil();
            DataSet ds = iUtilService.GetListCountry(iUtil.infinityConnectionString, keyword, cancelledStatus, sortOrderBy, sortExpression);

            return ds;
        }
    }
}