USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaTQFSetProgrammeTemp]    Script Date: 24/3/2564 12:11:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author		: <Author,,Name>
-- Create date	: <Create Date,,>
-- Description	: <Description,,>
-- =============================================

/*
dbcc checkident('[acaTQFProgrammeTemp]', reseed, 2)

declare @xmlData xml = '
<row>
<id></id>
<uId>U0001</uId>
<facultyId>EG-01</facultyId>
<programCode>EGEGB</programCode>
<majorId>EGCE-01</majorId>
<groupNum>1</groupNum>
<nameTh>วิศวกรรมศาสตรบัณฑิต (วิศวกรรมโยธา)</nameTh>
<nameEn>CIVIL ENGINEERING IN CIVIL ENGINEERING</nameEn>
<xmlISCED>
<row>
<id>0001</id>
<titleTh>AEOBIR00254</titleTh>
</row>
</xmlISCED>
</row>
'
declare @xmlUser xml = '
<row>
<username>thanakrit.tae</username>
<ip>10.43.4.3</ip>
</row>
'
declare @mode varchar(10) = 'add'
declare @groupType varchar(10) = 'academic'

[sp_acaTQFSetProgrammeTemp] @xmlData, @xmlUser, @mode, @groupType
*/

ALTER procedure [dbo].[sp_acaTQFSetProgrammeTemp]
(
	@xmlData xml,
	@xmlUser xml,
	@mode varchar(20),
	@groupType varchar(20)
)
as
begin
	begin try
		declare @tableType varchar(20)
		declare @id int
		declare @idTemp varchar(20)
		declare @programId varchar(15)
		declare @courseYear varchar(4)
		declare @programCode varchar(10)
		declare @majorCode varchar(10)
		declare @groupNum varchar(5)
		declare @xmlPLOs xml
		declare @username varchar(150)
		declare @ip varchar(100)
		declare @xmlNewData xml = (select @xmlData for xml path('table'))
		declare @docHandle int
		declare @action varchar(20)

		exec sp_xml_preparedocument @docHandle output, @xmlNewData

		select	*
		into	#tmpProg		
		from	openxml(@docHandle, '/table/row', 2)
		with (	
			[tableType] varchar(20),
			[id] int,
			[mode] varchar(10),
			[programId] varchar(15),
			[courseYear] varchar(4),
			[uId] varchar(5),
			[facultyId] varchar(10),
			[majorId] varchar(15),
			[programCode] varchar(10),
			[majorCode] varchar(10),
			[groupNum] varchar(5),
			[dLevel] varchar(5),
			[courseCredit] float,
			[nameTh] varchar(200),
			[nameEn] varchar(200),
			[abbrevTh] varchar(100),
			[abbrevEn] varchar(100),
			[degreeNameTh] varchar(200),
			[degreeNameEn] varchar(200),
			[degreeAbbrevTh] varchar(100),
			[degreeAbbrevEn] varchar(100),
			[studentNo] varchar(2),
			[address] varchar(255),
			[telephone] varchar(100),
			[eduSystem] tinyint,
			[studyYear] tinyint,
			[branchGroup] varchar(10),
			[programType] tinyint,
			[entryType] tinyint,
			[centerStudy] varchar(20),
			[joinIns] varchar(1),
			[startDate] datetime,
			[endDate] datetime,
			[startYear] varchar(4),
			[startSemester] tinyint,
			[endYear] varchar(4),
			[endSemester] tinyint,
			[MUA_ISCED] varchar(4),
			[MUA_CURR_ID] varchar(14),
			[schRefGroup_ICL] varchar(10),
			[countFlag] varchar(1),
			[iscedGroup] varchar(4),
			[transNo] int,
			[refPrevTransId] int,
			[activeStatus] varchar(1),
			[presentStatus] varchar(1),
			[xmlFaculty] xml,
			[xmlMajorSubject] xml,
			[xmlDepartment] xml,
			[xmlProgramType] xml,
			[xmlAdmissionType] xml,
			[xmlBranch] xml,
			[xmlISCED] xml,
			[xmlLanguages] xml,
			[xmlCooperationType] xml,
			[xmlCooperationPattern] xml,
			[xmlCooperationInitute] xml,
			[xmlGraduateType] xml,
			[xmlCourseManagement] xml,
			[xmlApprovedCourses] xml,
			[publishYear] varchar(4),
			[xmlCareer] xml,
			[xmlPlaceStudy] xml,
			[xmlExternalSituation] xml,
			[xmlImpactCurriculum] xml,
			[xmlRefOtherCourses] xml,
			[xmlInstructorResponsible] xml,
			[xmlProgramObjectives] xml,
			[xmlPLOs] xml,
			[xmlDevelopPlan] xml,
			[philosopyCourses] nvarchar(500),
			[docDate] datetime,
			[tqfYear] varchar(4),
			[xmlEduSystem] xml,
			[xmlEduStudyType] xml,
			[numSemester] tinyint,
			[isSummer] varchar(1),
			[compareCredit] nvarchar(500),
			[creditTransfer] nvarchar(500),
			[xmlDevMng] xml,
			[planYear] varchar(4),
			[xmlPlanQuantity] xml,
			[xmlCostEffective] xml,
			[xmlCostDebit] xml,
			[xmlCostCredit] xml,
			[xmlFirst2FacultyCode] xml,
			[xmlAfter2DepCode] xml,
			[xmlAfter2SubjectCode] xml,
			[xmlInstructorCourse] xml,
			[xmlInstructorRegular] xml,
			[xmlInstructorSpectial] xml,
			[xmlCourseCreditStructure] xml,
			[xmlPlanOfStudy] xml,
			[xmlCourseSubjectStructure] xml,
			[xmlCharacter] xml,
			[xmlCriteriaEvaluate] xml,
			[xmlTeacherDevelop] xml,
			[xmlQualityAssurance] xml,
			[xmlCourseImplement] xml,
			[startYearKPI] varchar(4),
			[xmlIndicators] xml,
			[cancelStatus] varchar(2),
			[cancelBy] varchar(50),
			[cancelDate] datetime,
			[createdBy] varchar(50),
			[createdDate] datetime,
			[verifyStatus] varchar(1),
			[verifyBy] varchar(50),
			[verifyDate] datetime,
			[notiAppointment] varchar(50),
			[notiDate] varchar(30),
			[verifyRemark] varchar(3000),
			[sendVerifyStatus] varchar(1),
			[sendVerifyBy] varchar(50),
			[sendVerifyDate] datetime,
			[transStatus] varchar(20) 
		)

		exec sp_xml_preparedocument @docHandle output, @xmlUser

		select	*
		into	#tmpUser
		from	openxml(@docHandle, '/row', 2)
		with (	
			username varchar(150),
			ip varchar(100)
		)
	
		exec sp_xml_removedocument @docHandle

		select	@username = username,
				@ip = ip
		from	#tmpUser

		if (@mode in ('add', 'edit', 'update'))
		begin
			select	@tableType = [tableType],
					@id = [id],
					@programId = [programId],
					@courseYear = [courseYear],
					@programCode = [programCode],
					@majorCode = [majorCode],
					@groupNum = [groupNum]
			from	#tmpProg

			if (@tableType = 'master' or @tableType = 'programPresent')
			begin
				set @action = @mode
				set @mode = 'add'
			end

			if (@tableType = 'temp')
			begin				
				if (len(isnull(@programId, '')) = 0)
				begin
					set @action = 'add'
					set @idTemp = (
						select	id
						from	acaTQFProgrammeTemp with (nolock)
						where	(id = @id) and
								(createdBy = @username)
					)
				
					if (len(isnull(@idTemp, '')) > 0)
						set @mode = 'edit'
					else
					begin
						set @mode = 'add'
						set @id = null
					end
				end

				if (len(isnull(@programId, '')) > 0)
				begin
					set @action = @mode
					set @idTemp = (
						select	id
						from	acaTQFProgrammeTemp with (nolock)
						where	(mode = @mode) and
								(programId = @programId) and
								(courseYear = @courseYear) and
								(programCode = @programCode) and
								(majorCode = @majorCode) and
								(groupNum = @groupNum) and
								(createdBy = @username)
					)
									
					if (len(isnull(@idTemp, '')) > 0)
						set @mode = @mode
					else
						set @mode = 'add'						
				end
			end

			if (@mode = 'add')
			begin
				if (@tableType = 'master' or @tableType = 'programPresent')
				begin
					insert acaTQFProgrammeTemp
					(
						[mode],
						[programId],
						[courseYear],
						[uId],
						[facultyId],
						[majorId],
						[programCode],
						[majorCode],
						[groupNum],
						[dLevel],
						[courseCredit],
						[nameTh],
						[nameEn],
						[abbrevTh],
						[abbrevEn],
						[degreeNameTh],
						[degreeNameEn],
						[degreeAbbrevTh],
						[degreeAbbrevEn],
						[studentNo],
						[address],
						[telephone],
						[eduSystem],
						[studyYear],
						[branchGroup],
						[programType],
						[entryType],
						[centerStudy],
						[joinIns],
						[startDate],
						[endDate],
						[startYear],
						[startSemester],
						[endYear],
						[endSemester],
						[MUA_ISCED],
						[MUA_CURR_ID],
						[schRefGroup_ICL],
						[countFlag],
						[iscedGroup],
						[transNo],
						[refPrevTransId],
						[activeStatus],
						[presentStatus],
						[xmlFaculty],
						[xmlMajorSubject],
						[xmlDepartment],
						[xmlProgramType],
						[xmlAdmissionType],
						[xmlBranch],
						[xmlISCED],
						[xmlLanguages],
						[xmlCooperationType],
						[xmlCooperationPattern],
						[xmlCooperationInitute],
						[xmlGraduateType],
						[xmlCourseManagement],
						[xmlApprovedCourses],
						[publishYear],
						[xmlCareer],
						[xmlPlaceStudy],
						[xmlExternalSituation],
						[xmlImpactCurriculum],
						[xmlRefOtherCourses],
						[xmlInstructorResponsible],
						[xmlProgramObjectives],
						[xmlPLOs],
						[xmlDevelopPlan],
						[philosopyCourses],
						[docDate],
						[tqfYear],
						[xmlEduSystem],
						[xmlEduStudyType],
						[numSemester],
						[isSummer],
						[compareCredit],
						[creditTransfer],
						[xmlDevMng],
						[planYear],
						[xmlPlanQuantity],
						[xmlCostEffective],
						[xmlCostDebit],
						[xmlCostCredit],
						[xmlFirst2FacultyCode],
						[xmlAfter2DepCode],
						[xmlAfter2SubjectCode],
						[xmlInstructorCourse],
						[xmlInstructorRegular],
						[xmlInstructorSpectial],
						[xmlCourseCreditStructure],
						[xmlPlanOfStudy],
						[xmlCourseSubjectStructure],
						[xmlCharacter],
						[xmlCriteriaEvaluate],
						[xmlTeacherDevelop],
						[xmlQualityAssurance],
						[xmlCourseImplement],
						[startYearKPI],
						[xmlIndicators],
						[transStatus],
						[createdBy],
						[createdDate],
						[verifyStatus],
						[verifyBy],
						[verifyDate],
						[notiAppointment],
						[notiDate],
						[verifyRemark],
						[sendVerifyStatus],
						[sendVerifyBy],
						[sendVerifyDate]
					)
					select	@action,
							dbo.fnc_utilStringCompare(isnull(programId, ''), '', programId, null),
							dbo.fnc_utilStringCompare(isnull(courseYear, ''), '', courseYear, null),
							dbo.fnc_utilStringCompare(isnull(uId, ''), '', uId, null),
							dbo.fnc_utilStringCompare(isnull(facultyId, ''), '', facultyId, null),
							dbo.fnc_utilStringCompare(isnull(majorId, ''), '', majorId, null),
							dbo.fnc_utilStringCompare(isnull(programCode, ''), '', programCode, null),
							(case when dbo.fnc_utilStringCompare(isnull(majorCode, ''), '', majorCode, '-') is not null then majorCode else '-' end),
							(case when dbo.fnc_utilStringCompare(isnull(groupNum, ''), '', groupNum, '0') is not null then groupNum else '0' end),
							dbo.fnc_utilStringCompare(isnull(dLevel, ''), '', dLevel, null),
							dbo.fnc_utilStringCompare(isnull(courseCredit, ''), '', courseCredit, null),
							dbo.fnc_utilStringCompare(isnull(nameTh, ''), '', nameTh, null),
							dbo.fnc_utilStringCompare(isnull(nameEn, ''), '', nameEn, null),
							dbo.fnc_utilStringCompare(isnull(abbrevTh, ''), '', abbrevTh, null),
							dbo.fnc_utilStringCompare(isnull(abbrevEn, ''), '', abbrevEn, null),
							dbo.fnc_utilStringCompare(isnull(degreeNameTh, ''), '', degreeNameTh, null),
							dbo.fnc_utilStringCompare(isnull(degreeNameEn, ''), '', degreeNameEn, null),
							dbo.fnc_utilStringCompare(isnull(degreeAbbrevTh, ''), '', degreeAbbrevTh, null),
							dbo.fnc_utilStringCompare(isnull(degreeAbbrevEn, ''), '', degreeAbbrevEn, null),
							dbo.fnc_utilStringCompare(isnull(studentNo, ''), '', studentNo, null),
							dbo.fnc_utilStringCompare(isnull(address, ''), '', address, null),
							dbo.fnc_utilStringCompare(isnull(telephone, ''), '', telephone, null),
							dbo.fnc_utilStringCompare(isnull(eduSystem, ''), '', eduSystem, null),
							dbo.fnc_utilStringCompare(isnull(studyYear, ''), '', studyYear, null),
							dbo.fnc_utilStringCompare(isnull(branchGroup, ''), '', branchGroup, null),
							dbo.fnc_utilStringCompare(isnull(programType, ''), '', programType, null),
							dbo.fnc_utilStringCompare(isnull(entryType, ''), '', entryType, null),
							dbo.fnc_utilStringCompare(isnull(centerStudy, ''), '', centerStudy, null),
							dbo.fnc_utilStringCompare(isnull(joinIns, ''), '', joinIns, null),
							dbo.fnc_utilDateTimeCompare(isnull(convert(datetime, startDate, 103), ''), '', convert(datetime, startDate, 103), null),
							dbo.fnc_utilDateTimeCompare(isnull(convert(datetime, endDate, 103), ''), '', convert(datetime, endDate, 103), null),
							dbo.fnc_utilStringCompare(isnull(startYear, ''), '', startYear, null),
							dbo.fnc_utilStringCompare(isnull(startSemester, ''), '', startSemester, null),
							dbo.fnc_utilStringCompare(isnull(endYear, ''), '', endYear, null),
							dbo.fnc_utilStringCompare(isnull(endSemester, ''), '', endSemester, null),
							dbo.fnc_utilStringCompare(isnull(MUA_ISCED, ''), '', MUA_ISCED, null),
							dbo.fnc_utilStringCompare(isnull(MUA_CURR_ID, ''), '', MUA_CURR_ID, null),
							dbo.fnc_utilStringCompare(isnull(schRefGroup_ICL, ''), '', schRefGroup_ICL, null),
							dbo.fnc_utilStringCompare(isnull(countFlag, ''), '', countFlag, null),
							dbo.fnc_utilStringCompare(isnull(iscedGroup, ''), '', iscedGroup, null),
							dbo.fnc_utilStringCompare(isnull(transNo, ''), '', transNo, null),
							dbo.fnc_utilStringCompare(isnull(refPrevTransId, ''), '', refPrevTransId, null),
							dbo.fnc_utilStringCompare(isnull(activeStatus, ''), '', activeStatus, null),
							--dbo.fnc_utilStringCompare(isnull(presentStatus, ''), '', presentStatus, null),
							'N',
							dbo.fnc_utilXMLCompare(isnull(xmlFaculty, ''), xmlFaculty, null),
							dbo.fnc_utilXMLCompare(isnull(xmlMajorSubject, ''), xmlMajorSubject, null),
							dbo.fnc_utilXMLCompare(isnull(xmlDepartment, ''), xmlDepartment, null),
							dbo.fnc_utilXMLCompare(isnull(xmlProgramType, ''), xmlProgramType, null),
							dbo.fnc_utilXMLCompare(isnull(xmlAdmissionType, ''), xmlAdmissionType, null),
							dbo.fnc_utilXMLCompare(isnull(xmlBranch, ''), xmlBranch, null),
							dbo.fnc_utilXMLCompare(isnull(xmlISCED, ''), xmlISCED, null),
							dbo.fnc_utilXMLCompare(isnull(xmlLanguages, ''), xmlLanguages, null),
							dbo.fnc_utilXMLCompare(isnull(xmlCooperationType, ''), xmlCooperationType, null),
							dbo.fnc_utilXMLCompare(isnull(xmlCooperationPattern, ''), xmlCooperationPattern, null),
							dbo.fnc_utilXMLCompare(isnull(xmlCooperationInitute, ''), xmlCooperationInitute, null),
							dbo.fnc_utilXMLCompare(isnull(xmlGraduateType, ''), xmlGraduateType, null),
							dbo.fnc_utilXMLCompare(isnull(xmlCourseManagement, ''), xmlCourseManagement, null),
							dbo.fnc_utilXMLCompare(isnull(xmlApprovedCourses, ''), xmlApprovedCourses, null),
							dbo.fnc_utilStringCompare(isnull(publishYear, ''), '', publishYear, null),
							dbo.fnc_utilXMLCompare(isnull(xmlCareer, ''), xmlCareer, null),
							dbo.fnc_utilXMLCompare(isnull(xmlPlaceStudy, ''), xmlPlaceStudy, null),
							dbo.fnc_utilXMLCompare(isnull(xmlExternalSituation, ''), xmlExternalSituation, null),
							dbo.fnc_utilXMLCompare(isnull(xmlImpactCurriculum, ''), xmlImpactCurriculum, null),
							dbo.fnc_utilXMLCompare(isnull(xmlRefOtherCourses, ''), xmlRefOtherCourses, null),
							dbo.fnc_utilXMLCompare(isnull(xmlInstructorResponsible, ''), xmlInstructorResponsible, null),
							dbo.fnc_utilXMLCompare(isnull(xmlProgramObjectives, ''), xmlProgramObjectives, null),
							dbo.fnc_utilXMLCompare(isnull(xmlPLOs, ''), xmlPLOs, null),
							dbo.fnc_utilXMLCompare(isnull(xmlDevelopPlan, ''), xmlDevelopPlan, null),
							dbo.fnc_utilStringCompare(isnull(philosopyCourses, ''), '', philosopyCourses, null),
							dbo.fnc_utilDateTimeCompare(isnull(convert(datetime, docDate, 103), ''), '', convert(datetime, docDate, 103), null),
							dbo.fnc_utilStringCompare(isnull(tqfYear, ''), '', tqfYear, null),
							dbo.fnc_utilXMLCompare(isnull(xmlEduSystem, ''), xmlEduSystem, null),
							dbo.fnc_utilXMLCompare(isnull(xmlEduStudyType, ''), xmlEduStudyType, null),
							dbo.fnc_utilStringCompare(isnull(numSemester, ''), '', numSemester, null),
							dbo.fnc_utilStringCompare(isnull(isSummer, ''), '', isSummer, null),
							dbo.fnc_utilStringCompare(isnull(compareCredit, ''), '', compareCredit, null),
							dbo.fnc_utilStringCompare(isnull(creditTransfer, ''), '', creditTransfer, null),
							dbo.fnc_utilXMLCompare(isnull(xmlDevMng, ''), xmlDevMng, null),
							dbo.fnc_utilStringCompare(isnull(planYear, ''), '', planYear, null),
							dbo.fnc_utilXMLCompare(isnull(xmlPlanQuantity, ''), xmlPlanQuantity, null),
							dbo.fnc_utilXMLCompare(isnull(xmlCostEffective, ''), xmlCostEffective, null),
							dbo.fnc_utilXMLCompare(isnull(xmlCostDebit, ''), xmlCostDebit, null),
							dbo.fnc_utilXMLCompare(isnull(xmlCostCredit, ''), xmlCostCredit, null),
							dbo.fnc_utilXMLCompare(isnull(xmlFirst2FacultyCode, ''), xmlFirst2FacultyCode, null),
							dbo.fnc_utilXMLCompare(isnull(xmlAfter2DepCode, ''), xmlAfter2DepCode, null),
							dbo.fnc_utilXMLCompare(isnull(xmlAfter2SubjectCode, ''), xmlAfter2SubjectCode, null),
							dbo.fnc_utilXMLCompare(isnull(xmlInstructorCourse, ''), xmlInstructorCourse, null),
							dbo.fnc_utilXMLCompare(isnull(xmlInstructorRegular, ''), xmlInstructorRegular, null),
							dbo.fnc_utilXMLCompare(isnull(xmlInstructorSpectial, ''), xmlInstructorSpectial, null),
							dbo.fnc_utilXMLCompare(isnull(xmlCourseCreditStructure, ''), xmlCourseCreditStructure, null),
							dbo.fnc_utilXMLCompare(isnull(xmlPlanOfStudy, ''), xmlPlanOfStudy, null),
							dbo.fnc_utilXMLCompare(isnull(xmlCourseSubjectStructure, ''), xmlCourseSubjectStructure, null),
							dbo.fnc_utilXMLCompare(isnull(xmlCharacter, ''), xmlCharacter, null),
							dbo.fnc_utilXMLCompare(isnull(xmlCriteriaEvaluate, ''), xmlCriteriaEvaluate, null),
							dbo.fnc_utilXMLCompare(isnull(xmlTeacherDevelop, ''), xmlTeacherDevelop, null),
							dbo.fnc_utilXMLCompare(isnull(xmlQualityAssurance, ''), xmlQualityAssurance, null),
							dbo.fnc_utilXMLCompare(isnull(xmlCourseImplement, ''), xmlCourseImplement, null),
							dbo.fnc_utilStringCompare(isnull(startYearKPI, ''), '', startYearKPI, null),
							dbo.fnc_utilXMLCompare(isnull(xmlIndicators, ''), xmlIndicators, null),
							null,
							@username,
							getdate(),
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null
					from	acaTQFProgramme
					where	(id = @id) and 
							(cancelStatus is null)
				end

				if (@tableType = 'temp')
				begin
					if (isnull(@id, 0) = 0)
					begin					
						insert acaTQFProgrammeTemp 
						(
							[mode],
							[programId],
							[courseYear],
							[uId],
							[facultyId],
							[majorId],
							[programCode],
							[majorCode],
							[groupNum],
							[dLevel]
						)
						select	@action,
								null,
								[courseYear],
								[uId],
								[facultyId],
								null,
								[programCode],
								'-',
								'0',
								[dLevel]
						from	#tmpProg
					end

					if (isnull(@id, 0) > 0)
					begin
						insert acaTQFProgrammeTemp
						(
							[mode],
							[programId],
							[courseYear],
							[uId],
							[facultyId],
							[majorId],
							[programCode],
							[majorCode],
							[groupNum],
							[dLevel],
							[courseCredit],
							[nameTh],
							[nameEn],
							[abbrevTh],
							[abbrevEn],
							[degreeNameTh],
							[degreeNameEn],
							[degreeAbbrevTh],
							[degreeAbbrevEn],
							[studentNo],
							[address],
							[telephone],
							[eduSystem],
							[studyYear],
							[branchGroup],
							[programType],
							[entryType],
							[centerStudy],
							[joinIns],
							[startDate],
							[endDate],
							[startYear],
							[startSemester],
							[endYear],
							[endSemester],
							[MUA_ISCED],
							[MUA_CURR_ID],
							[schRefGroup_ICL],
							[countFlag],
							[iscedGroup],
							[transNo],
							[refPrevTransId],
							[activeStatus],
							[presentStatus],
							[xmlFaculty],
							[xmlMajorSubject],
							[xmlDepartment],
							[xmlProgramType],
							[xmlAdmissionType],
							[xmlBranch],
							[xmlISCED],
							[xmlLanguages],
							[xmlCooperationType],
							[xmlCooperationPattern],
							[xmlCooperationInitute],
							[xmlGraduateType],
							[xmlCourseManagement],
							[xmlApprovedCourses],
							[publishYear],
							[xmlCareer],
							[xmlPlaceStudy],
							[xmlExternalSituation],
							[xmlImpactCurriculum],
							[xmlRefOtherCourses],
							[xmlInstructorResponsible],
							[xmlProgramObjectives],
							[xmlPLOs],
							[xmlDevelopPlan],
							[philosopyCourses],
							[docDate],
							[tqfYear],
							[xmlEduSystem],
							[xmlEduStudyType],
							[numSemester],
							[isSummer],
							[compareCredit],
							[creditTransfer],
							[xmlDevMng],
							[planYear],
							[xmlPlanQuantity],
							[xmlCostEffective],
							[xmlCostDebit],
							[xmlCostCredit],
							[xmlFirst2FacultyCode],
							[xmlAfter2DepCode],
							[xmlAfter2SubjectCode],
							[xmlInstructorCourse],
							[xmlInstructorRegular],
							[xmlInstructorSpectial],
							[xmlCourseCreditStructure],
							[xmlPlanOfStudy],
							[xmlCourseSubjectStructure],
							[xmlCharacter],
							[xmlCriteriaEvaluate],
							[xmlTeacherDevelop],
							[xmlQualityAssurance],
							[xmlCourseImplement],
							[startYearKPI],
							[xmlIndicators],
							[transStatus],
							[createdBy],
							[createdDate],
							[verifyStatus],
							[verifyBy],
							[verifyDate],
							[notiAppointment],
							[notiDate],
							[verifyRemark],
							[sendVerifyStatus],
							[sendVerifyBy],
							[sendVerifyDate]
						)
						select	mode,
								programId,
								courseYear,
								uId,
								facultyId,
								majorId,
								programCode,
								majorCode,
								groupNum,
								dLevel,
								courseCredit,
								nameTh,
								nameEn,
								abbrevTh,
								abbrevEn,
								degreeNameTh,
								degreeNameEn,
								degreeAbbrevTh,
								degreeAbbrevEn,
								studentNo,
								address,
								telephone,
								eduSystem,
								studyYear,
								branchGroup,
								programType,
								entryType,
								centerStudy,
								joinIns,
								startDate,
								endDate,
								startYear,
								startSemester,
								endYear,
								endSemester,
								MUA_ISCED,
								MUA_CURR_ID,
								schRefGroup_ICL,
								countFlag,
								iscedGroup,
								transNo,
								refPrevTransId,
								activeStatus,
								--presentStatus,
								'N',
								xmlFaculty,
								xmlMajorSubject,
								xmlDepartment,
								xmlProgramType,
								xmlAdmissionType,
								xmlBranch,
								xmlISCED,
								xmlLanguages,
								xmlCooperationType,
								xmlCooperationPattern,
								xmlCooperationInitute,
								xmlGraduateType,
								xmlCourseManagement,
								xmlApprovedCourses,
								publishYear,
								xmlCareer,
								xmlPlaceStudy,
								xmlExternalSituation,
								xmlImpactCurriculum,
								xmlRefOtherCourses,
								xmlInstructorResponsible,
								xmlProgramObjectives,
								xmlPLOs,
								xmlDevelopPlan,
								philosopyCourses,
								docDate,
								tqfYear,
								xmlEduSystem,
								xmlEduStudyType,
								numSemester,
								isSummer,
								compareCredit,
								creditTransfer,
								xmlDevMng,
								planYear,
								xmlPlanQuantity,
								xmlCostEffective,
								xmlCostDebit,
								xmlCostCredit,
								xmlFirst2FacultyCode,
								xmlAfter2DepCode,
								xmlAfter2SubjectCode,
								xmlInstructorCourse,
								xmlInstructorRegular,
								xmlInstructorSpectial,
								xmlCourseCreditStructure,
								xmlPlanOfStudy,
								xmlCourseSubjectStructure,
								xmlCharacter,
								xmlCriteriaEvaluate,
								xmlTeacherDevelop,
								xmlQualityAssurance,
								xmlCourseImplement,
								startYearKPI,
								xmlIndicators,
								null,
								@username,
								getdate(),
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null	
						from	acaTQFProgrammeTemp
						where	(id = @id)
					end
				end				

				set @id = ident_current('acaTQFProgrammeTemp')
				set @idTemp = @id

				update #tmpProg set
					[id] = @id
			end
			
			update acaTQFProgrammeTemp set
				[mode]						= @action,
				[courseYear]				= dbo.fnc_utilStringCompare(isnull(b.courseYear, a.courseYear), isnull(a.courseYear, ''), b.courseYear, a.courseYear),
				[majorId]					= dbo.fnc_utilStringCompare(isnull(b.majorId, a.majorId), isnull(a.majorId, ''), b.majorId, a.majorId),
				[programCode]				= dbo.fnc_utilStringCompare(isnull(b.programCode, a.programCode), isnull(a.programCode, ''), b.programCode, a.programCode),
				[majorCode]					= (case when dbo.fnc_utilStringCompare(isnull(b.majorCode, a.majorCode), isnull(a.majorCode, ''), b.majorCode, a.majorCode) is not null then isnull(b.majorCode, a.majorCode) else '-' end),
				[groupNum]					= (case when dbo.fnc_utilStringCompare(isnull(b.groupNum, a.groupNum), isnull(a.groupNum, ''), b.groupNum, a.groupNum) is not null then isnull(b.groupNum, a.groupNum) else '0' end),
				[courseCredit]				= dbo.fnc_utilStringCompare(isnull(b.courseCredit, a.courseCredit), isnull(a.courseCredit, ''), b.courseCredit, a.courseCredit),
				[nameTh]					= dbo.fnc_utilStringCompare(isnull(b.nameTh, a.nameTh), isnull(a.nameTh, ''), b.nameTh, a.nameTh),
				[nameEn]					= dbo.fnc_utilStringCompare(isnull(b.nameEn, a.nameEn), isnull(a.nameEn, ''), b.nameEn, a.nameEn),
				[abbrevTh]					= dbo.fnc_utilStringCompare(isnull(b.abbrevTh, a.abbrevTh), isnull(a.abbrevTh, ''), b.abbrevTh, a.abbrevTh),
				[abbrevEn]					= dbo.fnc_utilStringCompare(isnull(b.abbrevEn, a.abbrevEn), isnull(a.abbrevEn, ''), b.abbrevEn, a.abbrevEn),
				[degreeNameTh]				= dbo.fnc_utilStringCompare(isnull(b.degreeNameTh, a.degreeNameTh), isnull(a.degreeNameTh, ''), b.degreeNameTh, a.degreeNameTh),
				[degreeNameEn]				= dbo.fnc_utilStringCompare(isnull(b.degreeNameEn, a.degreeNameEn), isnull(a.degreeNameEn, ''), b.degreeNameEn, a.degreeNameEn),
				[degreeAbbrevTh]			= dbo.fnc_utilStringCompare(isnull(b.degreeAbbrevTh, a.degreeAbbrevTh), isnull(a.degreeAbbrevTh, ''), b.degreeAbbrevTh, a.degreeAbbrevTh),
				[degreeAbbrevEn]			= dbo.fnc_utilStringCompare(isnull(b.degreeAbbrevEn, a.degreeAbbrevEn), isnull(a.degreeAbbrevEn, ''), b.degreeAbbrevEn, a.degreeAbbrevEn),
				[studentNo]					= dbo.fnc_utilStringCompare(isnull(b.studentNo, a.studentNo), isnull(a.studentNo, ''), b.studentNo, a.studentNo),
				[address]					= dbo.fnc_utilStringCompare(isnull(b.[address], a.[address]), isnull(a.[address], ''), b.[address], a.[address]),
				[telephone]					= dbo.fnc_utilStringCompare(isnull(b.telephone, a.telephone), isnull(a.telephone, ''), b.telephone, a.telephone),
				[eduSystem]					= dbo.fnc_utilStringCompare(isnull(b.eduSystem, a.eduSystem), isnull(a.eduSystem, ''), b.eduSystem, a.eduSystem),
				[studyYear]					= dbo.fnc_utilStringCompare(isnull(b.studyYear, a.studyYear), isnull(a.studyYear, ''), b.studyYear, a.studyYear),
				[branchGroup]				= dbo.fnc_utilStringCompare(isnull(b.branchGroup, a.branchGroup), isnull(a.branchGroup, ''), b.branchGroup, a.branchGroup),
				[programType]				= dbo.fnc_utilStringCompare(isnull(b.programType, a.programType), isnull(a.programType, ''), b.programType, a.programType),
				[entryType]					= dbo.fnc_utilStringCompare(isnull(b.entryType, a.entryType), isnull(a.entryType, ''), b.entryType, a.entryType),
				[centerStudy]				= dbo.fnc_utilStringCompare(isnull(b.centerStudy, a.centerStudy), isnull(a.centerStudy, ''), b.centerStudy, a.centerStudy),
				[joinIns]					= dbo.fnc_utilStringCompare(isnull(b.joinIns, a.joinIns), isnull(a.joinIns, ''), b.joinIns, a.joinIns),
				[startDate]					= dbo.fnc_utilDateTimeCompare(isnull(convert(datetime, b.startDate, 103), a.startDate), isnull(a.startDate, ''), convert(datetime, b.startDate, 103), a.startDate),
				[endDate]					= dbo.fnc_utilDateTimeCompare(isnull(convert(datetime, b.endDate, 103), a.endDate), isnull(a.endDate, ''), convert(datetime, b.endDate, 103), a.endDate),
				[startYear]					= dbo.fnc_utilStringCompare(isnull(b.startYear, a.startYear), isnull(a.startYear, ''), b.startYear, a.startYear),
				[startSemester]				= dbo.fnc_utilStringCompare(isnull(b.startSemester, a.startSemester), isnull(a.startSemester, ''), b.startSemester, a.startSemester),
				[endYear]					= dbo.fnc_utilStringCompare(isnull(b.endYear, a.endYear), isnull(a.endYear, ''), b.endYear, a.endYear),
				[endSemester]				= dbo.fnc_utilStringCompare(isnull(b.endSemester, a.endSemester), isnull(a.endSemester, ''), b.endSemester, a.endSemester),
				[countFlag]					= dbo.fnc_utilStringCompare(isnull(b.countFlag, a.countFlag), isnull(a.countFlag, ''), b.countFlag, a.countFlag),
				[iscedGroup]				= dbo.fnc_utilStringCompare(isnull(b.iscedGroup, a.iscedGroup), isnull(a.iscedGroup, ''), b.iscedGroup, a.iscedGroup),
				[activeStatus]				= dbo.fnc_utilStringCompare(isnull(b.activeStatus, a.activeStatus), isnull(a.activeStatus, ''), b.activeStatus, a.activeStatus),
				[xmlFaculty]				= dbo.fnc_utilXMLCompare(isnull(dbo.fnc_utilXMLCompare(b.xmlFaculty, b.xmlFaculty, a.xmlFaculty), ''), dbo.fnc_utilXMLCompare(b.xmlFaculty, b.xmlFaculty, a.xmlFaculty), a.xmlFaculty),
				[xmlMajorSubject]			= dbo.fnc_utilXMLCompare(isnull(dbo.fnc_utilXMLCompare(b.xmlMajorSubject, b.xmlMajorSubject, a.xmlMajorSubject), ''), dbo.fnc_utilXMLCompare(b.xmlMajorSubject, b.xmlMajorSubject, a.xmlMajorSubject), a.xmlMajorSubject),
				[xmlDepartment]				= dbo.fnc_utilXMLCompare(isnull(dbo.fnc_utilXMLCompare(b.xmlDepartment, b.xmlDepartment, a.xmlDepartment), ''), dbo.fnc_utilXMLCompare(b.xmlDepartment, b.xmlDepartment, a.xmlDepartment), a.xmlDepartment),
				[xmlProgramType]			= dbo.fnc_utilXMLCompare(isnull(dbo.fnc_utilXMLCompare(b.xmlProgramType, b.xmlProgramType, a.xmlProgramType), ''), dbo.fnc_utilXMLCompare(b.xmlProgramType, b.xmlProgramType, a.xmlProgramType), a.xmlProgramType),
				[xmlAdmissionType]			= dbo.fnc_utilXMLCompare(isnull(dbo.fnc_utilXMLCompare(b.xmlAdmissionType, b.xmlAdmissionType, a.xmlAdmissionType), ''), dbo.fnc_utilXMLCompare(b.xmlAdmissionType, b.xmlAdmissionType, a.xmlAdmissionType), a.xmlAdmissionType),
				[xmlBranch]					= dbo.fnc_utilXMLCompare(isnull(dbo.fnc_utilXMLCompare(b.xmlBranch, b.xmlBranch, a.xmlBranch), ''), dbo.fnc_utilXMLCompare(b.xmlBranch, b.xmlBranch, a.xmlBranch), a.xmlBranch),
				[xmlISCED]					= dbo.fnc_utilXMLCompare(isnull(dbo.fnc_utilXMLCompare(b.xmlISCED, b.xmlISCED, a.xmlISCED), ''), dbo.fnc_utilXMLCompare(b.xmlISCED, b.xmlISCED, a.xmlISCED), a.xmlISCED),
				[xmlLanguages]				= dbo.fnc_utilXMLCompare(isnull(dbo.fnc_utilXMLCompare(b.xmlLanguages, b.xmlLanguages, a.xmlLanguages), ''), dbo.fnc_utilXMLCompare(b.xmlLanguages, b.xmlLanguages, a.xmlLanguages), a.xmlLanguages),
				[xmlCooperationType]		= dbo.fnc_utilXMLCompare(isnull(dbo.fnc_utilXMLCompare(b.xmlCooperationType, b.xmlCooperationType, a.xmlCooperationType), ''), dbo.fnc_utilXMLCompare(b.xmlCooperationType, b.xmlCooperationType, a.xmlCooperationType), a.xmlCooperationType),
				[xmlCooperationPattern]		= dbo.fnc_utilXMLCompare(isnull(dbo.fnc_utilXMLCompare(b.xmlCooperationPattern, b.xmlCooperationPattern, a.xmlCooperationPattern), ''), dbo.fnc_utilXMLCompare(b.xmlCooperationPattern, b.xmlCooperationPattern, a.xmlCooperationPattern), a.xmlCooperationPattern),
				[xmlCooperationInitute]		= dbo.fnc_utilXMLCompare(isnull(dbo.fnc_utilXMLCompare(b.xmlCooperationInitute, b.xmlCooperationInitute, a.xmlCooperationInitute), ''), dbo.fnc_utilXMLCompare(b.xmlCooperationInitute, b.xmlCooperationInitute, a.xmlCooperationInitute), a.xmlCooperationInitute),
				[xmlGraduateType]			= dbo.fnc_utilXMLCompare(isnull(dbo.fnc_utilXMLCompare(b.xmlGraduateType, b.xmlGraduateType, a.xmlGraduateType), ''), dbo.fnc_utilXMLCompare(b.xmlGraduateType, b.xmlGraduateType, a.xmlGraduateType), a.xmlGraduateType),
				[xmlCourseManagement]		= dbo.fnc_utilXMLCompare(isnull(dbo.fnc_utilXMLCompare(b.xmlCourseManagement, b.xmlCourseManagement, a.xmlCourseManagement), ''), dbo.fnc_utilXMLCompare(b.xmlCourseManagement, b.xmlCourseManagement, a.xmlCourseManagement), a.xmlCourseManagement),
				[xmlApprovedCourses]		= dbo.fnc_utilXMLCompare(isnull(dbo.fnc_utilXMLCompare(b.xmlApprovedCourses, b.xmlApprovedCourses, a.xmlApprovedCourses), ''), dbo.fnc_utilXMLCompare(b.xmlApprovedCourses, b.xmlApprovedCourses, a.xmlApprovedCourses), a.xmlApprovedCourses),
				[publishYear]				= dbo.fnc_utilStringCompare(isnull(b.publishYear, a.publishYear), isnull(a.publishYear, ''), b.publishYear, a.publishYear),
				[xmlCareer]					= dbo.fnc_utilXMLCompare(isnull(dbo.fnc_utilXMLCompare(b.xmlCareer, b.xmlCareer, a.xmlCareer), ''), dbo.fnc_utilXMLCompare(b.xmlCareer, b.xmlCareer, a.xmlCareer), a.xmlCareer),
				[xmlPlaceStudy]				= dbo.fnc_utilXMLCompare(isnull(dbo.fnc_utilXMLCompare(b.xmlPlaceStudy, b.xmlPlaceStudy, a.xmlPlaceStudy), ''), dbo.fnc_utilXMLCompare(b.xmlPlaceStudy, b.xmlPlaceStudy, a.xmlPlaceStudy), a.xmlPlaceStudy),
				[xmlExternalSituation]		= dbo.fnc_utilXMLCompare(isnull(dbo.fnc_utilXMLCompare(b.xmlExternalSituation, b.xmlExternalSituation, a.xmlExternalSituation), ''), dbo.fnc_utilXMLCompare(b.xmlExternalSituation, b.xmlExternalSituation, a.xmlExternalSituation), a.xmlExternalSituation),
				[xmlImpactCurriculum]		= dbo.fnc_utilXMLCompare(isnull(dbo.fnc_utilXMLCompare(b.xmlImpactCurriculum, b.xmlImpactCurriculum, a.xmlImpactCurriculum), ''), dbo.fnc_utilXMLCompare(b.xmlImpactCurriculum, b.xmlImpactCurriculum, a.xmlImpactCurriculum), a.xmlImpactCurriculum),
				[xmlRefOtherCourses]		= dbo.fnc_utilXMLCompare(isnull(dbo.fnc_utilXMLCompare(b.xmlRefOtherCourses, b.xmlRefOtherCourses, a.xmlRefOtherCourses), ''), dbo.fnc_utilXMLCompare(b.xmlRefOtherCourses, b.xmlRefOtherCourses, a.xmlRefOtherCourses), a.xmlRefOtherCourses),
				[xmlInstructorResponsible]	= dbo.fnc_utilXMLCompare(isnull(dbo.fnc_utilXMLCompare(b.xmlInstructorResponsible, b.xmlInstructorResponsible, a.xmlInstructorResponsible), ''), dbo.fnc_utilXMLCompare(b.xmlInstructorResponsible, b.xmlInstructorResponsible, a.xmlInstructorResponsible), a.xmlInstructorResponsible),
				[xmlProgramObjectives]		= dbo.fnc_utilXMLCompare(isnull(dbo.fnc_utilXMLCompare(b.xmlProgramObjectives, b.xmlProgramObjectives, a.xmlProgramObjectives), ''), dbo.fnc_utilXMLCompare(b.xmlProgramObjectives, b.xmlProgramObjectives, a.xmlProgramObjectives), a.xmlProgramObjectives),
				[xmlPLOs]					= dbo.fnc_utilXMLCompare(isnull(dbo.fnc_utilXMLCompare(b.xmlPLOs, b.xmlPLOs, a.xmlPLOs), ''), dbo.fnc_utilXMLCompare(b.xmlPLOs, b.xmlPLOs, a.xmlPLOs), a.xmlPLOs),
				[xmlDevelopPlan]			= dbo.fnc_utilXMLCompare(isnull(dbo.fnc_utilXMLCompare(b.xmlDevelopPlan, b.xmlDevelopPlan, a.xmlDevelopPlan), ''), dbo.fnc_utilXMLCompare(b.xmlDevelopPlan, b.xmlDevelopPlan, a.xmlDevelopPlan), a.xmlDevelopPlan),
				[philosopyCourses]			= dbo.fnc_utilStringCompare(isnull(b.philosopyCourses, a.philosopyCourses), isnull(a.philosopyCourses, ''), b.philosopyCourses, a.philosopyCourses),
				[docDate]					= dbo.fnc_utilDateTimeCompare(isnull(convert(datetime, b.docDate, 103), a.docDate), isnull(a.docDate, ''), convert(datetime, b.docDate, 103), a.docDate),
				[tqfYear]					= dbo.fnc_utilStringCompare(isnull(b.tqfYear, a.tqfYear), isnull(a.tqfYear, ''), b.tqfYear, a.tqfYear),
				[xmlEduSystem]				= dbo.fnc_utilXMLCompare(isnull(dbo.fnc_utilXMLCompare(b.xmlEduSystem, b.xmlEduSystem, a.xmlEduSystem), ''), dbo.fnc_utilXMLCompare(b.xmlEduSystem, b.xmlEduSystem, a.xmlEduSystem), a.xmlEduSystem),
				[xmlEduStudyType]			= dbo.fnc_utilXMLCompare(isnull(dbo.fnc_utilXMLCompare(b.xmlEduStudyType, b.xmlEduStudyType, a.xmlEduStudyType), ''), dbo.fnc_utilXMLCompare(b.xmlEduStudyType, b.xmlEduStudyType, a.xmlEduStudyType), a.xmlEduStudyType),
				[numSemester]				= dbo.fnc_utilStringCompare(isnull(b.numSemester, a.numSemester), isnull(a.numSemester, ''), b.numSemester, a.numSemester),
				[isSummer]					= dbo.fnc_utilStringCompare(isnull(b.isSummer, a.isSummer), isnull(a.isSummer, ''), b.isSummer, a.isSummer),
				[compareCredit]				= dbo.fnc_utilStringCompare(isnull(b.compareCredit, a.compareCredit), isnull(a.compareCredit, ''), b.compareCredit, a.compareCredit),
				[creditTransfer]			= dbo.fnc_utilStringCompare(isnull(b.creditTransfer, a.creditTransfer), isnull(a.creditTransfer, ''), b.creditTransfer, a.creditTransfer),
				[xmlDevMng]					= dbo.fnc_utilXMLCompare(isnull(dbo.fnc_utilXMLCompare(b.xmlDevMng, b.xmlDevMng, a.xmlDevMng), ''), dbo.fnc_utilXMLCompare(b.xmlDevMng, b.xmlDevMng, a.xmlDevMng), a.xmlDevMng),
				[planYear]					= dbo.fnc_utilStringCompare(isnull(b.planYear, a.planYear), isnull(a.planYear, ''), b.planYear, a.planYear),
				[xmlPlanQuantity]			= dbo.fnc_utilXMLCompare(isnull(dbo.fnc_utilXMLCompare(b.xmlPlanQuantity, b.xmlPlanQuantity, a.xmlPlanQuantity), ''), dbo.fnc_utilXMLCompare(b.xmlPlanQuantity, b.xmlPlanQuantity, a.xmlPlanQuantity), a.xmlPlanQuantity),
				[xmlCostEffective]			= dbo.fnc_utilXMLCompare(isnull(dbo.fnc_utilXMLCompare(b.xmlCostEffective, b.xmlCostEffective, a.xmlCostEffective), ''), dbo.fnc_utilXMLCompare(b.xmlCostEffective, b.xmlCostEffective, a.xmlCostEffective), a.xmlCostEffective),
				[xmlCostDebit]				= dbo.fnc_utilXMLCompare(isnull(dbo.fnc_utilXMLCompare(b.xmlCostDebit, b.xmlCostDebit, a.xmlCostDebit), ''), dbo.fnc_utilXMLCompare(b.xmlCostDebit, b.xmlCostDebit, a.xmlCostDebit), a.xmlCostDebit),
				[xmlCostCredit]				= dbo.fnc_utilXMLCompare(isnull(dbo.fnc_utilXMLCompare(b.xmlCostCredit, b.xmlCostCredit, a.xmlCostCredit), ''), dbo.fnc_utilXMLCompare(b.xmlCostCredit, b.xmlCostCredit, a.xmlCostCredit), a.xmlCostCredit),
				[xmlFirst2FacultyCode]		= dbo.fnc_utilXMLCompare(isnull(dbo.fnc_utilXMLCompare(b.xmlFirst2FacultyCode, b.xmlFirst2FacultyCode, a.xmlFirst2FacultyCode), ''), dbo.fnc_utilXMLCompare(b.xmlFirst2FacultyCode, b.xmlFirst2FacultyCode, a.xmlFirst2FacultyCode), a.xmlFirst2FacultyCode),
				[xmlAfter2DepCode]			= dbo.fnc_utilXMLCompare(isnull(dbo.fnc_utilXMLCompare(b.xmlAfter2DepCode, b.xmlAfter2DepCode, a.xmlAfter2DepCode), ''), dbo.fnc_utilXMLCompare(b.xmlAfter2DepCode, b.xmlAfter2DepCode, a.xmlAfter2DepCode), a.xmlAfter2DepCode),
				[xmlAfter2SubjectCode]		= dbo.fnc_utilXMLCompare(isnull(dbo.fnc_utilXMLCompare(b.xmlAfter2SubjectCode, b.xmlAfter2SubjectCode, a.xmlAfter2SubjectCode), ''), dbo.fnc_utilXMLCompare(b.xmlAfter2SubjectCode, b.xmlAfter2SubjectCode, a.xmlAfter2SubjectCode), a.xmlAfter2SubjectCode),
				[xmlInstructorCourse]		= dbo.fnc_utilXMLCompare(isnull(dbo.fnc_utilXMLCompare(b.xmlInstructorCourse, b.xmlInstructorCourse, a.xmlInstructorCourse), ''), dbo.fnc_utilXMLCompare(b.xmlInstructorCourse, b.xmlInstructorCourse, a.xmlInstructorCourse), a.xmlInstructorCourse),
				[xmlInstructorRegular]		= dbo.fnc_utilXMLCompare(isnull(dbo.fnc_utilXMLCompare(b.xmlInstructorRegular, b.xmlInstructorRegular, a.xmlInstructorRegular), ''), dbo.fnc_utilXMLCompare(b.xmlInstructorRegular, b.xmlInstructorRegular, a.xmlInstructorRegular), a.xmlInstructorRegular),
				[xmlInstructorSpectial]		= dbo.fnc_utilXMLCompare(isnull(dbo.fnc_utilXMLCompare(b.xmlInstructorSpectial, b.xmlInstructorSpectial, a.xmlInstructorSpectial), ''), dbo.fnc_utilXMLCompare(b.xmlInstructorSpectial, b.xmlInstructorSpectial, a.xmlInstructorSpectial), a.xmlInstructorSpectial),
				[xmlCourseCreditStructure]	= dbo.fnc_utilXMLCompare(isnull(dbo.fnc_utilXMLCompare(b.xmlCourseCreditStructure, b.xmlCourseCreditStructure, a.xmlCourseCreditStructure), ''), dbo.fnc_utilXMLCompare(b.xmlCourseCreditStructure, b.xmlCourseCreditStructure, a.xmlCourseCreditStructure), a.xmlCourseCreditStructure),
				[xmlPlanOfStudy]			= dbo.fnc_utilXMLCompare(isnull(dbo.fnc_utilXMLCompare(b.xmlPlanOfStudy, b.xmlPlanOfStudy, a.xmlPlanOfStudy), ''), dbo.fnc_utilXMLCompare(b.xmlPlanOfStudy, b.xmlPlanOfStudy, a.xmlPlanOfStudy), a.xmlPlanOfStudy),
				[xmlCourseSubjectStructure]	= dbo.fnc_utilXMLCompare(isnull(dbo.fnc_utilXMLCompare(b.xmlCourseSubjectStructure, b.xmlCourseSubjectStructure, a.xmlCourseSubjectStructure), ''), dbo.fnc_utilXMLCompare(b.xmlCourseSubjectStructure, b.xmlCourseSubjectStructure, a.xmlCourseSubjectStructure), a.xmlCourseSubjectStructure),
				[xmlCharacter]				= dbo.fnc_utilXMLCompare(isnull(dbo.fnc_utilXMLCompare(b.xmlCharacter, b.xmlCharacter, a.xmlCharacter), ''), dbo.fnc_utilXMLCompare(b.xmlCharacter, b.xmlCharacter, a.xmlCharacter), a.xmlCharacter),
				[xmlCriteriaEvaluate]		= dbo.fnc_utilXMLCompare(isnull(dbo.fnc_utilXMLCompare(b.xmlCriteriaEvaluate, b.xmlCriteriaEvaluate, a.xmlCriteriaEvaluate), ''), dbo.fnc_utilXMLCompare(b.xmlCriteriaEvaluate, b.xmlCriteriaEvaluate, a.xmlCriteriaEvaluate), a.xmlCriteriaEvaluate),
				[xmlTeacherDevelop]			= dbo.fnc_utilXMLCompare(isnull(dbo.fnc_utilXMLCompare(b.xmlTeacherDevelop, b.xmlTeacherDevelop, a.xmlTeacherDevelop), ''), dbo.fnc_utilXMLCompare(b.xmlTeacherDevelop, b.xmlTeacherDevelop, a.xmlTeacherDevelop), a.xmlTeacherDevelop),
				[xmlQualityAssurance]		= dbo.fnc_utilXMLCompare(isnull(dbo.fnc_utilXMLCompare(b.xmlQualityAssurance, b.xmlQualityAssurance, a.xmlQualityAssurance), ''), dbo.fnc_utilXMLCompare(b.xmlQualityAssurance, b.xmlQualityAssurance, a.xmlQualityAssurance), a.xmlQualityAssurance),
				[xmlCourseImplement]		= dbo.fnc_utilXMLCompare(isnull(dbo.fnc_utilXMLCompare(b.xmlCourseImplement, b.xmlCourseImplement, a.xmlCourseImplement), ''), dbo.fnc_utilXMLCompare(b.xmlCourseImplement, b.xmlCourseImplement, a.xmlCourseImplement), a.xmlCourseImplement),
				[startYearKPI]				= dbo.fnc_utilStringCompare(isnull(b.startYearKPI, a.startYearKPI), isnull(a.startYearKPI, ''), b.startYearKPI, a.startYearKPI),
				[xmlIndicators]				= dbo.fnc_utilXMLCompare(isnull(dbo.fnc_utilXMLCompare(b.xmlIndicators, b.xmlIndicators, a.xmlIndicators), ''), dbo.fnc_utilXMLCompare(b.xmlIndicators, b.xmlIndicators, a.xmlIndicators), a.xmlIndicators),
				[createdBy]					= @username,
				[createdDate]				= getdate(),
				[verifyStatus]				= null,
				[verifyBy]					= null,
				[verifyDate]				= null,
				[notiAppointment]			= null,
				[notiDate]					= null,
				[verifyRemark]				= null,
				[sendVerifyStatus]			= null,
				[sendVerifyBy]				= null,
				[sendVerifyDate]			= null
			from	acaTQFProgrammeTemp as a inner join
					#tmpProg as b on a.id = b.id
			where	((a.verifyStatus is null and a.sendVerifyStatus is null) or	(a.verifyStatus in ('Y', 'N') and a.sendVerifyStatus = 'Y'))
			
			--บันทึก PLOs
			declare rs1 cursor for
				select	[id],
						[xmlPLOs]
				from	#tmpProg

			open rs1

			fetch next from rs1 into 
				@id,
				@xmlPLOs
		
			while @@fetch_status = 0
			begin
				if (@xmlPLOs is not null)
					exec sp_acaTQFSetPLOs null, @id, null, @xmlUser

				fetch next from rs1 into 
					@id,
					@xmlPLOs
			end
		
			close rs1
			deallocate rs1	
			--
		end

		if (@mode = 'sendverify')
		begin
			update Infinity..acaTQFProgrammeTemp set
				verifyStatus		= null,
				notiAppointment		= null,
				notiDate			= null,
				verifyRemark		= null,
				verifyBy			= null,
				verifyDate			= null,
				sendVerifyStatus	= 'Y',
				sendVerifyBy		= @username,
				sendVerifyDate		= getdate()
			from	acaTQFProgrammeTemp as a inner join
					#tmpProg as b on a.id = b.id
			where	(a.verifyStatus is null) and 
					(a.sendVerifyStatus is null)
		end
		
		if (@mode = 'verify')
		begin
		
			update Infinity..acaTQFProgrammeTemp set
				verifyStatus	= dbo.fnc_utilStringCompare(isnull(b.verifyStatus, a.verifyStatus), isnull(a.verifyStatus, ''), b.verifyStatus, a.verifyStatus),
				notiAppointment	= dbo.fnc_utilStringCompare(isnull(b.notiAppointment, a.notiAppointment), isnull(a.notiAppointment, ''), b.notiAppointment, a.notiAppointment),
				notiDate		= dbo.fnc_utilDateTimeCompare(isnull(convert(datetime, b.notiDate, 103), a.notiDate), isnull(a.notiDate, ''), convert(datetime, b.notiDate, 103), a.notiDate),
				verifyRemark	= dbo.fnc_utilStringCompare(isnull(b.verifyRemark, a.verifyRemark), isnull(a.verifyRemark, ''), b.verifyRemark, a.verifyRemark),
				verifyBy		= @username,
				verifyDate		= getdate()
			from	acaTQFProgrammeTemp as a inner join
					#tmpProg as b on a.id = b.id
			where	(a.verifyStatus is null or a.verifyStatus = 'N') and
					(a.sendVerifyStatus = 'Y')
		end
		
		select	@xmlData as xmlData,
				@xmlUser as xmlUser,
				@mode as mode,
				@action as action,
				@idTemp as id,
				'0' as resCode,
				'Success' as resMessage,
				NULL as resErrorNumber
	end try
	begin catch
		select	@xmlData as xmlData,
				@xmlUser as xmlUser,
				@mode as mode,
				@action as action,
				@idTemp as id,
				'1' as resCode,
				ERROR_MESSAGE() as resMessage,
				@@ERROR as resErrorNumber
	end catch
end
