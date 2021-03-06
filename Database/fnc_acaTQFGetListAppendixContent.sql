USE [Infinity]
GO
/****** Object:  UserDefinedFunction [dbo].[fnc_acaTQFGetListAppendixContent]    Script Date: 2/4/2562 12:12:58 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author		: <Author,,Name>
-- Create date	: <Create Date, ,>
-- Description	: <Description, ,>
-- =============================================

/*
declare @xmlData xml

set @xmlData = '<row><id>OTH000057</id></row><row><id>OTH000058</id></row>'

select dbo.fnc_acaTQFGetListAppendixContent('stractegyTeach', '<row><id>OTH000057</id></row><row><id>OTH000058</id></row>')
*/

ALTER function [dbo].[fnc_acaTQFGetListAppendixContent]
(
	@groupType varchar(20),
	@xmlData xml
)
returns xml
as
begin
	declare @xmlAppendixContent xml
	declare @tbChk table(othId varchar(15))

	insert	@tbChk(othId)
	select	T.c.value('.','varchar(15)') as result  
	from	@xmlData.nodes('/row/id') T(c) 

	set @xmlAppendixContent = (
		select	a.*,
				(case when b.othId is null then 'N' else 'Y' end) as chkStatus
		from	acaTQFOtherType as a left join
				@tbChk as b on a.id = b.othId
		where	(a.groupType = @groupType) and
				(a.cancelStatus is null)
		for xml path('row')
	)

	--Return the result of the function
	return @xmlAppendixContent
end
