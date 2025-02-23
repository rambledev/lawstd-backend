-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 23, 2025 at 05:45 PM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 7.4.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_laws`
--

-- --------------------------------------------------------

--
-- Table structure for table `tb_documents`
--

CREATE TABLE `tb_documents` (
  `id` int(11) NOT NULL,
  `subject_id` int(11) DEFAULT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tb_files`
--

CREATE TABLE `tb_files` (
  `id` int(11) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_link` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `sub_code` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tb_links`
--

CREATE TABLE `tb_links` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `link_url` varchar(500) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tb_logged`
--

CREATE TABLE `tb_logged` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `created` datetime DEFAULT current_timestamp(),
  `usertype` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `tb_news`
--

CREATE TABLE `tb_news` (
  `id` int(11) NOT NULL,
  `topic` varchar(255) NOT NULL,
  `detail` mediumblob NOT NULL,
  `author` varchar(100) NOT NULL,
  `img1` varchar(255) DEFAULT NULL,
  `img2` varchar(255) DEFAULT NULL,
  `img3` varchar(255) DEFAULT NULL,
  `img4` varchar(255) DEFAULT NULL,
  `img5` varchar(255) DEFAULT NULL,
  `img6` varchar(255) NOT NULL,
  `created` datetime DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tb_news`
--

INSERT INTO `tb_news` (`id`, `topic`, `detail`, `author`, `img1`, `img2`, `img3`, `img4`, `img5`, `img6`, `created`, `updated_at`) VALUES
(2, 'ขอแสดงความยินดีกับนางสาวณัฐรัตน์ ศรีตะวัน ', 0x3c703ee0b983e0b899e0b899e0b8b2e0b8a1e0b884e0b893e0b8b0e0b899e0b8b4e0b895e0b8b4e0b8a8e0b8b2e0b8aae0b895e0b8a3e0b98c20e0b8a1e0b8abe0b8b2e0b8a7e0b8b4e0b897e0b8a2e0b8b2e0b8a5e0b8b1e0b8a2e0b8a3e0b8b2e0b88ae0b8a0e0b8b1e0b88fe0b8a1e0b8abe0b8b2e0b8aae0b8b2e0b8a3e0b884e0b8b2e0b8a1203c2f703e3c703ee0b882e0b8ade0b981e0b8aae0b894e0b887e0b884e0b8a7e0b8b2e0b8a1e0b8a2e0b8b4e0b899e0b894e0b8b5e0b881e0b8b1e0b89ae0b899e0b8b2e0b887e0b8aae0b8b2e0b8a7e0b893e0b8b1e0b890e0b8a3e0b8b1e0b895e0b899e0b98c20e0b8a8e0b8a3e0b8b5e0b895e0b8b0e0b8a7e0b8b1e0b89920e0b984e0b894e0b989e0b8a3e0b8b1e0b89ae0b8a3e0b8b2e0b887e0b8a7e0b8b1e0b8a5e0b8a3e0b8ade0b887e0b88ae0b899e0b8b0e0b980e0b8a5e0b8b4e0b8a8e0b8ade0b8b1e0b899e0b894e0b8b1e0b89a20322028e0b980e0b8abe0b8a3e0b8b5e0b8a2e0b88de0b897e0b8ade0b887e0b981e0b894e0b8872920e0b881e0b8b2e0b8a3e0b981e0b882e0b988e0b887e0b882e0b8b1e0b899e0b980e0b897e0b884e0b8a7e0b8b1e0b899e0b982e0b89420e0b89be0b8a3e0b8b0e0b980e0b8a0e0b897203a20e0b895e0b988e0b8ade0b8aae0b8b9e0b989e0b897e0b8b5e0b8a13c2f703e3c703ee0b881e0b8b2e0b8a3e0b981e0b882e0b988e0b887e0b882e0b8b1e0b899e0b881e0b8b5e0b8ace0b8b2e0b8a1e0b8abe0b8b2e0b8a7e0b8b4e0b897e0b8a2e0b8b2e0b8a5e0b8b1e0b8a2e0b8a3e0b8b2e0b88ae0b8a0e0b8b1e0b88fe0b881e0b8a5e0b8b8e0b988e0b8a1e0b8a0e0b8b2e0b884e0b895e0b8b0e0b8a7e0b8b1e0b899e0b8ade0b8ade0b881e0b980e0b889e0b8b5e0b8a2e0b887e0b980e0b8abe0b899e0b8b7e0b8ade0b89be0b8a3e0b8b0e0b888e0b8b3e0b89be0b8b5203235363720e0b884e0b8a3e0b8b1e0b989e0b887e0b897e0b8b5e0b988203434203c2f703e3c703e23e0b980e0b897e0b884e0b8a7e0b8b1e0b899e0b982e0b89423e0b899e0b8b4e0b895e0b8b4e0b8a8e0b8b2e0b8aae0b895e0b8a3e0b98ce0b8a1e0b8a3e0b8a12023e0b884e0b893e0b8b0e0b899e0b8b4e0b895e0b8b4e0b8a8e0b8b2e0b8aae0b895e0b8a3e0b98c2023e0b884e0b88ae0b8aae0b8b2e0b8a3e0b980e0b881e0b8a1e0b8aae0b98c20235465616b776f6e646f3c2f703e3c703e3c62723e3c2f703e, 'admin', '1740291185807.jpg', NULL, NULL, NULL, NULL, '', '2025-02-23 06:13:05', '0000-00-00 00:00:00'),
(3, 'ขอแสดงความยินดีกับทนายความใหม่', 0x3c683120636c6173733d22716c2d616c69676e2d63656e746572223ee0b983e0b899e0b899e0b8b2e0b8a120e0b884e0b893e0b8b0e0b899e0b8b4e0b895e0b8b4e0b8a8e0b8b2e0b8aae0b895e0b8a3e0b98c20e0b8a1e0b8abe0b8b2e0b8a7e0b8b4e0b897e0b8a2e0b8b2e0b8a5e0b8b1e0b8a2e0b8a3e0b8b2e0b88ae0b8a0e0b8b1e0b88fe0b8a1e0b8abe0b8b2e0b8aae0b8b2e0b8a3e0b884e0b8b2e0b8a1203c2f68313e3c7020636c6173733d22716c2d616c69676e2d63656e746572223e3c62723e3c2f703e3c683220636c6173733d22716c2d616c69676e2d63656e746572223ee0b882e0b8ade0b981e0b8aae0b894e0b887e0b884e0b8a7e0b8b2e0b8a1e0b8a2e0b8b4e0b899e0b894e0b8b5e0b881e0b8b1e0b89ae0b897e0b899e0b8b2e0b8a2e0b884e0b8a7e0b8b2e0b8a1e0b983e0b8abe0b8a1e0b988e0b897e0b8b8e0b881e0b897e0b988e0b8b2e0b89920e0b981e0b8a5e0b8b0e0b882e0b8ade0b983e0b8abe0b989e0b897e0b8b8e0b881e0b897e0b988e0b8b2e0b899e0b89be0b8a3e0b8b0e0b8aae0b89ae0b884e0b8a7e0b8b2e0b8a1e0b8aae0b8b3e0b980e0b8a3e0b987e0b888e0b983e0b899e0b881e0b8b2e0b8a3e0b89be0b8a3e0b8b0e0b881e0b8ade0b89ae0b8ade0b8b2e0b88ae0b8b5e0b89ee0b895e0b988e0b8ade0b984e0b89b203c2f68323e3c7020636c6173733d22716c2d616c69676e2d63656e746572223e3c62723e3c2f703e3c7020636c6173733d22716c2d616c69676e2d63656e746572223e23e0b897e0b899e0b8b2e0b8a2e0b884e0b8a7e0b8b2e0b8a12023e0b899e0b8b4e0b895e0b8b4e0b8a1e0b8a3e0b8a12e23e0b899e0b8b4e0b895e0b8b4e0b8a8e0b8b2e0b8aae0b895e0b8a3e0b98ce0b8a1e0b8a3e0b8a12023e0b884e0b893e0b8b0e0b899e0b8b4e0b895e0b8b4e0b8a8e0b8b2e0b8aae0b895e0b8a3e0b98c3c2f703e3c703e3c6120687265663d2268747470733a2f2f7777772e66616365626f6f6b2e636f6d2f4c61772e46432e524d552f3f6c6f63616c653d74685f5448222072656c3d226e6f6f70656e6572206e6f726566657272657222207461726765743d225f626c616e6b223ee0b982e0b89ee0b8aae0b895e0b989e0b899e0b889e0b89ae0b8b1e0b89a3c2f613e3c2f703e, 'admin', '1740291686420.jpg', NULL, NULL, NULL, NULL, '', '2025-02-23 06:21:26', '0000-00-00 00:00:00'),
(4, 'ขอแสดงความยินดีกับว่าที่ทนายความใหม่ทุกท่าน', 0x3c68323ee0b983e0b899e0b899e0b8b2e0b8a120e0b884e0b893e0b8b0e0b899e0b8b4e0b895e0b8b4e0b8a8e0b8b2e0b8aae0b895e0b8a3e0b98c20e0b8a1e0b8abe0b8b2e0b8a7e0b8b4e0b897e0b8a2e0b8b2e0b8a5e0b8b1e0b8a2e0b8a3e0b8b2e0b88ae0b8a0e0b8b1e0b88fe0b8a1e0b8abe0b8b2e0b8aae0b8b2e0b8a3e0b884e0b8b2e0b8a1203c2f68323e3c68323ee0b882e0b8ade0b981e0b8aae0b894e0b887e0b884e0b8a7e0b8b2e0b8a1e0b8a2e0b8b4e0b899e0b894e0b8b5e0b881e0b8b1e0b89ae0b8a7e0b988e0b8b2e0b897e0b8b5e0b988e0b897e0b899e0b8b2e0b8a2e0b884e0b8a7e0b8b2e0b8a1e0b983e0b8abe0b8a1e0b988e0b897e0b8b8e0b881e0b897e0b988e0b8b2e0b89920e0b981e0b8a5e0b8b0e0b882e0b8ade0b983e0b8abe0b989e0b897e0b8b8e0b881e0b897e0b988e0b8b2e0b899e0b89be0b8a3e0b8b0e0b8aae0b89ae0b884e0b8a7e0b8b2e0b8a1e0b8aae0b8b3e0b980e0b8a3e0b987e0b888e0b983e0b899e0b8a5e0b8b3e0b894e0b8b1e0b89ae0b895e0b988e0b8ade0b984e0b89b203c2f68323e3c68323e23e0b897e0b899e0b8b2e0b8a2e0b884e0b8a7e0b8b2e0b8a1e0b8a3e0b8b8e0b988e0b89936332023e0b897e0b899e0b8b2e0b8a2e0b884e0b8a7e0b8b2e0b8a12023e0b899e0b8b4e0b895e0b8b4e0b8a1e0b8a3e0b8a12e23e0b899e0b8b4e0b895e0b8b4e0b8a8e0b8b2e0b8aae0b895e0b8a3e0b98ce0b8a1e0b8a3e0b8a12023e0b884e0b893e0b8b0e0b899e0b8b4e0b895e0b8b4e0b8a8e0b8b2e0b8aae0b895e0b8a3e0b98c3c2f68323e3c703e3c62723e3c2f703e, 'admin', '1740292145707.jpg', '1740292145710.jpg', '1740292145711.jpg', NULL, NULL, '', '2025-02-23 06:29:05', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `tb_student`
--

CREATE TABLE `tb_student` (
  `std_code` varchar(10) NOT NULL,
  `std_name` varchar(255) DEFAULT NULL,
  `email` varchar(250) NOT NULL,
  `password` varchar(250) NOT NULL,
  `std_school` varchar(255) DEFAULT NULL,
  `regist_date` datetime DEFAULT NULL,
  `faculty` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tb_student`
--

INSERT INTO `tb_student` (`std_code`, `std_name`, `email`, `password`, `std_school`, `regist_date`, `faculty`, `status`) VALUES
('6850101733', 'นางสาวพนิตา ก้อนสีลา', '6850101733@rmu.ac.th', '6850101733', 'โรงเรียนเสลภูมิพิทยาคม', '2024-11-01 10:28:00', 'น.บ.นิติศาสตร์', 'ชำระเงินแล้ว'),
('6850101744', 'นายจีรภัทร บาลศรี', '6850101744@rmu.ac.th', '6850101744', 'โรงเรียนคำม่วง', '2024-11-01 12:20:00', 'น.บ.นิติศาสตร์', 'ชำระเงินแล้ว'),
('6850101773', 'นายพีรภัทร พันโยศรี', '6850101773@rmu.ac.th', '6850101773', 'โรงเรียนวาปีปทุม', '2024-11-01 20:09:00', 'น.บ.นิติศาสตร์', 'ชำระเงินแล้ว'),
('6850101777', 'นางสาวสกุลรัตน์ เมืองซอง', '6850101777@rmu.ac.th', '6850101777', 'โรงเรียนกุฉินารายณ์', '2024-11-01 20:43:00', 'น.บ.นิติศาสตร์', 'ผู้สมัคร'),
('6850101779', 'นายภัทรธร อึ้งสำราญ', '6850101779@rmu.ac.th', '6850101779', 'โรงเรียนเสลภูมิพิทยาคม', '2024-11-01 20:51:00', 'น.บ.นิติศาสตร์', 'ชำระเงินแล้ว'),
('6850101783', 'นายอนุชิต ไกรสูนย์', '6850101783@rmu.ac.th', '6850101783', 'โรงเรียนโพนทองพัฒนาวิทยา', '2024-11-01 21:48:00', 'น.บ.นิติศาสตร์', 'ผู้สมัคร'),
('6850101785', 'นางสาวหทัยชนก เดชสุทธิ์', '6850101785@rmu.ac.th', '6850101785', 'โรงเรียนหนองคายวิทยาคาร', '2024-11-01 22:33:00', 'น.บ.นิติศาสตร์', 'ชำระเงินแล้ว'),
('6850101790', 'นายพิพัฒน์ ประวะเสนัง', '6850101790@rmu.ac.th', '6850101790', 'โรงเรียนเสือโก้กวิทยาสรรค์', '2024-11-02 07:26:00', 'น.บ.นิติศาสตร์', 'ผู้สมัคร'),
('6850101793', 'นางสาวชลนิชา ปะระขา ปะระขา', '6850101793@rmu.ac.th', '6850101793', 'โรงเรียนนาเชือกพิทยาสรรค์', '2024-11-02 09:48:00', 'น.บ.นิติศาสตร์', 'ผู้สมัคร'),
('6850101812', 'นางสาวอิสริยาภรณ์ โสสุด', '6850101812@rmu.ac.th', '6850101812', 'โรงเรียนเสลภูมิพิทยาคม', '2024-11-02 18:43:00', 'น.บ.นิติศาสตร์', 'ผู้สมัคร'),
('6850101831', 'นางสาวปวริศา ปิดตังถาโน', '6850101831@rmu.ac.th', '6850101831', 'โรงเรียนนาเชือกพิทยาสรรค์', '2024-11-03 15:46:00', 'น.บ.นิติศาสตร์', 'ผู้สมัคร'),
('6850101860', 'นางสาวอภิญญา แขมโคตร', '6850101860@rmu.ac.th', '6850101860', 'โรงเรียนเหมืองแบ่งวิทยาคม', '2024-11-04 12:43:00', 'น.บ.นิติศาสตร์', 'ชำระเงินแล้ว'),
('6850101878', 'นางสาวเกวริน สุขบาล', '6850101878@rmu.ac.th', '6850101878', 'โรงเรียนสิรินธรวิทยานุสรณ์', '2024-11-04 20:04:00', 'น.บ.นิติศาสตร์', 'ผู้สมัคร'),
('6850101886', 'นายณัฐชนน เพ็งพันธ์', '6850101886@rmu.ac.th', '6850101886', 'โรงเรียนโพนทองพัฒนาวิทยา', '2024-11-05 09:26:00', 'น.บ.นิติศาสตร์', 'ผู้สมัคร'),
('6850101918', 'นางสาวศุภัชญา งามขำ', '6850101918@rmu.ac.th', '6850101918', 'โรงเรียนหนองเรือวิทยา', '2024-11-05 17:33:00', 'น.บ.นิติศาสตร์', 'ชำระเงินแล้ว'),
('6850101933', 'นางสาวสัตตบงกช ไมขุนทด', '6850101933@rmu.ac.th', '6850101933', 'โรงเรียนบัวเชดวิทยา', '2024-11-06 06:52:00', 'น.บ.นิติศาสตร์', 'ชำระเงินแล้ว'),
('6850101940', 'นางสาวปนัดดา ตติยะรัตน์', '6850101940@rmu.ac.th', '6850101940', 'โรงเรียนเมืองกาฬสินธุ์', '2024-11-06 09:57:00', 'น.บ.นิติศาสตร์', 'ผู้สมัคร'),
('6850101992', 'นางสาวสิริเพ็ญ ภูทำมา', '6850101992@rmu.ac.th', '6850101992', 'โรงเรียนยางตลาดวิทยาคาร', '2024-11-07 08:53:00', 'น.บ.นิติศาสตร์', 'ผู้สมัคร'),
('6850102102', 'นางสาวชนิสรา ชินโฮง', '6850102102@rmu.ac.th', '6850102102', 'โรงเรียนผดุงนารี', '2024-11-10 00:14:00', 'น.บ.นิติศาสตร์', 'ชำระเงินแล้ว'),
('6850102108', 'นายรุ่งโรจน์ ชมภูทิพย์', '6850102108@rmu.ac.th', '6850102108', 'โรงเรียนบัวขาว', '2024-11-10 12:35:00', 'น.บ.นิติศาสตร์', 'ชำระเงินแล้ว');

-- --------------------------------------------------------

--
-- Table structure for table `tb_subject`
--

CREATE TABLE `tb_subject` (
  `id` int(11) NOT NULL,
  `sub_code` varchar(10) NOT NULL,
  `sub_name` varchar(255) NOT NULL,
  `sub_program` varchar(255) DEFAULT NULL,
  `sub_unit` int(11) NOT NULL,
  `sub_term` varchar(20) NOT NULL,
  `sub_teacher` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tb_subject_list`
--

CREATE TABLE `tb_subject_list` (
  `id` int(11) NOT NULL,
  `sub_code` varchar(10) NOT NULL,
  `std_code` varchar(10) NOT NULL,
  `std_name` varchar(100) NOT NULL,
  `status` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tb_user`
--

CREATE TABLE `tb_user` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tb_user`
--

INSERT INTO `tb_user` (`id`, `username`, `password`, `role`) VALUES
(1, 'admin', '$2b$10$/YZh61OcuG//kXLIBEEZQOr/Mtj7gamQSL7r.j/1D/TsOfr7JzeGK', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `tb_vdo`
--

CREATE TABLE `tb_vdo` (
  `id` int(11) NOT NULL,
  `vdo_name` varchar(255) NOT NULL,
  `vdo_link` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `sub_code` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tb_vdo_views`
--

CREATE TABLE `tb_vdo_views` (
  `id` int(11) NOT NULL,
  `vdo_id` int(11) DEFAULT NULL,
  `std_code` int(11) DEFAULT NULL,
  `view_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tb_documents`
--
ALTER TABLE `tb_documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `subject_id` (`subject_id`);

--
-- Indexes for table `tb_files`
--
ALTER TABLE `tb_files`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_links`
--
ALTER TABLE `tb_links`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_logged`
--
ALTER TABLE `tb_logged`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_news`
--
ALTER TABLE `tb_news`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_student`
--
ALTER TABLE `tb_student`
  ADD PRIMARY KEY (`std_code`);

--
-- Indexes for table `tb_subject`
--
ALTER TABLE `tb_subject`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sub_code` (`sub_code`);

--
-- Indexes for table `tb_subject_list`
--
ALTER TABLE `tb_subject_list`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sub_code` (`sub_code`),
  ADD KEY `std_code` (`std_code`);

--
-- Indexes for table `tb_user`
--
ALTER TABLE `tb_user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_vdo`
--
ALTER TABLE `tb_vdo`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_vdo_views`
--
ALTER TABLE `tb_vdo_views`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vdo_id` (`vdo_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tb_documents`
--
ALTER TABLE `tb_documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_files`
--
ALTER TABLE `tb_files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_links`
--
ALTER TABLE `tb_links`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_logged`
--
ALTER TABLE `tb_logged`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_news`
--
ALTER TABLE `tb_news`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tb_subject`
--
ALTER TABLE `tb_subject`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_subject_list`
--
ALTER TABLE `tb_subject_list`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_user`
--
ALTER TABLE `tb_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tb_vdo`
--
ALTER TABLE `tb_vdo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `tb_vdo_views`
--
ALTER TABLE `tb_vdo_views`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tb_documents`
--
ALTER TABLE `tb_documents`
  ADD CONSTRAINT `tb_documents_ibfk_1` FOREIGN KEY (`subject_id`) REFERENCES `tb_vdo` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tb_subject_list`
--
ALTER TABLE `tb_subject_list`
  ADD CONSTRAINT `tb_subject_list_ibfk_2` FOREIGN KEY (`std_code`) REFERENCES `tb_student` (`std_code`);

--
-- Constraints for table `tb_vdo_views`
--
ALTER TABLE `tb_vdo_views`
  ADD CONSTRAINT `tb_vdo_views_ibfk_1` FOREIGN KEY (`vdo_id`) REFERENCES `tb_vdo` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
