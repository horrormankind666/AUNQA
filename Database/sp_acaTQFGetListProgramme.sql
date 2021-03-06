USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaTQFGetListProgramme]    Script Date: 18/10/2562 13:02:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author		: <Thanakrit Tae>
-- Create date	: <2018-03-19>
-- Description	: <ข้อมูล TQF2>
-- =============================================

/*
[sp_acaTQFGetListProgramme] 'EG-01'
*/

ALTER procedure [dbo].[sp_acaTQFGetListProgramme]
(
	@facultyId varchar(15) = null
)
as
begin
	set @facultyId = ltrim(rtrim(isnull(@facultyId, '')))

	select	 *
	from	 acaTQFProgramme with(nolock)
	where	 (facultyId = @facultyId) and
			 (dLevel = 'B') and
			 (cancelStatus is null)
	order by (programCode + isnull(majorCode,'') + isnull(groupNum,''))

	-- Modify by	: <ยุทธภูมิ ตวันนา>
	-- Modify date	: <๐๔/๐๔/๒๕๖๑>
	select	 a.*,
			 b.courseYear as courseYearPresent
	from	 (
				select	 programId,
						 uId,
						 facultyId,
						 majorId,
						 programCode,
						 majorCode,
						 groupNum,
						 dLevel,
						 nameTh,
						 nameEn,
						 (case when len(c.courseYear) > 0 then (left(isnull(c.courseYear, ''), (len(isnull(c.courseYear, '')) - 1))) else null end) courseYear,
						 cancelStatus,
						 verifyStatus
				from	 (
							select	distinct
									programId,
									uId,
									facultyId,
									majorId,
									programCode,
									majorCode,
									groupNum,
									dLevel,
									nameTh,
									nameEn,
									cancelStatus,
									verifyStatus
							from	acaTQFProgramme with(nolock)
							where	(facultyId = @facultyId) and 
									(cancelStatus is null)
						 ) a
						 cross apply
						 (
							select	 (b.courseYear  + ',')
							from	 acaTQFProgramme as b with(nolock)
							where	 (b.facultyId = @facultyId) and 
									 (b.cancelStatus is null) and
									 (a.programId = b.programId) and
									 (a.programCode = b.programCode) and
									 (a.majorCode = b.majorCode) and
									 (a.groupNum = b.groupNum) and
									 (a.dLevel = b.dLevel) and
									 (a.nameTh = b.nameTh) and
									 (a.nameEn = b.nameEn)
							order by b.courseYear desc
							for xml path('')
						 ) c (courseYear) 
				where	 (a.facultyId = @facultyId) and 
						 (a.dLevel = 'B') and
						 (a.cancelStatus is null)
			 ) as a left join 
			 (
				select	programId,
						courseYear
				from	acaTQFProgramme with(nolock)
				where	(facultyId = @facultyId) and
						(presentStatus = 'Y')
			 ) as b on a.programId = b.programId
	order by (a.programCode + isnull(a.majorCode,'') + isnull(a.groupNum,''))
END