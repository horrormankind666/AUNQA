USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaTQFGetListCourse]    Script Date: 18/10/2562 12:53:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author		: <ยุทธภูมิ ตวันนา>
-- Create date	: <๑๘/๑๐/๒๕๖๒>
-- Description	: <สำหรับแสดงข้อมูลรายวิชา>
-- Parameter
--	1. facultyId	เป็น varchar รับค่ารหัสคณะ
-- =============================================

ALTER procedure [dbo].[sp_acaTQFGetListCourse]
(
	@facultyId varchar(15) = null
)
as
begin
	set @facultyId = ltrim(rtrim(isnull(@facultyId, '')))

	select	 *
	from	 acaTQFCourse with(nolock)
	where	 (facultyId = @facultyId) and
			 (dLevel = 'B') and
			 (cancelStatus is null)
	order by id
end