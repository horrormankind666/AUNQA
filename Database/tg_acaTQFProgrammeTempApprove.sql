USE [Infinity]
GO
/****** Object:  Trigger [dbo].[tg_acaTQFProgrammeTempApprove]    Script Date: 30/8/2562 11:02:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author		: <>
-- Create date	: <>
-- Description	: <>
-- =============================================

/*
Select * From acaTQFProgrammeTemp
*/

ALTER trigger [dbo].[tg_acaTQFProgrammeTempApprove]
   on  [dbo].[acaTQFProgrammeTemp]
   after update
as
begin
	set nocount on

	declare @id int
	declare @verifyStatus varchar(5)

	/*
	declare rs cursor for
		select	1 as id,
				'Y' as verifyStatus
		union
		select	2,
				'N'

	declare rs cursor for
		select	id,
				verifyStatus 	
		from	inserted 
		where	verifyStatus = 'Y'
	*/
	
	declare rs cursor for
		select	a.id,
				a.verifyStatus 	
		from	inserted as a inner join
				deleted as b on a.id = b.id
		where	(isnull(a.verifyStatus, '') = 'Y') and
				(isnull(b.verifyStatus,'') <> 'Y')
		
	open rs

	fetch next from rs into @id, @verifyStatus 

	while @@FETCH_STATUS = 0
	begin
		-- select @id, @verifyStatus
		if (@verifyStatus = 'Y')
		begin
			-- select @id, @verifyStatus
			exec sp_acaTQFSetTransProgramme @id
		end

		fetch next from rs into @id, @verifyStatus
	end
	
	close rs
	deallocate rs	
end
