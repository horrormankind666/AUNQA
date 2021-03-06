USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaTQFGetListPlanOfStudy]    Script Date: 2/4/2562 12:35:58 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author		: <Thanakrit Tae>
-- Create date	: <2018-03-19>
-- Description	: <ข้อมูลรายวิชาในแผน>
-- =============================================

/*
declare @xmlData xml = N'
	<row>
	<tqfProgramId>1</tqfProgramId>
	<semester>1</semester>
	<class>1</class>
	</row>
'
exec [sp_acaTQFGetListPlanOfStudy] @xmlData
*/

ALTER procedure [dbo].[sp_acaTQFGetListPlanOfStudy]
(
	@xmlData xml
)
as
begin
	declare @docHandle int

	exec sp_xml_preparedocument @docHandle output, @xmlData

	select	*
	into	#tmpSeek
	from	openxml(@docHandle, '/row', 2)
	with (	
		id int,
		tqfProgramId int,
		semester int,
		class int
    )
	
    exec sp_xml_removedocument @docHandle

	select	 a.*
	from	 acaTQFPlanOfStudy as a with(nolock) inner join
			 #tmpSeek as b on (a.tqfProgramId = b.tqfProgramId) and (a.class = nullif(b.class, a.class)) and (a.semester = nullif(b.semester, a.semester))
	order by a.tqfProgramId,
			 a.acaYear,
			 a.semester,
			 a.class
end