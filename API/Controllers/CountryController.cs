/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๙/๑๐/๒๕๖๑>
Modify date : <๒๕/๐๗/๒๕๖๒>
Description : <คอนโทลเลอร์ข้อมูลประเทศ>
=============================================
*/

using System.Data;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using API.Models;

namespace API.Controllers
{
  [RoutePrefix("Country")]
  public class CountryController : ApiController
  {
    private dynamic account = iUtil.AuthenStudentSystem.GetAccount();

    [Route("GetListData")]
    [HttpGet]
    public HttpResponseMessage GetListData(
      string keyword = "",
      string cancelledStatus = "",
      string sortOrderBy = "",
      string sortExpression = ""
    )
    {
      DataTable dt = new DataTable();
      bool isAuthen = iUtil.AuthenStudentSystem.validAccount(account);

      if (isAuthen)
        dt = Country.GetListData(keyword, cancelledStatus, sortOrderBy, sortExpression).Tables[0];

      return Request.CreateResponse(HttpStatusCode.OK, iUtil.APIResponse.GetData(dt, isAuthen));
    }
  }
}
