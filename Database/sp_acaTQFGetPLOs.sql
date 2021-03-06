USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaTQFGetPLOs]    Script Date: 2/4/2562 13:09:32 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author		: <Thanakrit Tae>
-- Create date	: <2018-03-19>
-- Description	: <ข้อมูล PLOs (Program Learnning Outcome)>
-- =============================================

/*
[sp_acaTQFGetPLOs] '1'
*/

ALTER procedure [dbo].[sp_acaTQFGetPLOs]
(
	@id varchar(15)
)
as
begin
	select	*
	from	acaTQFPLOs with(nolock)
	where	id = @id
end