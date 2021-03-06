USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaGetListDepartment]    Script Date: 2/5/2562 15:36:03 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Thanakrit Tae>
-- Create date: <2018-03-19>
-- Description:	<ข้อมูลภาควิชา>
-- =============================================

/*
declare @xmlData xml = '
	<table>
		<row><facultyId>DT-01</facultyId></row>
	</table>'

exec [sp_acaGetListDepartment] @xmlData
*/

ALTER procedure [dbo].[sp_acaGetListDepartment]
(
	@xmlData xml
)
as
begin
	declare @docHandle int;  

	exec sp_xml_preparedocument @docHandle output, @xmlData

	select	*
	into	#tmpDep
	from	openxml(@docHandle, 'table/row', 2)
	with (	
		facultyId varchar(15),
		depId varchar(15)
    )
	
    exec sp_xml_removedocument @docHandle

	select	 a.*,
			 convert(varchar, a.startDate, 103) as startDate1,
			 convert(varchar, a.endDate, 103) as endDate1
	from	 acaDepartment as a with(nolock) inner join
			 #tmpDep as b on a.facultyId = b.facultyId and a.id = isnull(nullif(b.depId, ''), a.id)
	where	 a.cancelStatus is null
	order by depCode
end
