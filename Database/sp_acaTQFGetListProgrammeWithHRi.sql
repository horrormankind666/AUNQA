USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaTQFGetListProgrammeWithHRi]    Script Date: 17/9/2562 14:22:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author		: <ยุทธภูมิ ตวันนา>
-- Create date	: <๑๗/๐๙/๒๕๖๒>
-- Description	: <สำหรับแสดงข้อมูลหลักสูตรในมคอ.2 ตามบุคลากรใน HRi ที่ประจำหลักสูตร>
-- Parameter
--	1. HRiId	เป็น varchar รับค่ารหัสบุคลากรใน HRi
-- =============================================

ALTER procedure [dbo].[sp_acaTQFGetListProgrammeWithHRi]
(
	@HRiId varchar(30) = null
)
as
begin
	set @HRiId = ltrim(rtrim(isnull(@HRiId, '')))

	select	 acafac.facultyCode,
			 acafac.nameTh as facultyNameTH,
			 acafac.nameEn as facultyNameEN,
			 tqfprg.*,
			 nullif(xmlInstructorResponsible.query('(/xmlInstructorResponsible/row/hriID)').value('.', 'varchar(max)'), '') as HRiId,
			 nullif(xmlInstructorResponsible.query('(/xmlInstructorResponsible/row/coursePositionId)').value('.', 'varchar(max)'), '') as coursePositionId,
			 nullif(xmlInstructorResponsible.query('(/xmlInstructorResponsible/row/coursePositionNameTh)').value('.', 'varchar(max)'), '') as coursePositionNameTH,
			 nullif(xmlInstructorResponsible.query('(/xmlInstructorResponsible/row/coursePositionNameEn)').value('.', 'varchar(max)'), '') as coursePositionNameEN,
			 nullif(xmlInstructorResponsible.query('(/xmlInstructorResponsible/row/coursePositionGroup)').value('.', 'varchar(max)'), '') as coursePositionGroup
	from	 Infinity..acaTQFProgramme as tqfprg left join
			 Infinity..acaFaculty as acafac on tqfprg.facultyId = acafac.id
	where	 (tqfprg.xmlInstructorResponsible is not null) and
			 (tqfprg.xmlInstructorResponsible.exist('(/xmlInstructorResponsible/row/hriID[.=sql:variable("@HRiId")])') = 1)
	order by tqfprg.id
end