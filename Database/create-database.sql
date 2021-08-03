DROP DATABASE IF EXISTS `data_movers`;
CREATE DATABASE `data_movers`; 
USE `data_movers`;

SET NAMES utf8mb4 ;
SET character_set_client = utf8mb4 ;

/*
origination_type should be in ENUM
date should be in DATE Form
*/
CREATE TABLE `users` (
  `userID` int NOT NULL AUTO_INCREMENT,
  `facebookID` int,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  PRIMARY KEY (`userID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `syncs` (
  `syncID` int NOT NULL AUTO_INCREMENT,
  `userID` int,
  `originationType` varchar(50) NOT NULL,
  `date` varchar(50) NOT NULL,
  PRIMARY KEY (`syncID`),
  KEY `FK_userID` (`userID`),
  CONSTRAINT `FK_userID` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `images` (
  `imageID` int NOT NULL AUTO_INCREMENT,
  `userID` int NOT NULL,
  `src_link` varchar(150) NOT NULL,
  `width` tinyint NOT NULL,
  `height` tinyint NOT NULL,
  PRIMARY KEY (`imageID`),
  KEY `FK_userID` (`userID`),
  CONSTRAINT `FK_userID` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `posts` (
  `post_id` int NOT NULL AUTO_INCREMENT,
  `userID` int NOT NULL,
  `imageID` varchar(50) NOT NULL,
  `origination_type` varchar(50) NOT NULL,
  `date_created` varchar(50) NOT NULL,
  `message` varchar(500) NOT NULL,
  PRIMARY KEY (`post_id`),
  KEY `FK_userID` (`userID`),
  KEY `FK_imageID` (`imageID`),
  CONSTRAINT `FK_userID` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON UPDATE CASCADE,
  CONSTRAINT `FK_imageID` FOREIGN KEY (`imageID`) REFERENCES `images` (`imageID`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `photos` (
  `photosID` int NOT NULL AUTO_INCREMENT,
  `userID` int NOT NULL,
  `imageID` varchar(50) NOT NULL,
  `origination_type` varchar(50) NOT NULL,
  `date_created` varchar(50) NOT NULL,
  `caption` varchar(500) NOT NULL,
  PRIMARY KEY (`photosID`),
  KEY `FK_userID` (`userID`),
  KEY `FK_imageID` (`imageID`),
  CONSTRAINT `FK_userID` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON UPDATE CASCADE,
  CONSTRAINT `FK_imageID` FOREIGN KEY (`imageID`) REFERENCES `images` (`imageID`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;