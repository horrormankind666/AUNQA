USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaTQFGetListPLOs]    Script Date: 2/4/2562 12:41:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author		: <Thanakrit Tae>
-- Create date	: <2018-03-19>
-- Description	: <ข้อมูล PLOs (Program Learnning Outcome)>
-- =============================================

/*
[sp_acaTQFGetListPLOs] '1'
*/

ALTER procedure [dbo].[sp_acaTQFGetListPLOs]
(
	@tqfProgramId varchar(15)
)
as
begin
	select	 *
	from	 acaTQFPLOs with(nolock)
	where	 tqfProgramId = @tqfProgramId
	order by code
end