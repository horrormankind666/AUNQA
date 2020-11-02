/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๒๗/๑๑/๒๕๖๑>
Modify date : <๒๕/๐๗/๒๕๖๒>
Description : <คอนโทลเลอร์ข้อมูลสถานที่จัดการเรียนการสอน>
=============================================
*/

using System.Data;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using API.Models;

namespace API.Controllers
{
  [RoutePrefix("PlaceStudy")]
  public class PlaceStudyController : ApiController
  {
    private dynamic account = iUtil.AuthenStudentSystem.GetAccount();

    [Route("GetListData")]
    [HttpGet]
    public HttpResponseMessage GetListData()
    {
      DataTable dt = new DataTable();
      bool isAuthen = iUtil.AuthenStudentSystem.validAccount(account);

      if (isAuthen)
        dt = PlaceStudy.GetListData().Tables[0];

      return Request.CreateResponse(HttpStatusCode.OK, iUtil.APIResponse.GetData(dt, isAuthen));
    }
  }
}
