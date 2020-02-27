USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaTQFGetPlanOfStudy]    Script Date: 2/4/2562 13:08:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author		: <Thanakrit Tae>
-- Create date	: <2018-03-19>
-- Description	: <ข้อมูลแผนรายวิชา>
-- =============================================

/*
[sp_acaTQFGetPlanOfStudy] '1'
*/

ALTER procedure [dbo].[sp_acaTQFGetPlanOfStudy]
(
	@id varchar(15)
)
as
begin
	select	a.*
	from	acaTQFPlanOfStudy as a with(nolock)
    where id = @id
end