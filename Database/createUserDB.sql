-- version 0.3.0
drop database if exists `user_db`;
create database `user_db`;
use `user_db`;

set names utf8mb4;
set character_set_client = utf8mb4;

create table users (
    user_id int not null auto_increment,
    facebook_id int,
    username varchar(50) not null,
    user_password varchar(50) not null,
    email varchar(50) not null,
    primary key (user_id)
)  engine=innodb auto_increment=1 default charset=utf8mb4 collate = utf8mb4_0900_ai_ci;

create table origin_ENUM (
		origin_ENUM_id int not null,
    origin_type varchar(50) not null,
    primary key (origin_ENUM_id)
)  engine=innodb auto_increment=1 default charset=utf8mb4 collate = utf8mb4_0900_ai_ci;
insert into origin_EMUM values (default, facebook);

create table structure_Type_ENUM (
		structure_type_ENUM_id int not null,
    structure_type varchar(50) not null,
    primary key (structure_type_ENUM_id)
)  engine=innodb auto_increment=1 default charset=utf8mb4 collate = utf8mb4_0900_ai_ci;
insert into structure_Type_ENUM values (default, post);
insert into structure_Type_ENUM values (default, photo);

create table syncs (
  sync_id int not null auto_increment,
  user_id int not null,
	origin_ENUM_id int not null,
  structure_type_ENUM_id int not null,
  synced_at datetime not null,
  deepest_checkpoint varchar(150),
  primary key (sync_id),
  foreign key (user_id) references users(user_id) on delete cascade,
  foreign key (origin_ENUM_id) references origin_ENUM(origin_ENUM_id),
  foreign key (structure_type_ENUM_id) references structure_Type_ENUM(structure_type_ENUM_id)
) engine=innodb auto_increment=1 default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;

create table images (
  image_id int not null auto_increment,
  user_id int not null,
  src_link varchar(150) not null,
  width smallint not null,
  height smallint not null,
  primary key (image_id),
  foreign key (user_id) references users(user_id) on delete cascade
) engine=innodb auto_increment=1 default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;

create table posts (
  post_id int not null auto_increment,
  user_id int not null,
  image_id int not null,
  origin_ENUM_id int not null,
  created_at date not null,
  message varchar(500),
  primary key (post_id),
  foreign key (user_id) references users(user_id) on delete cascade,
  foreign key (image_id) references images(image_id ) on delete cascade,
  foreign key (origin_ENUM_id) references origin_ENUM(origin_ENUM_id)
) engine=innodb auto_increment=1 default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;

create table photos (
  photo_id int not null auto_increment,
  user_id int not null,
  image_id int not null,
  origin_ENUM_id int not null,
  created_at date not null,
  caption varchar(500),
  primary key (photo_id),
  foreign key (user_id) references users(user_id) on delete cascade,
  foreign key (image_id) references images(image_id) on delete cascade,
  foreign key (origin_ENUM_id) references origin_ENUM(origin_ENUM_id)
) engine=innodb auto_increment=1 default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;