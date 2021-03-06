USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaTQFSetProgramme]    Script Date: 5/11/2563 12:13:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author		: <ยุทธภูมิ ตวันนา>
-- Create date	: <๐๕/๑๑/๒๕๖๓>
-- Description	: <>
-- =============================================

/*
declare @xmlData xml = '
<row>
<programId>AMAGB-002-B</programId>
<courseYear>2558</courseYear>
<cancelStatus>Y</cancelStatus>
</row>
'
declare @xmlUser xml = '
<row>
<username>yutthaphoom.taw</username>
<ip>10.43.4.22</ip>
</row>
'
declare @mode varchar(20) = 'setcancelstatus'
declare @groupType varchar(20) = 'academic'

exec sp_acaTQFSetProgramme @xmlData, @xmlUser, @mode, @groupType

declare @xmlData xml = '
<row>
<programId>AMAGB-002-B</programId>
<courseYear>2558</courseYear>
</row>
'
declare @xmlUser xml = '
<row>
<username>yutthaphoom.taw</username>
<ip>10.43.4.22</ip>
</row>
'
declare @mode varchar(20) = 'setasdefault'
declare @groupType varchar(20) = 'academic'

exec sp_acaTQFSetProgramme @xmlData, @xmlUser, @mode, @groupType
*/

ALTER procedure [dbo].[sp_acaTQFSetProgramme]
(
	@xmlData xml,
	@xmlUser xml,
	@mode varchar(20),
	@groupType varchar(20)
)
as
begin
	begin try
		declare @id int
		declare @programId varchar(15)
		declare @courseYear varchar(4)
		declare @presentStatus varchar(1)
		declare @cancelStatus varchar(2)
		declare @username varchar(150)
		declare @ip varchar(100)
		declare @xmlNewData xml = (select @xmlData for xml path('table'))
		declare @docHandle int
		declare @action varchar(20)

		exec sp_xml_preparedocument @docHandle output, @xmlNewData

		select	*
		into	#tmpProg		
		from	openxml(@docHandle, '/table/row', 2)
		with (	
			[programId] varchar(15),
			[courseYear] varchar(4),
			[presentStatus] varchar(1),
			[cancelStatus] varchar(2)
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
		
		select	@id = id
		from	acaTQFProgramme as a inner join
				#tmpProg as b on (a.programId = b.programId and a.courseYear = b.courseYear)

		select	@username = username,
				@ip = ip
		from	#tmpUser
		
		if (@mode in ('setcancelstatus'))
		begin
			update Infinity..acaTQFProgramme set
				presentStatus	= 'N',
				cancelStatus	= b.cancelStatus,
				cancelBy		= @username,
				cancelDate		= getdate()
			from	acaTQFProgramme as a inner join
					#tmpProg as b on (a.programId = b.programId and a.courseYear = b.courseYear)
			where	(a.id = @id) and
					(a.verifyStatus = 'Y')
		end

		if (@mode in ('setasdefault'))
		begin
			update Infinity..acaTQFProgramme set
				presentStatus	= 'N'
			from	acaTQFProgramme as a inner join
					#tmpProg as b on (a.programId = b.programId)
			where	(a.courseYear <> b.courseYear) and
					(a.verifyStatus = 'Y')

			update Infinity..acaTQFProgramme set
				presentStatus	= 'Y'
			from	acaTQFProgramme as a inner join
					#tmpProg as b on (a.programId = b.programId and a.courseYear = b.courseYear)
			where	(a.id = @id) and
					(a.verifyStatus = 'Y')
		end

		select	@xmlData as xmlData,
				@xmlUser as xmlUser,
				@mode as mode,
				@action as action,
				@id as id,
				'0' as resCode,
				'Success' as resMessage,
				NULL as resErrorNumber
	end try
	begin catch
		select	@xmlData as xmlData,
				@xmlUser as xmlUser,
				@mode as mode,
				@action as action,
				@id as id,
				'1' as resCode,
				ERROR_MESSAGE() as resMessage,
				@@ERROR as resErrorNumber
	end catch
end
