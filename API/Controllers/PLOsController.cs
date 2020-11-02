/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๐๘/๐๒/๒๕๖๒>
Modify date : <๒๕/๐๗/๒๕๖๒>
Description : <คอนโทลเลอร์ข้อมูล PLOs>
=============================================
*/

using System.Data;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using API.Models;

namespace API.Controllers
{
  [RoutePrefix("PLOs")]
  public class PLOsController : ApiController
  {
    private dynamic account = iUtil.AuthenStudentSystem.GetAccount();

    [Route("GetListData")]
    [HttpGet]
    public HttpResponseMessage GetListData(string tqfProgramId)
    {
      DataTable dt = new DataTable();
      bool isAuthen = iUtil.AuthenStudentSystem.validAccount(account);

      if (isAuthen)
        dt = PLOs.GetListData(tqfProgramId).Tables[0];

      return Request.CreateResponse(HttpStatusCode.OK, iUtil.APIResponse.GetData(dt, isAuthen));
    }

    [Route("GetData")]
    [HttpGet]
    public HttpResponseMessage GetData(string plosId)
    {
      DataTable dt = new DataTable();
      bool isAuthen = iUtil.AuthenStudentSystem.validAccount(account);

      if (isAuthen)
        dt = PLOs.GetData(plosId).Tables[0];

      return Request.CreateResponse(HttpStatusCode.OK, iUtil.APIResponse.GetData(dt, isAuthen));
    }
  }
}
