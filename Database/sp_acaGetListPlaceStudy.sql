USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaGetListPlaceStudy]    Script Date: 2/5/2562 16:00:32 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Thanakrit Tae>
-- Create date: <2018-03-19>
-- Description:	<ข้อมูล สถานที่>
-- =============================================

/*
[sp_acaGetListPlaceStudy] 
*/

ALTER procedure [dbo].[sp_acaGetListPlaceStudy]
as
begin	
	declare @tbList table(xmlPlaceStudy xml)

	insert @tbList(xmlPlaceStudy)
	
	select	xmlPlaceStudy
	from	acaTQFProgrammeTemp
	
	/*
	select	N'<row>
				<id />
				<code />
				<nameTH>28</nameTH>
				<nameEN>29</nameEN>
				<facultyId>RS-01</facultyId>
				<facultyCode>RS</facultyCode>
				<facultyNameTH>วิทยาลัยราชสุดา</facultyNameTH>
				<facultyNameEN>RATCHASUDA COLLEGE</facultyNameEN>
			  </row>
			  <row>
				<id />
				<code />
				<nameTH>30</nameTH>
				<nameEN>31</nameEN>
				<facultyId />
				<facultyCode />
				<facultyNameTH>32</facultyNameTH>
				<facultyNameEN>32</facultyNameEN>
			  </row>'

    declare @xmlData xml = (select xmlPlaceStudy from @tbList for xml path('table'))
	*/

	declare @xmlData xml = (
		select	(
					select	(select	xmlPlaceStudy) 
					from	@tbList for xml path(''), type
				)
				for xml path('table')		
	)

	declare @docHandle int;  
	  
	exec sp_xml_preparedocument @docHandle output, @xmlData
	 
	select	*
	into	#tmpPlace
	from	openxml(@docHandle, '/table/xmlPlaceStudy/row', 2)
	with (	
		id varchar(20),
		code varchar(20),
		nameTH varchar(250),
		nameEN varchar(250),
		facultyId varchar(15),
		facultyCode varchar(15),
		facultyNameTH varchar(200),
		facultyNameEN varchar(200)
    )
	
    exec sp_xml_removedocument @docHandle
	
	select	*
	from #tmpPlace
end
