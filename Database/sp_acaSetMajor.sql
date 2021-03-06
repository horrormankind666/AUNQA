USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaSetMajor]    Script Date: 14/8/2562 11:30:57 ******/
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
declare @xmlData xml = '
<row>
<id></id>
<uId>U0001</uId>
<codeEn>ADMP</codeEn>
<nameTh>ภาษาฝรั่งเศส</nameTh>
<nameEn>French</nameEn>
<abbrevTh>ภาษาฝรั่งเศส</abbrevTh> 
<abbrevTh>Fr.</abbrevTh>
<facultyId>LA-01</facultyId>
</row>
'

declare @xmlUser xml = '
<row>
<username>thanakrit.tae</username>
<ip>10.43.4.3</ip>
</row>
'

declare @mode varchar(10) = 'add'

exec [sp_acaSetMajor] @xmlData, @xmlUser, @mode
*/

ALTER procedure [dbo].[sp_acaSetMajor]
(
	@xmlData xml,
	@xmlUser xml,
	@mode varchar(20)
)
as
begin
	declare @uId varchar(5),
			@facultyId varchar(15),
			@majorId varchar(15),
			@majorCode varchar(15),			
			@nameTh varchar(150),
			@nameEn varchar(150),
			@abbrevTh varchar(100),
			@abbrevEn varchar(100)	
	declare @verifyStatus varchar(2),
			@verifyRemark varchar(3000)
	declare @username varchar(150) = '',
			@ip varchar(100) = '',
			@data nvarchar(max) = ''
	declare @xmlNewData xml = (select @xmlData for xml path('table'))
	dECLARE @docHandle int
	
	exec sp_xml_preparedocument @docHandle output, @xmlNewData

	select	*
	into	#tmpMajor
	from	openxml(@docHandle , '/table/row', 2)
	with (	
		id varchar(15),
		[uId] varchar(5),
		facultyId varchar(15),
		codeEn varchar(15),
		nameTh varchar(150),
		nameEn varchar(150),
		abbrevTh varchar(100),
		abbrevEn varchar(100),		
		verifyStatus varchar(2),
		verifyRemark varchar(3000)
    )
	
	exec sp_xml_preparedocument @docHandle output, @xmlUser

	select	*
	into	#tmpUser
	from	openxml(@docHandle , '/row', 2)
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
					abbrevEn					
			from	#tmpMajor
			where	isnull(id,'') = '' 

		open rs

		fetch next from rs into 
			@uId,
			@facultyId,
			@majorCode,			
			@nameTh,
			@nameEn,
			@abbrevTh,
			@abbrevEn			

		while @@fetch_status = 0
		begin
			set @majorId = dbo.fnc_acaGetMajorId(@majorCode)

			insert acaMajor
			(
				[id],
				[uId],
				[facultyId],
				[codeEn],				
				[nameTh],
				[nameEn],
				[abbrevTh],
				[abbrevEn],
				[createdDate],
				[createdBy]				
			)
			select	dbo.fnc_utilStringCompare(isnull(@majorId, ''), '', @majorId, null),
					dbo.fnc_utilStringCompare(isnull(@uId, ''), '', @uId, null),
					dbo.fnc_utilStringCompare(isnull(@facultyId, ''), '', @facultyId, null),
					dbo.fnc_utilStringCompare(isnull(@majorCode, ''), '', @majorCode, null),					
					dbo.fnc_utilStringCompare(isnull(@nameTh, ''), '', @nameTh, null),
					dbo.fnc_utilStringCompare(isnull(@nameEn, ''), '', @nameEn, null),
					dbo.fnc_utilStringCompare(isnull(@abbrevTh, ''), '', @abbrevTh, null),
					dbo.fnc_utilStringCompare(isnull(@abbrevEn, ''), '', @abbrevEn, null),
					getdate(),
					@username

			set @data += N'{"id": "' + @majorId + '"}, ' 

			fetch next from rs into 
				@uId,
				@facultyId,
				@majorCode,
				@nameTh,
				@nameEn,
				@abbrevTh,
				@abbrevEn				
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
		update acaMajor set
			nameTh		= dbo.fnc_utilStringCompare(isnull(b.nameTh, a.nameTh), isnull(a.nameTh, ''), b.nameTh, a.nameTh),
			nameEn		= dbo.fnc_utilStringCompare(isnull(b.nameEn, a.nameEn), isnull(a.nameEn, ''), b.nameEn, a.nameEn),
			abbrevTh	= dbo.fnc_utilStringCompare(isnull(b.abbrevTh, a.abbrevTh), isnull(a.abbrevTh, ''), b.abbrevTh, a.abbrevTh),
			abbrevEn	= dbo.fnc_utilStringCompare(isnull(b.abbrevEn, a.abbrevEn), isnull(a.abbrevEn, ''), b.abbrevEn, a.abbrevEn),
			createdBy	= @username,
			createdDate	= getdate()
		from	acaMajor as a inner join 
				#tmpMajor as b on a.id = b.id
		
		select	@data += '{"id": "' + id + '"}, '
		from	#tmpMajor

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
		update acaMajor set
			cancelStatus	= 'Y',
			cancelBy		= @username,
			cancelDate		= getdate()
		from	acaMajor as a inner join
				#tmpMajor as b on a.id = b.id

		select	@data += '{"id": "' + id + '"}, '
		from	#tmpMajor

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
		update acaMajor set
			verifyStatus	= dbo.fnc_utilStringCompare(isnull(b.verifyStatus, a.verifyStatus), isnull(a.verifyStatus, ''), b.verifyStatus, a.verifyStatus),
			verifyRemark	= dbo.fnc_utilStringCompare(isnull(b.verifyRemark, a.verifyRemark), isnull(a.verifyRemark, ''), b.verifyRemark, a.verifyRemark),
			verifyBy		= @username,
			verifyDate		= getdate()
		from	acaMajor as a inner join
				#tmpMajor as b on a.id = b.id

		select	@data += '{"id": "' + id + '"}, '
		from	#tmpMajor

	    select	@xmlData as xmlData,
				@xmlUser as xmlUser,
				@mode as mode,
				'0' as resCode,
				'Success' as resMessage,
				null as resErrorNumber,
				@data jsonRes
	end
end