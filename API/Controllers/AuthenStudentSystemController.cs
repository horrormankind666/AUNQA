/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๒๖/๐๖/๒๕๖๒>
Modify date : <๒๕/๐๗/๒๕๖๒>
Description : <คอนโทลเลอร์ข้อมูลผู้ใช้งานที่เข้าสู่ระบบนักศึกษา>
=============================================
*/

using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http;
using Newtonsoft.Json;

namespace API.Controllers
{
    [RoutePrefix("AuthenStudentSystem")]
    public class AuthenStudentSystemController : ApiController
    {
        [Route("GetAccount")]
        [HttpGet]
        public HttpResponseMessage GetAccount()
        {
            dynamic account = iUtil.AuthenStudentSystem.GetAccount();
            DataTable dt = JsonConvert.DeserializeObject<DataTable>("[" + JsonConvert.SerializeObject(account) + "]");

            return Request.CreateResponse(HttpStatusCode.OK, iUtil.APIResponse.GetData(dt));
        }
    }
}