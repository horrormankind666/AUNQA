/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๐๔/๐๔/๒๕๖๑>
Modify date : <๒๔/๐๓/๒๕๖๔>
Description : <โมเดลข้อมูลหลักสูตร TQF2>
=============================================
*/

using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using System.Text.RegularExpressions;

namespace API.Models
{
  public class Programme
  {
    public string tableType { get; set; }
    public string id { get; set; }
    public string programId { get; set; }
    public string courseYear { get; set; }
    public string uId { get; set; }
    public string facultyId { get; set; }        
    public string majorId { get; set; }
    public string programCode { get; set; }
    public string majorCode { get; set; }
    public string groupNum { get; set; }
    public string dLevel { get; set; }
    public string courseCredit { get; set; }
    public string nameTh { get; set; }
    public string nameEn { get; set; }
    public string abbrevTh { get; set; }
    public string abbrevEn { get; set; }
    public string degreeNameTh { get; set; }
    public string degreeNameEn { get; set; }
    public string degreeAbbrevTh { get; set; }
    public string degreeAbbrevEn { get; set; }
    public string studentNo { get; set; }
    public string address { get; set; }
    public string telephone { get; set; }
    public string eduSystem { get; set; }
    public string studyYear { get; set; }
    public string branchGroup { get; set; }
    public string programType { get; set; }
    public string entryType { get; set; }
    public string centerStudy { get; set; }
    public string joinIns { get; set; }
    public string startDate { get; set; }
    public string endDate { get; set; }
    public string startYear { get; set; }
    public string startSemester { get; set; }
    public string endYear { get; set; }
    public string endSemester { get; set; }
    public string MUA_ISCED { get; set; }
    public string MUA_CURR_ID { get; set; }
    public string schRefGroup_ICL { get; set; }
    public string countFlag { get; set; }
    public string iscedGroup { get; set; }
    public string transNo { get; set; }
    public string refPrevTransId { get; set; }
    public string activeStatus { get; set; }
    public string presentStatus { get; set; }
    public string xmlFaculty { get; set; }
    public string xmlMajorSubject { get; set; }
    public string xmlDepartment { get; set; }
    public string xmlProgramType { get; set; }
    public string xmlAdmissionType { get; set; }
    public string xmlBranch { get; set; }
    public string xmlISCED { get; set; }
    public string xmlLanguages { get; set; }
    public string xmlCooperationType { get; set; }
    public string xmlCooperationPattern { get; set; }
    public string xmlCooperationInitute { get; set; }
    public string xmlGraduateType { get; set; }
    public string xmlCourseManagement { get; set; }
    public string xmlApprovedCourses { get; set; }
    public string publishYear { get; set; }
    public string xmlCareer { get; set; }
    public string xmlPlaceStudy { get; set; }
    public string xmlExternalSituation { get; set; }
    public string xmlImpactCurriculum { get; set; }
    public string xmlRefOtherCourses { get; set; }
    public string xmlInstructorResponsible { get; set; }
    public string xmlProgramObjectives { get; set; }
    public string xmlPLOs { get; set; }
    public string xmlDevelopPlan { get; set; }
    public string philosopyCourses { get; set; }
    public string docDate { get; set; }
    public string tqfYear { get; set; }
    public string xmlEduSystem { get; set; }
    public string xmlEduStudyType { get; set; }
    public string numSemester { get; set; }
    public string isSummer { get; set; }
    public string compareCredit { get; set; }
    public string creditTransfer { get; set; }
    public string xmlDevMng { get; set; }
    public string planYear { get; set; }
    public string xmlPlanQuantity { get; set; }
    public string xmlCostEffective { get; set; }
    public string xmlCostDebit { get; set; }
    public string xmlCostCredit { get; set; }
    public string xmlFirst2FacultyCode { get; set; }
    public string xmlAfter2DepCode { get; set; }
    public string xmlAfter2SubjectCode { get; set; }
    public string xmlInstructorCourse { get; set; }
    public string xmlInstructorRegular { get; set; }
    public string xmlInstructorSpectial { get; set; }
    public string xmlCourseCreditStructure { get; set; }
    public string xmlPlanOfStudy { get; set; }
    public string xmlCourseSubjectStructure { get; set; }
    public string xmlCharacter { get; set; }
    public string xmlCriteriaEvaluate { get; set; }
    public string xmlTeacherDevelop { get; set; }
    public string xmlQualityAssurance { get; set; }
    public string xmlCourseImplement { get; set; }
    public string startYearKPI { get; set; }
    public string xmlIndicators { get; set; }
    public string cancelStatus { get; set; }
    public string verifyStatus { get; set; }
    public string notiAppointment { get; set; }
    public string notiDate { get; set; }
    public string verifyRemark { get; set; }
	  public string transStatus { get; set; }

    public static DataSet GetListData(string tableType, string facultyId)
    {
      string sp = String.Empty;

      switch (tableType)
      {
        case "master" : { sp = "sp_acaTQFGetListProgramme"; break; }
        case "temp"   : { sp = "sp_acaTQFGetListProgrammeTemp"; break; }
      }

      DataSet ds = iUtil.ExecuteCommandStoredProcedure(iUtil.infinityConnectionString, sp,
        new SqlParameter("@facultyId", facultyId));

      return ds;
    }

    public static DataSet GetData(string tableType, string mode, string id, string programId, string courseYear, string programCode, string majorCode, string groupNum, string username)
    {
      DataSet ds = new DataSet();

      if (tableType.Equals("programPresent"))
      {
        ds = iUtil.ExecuteCommandStoredProcedure(iUtil.infinityConnectionString, "sp_acaTQFGetProgramme",
          new SqlParameter("@programId", programId));
      }
      if (tableType.Equals("master"))
      { 
        ds = iUtil.ExecuteCommandStoredProcedure(iUtil.infinityConnectionString, "sp_acaTQFGetProgramCourseYear",
          new SqlParameter("@programId",  programId),
          new SqlParameter("@courseYear", courseYear));
      }
      if (tableType.Equals("temp") || (tableType.Equals("mastertemp")))
      {
        ds = iUtil.ExecuteCommandStoredProcedure(iUtil.infinityConnectionString, "sp_acaTQFGetProgrammeTemp",
          new SqlParameter("@id",           id),
          new SqlParameter("@mode",         mode),
          new SqlParameter("@programId",    programId),
          new SqlParameter("@courseYear",   courseYear),
          new SqlParameter("@programCode",  programCode),
          new SqlParameter("@majorCode",    majorCode),
          new SqlParameter("@groupNum",     groupNum),
          new SqlParameter("@username",     username));	
      }

      return ds;
    }

    public static DataSet SetData(string method, List<Programme> data, dynamic account)
    {
      UtilService.iUtil iUtilService = new UtilService.iUtil();
      StringBuilder xmlData = new StringBuilder();
      StringBuilder xmlUser = new StringBuilder();
      string mode = String.Empty;
      string proc = "sp_acaTQFSetProgrammeTemp";
      string groupType = "academic";
      string xmlSeparators = "[\t]";

      if (method.Equals("POST"))            mode = "add";
      if (method.Equals("PUT"))             mode = "edit";
      if (method.Equals("UPDATE"))          mode = "update";
      if (method.Equals("SENDVERIFY"))      mode = "sendverify";
      if (method.Equals("VERIFY"))          mode = "verify";
      if (method.Equals("SETCANCELSTATUS"))
      {
        mode = "setcancelstatus";
        proc = "sp_acaTQFSetProgramme";
      }
      if (method.Equals("SETASDEFAULT"))
      {
        mode = "setasdefault";
        proc = "sp_acaTQFSetProgramme";
      }

      foreach (var d in data)
      {
        xmlData.Append(
        "<row>" +
        (d.tableType != null ? ("<tableType>" + d.tableType + "</tableType>") : String.Empty) +
        (d.id != null ? ("<id>" + d.id + "</id>") : String.Empty) +
        (mode != null ? ("<mode>" + mode + "</mode>") : String.Empty) +
        (d.programId != null ? ("<programId>" + d.programId + "</programId>") : String.Empty) +
        (d.courseYear != null ? ("<courseYear>" + d.courseYear + "</courseYear>") : String.Empty) +
        "<uId>U0001</uId>" +
        (d.facultyId != null ? ("<facultyId>" + d.facultyId + "</facultyId>") : String.Empty) +                
        (d.programCode != null ? ("<programCode>" + d.programCode + "</programCode>") : String.Empty) +
        (d.majorId != null ? ("<majorId>" + d.majorId + "</majorId>") : String.Empty) +
        (d.majorCode != null ? ("<majorCode>" + d.majorCode + "</majorCode>") : String.Empty) +
        (d.groupNum != null ? ("<groupNum>" + d.groupNum + "</groupNum>") : String.Empty) +
        "<dLevel>B</dLevel>" +
        (d.courseCredit != null ? ("<courseCredit>" + d.courseCredit + "</courseCredit>") : String.Empty) +
        (d.nameTh != null ? ("<nameTh>" + d.nameTh + "</nameTh>") : String.Empty) +
        (d.nameEn != null ? ("<nameEn>" + d.nameEn + "</nameEn>") : String.Empty) +
        (d.abbrevTh != null ? ("<abbrevTh>" + d.abbrevTh + "</abbrevTh>") : String.Empty) +
        (d.abbrevEn != null ? ("<abbrevEn>" + d.abbrevEn + "</abbrevEn>") : String.Empty) +
        (d.degreeNameTh != null ? ("<degreeNameTh>" + d.degreeNameTh + "</degreeNameTh>") : String.Empty) +
        (d.degreeNameEn != null ? ("<degreeNameEn>" + d.degreeNameEn + "</degreeNameEn>") : String.Empty) +
        (d.degreeAbbrevTh != null ? ("<degreeAbbrevTh>" + d.degreeAbbrevTh + "</degreeAbbrevTh>") : String.Empty) +
        (d.degreeAbbrevEn != null ? ("<degreeAbbrevEn>" + d.degreeAbbrevEn + "</degreeAbbrevEn>") : String.Empty) +
        (d.studentNo != null ? ("<studentNo>" + d.studentNo + "</studentNo>") : String.Empty) +
        (d.address != null ? ("<address>" + d.address + "</address>") : String.Empty) +
        (d.telephone != null ? ("<telephone>" + d.telephone + "</telephone>") : String.Empty) +
        (d.eduSystem != null ? ("<eduSystem>" + d.eduSystem + "</eduSystem>") : String.Empty) +
        (d.studyYear != null ? ("<studyYear>" + d.studyYear + "</studyYear>") : String.Empty) +
        (d.branchGroup != null ? ("<branchGroup>" + d.branchGroup + "</branchGroup>") : String.Empty) +
        (d.programType != null ? ("<programType>" + d.programType + "</programType>") : String.Empty) +
        (d.entryType != null ? ("<entryType>" + d.entryType + "</entryType>") : String.Empty) +
        (d.centerStudy != null ? ("<centerStudy>" + d.centerStudy + "</centerStudy>") : String.Empty) +
        (d.joinIns != null ? ("<joinIns>" + d.joinIns + "</joinIns>") : String.Empty) +
        (d.startDate != null ? ("<startDate>" + d.startDate + "</startDate>") : String.Empty) +
        (d.endDate != null ? ("<endDate>" + d.endDate + "</endDate>") : String.Empty) +
        (d.startYear != null ? ("<startYear>" + d.startYear + "</startYear>") : String.Empty) +
        (d.startSemester != null ? ("<startSemester>" + d.startSemester + "</startSemester>") : String.Empty) +
        (d.endYear != null ? ("<endYear>" + d.endYear + "</endYear>") : String.Empty) +
        (d.endSemester != null ? ("<endSemester>" + d.endSemester + "</endSemester>") : String.Empty) +
        (d.MUA_ISCED != null ? ("<MUA_ISCED>" + d.MUA_ISCED + "</MUA_ISCED>") : String.Empty) +
        (d.MUA_CURR_ID != null ? ("<MUA_CURR_ID>" + d.MUA_CURR_ID + "</MUA_CURR_ID>") : String.Empty) +
        (d.schRefGroup_ICL != null ? ("<schRefGroup_ICL>" + d.schRefGroup_ICL + "</schRefGroup_ICL>") : String.Empty) +
        (d.countFlag != null ? ("<countFlag>" + d.countFlag + "</countFlag>") : String.Empty) +
        (d.iscedGroup != null ? ("<iscedGroup>" + d.iscedGroup + "</iscedGroup>") : String.Empty) +
        (d.transNo != null ? ("<transNo>" + d.transNo + "</transNo>") : String.Empty) +
        (d.refPrevTransId != null ? ("<refPrevTransId>" + d.refPrevTransId + "</refPrevTransId>") : String.Empty) +
        (d.activeStatus != null ? ("<activeStatus>" + d.activeStatus + "</activeStatus>") : String.Empty) +
        (d.presentStatus != null ? ("<presentStatus>" + d.presentStatus + "</presentStatus>") : String.Empty) +
        (d.xmlFaculty != null ? ("<xmlFaculty>" + Regex.Replace(d.xmlFaculty, xmlSeparators, "") + "</xmlFaculty>") : String.Empty) +
        (d.xmlMajorSubject != null ? ("<xmlMajorSubject>" + Regex.Replace(iUtilService.XMLReplaceSpecialCharacter(d.xmlMajorSubject), xmlSeparators, "") + "</xmlMajorSubject>") : String.Empty) +
        (d.xmlDepartment != null ? ("<xmlDepartment>" + Regex.Replace(iUtilService.XMLReplaceSpecialCharacter(d.xmlDepartment), xmlSeparators, "") + "</xmlDepartment>") : String.Empty) +
        (d.xmlProgramType != null ? ("<xmlProgramType>" + Regex.Replace(iUtilService.XMLReplaceSpecialCharacter(d.xmlProgramType), xmlSeparators, "") + "</xmlProgramType>") : String.Empty) +
        (d.xmlAdmissionType != null ? ("<xmlAdmissionType>" + Regex.Replace(iUtilService.XMLReplaceSpecialCharacter(d.xmlAdmissionType), xmlSeparators, "") + "</xmlAdmissionType>") : String.Empty) +
        (d.xmlBranch != null ? ("<xmlBranch>" + Regex.Replace(iUtilService.XMLReplaceSpecialCharacter(d.xmlBranch), xmlSeparators, "") + "</xmlBranch>") : String.Empty) +
        (d.xmlISCED != null ? ("<xmlISCED>" + Regex.Replace(iUtilService.XMLReplaceSpecialCharacter(d.xmlISCED), xmlSeparators, "") + "</xmlISCED>") : String.Empty) +
        (d.xmlLanguages != null ? ("<xmlLanguages>" + Regex.Replace(iUtilService.XMLReplaceSpecialCharacter(d.xmlLanguages), xmlSeparators, "") + "</xmlLanguages>") : String.Empty) +
        (d.xmlCooperationType != null ? ("<xmlCooperationType>" + Regex.Replace(iUtilService.XMLReplaceSpecialCharacter(d.xmlCooperationType), xmlSeparators, "") + "</xmlCooperationType>") : String.Empty) +
        (d.xmlCooperationPattern != null ? ("<xmlCooperationPattern>" + Regex.Replace(iUtilService.XMLReplaceSpecialCharacter(d.xmlCooperationPattern), xmlSeparators, "") + "</xmlCooperationPattern>") : String.Empty) +
        (d.xmlCooperationInitute != null ? ("<xmlCooperationInitute>" + Regex.Replace(iUtilService.XMLReplaceSpecialCharacter(d.xmlCooperationInitute), xmlSeparators, "") + "</xmlCooperationInitute>") : String.Empty) +
        (d.xmlGraduateType != null ? ("<xmlGraduateType>" + Regex.Replace(iUtilService.XMLReplaceSpecialCharacter(d.xmlGraduateType), xmlSeparators, "") + "</xmlGraduateType>") : String.Empty) +
        (d.xmlCourseManagement != null ? ("<xmlCourseManagement>" + Regex.Replace(iUtilService.XMLReplaceSpecialCharacter(d.xmlCourseManagement), xmlSeparators, "") + "</xmlCourseManagement>") : String.Empty) +
        (d.xmlApprovedCourses != null ? ("<xmlApprovedCourses>" + Regex.Replace(iUtilService.XMLReplaceSpecialCharacter(d.xmlApprovedCourses), xmlSeparators, "") + "</xmlApprovedCourses>") : String.Empty) +
        (d.publishYear != null ? ("<publishYear>" + d.publishYear + "</publishYear>") : String.Empty) +
        (d.xmlCareer != null ? ("<xmlCareer>" + Regex.Replace(iUtilService.XMLReplaceSpecialCharacter(d.xmlCareer), xmlSeparators, "") + "</xmlCareer>") : String.Empty) +
        (d.xmlPlaceStudy != null ? ("<xmlPlaceStudy>" + Regex.Replace(iUtilService.XMLReplaceSpecialCharacter(d.xmlPlaceStudy), xmlSeparators, "") + "</xmlPlaceStudy>") : String.Empty) +
        (d.xmlExternalSituation != null ? ("<xmlExternalSituation>" + Regex.Replace(iUtilService.XMLReplaceSpecialCharacter(d.xmlExternalSituation), xmlSeparators, "") + "</xmlExternalSituation>") : String.Empty) +
        (d.xmlImpactCurriculum != null ? ("<xmlImpactCurriculum>" + Regex.Replace(iUtilService.XMLReplaceSpecialCharacter(d.xmlImpactCurriculum), xmlSeparators, "") + "</xmlImpactCurriculum>") : String.Empty) +
        (d.xmlRefOtherCourses != null ? ("<xmlRefOtherCourses>" + Regex.Replace(iUtilService.XMLReplaceSpecialCharacter(d.xmlRefOtherCourses), xmlSeparators, "") + "</xmlRefOtherCourses>") : String.Empty) +
        (d.xmlInstructorResponsible != null ? ("<xmlInstructorResponsible>" + Regex.Replace(iUtilService.XMLReplaceSpecialCharacter(d.xmlInstructorResponsible), xmlSeparators, "") + "</xmlInstructorResponsible>") : String.Empty) +
        (d.xmlProgramObjectives != null ? ("<xmlProgramObjectives>" + Regex.Replace(iUtilService.XMLReplaceSpecialCharacter(d.xmlProgramObjectives), xmlSeparators, "") + "</xmlProgramObjectives>") : String.Empty) +
        (d.xmlPLOs != null ? ("<xmlPLOs>" + Regex.Replace(iUtilService.XMLReplaceSpecialCharacter(d.xmlPLOs), xmlSeparators, "") + "</xmlPLOs>") : String.Empty) +
        (d.xmlDevelopPlan != null ? ("<xmlDevelopPlan>" + Regex.Replace(iUtilService.XMLReplaceSpecialCharacter(d.xmlDevelopPlan), xmlSeparators, "") + "</xmlDevelopPlan>") : String.Empty) +
        (d.philosopyCourses != null ? ("<philosopyCourses>" + d.philosopyCourses + "</philosopyCourses>") : String.Empty) +
        (d.docDate != null ? ("<docDate>" + d.docDate + "</docDate>") : String.Empty) +
        (d.tqfYear != null ? ("<tqfYear>" + d.tqfYear + "</tqfYear>") : String.Empty) +
        (d.xmlEduSystem != null ? ("<xmlEduSystem>" + Regex.Replace(iUtilService.XMLReplaceSpecialCharacter(d.xmlEduSystem), xmlSeparators, "") + "</xmlEduSystem>") : String.Empty) +
        (d.xmlEduStudyType != null ? ("<xmlEduStudyType>" + Regex.Replace(iUtilService.XMLReplaceSpecialCharacter(d.xmlEduStudyType), xmlSeparators, "") + "</xmlEduStudyType>") : String.Empty) +
        (d.numSemester != null ? ("<numSemester>" + d.numSemester + "</numSemester>") : String.Empty) +
        (d.isSummer != null ? ("<isSummer>" + d.isSummer + "</isSummer>") : String.Empty) +
        (d.compareCredit != null ? ("<compareCredit>" + d.compareCredit + "</compareCredit>") : String.Empty) +
        (d.creditTransfer != null ? ("<creditTransfer>" + d.creditTransfer + "</creditTransfer>") : String.Empty) +
        (d.xmlDevMng != null ? ("<xmlDevMng>" + Regex.Replace(iUtilService.XMLReplaceSpecialCharacter(d.xmlDevMng), xmlSeparators, "") + "</xmlDevMng>") : String.Empty) +
        (d.planYear != null ? ("<planYear>" + d.planYear + "</planYear>") : String.Empty) +
        (d.xmlPlanQuantity != null ? ("<xmlPlanQuantity>" + Regex.Replace(iUtilService.XMLReplaceSpecialCharacter(d.xmlPlanQuantity), xmlSeparators, "") + "</xmlPlanQuantity>") : String.Empty) +
        (d.xmlCostEffective != null ? ("<xmlCostEffective>" + Regex.Replace(iUtilService.XMLReplaceSpecialCharacter(d.xmlCostEffective), xmlSeparators, "") + "</xmlCostEffective>") : String.Empty) +
        (d.xmlCostDebit != null ? ("<xmlCostDebit>" + Regex.Replace(iUtilService.XMLReplaceSpecialCharacter(d.xmlCostDebit), xmlSeparators, "") + "</xmlCostDebit>") : String.Empty) +
        (d.xmlCostCredit != null ? ("<xmlCostCredit>" + Regex.Replace(iUtilService.XMLReplaceSpecialCharacter(d.xmlCostCredit), xmlSeparators, "") + "</xmlCostCredit>") : String.Empty) +
        (d.xmlFirst2FacultyCode != null ? ("<xmlFirst2FacultyCode>" + Regex.Replace(iUtilService.XMLReplaceSpecialCharacter(d.xmlFirst2FacultyCode), xmlSeparators, "") + "</xmlFirst2FacultyCode>") : String.Empty) +
        (d.xmlAfter2DepCode != null ? ("<xmlAfter2DepCode>" + Regex.Replace(iUtilService.XMLReplaceSpecialCharacter(d.xmlAfter2DepCode), xmlSeparators, "") + "</xmlAfter2DepCode>") : String.Empty) +
        (d.xmlAfter2SubjectCode != null ? ("<xmlAfter2SubjectCode>" + Regex.Replace(iUtilService.XMLReplaceSpecialCharacter(d.xmlAfter2SubjectCode), xmlSeparators, "") + "</xmlAfter2SubjectCode>") : String.Empty) +
        (d.xmlInstructorCourse != null ? ("<xmlInstructorCourse>" + Regex.Replace(iUtilService.XMLReplaceSpecialCharacter(d.xmlInstructorCourse), xmlSeparators, "") + "</xmlInstructorCourse>") : String.Empty) +
        (d.xmlInstructorRegular != null ? ("<xmlInstructorRegular>" + Regex.Replace(iUtilService.XMLReplaceSpecialCharacter(d.xmlInstructorRegular), xmlSeparators, "") + "</xmlInstructorRegular>") : String.Empty) +
        (d.xmlInstructorSpectial != null ? ("<xmlInstructorSpectial>" + Regex.Replace(iUtilService.XMLReplaceSpecialCharacter(d.xmlInstructorSpectial), xmlSeparators, "") + "</xmlInstructorSpectial>") : String.Empty) +
        (d.xmlCourseCreditStructure != null ? ("<xmlCourseCreditStructure>" + Regex.Replace(iUtilService.XMLReplaceSpecialCharacter(d.xmlCourseCreditStructure), xmlSeparators, "") + "</xmlCourseCreditStructure>") : String.Empty) +
        (d.xmlPlanOfStudy != null ? ("<xmlPlanOfStudy>" + Regex.Replace(iUtilService.XMLReplaceSpecialCharacter(d.xmlPlanOfStudy), xmlSeparators, "") + "</xmlPlanOfStudy>") : String.Empty) +
        (d.xmlCourseSubjectStructure != null ? ("<xmlCourseSubjectStructure>" + Regex.Replace(iUtilService.XMLReplaceSpecialCharacter(d.xmlCourseSubjectStructure), xmlSeparators, "") + "</xmlCourseSubjectStructure>") : String.Empty) +
        (d.xmlCharacter != null ? ("<xmlCharacter>" + Regex.Replace(iUtilService.XMLReplaceSpecialCharacter(d.xmlCharacter), xmlSeparators, "") + "</xmlCharacter>") : String.Empty) +
        (d.xmlCriteriaEvaluate != null ? ("<xmlCriteriaEvaluate>" + Regex.Replace(iUtilService.XMLReplaceSpecialCharacter(d.xmlCriteriaEvaluate), xmlSeparators, "") + "</xmlCriteriaEvaluate>") : String.Empty) +
        (d.xmlTeacherDevelop != null ? ("<xmlTeacherDevelop>" + Regex.Replace(iUtilService.XMLReplaceSpecialCharacter(d.xmlTeacherDevelop), xmlSeparators, "") + "</xmlTeacherDevelop>") : String.Empty) +
        (d.xmlQualityAssurance != null ? ("<xmlQualityAssurance>" + Regex.Replace(iUtilService.XMLReplaceSpecialCharacter(d.xmlQualityAssurance), xmlSeparators, "") + "</xmlQualityAssurance>") : String.Empty) +
        (d.xmlCourseImplement != null ? ("<xmlCourseImplement>" + Regex.Replace(iUtilService.XMLReplaceSpecialCharacter(d.xmlCourseImplement), xmlSeparators, "") + "</xmlCourseImplement>") : String.Empty) +
        (d.startYearKPI != null ? ("<startYearKPI>" + d.startYearKPI + "</startYearKPI>") : String.Empty) +
        (d.xmlIndicators != null ? ("<xmlIndicators>" + Regex.Replace(iUtilService.XMLReplaceSpecialCharacter(d.xmlIndicators), xmlSeparators, "") + "</xmlIndicators>") : String.Empty) +
        (d.cancelStatus != null ? ("<cancelStatus>" + d.cancelStatus + "</cancelStatus>") : String.Empty) +
        (d.verifyStatus != null ? ("<verifyStatus>" + d.verifyStatus + "</verifyStatus>") : String.Empty) +
        (d.notiAppointment != null ? ("<notiAppointment>" + d.notiAppointment + "</notiAppointment>") : String.Empty) +
        (d.notiDate != null ? ("<notiDate>" + d.notiDate + "</notiDate>") : String.Empty) +
        (d.verifyRemark != null ? ("<verifyRemark>" + d.verifyRemark + "</verifyRemark>") : String.Empty) +
        (d.transStatus != null ? ("<transStatus>" + d.transStatus + "</transStatus>") : String.Empty) +
        "</row>");
      }
            
      xmlUser.AppendFormat(
      "<row>" +
      "<username>{0}</username>" +
      "<ip>{1}</ip>" +
      "</row>",
      account.Username,
      iUtilService.GetIP());

      DataSet ds = iUtil.ExecuteCommandStoredProcedure(iUtil.infinityConnectionString, proc,
        new SqlParameter("@xmlData",    xmlData.ToString()),
        new SqlParameter("@xmlUser",    xmlUser.ToString()),
        new SqlParameter("@mode",       mode),
        new SqlParameter("@groupType",  groupType));

      return ds;
    }
  }
}