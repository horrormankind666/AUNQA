USE [Infinity]
GO
/****** Object:  StoredProcedure [dbo].[sp_acaTQFGetListYear]    Script Date: 2/4/2562 13:05:48 ******/
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
[sp_acaTQFGetListYear]
*/

ALTER procedure [dbo].[sp_acaTQFGetListYear]
as
begin
	select	 *
	from	 acaTQFYear
	where	 (cancelStatus is null) and
			 (activeStatus = 'Y')
	order by tqfYear desc
end
