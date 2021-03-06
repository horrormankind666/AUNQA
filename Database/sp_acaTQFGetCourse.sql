USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaTQFGetCourse]    Script Date: 18/10/2562 14:56:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author		: <ยุทธภูมิ ตวันนา>
-- Create date	: <๑๘/๑๐/๒๕๖๒>
-- Description	: <สำหรับแสดงข้อมูลรายวิชา>
-- Parameter
--	1. courseId	เป็น varchar รับค่ารหัสรายวิชา
-- =============================================

ALTER procedure [dbo].[sp_acaTQFGetCourse]
(
	@courseId varchar(15)
)
as
begin
	select	*
	from	acaTQFCourse with(nolock)
	where	(courseId = @courseId) and
			(cancelStatus is null)
end
