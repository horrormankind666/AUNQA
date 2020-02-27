USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaGetBranch]    Script Date: 2/5/2562 15:24:11 ******/
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
[sp_acaGetBranch] 'ART-02'
*/

ALTER procedure [dbo].[sp_acaGetBranch]
(
	@id varchar(15)
)
as
begin
	select	*
	from	acaBranch with(nolock)
	where	id=@id
end
