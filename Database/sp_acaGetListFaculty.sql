USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaGetListFaculty]    Script Date: 2/5/2562 15:41:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Thanakrit Tae>
-- Create date: <2015-06-10>
-- Description:	<ข้อมูลคณะในมหาวิทยาลัยทั้งหมด>
-- =============================================

/*
[sp_acaGetListFaculty] 'U0001'
*/

ALTER procedure [dbo].[sp_acaGetListFaculty]
(
	@uId varchar(5)
)
as
begin
	select	 *,
			 (case when (id = 'MU-01') then '00000' else id end) as facOrder
	from	 acaFaculty with(nolock)
	where	 cancelStatus is null
	order by facOrder
end
