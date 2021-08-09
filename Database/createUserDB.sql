-- version 0.4.0
drop database if exists user_db;
create database user_db;
use user_db;

set names utf8mb4;
set character_set_client = utf8mb4;

create table user_type_ENUM (
		user_type_ENUM_id int not null auto_increment,
    user_type varchar(10) not null,
    primary key (user_type_ENUM_id)
)  engine=innodb auto_increment=1 default charset=utf8mb4 collate = utf8mb4_0900_ai_ci;
insert into user_type_ENUM values (default, 'admin');
insert into user_type_ENUM values (default, 'tester');
insert into user_type_ENUM values (default, 'guest');
insert into user_type_ENUM values (default, 'registered');
insert into user_type_ENUM values (default, 'premium');

create table origin_ENUM (
		origin_ENUM_id int not null auto_increment,
    origin_type varchar(10) not null,
    primary key (origin_ENUM_id)
)  engine=innodb auto_increment=1 default charset=utf8mb4 collate = utf8mb4_0900_ai_ci;
insert into origin_ENUM values (default, 'facebook');
insert into origin_ENUM values (default, 'me_we');
insert into origin_ENUM values (default, 'imgr');
insert into origin_ENUM values (default, 'user');

create table structure_type_ENUM (
		structure_type_ENUM_id int not null auto_increment,
    structure_type varchar(10) not null,
    primary key (structure_type_ENUM_id)
)  engine=innodb auto_increment=1 default charset=utf8mb4 collate = utf8mb4_0900_ai_ci;
insert into structure_type_ENUM values (default, 'post');
insert into structure_type_ENUM values (default, 'photo');
insert into structure_type_ENUM values (default, 'album');

create table post_type_ENUM (
		post_type_ENUM_id int not null auto_increment,
    user_type varchar(10) not null,
    primary key (post_type_ENUM_id)
)  engine=innodb auto_increment=1 default charset=utf8mb4 collate = utf8mb4_0900_ai_ci;
insert into post_type_ENUM values (default, 'photo');
insert into post_type_ENUM values (default, 'video');
insert into post_type_ENUM values (default, 'mixed');

create table users (
    user_id int not null auto_increment,
    user_type_ENUM_id int not null,
    facebook_id int,
    username varchar(50) not null,
    user_password varchar(50) not null,
    email varchar(50),
    primary key (user_id),
    foreign key (user_type_ENUM_id) references user_type_ENUM(user_type_ENUM_id)
)  engine=innodb auto_increment=1 default charset=utf8mb4 collate = utf8mb4_0900_ai_ci;

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
  foreign key (structure_type_ENUM_id) references structure_type_ENUM(structure_type_ENUM_id)
) engine=innodb auto_increment=1 default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;

create table images (
  image_id int not null auto_increment,
  user_id int not null,
  origin_ENUM_id int not null,
  structure_type_ENUM_id int not null,
  src_link varchar(150) not null,
  width int not null,
  height int not null,
  caption varchar(500),
  created_at date not null,
  primary key (image_id),
  foreign key (user_id) references users(user_id) on delete cascade,
  foreign key (origin_ENUM_id) references origin_ENUM(origin_ENUM_id),
  foreign key (structure_type_ENUM_id) references structure_type_ENUM(structure_type_ENUM_id)
) engine=innodb auto_increment=1 default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;

create table posts (
  post_id int not null auto_increment,
  user_id int not null,
  post_type_ENUM_id int not null,
  origin_ENUM_id int not null,
  created_at date not null,
  message varchar(500),
  primary key (post_id),
  foreign key (user_id) references users(user_id) on delete cascade,
  foreign key (origin_ENUM_id) references origin_ENUM(origin_ENUM_id),
  foreign key (post_type_ENUM_id) references post_type_ENUM(post_type_ENUM_id)
) engine=innodb auto_increment=1 default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;

create table post_attachments (
  post_attachment_id int not null auto_increment,
  post_id int not null,
  image_id int not null,
  primary key (post_attachment_id),
  foreign key (post_id) references posts(post_id) on delete cascade,
  foreign key (image_id) references images(image_id)
) engine=innodb auto_increment=1 default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;