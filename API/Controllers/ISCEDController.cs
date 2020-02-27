﻿/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๖/๑๐/๒๕๖๑>
Modify date : <๒๕/๐๗/๒๕๖๒>
Description : <คอนโทลเลอร์ข้อมูล ISCED>
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
    [RoutePrefix("ISCED")]
    public class ISCEDController : ApiController
    {
        private dynamic account = iUtil.AuthenStudentSystem.GetAccount();

        [Route("GetListData")]
        [HttpGet]
        public HttpResponseMessage GetListData()
        {
            DataTable dt = new DataTable();
            bool isAuthen = iUtil.AuthenStudentSystem.validAccount(account);

            if (isAuthen)
                dt = ISCED.GetListData().Tables[0];

            return Request.CreateResponse(HttpStatusCode.OK, iUtil.APIResponse.GetData(dt, isAuthen));
        }

        [Route("GetData")]
        [HttpGet]
        public HttpResponseMessage GetData(string iscedId)
        {
            DataTable dt = new DataTable();
            bool isAuthen = iUtil.AuthenStudentSystem.validAccount(account);

            if (isAuthen)
                dt = ISCED.GetData(iscedId).Tables[0];

            return Request.CreateResponse(HttpStatusCode.OK, iUtil.APIResponse.GetData(dt, isAuthen));
        }
    }
}