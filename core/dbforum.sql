-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 08, 2019 at 03:17 PM
-- Server version: 10.1.29-MariaDB
-- PHP Version: 7.1.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dbforum`
--

-- --------------------------------------------------------

--
-- Table structure for table `comment`
--

CREATE TABLE `comment` (
  `comment_id` int(11) NOT NULL,
  `topic_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `comment_content` text CHARACTER SET utf8 NOT NULL,
  `com_created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `comment`
--

INSERT INTO `comment` (`comment_id`, `topic_id`, `user_id`, `comment_content`, `com_created_at`) VALUES
(1, 1, 2, 'content1', '2019-09-04 15:44:24'),
(2, 1, 2, 'content2', '2019-09-04 15:44:38'),
(3, 1, 2, 'content3', '2019-09-04 15:44:43'),
(4, 1, 2, 'content4', '2019-09-04 15:45:10'),
(5, 2, 2, 'content5', '2019-09-04 15:45:18'),
(6, 2, 2, 'content6', '2019-09-04 15:45:23'),
(7, 3, 2, 'content7', '2019-09-04 15:45:38'),
(8, 3, 2, 'content8', '2019-09-04 15:45:42'),
(9, 4, 2, 'content9', '2019-09-04 15:45:49'),
(10, 5, 2, 'content10', '2019-09-04 15:45:57');

-- --------------------------------------------------------

--
-- Table structure for table `topic`
--

CREATE TABLE `topic` (
  `topic_id` int(11) NOT NULL,
  `title` text CHARACTER SET utf8 NOT NULL,
  `content` text CHARACTER SET utf8 NOT NULL,
  `user_id` int(11) NOT NULL,
  `topic_created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `topic`
--

INSERT INTO `topic` (`topic_id`, `title`, `content`, `user_id`, `topic_created_at`) VALUES
(1, 'title1', 'content1', 1, '2019-09-04 15:30:11'),
(2, 'title2', 'content2', 1, '2019-09-04 15:30:18'),
(3, 'title3', 'content3', 1, '2019-09-04 15:30:23'),
(4, 'title4', 'content4', 1, '2019-09-04 15:30:30'),
(5, 'title5', 'content5', 2, '2019-09-04 15:31:30'),
(6, 'title6', 'content6', 2, '2019-09-04 15:31:49'),
(7, 'title7', 'content7', 2, '2019-09-04 15:31:54'),
(8, 'title8', 'content8', 2, '2019-09-04 15:42:53');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `first_name` varchar(32) NOT NULL,
  `last_name` varchar(32) NOT NULL,
  `email` text NOT NULL,
  `password` text NOT NULL,
  `user_created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `first_name`, `last_name`, `email`, `password`, `user_created_at`) VALUES
(1, 'userFirst', 'userFirst', '1@gmail.com', '$2a$10$GuvlWmTvQf1d2E9RFypRx.W1MFLfe16Z8H8Ge58vL3yb3t1SZ.7ia', '2019-09-04 15:25:48'),
(2, 'nameSecond', 'lastSecond', '2@gmail.com', '$2a$10$QQS.fA1I9P3MYl383fKHsOVAG2HmsHiZSmxM7g05MQq0qwQRiQ2Ai', '2019-09-04 15:28:03'),
(3, 'sendgrid', 'acc', 'jbuntic@outlook.com', '$2a$10$Qp7hHagH9u.eApyWLTZQIuUnNXjFRuQxoXw93C/8BwQhTXsmsObc6', '2019-09-04 18:33:16');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`comment_id`);

--
-- Indexes for table `topic`
--
ALTER TABLE `topic`
  ADD PRIMARY KEY (`topic_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UN_KEY` (`email`(256)) USING BTREE;

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comment`
--
ALTER TABLE `comment`
  MODIFY `comment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `topic`
--
ALTER TABLE `topic`
  MODIFY `topic_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
