USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaTQFGetDevelopPlan]    Script Date: 2/4/2562 12:20:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author		: <Thanakrit.tae>
-- Create date	: <2018-04-09>
-- Description	: <รายการแผนการพัฒนาปรับปรุง>
-- =============================================

/*
[sp_acaTQFGetDevelopPlan] '1'
*/

ALTER procedure [dbo].[sp_acaTQFGetDevelopPlan]
(
    @id varchar(15)
)
as
begin
	select	*
	from	acaTQFDevelopPlan with(nolock)
	where	id = @id
END
