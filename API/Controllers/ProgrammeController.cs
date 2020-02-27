/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๐๔/๐๔/๒๕๖๑>
Modify date : <๐๘/๑๐/๒๕๖๒>
Description : <คอนโทลเลอร์ข้อมูลหลักสูตร TQF2>
=============================================
*/

using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Script.Serialization;
using Newtonsoft.Json;
using API.Models;

namespace API.Controllers
{
    [RoutePrefix("Programme")]
    public class ProgrammeController : ApiController
    {
        private dynamic account = iUtil.AuthenStudentSystem.GetAccount();

        public dynamic GetJSONFromRequest()
        {
            string content = Request.Content.ReadAsStringAsync().Result;
            dynamic json = JsonConvert.DeserializeObject<dynamic>(content);

            return json;
        }

        [Route("GetListData")]
        [HttpGet]
        public HttpResponseMessage GetListData(
            string tableType,
            string facultyId = ""
        )
        {
            DataTable dt = new DataTable();
            bool isAuthen = iUtil.AuthenStudentSystem.validAccount(account);
            int order = 0;

            switch (tableType)
            {
                case "master"   : { order = 1; break; }
                case "temp"     : { order = 0; break; }
                default         : { order = 1; break; }
            }

            if (isAuthen)
                dt = Programme.GetListData(tableType, facultyId).Tables[order];

            return Request.CreateResponse(HttpStatusCode.OK, iUtil.APIResponse.GetData(dt, isAuthen));
        }

        [Route("GetData")]
        [HttpGet]
        public HttpResponseMessage GetData(
            string tableType = "",
            string mode = "",
            string id = "",
            string programId = "",
            string courseYear = "",
            string programCode = "",
			string majorCode = "",
			string groupNum = ""
        )
        {
            DataTable dt = new DataTable();
            bool isAuthen = iUtil.AuthenStudentSystem.validAccount(account);
            int order = 0;

            switch (tableType)
            {
                case "master"       : { order = 0; break; }
                case "temp"         : { order = 0; break; }
                case "mastertemp"   : { order = 1; break; }
                default             : { order = 0; break; }
            }

            if (isAuthen)
                dt = Programme.GetData(tableType, mode, id, programId, courseYear, programCode, majorCode, groupNum, account.Username.ToString()).Tables[order];

            return Request.CreateResponse(HttpStatusCode.OK, iUtil.APIResponse.GetData(dt, isAuthen));
        }

        [Route("PostData")]
        [HttpPost]
        public HttpResponseMessage PostData()
        {
            DataTable dt = new DataTable();
            bool isAuthen = iUtil.AuthenStudentSystem.validAccount(account);

            if (isAuthen)
            {
                isAuthen = (account.FacultyId.ToString().Equals("MU-01") && account.Userlevel.ToString().Equals(new UtilService.iUtil().GetUserLevelAdmin()) ? true : false);

                if (isAuthen)
                {
                    List<Programme> list = GetJSONFromRequest().data.ToObject<List<Programme>>();
                    dt = Programme.SetData("POST", list, account).Tables[0];
                }
            }

            return Request.CreateResponse(HttpStatusCode.OK, iUtil.APIResponse.GetData(dt, isAuthen));
        }

        [Route("PutData")]
        [HttpPut]
        public HttpResponseMessage PutData()
        {
            DataTable dt = new DataTable();
            bool isAuthen = iUtil.AuthenStudentSystem.validAccount(account);

            if (isAuthen)
            {
                List<Programme> list = GetJSONFromRequest().data.ToObject<List<Programme>>();
                dt = Programme.SetData("PUT", list, account).Tables[0];
            }

            return Request.CreateResponse(HttpStatusCode.OK, iUtil.APIResponse.GetData(dt, isAuthen));
        }

        [Route("UpdateData")]
        [HttpPut]
        public HttpResponseMessage UpdateData()
        {
            DataTable dt = new DataTable();
            bool isAuthen = iUtil.AuthenStudentSystem.validAccount(account);

            if (isAuthen)
            {
                if (isAuthen)
                {
                    List<Programme> list = GetJSONFromRequest().data.ToObject<List<Programme>>();
                    dt = Programme.SetData("UPDATE", list, account).Tables[0];
                }
            }

            return Request.CreateResponse(HttpStatusCode.OK, iUtil.APIResponse.GetData(dt, isAuthen));
        }

        [Route("SendVerifyData")]
        [HttpPut]
        public HttpResponseMessage SendVerifyData()
        {
            DataTable dt = new DataTable();
            bool isAuthen = iUtil.AuthenStudentSystem.validAccount(account);

            if (isAuthen)
            {
                if (isAuthen)
                {
                    List<Programme> list = GetJSONFromRequest().data.ToObject<List<Programme>>();
                    dt = Programme.SetData("SENDVERIFY", list, account).Tables[0];
                }
            }

            return Request.CreateResponse(HttpStatusCode.OK, iUtil.APIResponse.GetData(dt, isAuthen));
        }

        [Route("VerifyData")]
        [HttpPut]
        public HttpResponseMessage VerifyData()
        {
            DataTable dt = new DataTable();
            bool isAuthen = iUtil.AuthenStudentSystem.validAccount(account);

            if (isAuthen)
            {
                isAuthen = (account.FacultyId.ToString().Equals("MU-01") && account.Userlevel.ToString().Equals(new UtilService.iUtil().GetUserLevelAdmin()) ? true : false);

                if (isAuthen)
                {
                    List<Programme> list = GetJSONFromRequest().data.ToObject<List<Programme>>();
                    dt = Programme.SetData("VERIFY", list, account).Tables[0];
                }
            }

            return Request.CreateResponse(HttpStatusCode.OK, iUtil.APIResponse.GetData(dt, isAuthen));
        }
    }
}
