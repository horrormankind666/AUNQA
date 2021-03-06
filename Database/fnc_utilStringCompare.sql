USE [Infinity]
GO
/****** Object:  UserDefinedFunction [dbo].[fnc_utilStringCompare]    Script Date: 7/5/2562 11:47:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author		: <ยุทธภูมิ ตวันนา>
-- Create date	: <๐๗/๐๕/๒๕๖๒>
-- Description	: <สำหรับตรวจสอบข้อความ>
-- =============================================
ALTER function [dbo].[fnc_utilStringCompare]
(
	@strCompare1 nvarchar(4000) = null,
	@strCompare2 nvarchar(4000) = null,
	@trueValue nvarchar(4000) = null,
	@falseValue nvarchar(4000) = null
)
returns nvarchar(4000)
as
begin
	declare @result nvarchar(4000) = null
	declare	@strBlank VARCHAR(50) = '----------**********.........0.0000000000000000000'

	set @result = (case when @strCompare1 <> @strCompare2 then (case when (nullif(@trueValue, '') is not null) and (charindex(@trueValue, @strBlank) = 0) then @trueValue else null end) else nullif(@falseValue, '') end)
	
	return @result
end