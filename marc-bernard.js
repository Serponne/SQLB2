const name = "marc-bernard"
const promo = "B2B"

const q1 = `
SELECT *
 FROM Track
 WHERE Milliseconds < 
 (
 SELECT Milliseconds 
 FROM Track 
 WHERE TrackId = '3457'
 );`;

 const q2 = `
 SELECT * 
 FROM Track 
 WHERE MediaTypeId = 
 (
 SELECT MediaTypeId 
 FROM Track 
 WHERE Name = 'Rehab'
 );`;


const q3 = `
SELECT p.PlaylistId, p.Name AS 'Playlist's Name', COUNT(t.TrackId) AS 'Number of tracks', SUM(track.Milliseconds)/1000 AS 'Playlist Duration In Seconds', AVG(t.Milliseconds)/1000 AS 'Average Time Per Track In Seconds'
 FROM Playlist AS p
 JOIN PlaylistTrack AS pt
 ON p.PlaylistId = pt.PlaylistId
 JOIN Track as t
 ON t.TrackId = pt.TrackId
 GROUP BY p.PlaylistId, p.Name;`;
 
 const q4 = `
 SELECT  plr.PlaylistId, plr.[Playlist Name]
  FROM (SELECT p.PlaylistId, p.Name AS 'Playlist Name', SUM(t.Milliseconds)/1000 AS PDuration
  FROM Playlist AS p
  JOIN PlaylistTrack AS ptk
  ON p.PlaylistId = pt.PlaylistId
  JOIN Track as t
  ON t.TrackId = pt.TrackId
  GROUP BY p.PlaylistId, p.Name) 
  AS plr
 WHERE plr.PDuration > (SELECT AVG(PDuration) AS PlaylistAverage
 FROM
 (SELECT p.PlaylistId, p.Name AS 'Playlist Name', SUM(t.Milliseconds)/1000 AS PDuration
  FROM Playlist AS p
  JOIN PlaylistTrack AS ptk
  ON p.PlaylistId = pt.PlaylistId
  JOIN Track as t
  ON t.TrackId = pt.TrackId
  GROUP BY p.PlaylistId, p.Name)
  AS Result);`;
  
  const q5 = `
  SELECT * 
  FROM 
  (SELECT pl.PlaylistId, pl.Name AS 'Playlist Name', COUNT(t.TrackId) AS TracksCount
   FROM Playlist AS pl
   JOIN PlaylistTrack AS ptk
   ON pl.PlaylistId = ptk.PlaylistId
   JOIN Track as t
   ON t.TrackId = ptk.TrackId
   GROUP BY pl.PlaylistId, pl.Name)
   AS tk
   WHERE tk.TracksCount = 
   (SELECT COUNT(t.TrackId)
   FROM Playlist AS pl
   JOIN PlaylistTrack AS ptk
   ON pl.PlaylistId = ptk.PlaylistId
   JOIN Track as t
   ON t.TrackId = ptk.TrackId
   WHERE pl.PlaylistId = 1
   GROUP BY pl.PlaylistId, pl.Name)
   OR
   tk.TracksCount =
   (SELECT COUNT(t.TrackId)
   FROM Playlist AS pl
   JOIN PlaylistTrack AS ptk
   ON pl.PlaylistId = ptk.PlaylistId
   JOIN Track as t
   ON t.TrackId = ptk.TrackId
   WHERE pl.PlaylistId = 13
   GROUP BY pl.PlaylistId, pl.Name)`;
  
  const q6 = `
  SELECT CONCAT(c.FirstName, ' ', c.LastName) AS 'Customer Name', MAX(i.Total) AS 'Max Invoice'
  FROM Customer AS c
  JOIN Invoice AS i
  ON i.CustomerId = c.CustomerId
  WHERE i.Total > 
  (SELECT TOP 1 MAX(i.Total) AS Total
  FROM Customer AS c
  JOIN Invoice AS i
  ON i.CustomerId = c.CustomerId
  WHERE i.BillingCountry = 'France'
  GROUP BY c.FirstName, c.LastName
  ORDER BY Total DESC)
  GROUP BY c.FirstName, c.LastName`;
  
  const q7 = `
  SELECT i.BillingCountry, MAX(i.Total) AS MAX, MIN(i.Total) AS MIN, AVG(i.Total) AS AVG, COUNT(i.Total) AS COUNT
  FROM Invoice as i
  GROUP BY i.BillingCountry;`;
  
  const q8 = `
  SELECT t.Name, t.UnitPrice, media.Name 
  FROM Track as t
  JOIN MediaType as media
  ON t.MediaTypeId = media.MediaTypeId
  WHERE UnitPrice > 
  (SELECT AVG(UnitPrice)
  FROM Track)
  GROUP BY t.Name, t.UnitPrice, media.Name`;
  
  const q9 = `
  SELECT t.Name
  FROM Track AS t
  JOIN 
  (SELECT g.GenreId, AVG(t.UnitPrice) AS 'GenreAVGTrackPrice'
  FROM Track AS t
  JOIN Genre AS g
  ON g.GenreId = t.GenreId
  GROUP BY g.GenreId)
  AS genreavg
  ON t.GenreId = genreavg.GenreId
  WHERE t.UnitPrice < genreavg.GenreAVGTrackPrice`;
  
  const q10 = `
  SELECT Pays, COUNT(*)
  FROM
  (SELECT BillingCountry as Pays
  FROM Invoice
  UNION ALL
  SELECT Country as Pays
  FROM Customer
  UNION ALL
  SELECT Country as Pays
  FROM Employee) as result
  GROUP BY Pays
  ORDER BY Pays`;
  
  const q11 = `
  SELECT Country, COUNT(Country) AS CountryCount
  FROM Customer
  GROUP BY Country
  UNION ALL
  SELECT BillingCountry, COUNT(BillingCountry) AS CountryCount
  FROM Invoice
  GROUP BY BillingCountry
  UNION ALL
  SELECT Country, COUNT(Country) AS CountryCount
  FROM Employee
  GROUP BY Country`;
  
  const q12 = `
  SELECT result.Pays, result.Total, result.Employee, result.Customer, COUNT(inv.InvoiceId) as Invoice
  FROM
  (SELECT result.Pays, result.Total, result.Employee, COUNT(c.CustomerId) as Customer
  FROM
  (SELECT result.Pays, result.Total, COUNT(emp.EmployeeId) as Employee
  FROM
  (SELECT Pays, COUNT(*) as Total
  FROM
  (SELECT BillingCountry as Pays
  FROM Invoice
  UNION ALL
  SELECT Country as Pays
  FROM Customer
  UNION ALL
  SELECT Country as Pays
  FROM Employee) as result
  GROUP BY Pays) as result
  LEFT JOIN Employee as emp
  ON result.Pays = emp.Country
  GROUP BY result.Pays, result.Total) as result
  JOIN Customer as c
  ON result.Pays = c.Country
  GROUP BY result.Pays, result.Total, result.Employee) as result
  JOIN Invoice as i
  ON result.Pays = i.BillingCountry
  GROUP BY result.Pays, result.Total, result.Employee, result.Customer
  ORDER BY result.Pays`;
  
  const q13 = `
  SELECT i.InvoiceId, track.Milliseconds
  FROM Invoice as i
  JOIN InvoiceLine as il
  ON i.InvoiceId = il.InvoiceId
  JOIN Track as track
  ON il.TrackId = track.TrackId
  WHERE track.Milliseconds IN 
  (SELECT MAX(track.Milliseconds)
  FROM Track as track
  JOIN Genre as genre
  ON track.GenreId = genre.GenreId
  GROUP BY genre.Name)
  ORDER BY inv.InvoiceId`;
  
  const q14 = `
  SELECT i.InvoiceId, AVG(track.UnitPrice) as TrackAvgPrice, SUM(track.Milliseconds)/1000 as 'Total Command Duration (s)', AVG(track.UnitPrice)/(SUM(track.Milliseconds)/1000) as 'Command Price Per Second Of Track'
  FROM Invoice as i
  JOIN InvoiceLine as il
  ON i.InvoiceId = il.InvoiceId
  JOIN Track as track
  ON il.TrackId = track.TrackId
  GROUP BY i.InvoiceId
  ORDER BY i.InvoiceId`;
  
  const q15 = ``;
  
  const q16 = `
  SELECT TOP 1 *
  FROM
  (SELECT CONCAT(e.FirstName, ' ', e.LastName) as Name, COUNT(c.CustomerId) as Total
  FROM Employee as e
  FULL JOIN Customer as c
  ON e.EmployeeId = c.SupportRepId
  GROUP BY e.FirstName, e.LastName) as result
  WHERE result.Total <> 0`;
  
  const q17 = ``;
  
  const q18 = `
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
  `;
  
  const q19 = ``;
  
  const q20 = ``;
  
  const q21 = `
  DELETE FROM Invoice
  WHERE InvoiceDate >= '2010' AND InvoiceDate < '2011'
  GO`;
  
  const q22 = ``;
  
  const q23 = `
  UPDATE Invoice
  SET BillingCountry = c.Country
  FROM Invoice inv
  FULL JOIN Customer c
  ON c.CustomerId = inv.CustomerId
  WHERE inv.BillingCountry <> c.Country
  GO`;
  
  const q24 = `
  ALTER TABLE [dbo].[Employee]
  ADD [Salary] INT;
  GO`;
  
  const q25 = `
  UPDATE [Employee]
  SET Salary = RAND(CHECKSUM(NEWID()))*(100000-30000)+30000
  GO`;
  
  const q26 = `
  ALTER TABLE [dbo].[Invoice]
      DROP COLUMN [BillingPostalCode]
  GO`;











































// NE PAS TOUCHER CETTE SECTION
const tp = {name: name, promo: promo, queries: [q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14, q15, q16, q17, q18, q19, q20, q21, q22, q23, q24, q25, q26]}
module.exports = tp
