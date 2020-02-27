USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaGetListDegree]    Script Date: 2/5/2562 15:35:16 ******/
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
[sp_acaGetListDegree]
*/

ALTER procedure [dbo].[sp_acaGetListDegree]
as
begin
	select	 *
	from	 acaDegree with(nolock)
	order by [priority]
end
