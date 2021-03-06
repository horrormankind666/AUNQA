USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaGetListInputType]    Script Date: 2/5/2562 15:43:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Thanakrit Tae>
-- Create date: <2018-03-19>
-- Description:	<ข้อมูลชุดหัวข้อ Input>
-- =============================================

/*
[sp_acaGetListInputType] 'programLanguages', '', '', 'B'
[sp_acaGetListInputType] 'programAdmissionType', '', '', 'B'
[sp_acaGetListInputType] 'cooperationType', '', '', 'B'
[sp_acaGetListInputType] 'cooperationPattern', '', '', 'B'
[sp_acaGetListInputType] 'programGraduateType', '', '', 'B'
[sp_acaGetListInputType] 'externalSituation', '', '', 'B'
[sp_acaGetListInputType] 'impactCurriculum', '', '', 'B'
[sp_acaGetListInputType] 'refOtherCourses', '', '', 'B'
[sp_acaGetListInputType] '', '', '', 'B'

select	* 
from	acaTQFOtherType 

declare @xmlData xml = N'
<row>
  <id>OTH000013</id>
  <value>ONE</value>
</row>
<row>
  <id>OTH000014</id>
  <value>MORE</value>
  <remark>What remark</remark>
</row>
<row>
  <id>OTH000031</id>
  <value>จะต้องเก่งโคตรๆ นะจะบอกให้</value>
</row>
'
execute [sp_acaGetListInputType] 'devMng', '2560', @xmlData, 'B'
*/

ALTER procedure [dbo].[sp_acaGetListInputType]
(
	@contentType varchar(50),
	@curYear varchar(4),
	@xmlData xml,
	@dLevel varchar(1)
)
as
begin
	declare @xmlNewData xml = (select @xmlData for xml path('table'))
	declare @docHandle int

	exec sp_xml_preparedocument @docHandle output, @xmlNewData

	select	*
	into	#tmpData
	from	openxml(@docHandle, '/table/row', 2)
	with (	
		id varchar(15),
		value varchar(250),
		remark varchar(250)
    )
	
    exec sp_xml_removedocument @docHandle

	select	*
	into	#tmpInput
	from	acaTQFOtherType with(nolock)
	where	(cancelStatus is null) and
			(activeStatus = 'Y') and
			(len(isnull(@contentType, '')) = 0 or groupType = @contentType) and
			(dLevel = @dLevel) and
			(isnull(startYear,@curYear) <= @curYear) and
			(isnULL(endYear,@curYear) >= @curYear)
     
    update #tmpInput set 
		selected	= (case when (a.input in ('checkbox', 'radio')) then 'Y' else null end),
		remark		= (case when (a.isRemark = 'Y') then nullif(b.remark, '') else null end),
        value		= b.value
	from	#tmpInput as a inner join
			#tmpData as b on a.id = b.id

    select	 * 
	from	 #tmpInput
	order by groupType, indent
end