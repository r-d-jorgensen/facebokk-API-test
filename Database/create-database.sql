-- version 0.2.0
drop database if exists `user_db`;
create database `user_db`; 
use `user_db`;

set names utf8mb4 ;
set character_set_client = utf8mb4 ;

/*
origination_type should be in ENUM
Foreign Keys should have constraints
*/
create table users (
    user_id int not null auto_increment,
    facebook_id int,
    username varchar(50) not null,
    user_password varchar(50) not null,
    email varchar(50) not null,
    primary key (user_id)
)  engine=innodb auto_increment=1 default charset=utf8mb4 collate = utf8mb4_0900_ai_ci;

create table origin_ENUM (
    origin_type varchar(50) not null,
    primary key (origin_type)
)  engine=innodb auto_increment=1 default charset=utf8mb4 collate = utf8mb4_0900_ai_ci;

create table syncs (
  sync_id int not null auto_increment,
  user_id int not null,
  origin_type varchar(50) not null,
  sync_date varchar(50) not null,
  primary key (sync_id)
) engine=innodb auto_increment=1 default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;

create table images (
  image_id int not null auto_increment,
  user_id int not null,
  src_link varchar(150) not null,
  width smallint not null,
  height smallint not null,
  primary key (image_id)
) engine=innodb auto_increment=1 default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;

create table posts (
  post_id int not null auto_increment,
  user_id int not null,
  image_id varchar(50) not null,
  origin_type varchar(50) not null,
  date_created date not null,
  message varchar(500),
  primary key (post_id)
) engine=innodb auto_increment=1 default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;

create table photos (
  photos_id int not null auto_increment,
  user_id int not null,
  image_id int not null,
  origin_type varchar(50) not null,
  date_created date not null,
  caption varchar(500),
  primary key (photos_id)
) engine=innodb auto_increment=1 default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;