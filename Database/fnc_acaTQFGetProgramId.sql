USE [Infinity]
GO
/****** Object:  UserDefinedFunction [dbo].[fnc_acaTQFGetProgramId]    Script Date: 30/8/2562 16:57:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author		: <ยุทธภูมิ ตวันนา>
-- Create date	: <๓๐/๐๘/๒๕๖๒>
-- Description	: <สำหรับสร้างรหัสหลักสูตร>
-- =============================================
ALTER function [dbo].[fnc_acaTQFGetProgramId]
(
	@programId varchar(15) = null,
	@programCode varchar(15) = null,
	@majorCode varchar(10) = null,
	@groupNum varchar(5) = null,
	@dLevel varchar(5) = null
)
returns varchar(15)
as
begin
	declare @id varchar(15) = null
	declare @maxId varchar(15) = null

	select	top 1
			@id = programId
	from	Infinity..acaTQFProgramme
	where	(programId = @programId) and
			(programCode = @programCode) and
			(majorCode = @majorCode) and
			(groupNum = @groupNum) and
			(dLevel = @dLevel)

	if (@id is null)
	begin
		select	top 1
				@maxId = max(programId)	
		from	Infinity..acaTQFProgramme
		where	(programCode = @programCode) and
				(dLevel = @dLevel)

		if (@maxId is not null)
			set @id = (@programCode + '-' + right('000' +  cast(cast(substring(@maxId, 7, 3) as int) + 1 as varchar),3) + '-' + @dLevel)
		else
			set @id = (@programCode + '-001-' + @dLevel)
	end

	return @id
end