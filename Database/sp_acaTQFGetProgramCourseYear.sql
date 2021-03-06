USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaTQFGetProgramCourseYear]    Script Date: 5/8/2562 11:15:53 ******/
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
[sp_acaTQFGetProgramCourseYear] 'LAENB-001-B', '2556'
*/

ALTER procedure [dbo].[sp_acaTQFGetProgramCourseYear]
(
	@programId varchar(15),
	@courseYear varchar(4)
)
as
begin
	select	*
	from	acaTQFProgramme with(nolock)
	where	(programId = @programId) and 
			(courseYear = @courseYear) and
			(cancelStatus is null)
end