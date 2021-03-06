USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaSetFaculty]    Script Date: 13/5/2562 15:22:35 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================

/*
declare @xmlData nvarchar(max) = '
<row>
<id>EG-01</id>
<uId>U0001</uId>
<facultyCode>EG</facultyCode>
<nameTh>คณะวิศวกรรมศาสตร์1</nameTh>
<nameEn>FACULTY OF ENGINEERING</nameEn>
<abbrevTh>วิศวฯ</abbrevTh>
<conciseTh>คณะวิศวกรรมศาสตร์</conciseTh>
<conciseEn>FACULTY OF ENGINEERING</conciseEn>
<branchId>ST-01</branchId>
</row>
<row>
<id>AM-01</id>
<uId>U0001</uId>
<facultyCode>EG</facultyCode>
<nameTh>คณะวิศวกรรมศาสตร์3</nameTh>
<nameEn>FACULTY OF ENGINEERING</nameEn>
<abbrevTh>วิศวฯ</abbrevTh>
<conciseTh>คณะวิศวกรรมศาสตร์</conciseTh>
<conciseEn>FACULTY OF ENGINEERING</conciseEn>
<branchId>ST-01</branchId>
</row>
'
set @xmlData = '
<row>
<id>ZZ-01</id>
</row>'

declare @xmlUser xml = '
<row>
<username>thanakrit.tae</username>
<ip>10.43.4.3</ip>
</row>
'

declare @mode varchar(10) = 'del'

exec [sp_acaSetFaculty] @xmlData, @xmlUser, @mode
*/

ALTER procedure [dbo].[sp_acaSetFaculty]
(
	@xmlData xml,
	@xmlUser xml,
	@mode varchar(20)
)
as
begin
	declare @facultyId varchar(15),
			@facultyCode varchar(15),
			@nameTh varchar(200),
			@nameEn varchar(200),
			@abbrevTh varchar(150),
			@abbrevEn varchar(150),
			@conciseTh varchar(150),
			@conciseEn varchar(150),
			@branchId varchar(15)
	declare @username varchar(150),
			@ip varchar(100),
			@data nvarchar(max) = ''
    declare @xmlNewData xml = (select @xmlData for xml path('table'))	
	declare @docHandle int

	exec sp_xml_preparedocument @docHandle output, @xmlNewData

	select	*
	into	#tmpFac
	from	openxml(@docHandle, '/table/row', 2)
	with (	
		id varchar(15),
		uId varchar(5),
		facultyCode varchar(15),
		nameTh varchar(200),
	    nameEn varchar(200),
		abbrevTh varchar(150),
		abbrevEn varchar(150),
		conciseTh varchar(150),
		conciseEn varchar(150),
		branchId varchar(15)
    )
	
	exec sp_xml_preparedocument @docHandle  OUTPUT, @xmlUser

	select	*
	into	#tmpUser
	from	openxml(@docHandle, '/row', 2)
	with (	
		username varchar(150),
		ip varchar(100)
    )
	
    exec sp_xml_removedocument @docHandle

	select	@username = username,
			@ip = ip
	from	#tmpUser

	if (@mode = 'add')
	begin
		declare rs cursor for
			select	facultyCode,
					nameTh,
					nameEn,
					abbrevTh,
					abbrevEn,
					conciseTh,
					conciseEn,
					branchId 
			from	#tmpFac
			where	isnull(id, '') = '' 

		open rs

		fetch next from rs into
			@facultyCode,
			@nameTh,
			@nameEn,
			@abbrevTh,
			@abbrevEn,
			@conciseTh,
			@conciseEn,
			@branchId 

		while @@fetch_status = 0
		begin
			set @facultyId = dbo.fnc_acaGetFacultyId(@facultyCode)
				  
			insert acaFaculty
			(
				 [id],
				 [uId],
				 [facultyCode],
				 [nameTh],
				 [nameEn],
				 [abbrevTh],
				 [abbrevEn],
				 [conciseTh],
				 [conciseEn],
				 [branchId],
				 [createdBy],
				 [createdDate]
			)
			select	dbo.fnc_utilStringCompare(isnull(@facultyId, ''), '', @facultyId, null),
					'U0001',
					dbo.fnc_utilStringCompare(isnull(@facultyCode, ''), '', @facultyCode, null),
					dbo.fnc_utilStringCompare(isnull(@nameTh, ''), '', @nameTh, null),
					dbo.fnc_utilStringCompare(isnull(@nameEn, ''), '', @nameEn, null), 
					dbo.fnc_utilStringCompare(isnull(@abbrevTh, ''), '', @abbrevTh, null),
					dbo.fnc_utilStringCompare(isnull(@abbrevEn, ''), '', @abbrevEn, null),
					dbo.fnc_utilStringCompare(isnull(@conciseTh, ''), '', @conciseTh, null),
					dbo.fnc_utilStringCompare(isnull(@conciseEn, ''), '', @conciseEn, null),
					dbo.fnc_utilStringCompare(isnull(@branchId, ''), '', @branchId, null),
					@username,
					getdate()					

			set @data += N'{"id": "' + @facultyId + '"}, ' 

			fetch next from rs into
				@facultyCode,
				@nameTh,
				@nameEn,
				@abbrevTh,
				@abbrevEn,
				@conciseTh,
				@conciseEn,
				@branchId 
		end

		close rs
		deallocate rs
		
		select	@xmlData as xmlData,
				@xmlUser as xmlUser,
				@mode as mode,
				'0' as resCode,
				'Success' as resMessage,
				null as resErrorNumber,
				@data as jsonRes
	end

	if (@mode = 'edit')
	begin		
		update acaFaculty set
			nameTh		= dbo.fnc_utilStringCompare(isnull(b.nameTh, a.nameTh), isnull(a.nameTh, ''), b.nameTh, a.nameTh),
			nameEn		= dbo.fnc_utilStringCompare(isnull(b.nameEn, a.nameEn), isnull(a.nameEn, ''), b.nameEn, a.nameEn),
			abbrevTh	= dbo.fnc_utilStringCompare(isnull(b.abbrevTh, a.abbrevTh), isnull(a.abbrevTh, ''), b.abbrevTh, a.abbrevTh),
			abbrevEn	= dbo.fnc_utilStringCompare(isnull(b.abbrevEn, a.abbrevEn), isnull(a.abbrevEn, ''), b.abbrevEn, a.abbrevEn),
			conciseTh	= dbo.fnc_utilStringCompare(isnull(b.conciseTh, a.conciseTh), isnull(a.conciseTh, ''), b.conciseTh, a.conciseTh),
			conciseEn	= dbo.fnc_utilStringCompare(isnull(b.conciseEn, a.conciseEn), isnull(a.conciseEn, ''), b.conciseEn, a.conciseEn),
			branchId	= dbo.fnc_utilStringCompare(isnull(b.branchId, a.branchId), isnull(a.branchId, ''), b.branchId, a.branchId),
			createdBy	= @username,
			createdDate	= getdate()
		from	acaFaculty as a inner join
				#tmpFac as b on a.id = b.id

		select	@data += '{"id": "' + id + '"}, '
		from	#tmpFac

	    select	@xmlData as xmlData,
				@xmlUser as xmlUser,
				@mode as mode,
				'0' as resCode,
				'Success' as resMessage,
				null as resErrorNumber,
				@data as jsonRes
	end

	if (@mode = 'del')
	begin
		update acaFaculty set
			cancelStatus	= 'Y',
			cancelBy		= @username,
			cancelDate		= getdate()
		from	acaFaculty as a inner join
				#tmpFac as b on a.id = b.id

		select	@data += '{"id": "' + id + '"}, '
		from	#tmpFac
		
	    select	@xmlData as xmlData,
				@xmlUser as xmlUser,
				@mode as mode,
				'0' as resCode,
				'Success' as resMessage,
				null as resErrorNumber,
				@data as jsonRes
	end
end