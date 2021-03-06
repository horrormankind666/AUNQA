USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaTQFGetAppendix]    Script Date: 2/4/2562 12:20:05 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author		: <Thanakrit Tae>
-- Create date	: <2018-03-19>
-- Description	: <ข้อมูล Appendix>
-- =============================================

/*
[sp_acaTQFGetAppendix] '14', '<row><id>OTH000057</id></row><row><id>OTH000058</id></row>'
 */

ALTER procedure [dbo].[sp_acaTQFGetAppendix]
(
	@id varchar(15),
	@xmlData xml 
)
as
begin
	select	*,
			dbo.fnc_acaTQFGetListAppendixContent(refOtherType, @xmlData) as xmlAppendixContent
	from	acaTQFAppendix with(nolock)
	where	id = @id
end