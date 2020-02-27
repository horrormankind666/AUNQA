/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๐๓/๐๔/๒๕๖๑>
Modify date : <๓๐/๐๗/๒๕๖๒>
Description : <คอนโทลเลอร์ข้อมูลคณะ>
=============================================
*/

using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web;
using System.Web.Http;
using System.Web.Script.Serialization;
using Newtonsoft.Json;
using API.Models;

namespace API.Controllers
{
    [RoutePrefix("Faculty")]
    public class FacultyController : ApiController
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
        public HttpResponseMessage GetListData()
        {
            DataTable dt = new DataTable();
            bool isAuthen = iUtil.AuthenStudentSystem.validAccount(account);

            if (isAuthen)
            {
                DataRow[] dr = Faculty.GetListData().Tables[0].Select("id <> 'MU-01'");
                dt = dr.CopyToDataTable();
            }

            return Request.CreateResponse(HttpStatusCode.OK, iUtil.APIResponse.GetData(dt, isAuthen));
        }

        [Route("GetData")]
        [HttpGet]
        public HttpResponseMessage GetData(string facultyId)
        {
            DataTable dt = new DataTable();
            bool isAuthen = iUtil.AuthenStudentSystem.validAccount(account);

            if (isAuthen)
                dt = Faculty.GetData(facultyId).Tables[0];

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
                    List<Faculty> list = GetJSONFromRequest().data.ToObject<List<Faculty>>();
                    dt = Faculty.SetData("POST", list, account).Tables[0];
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
                isAuthen = (account.FacultyId.ToString().Equals("MU-01") && account.Userlevel.ToString().Equals(new UtilService.iUtil().GetUserLevelAdmin()) ? true : false);

                if (isAuthen)
                {
                    List<Faculty> list = GetJSONFromRequest().data.ToObject<List<Faculty>>();
                    dt = Faculty.SetData("PUT", list, account).Tables[0];
                }
            }

            return Request.CreateResponse(HttpStatusCode.OK, iUtil.APIResponse.GetData(dt, isAuthen));
        }

        [Route("DeleteData")]
        [HttpDelete]
        public HttpResponseMessage DeleteData()
        {
            DataTable dt = new DataTable();
            bool isAuthen = iUtil.AuthenStudentSystem.validAccount(account);

            if (isAuthen)
            {
                isAuthen = (account.FacultyId.ToString().Equals("MU-01") && account.Userlevel.ToString().Equals(new UtilService.iUtil().GetUserLevelAdmin()) ? true : false);

                if (isAuthen)
                {
                    List<Faculty> list = GetJSONFromRequest().data.ToObject<List<Faculty>>();
                    dt = Faculty.SetData("DELETE", list, account).Tables[0];
                }
            }

            return Request.CreateResponse(HttpStatusCode.OK, iUtil.APIResponse.GetData(dt, isAuthen));
        }
    }
}
