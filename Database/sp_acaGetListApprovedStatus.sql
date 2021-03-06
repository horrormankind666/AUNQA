USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaGetListApprovedStatus]    Script Date: 2/5/2562 15:31:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Thanakrit Tae>
-- Create date: <2018-03-19>
-- Description:	<ข้อมูล หัวข้อการอนุมัติหลักสูตร>
-- =============================================

/*
[sp_acaGetListApprovedStatus] 'COURSES','2560'
*/

ALTER procedure [dbo].[sp_acaGetListApprovedStatus]
(
	@groupStatus varchar(20),
	@curYear varchar(4)
)
as
begin
	select	 *
	from	 acaApprovedStatusContent with(nolock)
	where	 (len(isnull(@groupStatus, '')) = 0 or groupStatus = @groupStatus) and
			 (isnull(startYear,@curYear) <= @curYear) and
			 (isnULL(endYear,@curYear) >= @curYear) and
			 (cancelStatus is null)
	order by indent
end