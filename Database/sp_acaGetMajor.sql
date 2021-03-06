USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaGetMajor]    Script Date: 2/5/2562 16:09:12 ******/
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
[sp_acaGetMajor] 'ADPM-01'
*/

ALTER procedure [dbo].[sp_acaGetMajor]
(
	@id varchar(15)
)
as
begin
	select	*
	from	acaMajor with(nolock)
	where	id = @id
end