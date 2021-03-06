USE [Infinity]
GO
/****** Object:  UserDefinedFunction [dbo].[fnc_acaGetDepartmentId]    Script Date: 3/5/2562 9:45:03 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Thanakrit Taejaroenkul>
-- Create date: <2018-06-21>
-- Description:	<สร้างรหัส id ตาราง acaDepartment>
-- =============================================

/*
select dbo.fnc_acaGetDepartmentId('ARFE')
*/

ALTER function [dbo].[fnc_acaGetDepartmentId] 
(
	@depCode varchar(15)
)
returns varchar(15)
as
begin
	declare @id varchar(15)

	-- Pattern : XX-01
	select	@id = (isnull(max(cast(right(id, 2) as int)), 0) + 1)
	from	acaDepartment
	where	depCode = @depCode

	-- Return the result of the function
	return (case when (isnull(@depCode,'') = '') then null else (upper(@depCode) + '-' + right('00' + @id, 2)) end)
end