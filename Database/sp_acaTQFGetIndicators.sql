USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaTQFGetIndicators]    Script Date: 2/4/2562 12:31:06 ******/
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
[sp_acaTQFGetIndicators] '2'
*/

ALTER procedure [dbo].[sp_acaTQFGetIndicators]
(
	@id varchar(15)
)
as
begin
	select	*
	from	acaTQFIndicators with(nolock)
	where	id = @id
end
