-- phpMyAdmin SQL Dump
-- version 4.7.7
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 25, 2018 at 06:23 PM
-- Server version: 10.1.30-MariaDB
-- PHP Version: 7.2.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gf`
--

-- --------------------------------------------------------

--
-- Table structure for table `df_residential_prop`
--

CREATE TABLE `df_residential_prop` (
  `id` int(11) NOT NULL,
  `property_name` varchar(200) NOT NULL,
  `property_for` varchar(10) NOT NULL,
  `property_cont_name` varchar(100) NOT NULL,
  `property_cont_phone` varchar(100) NOT NULL,
  `property_type` varchar(255) NOT NULL,
  `area` varchar(50) DEFAULT NULL,
  `city` varchar(50) NOT NULL,
  `latt` varchar(100) DEFAULT NULL,
  `lng` varchar(100) DEFAULT NULL,
  `pbNo` varchar(10) DEFAULT NULL,
  `emirates` varchar(50) NOT NULL,
  `parking` varchar(11) NOT NULL,
  `location` varchar(255) NOT NULL,
  `nature_of_building` varchar(10) NOT NULL,
  `nearest_city` varchar(100) NOT NULL,
  `floor_no` varchar(50) NOT NULL,
  `furnished` varchar(11) NOT NULL,
  `electricty_and_water_included` varchar(11) NOT NULL,
  `size_of_room` varchar(11) NOT NULL,
  `number_of_room` varchar(11) NOT NULL,
  `bathroom_attached` varchar(11) NOT NULL,
  `rent` varchar(11) NOT NULL,
  `rent_type` varchar(50) NOT NULL,
  `is_negotiable` varchar(11) NOT NULL,
  `play_area` varchar(11) NOT NULL,
  `deposit` varchar(11) NOT NULL,
  `agreement` varchar(100) NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_delete` varchar(11) NOT NULL DEFAULT '0',
  `sold_out` varchar(11) NOT NULL DEFAULT '0',
  `likes` varchar(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `df_residential_prop`
--

INSERT INTO `df_residential_prop` (`id`, `property_name`, `property_for`, `property_cont_name`, `property_cont_phone`, `property_type`, `area`, `city`, `latt`, `lng`, `pbNo`, `emirates`, `parking`, `location`, `nature_of_building`, `nearest_city`, `floor_no`, `furnished`, `electricty_and_water_included`, `size_of_room`, `number_of_room`, `bathroom_attached`, `rent`, `rent_type`, `is_negotiable`, `play_area`, `deposit`, `agreement`, `created_date`, `is_delete`, `sold_out`, `likes`) VALUES
(1, '', '', '', '', '1', '', '', NULL, NULL, '', 'Emirate 1', '1', '', '1', '', '', '1', '1', '', '', '1', '', 'Yearly', '0', '1', '', '1', '2018-03-01 10:39:18', '0', '0', '0'),
(2, '', '', '', '', '1', '', '', NULL, NULL, '', 'Emirate 1', '1', '', '1', '', '', '1', '1', '', '', '1', '', 'Yearly', '0', '1', '', '1', '2018-03-04 08:37:22', '0', '0', '0'),
(3, '', '', '', '', '1', '', '', NULL, NULL, '', 'Emirate 1', '1', '', '1', '', '', '1', '1', '', '', '1', '', 'Yearly', '0', '1', '', '1', '2018-03-04 08:44:46', '0', '0', '0'),
(4, '', '', '', '', '1', '', '', NULL, NULL, '', 'Emirate 1', '1', '', '1', '', '', '1', '1', '', '', '1', '', 'Yearly', '0', '1', '', '1', '2018-03-04 08:44:56', '0', '0', '0'),
(5, '', '', '', '', '1', '', '', NULL, NULL, '', 'Emirate 1', '1', '', '1', '', '', '1', '1', '', '', '1', '', 'Yearly', '0', '1', '', '1', '2018-03-04 08:45:06', '0', '0', '0'),
(6, '', '', '', '', '1', '', '', NULL, NULL, '', 'Emirate 1', '1', '', '1', '', '', '1', '1', '', '', '1', '', 'Yearly', '0', '1', '', '1', '2018-03-04 08:45:26', '0', '0', '0'),
(7, '', '', '', '', '1', '', '', NULL, NULL, '', 'Emirate 1', '1', '', '1', '', '', '1', '1', '', '', '1', '', 'Yearly', '0', '1', '', '1', '2018-03-04 08:45:56', '0', '0', '0'),
(8, '', '', '', '', '1', '', '', NULL, NULL, '', 'Emirate 1', '1', '', '1', '', '', '1', '1', '', '', '1', '', 'Yearly', '0', '1', '', '1', '2018-03-04 08:50:52', '0', '0', '0'),
(9, '', '', '', '', '1', '', '', NULL, NULL, '', 'Emirate 1', '1', '', '1', '', '', '1', '1', '', '', '1', '', 'Yearly', '0', '1', '', '1', '2018-03-04 08:52:45', '0', '0', '0'),
(10, '', '', '', '', '1', '', '', NULL, NULL, '', 'Emirate 1', '1', '', '1', '', '', '1', '1', '', '', '1', '', 'Yearly', '0', '1', '', '1', '2018-03-04 08:53:16', '0', '0', '0'),
(11, '', '', '', '', '1', '', '', NULL, NULL, '', 'Emirate 1', '1', '', '1', '', '', '1', '1', '', '', '1', '', 'Yearly', '0', '1', '', '1', '2018-03-04 08:53:45', '0', '0', '0'),
(12, '', '', '', '', '1', '', '', NULL, NULL, '', 'Emirate 1', '1', '', '1', '', '', '1', '1', '', '', '1', '', 'Yearly', '0', '1', '', '1', '2018-03-04 08:55:01', '0', '0', '0'),
(13, '', '', '', '', '1', '', '', NULL, NULL, '', 'Emirate 1', '1', '', '1', '', '', '1', '1', '', '', '1', '', 'Yearly', '0', '1', '', '1', '2018-03-04 08:55:27', '0', '0', '0'),
(14, '', '', '', '', '1', '', '', NULL, NULL, '', 'Emirate 1', '1', '', '1', '', '', '1', '1', '', '', '1', '', 'Yearly', '0', '1', '', '1', '2018-03-04 09:08:14', '0', '0', '0'),
(15, '', '', '', '', '1', '', '', NULL, NULL, '', 'Emirate 1', '1', '', '1', '', '', '1', '1', '', '', '1', '', 'Yearly', '0', '1', '', '1', '2018-03-04 09:08:24', '0', '0', '0'),
(16, '', '', '', '', '1', '', '', NULL, NULL, '', 'Emirate 1', '1', '', '1', '', '', '1', '1', '', '', '1', '', 'Yearly', '0', '1', '', '1', '2018-03-04 09:08:29', '0', '0', '0'),
(17, '', '', '', '', '1', '', '', NULL, NULL, '', 'Emirate 1', '1', '', '1', '', '', '1', '1', '', '', '1', '', 'Yearly', '0', '1', '', '1', '2018-03-04 09:08:56', '0', '0', '0'),
(18, '', '', '', '', '1', '', '', NULL, NULL, '', 'Emirate 1', '1', '', '1', '', '', '1', '1', '', '', '1', '', 'Yearly', '0', '1', '', '1', '2018-03-04 09:09:35', '0', '0', '0'),
(19, '', '', '', '', '1', '', '', NULL, NULL, '', 'Emirate 1', '1', '', '1', '', '', '1', '1', '', '', '1', '', 'Yearly', '0', '1', '', '1', '2018-03-04 09:27:19', '0', '0', '0'),
(20, 'asdlfkj', '', '', '', '1', 'asj', 'sdlkj', NULL, NULL, 'sdflkj', 'Emirate 1', '1', 'sdlfkgj', '1', 'wdglkfj', 'sldfkgj', '1', '1', 'sdlkgj', 'sdlkgj', '1', 'sdf\'g;j', 'Yearly', '0', '1', 'zldhjgfaj', '1', '2018-03-04 09:35:53', '0', '0', '0'),
(21, 'afsdj', '', '', '', '1', 'salkj', 'aslj', NULL, NULL, 'aslkj', 'Emirate 1', '1', 'askj', '1', 'asldkjf', 'asdlkj', '1', '1', 'aslkfj', 'as', '1', 'alh', 'Yearly', '0', '1', 'aslkjfd', '1', '2018-03-04 09:38:07', '0', '0', '0'),
(22, 'Test Property 1', '', '', '', '1', 'Dufai', 'Dufai', NULL, NULL, '124235', 'Emirate 1', '1', 'Dufai', '1', 'Dufai', '12', '1', '1', '123', '2', '1', '1234', 'Yearly', '0', '1', '12345', '1', '2018-03-04 10:23:52', '0', '0', '0'),
(23, 'asdf', 'Rent', 'asdf', 'asdf', 'Flat/Appartment', NULL, 'asdf', NULL, NULL, NULL, 'Abu Dhabi', '1', 'asf', '1', 'asdf', 'asdf', '1', '1', 'asfd', 'asdf', '1', 'asdf', 'Yearly', '0', '1', 'asdf', '1', '2018-03-04 14:24:16', '0', '0', '0'),
(24, 'test', 'Rent', 'test', 'tests', 'Flat/Appartment', NULL, 'Pattambi, Kerala, India', '10.8067836', NULL, NULL, 'Abu Dhabi', '1', 'test', '1', 'test', 'test', '1', '1', 'test', 'test', '1', 'test', 'Yearly', '0', '1', 'test', '1', '2018-03-05 09:42:34', '0', '0', '0');

-- --------------------------------------------------------

--
-- Table structure for table `gf_auth_token`
--

CREATE TABLE `gf_auth_token` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `auth_token` varchar(255) NOT NULL,
  `ip_address` varchar(20) NOT NULL,
  `loged_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `gf_auth_token`
--

INSERT INTO `gf_auth_token` (`id`, `user_id`, `auth_token`, `ip_address`, `loged_date`) VALUES
(52, 1, '$2y$10$rB8gCbwIFJJTt2B8VvpWU.WZQqgHB.aQOlnTp8gx4zMQ7OIsH4V4G', '::1', '2018-03-18 10:57:31');

-- --------------------------------------------------------

--
-- Table structure for table `gf_comercial_prop`
--

CREATE TABLE `gf_comercial_prop` (
  `id` int(11) NOT NULL,
  `property_name` varchar(255) NOT NULL,
  `property_type` varchar(50) DEFAULT NULL,
  `property_for` varchar(255) NOT NULL,
  `property_cont_name` varchar(255) NOT NULL,
  `property_cont_phone` varchar(255) NOT NULL,
  `area` varchar(50) DEFAULT NULL,
  `city` varchar(50) NOT NULL,
  `pbNo` varchar(20) DEFAULT NULL,
  `emirates` varchar(20) NOT NULL,
  `location` varchar(100) NOT NULL,
  `parking` varchar(255) DEFAULT NULL,
  `rent` varchar(50) DEFAULT NULL,
  `is_negotiable` varchar(10) NOT NULL,
  `rent_type` varchar(10) NOT NULL,
  `electricty_and_water_icluded` varchar(10) DEFAULT NULL,
  `coumbound_wall` varchar(11) DEFAULT NULL,
  `agreement` varchar(11) DEFAULT NULL,
  `size` varchar(11) DEFAULT NULL,
  `warehouse_size` varchar(11) DEFAULT NULL,
  `type_roof` varchar(50) NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_delete` varchar(11) NOT NULL DEFAULT '0',
  `sold_out` varchar(11) NOT NULL DEFAULT '0',
  `likes` varchar(11) NOT NULL DEFAULT '0',
  `dislikes` varchar(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `gf_comercial_prop`
--

INSERT INTO `gf_comercial_prop` (`id`, `property_name`, `property_type`, `property_for`, `property_cont_name`, `property_cont_phone`, `area`, `city`, `pbNo`, `emirates`, `location`, `parking`, `rent`, `is_negotiable`, `rent_type`, `electricty_and_water_icluded`, `coumbound_wall`, `agreement`, `size`, `warehouse_size`, `type_roof`, `created_date`, `is_delete`, `sold_out`, `likes`, `dislikes`) VALUES
(1, 'ASD', 'Flat/Appartment', 'Rent', 'ASD', 'ASD', NULL, 'ASD', NULL, 'Abu Dhabi', 'ASD', '1', 'ASD', '0', 'Yearly', '1', NULL, '1', 'ASD', 'ASD', 'Yearly', '2018-03-18 08:43:54', '0', '0', '0', '0'),
(2, 'asdf', NULL, 'Rent', 'asf', 'asdf', NULL, 'asf', NULL, 'Abu Dhabi', 'asf', '0', 'asf', '1', 'Yearly', '0', '0', '0', 'as', 'adf', 'Sheet', '2018-03-18 09:48:13', '0', '0', '0', '0');

-- --------------------------------------------------------

--
-- Table structure for table `gf_labour_prop`
--

CREATE TABLE `gf_labour_prop` (
  `property_name` varchar(255) NOT NULL,
  `property_for` varchar(100) DEFAULT NULL,
  `property_cont_name` varchar(255) DEFAULT NULL,
  `property_cont_phone` varchar(255) DEFAULT NULL,
  `emirates` varchar(200) NOT NULL,
  `property_type` varchar(100) DEFAULT NULL,
  `Rent` varchar(100) DEFAULT NULL,
  `Rent_type` varchar(50) DEFAULT NULL,
  `is_negotiable` varchar(100) DEFAULT NULL,
  `location` varchar(200) DEFAULT NULL,
  `number_of_rooms` varchar(10) NOT NULL,
  `bathrooms` varchar(10) NOT NULL,
  `kitchen` varchar(10) NOT NULL,
  `laundry` varchar(10) NOT NULL,
  `internet` varchar(10) NOT NULL,
  `parking` varchar(10) NOT NULL,
  `canteen` varchar(10) NOT NULL,
  `grocery` varchar(10) NOT NULL,
  `no_of_person` varchar(10) NOT NULL,
  `prayer_room` varchar(10) NOT NULL,
  `agreement` varchar(10) DEFAULT NULL,
  `water_and_electricity` varchar(10) NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_delete` varchar(10) NOT NULL DEFAULT '0',
  `sold_out` varchar(10) NOT NULL DEFAULT '0',
  `likes` varchar(10) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `gf_labour_prop`
--

INSERT INTO `gf_labour_prop` (`property_name`, `property_for`, `property_cont_name`, `property_cont_phone`, `emirates`, `property_type`, `Rent`, `Rent_type`, `is_negotiable`, `location`, `number_of_rooms`, `bathrooms`, `kitchen`, `laundry`, `internet`, `parking`, `canteen`, `grocery`, `no_of_person`, `prayer_room`, `agreement`, `water_and_electricity`, `created_date`, `is_delete`, `sold_out`, `likes`) VALUES
('ad', NULL, 'ad', 'ad', 'Abu Dhabi', NULL, NULL, NULL, NULL, NULL, 'ad', '0', '0', '0', '0', '0', '0', '0', 'sd', '0', NULL, '0', '2018-03-18 10:31:59', '0', '0', '0'),
('as', NULL, 'asd', 'dsa', 'Abu Dhabi', NULL, NULL, NULL, NULL, NULL, 'da', '0', '0', '0', '0', '0', '0', '0', 'dsa', '0', NULL, '0', '2018-03-18 10:57:52', '0', '0', '0');

-- --------------------------------------------------------

--
-- Table structure for table `gf_user`
--

CREATE TABLE `gf_user` (
  `user_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `user_code` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `gf_user`
--

INSERT INTO `gf_user` (`user_id`, `name`, `user_code`, `password`) VALUES
(1, 'admin', 'admin', '$2y$10$T6FdyK9LCcW0mbOaT6jLveqHkj3AIYep.nl1hO5rU3SZJGk39ntN2');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `df_residential_prop`
--
ALTER TABLE `df_residential_prop`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `gf_auth_token`
--
ALTER TABLE `gf_auth_token`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `gf_comercial_prop`
--
ALTER TABLE `gf_comercial_prop`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `gf_user`
--
ALTER TABLE `gf_user`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `df_residential_prop`
--
ALTER TABLE `df_residential_prop`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `gf_auth_token`
--
ALTER TABLE `gf_auth_token`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `gf_comercial_prop`
--
ALTER TABLE `gf_comercial_prop`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `gf_user`
--
ALTER TABLE `gf_user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
