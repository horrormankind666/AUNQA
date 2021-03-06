USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaGetISCED]    Script Date: 2/5/2562 15:30:49 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Thanakrit Tae>
-- Create date: <2018-03-19>
-- Description:	<ข้อมูล ISCED>
-- =============================================

/*
[sp_acaGetISCED] '2'
*/

ALTER procedure [dbo].[sp_acaGetISCED]
(
	@id varchar(15)
)
as
begin
	select	*
	from	acaISCED with(nolock)
	where	id = @id
end