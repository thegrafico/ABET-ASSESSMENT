-- MySQL dump 10.13  Distrib 8.0.17, for macos10.14 (x86_64)
--
-- Host: 70.45.219.43    Database: ABET
-- ------------------------------------------------------
-- Server version	5.7.27

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ACADEMIC_TERM`
--

DROP TABLE IF EXISTS `ACADEMIC_TERM`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ACADEMIC_TERM` (
  `term_ID` int(11) NOT NULL AUTO_INCREMENT,
  `term_name` varchar(255) NOT NULL,
  PRIMARY KEY (`term_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ACADEMIC_TERM`
--

LOCK TABLES `ACADEMIC_TERM` WRITE;
/*!40000 ALTER TABLE `ACADEMIC_TERM` DISABLE KEYS */;
INSERT INTO `ACADEMIC_TERM` VALUES (1,'SEMESTER AUG-DEC 2019'),(2,'SEMESTER AUG-DEC 2018'),(4,'SEMESTER AUG-DEC 2017'),(5,'SEMESTER AUG-DEC 2020'),(6,'SEMESTER JAN-MAY 2019'),(9,'SEMESTER JAN-MAY 2018'),(10,'SEMESTER JAN-MAY 2017'),(11,'SEMESTER JAN-MAY 2020');
/*!40000 ALTER TABLE `ACADEMIC_TERM` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ASSESSMENT`
--

DROP TABLE IF EXISTS `ASSESSMENT`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ASSESSMENT` (
  `assessment_ID` int(11) NOT NULL AUTO_INCREMENT,
  `course_ID` int(11) DEFAULT NULL,
  `term_ID` int(11) NOT NULL,
  `user_ID` int(11) DEFAULT NULL,
  `rubric_ID` int(11) DEFAULT NULL,
  PRIMARY KEY (`assessment_ID`),
  KEY `user_ID` (`user_ID`),
  KEY `course_ID` (`course_ID`),
  KEY `rubric_ID` (`rubric_ID`),
  CONSTRAINT `ASSESSMENT_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `USER` (`user_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ASSESSMENT_ibfk_2` FOREIGN KEY (`course_ID`) REFERENCES `COURSE` (`course_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ASSESSMENT_ibfk_3` FOREIGN KEY (`rubric_ID`) REFERENCES `PERFORMANCE_RUBRIC` (`rubric_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ASSESSMENT`
--

LOCK TABLES `ASSESSMENT` WRITE;
/*!40000 ALTER TABLE `ASSESSMENT` DISABLE KEYS */;
INSERT INTO `ASSESSMENT` VALUES (48,48,1,5,25),(49,48,1,5,25),(50,48,1,5,25),(51,48,1,5,25),(52,48,1,5,26),(53,51,5,5,26),(54,50,4,5,25),(55,50,2,5,25),(56,48,1,5,24),(57,48,1,5,24),(58,48,1,5,24),(59,48,1,5,24),(60,48,1,5,24),(61,51,1,5,26);
/*!40000 ALTER TABLE `ASSESSMENT` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `COURSE`
--

DROP TABLE IF EXISTS `COURSE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `COURSE` (
  `course_ID` int(11) NOT NULL AUTO_INCREMENT,
  `course_name` varchar(25) NOT NULL,
  `course_number` varchar(255) NOT NULL,
  `course_description` varchar(255) DEFAULT NULL,
  `date_created` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`course_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `COURSE`
--

LOCK TABLES `COURSE` WRITE;
/*!40000 ALTER TABLE `COURSE` DISABLE KEYS */;
INSERT INTO `COURSE` VALUES (48,'Precalculus','MATH','5 Credit course','2020-02-08 20:59:03'),(49,'Precalculus','MATH','5 Credit course','2020-02-08 20:59:31'),(50,'Intro to Programming','COEN','4 Credit course','2020-02-08 20:59:54'),(51,'Advance Programming','COEN','4 Credit course','2020-02-08 21:00:06'),(52,'Electronic I','ELEN','4 Credit course','2020-02-08 21:00:18'),(53,'Electriv Circuits I','ELEN','4 Credit course','2020-02-08 21:00:36');
/*!40000 ALTER TABLE `COURSE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DEPARTMENT`
--

DROP TABLE IF EXISTS `DEPARTMENT`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DEPARTMENT` (
  `dep_ID` int(11) NOT NULL AUTO_INCREMENT,
  `dep_name` varchar(255) NOT NULL,
  `dep_description` varchar(255) DEFAULT NULL,
  `date_created` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`dep_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DEPARTMENT`
--

LOCK TABLES `DEPARTMENT` WRITE;
/*!40000 ALTER TABLE `DEPARTMENT` DISABLE KEYS */;
INSERT INTO `DEPARTMENT` VALUES (14,'Industrial Engineering','Industrial Engineering Department','2020-02-08 20:35:10'),(15,'Mechanical Engineering','Mechanical Engineering Department','2020-02-08 20:35:56'),(16,'Electrical And Computer Engineering','Electrical And Computer Engineering Department','2020-02-08 20:36:38');
/*!40000 ALTER TABLE `DEPARTMENT` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EVALUATION_RUBRIC`
--

DROP TABLE IF EXISTS `EVALUATION_RUBRIC`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `EVALUATION_RUBRIC` (
  `rubric_ID` int(11) NOT NULL AUTO_INCREMENT,
  `rubric_name` varchar(255) NOT NULL,
  `rubric_description` varchar(255) DEFAULT NULL,
  `outc_ID` int(11) DEFAULT NULL,
  PRIMARY KEY (`rubric_ID`),
  KEY `outc_ID` (`outc_ID`),
  CONSTRAINT `EVALUATION_RUBRIC_ibfk_1` FOREIGN KEY (`outc_ID`) REFERENCES `STUDENT_OUTCOME` (`outc_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EVALUATION_RUBRIC`
--

LOCK TABLES `EVALUATION_RUBRIC` WRITE;
/*!40000 ALTER TABLE `EVALUATION_RUBRIC` DISABLE KEYS */;
INSERT INTO `EVALUATION_RUBRIC` VALUES (24,'Evaluation Rubric A1','Outcome A - Performance Criteria 1, 2, 3',14),(25,'Evaluation Rubric B1','Outcome B - Performance Criteria 1, 2, 3, 4',15),(26,'Evaluation Rubric C1','Outcome C - Performance Criteria 1, 2, 3, 4, 5',16);
/*!40000 ALTER TABLE `EVALUATION_RUBRIC` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `OUTCOME_COURSE`
--

DROP TABLE IF EXISTS `OUTCOME_COURSE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `OUTCOME_COURSE` (
  `course_ID` int(11) DEFAULT NULL,
  `outc_ID` int(11) DEFAULT NULL,
  KEY `outc_ID` (`outc_ID`),
  KEY `course_ID` (`course_ID`),
  CONSTRAINT `OUTCOME_COURSE_ibfk_1` FOREIGN KEY (`outc_ID`) REFERENCES `STUDENT_OUTCOME` (`outc_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `OUTCOME_COURSE_ibfk_2` FOREIGN KEY (`course_ID`) REFERENCES `COURSE` (`course_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `OUTCOME_COURSE`
--

LOCK TABLES `OUTCOME_COURSE` WRITE;
/*!40000 ALTER TABLE `OUTCOME_COURSE` DISABLE KEYS */;
/*!40000 ALTER TABLE `OUTCOME_COURSE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PERFORMANCE_RUBRIC`
--

DROP TABLE IF EXISTS `PERFORMANCE_RUBRIC`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PERFORMANCE_RUBRIC` (
  `rubric_ID` int(11) NOT NULL AUTO_INCREMENT,
  `perC_ID` int(11) NOT NULL,
  PRIMARY KEY (`rubric_ID`,`perC_ID`),
  KEY `PERFORMANCE_RUBRIC_ibfk_1` (`perC_ID`),
  CONSTRAINT `PERFORMANCE_RUBRIC_ibfk_1` FOREIGN KEY (`perC_ID`) REFERENCES `PERF_CRITERIA` (`perC_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PERFORMANCE_RUBRIC`
--

LOCK TABLES `PERFORMANCE_RUBRIC` WRITE;
/*!40000 ALTER TABLE `PERFORMANCE_RUBRIC` DISABLE KEYS */;
INSERT INTO `PERFORMANCE_RUBRIC` VALUES (24,57),(24,58),(24,59),(25,62),(25,63),(25,64),(25,65),(26,67),(26,68),(26,69),(26,70),(26,71);
/*!40000 ALTER TABLE `PERFORMANCE_RUBRIC` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PERF_CRITERIA`
--

DROP TABLE IF EXISTS `PERF_CRITERIA`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PERF_CRITERIA` (
  `perC_ID` int(11) NOT NULL AUTO_INCREMENT,
  `perC_Desk` varchar(255) DEFAULT NULL,
  `perC_order` int(11) DEFAULT NULL,
  `outc_ID` int(11) DEFAULT NULL,
  PRIMARY KEY (`perC_ID`),
  KEY `outc_ID` (`outc_ID`),
  CONSTRAINT `PERF_CRITERIA_ibfk_1` FOREIGN KEY (`outc_ID`) REFERENCES `STUDENT_OUTCOME` (`outc_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PERF_CRITERIA`
--

LOCK TABLES `PERF_CRITERIA` WRITE;
/*!40000 ALTER TABLE `PERF_CRITERIA` DISABLE KEYS */;
INSERT INTO `PERF_CRITERIA` VALUES (57,'Perfomance Criteria 5 for Outcome A',5,14),(58,'Perfomance Criteria 1 for Outcome A',1,14),(59,'Perfomance Criteria 2 for Outcome A',2,14),(60,'Perfomance Criteria 3 for Outcome A',3,14),(61,'Perfomance Criteria 4 for Outcome A',4,14),(62,'Perfomance Criteria 1 for Outcome B',1,15),(63,'Perfomance Criteria 2 for Outcome B',2,15),(64,'Perfomance Criteria 3 for Outcome B',3,15),(65,'Perfomance Criteria 4 for Outcome B',4,15),(66,'Perfomance Criteria 5 for Outcome B',5,15),(67,'Perfomance Criteria 1 for Outcome C',1,16),(68,'Perfomance Criteria 2 for Outcome C',2,16),(69,'Perfomance Criteria 3 for Outcome C',3,16),(70,'Perfomance Criteria 4 for Outcome C',4,16),(71,'Perfomance Criteria 5 for Outcome C',5,16);
/*!40000 ALTER TABLE `PERF_CRITERIA` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PROFILE`
--

DROP TABLE IF EXISTS `PROFILE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PROFILE` (
  `profile_ID` int(11) NOT NULL AUTO_INCREMENT,
  `profile_Name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`profile_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PROFILE`
--

LOCK TABLES `PROFILE` WRITE;
/*!40000 ALTER TABLE `PROFILE` DISABLE KEYS */;
INSERT INTO `PROFILE` VALUES (1,'Admin'),(2,'Professor');
/*!40000 ALTER TABLE `PROFILE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PROG_COURSE`
--

DROP TABLE IF EXISTS `PROG_COURSE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PROG_COURSE` (
  `course_ID` int(11) DEFAULT NULL,
  `prog_ID` int(11) DEFAULT NULL,
  KEY `course_ID` (`course_ID`),
  KEY `prog_ID` (`prog_ID`),
  CONSTRAINT `PROG_COURSE_ibfk_1` FOREIGN KEY (`course_ID`) REFERENCES `COURSE` (`course_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `PROG_COURSE_ibfk_2` FOREIGN KEY (`prog_ID`) REFERENCES `STUDY_PROGRAM` (`prog_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PROG_COURSE`
--

LOCK TABLES `PROG_COURSE` WRITE;
/*!40000 ALTER TABLE `PROG_COURSE` DISABLE KEYS */;
INSERT INTO `PROG_COURSE` VALUES (48,51),(49,52),(50,51),(51,51),(52,52),(53,52);
/*!40000 ALTER TABLE `PROG_COURSE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `REPORTS`
--

DROP TABLE IF EXISTS `REPORTS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `REPORTS` (
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
  KEY `assessment_ID` (`assessment_ID`),
  CONSTRAINT `REPORTS_ibfk_1` FOREIGN KEY (`assessment_ID`) REFERENCES `ASSESSMENT` (`assessment_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `REPORTS`
--

LOCK TABLES `REPORTS` WRITE;
/*!40000 ALTER TABLE `REPORTS` DISABLE KEYS */;
INSERT INTO `REPORTS` VALUES (1,2,4,4,4,3,'2','Holaq','Ya','seguimos',NULL),(2,4,4,3,5,1,'0','Probando','Ayuda','Nose',NULL),(3,2,2,2,2,2,'2','2','2','2',NULL),(4,4,4,4,4,4,'4','Hiiii this is a test','They suck, they all flunk',' hghcghfghgh',NULL),(5,1,1,1,1,1,'1','jhsdgfkjsdsknbjk','gfxhcgvhbm,.,','lsgflksndfnksdnf',NULL),(6,2,2,2,2,2,'2','This a result course test','this is a course reflection test','\r\nprovide action for course improvement test',NULL),(7,1,1,1,1,1,'1','1','1','1',NULL),(8,1,1,1,1,1,'1','1','1','1',NULL),(9,1,1,1,1,1,'1','1','1','1',NULL),(10,1,1,1,1,1,'1','1','1','1',NULL),(11,1,1,1,1,1,'1','1','1','1',NULL),(12,1,1,1,1,1,'1','1','1','1',NULL),(13,1,1,1,1,1,'1','1','1','1',NULL),(14,1,1,1,1,1,'1','1','1','1',NULL),(15,4,1,5,4,43,'34','324','42','42',NULL),(16,1,1,1,1,1,'1','1','1','1',NULL),(17,1,1,1,1,1,'1','1','1','1',NULL),(18,1,1,1,1,1,'1','1','1','1',NULL),(19,1,1,1,1,1,'1','1','1','1',NULL),(20,1,1,1,1,1,'1','1','1','1',NULL),(21,1,1,1,1,1,'1','1','1','1',NULL),(22,1,1,1,1,1,'1','1','1','1',NULL),(23,1,1,1,1,1,'1','1','1','1',NULL),(24,1,1,1,1,1,'1','1','1','1',NULL),(25,1,1,1,1,1,'1','1','1','1',NULL),(26,1,1,1,1,1,'1','1','1','1',NULL),(27,2,2,2,2,2,'22','2','2','2',NULL),(28,2,2,2,2,2,'22','2','2','2',NULL),(29,2,2,2,2,2,'22','2','2','2',NULL),(30,1,1,1,1,1,'1','1','1','1',NULL),(31,1,1,1,1,1,'1','1','1','1',NULL),(32,1,1,1,1,1,'1','1','1','1',NULL);
/*!40000 ALTER TABLE `REPORTS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `STUDENT_OUTCOME`
--

DROP TABLE IF EXISTS `STUDENT_OUTCOME`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `STUDENT_OUTCOME` (
  `outc_ID` int(11) NOT NULL AUTO_INCREMENT,
  `outc_name` varchar(255) NOT NULL,
  `outc_description` varchar(255) DEFAULT NULL,
  `date_created` datetime DEFAULT CURRENT_TIMESTAMP,
  `prog_ID` int(11) DEFAULT NULL,
  PRIMARY KEY (`outc_ID`),
  KEY `prog_ID` (`prog_ID`),
  CONSTRAINT `STUDENT_OUTCOME_ibfk_1` FOREIGN KEY (`prog_ID`) REFERENCES `STUDY_PROGRAM` (`prog_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `STUDENT_OUTCOME`
--

LOCK TABLES `STUDENT_OUTCOME` WRITE;
/*!40000 ALTER TABLE `STUDENT_OUTCOME` DISABLE KEYS */;
INSERT INTO `STUDENT_OUTCOME` VALUES (14,'Outcome A','Student Outcome A','2020-02-08 21:25:37',51),(15,'Outcome B','Student Outcome B','2020-02-08 21:25:37',51),(16,'Outcome C','Student Outcome C','2020-02-08 21:26:18',51);
/*!40000 ALTER TABLE `STUDENT_OUTCOME` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `STUDENT_PERFORMANCE`
--

DROP TABLE IF EXISTS `STUDENT_PERFORMANCE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `STUDENT_PERFORMANCE` (
  `student_ID` int(11) NOT NULL AUTO_INCREMENT,
  `pc_1` varchar(255) DEFAULT NULL,
  `pc_2` varchar(255) DEFAULT NULL,
  `pc_3` varchar(255) DEFAULT NULL,
  `pc_4` varchar(255) DEFAULT NULL,
  `pc_5` varchar(255) DEFAULT NULL,
  `assessment_ID` int(11) DEFAULT NULL,
  PRIMARY KEY (`student_ID`),
  KEY `assessment_ID` (`assessment_ID`),
  CONSTRAINT `STUDENT_PERFORMANCE_ibfk_1` FOREIGN KEY (`assessment_ID`) REFERENCES `ASSESSMENT` (`assessment_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `STUDENT_PERFORMANCE`
--

LOCK TABLES `STUDENT_PERFORMANCE` WRITE;
/*!40000 ALTER TABLE `STUDENT_PERFORMANCE` DISABLE KEYS */;
INSERT INTO `STUDENT_PERFORMANCE` VALUES (1,'1','2','3',NULL,NULL,60),(2,'3','3','4',NULL,NULL,60),(3,'3','2','1',NULL,NULL,60),(4,'1','1','1',NULL,NULL,60);
/*!40000 ALTER TABLE `STUDENT_PERFORMANCE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `STUDY_PROGRAM`
--

DROP TABLE IF EXISTS `STUDY_PROGRAM`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `STUDY_PROGRAM` (
  `prog_ID` int(11) NOT NULL AUTO_INCREMENT,
  `prog_name` varchar(255) NOT NULL,
  `date_created` datetime DEFAULT CURRENT_TIMESTAMP,
  `dep_ID` int(11) DEFAULT NULL,
  PRIMARY KEY (`prog_ID`),
  KEY `dep_ID` (`dep_ID`),
  CONSTRAINT `STUDY_PROGRAM_ibfk_1` FOREIGN KEY (`dep_ID`) REFERENCES `DEPARTMENT` (`dep_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `STUDY_PROGRAM`
--

LOCK TABLES `STUDY_PROGRAM` WRITE;
/*!40000 ALTER TABLE `STUDY_PROGRAM` DISABLE KEYS */;
INSERT INTO `STUDY_PROGRAM` VALUES (51,'COEN','2020-02-08 20:39:00',16),(52,'ELEN','2020-02-08 20:39:43',16),(53,'MECN','2020-02-08 20:39:44',15),(54,'INEN','2020-02-08 20:39:44',14);
/*!40000 ALTER TABLE `STUDY_PROGRAM` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `USER`
--

DROP TABLE IF EXISTS `USER`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `USER` (
  `user_ID` int(11) NOT NULL AUTO_INCREMENT,
  `inter_ID` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) NOT NULL,
  `date_created` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `USER`
--

LOCK TABLES `USER` WRITE;
/*!40000 ALTER TABLE `USER` DISABLE KEYS */;
INSERT INTO `USER` VALUES (5,'U00000001','Raul','Lopez','rpichardo3780@interbayamon.edu','800-001-0001','2019-09-19 21:29:12'),(7,'U00000002','Kemuel','Perez','kemuel@inter.com','800-001-0003','2019-09-24 15:42:36'),(8,'U00000003','Eliud','Hernandez','unknown@inter.edu','800-001-0000','2019-09-24 16:55:15');
/*!40000 ALTER TABLE `USER` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `USER_DEP`
--

DROP TABLE IF EXISTS `USER_DEP`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `USER_DEP` (
  `user_ID` int(11) DEFAULT NULL,
  `dep_ID` int(11) DEFAULT NULL,
  KEY `user_ID` (`user_ID`),
  KEY `dep_ID` (`dep_ID`),
  CONSTRAINT `USER_DEP_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `USER` (`user_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `USER_DEP_ibfk_2` FOREIGN KEY (`dep_ID`) REFERENCES `DEPARTMENT` (`dep_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `USER_DEP`
--

LOCK TABLES `USER_DEP` WRITE;
/*!40000 ALTER TABLE `USER_DEP` DISABLE KEYS */;
/*!40000 ALTER TABLE `USER_DEP` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `USER_PROFILES`
--

DROP TABLE IF EXISTS `USER_PROFILES`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `USER_PROFILES` (
  `user_ID` int(11) DEFAULT NULL,
  `profile_ID` int(11) DEFAULT NULL,
  KEY `user_ID` (`user_ID`),
  KEY `profile_ID` (`profile_ID`),
  CONSTRAINT `USER_PROFILES_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `USER` (`user_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `USER_PROFILES_ibfk_2` FOREIGN KEY (`profile_ID`) REFERENCES `PROFILE` (`profile_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `USER_PROFILES`
--

LOCK TABLES `USER_PROFILES` WRITE;
/*!40000 ALTER TABLE `USER_PROFILES` DISABLE KEYS */;
INSERT INTO `USER_PROFILES` VALUES (5,1),(7,1),(8,1);
/*!40000 ALTER TABLE `USER_PROFILES` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-02-09 10:05:36
