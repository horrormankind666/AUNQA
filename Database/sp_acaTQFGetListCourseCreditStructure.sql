USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaTQFGetListCourseCreditStructure]    Script Date: 2/4/2562 12:23:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author		: <Thanakrit Tae>
-- Create date	: <2018-03-19>
-- Description	: <ข้อมูลโครงสร้างหน่วยกิต>
-- =============================================

/*
[sp_acaTQFGetListCourseCreditStructure] 'EG-01'
*/

ALTER procedure [dbo].[sp_acaTQFGetListCourseCreditStructure]
(
	@facultyId varchar(15)
)
as
begin
	select	 a.*
	from	 acaTQFCourseCreditStructure as a with(nolock) inner join
			 acaTQFProgramme as b with(nolock) on a.tqfProgramId = b.id
	where	 (b.facultyId = @facultyId) and 
			 (a.cancelStatus is null) and
			 (b.cancelStatus is null)
	order by b.programCode,
			 b.majorCode,
			 b.groupNum
end