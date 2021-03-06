USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaTQFGetListAppendix]    Script Date: 2/4/2562 12:21:12 ******/
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
[sp_acaTQFGetListAppendix] 'TQF02', '<row><id>OTH000057</id></row><row><id>OTH000058</id></row>'
*/

ALTER procedure [dbo].[sp_acaTQFGetListAppendix]
(
	@groupType varchar(20),
	@xmlData xml
) 
as
begin
	select	 *,
			 dbo.fnc_acaTQFGetListAppendixContent(refOtherType, @xmlData) as xmlAppendixContent
	from	 acaTQFAppendix with(nolock)
	where	 (groupType = @groupType) and
			 (cancelStatus is null)
	order by [level],
			 indent
end