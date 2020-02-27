/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๒๔/๐๔/๒๕๖๑>
Modify date : <๒๕/๐๗/๒๕๖๒>
Description : <คอนโทลเลอร์ข้อมูลสาขา>
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
    [RoutePrefix("Branch")]
    public class BranchController : ApiController
    {
        private dynamic account = iUtil.AuthenStudentSystem.GetAccount();

        [Route("GetListData")]
        [HttpGet]
        public HttpResponseMessage GetListData()
        {
            DataTable dt = new DataTable();
            bool isAuthen = iUtil.AuthenStudentSystem.validAccount(account);

            if (isAuthen)
                dt = Branch.GetListData().Tables[0];

            return Request.CreateResponse(HttpStatusCode.OK, iUtil.APIResponse.GetData(dt, isAuthen));
        }

        [Route("GetData")]
        [HttpGet]
        public HttpResponseMessage GetData(string branchId)
        {
            DataTable dt = new DataTable();
            bool isAuthen = iUtil.AuthenStudentSystem.validAccount(account);

            if (isAuthen)
                dt = Branch.GetData(branchId).Tables[0];

            return Request.CreateResponse(HttpStatusCode.OK, iUtil.APIResponse.GetData(dt, isAuthen));
        }
    }
}
