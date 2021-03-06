USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaGetListBranch]    Script Date: 2/5/2562 15:33:07 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Thanakrit Tae>
-- Create date: <2018-03-19>
-- Description:	<ข้อมูลสาขาวิชา>
-- =============================================

/*
[sp_acaGetListBranch] 'MUA-01'
*/

ALTER procedure [dbo].[sp_acaGetListBranch]
(
	@rankingTypeId varchar(15)
)
as
begin
	select	 *
	from	 acaBranch with(nolock)
	where	 (cancelStatus is null) and
			 (rankingTypeId = @rankingTypeId)
	order by branchCode
end
