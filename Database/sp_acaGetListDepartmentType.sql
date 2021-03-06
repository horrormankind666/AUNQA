USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaGetListDepartmentType]    Script Date: 2/5/2562 15:40:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author		: <ยุทธภูมิ ตวันนา>
-- Create date	: <๓๐/๐๔/๒๕๖๑>
-- Description	: <สำหรับแสดงข้อมูลประเภทของภาควิชา>
-- =============================================

/*
[sp_acaGetListDepartmentType]
*/

ALTER procedure [dbo].[sp_acaGetListDepartmentType]
as
begin
	set concat_null_yields_null off

	select	 *
	from	 acaDepartmentType as acadpt with(nolock)
	where	 acadpt.cancelStatus is null
	order by acadpt.id
end