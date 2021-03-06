USE [Infinity]
GO
/****** Object:  UserDefinedFunction [dbo].[fnc_acaGetFacultyId]    Script Date: 2/5/2562 16:22:07 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Thanakrit Taejaroenkul>
-- Create date: <2018-06-12>
-- Description:	<สร้างรหัส id ตาราง acaGetFaculty>
-- =============================================

/*
select dbo.fnc_acaGetFacultyId('sa')
*/

ALTER function [dbo].[fnc_acaGetFacultyId] 
(
	@facultyCode varchar(15)
)
returns varchar(15)
as
begin
	declare @id varchar(15)

	-- Pattern : XX-01
	select	@id = (isnull(max(cast(right(id, 2) as int)), 0) + 1)
	from	acaFaculty
	where	facultyCode = @facultyCode

	-- Return the result of the function
	return (case when (isnull(@facultyCode, '') = '') then null else (upper(@facultyCode) + '-' + right('00' + @id, 2)) end)
end

	