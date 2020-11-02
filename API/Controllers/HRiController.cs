/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๐๖/๐๙/๒๕๖๒>
Modify date : <๒๓/๐๗/๒๕๖๓>
Description : <คอนโทลเลอร์เรียกใช้ข้อมูล HRi>
=============================================
*/

using System;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http;
using System.Web.Script.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace API.Controllers
{
	[RoutePrefix("HRi")]
  public class HRiController : ApiController
  {
		private class QueryData
    {
			public string personalId { get; set; }
			public string firstName { get; set; }
			public string lastName { get; set; }
    }

    private static string RouteTokenAccess(string server = "local")
    {
			string apiKey = String.Empty;

			if (server.Equals("local")) apiKey = "b0a1d751e060337a6a24958e90c51d7c5b2b4d79"; //local 10.43.4.0/24
			if (server.Equals("prd1"))  apiKey = "88771142581a429b8f774ba11512770873e46ed5"; //prd 10.41.101.33 
			if (server.Equals("prd2"))  apiKey = "dffcd10c1c41c016bf7aa61ad6dc47f0448645e3"; //prd 10.41.101.34 
			if (server.Equals("prd3"))  apiKey = "efcadecc4e8b32d21be61394d261d3adf549ca76"; //prd 10.7.242.14 
			if (server.Equals("qas"))   apiKey = "93e036ca96ffe0a1e3ed7c60aba704c2961520be"; //qas 10.41.18.171

			var httpWebRequest = (HttpWebRequest)WebRequest.Create("https://jwt.mahidol.ac.th/v1/access/" + apiKey);
			httpWebRequest.ContentType = "application/json";
			httpWebRequest.Method = "GET";
			httpWebRequest.UserAgent = "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36";            

			var httpWebResponse = (HttpWebResponse)httpWebRequest.GetResponse();
			using (var sr = new StreamReader(httpWebResponse.GetResponseStream()))
			{
				var result = sr.ReadToEnd();

				JavaScriptSerializer serializer = new JavaScriptSerializer();
				dynamic jsonObject = serializer.Deserialize<dynamic>(result);

				return jsonObject["tokenAccess"];
			};
    }

    private static string GetTokenAccess()
    {
      string tokenAccess = String.Empty;
      string server = "local";
      //string server = "prd";

      if (server.Equals("prd"))
      {
				tokenAccess = RouteTokenAccess("prd1");

				if (tokenAccess == null)
				{
					tokenAccess = RouteTokenAccess("prd2");

					if (tokenAccess == null)
						tokenAccess = RouteTokenAccess("prd3");
				}
      }
      else
				tokenAccess = RouteTokenAccess(server);

      return tokenAccess;
    }

		[Route("GetListData")]
		[HttpPost]
		public HttpResponseMessage GetListData()
		{
			string tokenAccess = GetTokenAccess();
			string content = Request.Content.ReadAsStringAsync().Result;
			QueryData queryData = JsonConvert.DeserializeObject<QueryData>(content);
			StringBuilder body = new StringBuilder();

			body.Append("{");
			body.AppendFormat("firstName: '{0}',", queryData.firstName);
			body.AppendFormat("lastName: '{0}',", queryData.lastName);
			body.Append("}");

			var httpWebRequest = (HttpWebRequest)WebRequest.Create("https://hr-i.mahidol.ac.th/titan/tools/v1/search_person_with_department");
			httpWebRequest.ContentType = "application/json";
			httpWebRequest.Method = "POST";
			httpWebRequest.Headers["Authorization"] = tokenAccess;

			using (var sw = new StreamWriter(httpWebRequest.GetRequestStream()))
			{
				sw.Write(body.ToString());
			}

			var httpWebResponse = (HttpWebResponse)httpWebRequest.GetResponse();
			using (var sr = new StreamReader(httpWebResponse.GetResponseStream()))
			{
				var result = sr.ReadToEnd();
				iUtil.APIResponse obj = null;

				obj = new iUtil.APIResponse
				{
					data = JsonConvert.DeserializeObject<dynamic>(result)
				};

				return Request.CreateResponse(HttpStatusCode.OK, obj);
			};
		}

		private class GetInformation
		{
			public static dynamic Profile(string tokenAccess, string personalId)
			{
				StringBuilder body = new StringBuilder();

				body.AppendLine("personal(personalId: \"" + personalId + "\") { ");
				body.AppendLine("	personalId, ");
				body.AppendLine("	titleZ, ");
				body.AppendLine(" titleS, ");
				body.AppendLine(" titleV, ");
				body.AppendLine(" titleT, ");
				body.AppendLine("	title, ");
				body.AppendLine(" titleEn, ");
				body.AppendLine(" gender, ");
				body.AppendLine(" firstName, ");
				body.AppendLine(" middleName, ");
				body.AppendLine(" lastName, ");
				body.AppendLine(" firstNameEn, ");
				body.AppendLine(" middleNameEn, ");
				body.AppendLine(" lastNameEn, ");
				body.AppendLine(" birthDate, ");
				body.AppendLine(" birthCountry, ");
				body.AppendLine(" birthPlace, ");
				body.AppendLine(" nationality, ");
				body.AppendLine(" nationalitySecond, ");
				body.AppendLine(" nationalityThird, ");
				body.AppendLine(" religious, ");
				body.AppendLine(" marital");
				body.AppendLine(" positions { ");
				body.AppendLine("		id, ");
				body.AppendLine("   name, ");
				body.AppendLine("   fullname, ");
				body.AppendLine("   startDate, ");
				body.AppendLine("   type, ");
				body.AppendLine("   organization { ");
				body.AppendLine("			id, ");
				body.AppendLine("     name, ");
				body.AppendLine("     fullname, ");
				body.AppendLine("     faculty { ");
				body.AppendLine("				id, ");
				body.AppendLine("       name,");
				body.AppendLine("       fullname");
				body.AppendLine("			}");
				body.AppendLine("		}");
				body.AppendLine("	}");
				body.Append("}");

				return GetInformation.Action("https://hr-i.mahidol.ac.th/titan/information/v1/personal_profile", tokenAccess, body.ToString());
			}

			public static dynamic Address(string tokenAccess, string personalId)
			{
				StringBuilder body = new StringBuilder();

				body.AppendLine("addresses(personalId: \"" + personalId + "\") { ");
				body.AppendLine("	addressType, ");
				body.AppendLine("	region, ");
				body.AppendLine("	country, ");
				body.AppendLine("	building, ");
				body.AppendLine("	floor, ");
				body.AppendLine("	doorNo, ");
				body.AppendLine("	villageName, ");
				body.AppendLine("	moo, ");
				body.AppendLine("	addressNo, ");
				body.AppendLine("	soi, ");
				body.AppendLine("	streetRoad, ");
				body.AppendLine("	tambol, ");
				body.AppendLine(" district, ");
				body.AppendLine(" province, ");
				body.AppendLine(" postalCode, ");
				body.AppendLine(" telephoneNumber, ");
				body.AppendLine(" communicationType1, ");
				body.AppendLine(" detail1, ");
				body.AppendLine(" communicationType2, ");
				body.AppendLine(" detail2, ");
				body.AppendLine(" communicationType3, ");
				body.AppendLine(" detail3");
				body.Append("}");

				return GetInformation.Action("https://hr-i.mahidol.ac.th/titan/information/v1/personal_address", tokenAccess, body.ToString());
			}

			public static dynamic Education(string tokenAccess, string personalId)
			{
				StringBuilder body = new StringBuilder();

				body.AppendLine("educations(personalId: \"" + personalId + "\") { ");
				body.AppendLine("	educationType, ");
				body.AppendLine(" institute, ");
				body.AppendLine(" training, ");
				body.AppendLine(" country, ");
				body.AppendLine(" status, ");
				body.AppendLine(" branch1, ");
				body.AppendLine(" branch2, ");
				body.AppendLine(" certificate, ");
				body.AppendLine(" finalGrade, ");
				body.AppendLine(" graduateYear");
				body.Append("}");

				return GetInformation.Action("https://hr-i.mahidol.ac.th/titan/information/v1/personal_education", tokenAccess, body.ToString());
			}
          
			public static dynamic Action(string url, string tokenAccess, string body)
			{
				var httpWebRequest = (HttpWebRequest)WebRequest.Create(url);
				httpWebRequest.ContentType = "application/json";
				httpWebRequest.Method = "POST";
				httpWebRequest.Headers["Authorization"] = tokenAccess;

				using (var sw = new StreamWriter(httpWebRequest.GetRequestStream()))
				{
					sw.Write(body);
				}

				dynamic info;

				var httpWebResponse = (HttpWebResponse)httpWebRequest.GetResponse();
				using (var sr = new StreamReader(httpWebResponse.GetResponseStream()))
				{
					var result = sr.ReadToEnd();

					info = JsonConvert.DeserializeObject<dynamic>(result);
				};

				return info;
			}
		}

		[Route("GetData")]
		[HttpPost]
		public HttpResponseMessage GetData()
		{
			string tokenAccess = GetTokenAccess();

			string content = Request.Content.ReadAsStringAsync().Result;
			QueryData queryData = JsonConvert.DeserializeObject<QueryData>(content);

			dynamic profile = GetInformation.Profile(tokenAccess, queryData.personalId);
			dynamic address = GetInformation.Address(tokenAccess, queryData.personalId);
			dynamic education = GetInformation.Education(tokenAccess, queryData.personalId);

			JObject jsonObj = new JObject(profile);
			dynamic infoObj = null;
						
			if ((dynamic)jsonObj.SelectToken("content") != null)
			{                
				DataSet ds = iUtil.ExecuteCommandStoredProcedure(iUtil.infinityConnectionString, "sp_acaTQFGetListProgrammeWithHRi", new SqlParameter("@HRiId", queryData.personalId));								
				DataTable dt = ds.Tables[0];
				JArray programArray = new JArray();

				foreach (DataRow dr in dt.Rows)
				{
					JObject programObj = new JObject();

					foreach (DataColumn col in dt.Columns)
					{
						string values = dr[col].ToString();
						programObj.Add(col.ColumnName, values);
					}

					programArray.Add(programObj);
				}

				JObject jsonAdrObj = new JObject(address);
				JObject jsonEduObj = new JObject(education);
				infoObj = jsonObj["content"]["personal"];

				if (infoObj == null)
				{
					jsonObj["content"]["personal"] = new JObject();
					infoObj = jsonObj["content"]["personal"];
				}

				infoObj.Add("addresses", ((dynamic)jsonAdrObj.SelectToken("content") != null ? (dynamic)jsonAdrObj.SelectToken("content.addresses") : null));
				infoObj.Add("programs", (ds.Tables[0].Rows.Count > 0 ? programArray : null));
				infoObj.Add("educations", ((dynamic)jsonEduObj.SelectToken("content") != null ? (dynamic)jsonEduObj.SelectToken("content.educations") : null));
			}
						
			iUtil.APIResponse obj = null;

			obj = new iUtil.APIResponse
			{
				data = jsonObj
			};

			return Request.CreateResponse(HttpStatusCode.OK, obj);
		}
  }
}
