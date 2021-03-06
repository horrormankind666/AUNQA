USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaTQFSetPLOs]    Script Date: 14/5/2562 13:43:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author		:	<ยุทธภูมิ ตวันนา>
-- Create date	:	<๑๔/๐๕/๒๕๖๒>
-- Description	:	<สำหรับบันทึกข้อมูลตาราง acaTQFPLOs>
-- =============================================
ALTER procedure [dbo].[sp_acaTQFSetPLOs]
(
	@id int = null,
	@tqfProgramId int = null,
	@xmlData xml = null,
	@xmlUser xml = null
)
as
begin	
	declare @docHandle int = null
	declare @xmlPLOs xml = null
	declare @code varchar(15) = null
	declare @titleTH nvarchar(250) = null
	declare @titleEN nvarchar(250) = null
	declare @xmlSubPLOs xml = null
	declare @username varchar(150) = null
	declare @ip varchar(100) = null

	begin try
		delete
		from	Infinity..acaTQFPLOs
		where	(tqfProgramId = @tqfProgramId) 

		if (@tqfProgramId is not null and len(@tqfProgramId) > 0 and @xmlData is null)
		begin
			select	@xmlPLOs = xmlPLOs
			from	Infinity..acaTQFProgrammeTemp
			where	id = @tqfProgramId
		end
		else
			set @xmlPLOs = @xmlData

		exec sp_xml_preparedocument @docHandle output, @xmlPLOs

		select	*
		into	#tmpPLOs
		from	openxml(@docHandle, '/xmlPLOs/row', 2)
		with (	
			[code] varchar(15),
			[nameTH] nvarchar(250),
			[nameEN] nvarchar(250),
			[xmlSubPLOs] xml
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

		declare rs cursor for
			select	*
			from	#tmpPLOs

		open rs

		fetch next from rs into 
			@code,
			@titleTH,
			@titleEN,
			@xmlSubPLOs

		while @@fetch_status = 0
		begin
			if (@tqfProgramId is not null and len(@tqfProgramId) > 0 and
				@code is not null and len(@code) > 0)
			begin
				insert into acaTQFPLOs
				(
						tqfProgramId,
						code,
						titleTh,
						titleEn,
						detail,
						xmlSubPLOs,
						xmlStractegyTeach,
						xmlStractegyEvaluate,
						createdBy,
						createdDate,							 
						cancelStatus,
						cancelBy,
						cancelDate
				)
				select	dbo.fnc_utilStringCompare(isnull(@tqfProgramId, ''), '', @tqfProgramId, null),
						dbo.fnc_utilStringCompare(isnull(@code, ''), '', @code, null),
						dbo.fnc_utilStringCompare(isnull(@titleTH, ''), '', @titleTH, null),
						dbo.fnc_utilStringCompare(isnull(@titleEN, ''), '', @titleEN, null),					
						null,
						dbo.fnc_utilXMLCompare(isnull(@xmlSubPLOs, ''), @xmlSubPLOs, null),
						null,
						null,
						@username,
						getdate(),
						null,
						null,
						null
			end

			fetch next from rs into 
				@code,
				@titleTH,
				@titleEN,
				@xmlSubPLOs
		end

		close rs
		deallocate rs
	end try
	begin catch
	end catch
end