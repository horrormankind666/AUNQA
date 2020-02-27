/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๐๓/๐๔/๒๕๖๑>
Modify date : <๓๐/๐๗/๒๕๖๒>
Description : <รวบรวมคลาสและฟังก์ชั่นสำหรับใช้งานทั่วไป>
=============================================
*/

using System;
using System.Configuration;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Web;
using API.UtilService;
using API.FinService;
using Newtonsoft.Json;

namespace API
{
    public class iUtil
    {                 
        //คลาสสำหรับกำหนดข้อมูลเพิ่อใช้เป็นข้อมูลสำหรับส่งกลับ
        public class APIResponse
        {
            public bool status { get; set; }

            public object data { get; set; }

            public string message { get; set; }

            public APIResponse(bool status = true, string message = null)
            {
                this.status = status;
                this.message = (!status ? message : null);
            }

            public static APIResponse GetData(DataTable dt, bool isAuthen = true, string message = null)
            {
                APIResponse obj = null;

                try
                {
                    obj = new APIResponse
                    {
                        data = dt
                    };

                    if (!isAuthen)
                        obj = new APIResponse(false, (String.IsNullOrEmpty(message) ? "permissionNotFound" : message));
                }
                catch (Exception ex)
                {
                    obj = new APIResponse(false, ex.Message);
                }

                return obj;
            }
        }

        public static string infinityConnectionString = ConfigurationManager.ConnectionStrings["infinityConnectionString"].ConnectionString;
        public static string userType = new UtilService.iUtil().GetUserTypeStaff();
        public static string systemGroup = "AUNQA";

        //คลาสสำหรับตรวจสอบการเข้าใช้งานระบบนักศึกษา
        public class AuthenStudentSystem
        {
            //ฟังก์ชั่นสำหรับแสดงรายละเอียดของผู้ใช้งานที่เข้าระบบนักศึกษา แล้วส่งค่ากลับเป็น Dictionary<string, object>
            //โดยมีพารามิเตอร์ดังนี้
            //1. usertype       เป็น string รับค่าประเภทของผุู้ใช้งาน
            //2. systemGroup    เป็น string รับค่าชื่อระบบงาน
            public static dynamic GetAccount()
            {
                string accountResult = String.Empty;
                bool cookieExist = false;
                DataSet ds = new DataSet();

                cookieExist = CookieExist(userType);
                
                if (cookieExist)
                {
                    HttpCookie cookieObj = GetCookie(userType);

                    Finservice account = new Finservice();
                    ds = account.info(cookieObj["result"]);
                }

                accountResult = new UtilService.iUtil().GetAccountStudentSystem(cookieExist, ds, userType, systemGroup);

                ds.Dispose();

                return JsonConvert.DeserializeObject(accountResult);
            }

            public static bool validAccount(dynamic account)
            {
                if (String.IsNullOrEmpty(account.Username.ToString()))      return false;
                if (String.IsNullOrEmpty(account.FacultyId.ToString()))     return false;
                if (String.IsNullOrEmpty(account.Userlevel.ToString()))     return false;
                if (String.IsNullOrEmpty(account.SystemGroup.ToString()))   return false;
                if (!(account.SystemGroup).ToString().Equals(systemGroup))  return false;

                return true;
            }
        }

        public static SqlConnection ConnectDB(string connString)
        {
            SqlConnection conn = new SqlConnection(connString);

            return conn;
        }
        
        public static DataSet ExecuteCommandStoredProcedure(string connString, string spName, params SqlParameter[] values)
        {
            SqlConnection conn = ConnectDB(connString);
            SqlCommand cmd = new SqlCommand(spName, conn);
            DataSet ds = new DataSet();
                                
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandTimeout = 1000;

            if (values != null && values.Length > 0)
                cmd.Parameters.AddRange(values);

            try
            {
                conn.Open();

                SqlDataAdapter da = new SqlDataAdapter(cmd);

                ds = new DataSet();
                da.Fill(ds);
            }
            finally
            {
                cmd.Dispose();
                    
                conn.Close();
                conn.Dispose();
            }

            return ds;
        }

        //ฟังก์ชั่นสำหรับดึงข้อมูลจาก Cookie ที่ระบบสร้างขึ้น แล้วส่งค่ากลับเป็น HttpCookie
        //โดยมีพารามิเตอร์ดังนี้
        //1. cookieName เป็น string รับค่าชื่อ Cookie
        public static HttpCookie GetCookie(string cookieName)
        {
            HttpCookie cookieObj = new HttpCookie(cookieName);
            cookieObj = HttpContext.Current.Request.Cookies[cookieName];

            return cookieObj;
        }

        //ฟังก์ชั่นสำหรับการตรวจสอบการใช้งาน Cookie ของระบบ แล้วส่งค่ากลับเป็น boolean เพื่อแจ้งสถานะการมีของ Cookie ว่าระบบได้ใช้งานหรือไม่
        //โดยมีพารามิเตอร์ดังนี้
        //1. cookieName เป็น string รับค่าชื่อ Cookie
        public static bool CookieExist(string cookieName)
        {
            HttpCookie cookieObj = GetCookie(cookieName);        

            return (cookieObj == null ? false : true);
        }
    }
}