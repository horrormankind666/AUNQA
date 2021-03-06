USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaTQFGetListProgrammeTemp]    Script Date: 18/10/2562 13:05:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author		: <ยุทธภูมิ ตวันนา>
-- Create date	: <๐๒/๐๔/๒๕๖๒>
-- Description	: <ข้อมูล TQF2 Temp>
-- =============================================

/*
[sp_acaTQFGetListProgrammeTemp] 'EG-01'
*/

ALTER procedure [dbo].[sp_acaTQFGetListProgrammeTemp]
(
	@facultyId varchar(15) = null
)
as
begin
	set @facultyId = ltrim(rtrim(isnull(@facultyId, '')))

	select	 *
	from	 acaTQFProgrammeTemp as a with(nolock)
	where	 (a.facultyId = @facultyId) and
			 (a.dLevel = 'B')
	order by programId,
			 id desc
end
