CREATE TABLE User_Accounts (UID INT(8) NOT NULL AUTO_INCREMENT, Username VARCHAR(100) NOT NULL, User_ID VARCHAR(100) NOT NULL, CreateDate timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, LastModified timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(UID),INDEX name(UID,Username,CreateDate,LastModified));