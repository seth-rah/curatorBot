CREATE TABLE `bannedusers` (
  `id` bigint(64) unsigned NOT NULL AUTO_INCREMENT,
  `chatID` bigint(64) NOT NULL,
  `messageID` bigint(64) NOT NULL,
  `userID` bigint(64) NOT NULL,
  `userName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userFirstName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userLastName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `userID_UNIQUE` (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `images` (
  `id` bigint(64) unsigned NOT NULL AUTO_INCREMENT,
  `chatID` bigint(64) NOT NULL,
  `mediaGroupID` bigint(64) DEFAULT NULL,
  `messageID` bigint(64) NOT NULL,
  `userID` bigint(64) NOT NULL,
  `userName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userFirstName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userLastName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fileID` bigint(64) NOT NULL,
  `status` enum('PENDING','REJECTED','APPROVED','POSTED') COLLATE utf8mb4_unicode_ci NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `imagescol` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `imageID_UNIQUE` (`fileID`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
