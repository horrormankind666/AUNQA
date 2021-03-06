USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaSetDepartment]    Script Date: 14/8/2562 11:30:05 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,thanakrit.tae>
-- Create date: <Create Date,21-6-2561,>
-- Description:	<Description,,add edit del verify to table acaDepartment>
-- =============================================

/*
declare @xmlData xml = '
<row>
<id></id>
<uId>U0001</uId>
<codeEn>LACH</codeEn>
<nameTh>ภาษาจีน22</nameTh>
<nameEn>CHINESE</nameEn>
<abbrevTh>ภาษาจีน</abbrevTh> 
<abbrevEn>CHINESE</abbrevEn>
<depType>3</depType>
<facultyId>LA-01</facultyId>
</row>
'
declare @xmlUser xml = '
<row>
<username>thanakrit.tae</username>
<ip>10.43.4.3</ip>
</row>
'

declare @mode varchar(10) ='add'

exec [sp_acaSetDepartment] @xmlData, @xmlUser, @mode
*/

ALTER procedure [dbo].[sp_acaSetDepartment]
(
	@xmlData xml,
	@xmlUser xml,
	@mode varchar(20)
)
as
begin
	declare @uId varchar(5),
			@facultyId varchar(15),
			@depId varchar(15),
			@depCode varchar(15),			
			@nameTh varchar(150),
			@nameEn varchar(150),
			@abbrevTh varchar(100),
			@abbrevEn varchar(100),
			@depType varchar(5),			
			@startDate varchar(10),
			@endDate varchar(10)
	declare @verifyStatus varchar(2),
			@verifyRemark varchar(3000)
	declare @username varchar(150) = '',
			@ip varchar(100) = '',
			@data nvarchar(max) = ''
	declare @xmlNewData xml = (select @xmlData for xml path('table'))
	dECLARE @docHandle int
	
	exec sp_xml_preparedocument @docHandle output, @xmlNewData
	
	select	*
	into	#tmpDep
	from	openxml(@docHandle, '/table/row', 2)
	with (	
		id varchar(15),
		[uId] varchar(5),
		facultyId varchar(15),
		codeEn varchar(15),
		nameTh varchar(150),
	    nameEn varchar(150),
		abbrevTh varchar(100),
		abbrevEn varchar(100),
		depType varchar(5),		
		startDate varchar(10),
		endDate varchar(10),
		verifyStatus varchar(2),
		verifyRemark varchar(3000)
    )
	
	exec sp_xml_preparedocument @docHandle output, @xmlUser
	
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
			select	[uId],
					facultyId,
					codeEn,
					nameTh,
					nameEn,
					abbrevTh,
					abbrevEn,
					depType,					
					startDate,
					endDate
			from	#tmpDep
			where	isnull(id, '') = '' 

		open rs

		fetch next from rs into 
			@uId,
			@facultyId,
			@depCode,			
			@nameTh,
			@nameEn,
			@abbrevTh,
			@abbrevEn,
			@depType,			
			@startDate,
			@endDate

		while @@fetch_status = 0
		begin
			set @depId = dbo.fnc_acaGetDepartmentId(@depCode)

			insert acaDepartment
			(
				 [id],
				 [uId],
				 [facultyId],
				 [depCode],				 
				 [nameTh],
				 [nameEn],
				 [abbrevTh],
				 [abbrevEn],
				 [startDate],
				 [endDate],
				 [type],
				 [createdBy],
				 [createdDate]
			)
			select	dbo.fnc_utilStringCompare(isnull(@depId, ''), '', @depId, null),
					dbo.fnc_utilStringCompare(isnull(@uId, ''), '', @uId, null),
					dbo.fnc_utilStringCompare(isnull(@facultyId, ''), '', @facultyId, null),
					dbo.fnc_utilStringCompare(isnull(@depCode, ''), '', @depCode, null),					
					dbo.fnc_utilStringCompare(isnull(@nameTh, ''), '', @nameTh, null),
					dbo.fnc_utilStringCompare(isnull(@nameEn, ''), '', @nameEn, null),
					dbo.fnc_utilStringCompare(isnull(@abbrevTh, ''), '', @abbrevTh, null),
					dbo.fnc_utilStringCompare(isnull(@abbrevEn, ''), '', @abbrevEn, null),
					dbo.fnc_utilDateTimeCompare(isnull(convert(datetime, @startDate, 103), ''), '', convert(datetime, @startDate, 103), null),
					dbo.fnc_utilDateTimeCompare(isnull(convert(datetime, @endDate, 103), ''), '', convert(datetime, @endDate, 103), null),
					dbo.fnc_utilStringCompare(isnull(@depType, ''), '', @depType, null),
					@username,
					getdate()					

			set @data += N'{"id": "' + @depId + '"}, ' 

			fetch next from rs into 
				@uId,
				@facultyId,
				@depCode,				
				@nameTh,
				@nameEn,
				@abbrevTh,
				@abbrevEn,
				@depType,				
				@startDate,
				@endDate
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
		update acaDepartment set
			nameTh		= dbo.fnc_utilStringCompare(isnull(b.nameTh, a.nameTh), isnull(a.nameTh, ''), b.nameTh, a.nameTh),
			nameEn		= dbo.fnc_utilStringCompare(isnull(b.nameEn, a.nameEn), isnull(a.nameEn, ''), b.nameEn, a.nameEn),
			abbrevTh	= dbo.fnc_utilStringCompare(isnull(b.abbrevTh, a.abbrevTh), isnull(a.abbrevTh, ''), b.abbrevTh, a.abbrevTh),
			abbrevEn	= dbo.fnc_utilStringCompare(isnull(b.abbrevEn, a.abbrevEn), isnull(a.abbrevEn, ''), b.abbrevEn, a.abbrevEn),
			[type]		= dbo.fnc_utilStringCompare(isnull(b.depType, a.[type]), isnull(a.[type], ''), b.depType, a.[type]),
			startDate	= dbo.fnc_utilDateTimeCompare(isnull(convert(datetime, b.startDate, 103), a.endDate), isnull(a.startDate, ''), convert(datetime, b.startDate, 103), a.startDate),
			endDate		= dbo.fnc_utilDateTimeCompare(isnull(convert(datetime, b.endDate, 103), a.endDate), isnull(a.endDate, ''), convert(datetime, b.endDate, 103), a.endDate),
			createdBy	= @username,
			createdDate	= getdate()
		from	acaDepartment as a inner join
				#tmpDep as b on a.id = b.id
		
		select	@data += '{"id": "' + id + '"}, '
		from	#tmpDep

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
		update acaDepartment set
			cancelStatus	= 'Y',
			cancelBy		= @username,
			cancelDate		= getdate()
		from	acaDepartment as a inner join
				#tmpDep as b on a.id = b.id

		select	@data += '{"id": "' + id + '"}, '
		from	#tmpDep

	    select	@xmlData as xmlData,
				@xmlUser as xmlUser,
				@mode as mode,
				'0' as resCode,
				'Success' as resMessage,
				null as resErrorNumber,
				@data as jsonRes
	end

	if (@mode = 'verify')
	begin
		update acaDepartment set
			verifyStatus	= dbo.fnc_utilStringCompare(isnull(b.verifyStatus, a.verifyStatus), isnull(a.verifyStatus, ''), b.verifyStatus, a.verifyStatus),
			verifyRemark	= dbo.fnc_utilStringCompare(isnull(b.verifyRemark, a.verifyRemark), isnull(a.verifyRemark, ''), b.verifyRemark, a.verifyRemark),
			verifyBy		= @username,
			verifyDate		= getdate()
		from	acaDepartment as a inner join
				#tmpDep as b on a.id = b.id

		select	@data += '{"id": "' + id + '"}, '
		from	#tmpDep

	    select	@xmlData as xmlData,
				@xmlUser as xmlUser,
				@mode as mode,
				'0' as resCode,
				'Success' as resMessage,
				null as resErrorNumber,
				@data as jsonRes
	end
end





