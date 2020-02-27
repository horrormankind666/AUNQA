USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaGetListCareer]    Script Date: 2/5/2562 15:34:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Thanakrit Tae>
-- Create date: <2018-03-19>
-- Description:	<ข้อมูล อาชีพ
-- =============================================

/*
[sp_acaGetListCareer]
*/

ALTER PROCEDURE [dbo].[sp_acaGetListCareer]
as
begin
	select	 POS_ID as id,
			 POS_NAME as nameTh,
			 null as nameEn
	from	 Bermuda..MUA_REF_POSITION_CAREER 
	order by nameTh
end