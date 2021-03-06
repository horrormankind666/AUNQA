USE [Infinity]
GO
/****** Object:  UserDefinedFunction [dbo].[fnc_acaGetMajorId]    Script Date: 3/5/2562 11:44:41 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Thanakrit Taejaroenkul>
-- Create date: <2018-06-27>
-- Description:	<สร้างรหัส id ตาราง acaMajor>
-- =============================================

/*
select dbo.fnc_acaGetMajorId('ADPM')
*/

ALTER function [dbo].[fnc_acaGetMajorId] 
(
	@majorCode varchar(15)
)
returns varchar(15)
as
begin
	declare @id varchar(15)

	-- Pattern : XX-01
	select	@id = (isnull(max(cast(right(id, 2) as int)), 0) + 1)
	from	acaMajor
	where	codeEn = @majorCode

	-- Return the result of the function
	return (case when (isnull(@majorCode, '') = '') then null else (upper(@majorCode) + '-' + right('00' + @id, 2)) end)
end	