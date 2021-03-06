USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaGetDegree]    Script Date: 2/5/2562 15:26:45 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Thanakrit Tae>
-- Create date: <2018-03-19>
-- Description:	<ข้อมูลระดับการศึกษา>
-- =============================================

/*
[sp_acaGetDegree] 'B'
*/

ALTER procedure [dbo].[sp_acaGetDegree]
(
	@id varchar(15)
)
as
begin
	select	*
	from	acaDegree with(nolock)
	where	id = @id
end