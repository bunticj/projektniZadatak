/*
CREATE DATABASE IF NOT EXISTS dbForum;

//user table
CREATE TABLE IF NOT EXISTS dbforum.user (
 id INT NOT NULL AUTO_INCREMENT ,
 first_name VARCHAR(32) NOT NULL , last_name VARCHAR(32) NOT NULL ,
 email TEXT NOT NULL , 
password TEXT NOT NULL , 
user_created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ,
 PRIMARY KEY (id), UNIQUE UN_KEY (email(256)) ENGINE = InnoDB;

//topic table
CREATE TABLE IF NOT EXISTS dbforum.topic ( 
topic_id INT NOT NULL AUTO_INCREMENT ,
title TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL , 
content TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL ,
user_id INT NOT NULL ,
topic_created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY (topic_id)) ENGINE = InnoDB;

//comment table
CREATE TABLE dbforum.comment ( 
comment_id INT NOT NULL AUTO_INCREMENT ,
topic_id INT NOT NULL ,
user_id INT NOT NULL ,
comment_content TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL ,
com_created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP , 
PRIMARY KEY (`comment_id`)) ENGINE = InnoDB;
*/