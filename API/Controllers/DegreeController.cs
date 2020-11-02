/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๒๒/๐๗/๒๕๖๒>
Modify date : <๒๕/๐๗/๒๕๖๒>
Description : <คอนโทลเลอร์ข้อมูลระดับการศึกษา>
=============================================
*/

using System.Data;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using API.Models;

namespace API.Controllers
{
  [RoutePrefix("Degree")]
  public class DegreeController : ApiController
  {
    private dynamic account = iUtil.AuthenStudentSystem.GetAccount();

    [Route("GetListData")]
    [HttpGet]
    public HttpResponseMessage GetListData()
    {
      DataTable dt = new DataTable();
      bool isAuthen = iUtil.AuthenStudentSystem.validAccount(account);

      if (isAuthen)
        dt = Degree.GetListData().Tables[0];

      return Request.CreateResponse(HttpStatusCode.OK, iUtil.APIResponse.GetData(dt, isAuthen));
    }
        
    [Route("GetData")]
    [HttpGet]
    public HttpResponseMessage GetData(string degreeId)
    {
      DataTable dt = new DataTable();
      bool isAuthen = iUtil.AuthenStudentSystem.validAccount(account);

      if (isAuthen)
        dt = Degree.GetData(degreeId).Tables[0];

      return Request.CreateResponse(HttpStatusCode.OK, iUtil.APIResponse.GetData(dt, isAuthen));
    }
  }
}
