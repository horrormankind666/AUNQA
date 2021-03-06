USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaGetApprovedStatus]    Script Date: 2/5/2562 15:21:20 ******/
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
[sp_acaGetApprovedStatus] 'CNT256100002'
*/

ALTER procedure [dbo].[sp_acaGetApprovedStatus]
(
	@id varchar(15)
)
as
begin
	select	*
	from	acaApprovedStatusContent with(nolock)
	where	id = @id
end
