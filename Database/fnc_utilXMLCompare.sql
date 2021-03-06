USE [Infinity]
GO
/****** Object:  UserDefinedFunction [dbo].[fnc_utilXMLCompare]    Script Date: 7/5/2562 11:39:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author		: <ยุทธภูมิ ตวันนา>
-- Create date	: <๐๗/๐๕/๒๕๖๒>
-- Description	: <สำหรับตรวจสอบ XML>
-- =============================================
ALTER function [dbo].[fnc_utilXMLCompare]
(
	@xmlCompare xml = null,
	@trueValue xml = null,
	@falseValue xml = null
)
returns xml
as
begin
	declare @result xml = null

	set @result = (case when @xmlCompare.query('count(/*/*)').value('.', 'int') = 0 then null else isnull(@trueValue, @falseValue) end)
	
	return @result
end