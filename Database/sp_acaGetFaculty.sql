USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaGetFaculty]    Script Date: 2/5/2562 15:28:45 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Thanakrit Tae>
-- Create date: <2015-06-10>
-- Description:	<ข้อมูลคณะ>
-- =============================================

/*
[sp_acaGetFaculty] 'sc-01'
*/

ALTER procedure [dbo].[sp_acaGetFaculty]
(
	@facultyId varchar(15)
)
as
begin
	select	*
	from	acaFaculty with(nolock)
	where	id = @facultyId
end
