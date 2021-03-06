USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaTQFGetProgramme]    Script Date: 2/4/2562 13:13:45 ******/
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
[sp_acaTQFGetProgramme] 'EGEGB-007-B'
*/

ALTER procedure [dbo].[sp_acaTQFGetProgramme]
(
	@programId varchar(15)
)
as
begin
	select	*
	from	acaTQFProgramme with(nolock)
	where	(programId = @programId) and
			(presentStatus = 'Y') and
			(cancelStatus is null)
end
