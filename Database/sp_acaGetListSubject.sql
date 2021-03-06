USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaGetListSubject]    Script Date: 2/5/2562 16:07:02 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Thanakrit.tae>
-- Create date: <2015-03-12>
-- Description:	<drop down list คณะเจ้าของรายวิชา>
-- Page:		<AcademicInfoDb.cs>
-- =============================================

/*
[sp_acaGetListSubject] 'U0001','LA-01'
*/

ALTER procedure [dbo].[sp_acaGetListSubject]
(
	@uId varchar(5),
	@facultyId varchar(15)
)
as
begin
	select	 *,
			 (case when (isnull(nameEn, '') = '') then nameTh else nameEn end) as displayName
	from	 acaSubject as a with(nolock)
	where	 (a.facultyOwner = @facultyId) and
			 (a.uId = @uId) and
			 (a.cancelStatus is null)
	order by a.codeEn
end