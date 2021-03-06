USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaTQFGetListIndicators]    Script Date: 2/4/2562 12:30:50 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author		: <Thanakrit Tae>
-- Create date	: <2018-03-19>
-- Description	: <ข้อมูลตัวบ่งชี้การดำเนินการ (Key Performance Indicators)>
-- =============================================

/*
[sp_acaTQFGetListIndicators] '2'
*/

ALTER procedure [dbo].[sp_acaTQFGetListIndicators]
(
	@tqfProgramId varchar(15)
) 
as
begin
	select	 *
	from	 acaTQFIndicators with(nolock)
	where	 (tqfProgramId = @tqfProgramId) and
			 (cancelStatus is null)
	order by indent
end