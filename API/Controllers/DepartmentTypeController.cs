/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๓๐/๐๔/๒๕๖๑>
Modify date : <๒๕/๐๗/๒๕๖๒>
Description : <คอนโทลเลอร์ข้อมูลประเภทของภาควิชา>
=============================================
*/

using System.Data;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using API.Models;

namespace API.Controllers
{
  [RoutePrefix("DepartmentType")]
  public class DepartmentTypeController : ApiController
  {
    private dynamic account = iUtil.AuthenStudentSystem.GetAccount();

    [Route("GetListData")]
    [HttpGet]
    public HttpResponseMessage GetListData()
    {
      DataTable dt = new DataTable();
      bool isAuthen = iUtil.AuthenStudentSystem.validAccount(account);

      if (isAuthen)
        dt = DepartmentType.GetListData().Tables[0];

      return Request.CreateResponse(HttpStatusCode.OK, iUtil.APIResponse.GetData(dt, isAuthen));
    }
  }
}
