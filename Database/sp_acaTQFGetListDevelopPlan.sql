USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaTQFGetListDevelopPlan]    Script Date: 2/4/2562 12:29:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author		: <Thanakrit.tae>
-- Create date	: <2018-04-09>
-- Description	: <รายการแผนการพัฒนาปรับปรุง>
-- =============================================

/*
[sp_acaTQFGetListDevelopPlan] '1'
*/

ALTER procedure [dbo].[sp_acaTQFGetListDevelopPlan]
(
	@tqfProgramId varchar(15)
)
as
begin
	select	*
	from	acaTQFDevelopPlan with(nolock)
	where	tqfProgramId = @tqfProgramId
end
