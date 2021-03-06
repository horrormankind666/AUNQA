USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaGetSubject]    Script Date: 2/5/2562 16:10:14 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Thanakrit.tae>
-- Create date: <2014-07-10>
-- Description:	<รายการข้อมูลรายวิชา>
-- Page:	<AcademicInfoDb.cs>
-- =============================================

/*
[sp_acaGetSubject] 'LAEN104-01'
*/

ALTER procedure [dbo].[sp_acaGetSubject]
(
	@subjectId varchar(15)
)
as
begin
	select	*,
			(cast(credit as varchar) + '(' + cast(lectureCredit as varchar) + '/' + cast(labCredit as varchar) + '/' + cast(seminarCredit as varchar) + ')') as strCredit
	from	acaSubject with(nolock)
	where	id = @subjectId
end
