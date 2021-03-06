USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaGetInstructor]    Script Date: 25/9/2562 14:22:00 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Thanakrit Tae>
-- Create date: <2018-03-19>
-- Description:	<ข้อมูล อาจารย์>
-- =============================================

/*
[sp_acaGetInstructor] '4212'
*/

ALTER procedure [dbo].[sp_acaGetInstructor]
(
	@id varchar(15)
)
as
begin
	declare	@strBlank varchar(50) = '----------**********.........0.0000000000000000000'

	select	 a.id,
			 a.personId,
			 a.titleDisplay,
			 a.position,			 
			 b.firstName,
			 b.middleName,
			 b.lastName,
			 (case when len(isnull(b.enFirstName, '')) = 0 then b.firstName else b.enFirstName end) as firstNameEN,
			 (case when len(isnull(b.enMiddleName, '')) = 0 then b.middleName else b.enMiddleName end) as middleNameEN,
			 (case when len(isnull(b.enLastName, '')) = 0 then b.lastName else b.enLastName end) as lastNameEN,
			 a.insName,
			 a.facultyId,
			 c.nameTh as facultyNameTH,
			 c.nameEn as facultyNameEN,
			 a.depId,
			 d.nameTh as departmentNameTH,
			 d.nameEn as departmentNameEN,			 
			 (case when (a.type = 'I' or a.type = 'P') then a.type else 'N/A' end) as instructorType,
			 (
				case (a.type) 
					when 'I' then 'อาจารย์ภายนอก' 
					when 'P' then 'อาจารย์ประจำ'
				else null
				end
			 ) as instructorTypeNameTH,
			 (
				case (a.type) 
					when 'I' then 'Lecturer' 
					when 'P' then 'Instructor'
				else null
				end
			 ) as instructorTypeNameEN,
			 (case when (a.addrContact is not null and len(a.addrContact) > 0 and charindex(a.addrContact, @strBlank) = 0) then a.addrContact else null end) as addrContact,
			 (case when (a.addrOffice is not null and len(a.addrOffice) > 0 and charindex(a.addrOffice, @strBlank) = 0) then a.addrOffice else null end) as addrOffice,
			 (case when (a.tel is not null and len(a.tel) > 0 and charindex(a.tel, @strBlank) = 0) then a.tel else null end) as tel,
			 (case when (a.email is not null and len(a.email) > 0 and charindex(a.email, @strBlank) = 0) then a.email else null end) as email,
			 a.hri_id as HRiId
	into	 #temp
	from	 curInstructor as a with(nolock) left join
			 perPerson as b with(nolock)  on a.personId = b.id left join
			 acaFaculty as c with(nolock) on a.facultyId = c.id left join
			 acaDepartment as d with(nolock) on c.id = d.facultyId and a.depId = d.id
	where	 a.id = @id

	select	*,
			(isnull(firstName, '') + ' ' + (case when (len(isnull(middleName, '')) > 0) then (middleName + ' ') else '' end) + isnull(lastName, '')) as fullNameTH, 
			(isnull(firstNameEN, '') + ' ' + (case when (len(isnull(middleNameEN, '')) > 0) then (middleNameEN + ' ') else '' end) + isnull(lastNameEN, '')) as fullNameEN
	from	#temp
end