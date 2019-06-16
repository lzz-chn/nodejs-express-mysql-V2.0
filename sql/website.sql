# Host: 127.0.0.1  (Version 5.0.87-community-nt)
# Date: 2019-06-15 18:10:42
# Generator: MySQL-Front 6.1  (Build 1.26)


#
# Structure for table "website"
#

CREATE TABLE `website` (
  `id` int(11) NOT NULL auto_increment,
  `title` varchar(255) default NULL COMMENT '网站标题',
  `keywords` varchar(511) default NULL COMMENT '网站关键字',
  `description` varchar(255) default NULL COMMENT '网站描述',
  `logo_pc` varchar(255) default NULL COMMENT 'pc logo',
  `logo_mobile` varchar(255) default NULL COMMENT '移动端 logo',
  `email` varchar(255) default NULL COMMENT '邮箱',
  `phone` varchar(255) default NULL COMMENT '电话',
  `address` varchar(255) default NULL COMMENT '地址',
  `qq` varchar(255) default NULL COMMENT 'QQ',
  `wechat` varchar(255) default NULL COMMENT '微信',
  `icps` varchar(255) default NULL COMMENT '备案号',
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='网站基本信息';

#
# Data for table "website"
#

INSERT INTO `website` VALUES (1,'',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
