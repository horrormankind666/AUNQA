USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaTQFSetTransProgramme]    Script Date: 24/3/2564 12:16:51 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author		: <>
-- Create date	: <>
-- Description	: <>
-- =============================================

/*
[sp_acaTQFSetTransProgramme] 1 
*/

ALTER procedure [dbo].[sp_acaTQFSetTransProgramme]
(
	@id int
)
as
begin
	
	declare @isRow int
	declare @programId varchar(15)
	declare @courseYear varchar(4)
	
	-- ตรวจสอบว่า ข้อมูลมาจากหลักสูตร ปีจัดทำหลักสูตรอะไร
	select	@programId = programId,
			@courseYear = courseYear
	from	acaTQFProgrammeTemp
	where	id = @id

	-- ตรวจสอบว่ามี Record หลักสูตรและปีหลักสูตรนี้แล้วหรือไม่
	select	@isRow = count(*)
	from	acaTQFProgramme
	where	(programId = @programId) and
			(courseYear = @courseYear)

	begin try 
		if (@isRow = 0)
		begin
			insert acaTQFProgramme
			(
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
				-- 11
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
				-- 20
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
				-- 30
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
				-- 40
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
				-- 50
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
				-- 60
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
				-- 70
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
				-- 80
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
				-- 90
				[xmlCriteriaEvaluate],
				[xmlTeacherDevelop],
				[xmlQualityAssurance],
				[xmlCourseImplement],
				[startYearKPI],
				[xmlIndicators],
				[cancelStatus],
				[cancelBy],
				[cancelDate],
				[createdBy],				
				-- 100
				[createdDate],
				[verifyStatus],
				[verifyBy],
				[verifyDate],
				[notiAppointment],
				[notiDate],
				[verifyRemark],
				[refProgrammeTempId]
				-- 106
			)
			select	dbo.fnc_acaTQFGetProgramId([programId], [programCode], [majorCode], [groupNum], [dLevel]),
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
					-- 11
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
					-- 20
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
					-- 30
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
					-- 40
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
					-- 50
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
					-- 60
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
					-- 70
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
					-- 80
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
					-- 90
					[xmlCriteriaEvaluate],
					[xmlTeacherDevelop],
					[xmlQualityAssurance],
					[xmlCourseImplement],
					[startYearKPI],
					[xmlIndicators],
					[cancelStatus],
					[cancelBy],
					[cancelDate],
					[createdBy],					
					-- 100
					[createdDate],
					[verifyStatus],
					[verifyBy],
					[verifyDate],
					[notiAppointment],
					[notiDate],
					[verifyRemark],
					@id
					-- 106
			from	acaTQFProgrammeTemp
			where	id = @id
		end
		else
			begin			
				update acaTQFProgramme set
					[facultyId] = b.facultyId,
					[majorId] = b.majorId,
					[courseCredit] = b.courseCredit,
					[programCode] = b.programCode,
					[majorCode]  = b.majorCode,
					[groupNum] = b.groupNum,
					[dLevel] = b.dLevel,
					[nameTh] = b.nameTh,
					-- 11
					[nameEn] = b.nameEn,
					[abbrevTh] = b.abbrevTh,
					[abbrevEn] = b.abbrevEn,
					[degreeNameTh] = b.degreeNameTh,
					[degreeNameEn] = b.degreeNameEn,
					[degreeAbbrevTh] = b.degreeAbbrevTh,
					[degreeAbbrevEn] = b.degreeAbbrevEn,
					[studentNo] = b.studentNo,
					[address] = b.[address],
					[telephone] = b.telephone,
					-- 20
					[eduSystem] = b.eduSystem,
					[studyYear] = b.studyYear,
					[branchGroup] = b.branchGroup,
					[programType] = b.programType,
					[entryType] = b.entryType,
					[centerStudy] = b.centerStudy,
					[joinIns] = b.joinIns,
					[startDate] = b.startDate,
					[endDate] = b.endDate,
					[startYear] = b.startDate,
					-- 30
					[startSemester] = b.startSemester,
					[endYear] = b.endYear,
					[endSemester] = b.endSemester,
					[MUA_ISCED] = b.MUA_ISCED,
					[MUA_CURR_ID] = b.MUA_CURR_ID,
					[schRefGroup_ICL] = b.schRefGroup_ICL,
					[countFlag] = b.countFlag,
					[iscedGroup] = b.iscedGroup,
					-- [transNo] = b.transNo, *Call Function เพื่อตรวจสอบว่าเป็น ปีปรับปรุงหลักสูตรที่เท่าไร
					-- [refPrevTransId] = b.refPrevTransId, *Call Function เพื่อตรวจสอบว่าปรับปรุงมาจากรายการหลักสูตรไหน
					-- 40
					[activeStatus] = b.activeStatus,
					[presentStatus] = b.presentStatus,
					[xmlFaculty] = b.xmlFaculty,
					[xmlMajorSubject] = b.xmlMajorSubject,
					[xmlDepartment] = b.xmlDepartment,
					[xmlProgramType] = b.xmlProgramType,
					[xmlAdmissionType] = b.xmlAdmissionType,
					[xmlBranch] = b.xmlBranch,
					[xmlISCED] = b.xmlISCED,
					[xmlLanguages] = b.xmlLanguages,
					-- 50
					[xmlCooperationType] = b.xmlCooperationType,
					[xmlCooperationPattern] = b.xmlCooperationPattern,
					[xmlCooperationInitute] = b.xmlCooperationInitute,
					[xmlGraduateType] = b.xmlGraduateType,
					[xmlCourseManagement] = b.xmlCourseManagement,
					[xmlApprovedCourses] = b.xmlApprovedCourses,
					[publishYear] = b.publishYear,
					[xmlCareer] = b.xmlCareer,
					[xmlPlaceStudy] = b.xmlPlaceStudy,
					[xmlExternalSituation] = b.xmlExternalSituation,
					[xmlImpactCurriculum] = b.xmlImpactCurriculum,					
					-- 60
					[xmlRefOtherCourses] = b.xmlRefOtherCourses,
					[xmlInstructorResponsible] = b.xmlInstructorResponsible,
					[xmlProgramObjectives] = b.xmlProgramObjectives,
					[xmlPLOs] = b.xmlPLOs,
					[xmlDevelopPlan] = b.xmlDevelopPlan,
					[philosopyCourses] = b.philosopyCourses,
					[docDate] = b.docDate,
					[tqfYear] = b.tqfYear,
					[xmlEduSystem] = b.xmlEduSystem,
					[xmlEduStudyType] = b.xmlEduStudyType,					
					-- 70
					[numSemester] = b.numSemester,
					[isSummer] = b.isSummer,
					[compareCredit] = b.compareCredit,
					[creditTransfer] = b.creditTransfer,
					[xmlDevMng] = b.xmlDevMng,
					[planYear] = b.planYear,
					[xmlPlanQuantity] = b.xmlPlanQuantity,
					[xmlCostEffective] = b.xmlCostEffective,
					[xmlCostDebit] = b.xmlCostDebit,
					[xmlCostCredit] = b.xmlCostCredit,					
					-- 80
					[xmlFirst2FacultyCode] = b.xmlFirst2FacultyCode,
					[xmlAfter2DepCode] = b.xmlAfter2DepCode,
					[xmlAfter2SubjectCode] = b.xmlAfter2SubjectCode,
					[xmlInstructorCourse] = b.xmlInstructorCourse,
					[xmlInstructorRegular] = b.xmlInstructorRegular,
					[xmlInstructorSpectial] = b.xmlInstructorSpectial,
					[xmlCourseCreditStructure] = b.xmlCourseCreditStructure,
					[xmlPlanOfStudy] = b.xmlPlanOfStudy,
					[xmlCourseSubjectStructure] = b.xmlCourseSubjectStructure,
					[xmlCharacter] = b.xmlCharacter,					
					-- 90
					[xmlCriteriaEvaluate] = b.xmlCriteriaEvaluate,
					[xmlTeacherDevelop] = b.xmlTeacherDevelop,
					[xmlQualityAssurance] = b.xmlQualityAssurance,
					[xmlCourseImplement] = b.xmlCourseImplement,
					[startYearKPI] = b.startYearKPI,
					[xmlIndicators] = b.xmlIndicators,
					[cancelStatus] = b.cancelStatus,
					[cancelBy] = b.cancelBy,
					[cancelDate] = b.cancelDate,
					[createdBy] = b.createdBy,					
					-- 100
					[createdDate] = b.createdDate,
					[verifyStatus] = b.verifyStatus,
					[verifyBy] = b.verifyBy,
					[verifyDate] = b.verifyDate,
					[notiAppointment] = b.notiAppointment,
					[notiDate] = b.notiDate,
					[verifyRemark] = b.verifyRemark,
					[refProgrammeTempId] = b.id --จัดเก็บรายการ update ล่าสุด
					-- 106
				from	acaTQFProgramme as a inner join
						acaTQFProgrammeTemp as b on (a.courseYear = b.courseYear) and (a.programId = b.programId)
				where	b.id = @id
			end
	end try
	begin catch
		insert [InfinityLog].[dbo].[sysError]
		(
			[systemName],
			[errorNumber],
			[errorMessage],
			[hint],
			[url],
			[logDate]
		)
		select	'AUNQA',
				@@ERROR,
				ERROR_MESSAGE(),
				('Section Declare : sp_acaTQFSetTransProgramme Error id = ' + cast(@id as varchar(15))),
				'',
				GETDATE()
	end catch
end

/*
select top 100  * from [InfinityLog].[dbo].[sysError] 
order by id desc
*/