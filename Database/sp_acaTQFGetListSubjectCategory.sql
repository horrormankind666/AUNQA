USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaTQFGetListSubjectCategory]    Script Date: 2/4/2562 13:05:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author		: <Thanakrit Tae>
-- Create date	: <2018-03-19>
-- Description	: <ข้อมูล รายวิชาตามกลุ่มวิชา>
-- =============================================

/*
[sp_acaTQFGetListSubjectCategory] '1'
*/

ALTER procedure [dbo].[sp_acaTQFGetListSubjectCategory]
(
	@tqfProgramId varchar(15)
)
as
begin
	declare @tbCategory Table(
		id varchar(15),
		titleTh varchar(250),
		titleEn varchar(250),
		credit decimal(8,2),
		category varchar(20)
	)
	declare @xmlGeneral xml = N'
		<row>
			<id>01001</id>
			<titleTh>กลุ่มวิชาสังคมศาสตร์และมนุษยศาสตร์</titleTh>
			<credit>24</credit>
		</row>
		<row>
			<id>01002</id>
			<titleTh>กลุ่มวิชาภาษา</titleTh>
			<credit>32</credit>
		</row>
		<row>
			<id>01003</id>
			<titleTh>กลุ่มวิชาวิทยาศาสตร์และคณิตศาสตร์</titleTh>
			<credit>9</credit>
		</row>
	'
	declare @xmlSpecific xml = N'
		<row>
			<id>02001</id>
			<titleTh>วิชาแกน</titleTh>
			<credit>28</credit>
		</row>
		<row>
			<id>02002</id>
			<titleTh>วิชาเฉพาะด้าน</titleTh>
			<credit>38</credit>
		</row>
		<row>
			<id>02003</id>
			<titleTh>วิชาพื้นฐานอาชีพ </titleTh>
			<credit>12</credit>
		</row>
	'
	declare @docHandle  int

	select @xmlGeneral = (select @xmlGeneral for xml path('table'))
	select @xmlSpecific = (select @xmlSpecific for xml path('table'))
	
	-- ชุดข้อมูลกลุ่มทั่วไป
	exec sp_xml_preparedocument @docHandle output, @xmlGeneral
	
	insert @tbCategory
	(
		id,
		titleTh,
		titleEn,
		credit,
		category
	) 
	select	*,
			'general' as category
	from	openxml(@docHandle, '/table/row',2)
	with (	
		id varchar(15),
		titleTh varchar(250),
		titleEn varchar(250),
		credit decimal(8, 2)
    )
	
	-- ชุดข้อมูลกลุ่มเฉพาะ
	exec sp_xml_preparedocument @docHandle output, @xmlSpecific;
	
	insert @tbCategory
	(
		id,
		titleTh,
		titleEn,
		credit,
		category
	) 
	select	*,
			'specific' as category
	from	openxml(@docHandle, '/table/row',2)
	with (	
		id varchar(15),
		titleTh varchar(250),
		titleEn varchar(250),
		credit decimal(8, 2)
    )
	
    exec sp_xml_removedocument @docHandle

	select	 a.*,
			 b.codeEn as subjectCode,
			 b.nameTh as subjectTh,
			 b.nameEn as subjectEn,
			 b.credit,
			 b.lectureCredit,
			 b.labCredit,
			 b.seminarCredit,
			 c.category as categoryType,
			 c.id categoryId,
			 c.titleTh as categoryTh,
			 c.titleEn as categoryEn,
			 c.credit as categoryCredit
	from	 acaTQFCourseSubjectStructure as a with(nolock) inner join 
			 acaSubject as b with(nolock) on a.subjectId = b.id left join
			 @tbCategory as c on charIndex(c.id, convert(varchar, a.xmlSubjectCategoryId)) > 0
	order by b.codeEn
end