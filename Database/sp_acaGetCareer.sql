USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaGetCareer]    Script Date: 2/5/2562 15:25:12 ******/
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
[sp_acaGetCareer] '122976'
*/

ALTER procedure [dbo].[sp_acaGetCareer]
(
	@id varchar(15)
)
as
begin
	select	 POS_ID as id,
			 POS_NAME as nameTh,
			 null as nameEn
	from	 Bermuda..MUA_REF_POSITION_CAREER
	where	 POS_ID = @id 
	order by nameTh
end