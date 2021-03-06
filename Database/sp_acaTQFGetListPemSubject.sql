USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaTQFGetListPemSubject]    Script Date: 2/4/2562 12:32:59 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author		: <>
-- Create date	: <>
-- Description	: <>
-- =============================================

/*
[sp_acaTQFGetListPemSubject] 'thanakrit.tae', 'si-01', 'Y'
*/

ALTER procedure [dbo].[sp_acaTQFGetListPemSubject]  
(
	@username varchar(50),
	@facultyId varchar(15),
	@isTQFAdmin varchar(1)
)
as
begin
	if (@isTQFAdmin = 'Y')
		select	 id as subjectId,
				 codeEn as subjectCode
		from	 acaSubject
		where	 facultyOwner = @facultyId
		order by codeEn
	else
		select	 top 5
	 			 id as subjectId,
				 codeEn as subjectCode
		from	 acaSubject
		where	 facultyOwner = @facultyId
		order by codeEn	
end
