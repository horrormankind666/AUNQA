/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๐๕/๐๔/๒๕๖๑>
Modify date : <๓๐/๐๗/๒๕๖๒>
Description : <คอนโทลเลอร์ข้อมูลภาควิชา>
=============================================
*/
using System.Collections.Generic;
using System.Data;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Newtonsoft.Json;
using API.Models;

namespace API.Controllers
{
  [RoutePrefix("Department")]
  public class DepartmentController : ApiController
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
    public HttpResponseMessage GetListData(string facultyId)
    {
      DataTable dt = new DataTable();
      bool isAuthen = iUtil.AuthenStudentSystem.validAccount(account);

      if (isAuthen)
        dt = Department.GetListData(facultyId).Tables[0];

      return Request.CreateResponse(HttpStatusCode.OK, iUtil.APIResponse.GetData(dt, isAuthen));
    }
        
    [Route("GetData")]
    [HttpGet]
    public HttpResponseMessage GetData(string departmentId)
    {
      DataTable dt = new DataTable();
      bool isAuthen = iUtil.AuthenStudentSystem.validAccount(account);

      if (isAuthen)
        dt = Department.GetData(departmentId).Tables[0];

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
          List<Department> list = GetJSONFromRequest().data.ToObject<List<Department>>();
          dt = Department.SetData("POST", list, account).Tables[0];
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
          List<Department> list = GetJSONFromRequest().data.ToObject<List<Department>>();
          dt = Department.SetData("PUT", list, account).Tables[0];
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
          List<Department> list = GetJSONFromRequest().data.ToObject<List<Department>>();
          dt = Department.SetData("DELETE", list, account).Tables[0];
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
          List<Department> list = GetJSONFromRequest().data.ToObject<List<Department>>();
          dt = Department.SetData("VERIFY", list, account).Tables[0];
        }
      }

      return Request.CreateResponse(HttpStatusCode.OK, iUtil.APIResponse.GetData(dt, isAuthen));
    }
  }
}
