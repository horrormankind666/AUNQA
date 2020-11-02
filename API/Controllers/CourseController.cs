/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๐๙/๑๐/๒๕๖๒>
Modify date : <๑๘/๑๐/๒๕๖๒>
Description : <คอนโทลเลอร์ข้อมูลรายวิชา TQF3>
=============================================
*/

using System.Data;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Newtonsoft.Json;
using API.Models;

namespace API.Controllers
{
  [RoutePrefix("Course")]
  public class CourseController : ApiController
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
        case "master" : { order = 0; break; }
        case "temp"   : { order = 0; break; }
        default       : { order = 0; break; }
      }

      if (isAuthen)
        dt = Course.GetListData(tableType, facultyId).Tables[order];

      return Request.CreateResponse(HttpStatusCode.OK, iUtil.APIResponse.GetData(dt, isAuthen));
    }

    [Route("GetData")]
    [HttpGet]
    public HttpResponseMessage GetData(
      string tableType = "",
      string id = "",
      string courseId = ""
    )
    {
      DataTable dt = new DataTable();
      bool isAuthen = iUtil.AuthenStudentSystem.validAccount(account);
      int order = 0;

      switch (tableType)
      {
          case "master" : { order = 0; break; }
          case "temp"   : { order = 0; break; }
          default       : { order = 0; break; }
      }

      if (isAuthen)
        dt = Course.GetData(tableType, id, courseId, account.Username.ToString()).Tables[order];

      return Request.CreateResponse(HttpStatusCode.OK, iUtil.APIResponse.GetData(dt, isAuthen));
    }
  }
}
