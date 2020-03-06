-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Mar 06, 2020 at 01:04 AM
-- Server version: 5.7.26
-- PHP Version: 7.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ABET`
--

-- --------------------------------------------------------

--
-- Table structure for table `ACADEMIC_TERM`
--

DROP TABLE IF EXISTS `ACADEMIC_TERM`;
CREATE TABLE IF NOT EXISTS `ACADEMIC_TERM` (
  `term_ID` int(11) NOT NULL AUTO_INCREMENT,
  `term_name` varchar(255) NOT NULL,
  PRIMARY KEY (`term_ID`),
  UNIQUE KEY `term_name` (`term_name`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `ACADEMIC_TERM`
--

INSERT INTO `ACADEMIC_TERM` (`term_ID`, `term_name`) VALUES
(4, 'SEMESTER AUG-DEC 2017'),
(2, 'SEMESTER AUG-DEC 2018'),
(1, 'SEMESTER AUG-DEC 2019'),
(5, 'SEMESTER AUG-DEC 2020'),
(10, 'SEMESTER JAN-MAY 2017'),
(9, 'SEMESTER JAN-MAY 2018'),
(6, 'SEMESTER JAN-MAY 2019'),
(11, 'SEMESTER JAN-MAY 2020');

-- --------------------------------------------------------

--
-- Table structure for table `ASSESSMENT`
--

DROP TABLE IF EXISTS `ASSESSMENT`;
CREATE TABLE IF NOT EXISTS `ASSESSMENT` (
  `assessment_ID` int(11) NOT NULL AUTO_INCREMENT,
  `course_ID` int(11) DEFAULT NULL,
  `term_ID` int(11) NOT NULL,
  `user_ID` int(11) DEFAULT NULL,
  `rubric_ID` int(11) DEFAULT NULL,
  `course_section` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`assessment_ID`),
  KEY `user_ID` (`user_ID`),
  KEY `course_ID` (`course_ID`),
  KEY `rubric_ID` (`rubric_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=151 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `ASSESSMENT`
--

INSERT INTO `ASSESSMENT` (`assessment_ID`, `course_ID`, `term_ID`, `user_ID`, `rubric_ID`, `course_section`) VALUES
(94, 49, 1, 10, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `COURSE`
--

DROP TABLE IF EXISTS `COURSE`;
CREATE TABLE IF NOT EXISTS `COURSE` (
  `course_ID` int(11) NOT NULL AUTO_INCREMENT,
  `course_name` varchar(25) NOT NULL,
  `course_number` varchar(255) NOT NULL,
  `course_description` varchar(255) DEFAULT NULL,
  `date_created` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`course_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `COURSE`
--

INSERT INTO `COURSE` (`course_ID`, `course_name`, `course_number`, `course_description`, `date_created`) VALUES
(48, 'Precalculus', 'MATH', '5 Credit course', '2020-02-08 20:59:03'),
(49, 'Precalculus', 'MATH', '5 Credit course', '2020-02-08 20:59:31'),
(50, 'Intro to Programming', 'COEN', '4 Credit course', '2020-02-08 20:59:54'),
(51, 'Advance Programming', 'COEN', '4 Credit course', '2020-02-08 21:00:06'),
(52, 'Electronic I', 'ELEN', '4 Credit course', '2020-02-08 21:00:18'),
(61, 'Data Science', 'COEN', 'Computer Engineer Data sCience Course', '2020-02-28 02:52:52'),
(62, 'dasdas', 'COEN 2020', 'dasdasdasdas', '2020-03-05 17:57:58');

-- --------------------------------------------------------

--
-- Table structure for table `DEPARTMENT`
--

DROP TABLE IF EXISTS `DEPARTMENT`;
CREATE TABLE IF NOT EXISTS `DEPARTMENT` (
  `dep_ID` int(11) NOT NULL AUTO_INCREMENT,
  `dep_name` varchar(255) NOT NULL,
  `dep_description` varchar(255) DEFAULT NULL,
  `date_created` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`dep_ID`),
  UNIQUE KEY `dep_name` (`dep_name`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `DEPARTMENT`
--

INSERT INTO `DEPARTMENT` (`dep_ID`, `dep_name`, `dep_description`, `date_created`) VALUES
(14, 'Industrial Engineering Department', 'Industrial Engineering Department', '2020-02-08 20:35:10'),
(15, 'Mechanical Engineering Department', 'Mechanical Engineering Department', '2020-02-08 20:35:56'),
(16, 'Electrical And Computer Engineering Department', 'Electrical And Computer Engineering Department', '2020-02-08 20:36:38');

-- --------------------------------------------------------

--
-- Table structure for table `EVALUATION_RUBRIC`
--

DROP TABLE IF EXISTS `EVALUATION_RUBRIC`;
CREATE TABLE IF NOT EXISTS `EVALUATION_RUBRIC` (
  `rubric_ID` int(11) NOT NULL AUTO_INCREMENT,
  `rubric_name` varchar(255) NOT NULL,
  `rubric_description` varchar(255) DEFAULT NULL,
  `outc_ID` int(11) NOT NULL,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  PRIMARY KEY (`rubric_ID`),
  KEY `outc_ID` (`outc_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `EVALUATION_RUBRIC`
--

INSERT INTO `EVALUATION_RUBRIC` (`rubric_ID`, `rubric_name`, `rubric_description`, `outc_ID`, `date_created`, `date_modified`) VALUES
(27, 'RUBRIC TERM', 'bla bla bla bla', 33, NULL, NULL),
(28, 'dbhsad', 'dbashdbas', 17, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `OUTCOME_COURSE`
--

DROP TABLE IF EXISTS `OUTCOME_COURSE`;
CREATE TABLE IF NOT EXISTS `OUTCOME_COURSE` (
  `course_ID` int(11) NOT NULL,
  `outc_ID` int(11) NOT NULL,
  UNIQUE KEY `course_ID_2` (`course_ID`,`outc_ID`),
  KEY `outc_ID` (`outc_ID`),
  KEY `course_ID` (`course_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `OUTCOME_COURSE`
--

INSERT INTO `OUTCOME_COURSE` (`course_ID`, `outc_ID`) VALUES
(61, 17),
(51, 18),
(61, 18);

-- --------------------------------------------------------

--
-- Table structure for table `PERFORMANCE_RUBRIC`
--

DROP TABLE IF EXISTS `PERFORMANCE_RUBRIC`;
CREATE TABLE IF NOT EXISTS `PERFORMANCE_RUBRIC` (
  `rubric_ID` int(11) NOT NULL AUTO_INCREMENT,
  `perC_ID` int(11) NOT NULL,
  PRIMARY KEY (`rubric_ID`,`perC_ID`),
  KEY `PERFORMANCE_RUBRIC_ibfk_1` (`perC_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `PERFORMANCE_RUBRIC`
--

INSERT INTO `PERFORMANCE_RUBRIC` (`rubric_ID`, `perC_ID`) VALUES
(27, 72),
(27, 73),
(28, 75);

-- --------------------------------------------------------

--
-- Table structure for table `PERF_CRITERIA`
--

DROP TABLE IF EXISTS `PERF_CRITERIA`;
CREATE TABLE IF NOT EXISTS `PERF_CRITERIA` (
  `perC_ID` int(11) NOT NULL AUTO_INCREMENT,
  `perC_Desk` varchar(255) DEFAULT NULL,
  `perC_order` int(11) DEFAULT NULL,
  `outc_ID` int(11) NOT NULL,
  PRIMARY KEY (`perC_ID`),
  KEY `outc_ID` (`outc_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `PERF_CRITERIA`
--

INSERT INTO `PERF_CRITERIA` (`perC_ID`, `perC_Desk`, `perC_order`, `outc_ID`) VALUES
(72, 'TEST 1', 1, 33),
(73, 'TEST 2', 2, 33),
(74, 'PERC -OUTCOME 1 - Computer Engin', 1, 17),
(75, 'Outcome 1 - Computer Engineering', 2, 17),
(76, 'Outcome 2 - Computer Engineering', 1, 18),
(77, 'TEST TEST TEST', 1, 19),
(78, 'TEST TEST TEST', 2, 19),
(79, 'ASdjas', 3, 19),
(80, 'dasdasdsa', 4, 19),
(81, 'dasdasdsa', 6, 19),
(82, 'dasdasdsa', 7, 19),
(83, 'dasdasdsa', 9, 19),
(84, 'dasdasdsa', 10, 19),
(85, 'dasdasdsa', 10, 19),
(86, 'dasdasdsa', 10, 19);

-- --------------------------------------------------------

--
-- Table structure for table `PROFILE`
--

DROP TABLE IF EXISTS `PROFILE`;
CREATE TABLE IF NOT EXISTS `PROFILE` (
  `profile_ID` int(11) NOT NULL AUTO_INCREMENT,
  `profile_Name` varchar(255) NOT NULL,
  PRIMARY KEY (`profile_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `PROFILE`
--

INSERT INTO `PROFILE` (`profile_ID`, `profile_Name`) VALUES
(1, 'Admin'),
(2, 'Professor');

-- --------------------------------------------------------

--
-- Table structure for table `PROG_COURSE`
--

DROP TABLE IF EXISTS `PROG_COURSE`;
CREATE TABLE IF NOT EXISTS `PROG_COURSE` (
  `course_ID` int(11) NOT NULL,
  `prog_ID` int(11) NOT NULL,
  UNIQUE KEY `course_ID_2` (`course_ID`,`prog_ID`),
  KEY `course_ID` (`course_ID`),
  KEY `prog_ID` (`prog_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `PROG_COURSE`
--

INSERT INTO `PROG_COURSE` (`course_ID`, `prog_ID`) VALUES
(48, 51),
(49, 52),
(50, 51),
(51, 51),
(52, 52),
(61, 51),
(61, 52),
(62, 51),
(62, 52),
(62, 53),
(62, 54),
(62, 55);

-- --------------------------------------------------------

--
-- Table structure for table `REPORTS`
--

DROP TABLE IF EXISTS `REPORTS`;
CREATE TABLE IF NOT EXISTS `REPORTS` (
  `report_ID` int(11) NOT NULL AUTO_INCREMENT,
  `grade_A` int(11) DEFAULT NULL,
  `grade_B` int(11) DEFAULT NULL,
  `grade_C` int(11) DEFAULT NULL,
  `grade_D` int(11) DEFAULT NULL,
  `grade_F` int(11) DEFAULT NULL,
  `UW` varchar(255) DEFAULT NULL,
  `evaluation_comments` varchar(255) DEFAULT NULL,
  `reflexion_comments` varchar(255) DEFAULT NULL,
  `actions_comments` varchar(255) DEFAULT NULL,
  `assessment_ID` int(11) DEFAULT NULL,
  PRIMARY KEY (`report_ID`),
  KEY `assessment_ID` (`assessment_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=121 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `REPORTS`
--

INSERT INTO `REPORTS` (`report_ID`, `grade_A`, `grade_B`, `grade_C`, `grade_D`, `grade_F`, `UW`, `evaluation_comments`, `reflexion_comments`, `actions_comments`, `assessment_ID`) VALUES
(1, 2, 4, 4, 4, 3, '2', 'Holaq', 'Ya', 'seguimos', NULL),
(2, 4, 4, 3, 5, 1, '0', 'Probando', 'Ayuda', 'Nose', NULL),
(3, 2, 2, 2, 2, 2, '2', '2', '2', '2', NULL),
(4, 4, 4, 4, 4, 4, '4', 'Hiiii this is a test', 'They suck, they all flunk', ' hghcghfghgh', NULL),
(5, 1, 1, 1, 1, 1, '1', 'jhsdgfkjsdsknbjk', 'gfxhcgvhbm,.,', 'lsgflksndfnksdnf', NULL),
(6, 2, 2, 2, 2, 2, '2', 'This a result course test', 'this is a course reflection test', '\r\nprovide action for course improvement test', NULL),
(7, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(8, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(9, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(10, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(11, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(12, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(13, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(14, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(15, 4, 1, 5, 4, 43, '34', '324', '42', '42', NULL),
(16, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(17, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(18, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(19, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(20, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(21, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(22, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(23, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(24, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(25, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(26, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(27, 2, 2, 2, 2, 2, '22', '2', '2', '2', NULL),
(28, 2, 2, 2, 2, 2, '22', '2', '2', '2', NULL),
(29, 2, 2, 2, 2, 2, '22', '2', '2', '2', NULL),
(30, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(31, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(32, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(33, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(34, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(35, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(36, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(37, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(38, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(39, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(40, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(41, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(42, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(43, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(44, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(45, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(46, 1, 1, 1, 1, 1, '1', '1', '1', '', NULL),
(47, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(48, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(49, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(50, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(51, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(52, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(53, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(54, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(55, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(56, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(57, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(58, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(59, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(60, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(61, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(62, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(63, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(64, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(65, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(66, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(67, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(68, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(69, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(70, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(71, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(72, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(73, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(74, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(75, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(76, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(77, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(78, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(79, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(80, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(81, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(82, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(83, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(84, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(85, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(86, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(87, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(88, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(89, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(90, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(91, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(92, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(93, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(94, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(95, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(96, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(97, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(98, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(99, 1, 1, 1, 1, 1, '1', '1', '1', '11', NULL),
(100, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(101, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(102, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(103, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(104, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(105, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(106, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(107, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(108, 2, 2, 2, 2, 2, '2', '2', '2', '2', NULL),
(109, 1, 1, 1, 1, 1, '1', '1', '1', '11', NULL),
(110, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(111, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(112, 1, 1, 1, 1, 1, '1', '1', '1', '11', NULL),
(113, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(114, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(115, 1, 1, 11, 1, 1, '1', '1', '1', '1', NULL),
(116, 3, 5, 3, 3, 3, '33', '3', '3', '3', NULL),
(117, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(118, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(119, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL),
(120, 1, 1, 1, 1, 1, '1', '1', '1', '1', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `STUDENT_OUTCOME`
--

DROP TABLE IF EXISTS `STUDENT_OUTCOME`;
CREATE TABLE IF NOT EXISTS `STUDENT_OUTCOME` (
  `outc_ID` int(11) NOT NULL AUTO_INCREMENT,
  `outc_name` varchar(255) NOT NULL,
  `outc_description` varchar(255) DEFAULT NULL,
  `date_created` datetime DEFAULT CURRENT_TIMESTAMP,
  `prog_ID` int(11) NOT NULL,
  PRIMARY KEY (`outc_ID`),
  KEY `prog_ID` (`prog_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `STUDENT_OUTCOME`
--

INSERT INTO `STUDENT_OUTCOME` (`outc_ID`, `outc_name`, `outc_description`, `date_created`, `prog_ID`) VALUES
(17, 'Outcome 1', 'An ability to identify, formulate, and solve complex engineering problems by applying principles of engineering, science, and mathematics.', '2020-02-27 17:33:26', 51),
(18, 'Outcome 2', 'An ability to apply engineering design to produce solutions that meet specified needs with consideration of public health, safety, and welfare, as well as global, cultural, social, environmental, and economic factors.', '2020-02-27 18:02:28', 51),
(19, 'Outcome 3', 'An ability to communicate effectively with a range of audiences.', '2020-02-27 18:03:28', 51),
(20, 'Outcome 4', 'An ability to recognize ethical and professional responsibilities in engineering situations and make informed judgments, which must consider the impact of engineering solutions in global, economic, environmental, and societal contexts.', '2020-02-27 18:05:29', 51),
(21, 'Outcome 5', 'An ability to function effectively on a team whose members together provide leadership, create a collaborative and inclusive environment, establish goals, plan tasks, and meet objectives.', '2020-02-27 18:06:55', 51),
(22, 'Outcome 6', 'An ability to develop and conduct appropriate experimentation, analyze and interpret data, and use engineering judgment to draw conclusions.', '2020-02-27 18:07:57', 51),
(23, 'Outcome 7', 'An ability to acquire and apply new knowledge as needed, using appropriate learning strategies.', '2020-02-27 18:08:53', 51),
(24, 'Outcome 1', 'An ability to identify, formulate, and solve complex engineering problems by applying principles of engineering, science, and mathematics.', '2020-02-29 17:20:14', 52),
(26, 'Outcome 2', 'An ability to apply engineering design to produce solutions that meet specified needs with consideration of public health, safety, and welfare, as well as global, cultural, social, environmental, and economic factors.', '2020-02-29 17:21:26', 52),
(27, 'Outcome 3', 'An ability to communicate effectively with a range of audiences.', '2020-02-29 17:21:42', 52),
(28, 'Outcome 4', 'An ability to recognize ethical and professional responsibilities in engineering situations and make informed judgments, which must consider the impact of engineering solutions in global, economic, environmental, and societal contexts.', '2020-02-29 17:21:59', 52),
(29, 'Outcome 5', 'An ability to function effectively on a team whose members together provide leadership, create a collaborative and inclusive environment, establish goals, plan tasks, and meet objectives.', '2020-02-29 17:22:49', 52),
(30, 'Outcome 6', 'An ability to develop and conduct appropriate experimentation, analyze and interpret data, and use engineering judgment to draw conclusions.', '2020-02-29 17:23:06', 52),
(31, 'Outcome 7', 'An ability to acquire and apply new knowledge as needed, using appropriate learning strategies.', '2020-02-29 17:23:27', 52),
(32, 'OUTCOME 1', 'Student should be able to read and speck', '2020-03-05 11:25:54', 54),
(33, 'OUTCOME 2', 'OUTCOME FOR THIS NEW', '2020-03-05 11:40:34', 55);

-- --------------------------------------------------------

--
-- Table structure for table `STUDENT_PERFORMANCE`
--

DROP TABLE IF EXISTS `STUDENT_PERFORMANCE`;
CREATE TABLE IF NOT EXISTS `STUDENT_PERFORMANCE` (
  `student_ID` int(11) NOT NULL AUTO_INCREMENT,
  `pc_1` varchar(255) DEFAULT NULL,
  `pc_2` varchar(255) DEFAULT NULL,
  `pc_3` varchar(255) DEFAULT NULL,
  `pc_4` varchar(255) DEFAULT NULL,
  `pc_5` varchar(255) DEFAULT NULL,
  `assessment_ID` int(11) DEFAULT NULL,
  PRIMARY KEY (`student_ID`),
  KEY `assessment_ID` (`assessment_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=122 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `STUDENT_PERFORMANCE`
--

INSERT INTO `STUDENT_PERFORMANCE` (`student_ID`, `pc_1`, `pc_2`, `pc_3`, `pc_4`, `pc_5`, `assessment_ID`) VALUES
(20, NULL, NULL, NULL, NULL, NULL, NULL),
(42, NULL, NULL, NULL, NULL, NULL, NULL),
(43, NULL, NULL, NULL, NULL, NULL, NULL),
(44, NULL, NULL, NULL, NULL, NULL, NULL),
(60, NULL, NULL, NULL, NULL, NULL, NULL),
(61, NULL, NULL, NULL, NULL, NULL, NULL),
(85, NULL, NULL, NULL, NULL, NULL, NULL),
(86, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `STUDY_PROGRAM`
--

DROP TABLE IF EXISTS `STUDY_PROGRAM`;
CREATE TABLE IF NOT EXISTS `STUDY_PROGRAM` (
  `prog_ID` int(11) NOT NULL AUTO_INCREMENT,
  `prog_name` varchar(255) NOT NULL,
  `date_created` datetime DEFAULT CURRENT_TIMESTAMP,
  `dep_ID` int(11) NOT NULL,
  PRIMARY KEY (`prog_ID`),
  UNIQUE KEY `prog_name` (`prog_name`),
  KEY `dep_ID` (`dep_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `STUDY_PROGRAM`
--

INSERT INTO `STUDY_PROGRAM` (`prog_ID`, `prog_name`, `date_created`, `dep_ID`) VALUES
(51, 'Computer Engineering', '2020-02-08 20:39:00', 16),
(52, 'Electrical Engineering', '2020-02-08 20:39:43', 16),
(53, 'Mechanical Engineering', '2020-02-08 20:39:44', 15),
(54, 'Industrial Engineering', '2020-02-08 20:39:44', 14),
(55, 'NEW INDUSTRIAL ENG', '2020-03-05 11:38:31', 14);

-- --------------------------------------------------------

--
-- Table structure for table `USER`
--

DROP TABLE IF EXISTS `USER`;
CREATE TABLE IF NOT EXISTS `USER` (
  `user_ID` int(11) NOT NULL AUTO_INCREMENT,
  `inter_ID` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) NOT NULL,
  `date_created` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_ID`),
  UNIQUE KEY `inter_ID` (`inter_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `USER`
--

INSERT INTO `USER` (`user_ID`, `inter_ID`, `first_name`, `last_name`, `email`, `phone_number`, `date_created`) VALUES
(5, 'U00000001', 'Raul', 'Pichardo', 'rpichardo3780@interbayamon.edu', '8000010001', '2019-09-19 21:29:12'),
(7, 'U00000002', 'Kemuel', 'Perez', 'kemuel@inter.com', '8000010003', '2019-09-24 15:42:36'),
(8, 'U00000003', 'Eliud', 'Hernandez', 'unknown@inter.edu', '8000010000', '2019-09-24 16:55:15'),
(10, 'A000000', 'Noah', 'Almeda', 'nalmeda5053@interbayamon.edu', '800000000', '2020-02-17 02:36:37'),
(11, 'G0047378', 'Nicole', 'Tester', 'nlopez6437@interbayamon.edu', '5000000000', '2020-02-24 18:07:31'),
(14, 'G00473780', 'Raul', 'Pichardo', 'inter@inter.com', '7873776957', '2020-03-05 13:40:45');

-- --------------------------------------------------------

--
-- Table structure for table `USER_DEP`
--

DROP TABLE IF EXISTS `USER_DEP`;
CREATE TABLE IF NOT EXISTS `USER_DEP` (
  `user_ID` int(11) DEFAULT NULL,
  `dep_ID` int(11) DEFAULT NULL,
  KEY `user_ID` (`user_ID`),
  KEY `dep_ID` (`dep_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `USER_DEP`
--

INSERT INTO `USER_DEP` (`user_ID`, `dep_ID`) VALUES
(14, 15),
(7, 14),
(7, 15),
(8, 14),
(8, 15),
(10, 14),
(11, 14),
(11, 15),
(5, 16);

-- --------------------------------------------------------

--
-- Table structure for table `USER_PROFILES`
--

DROP TABLE IF EXISTS `USER_PROFILES`;
CREATE TABLE IF NOT EXISTS `USER_PROFILES` (
  `user_ID` int(11) DEFAULT NULL,
  `profile_ID` int(11) DEFAULT NULL,
  KEY `user_ID` (`user_ID`),
  KEY `profile_ID` (`profile_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `USER_PROFILES`
--

INSERT INTO `USER_PROFILES` (`user_ID`, `profile_ID`) VALUES
(5, 1),
(7, 1),
(8, 1),
(10, 1),
(11, 1),
(14, 2);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ASSESSMENT`
--
ALTER TABLE `ASSESSMENT`
  ADD CONSTRAINT `ASSESSMENT_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `USER` (`user_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ASSESSMENT_ibfk_2` FOREIGN KEY (`course_ID`) REFERENCES `COURSE` (`course_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ASSESSMENT_ibfk_3` FOREIGN KEY (`rubric_ID`) REFERENCES `PERFORMANCE_RUBRIC` (`rubric_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `EVALUATION_RUBRIC`
--
ALTER TABLE `EVALUATION_RUBRIC`
  ADD CONSTRAINT `EVALUATION_RUBRIC_ibfk_1` FOREIGN KEY (`outc_ID`) REFERENCES `STUDENT_OUTCOME` (`outc_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `OUTCOME_COURSE`
--
ALTER TABLE `OUTCOME_COURSE`
  ADD CONSTRAINT `OUTCOME_COURSE_ibfk_1` FOREIGN KEY (`outc_ID`) REFERENCES `STUDENT_OUTCOME` (`outc_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `OUTCOME_COURSE_ibfk_2` FOREIGN KEY (`course_ID`) REFERENCES `COURSE` (`course_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `PERFORMANCE_RUBRIC`
--
ALTER TABLE `PERFORMANCE_RUBRIC`
  ADD CONSTRAINT `PERFORMANCE_RUBRIC_ibfk_1` FOREIGN KEY (`perC_ID`) REFERENCES `PERF_CRITERIA` (`perC_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `PERF_CRITERIA`
--
ALTER TABLE `PERF_CRITERIA`
  ADD CONSTRAINT `PERF_CRITERIA_ibfk_1` FOREIGN KEY (`outc_ID`) REFERENCES `STUDENT_OUTCOME` (`outc_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `PROG_COURSE`
--
ALTER TABLE `PROG_COURSE`
  ADD CONSTRAINT `PROG_COURSE_ibfk_1` FOREIGN KEY (`course_ID`) REFERENCES `COURSE` (`course_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `PROG_COURSE_ibfk_2` FOREIGN KEY (`prog_ID`) REFERENCES `STUDY_PROGRAM` (`prog_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `REPORTS`
--
ALTER TABLE `REPORTS`
  ADD CONSTRAINT `REPORTS_ibfk_1` FOREIGN KEY (`assessment_ID`) REFERENCES `ASSESSMENT` (`assessment_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `STUDENT_OUTCOME`
--
ALTER TABLE `STUDENT_OUTCOME`
  ADD CONSTRAINT `STUDENT_OUTCOME_ibfk_1` FOREIGN KEY (`prog_ID`) REFERENCES `STUDY_PROGRAM` (`prog_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `STUDENT_PERFORMANCE`
--
ALTER TABLE `STUDENT_PERFORMANCE`
  ADD CONSTRAINT `STUDENT_PERFORMANCE_ibfk_1` FOREIGN KEY (`assessment_ID`) REFERENCES `ASSESSMENT` (`assessment_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `STUDY_PROGRAM`
--
ALTER TABLE `STUDY_PROGRAM`
  ADD CONSTRAINT `STUDY_PROGRAM_ibfk_1` FOREIGN KEY (`dep_ID`) REFERENCES `DEPARTMENT` (`dep_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `USER_DEP`
--
ALTER TABLE `USER_DEP`
  ADD CONSTRAINT `USER_DEP_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `USER` (`user_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `USER_DEP_ibfk_2` FOREIGN KEY (`dep_ID`) REFERENCES `DEPARTMENT` (`dep_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `USER_PROFILES`
--
ALTER TABLE `USER_PROFILES`
  ADD CONSTRAINT `USER_PROFILES_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `USER` (`user_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `USER_PROFILES_ibfk_2` FOREIGN KEY (`profile_ID`) REFERENCES `PROFILE` (`profile_ID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
