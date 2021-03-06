USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaTQFGetCourseSubjectStructure]    Script Date: 2/4/2562 12:19:22 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author		: <Thanakrit Tae>
-- Create date	: <2018-03-19>
-- Description	: <ข้อมูลโครงสร้างรายวิชาตาม หมวดรายวิชา และกลุ่มวิชา>
-- =============================================

/*
[sp_acaTQFGetCourseSubjectStructure] '1'
*/

ALTER procedure [dbo].[sp_acaTQFGetCourseSubjectStructure]
(
	@id varchar(15)
)
as
begin
	select	a.*
	from	acaTQFCourseSubjectStructure as a with(nolock) inner join
			acaTQFProgramme as b with(nolock) on a.tqfProgramId = b.id
	where	a.id = @id
end
