USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaTQFGetCourseCreditStructure]    Script Date: 2/4/2562 12:18:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author		: <Thanakrit Tae>
-- Create date	: <2018-03-19>
-- Description	: <ข้อมูลโครงสร้างหน่วยกิต>
-- =============================================

/*
[sp_acaTQFGetCourseCreditStructure] '1'
*/

ALTER procedure [dbo].[sp_acaTQFGetCourseCreditStructure]
(
	@id varchar(15)
)
as
begin
	select	*
	from	acaTQFCourseCreditStructure with(nolock)
	where	id = @id
end