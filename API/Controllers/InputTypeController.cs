/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๘/๑๐/๒๕๖๑>
Modify date : <๒๕/๐๗/๒๕๖๒>
Description : <คอนโทลเลอร์ข้อมูล Input Type>
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
    [RoutePrefix("InputType")]
    public class InputTypeController : ApiController
    {
        private dynamic account = iUtil.AuthenStudentSystem.GetAccount();

        [Route("GetListData")]
        [HttpGet]
        public HttpResponseMessage GetListData(
            string contentType = "",
            string curYear = "",
            string xmlData = "",
            string dLevel = ""
        )
        {
            DataTable dt = new DataTable();
            bool isAuthen = iUtil.AuthenStudentSystem.validAccount(account);

            if (isAuthen)
                dt = InputType.GetListData(contentType, curYear, xmlData, dLevel).Tables[0];

            return Request.CreateResponse(HttpStatusCode.OK, iUtil.APIResponse.GetData(dt, isAuthen));
        }
    }
}
