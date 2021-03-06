USE [Infinity]
GO
/****** Object:  UserDefinedFunction [dbo].[fnc_utilDateTimeCompare]    Script Date: 7/5/2562 11:49:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author		: <ยุทธภูมิ ตวันนา>
-- Create date	: <๐๗/๐๕/๒๕๖๒>
-- Description	: <สำหรับตรวจสอบวันเดือนปี>
-- =============================================
ALTER function [dbo].[fnc_utilDateTimeCompare]
(
	@dtCompare1 datetime = null,
	@dtCompare2 datetime = null,
	@trueValue datetime = null,
	@falseValue datetime = null
)
returns datetime
as
begin
	declare @result nvarchar(4000) = null

	set @result = (case when @dtCompare1 <> @dtCompare2 then nullif(@trueValue, '') else nullif(@falseValue, '') end)
	
	return @result
end