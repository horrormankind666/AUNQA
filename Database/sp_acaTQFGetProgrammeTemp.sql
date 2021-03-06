USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaTQFGetProgrammeTemp]    Script Date: 5/8/2562 12:40:00 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author		: <Thanakrit Tae>
-- Create date	: <2018-03-19>
-- Description	: <ข้อมูล TQF2>
-- =============================================

/*
[sp_acaTQFGetProgrammeTemp] 'EGEGB-002-B'
*/

ALTER procedure [dbo].[sp_acaTQFGetProgrammeTemp]
(
	@id varchar(15),	
	@mode varchar(20),
	@programId varchar(15),
	@courseYear varchar(4),
	@programCode varchar(10),
	@majorCode varchar(10),
	@groupNum varchar(5),
	@username varchar(150)
)
as
begin
	begin try
		select	*
		from	acaTQFProgrammeTemp with(nolock)
		where	id = @id

		select	*
		from	acaTQFProgrammeTemp with (nolock)
		where	(mode = @mode) and
				(programId = @programId) and
				(courseYear = @courseYear) and
				(programCode = @programCode) and
				(majorCode = @majorCode) and
				(groupNum = @groupNum) and
				(createdBy = @username)
	end try
	begin catch
	end catch
end