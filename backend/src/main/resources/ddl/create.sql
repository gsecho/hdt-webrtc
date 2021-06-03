
CREATE TABLE `rtc_user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `username` varchar(128) NOT NULL,  # 注意:name是保留字
  `password` varchar(128) DEFAULT NULL,
  `salt` varchar(200) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `create_dt` datetime DEFAULT NULL,
  `create_by` varchar(128) DEFAULT NULL,
  `update_dt` datetime DEFAULT NULL,
  `update_by` varchar(128) DEFAULT NULL,
  `remark` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `rtc_meeting_item` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `subject` varchar(128) NOT NULL,
  `content`  varchar(128) DEFAULT NULL,
  `start_time` datetime NOT NULL, # 会议开始时间
  `duration_min` int(11) NOT NULL,
	`admin_password` varchar(128) NOT NULL, # 管理员密码
	`max_member` int(11) NOT NULL, # 人数上限
  `status` int(11) NOT NULL,
  `create_dt` datetime DEFAULT NULL,
  `create_by` varchar(128) DEFAULT NULL,
  `update_dt` datetime DEFAULT NULL,
  `update_by` varchar(128) DEFAULT NULL,
  `remark` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `start_time` (`start_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `rtc_role` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `role` varchar(100) NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  `status` int(11) NOT NULL,
  `create_dt` datetime DEFAULT NULL,
  `create_by` varchar(128) DEFAULT NULL,
  `update_dt` datetime DEFAULT NULL,
  `update_by` varchar(128) DEFAULT NULL,
  `remark` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `rtc_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `rtc_user_role` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `role_id` bigint(20) NOT NULL,
  `status` int(11) NOT NULL,
  `create_dt` datetime DEFAULT NULL,
  `create_by` varchar(128) DEFAULT NULL,
  `update_dt` datetime DEFAULT NULL,
  `update_by` varchar(128) DEFAULT NULL,
  `remark` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `rtc_user_role` (`user_id`,`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


