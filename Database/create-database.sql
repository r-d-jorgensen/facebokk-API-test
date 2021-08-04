DROP DATABASE IF EXISTS `data_movers`;
CREATE DATABASE `data_movers`; 
USE `data_movers`;

SET NAMES utf8mb4 ;
SET character_set_client = utf8mb4 ;

/*
origination_type should be in ENUM
Foreign Keys should have constraints
*/
CREATE TABLE users (
    `userID` INT NOT NULL AUTO_INCREMENT,
    `facebookID` INT,
    `name` VARCHAR(50) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`userID`)
)  ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8MB4 COLLATE = UTF8MB4_0900_AI_CI;

CREATE TABLE syncs (
  `syncID` int NOT NULL AUTO_INCREMENT,
  `userID` int NOT NULL,
  `originationType` varchar(50) NOT NULL,
  `date` varchar(50) NOT NULL,
  PRIMARY KEY (`syncID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE images (
  `imageID` int NOT NULL AUTO_INCREMENT,
  `userID` int NOT NULL,
  `src_link` varchar(150) NOT NULL,
  `width` tinyint NOT NULL,
  `height` tinyint NOT NULL,
  PRIMARY KEY (`imageID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE posts (
  `post_id` int NOT NULL AUTO_INCREMENT,
  `userID` int NOT NULL,
  `imageID` varchar(50) NOT NULL,
  `origination_type` varchar(50) NOT NULL,
  `date_created` DATE NOT NULL,
  `message` varchar(500),
  PRIMARY KEY (`post_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE photos (
  `photosID` int NOT NULL AUTO_INCREMENT,
  `userID` int NOT NULL,
  `imageID` varchar(50) NOT NULL,
  `origination_type` varchar(50) NOT NULL,
  `date_created` DATE NOT NULL,
  `caption` varchar(500),
  PRIMARY KEY (`photosID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;