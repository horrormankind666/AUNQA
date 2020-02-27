/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๒๒/๐๗/๒๕๖๒>
Modify date : <๒๕/๐๗/๒๕๖๒>
Description : <คอนโทลเลอร์ข้อมูลวิชาเอก>
=============================================
*/

using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Script.Serialization;
using Newtonsoft.Json;
using API.Models;

namespace API.Controllers
{
    [RoutePrefix("MajorSubject")]
    public class MajorSubjectController : ApiController
    {
        private dynamic account = iUtil.AuthenStudentSystem.GetAccount();

        [Route("GetListData")]
        [HttpGet]
        public HttpResponseMessage GetListData()
        {
            DataTable dt = new DataTable();
            bool isAuthen = iUtil.AuthenStudentSystem.validAccount(account);

            if (isAuthen)
                dt = MajorSubject.GetListData().Tables[0];
     
            return Request.CreateResponse(HttpStatusCode.OK, iUtil.APIResponse.GetData(dt, isAuthen));
        }
    }
}
