USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaGetListISCED]    Script Date: 2/5/2562 15:55:26 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Thanakrit Tae>
-- Create date: <2018-03-19>
-- Description:	<ข้อมูลรหัส ISCED>
-- =============================================

/*
[sp_acaGetListISCED]
*/

ALTER procedure [dbo].[sp_acaGetListISCED]
as
begin
	select	 *
	from	 acaISCED with(nolock)
	where	 (cancelStatus is null) and
			 (activeStatus = 'Y')
	order by iscedId
end
