USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaGetListMajor]    Script Date: 2/5/2562 15:56:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Thanakrit Tae>
-- Create date: <2018-03-19>
-- Description:	<ข้อมูลสาขาวิชา>
-- =============================================

/*
declare @xmlData xml = '
	<table>
		<row><facultyId>SI-01</facultyId><majorId>SIAS-01</majorId></row>
		<row><facultyId>SI-01</facultyId><majorId>SIBA-01</majorId></row>
		<row><facultyId>EG-01</facultyId><majorId></majorId></row>
	</table>
'
exec [sp_acaGetListMajor] @xmlData
*/

ALTER procedure [dbo].[sp_acaGetListMajor]
(
	@xmlData xml
)
as
begin
	declare @docHandle int
	
	exec sp_xml_preparedocument @docHandle output, @xmlData

	select *
	into	#tmpMajor
	from	openxml(@docHandle, 'table/row', 2)
	with (	
		facultyId varchar(15),
		majorId varchar(15)
    )
	
    exec sp_xml_removedocument @docHandle
	
	select	 a.*
	from	 acaMajor as a with(nolock) inner join
			 #tmpMajor as b on a.facultyId = b.facultyId and a.id = isnull(nullif(b.majorId, ''), a.id)
	where	 a.cancelStatus is null
	order by codeEn
end
