USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaGetDepartment]    Script Date: 2/5/2562 15:27:45 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Thanakrit Tae>
-- Create date: <2018-03-19>
-- Description:	<ข้อมูลภาควิชา>
-- =============================================

/*
[sp_acaGetDepartment] 'AMAG-01'
*/

ALTER procedure [dbo].[sp_acaGetDepartment]
(
	@id varchar(15)
)
as
begin
	select	*,
			convert(varchar, startDate, 103) as startDate1,
			convert(varchar, endDate, 103) as endDate1
	from	acaDepartment with(nolock)
	where	id = @id
end