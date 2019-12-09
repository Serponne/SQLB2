/*******************************************************************************
   Drop database if it exists
********************************************************************************/
IF EXISTS (SELECT name FROM master.dbo.sysdatabases WHERE name = N'PartieDeux')
BEGIN
	ALTER DATABASE [PartieDeux] SET OFFLINE WITH ROLLBACK IMMEDIATE;
	ALTER DATABASE [PartieDeux] SET ONLINE;
	DROP DATABASE [PartieDeux];
END

GO

/*******************************************************************************
   Create database
********************************************************************************/
CREATE DATABASE [PartieDeux];
GO

USE [PartieDeux];
GO

/*******************************************************************************
   Create Tables
********************************************************************************/
CREATE TABLE [dbo].[Group]
(
    [id] INT IDENTITY PRIMARY KEY,
    [name] VARCHAR(255) NOT NULL,
    [display_name] VARCHAR(255) NOT NULL,
    [description] TEXT NOT NULL,
);
GO

CREATE TABLE [dbo].[Role]
(
    [id] INT IDENTITY PRIMARY KEY,
    [name] VARCHAR(255) NOT NULL,
    [display_name] VARCHAR(255) NOT NULL,
    [description] TEXT NOT NULL,
);
GO

CREATE TABLE [dbo].[Permission]
(
    [id] INT IDENTITY PRIMARY KEY,
    [name] VARCHAR(255) NOT NULL,
    [display_name] VARCHAR(255) NOT NULL,
    [description] TEXT NOT NULL,
);
GO

CREATE TABLE [dbo].[User]
(
    [id] INT IDENTITY PRIMARY KEY,
    [username] VARCHAR(255) NOT NULL,
    [email] VARCHAR(255) NOT NULL,
    [superuser] BIT NOT NULL,
);
GO

CREATE TABLE [dbo].[User_Group]
(
    [user_id] INT NOT NULL,
    [group_id] INT NOT NULL,
    CONSTRAINT fk_user_group_id FOREIGN KEY ([user_id]) 
    REFERENCES [dbo].[User](id),
    CONSTRAINT fk_group_user_id FOREIGN KEY ([group_id]) 
    REFERENCES [dbo].[Group](id),
);
GO

CREATE TABLE [dbo].[Group_Role]
(
    [group_id] INT NOT NULL,
    [role_id] INT NOT NULL,
    CONSTRAINT fk_group_role_id FOREIGN KEY ([group_id]) 
    REFERENCES [dbo].[Group](id),
    CONSTRAINT fk_role_group_id FOREIGN KEY ([role_id]) 
    REFERENCES [dbo].[Role](id),
);
GO

CREATE TABLE [dbo].[Role_Permission]
(
    [user_id] INT NOT NULL,
    [permission_id] INT NOT NULL,
    CONSTRAINT fk_user_permission_id FOREIGN KEY ([user_id]) 
    REFERENCES [dbo].[User](id),
    CONSTRAINT fk_permission_user_id FOREIGN KEY ([permission_id]) 
    REFERENCES [dbo].[Permission](id)
);
GO

CREATE TABLE [dbo].[User_Role]
(
    [user_id] INT NOT NULL,
    [role_id] INT NOT NULL,
    CONSTRAINT fk_user_role_id FOREIGN KEY ([user_id]) 
    REFERENCES [dbo].[User](id),
    CONSTRAINT fk_role_user_id FOREIGN KEY ([role_id]) 
    REFERENCES [dbo].[Role](id),
);
GO