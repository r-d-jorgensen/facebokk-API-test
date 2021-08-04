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
    user_id INT NOT NULL AUTO_INCREMENT,
    facebook_id INT,
    username VARCHAR(50) NOT NULL,
    user_password VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    PRIMARY KEY (user_id)
)  ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8MB4 COLLATE = UTF8MB4_0900_AI_CI;

CREATE TABLE syncs (
  sync_id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  origination_type VARCHAR(50) NOT NULL,
  sync_date VARCHAR(50) NOT NULL,
  PRIMARY KEY (sync_id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE images (
  image_id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  src_link VARCHAR(150) NOT NULL,
  width TINYINT NOT NULL,
  height TINYINT NOT NULL,
  PRIMARY KEY (image_id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE posts (
  post_id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  image_id VARCHAR(50) NOT NULL,
  origination_type VARCHAR(50) NOT NULL,
  date_created DATE NOT NULL,
  message VARCHAR(500),
  PRIMARY KEY (post_id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE photos (
  photos_id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  image_id INT NOT NULL,
  origination_type VARCHAR(50) NOT NULL,
  date_created DATE NOT NULL,
  caption VARCHAR(500),
  PRIMARY KEY (photos_id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;