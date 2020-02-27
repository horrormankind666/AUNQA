using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using RestSharp;
using Newtonsoft.Json;

public partial class API : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

        Dictionary<string, object> _paramSearch = new Dictionary<string, object>();
        Dictionary<string, object> _result = new Dictionary<string, object>();
        var _client = new RestClient("http://146.88.50.236/TCASServiceUniversity/api/student/getstudent?citizenID=");
        var _request = new RestRequest(Method.POST);

        var _tcasReq = new
        {
            citizenID = "1769900550953"

            /*
            Prefix = "",
            Name = "",
            Surname = "",
            SchoolID = "",
            SchoolName = ""
            */

        };
        
        _request.AddHeader("cache-control", "no-cache");
        _request.AddHeader("content-type", "application/json");
        _request.AddParameter("application/json", JsonConvert.SerializeObject(_tcasReq), ParameterType.RequestBody);
        IRestResponse _response = _client.Execute(_request);


        //dynamic _obj = JsonConvert.DeserializeObject(_response.Content);

        //Response.Write(_response.ResponseStatus);
        //Response.Write(_response.ErrorMessage);
        Response.Write(_tcasReq);
    }
}