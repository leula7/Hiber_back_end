/*
   Monday, September 5, 202211:45:16 AM
   User: abel
   Server: DESKTOP-D6336JC
   Database: federal1
   Application: 
*/

/* To prevent any potential data loss issues, you should review this script in detail before running it outside the context of the database designer.*/
BEGIN TRANSACTION
SET QUOTED_IDENTIFIER ON
SET ARITHABORT ON
SET NUMERIC_ROUNDABORT OFF
SET CONCAT_NULL_YIELDS_NULL ON
SET ANSI_NULLS ON
SET ANSI_PADDING ON
SET ANSI_WARNINGS ON
COMMIT
BEGIN TRANSACTION
GO
CREATE TABLE dbo.Tmp_cars
	(
	id bigint NOT NULL IDENTITY (1, 1),
	fname nvarchar(255) NULL,
	lname nvarchar(255) NULL,
	licence_number nvarchar(255) NULL,
	sub_city nvarchar(255) NULL,
	car_type nvarchar(255) NULL,
	plate_number nvarchar(255) NULL,
	dest_office nvarchar(255) NULL,
	created_at datetime NULL,
	updated_at datetime NULL
	)  ON [PRIMARY]
GO
ALTER TABLE dbo.Tmp_cars SET (LOCK_ESCALATION = TABLE)
GO
SET IDENTITY_INSERT dbo.Tmp_cars ON
GO
IF EXISTS(SELECT * FROM dbo.cars)
	 EXEC('INSERT INTO dbo.Tmp_cars (id, fname, lname, licence_number, sub_city, car_type, plate_number, dest_office, created_at, updated_at)
		SELECT id, fname, lname, licence_number, sub_city, car_type, plate_number, dest_office, created_at, updated_at FROM dbo.cars WITH (HOLDLOCK TABLOCKX)')
GO
SET IDENTITY_INSERT dbo.Tmp_cars OFF
GO
DROP TABLE dbo.cars
GO
EXECUTE sp_rename N'dbo.Tmp_cars', N'cars', 'OBJECT' 
GO
ALTER TABLE dbo.cars ADD CONSTRAINT
	PK__cars__3213E83FFB17814B PRIMARY KEY CLUSTERED 
	(
	id
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]

GO
COMMIT
select Has_Perms_By_Name(N'dbo.cars', 'Object', 'ALTER') as ALT_Per, Has_Perms_By_Name(N'dbo.cars', 'Object', 'VIEW DEFINITION') as View_def_Per, Has_Perms_By_Name(N'dbo.cars', 'Object', 'CONTROL') as Contr_Per 