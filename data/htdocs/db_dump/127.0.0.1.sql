SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `tzchat`
--
CREATE DATABASE `tzchat` DEFAULT CHARACTER SET utf8 COLLATE utf8_bin;
USE `tzchat`;

-- --------------------------------------------------------

--
-- Table structure for table `usermessages`
--

CREATE TABLE IF NOT EXISTS `usermessages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fio` tinytext COLLATE utf8_bin NOT NULL,
  `email` tinytext COLLATE utf8_bin NOT NULL,
  `content` text COLLATE utf8_bin NOT NULL,
  `publicationtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;
