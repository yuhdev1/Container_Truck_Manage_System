-- MySQL dump 10.13  Distrib 8.1.0, for Win64 (x86_64)
--
-- Host: ctmsfptmysql.mysql.database.azure.com    Database: ctms
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `account`
--

DROP TABLE IF EXISTS `account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account` (
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(70) DEFAULT NULL,
  `role` enum('CUSTOMER','ADMIN','DRIVER','STAFF') DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `account_id` varchar(255) NOT NULL,
  `user` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`account_id`),
  KEY `account_user_user_id_fk` (`user`),
  CONSTRAINT `account_user_user_id_fk` FOREIGN KEY (`user`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account`
--

LOCK TABLES `account` WRITE;
/*!40000 ALTER TABLE `account` DISABLE KEYS */;
INSERT INTO `account` VALUES ('jocaseg724','$2a$12$ifIM5KTrLWtNrhtYUbXcJ.motxsSm39JPFKld4a6kB51jrFPq/GUC','CUSTOMER',_binary '','05464bf2-ae09-4310-9c5c-d0a41630e4d0','3d4b3475-fc15-40e2-9edf-f1694097f468'),('hieutn9457','$2a$12$ifIM5KTrLWtNrhtYUbXcJ.motxsSm39JPFKld4a6kB51jrFPq/GUC','CUSTOMER',_binary '','085c5068-7bcd-4ec1-9c91-51916c08cfed','8c44d260-d73d-4615-97c8-2dae52b27501'),('regisaw246','$2a$10$yQzuSk34nNaDh6uUdyd4AOuuly6cvJnysmONfw0h62faKw3tLOn/2','CUSTOMER',_binary '','0bc0de10-15ca-4a21-afda-9d36562465ef','cd894289-b349-4dda-ae37-907904ef80dd'),('nixaray288','$2a$12$ifIM5KTrLWtNrhtYUbXcJ.motxsSm39JPFKld4a6kB51jrFPq/GUC','DRIVER',_binary '','1a84406a-3178-4cb6-b3b2-4c16a42681b4','fb988402-d8e6-4763-bac9-cc340506f7a0'),('manhtp238','$2a$12$ifIM5KTrLWtNrhtYUbXcJ.motxsSm39JPFKld4a6kB51jrFPq/GUC','CUSTOMER',_binary '','22f04a42-c2f6-4202-b235-42c22f9db4c9','70f21daf-923c-4a97-a778-27612e9da095'),('mtlinhh564','$2a$12$ifIM5KTrLWtNrhtYUbXcJ.motxsSm39JPFKld4a6kB51jrFPq/GUC','CUSTOMER',_binary '','400cdcd9-ca36-4969-ba46-ce1785244abe','f9063f5e-95c3-4d61-bad7-0bc27d170de7'),('minhchau0502','$2a$12$ifIM5KTrLWtNrhtYUbXcJ.motxsSm39JPFKld4a6kB51jrFPq/GUC','CUSTOMER',_binary '','477760c5-e62c-4437-89dc-f9b933b9d04a','03ee21f3-5f6a-40cc-bf7b-2a2acb6f926a'),('manhhung0607','$2a$12$ifIM5KTrLWtNrhtYUbXcJ.motxsSm39JPFKld4a6kB51jrFPq/GUC','DRIVER',_binary '','4db29501-d2a7-4f51-bcc2-230c0d5435f4','b9ec1d79-81c8-454b-b491-de49ce8a7f9b'),('haict27','$2a$12$ifIM5KTrLWtNrhtYUbXcJ.motxsSm39JPFKld4a6kB51jrFPq/GUC','DRIVER',_binary '','5b5e693e-f47a-4586-a0b5-c21f0a77b203','3d9fadd7-b0ca-4b5f-a20e-8f02327ead42'),('cuongvv12','$2a$12$ifIM5KTrLWtNrhtYUbXcJ.motxsSm39JPFKld4a6kB51jrFPq/GUC','DRIVER',_binary '','60a2826c-61ee-42d9-9d04-c41c573416d1','5f2ccf24-cac8-4d98-9eb2-6b078a4a3365'),('hoangpv1','$2a$12$ifIM5KTrLWtNrhtYUbXcJ.motxsSm39JPFKld4a6kB51jrFPq/GUC','DRIVER',_binary '','66aba62f-1dc5-49a3-8c2b-b22bba14a7af','b9e72561-dbb2-4b95-a3f3-51793b543bd0'),('wavise2706','$2a$12$ifIM5KTrLWtNrhtYUbXcJ.motxsSm39JPFKld4a6kB51jrFPq/GUC','DRIVER',_binary '','6d524e0f-011b-41d6-8df7-5b54019a9277','498ca080-b9a9-4c8f-9207-2d8be9bccf51'),('tuannt374','$2a$12$ifIM5KTrLWtNrhtYUbXcJ.motxsSm39JPFKld4a6kB51jrFPq/GUC','DRIVER',_binary '','720b62d2-45fd-43cc-a652-896ea2495b37','35606122-bd53-4741-b710-3a831b090e62'),('datnb1','$2a$12$ifIM5KTrLWtNrhtYUbXcJ.motxsSm39JPFKld4a6kB51jrFPq/GUC','DRIVER',_binary '','84bcac36-ccd8-4b82-97f0-ef2b0383aee3','145a7e5e-84fe-4605-afbe-944a79c77516'),('longph1','$2a$12$ifIM5KTrLWtNrhtYUbXcJ.motxsSm39JPFKld4a6kB51jrFPq/GUC','DRIVER',_binary '','8ce9a5a3-2bc7-4e7b-8bb6-6bcbeda1741d','eab40f14-78cb-4f14-bee3-b7ca683e51af'),('lamtld234','$2a$12$ifIM5KTrLWtNrhtYUbXcJ.motxsSm39JPFKld4a6kB51jrFPq/GUC','CUSTOMER',_binary '','aa92f8a6-947c-4d7c-a6ae-5affafe122fc','6cbf4324-33d7-4099-b43c-a5146fd03c9d'),('btminh1314','$2a$12$ifIM5KTrLWtNrhtYUbXcJ.motxsSm39JPFKld4a6kB51jrFPq/GUC','DRIVER',_binary '','b1e50617-2023-471d-919e-1b615442bb2b','8536b11c-3a95-4036-8302-997def51de9d'),('reyixo6571','$2a$10$kbSJ1hHZPVXr0CtUspolM.QLlIoE54KcprKn5DbLuHiRBpGrPQwgq','CUSTOMER',_binary '','b36e1092-b948-4002-be11-8a9757535f78','263b0f2b-ae55-4552-ba86-be27dd0cc493'),('lantm264','$2a$12$ifIM5KTrLWtNrhtYUbXcJ.motxsSm39JPFKld4a6kB51jrFPq/GUC','CUSTOMER',_binary '','b5fc8220-cf79-4a2d-b143-b6f48f2c0794','387544e1-a947-4cf0-a6e1-71f7db528cac'),('yibed81694','$2a$10$DiPq0w9e6vn9bD.RhGQQfOIUqTcUnrYQLbIaVcFPzv9NWwshR.qNm','CUSTOMER',_binary '','c411e5e5-b6d1-4e3e-bc52-20ebc2268271','336fadb1-5951-451c-9a28-6318868930f1'),('tuantu27d','$2a$12$ifIM5KTrLWtNrhtYUbXcJ.motxsSm39JPFKld4a6kB51jrFPq/GUC','CUSTOMER',_binary '','c4c2fd42-f0b6-4d22-b715-f22d02b0968b','b9e533a4-ca29-4116-8d6f-3c690154e2a0'),('hivawef790','$2a$12$ifIM5KTrLWtNrhtYUbXcJ.motxsSm39JPFKld4a6kB51jrFPq/GUC','DRIVER',_binary '','cc2ca9fd-a1cf-440e-a5cb-486d78ef5185','bffe9861-8c48-493e-9fb1-d89f6e2a324c'),('khainq141','$2a$12$ifIM5KTrLWtNrhtYUbXcJ.motxsSm39JPFKld4a6kB51jrFPq/GUC','CUSTOMER',_binary '','d07b9f2a-e255-46f0-940e-bdb1e3f9e9c9','507ee842-be1b-4a9d-bfc7-61312fa73e39'),('kivojoh106','$2a$12$ifIM5KTrLWtNrhtYUbXcJ.motxsSm39JPFKld4a6kB51jrFPq/GUC','DRIVER',_binary '','d3522e0f-f190-400b-a7b5-5fa80501e90e','4fd2fb27-54e3-4062-8800-d2d80c51a368'),('thanhcv1','$2a$12$ifIM5KTrLWtNrhtYUbXcJ.motxsSm39JPFKld4a6kB51jrFPq/GUC','DRIVER',_binary '','d4c4b1c7-00f3-447b-84b4-90f489ae7f3e','0815517e-29c7-4c56-9d1f-8e82c71b7ac8'),('thanhnd1312','$2a$12$ifIM5KTrLWtNrhtYUbXcJ.motxsSm39JPFKld4a6kB51jrFPq/GUC','CUSTOMER',_binary '','e9f5a506-3296-49ff-a3e1-0cddad8b5f37','5829ea05-5081-4403-b87b-f702fa92bea1'),('duydn2335','$2a$12$ifIM5KTrLWtNrhtYUbXcJ.motxsSm39JPFKld4a6kB51jrFPq/GUC','CUSTOMER',_binary '','fbafef7b-8c7c-4682-957f-3dab89a240d9','9c9b2966-f745-46e2-88a3-f58d4d32bc6c'),('admin','$2a$12$ifIM5KTrLWtNrhtYUbXcJ.motxsSm39JPFKld4a6kB51jrFPq/GUC','ADMIN',_binary '','id-0','id-0'),('staff','$2a$12$ifIM5KTrLWtNrhtYUbXcJ.motxsSm39JPFKld4a6kB51jrFPq/GUC','STAFF',_binary '','id-1','id-1');
/*!40000 ALTER TABLE `account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `container_truck`
--

DROP TABLE IF EXISTS `container_truck`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `container_truck` (
  `truck_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `license_plate` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `manufacturer` varchar(70) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `capacity` float NOT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `driver` varchar(50) DEFAULT NULL,
  `registration_date` date DEFAULT NULL,
  `in_use` tinyint(1) DEFAULT NULL,
  `attach` varchar(255) DEFAULT NULL,
  `container_status` enum('ACTIVE','READY','INACTIVE') DEFAULT NULL,
  PRIMARY KEY (`truck_id`),
  KEY `container_truck_user_user_id_fk` (`driver`),
  CONSTRAINT `FK26hcrxya83w6b0l3exxdacu38` FOREIGN KEY (`driver`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `container_truck`
--

LOCK TABLES `container_truck` WRITE;
/*!40000 ALTER TABLE `container_truck` DISABLE KEYS */;
INSERT INTO `container_truck` VALUES ('0812ee6d-5d4c-410e-ba93-9a22198648bb','29G-120431','Hyundai ',1300,1,'3d9fadd7-b0ca-4b5f-a20e-8f02327ead42','2023-10-10',1,'container_contract.doc','ACTIVE'),('11971742-c972-430d-a1b8-d9b873b0ff2c','36-H7 5889','Huyndai',1500,0,NULL,'2019-01-01',0,'','READY'),('503a2129-23bb-4a4e-a59a-512109b0ad43','99G-777812','Isuzu',1000,1,'4fd2fb27-54e3-4062-8800-d2d80c51a368','2000-04-12',1,'container_contract.doc','ACTIVE'),('5211a535-b294-40b1-8d92-fbacdb23245c','31G-76312','Hyundai',1500,1,'35606122-bd53-4741-b710-3a831b090e62','2010-01-12',1,'container_contract.doc','ACTIVE'),('586503b5-fe7d-471c-95de-b89ac4e0f2e0','29AH-00330','VIINFAST',500,0,'bffe9861-8c48-493e-9fb1-d89f6e2a324c','2024-04-23',1,'container_contract.doc','ACTIVE'),('787e1e27-450f-4ff3-a32a-f4c361ccde3d','30H-64123','Hyundai',1000,1,'fb988402-d8e6-4763-bac9-cc340506f7a0','2016-04-15',1,'container_contract.doc','ACTIVE'),('948af9d2-1cdc-4e3d-bac0-607195bfa013','90K-666689','Hino',1000,1,'8536b11c-3a95-4036-8302-997def51de9d','2021-12-12',1,'container_contract.doc','ACTIVE'),('a9a83182-faa0-4002-9b05-7ddd4442da58','30C-676767','Daewoo',1500,1,'eab40f14-78cb-4f14-bee3-b7ca683e51af','2012-01-24',1,'container_contract.doc','READY'),('b11a6f64-3282-474e-997d-dba1891d2a4e','31K-555821','Hino',1000,1,'5f2ccf24-cac8-4d98-9eb2-6b078a4a3365','2015-12-09',1,'container_contract.doc','READY'),('bb2e6e18-b047-469d-802b-212ec4a0d8fd','26E-112012','Isuzu',1500,1,'0815517e-29c7-4c56-9d1f-8e82c71b7ac8','2020-10-10',1,'container_contract.doc','ACTIVE'),('e919209f-624b-4a06-a854-20d684880da4','90-H7 5880','Huyndai',1500,0,NULL,'2018-01-04',0,'','READY'),('f2c9e7db-f43b-412e-8947-88603fc75005','99H-96621','Hyundai',1000,1,'b9ec1d79-81c8-454b-b491-de49ce8a7f9b','2020-10-10',1,'container_contract.doc','READY'),('f5202c6b-f073-42ad-9870-36ddf4655b4a','29K-141221','Hyundai ',1200,1,'145a7e5e-84fe-4605-afbe-944a79c77516','2019-12-11',1,'container_contract.doc','READY'),('f8c6c55c-ffaf-45bd-ad6b-662d8c5519a0','30AH-00330','VINFAST',1000,0,'498ca080-b9a9-4c8f-9207-2d8be9bccf51','2024-04-23',1,'container_contract.doc','READY'),('fb00f015-5902-4b5f-aeab-b1acd9bd4995','90Y-120312','Daewoo',1000,1,'b9e72561-dbb2-4b95-a3f3-51793b543bd0','2018-02-18',1,'container_contract.doc','READY');
/*!40000 ALTER TABLE `container_truck` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `driver_schedule`
--

DROP TABLE IF EXISTS `driver_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `driver_schedule` (
  `id` varchar(255) NOT NULL,
  `time_from` date DEFAULT NULL,
  `time_to` date DEFAULT NULL,
  `orders` varchar(255) DEFAULT NULL,
  `transportation_code` varchar(255) DEFAULT NULL,
  `containerTruck` varchar(255) DEFAULT NULL,
  `time_stamp` varchar(255) DEFAULT NULL,
  `driver` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_44b5okx8ye5edy93k9c5ypwn0` (`orders`),
  KEY `FK264a4hbvfuicyj4cj5dl35jlr` (`containerTruck`),
  KEY `FKslvhpxrc08gqccbgx1u00kopr` (`driver`),
  CONSTRAINT `FK264a4hbvfuicyj4cj5dl35jlr` FOREIGN KEY (`containerTruck`) REFERENCES `container_truck` (`truck_id`),
  CONSTRAINT `FKhlixe1km8i2gir24p15y7wtm6` FOREIGN KEY (`orders`) REFERENCES `orders` (`order_id`),
  CONSTRAINT `FKslvhpxrc08gqccbgx1u00kopr` FOREIGN KEY (`driver`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `driver_schedule`
--

LOCK TABLES `driver_schedule` WRITE;
/*!40000 ALTER TABLE `driver_schedule` DISABLE KEYS */;
INSERT INTO `driver_schedule` VALUES ('2befd8ea-b81f-439a-89c5-27d08ce9f286','2024-04-25','2024-04-27','9ad28fb2-32a3-462a-b255-21f8a6cb0924','24042441B96','b11a6f64-3282-474e-997d-dba1891d2a4e','2024-04-24T22:10:13.607338900','5f2ccf24-cac8-4d98-9eb2-6b078a4a3365'),('2d811ac0-01f1-4eeb-a8c6-f7cb0bf8df56','2024-05-07','2024-05-11','fc1b120e-a0a6-42e8-9e84-0b8470c1aba8','24042403508','586503b5-fe7d-471c-95de-b89ac4e0f2e0','2024-04-24T22:14:14.078127','bffe9861-8c48-493e-9fb1-d89f6e2a324c'),('322fc539-43ee-4e1d-a42b-2ecb8e3bc5c6','2024-04-25','2024-04-29','17bea234-f715-47eb-a1e3-27578a02f2e5','240424CEEB8','0812ee6d-5d4c-410e-ba93-9a22198648bb','2024-04-24T18:59:04.912092600','3d9fadd7-b0ca-4b5f-a20e-8f02327ead42'),('36ddbe07-fea6-4886-b917-8561c015b6d8','2024-04-23','2024-04-27','ba871d34-39a8-4240-ae40-60630625e57a','240423D5CB5','f8c6c55c-ffaf-45bd-ad6b-662d8c5519a0','2024-04-23T23:55:52.320147400','498ca080-b9a9-4c8f-9207-2d8be9bccf51'),('653cd002-f417-40d8-b549-faf6b98642d0','2024-04-24','2024-04-27','15919d70-e0c0-478a-9eea-dcb09a4b0fca','240424BE1A0','bb2e6e18-b047-469d-802b-212ec4a0d8fd','2024-04-24T21:55:40.966325900','0815517e-29c7-4c56-9d1f-8e82c71b7ac8'),('877dc158-f124-4d99-9281-bccc4215fb27','2024-04-25','2024-04-29','9d5b42ca-b95b-4b4a-8a30-46d453037485','240424FC311','948af9d2-1cdc-4e3d-bac0-607195bfa013','2024-04-24T19:01:29.973165400','8536b11c-3a95-4036-8302-997def51de9d'),('b8ca0146-9cc9-4d1a-bc2e-eebfec09807b','2024-04-25','2024-04-27','dce871ca-cd0f-49c2-8622-b35860d1c827','240424837F8','fb00f015-5902-4b5f-aeab-b1acd9bd4995','2024-04-24T22:17:32.654088200','b9e72561-dbb2-4b95-a3f3-51793b543bd0'),('bbb1353e-19a3-4629-b0f7-06c660e076f4','2024-04-25','2024-04-29','87268626-620e-43bf-8d61-e25480190dcd','240424CCB55','787e1e27-450f-4ff3-a32a-f4c361ccde3d','2024-04-24T19:01:13.195057800','fb988402-d8e6-4763-bac9-cc340506f7a0'),('bfe60e56-3d67-4e5f-9b63-d03d7ae59a07','2024-04-25','2024-04-29','33f3714f-654d-4d67-9d71-6cda74967e64','24042474734','503a2129-23bb-4a4e-a59a-512109b0ad43','2024-04-24T19:00:33.143036300','4fd2fb27-54e3-4062-8800-d2d80c51a368'),('c2473f75-7388-4949-b73e-e05001bb4555','2024-04-23','2024-04-27','3637d44d-0d75-46bb-9515-b1f9e7253232','24042324C95','586503b5-fe7d-471c-95de-b89ac4e0f2e0','2024-04-23T23:23:13.775607800','bffe9861-8c48-493e-9fb1-d89f6e2a324c'),('ed74a10a-fc81-4a68-a078-d3106f6393ed','2024-04-25','2024-04-29','69b4cf13-dfe6-4cf4-81d7-b1cc78d9d90f','240424EC5DD','5211a535-b294-40b1-8d92-fbacdb23245c','2024-04-24T19:00:53.848013500','35606122-bd53-4741-b710-3a831b090e62'),('f45e324e-a75e-4590-9436-ed19ea784e99','2024-04-25','2024-04-30','46d52584-962b-49fe-82db-08fbba1c8bbb','24042478259','f5202c6b-f073-42ad-9870-36ddf4655b4a','2024-04-24T22:03:09.627049300','145a7e5e-84fe-4605-afbe-944a79c77516');
/*!40000 ALTER TABLE `driver_schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `incident_invoice`
--

DROP TABLE IF EXISTS `incident_invoice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incident_invoice` (
  `incident_invoice_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `driver` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` text,
  `payment_method` text NOT NULL,
  `payment_date` date NOT NULL,
  `attach` varchar(70) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `cost` float DEFAULT NULL,
  `orders` varchar(255) DEFAULT NULL,
  `note` text,
  `invoice_number` varchar(50) DEFAULT NULL,
  `tax` float DEFAULT NULL,
  PRIMARY KEY (`incident_invoice_id`),
  UNIQUE KEY `incident_invoice_pk` (`invoice_number`),
  KEY `incident_invoice_user_user_id_fk` (`driver`),
  KEY `FKl9ipaq2k991aria29voj0x4h0` (`orders`),
  CONSTRAINT `FKl9ipaq2k991aria29voj0x4h0` FOREIGN KEY (`orders`) REFERENCES `orders` (`order_id`),
  CONSTRAINT `incident_invoice_user_user_id_fk` FOREIGN KEY (`driver`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `incident_invoice`
--

LOCK TABLES `incident_invoice` WRITE;
/*!40000 ALTER TABLE `incident_invoice` DISABLE KEYS */;
INSERT INTO `incident_invoice` VALUES ('0a920e70-efff-4734-b0fe-4d87377e72a6','3d9fadd7-b0ca-4b5f-a20e-8f02327ead42',' ','Tiền mặt','2022-09-08',NULL,21100000,'69b4cf13-dfe6-4cf4-81d7-b1cc78d9d90f',NULL,'22C22TDN',0),('17f24c6d-c727-4067-9edf-f6f2c1a4d4f0','b9ec1d79-81c8-454b-b491-de49ce8a7f9b',' ','Tiền mặt','2022-09-12',NULL,8000000,'87268626-620e-43bf-8d61-e25480190dcd',NULL,'67K22BGH',0),('6c80e1f6-1c6b-4272-aafd-42d2b65d3333','8536b11c-3a95-4036-8302-997def51de9d',' ','Banking','2023-10-10',NULL,10000000,'17bea234-f715-47eb-a1e3-27578a02f2e5',NULL,'30K23TDL',2),('8ff01a4e-432f-4d1e-8e7d-1c68f7b88ad7','8536b11c-3a95-4036-8302-997def51de9d',' ','Tiền mặt','2023-12-12',NULL,100000,'17bea234-f715-47eb-a1e3-27578a02f2e5',NULL,'21K23MLN',2),('97573250-e99c-4c38-be98-9c15520e203f','35606122-bd53-4741-b710-3a831b090e62',' ','Banking','2023-11-08',NULL,100000,'33f3714f-654d-4d67-9d71-6cda74967e64',NULL,'69K23TDH',0),('a39ea5fc-6a1b-4c84-bb86-559af96149eb','4fd2fb27-54e3-4062-8800-d2d80c51a368',' ','Banking','2023-12-02',NULL,9000000,'9d5b42ca-b95b-4b4a-8a30-46d453037485',NULL,'12CBNM',0);
/*!40000 ALTER TABLE `incident_invoice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `id` varchar(255) NOT NULL,
  `content` varchar(255) DEFAULT NULL,
  `time_stamp` varchar(255) DEFAULT NULL,
  `customer` varchar(255) DEFAULT NULL,
  `orders` varchar(255) DEFAULT NULL,
  `seen` bit(1) DEFAULT NULL,
  `receiver` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK1csos95on23ityfj2clswhkbk` (`customer`),
  KEY `FKco326qv39dcmebkepk40e1aiq` (`orders`),
  CONSTRAINT `FK1csos95on23ityfj2clswhkbk` FOREIGN KEY (`customer`) REFERENCES `user` (`user_id`),
  CONSTRAINT `FKco326qv39dcmebkepk40e1aiq` FOREIGN KEY (`orders`) REFERENCES `orders` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
INSERT INTO `notification` VALUES ('1466d5ca-acbf-461d-832a-45d3cbbef76c','Đơn hàng 24042414959 đã được tạo thành công','2024-04-24T22:25:21.120606500','6cbf4324-33d7-4099-b43c-a5146fd03c9d','f2ff0873-2a12-4d3a-a98f-5aee4f9b8c9c',_binary '\0','lamvt3538'),('284b3903-aef4-4419-8dac-834602f1fa7d','Đơn hàng 24042415194 đã được tạo thành công','2024-04-24T21:51:19.889563600','336fadb1-5951-451c-9a28-6318868930f1','15919d70-e0c0-478a-9eea-dcb09a4b0fca',_binary '\0','hanhnd6172'),('353a5877-3d5d-4554-8033-33ec0d39542c','Đơn hàng 24042415194 đã được xác nhận thành công','2024-04-24T21:53:06.158217400','336fadb1-5951-451c-9a28-6318868930f1','15919d70-e0c0-478a-9eea-dcb09a4b0fca',_binary '\0','staff'),('397ecceb-037a-4485-b025-d993d63ce613','Đơn hàng 240424286AB đã được tạo thành công','2024-04-24T22:09:17.320099200','336fadb1-5951-451c-9a28-6318868930f1','9ad28fb2-32a3-462a-b255-21f8a6cb0924',_binary '\0','hanhnd6172'),('44f3d11d-66b7-423c-91df-60d774f82f4e','Đơn hàng 240423B60A5 đã được tạo thành công','2024-04-23T23:19:32.071445900','cd894289-b349-4dda-ae37-907904ef80dd','3637d44d-0d75-46bb-9515-b1f9e7253232',_binary '','cuongnt8027'),('45c6267c-aa06-423a-8ea6-8051c0980069','Đơn hàng 2404214BC5E đã được tạo thành công','2024-04-21T23:41:39.014501700','6cbf4324-33d7-4099-b43c-a5146fd03c9d','87268626-620e-43bf-8d61-e25480190dcd',_binary '\0','lamvt3538'),('4b4a0233-5b68-48cf-ae4f-b48330902b51','Đơn hàng 2404212D852 đã được tạo thành công','2024-04-21T23:27:11.846685300','507ee842-be1b-4a9d-bfc7-61312fa73e39','17bea234-f715-47eb-a1e3-27578a02f2e5',_binary '\0','khainq9829'),('524ddae9-8146-4fba-8598-ee0ac88b8bc3','Đơn hàng 2404213F644 đã được xác minh thành công','2024-04-24T18:15:25.008613','f9063f5e-95c3-4d61-bad7-0bc27d170de7','33f3714f-654d-4d67-9d71-6cda74967e64',_binary '','staff'),('569625eb-cc67-4bcd-a868-4a234b61f9f4','Đơn hàng 24042465EAC đã được tạo thành công','2024-04-24T22:12:32.938594200','336fadb1-5951-451c-9a28-6318868930f1','fc1b120e-a0a6-42e8-9e84-0b8470c1aba8',_binary '\0','hanhnd6172'),('585cee1f-d765-4b4d-b18c-4e1a11ca9879','Đơn hàng 240424AC037 đã được tạo thành công','2024-04-24T22:16:29.617843200','336fadb1-5951-451c-9a28-6318868930f1','dce871ca-cd0f-49c2-8622-b35860d1c827',_binary '\0','hanhnd6172'),('647ef0ef-5441-4ea7-a78a-dd751f27490d','Đơn hàng 240424BE578 đã được tạo thành công','2024-04-24T21:59:18.621599400','b9e533a4-ca29-4116-8d6f-3c690154e2a0','46d52584-962b-49fe-82db-08fbba1c8bbb',_binary '\0','tutt8504'),('6ff4e2b1-ea8d-4d4c-a374-cc97f7ee2774','Đơn hàng 240424BE578 đã được xác nhận thành công','2024-04-24T22:01:30.558712700','b9e533a4-ca29-4116-8d6f-3c690154e2a0','46d52584-962b-49fe-82db-08fbba1c8bbb',_binary '\0','staff'),('75ace746-f126-4e8f-a4ee-79ef22bbce2d','Đơn hàng 240421B8A87 đã được tạo thành công','2024-04-21T23:43:40.114115700','70f21daf-923c-4a97-a778-27612e9da095','69b4cf13-dfe6-4cf4-81d7-b1cc78d9d90f',_binary '\0','manhpt5684'),('79da32ed-825d-4108-a620-92bc6d241309','Đơn hàng 2404244CDC7 đã được tạo thành công','2024-04-24T22:25:18.026699700','6cbf4324-33d7-4099-b43c-a5146fd03c9d','ec3adba0-0641-4d35-90f7-564a682e9c74',_binary '\0','lamvt3538'),('7ff4161a-23ab-4b11-8874-b0823bf87bd0','Đơn hàng 2404214BC5E đã được xác minh thành công','2024-04-24T18:17:22.862289','6cbf4324-33d7-4099-b43c-a5146fd03c9d','87268626-620e-43bf-8d61-e25480190dcd',_binary '','staff'),('83b7e076-dd22-4281-a751-115f7a6f1a42','Đơn hàng 240424BE578 đã được xác nhận thành công','2024-04-24T22:01:30.331711100','b9e533a4-ca29-4116-8d6f-3c690154e2a0','46d52584-962b-49fe-82db-08fbba1c8bbb',_binary '\0','staff'),('84257025-4990-4367-8b09-77d2485b5f94','Đơn hàng 2404213F644 đã được tạo thành công','2024-04-21T23:25:07.898819600','f9063f5e-95c3-4d61-bad7-0bc27d170de7','33f3714f-654d-4d67-9d71-6cda74967e64',_binary '\0','linhmt5161'),('858ae945-4fb3-4743-9c05-e49ac797d479','Đơn hàng 24042465EAC đã được xác nhận thành công','2024-04-24T22:12:54.651064100','336fadb1-5951-451c-9a28-6318868930f1','fc1b120e-a0a6-42e8-9e84-0b8470c1aba8',_binary '\0','staff'),('8f5651a9-aa3d-4a0e-ae0b-452022148a0a','Đơn hàng 240424AC037 đã được xác nhận thành công','2024-04-24T22:17:00.301863900','336fadb1-5951-451c-9a28-6318868930f1','dce871ca-cd0f-49c2-8622-b35860d1c827',_binary '\0','staff'),('9c0f970c-dd50-4f43-bd32-1df698527d07','Đơn hàng 240424286AB đã được xác nhận thành công','2024-04-24T22:09:43.160259600','336fadb1-5951-451c-9a28-6318868930f1','9ad28fb2-32a3-462a-b255-21f8a6cb0924',_binary '\0','staff'),('a12b3548-2200-4dcd-a98d-102134b96682','Đơn hàng 2404236F9C3 đã được xác minh thành công','2024-04-23T23:54:30.088259','263b0f2b-ae55-4552-ba86-be27dd0cc493','ba871d34-39a8-4240-ae40-60630625e57a',_binary '','staff'),('bf7604cc-761d-4c5a-8a28-fc184deb68eb','Đơn hàng 240421C596A đã được tạo thành công','2024-04-21T23:45:34.224983900','8c44d260-d73d-4615-97c8-2dae52b27501','9d5b42ca-b95b-4b4a-8a30-46d453037485',_binary '\0','hieunt9081'),('c76be23a-1c54-4233-9550-8080c7cdff14','Đơn hàng 240424BE578 đã được xác nhận thành công','2024-04-24T22:01:30.789725200','b9e533a4-ca29-4116-8d6f-3c690154e2a0','46d52584-962b-49fe-82db-08fbba1c8bbb',_binary '','staff'),('ce38a3d4-d0a2-46cb-8ce9-1c80d0148a12','Đơn hàng 240421B8A87 đã được xác minh thành công','2024-04-24T18:16:24.337988900','70f21daf-923c-4a97-a778-27612e9da095','69b4cf13-dfe6-4cf4-81d7-b1cc78d9d90f',_binary '','staff'),('d615b1f6-d866-4bc8-973f-b6b22bb709e3','Đơn hàng 240424BE578 đã được xác nhận thành công','2024-04-24T22:01:12.306381200','b9e533a4-ca29-4116-8d6f-3c690154e2a0','46d52584-962b-49fe-82db-08fbba1c8bbb',_binary '\0','staff'),('d6dfbfb5-6c6a-4476-8f5a-a0248486e54e','Đơn hàng 2404212D852 đã được xác minh thành công','2024-04-24T18:14:32.134542200','507ee842-be1b-4a9d-bfc7-61312fa73e39','17bea234-f715-47eb-a1e3-27578a02f2e5',_binary '','staff'),('ed6392e5-d17a-48b6-a271-f0d822fa191b','Đơn hàng 240423B60A5 đã được xác minh thành công','2024-04-23T23:21:12.642626800','cd894289-b349-4dda-ae37-907904ef80dd','3637d44d-0d75-46bb-9515-b1f9e7253232',_binary '','staff'),('f7371598-3a40-421e-aa8a-6a608ac4f56b','Đơn hàng 240421C596A đã được xác minh thành công','2024-04-24T18:18:56.491589100','8c44d260-d73d-4615-97c8-2dae52b27501','9d5b42ca-b95b-4b4a-8a30-46d453037485',_binary '','staff'),('f7411ed2-97a7-4552-9796-e8b35bc7fc1f','Đơn hàng 2404236F9C3 đã được tạo thành công','2024-04-23T23:52:53.363481700','263b0f2b-ae55-4552-ba86-be27dd0cc493','ba871d34-39a8-4240-ae40-60630625e57a',_binary '','longnh9884');
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_detail`
--

DROP TABLE IF EXISTS `order_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_detail` (
  `Id` varchar(255) NOT NULL,
  `cubic_meter` int DEFAULT NULL,
  `kilogram` int DEFAULT NULL,
  `metric_ton` int DEFAULT NULL,
  `orderType` enum('FOOD_BEVERAGES','ELECTRONICS_TECHNOLOGY','CONSUMER_GOODS','BUILDING_MATERIALS','MEDICAL_SUPPLIES','TRANSPORTATION_GOODS') DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `order_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `FKrws2q0si6oyd6il8gqe2aennc` (`order_id`),
  CONSTRAINT `FKrws2q0si6oyd6il8gqe2aennc` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_detail`
--

LOCK TABLES `order_detail` WRITE;
/*!40000 ALTER TABLE `order_detail` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_invoice`
--

DROP TABLE IF EXISTS `order_invoice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_invoice` (
  `order_invoice_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `customer` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `shipping_cost` float NOT NULL,
  `tax` float DEFAULT NULL,
  `payment_method` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `payment_date` date NOT NULL,
  `note` text,
  `attach` varchar(70) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `orders` varchar(255) DEFAULT NULL,
  `invoice_number` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`order_invoice_id`),
  UNIQUE KEY `order_invoice_pk` (`invoice_number`),
  KEY `order_invoice_user_user_id_fk` (`customer`),
  KEY `FKkxiaeuer23nkwabrm4etbibbs` (`orders`),
  CONSTRAINT `FKkxiaeuer23nkwabrm4etbibbs` FOREIGN KEY (`orders`) REFERENCES `orders` (`order_id`),
  CONSTRAINT `order_invoice_user_user_id_fk` FOREIGN KEY (`customer`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_invoice`
--

LOCK TABLES `order_invoice` WRITE;
/*!40000 ALTER TABLE `order_invoice` DISABLE KEYS */;
INSERT INTO `order_invoice` VALUES ('49126e9a-242e-4fd9-8e27-ea70bf8aca28','263b0f2b-ae55-4552-ba86-be27dd0cc493',8000000,5,'Banking','2024-04-23','','','ba871d34-39a8-4240-ae40-60630625e57a','45C22MDE'),('5d74345c-849f-4c77-899d-21bb605ed163','b9e533a4-ca29-4116-8d6f-3c690154e2a0',1000000,10,'Banking','2024-04-24','','order_invoice.docx','46d52584-962b-49fe-82db-08fbba1c8bbb','45C22MDA');
/*!40000 ALTER TABLE `order_invoice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` varchar(255) NOT NULL,
  `expected_delivery_date` date DEFAULT NULL,
  `order_date` date DEFAULT NULL,
  `reality_delivery_date` date DEFAULT NULL,
  `customer` varchar(255) DEFAULT NULL,
  `delivery_start_date` date DEFAULT NULL,
  `order_number` varchar(50) DEFAULT NULL,
  `delivery_address` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `eta` date DEFAULT NULL,
  `etd` date DEFAULT NULL,
  `orderNumber` varchar(255) DEFAULT NULL,
  `requested _delivery_date` date DEFAULT NULL,
  `shipping_address` varchar(255) DEFAULT NULL,
  `shipping date` date DEFAULT NULL,
  `status` enum('PENDING','CONFIRM','TOSHIP','TORECIEVE','COMPLETED') DEFAULT NULL,
  `price` bigint DEFAULT NULL,
  `paid` bit(1) DEFAULT NULL,
  `payment` enum('TIỀN_MẶT','BANKING') DEFAULT NULL,
  `containerTruck` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  UNIQUE KEY `orders_pk` (`order_number`),
  KEY `FK1lkiu839ylbj4h8sog0e5h8tx` (`customer`),
  KEY `orders_container_truck_truck_id_fk` (`containerTruck`),
  CONSTRAINT `FK1lkiu839ylbj4h8sog0e5h8tx` FOREIGN KEY (`customer`) REFERENCES `user` (`user_id`),
  CONSTRAINT `orders_container_truck_truck_id_fk` FOREIGN KEY (`containerTruck`) REFERENCES `container_truck` (`truck_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES ('15919d70-e0c0-478a-9eea-dcb09a4b0fca',NULL,NULL,NULL,'336fadb1-5951-451c-9a28-6318868930f1',NULL,NULL,'Trường Đại Học FPT, khu công nghệ cao Hòa Lạc – Km29, ĐCT08, Thạch Hoà, Thạch Thất, Hà Nội 10000, Việt Nam',NULL,'2024-04-27','2024-04-24','24042415194','2024-04-27','Thiên đường Bảo Sơn, Km5+200, Đ. Lê Trọng Tấn, An Khánh, Hoài Đức, Hà Nội, Việt Nam','2024-04-24','TOSHIP',700000,_binary '\0','TIỀN_MẶT','bb2e6e18-b047-469d-802b-212ec4a0d8fd'),('17bea234-f715-47eb-a1e3-27578a02f2e5',NULL,NULL,NULL,'507ee842-be1b-4a9d-bfc7-61312fa73e39',NULL,NULL,'60B P. Huế, Bùi Thị Xuân, Hai Bà Trưng, Hà Nội, Việt Nam',NULL,'2024-04-29','2024-04-25','2404212D852','2024-04-29',' 106 Lò Đúc, Phạm Đình Hổ, Hai Bà Trưng, Hà Nội, Việt Nam','2024-04-24','TOSHIP',10000000,_binary '\0','TIỀN_MẶT','0812ee6d-5d4c-410e-ba93-9a22198648bb'),('33f3714f-654d-4d67-9d71-6cda74967e64',NULL,NULL,NULL,'f9063f5e-95c3-4d61-bad7-0bc27d170de7',NULL,NULL,'9 P. Phùng Hưng, Hàng Mã, Hoàn Kiếm, Hà Nội, Việt Nam',NULL,'2024-04-29','2024-04-25','2404213F644','2024-04-29','28 P. Ngô Quyền, Tràng Tiền, Hoàn Kiếm, Hà Nội, Việt Nam','2024-04-24','TOSHIP',8800000,_binary '\0','TIỀN_MẶT','503a2129-23bb-4a4e-a59a-512109b0ad43'),('3637d44d-0d75-46bb-9515-b1f9e7253232',NULL,NULL,'2024-01-17','cd894289-b349-4dda-ae37-907904ef80dd',NULL,NULL,'Đường Chợ Hòa Lạc, Xã Bình Yên, Huyện Thạch Thất, Thành phố Hà Nội',NULL,'2024-04-27','2024-04-23','240423B60A5','2024-04-27','Đại Học Quốc Gia Hà Nội, Hòa Lạc, Thạch Thất, Hà Nội, Việt Nam','2024-04-23','COMPLETED',4000000,_binary '','BANKING','586503b5-fe7d-471c-95de-b89ac4e0f2e0'),('46d52584-962b-49fe-82db-08fbba1c8bbb',NULL,NULL,NULL,'b9e533a4-ca29-4116-8d6f-3c690154e2a0',NULL,NULL,'Thành phố Hà Nội, Việt Nam',NULL,'2024-04-30','2024-04-25','240424BE578','2024-05-01','Đại học FPT, Thạch Hoà, Hà nội, Hà Nội, Việt Nam','2024-04-24','COMPLETED',9000000,_binary '','BANKING','f5202c6b-f073-42ad-9870-36ddf4655b4a'),('69b4cf13-dfe6-4cf4-81d7-b1cc78d9d90f',NULL,NULL,NULL,'70f21daf-923c-4a97-a778-27612e9da095',NULL,NULL,'113 P. Vọng, Đồng Tâm, Hai Bà Trưng, Hà Nội, Việt Nam',NULL,'2024-04-29','2024-04-25','240421B8A87','2024-04-29','110 Ng. 29 P. Phương Liệt, Phương Liệt, Thanh Xuân, Hà Nội, Việt Nam','2024-04-24','TOSHIP',16000000,_binary '\0','TIỀN_MẶT','5211a535-b294-40b1-8d92-fbacdb23245c'),('87268626-620e-43bf-8d61-e25480190dcd',NULL,NULL,NULL,'6cbf4324-33d7-4099-b43c-a5146fd03c9d',NULL,NULL,'95C, Tổ 27, Phường Thanh Lương, Quận Hai Bà Trưng, Thành Phố Hà Nội, Cầu Dền, Hai Bà Trưng, Hà Nội, Việt Nam',NULL,'2024-04-29','2024-04-25','2404214BC5E','2024-04-29','40 Trần Đại Nghĩa, Đồng Tâm, Hai Bà Trưng, Hà Nội 100000, Việt Nam','2024-04-24','TOSHIP',45000000,_binary '','BANKING','787e1e27-450f-4ff3-a32a-f4c361ccde3d'),('9ad28fb2-32a3-462a-b255-21f8a6cb0924',NULL,NULL,'2024-03-19','336fadb1-5951-451c-9a28-6318868930f1',NULL,NULL,'Trường Đại Học FPT, khu công nghệ cao Hòa Lạc – Km29, ĐCT08, Thạch Hoà, Thạch Thất, Hà Nội 10000, Việt Nam',NULL,'2024-04-27','2024-04-25','240424286AB','2024-04-27','Thiên đường Bảo Sơn, Km5+200, Đ. Lê Trọng Tấn, An Khánh, Hoài Đức, Hà Nội, Việt Nam','2024-04-24','COMPLETED',800000,_binary '','TIỀN_MẶT','b11a6f64-3282-474e-997d-dba1891d2a4e'),('9d5b42ca-b95b-4b4a-8a30-46d453037485',NULL,NULL,NULL,'8c44d260-d73d-4615-97c8-2dae52b27501',NULL,NULL,'Số 106, Ngách 206, Ngõ 155 Trường Chinh,Thanh Xuân, Hà Nội, Vietnam, Khương Mai, Thanh Xuân, Hà Nội, Việt Nam',NULL,'2024-04-29','2024-04-25','240421C596A','2024-04-29',' 22A, Trung Thanh, Thôn, Hữu Từ, Thanh Trì, Hà Nội 10000, Việt Nam','2024-04-24','TOSHIP',20000000,_binary '','BANKING','948af9d2-1cdc-4e3d-bac0-607195bfa013'),('ba871d34-39a8-4240-ae40-60630625e57a',NULL,NULL,'2023-11-15','263b0f2b-ae55-4552-ba86-be27dd0cc493',NULL,NULL,'Đại Học Quốc Gia Hà Nội, Hòa Lạc, Thạch Thất, Hà Nội, Việt Nam',NULL,'2024-04-27','2024-04-23','2404236F9C3','2024-04-27','Đường Chợ Hòa Lạc, Xã Bình Yên, Huyện Thạch Thất, Thành phố Hà Nội','2024-04-23','COMPLETED',8000000,_binary '','BANKING','f8c6c55c-ffaf-45bd-ad6b-662d8c5519a0'),('dce871ca-cd0f-49c2-8622-b35860d1c827',NULL,NULL,'2024-04-24','336fadb1-5951-451c-9a28-6318868930f1',NULL,NULL,'Trường Đại Học FPT, khu công nghệ cao Hòa Lạc – Km29, ĐCT08, Thạch Hoà, Thạch Thất, Hà Nội 10000, Việt Nam',NULL,'2024-04-27','2024-04-25','240424AC037','2024-04-27','Thiên đường Bảo Sơn, Km5+200, Đ. Lê Trọng Tấn, An Khánh, Hoài Đức, Hà Nội, Việt Nam','2024-04-24','COMPLETED',20000000,_binary '','TIỀN_MẶT','fb00f015-5902-4b5f-aeab-b1acd9bd4995'),('ec3adba0-0641-4d35-90f7-564a682e9c74',NULL,NULL,NULL,'6cbf4324-33d7-4099-b43c-a5146fd03c9d',NULL,NULL,'Cổng trường Đại học FPT, Thạch Hoà, Thạch Thất, Hà Nội, Việt Nam',NULL,'2024-04-30','2024-04-24','2404244CDC7','2024-04-30','tuyên',NULL,'PENDING',25000000,_binary '\0',NULL,NULL),('f2ff0873-2a12-4d3a-a98f-5aee4f9b8c9c',NULL,NULL,NULL,'6cbf4324-33d7-4099-b43c-a5146fd03c9d',NULL,NULL,'Cổng trường Đại học FPT, Thạch Hoà, Thạch Thất, Hà Nội, Việt Nam',NULL,'2024-04-30','2024-04-24','24042414959','2024-04-30','tuyên',NULL,'PENDING',25000000,_binary '\0',NULL,NULL),('fc1b120e-a0a6-42e8-9e84-0b8470c1aba8',NULL,NULL,'2024-04-24','336fadb1-5951-451c-9a28-6318868930f1',NULL,NULL,'Trường Đại Học FPT, khu công nghệ cao Hòa Lạc – Km29, ĐCT08, Thạch Hoà, Thạch Thất, Hà Nội 10000, Việt Nam',NULL,'2024-05-11','2024-05-07','24042465EAC','2024-05-11','Thiên đường Bảo Sơn, Km5+200, Đ. Lê Trọng Tấn, An Khánh, Hoài Đức, Hà Nội, Việt Nam','2024-04-24','TORECIEVE',1100000,_binary '','TIỀN_MẶT','586503b5-fe7d-471c-95de-b89ac4e0f2e0');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_token`
--

DROP TABLE IF EXISTS `refresh_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_token` (
  `id` int NOT NULL AUTO_INCREMENT,
  `expiryDate` datetime(6) DEFAULT NULL,
  `refreshToken` varchar(255) DEFAULT NULL,
  `account_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_1gnoedr4u8s5p7ccdkftq38bh` (`account_id`),
  CONSTRAINT `FKiox3wo9jixvp9boxfheq7l99w` FOREIGN KEY (`account_id`) REFERENCES `account` (`account_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_token`
--

LOCK TABLES `refresh_token` WRITE;
/*!40000 ALTER TABLE `refresh_token` DISABLE KEYS */;
INSERT INTO `refresh_token` VALUES (1,'2024-04-28 14:43:08.641805','d76635a0-f958-45b2-92e4-68902a600b7c','id-1'),(2,'2024-04-28 14:44:57.021609','78c54859-027d-4433-a6f6-b56f9209666e','id-0'),(3,'2024-04-30 15:24:06.094480','cd9a1a30-a830-4cda-8657-b42078a7008f','05464bf2-ae09-4310-9c5c-d0a41630e4d0'),(4,'2024-04-30 15:29:53.576517','cbeacba4-7ab0-442b-b5af-4c38eb2345c3','1a84406a-3178-4cb6-b3b2-4c16a42681b4'),(5,'2024-04-30 16:20:16.485667','29621087-3b4b-41e4-bdae-58c1d413a906','cc2ca9fd-a1cf-440e-a5cb-486d78ef5185'),(6,'2024-04-30 16:20:48.956263','3786e42d-68ac-428a-9c77-47d98e28fc51','0bc0de10-15ca-4a21-afda-9d36562465ef'),(7,'2024-04-30 16:54:19.692886','bcc9b5d2-1321-4699-8f3f-5addd7ec92fc','b36e1092-b948-4002-be11-8a9757535f78'),(8,'2024-04-30 16:58:59.483782','3eaa8e4d-b316-4f77-b64f-c20ac637d76f','6d524e0f-011b-41d6-8df7-5b54019a9277'),(9,'2024-04-30 18:00:32.602417','18c7449f-5a7f-4a24-8faa-8ef96de0079d','b1e50617-2023-471d-919e-1b615442bb2b'),(10,'2024-04-30 18:01:10.536130','3df04970-1907-44cc-8a95-61d8d6caa0e6','400cdcd9-ca36-4969-ba46-ce1785244abe'),(11,'2024-04-30 18:02:44.683921','fb48f4a4-ae8d-4d8c-94d6-49a8c58bea00','4db29501-d2a7-4f51-bcc2-230c0d5435f4'),(12,'2024-04-30 18:02:57.731224','cd755464-6700-4ba1-a6d6-78a3c3120b07','d3522e0f-f190-400b-a7b5-5fa80501e90e'),(13,'2024-04-30 18:03:20.616843','4e21b9fc-ca6f-47a0-89c8-88783d42a041','720b62d2-45fd-43cc-a652-896ea2495b37'),(14,'2024-04-30 18:03:35.639032','1d3fc96c-8f46-409c-8b0d-df8b55a54765','5b5e693e-f47a-4586-a0b5-c21f0a77b203'),(15,'2024-05-01 11:14:22.391314','3b7724e6-488a-4f7c-a14e-fd259d0444da','d07b9f2a-e255-46f0-940e-bdb1e3f9e9c9'),(16,'2024-05-01 11:16:15.926885','4b845a99-1051-4f19-a1af-4b9b5580aeb1','22f04a42-c2f6-4202-b235-42c22f9db4c9'),(17,'2024-05-01 11:17:15.090347','d8fdc14a-60f4-4914-b966-f7d81f414b77','aa92f8a6-947c-4d7c-a6ae-5affafe122fc'),(18,'2024-05-01 11:18:49.573910','acd1101a-7ad4-4806-b407-d27af28adc23','085c5068-7bcd-4ec1-9c91-51916c08cfed'),(19,'2024-05-01 14:52:36.263831','b40ca7e7-1a99-4452-b8c8-b8175b70726e','c411e5e5-b6d1-4e3e-bc52-20ebc2268271'),(20,'2024-05-01 14:56:21.945196','d4ba6f29-f873-4f09-9137-ad04ec09b61c','d4c4b1c7-00f3-447b-84b4-90f489ae7f3e'),(21,'2024-05-01 15:01:01.561277','053ab694-5964-4b5a-88db-da74207e0b9b','c4c2fd42-f0b6-4d22-b715-f22d02b0968b'),(22,'2024-05-01 15:03:35.868196','8bbac0ad-3817-4599-b88b-f2d2cf7ac083','84bcac36-ccd8-4b82-97f0-ef2b0383aee3'),(23,'2024-05-01 15:10:25.802109','e5654b90-b30a-4390-935a-31dfe5cf7c49','60a2826c-61ee-42d9-9d04-c41c573416d1');
/*!40000 ALTER TABLE `refresh_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refreshtoken`
--

DROP TABLE IF EXISTS `refreshtoken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refreshtoken` (
  `id` varchar(255) NOT NULL,
  `refreshToken` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refreshtoken`
--

LOCK TABLES `refreshtoken` WRITE;
/*!40000 ALTER TABLE `refreshtoken` DISABLE KEYS */;
/*!40000 ALTER TABLE `refreshtoken` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `repair_invoice`
--

DROP TABLE IF EXISTS `repair_invoice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `repair_invoice` (
  `repair_invoice_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `truck` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `repair_date` date NOT NULL,
  `description` text,
  `repair_cost` float NOT NULL,
  `payment_method` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `service_provider` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `service_provider_contact` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `attach` varchar(70) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `invoice_number` varchar(50) DEFAULT NULL,
  `tax` float DEFAULT NULL,
  PRIMARY KEY (`repair_invoice_id`),
  UNIQUE KEY `repair_invoice_pk` (`invoice_number`),
  KEY `repair_invoice_container_truck_truck_id_fk` (`truck`),
  CONSTRAINT `repair_invoice_container_truck_truck_id_fk` FOREIGN KEY (`truck`) REFERENCES `container_truck` (`truck_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `repair_invoice`
--

LOCK TABLES `repair_invoice` WRITE;
/*!40000 ALTER TABLE `repair_invoice` DISABLE KEYS */;
INSERT INTO `repair_invoice` VALUES ('03598504-1b02-41a8-95fc-adad97e12b46','948af9d2-1cdc-4e3d-bac0-607195bfa013','2022-10-10','none',1400000,'Tiền mặt','Trung tâm sửa chữa ô tô Daewoo Thanh Xuân','0982614151','','45C22MDN',5),('073aeb8d-9b32-4ea2-8809-439fc1a942d6','5211a535-b294-40b1-8d92-fbacdb23245c','2023-02-11','none',19000000,'Tiền mặt','Trung tâm sửa chữa ô tô Daewoo Thanh Xuân','0988888761',NULL,'42C22HLD',2),('3b57f072-ce1e-4c85-abfe-52f17c6cb5af','5211a535-b294-40b1-8d92-fbacdb23245c','2023-01-12','none',7200000,'Tiền mặt','Trung tâm sửa chữa ô tô Daewoo Thanh Xuân','0982124123',NULL,'42C22MLD',2),('416977dc-3078-415e-8677-b2fbe50b61d5','a9a83182-faa0-4002-9b05-7ddd4442da58','2023-08-11','none',1000000,'Banking','Trung tâm sửa chữa ô tô Daewoo Thanh Xuân','0924145124',NULL,'18K23THN',5),('4fba166b-fb26-4d3c-8d32-b3cd192743ed','bb2e6e18-b047-469d-802b-212ec4a0d8fd','2022-09-12','none',1600000,'Banking','Garage Auto Đức Tùng ','0988541235',NULL,'22K22MDB',2),('5e8471c9-fa78-4d5a-bcf0-b170ae084f4f','948af9d2-1cdc-4e3d-bac0-607195bfa013','2023-10-10','Demo nhập Excel',10000000,'Banking','Minh Kỳ Auto Gara','0123456789',NULL,'45C22ABC',2),('769e4e3b-0719-43ac-b4d4-f06608ca92c2','fb00f015-5902-4b5f-aeab-b1acd9bd4995','2022-09-12','none',9100000,'Tiền mặt','Garage Auto Đức Tùng ','0981415141','','99C22MKN',10),('7a89fb47-fe0d-49db-a4a0-8461d68b54b5','bb2e6e18-b047-469d-802b-212ec4a0d8fd','2022-09-12','none',2300000,'Banking','Garage Auto Đức Tùng ','0981415168',NULL,'20C22MNB',0),('8693a632-ec60-4ab6-a225-615119bb3f8f','f5202c6b-f073-42ad-9870-36ddf4655b4a','2022-09-12','none',11000000,'Tiền mặt','Garage Auto Đoàn Huấn','0982551414',NULL,'22C22MLB',2),('88c51134-e44e-4ad1-a216-59a7e548a5bb','503a2129-23bb-4a4e-a59a-512109b0ad43','2024-01-12','thay thế phụ tùng bị hỏng',10000000,'Tiền mặt','Công ty thương mại và dịch vụ Long Hải','0326065916','container_contract.doc','12C24TLH',2),('9f6aaa0c-a2a3-411f-ad46-6396a171c2d1','0812ee6d-5d4c-410e-ba93-9a22198648bb','2023-05-12','bảo dưỡng',12000000,'Banking','Gara ô tô Quang Hải','0912456789','repair_invoice.docx','01K23DLH',2),('a9c5fdf5-4752-4c51-a261-ee7362973241','0812ee6d-5d4c-410e-ba93-9a22198648bb','2023-10-10','none',12000000,'Banking','Garage Auto Đức Tùng ','0982629761',NULL,'22C23MNB',2),('adfe505c-6965-4c12-92d4-3d894d954106','503a2129-23bb-4a4e-a59a-512109b0ad43','2022-12-01','none',25000000,'Banking','Garage ô tô Đức Trung – Công ty TM & DV Thành Tín','0982629228',NULL,'12K22TDL',0),('b511bc23-2aab-4767-9f36-2a382d493d4c','b11a6f64-3282-474e-997d-dba1891d2a4e','2019-09-12','none',2200000,'Banking','Garage Trịnh Văn Thắng','0345141512',NULL,'22C23MNG',2),('bf3f9e6a-ae46-4fc3-aef0-259346013d0b','f5202c6b-f073-42ad-9870-36ddf4655b4a','2022-09-12','none',15000000,'Tiền mặt','Garage Auto Đoàn Huấn','0984514124',NULL,'00C22MBH',0),('dec39d1f-c240-41e1-a772-4d2d73ac66ac','f2c9e7db-f43b-412e-8947-88603fc75005','2022-09-12','none',1500000,'Tiền mặt','Garage Trịnh Văn Thắng','0986666666',NULL,'18C22MDB',0),('e57358cb-30da-4f19-bf51-3d2d3c371ff4','bb2e6e18-b047-469d-802b-212ec4a0d8fd','2020-10-11','none',1400000,'Banking','Garage Auto Đức Tùng','0981241515',NULL,'10C20MNB',0),('ec057273-773e-42f5-8491-67e5e3b7ffec','f2c9e7db-f43b-412e-8947-88603fc75005','2022-09-12','none',1600000,'Tiền mặt','Garage Auto Đức Tùng ','0981244114',NULL,'14C23NBT',0),('f63499a1-6c75-4490-829d-f40068a23dad','503a2129-23bb-4a4e-a59a-512109b0ad43','2022-12-01','none',11000000,'Tiền mặt','Trung tâm sửa chữa ô tô Daewoo Thanh Xuân','0982626124',NULL,'45C22TLD',5);
/*!40000 ALTER TABLE `repair_invoice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reset_password_otp`
--

DROP TABLE IF EXISTS `reset_password_otp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reset_password_otp` (
  `id` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `expiryDate` datetime(6) DEFAULT NULL,
  `otp` varchar(255) DEFAULT NULL,
  `isVerified` bit(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reset_password_otp`
--

LOCK TABLES `reset_password_otp` WRITE;
/*!40000 ALTER TABLE `reset_password_otp` DISABLE KEYS */;
/*!40000 ALTER TABLE `reset_password_otp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `salary`
--

DROP TABLE IF EXISTS `salary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salary` (
  `salary_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `user` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `fixed_salary` float NOT NULL,
  `fix_cost` int DEFAULT NULL,
  `bonus_salary` float DEFAULT NULL,
  `note` text,
  PRIMARY KEY (`salary_id`),
  KEY `salary_user_user_id_fk` (`user`),
  CONSTRAINT `salary_user_user_id_fk` FOREIGN KEY (`user`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salary`
--

LOCK TABLES `salary` WRITE;
/*!40000 ALTER TABLE `salary` DISABLE KEYS */;
/*!40000 ALTER TABLE `salary` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `salary_expand`
--

DROP TABLE IF EXISTS `salary_expand`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salary_expand` (
  `salary_expand_id` varchar(50) NOT NULL,
  `salary` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `cost_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `cost` float NOT NULL,
  `repair_invoice` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `note` text,
  `date` date NOT NULL,
  PRIMARY KEY (`salary_expand_id`),
  KEY `salary_expand_repair_invoice_repair_invoice_id_fk` (`repair_invoice`),
  KEY `salary_expand_salary_salary_id_fk` (`salary`),
  CONSTRAINT `salary_expand_repair_invoice_repair_invoice_id_fk` FOREIGN KEY (`repair_invoice`) REFERENCES `repair_invoice` (`repair_invoice_id`),
  CONSTRAINT `salary_expand_salary_salary_id_fk` FOREIGN KEY (`salary`) REFERENCES `salary` (`salary_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salary_expand`
--

LOCK TABLES `salary_expand` WRITE;
/*!40000 ALTER TABLE `salary_expand` DISABLE KEYS */;
/*!40000 ALTER TABLE `salary_expand` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tracking_container`
--

DROP TABLE IF EXISTS `tracking_container`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tracking_container` (
  `tracking_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `origin` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `destination` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `distance` float DEFAULT NULL,
  `first_location` varchar(255) DEFAULT NULL,
  `second_location` varchar(255) DEFAULT NULL,
  `third_location` varchar(255) DEFAULT NULL,
  `expected_path_img` varchar(255) DEFAULT NULL,
  `real_path_img` varchar(255) DEFAULT NULL,
  `containerTruck` varchar(255) DEFAULT NULL,
  `orders` varchar(255) DEFAULT NULL,
  `destination_location` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`tracking_id`),
  KEY `FKr7355ivg4k5yg7dx3xgcanmob` (`containerTruck`),
  KEY `FKgn2hb11t6iynyrtefavf7kpq2` (`orders`),
  CONSTRAINT `FKgn2hb11t6iynyrtefavf7kpq2` FOREIGN KEY (`orders`) REFERENCES `orders` (`order_id`),
  CONSTRAINT `FKr7355ivg4k5yg7dx3xgcanmob` FOREIGN KEY (`containerTruck`) REFERENCES `container_truck` (`truck_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tracking_container`
--

LOCK TABLES `tracking_container` WRITE;
/*!40000 ALTER TABLE `tracking_container` DISABLE KEYS */;
INSERT INTO `tracking_container` VALUES ('5a163d3a-2056-4c2c-abf8-6b0a34e32d95','28 P. Ngô Quyền, Tràng Tiền, Hoàn Kiếm, Hà Nội, Việt Nam','9 P. Phùng Hưng, Hàng Mã, Hoàn Kiếm, Hà Nội, Việt Nam',0,NULL,NULL,NULL,NULL,NULL,'503a2129-23bb-4a4e-a59a-512109b0ad43','33f3714f-654d-4d67-9d71-6cda74967e64',NULL),('68764154-ddc0-48c9-9e0b-d8a2946f7425','Đường Chợ Hòa Lạc, Xã Bình Yên, Huyện Thạch Thất, Thành phố Hà Nội','Đại Học Quốc Gia Hà Nội, Hòa Lạc, Thạch Thất, Hà Nội, Việt Nam',0,'21.023622, 105.520328','21.013627, 105.518959','21.011163, 105.518604',NULL,NULL,'f8c6c55c-ffaf-45bd-ad6b-662d8c5519a0','ba871d34-39a8-4240-ae40-60630625e57a','21.00099276816633,105.52115201681382'),('6bcc9660-4668-4dec-870e-ff0e58a30384','Thiên đường Bảo Sơn, Km5+200, Đ. Lê Trọng Tấn, An Khánh, Hoài Đức, Hà Nội, Việt Nam','Trường Đại Học FPT, khu công nghệ cao Hòa Lạc – Km29, ĐCT08, Thạch Hoà, Thạch Thất, Hà Nội 10000, Việt Nam',0,NULL,NULL,NULL,NULL,NULL,'fb00f015-5902-4b5f-aeab-b1acd9bd4995','dce871ca-cd0f-49c2-8622-b35860d1c827',NULL),('7decd2c3-3aa7-4e1a-a06c-3a405d1c9b9e','40 Trần Đại Nghĩa, Đồng Tâm, Hai Bà Trưng, Hà Nội 100000, Việt Nam','95C, Tổ 27, Phường Thanh Lương, Quận Hai Bà Trưng, Thành Phố Hà Nội, Cầu Dền, Hai Bà Trưng, Hà Nội, Việt Nam',0,NULL,NULL,NULL,NULL,NULL,'787e1e27-450f-4ff3-a32a-f4c361ccde3d','87268626-620e-43bf-8d61-e25480190dcd',NULL),('a8a19658-ae68-4a88-ba90-c9b31476bfdb',' 106 Lò Đúc, Phạm Đình Hổ, Hai Bà Trưng, Hà Nội, Việt Nam','60B P. Huế, Bùi Thị Xuân, Hai Bà Trưng, Hà Nội, Việt Nam',0,NULL,NULL,NULL,NULL,NULL,'0812ee6d-5d4c-410e-ba93-9a22198648bb','17bea234-f715-47eb-a1e3-27578a02f2e5',NULL),('b505c34f-d369-4a95-9649-157defba5940','Thiên đường Bảo Sơn, Km5+200, Đ. Lê Trọng Tấn, An Khánh, Hoài Đức, Hà Nội, Việt Nam','Trường Đại Học FPT, khu công nghệ cao Hòa Lạc – Km29, ĐCT08, Thạch Hoà, Thạch Thất, Hà Nội 10000, Việt Nam',0,NULL,NULL,NULL,NULL,NULL,'586503b5-fe7d-471c-95de-b89ac4e0f2e0','fc1b120e-a0a6-42e8-9e84-0b8470c1aba8',NULL),('b5db9446-2d1e-442a-b4ba-a6998843245d','Đại Học Quốc Gia Hà Nội, Hòa Lạc, Thạch Thất, Hà Nội, Việt Nam','Đường Chợ Hòa Lạc, Xã Bình Yên, Huyện Thạch Thất, Thành phố Hà Nội',0,'21.000992379099927,105.52114304432197',NULL,NULL,NULL,NULL,'586503b5-fe7d-471c-95de-b89ac4e0f2e0','3637d44d-0d75-46bb-9515-b1f9e7253232',NULL),('c236078f-f799-4cb3-af99-c2b784758886',' 22A, Trung Thanh, Thôn, Hữu Từ, Thanh Trì, Hà Nội 10000, Việt Nam','Số 106, Ngách 206, Ngõ 155 Trường Chinh,Thanh Xuân, Hà Nội, Vietnam, Khương Mai, Thanh Xuân, Hà Nội, Việt Nam',0,NULL,NULL,NULL,NULL,NULL,'948af9d2-1cdc-4e3d-bac0-607195bfa013','9d5b42ca-b95b-4b4a-8a30-46d453037485',NULL),('cec9eff6-82c1-4c37-a888-63306928946b','Thiên đường Bảo Sơn, Km5+200, Đ. Lê Trọng Tấn, An Khánh, Hoài Đức, Hà Nội, Việt Nam','Trường Đại Học FPT, khu công nghệ cao Hòa Lạc – Km29, ĐCT08, Thạch Hoà, Thạch Thất, Hà Nội 10000, Việt Nam',0,'21.003372, 105.660352','21.002676, 105.626524','20.998082, 105.522637',NULL,NULL,'bb2e6e18-b047-469d-802b-212ec4a0d8fd','15919d70-e0c0-478a-9eea-dcb09a4b0fca',''),('d1677b52-f209-4a7a-b820-12ab51500b50','Đại học FPT, Thạch Hoà, Hà nội, Hà Nội, Việt Nam','Thành phố Hà Nội, Việt Nam',0,'21.0272256,105.5358976','21.002676, 105.626524','21.008021, 105.796344',NULL,NULL,'f5202c6b-f073-42ad-9870-36ddf4655b4a','46d52584-962b-49fe-82db-08fbba1c8bbb','21.028294, 105.854210'),('e192fb91-259d-402f-9f39-300db553bb39','Thiên đường Bảo Sơn, Km5+200, Đ. Lê Trọng Tấn, An Khánh, Hoài Đức, Hà Nội, Việt Nam','Trường Đại Học FPT, khu công nghệ cao Hòa Lạc – Km29, ĐCT08, Thạch Hoà, Thạch Thất, Hà Nội 10000, Việt Nam',0,NULL,NULL,NULL,NULL,NULL,'b11a6f64-3282-474e-997d-dba1891d2a4e','9ad28fb2-32a3-462a-b255-21f8a6cb0924',NULL),('e22363af-6019-4508-8faa-2de1e3f2d0ac','110 Ng. 29 P. Phương Liệt, Phương Liệt, Thanh Xuân, Hà Nội, Việt Nam','113 P. Vọng, Đồng Tâm, Hai Bà Trưng, Hà Nội, Việt Nam',0,NULL,NULL,NULL,NULL,NULL,'5211a535-b294-40b1-8d92-fbacdb23245c','69b4cf13-dfe6-4cf4-81d7-b1cc78d9d90f',NULL);
/*!40000 ALTER TABLE `tracking_container` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transportation_contract`
--

DROP TABLE IF EXISTS `transportation_contract`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transportation_contract` (
  `transportation_contract_id` varchar(255) NOT NULL,
  `attach` varchar(255) DEFAULT NULL,
  `contract_number` varchar(255) DEFAULT NULL,
  `delivery_start_date` date DEFAULT NULL,
  `deposit` bigint DEFAULT NULL,
  `expected_delivery_date` date DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `order_date` date DEFAULT NULL,
  `shipping_address` varchar(255) DEFAULT NULL,
  `customer` varchar(255) DEFAULT NULL,
  `orders` varchar(255) DEFAULT NULL,
  `delivery_address` varchar(255) DEFAULT NULL,
  `eta` date DEFAULT NULL,
  `etd` date DEFAULT NULL,
  `requested _delivery_date` date DEFAULT NULL,
  `total_price` bigint DEFAULT NULL,
  PRIMARY KEY (`transportation_contract_id`),
  KEY `FK25lpdji14w1rb9g6sf84ynp7q` (`customer`),
  KEY `FKqjj55hi9bnr8u7cx6g4y6fa03` (`orders`),
  CONSTRAINT `FK25lpdji14w1rb9g6sf84ynp7q` FOREIGN KEY (`customer`) REFERENCES `user` (`user_id`),
  CONSTRAINT `FKqjj55hi9bnr8u7cx6g4y6fa03` FOREIGN KEY (`orders`) REFERENCES `orders` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transportation_contract`
--

LOCK TABLES `transportation_contract` WRITE;
/*!40000 ALTER TABLE `transportation_contract` DISABLE KEYS */;
INSERT INTO `transportation_contract` VALUES ('0c7aaf9f-0ef6-470b-bffc-17a55ce4505b','transport_contract.docx','20-68/HDVC',NULL,5000000,NULL,NULL,NULL,' 106 Lò Đúc, Phạm Đình Hổ, Hai Bà Trưng, Hà Nội, Việt Nam','507ee842-be1b-4a9d-bfc7-61312fa73e39','17bea234-f715-47eb-a1e3-27578a02f2e5','60B P. Huế, Bùi Thị Xuân, Hai Bà Trưng, Hà Nội, Việt Nam','2024-04-29','2024-04-25','2024-04-29',15000000),('156b521c-12b7-4b40-9b29-7f39710fe390','transport_contract.docx','23-20/HDVC',NULL,200000,NULL,NULL,NULL,'Thiên đường Bảo Sơn, Km5+200, Đ. Lê Trọng Tấn, An Khánh, Hoài Đức, Hà Nội, Việt Nam','336fadb1-5951-451c-9a28-6318868930f1','fc1b120e-a0a6-42e8-9e84-0b8470c1aba8','Trường Đại Học FPT, khu công nghệ cao Hòa Lạc – Km29, ĐCT08, Thạch Hoà, Thạch Thất, Hà Nội 10000, Việt Nam','2024-05-11','2024-05-07','2024-05-11',1300000),('2c9e57d8-fc4f-434e-a05b-13b33a267699','transport_contract.docx','25-20/HDVC',NULL,200000,NULL,NULL,NULL,'Thiên đường Bảo Sơn, Km5+200, Đ. Lê Trọng Tấn, An Khánh, Hoài Đức, Hà Nội, Việt Nam','336fadb1-5951-451c-9a28-6318868930f1','15919d70-e0c0-478a-9eea-dcb09a4b0fca','Trường Đại Học FPT, khu công nghệ cao Hòa Lạc – Km29, ĐCT08, Thạch Hoà, Thạch Thất, Hà Nội 10000, Việt Nam','2024-04-27','2024-04-24','2024-04-27',900000),('7b256f19-b819-4b8d-b0a1-a29190489996','transport_contract.docx','56-90/HDVC',NULL,10000000,NULL,NULL,NULL,'40 Trần Đại Nghĩa, Đồng Tâm, Hai Bà Trưng, Hà Nội 100000, Việt Nam','6cbf4324-33d7-4099-b43c-a5146fd03c9d','87268626-620e-43bf-8d61-e25480190dcd','95C, Tổ 27, Phường Thanh Lương, Quận Hai Bà Trưng, Thành Phố Hà Nội, Cầu Dền, Hai Bà Trưng, Hà Nội, Việt Nam','2024-04-29','2024-04-25','2024-04-29',55000000),('82275da5-62a2-44a5-87b2-8c242db987a6','transport_contract.docx','21-68/HDVC',NULL,25000000,NULL,NULL,NULL,'tuyên','6cbf4324-33d7-4099-b43c-a5146fd03c9d','ec3adba0-0641-4d35-90f7-564a682e9c74','Cổng trường Đại học FPT, Thạch Hoà, Thạch Thất, Hà Nội, Việt Nam','2024-04-30','2024-04-24','2024-04-30',50000000),('8ae3beae-7163-498c-b7f4-dc139be44e85','transport_contract.docx','21-68/HDVC',NULL,25000000,NULL,NULL,NULL,'tuyên','6cbf4324-33d7-4099-b43c-a5146fd03c9d','f2ff0873-2a12-4d3a-a98f-5aee4f9b8c9c','Cổng trường Đại học FPT, Thạch Hoà, Thạch Thất, Hà Nội, Việt Nam','2024-04-30','2024-04-24','2024-04-30',50000000),('8eb810e4-3c8d-43ae-9285-fd912711044c','transport_contract.docx','26-20/HDVC',NULL,2000000,NULL,NULL,NULL,'Thiên đường Bảo Sơn, Km5+200, Đ. Lê Trọng Tấn, An Khánh, Hoài Đức, Hà Nội, Việt Nam','336fadb1-5951-451c-9a28-6318868930f1','dce871ca-cd0f-49c2-8622-b35860d1c827','Trường Đại Học FPT, khu công nghệ cao Hòa Lạc – Km29, ĐCT08, Thạch Hoà, Thạch Thất, Hà Nội 10000, Việt Nam','2024-04-27','2024-04-25','2024-04-27',22000000),('9834b204-6b85-47fd-aa5f-d0972c977553','transport_contract.docx','14-68/HDVC',NULL,3200000,NULL,NULL,NULL,'28 P. Ngô Quyền, Tràng Tiền, Hoàn Kiếm, Hà Nội, Việt Nam','f9063f5e-95c3-4d61-bad7-0bc27d170de7','33f3714f-654d-4d67-9d71-6cda74967e64','9 P. Phùng Hưng, Hàng Mã, Hoàn Kiếm, Hà Nội, Việt Nam','2024-04-29','2024-04-25','2024-04-29',12000000),('987cbcbc-0ce7-4456-bbe4-6ec4b91c6846','transport_contract.docx','20-69/HDVC',NULL,1000000,NULL,NULL,NULL,'Đại học FPT, Thạch Hoà, Hà nội, Hà Nội, Việt Nam','b9e533a4-ca29-4116-8d6f-3c690154e2a0','46d52584-962b-49fe-82db-08fbba1c8bbb','Thành phố Hà Nội, Việt Nam','2024-04-30','2024-04-25','2024-05-01',10000000),('c3964a64-fc06-4df7-994e-3658eaaf4c26','transport_contract.docx','18-20/HDVC',NULL,1000000,NULL,NULL,NULL,'Đường Chợ Hòa Lạc, Xã Bình Yên, Huyện Thạch Thất, Thành phố Hà Nội','263b0f2b-ae55-4552-ba86-be27dd0cc493','ba871d34-39a8-4240-ae40-60630625e57a','Đại Học Quốc Gia Hà Nội, Hòa Lạc, Thạch Thất, Hà Nội, Việt Nam','2024-04-29','2024-04-25','2024-04-29',9000000),('c4888ae5-36b1-46d2-88fc-8c08362d2129','','57-63/HDVC',NULL,5000000,NULL,NULL,NULL,' 22A, Trung Thanh, Thôn, Hữu Từ, Thanh Trì, Hà Nội 10000, Việt Nam','8c44d260-d73d-4615-97c8-2dae52b27501','9d5b42ca-b95b-4b4a-8a30-46d453037485','Số 106, Ngách 206, Ngõ 155 Trường Chinh,Thanh Xuân, Hà Nội, Vietnam, Khương Mai, Thanh Xuân, Hà Nội, Việt Nam','2024-04-29','2024-04-25','2024-04-29',25000000),('cd22b57f-16e5-459c-aacb-aea63b1623fc','incident.xlsx','80-27/HDVC',NULL,1000000,NULL,NULL,NULL,'Đại Học Quốc Gia Hà Nội, Hòa Lạc, Thạch Thất, Hà Nội, Việt Nam','cd894289-b349-4dda-ae37-907904ef80dd','3637d44d-0d75-46bb-9515-b1f9e7253232','Đường Chợ Hòa Lạc, Xã Bình Yên, Huyện Thạch Thất, Thành phố Hà Nội','2024-04-29','2024-04-25','2024-04-29',7000000),('e86ab237-4e21-491e-a7b0-640aeb68707d','transport_contract.docx','22-20/HDVC',NULL,200000,NULL,NULL,NULL,'Thiên đường Bảo Sơn, Km5+200, Đ. Lê Trọng Tấn, An Khánh, Hoài Đức, Hà Nội, Việt Nam','336fadb1-5951-451c-9a28-6318868930f1','9ad28fb2-32a3-462a-b255-21f8a6cb0924','Trường Đại Học FPT, khu công nghệ cao Hòa Lạc – Km29, ĐCT08, Thạch Hoà, Thạch Thất, Hà Nội 10000, Việt Nam','2024-04-27','2024-04-25','2024-04-27',1000000),('fa18e274-411f-4163-a747-2af6e8dcfecd','transport_contract.docx','46-60/HDVC',NULL,4000000,NULL,NULL,NULL,'110 Ng. 29 P. Phương Liệt, Phương Liệt, Thanh Xuân, Hà Nội, Việt Nam','70f21daf-923c-4a97-a778-27612e9da095','69b4cf13-dfe6-4cf4-81d7-b1cc78d9d90f','113 P. Vọng, Đồng Tâm, Hai Bà Trưng, Hà Nội, Việt Nam','2024-04-29','2024-04-25','2024-04-29',20000000);
/*!40000 ALTER TABLE `transportation_contract` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `firstname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `lastname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `address` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `phone` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `personal_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `image` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `birthdate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `role` enum('CUSTOMER','ADMIN','DRIVER','STAFF') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `hasAccount` bit(1) DEFAULT NULL,
  `user_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fixed_salary` bigint DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('03ee21f3-5f6a-40cc-bf7b-2a2acb6f926a','Nguyễn','Minh Châu','306 E2 P. Thành Công, Tổ 28, Ba Đình, Hà Nội, Vietnam','0977954479','minhchau0502@gmail.com','001292745399',NULL,'02-05-2002',_binary '','CUSTOMER',_binary '','chaunm0243',NULL),('0815517e-29c7-4c56-9d1f-8e82c71b7ac8','Cao','Văn Thành',' 122 P. Nguyễn Thái Học, Điện Bàn, Ba Đình, Hà Nội, Việt Nam','0983629312','thanhcv1@gmail.com','023134642312',NULL,'10-12-1998',_binary '','DRIVER',_binary '','thanhcv9911',12000000),('145a7e5e-84fe-4605-afbe-944a79c77516','Nguyễn','Bá Đạt','162 P. Đội Cấn, Ngọc Hồ, Ba Đình, Hà Nội, Việt Nam','0983629312','datnb1@gmail.com','023134642312',NULL,'19-12-1990',_binary '','DRIVER',_binary '','datnb0324',12500000),('263b0f2b-ae55-4552-ba86-be27dd0cc493','Nguyễn','Hoàng Long','850 Láng, Đống Đa, Hà Nội','0944128834','reyixo6571@em2lab.com','097845456765',NULL,'14-04-2001',_binary '','CUSTOMER',_binary '','longnh9884',NULL),('336fadb1-5951-451c-9a28-6318868930f1','Nguyễn','Đình Hạnh','Tuyên Quang','0978475675','yibed81694@dxice.com','067465764534',NULL,'08-04-2002',_binary '','CUSTOMER',_binary '','hanhnd6172',NULL),('35606122-bd53-4741-b710-3a831b090e62','Nguyễn','Thanh Tuấn','108D7 P. Thành Công, Thành Công, Ba Đình, Hà Nội, Vietnam','0967954534','tuannt374@gmail.com','001392746397',NULL,'02-06-2002',_binary '','DRIVER',_binary '','tuannt1376',10000000),('387544e1-a947-4cf0-a6e1-71f7db528cac','Trương','Mỹ Lan','26 Nguyen Hong Street, Lane 28, Thanh Cong Nam Ward, Dong Da District, Vietnam','0387954358','lantm264@gmail.com','001285748367',NULL,'11-11-2000',_binary '','CUSTOMER',_binary '','lantm2091',NULL),('3d4b3475-fc15-40e2-9edf-f1694097f468','Vũ ','Thanh Vân','Hà Nam','0978675674','jocaseg724@picdv.com','097867564756',NULL,'07-04-2001',_binary '','CUSTOMER',_binary '','vanvt6513',NULL),('3d9fadd7-b0ca-4b5f-a20e-8f02327ead42','Cao','Thanh Hải','8 P. Nguyên Hồng, Thành Công, Ba Đình, Hà Nội, Vietnam','0377954534','haict27@gmail.com','001062646357',NULL,'06-05-1999',_binary '','DRIVER',_binary '','haict2443',10000000),('498ca080-b9a9-4c8f-9207-2d8be9bccf51','Nguyễn ','Thảo Linh','850 Láng, Đống Đa, Hà Nội','0944128834','wavise2706@picdv.com','097845456765',NULL,'15-04-2000',_binary '','DRIVER',_binary '','linhnt9389',2000000),('4fd2fb27-54e3-4062-8800-d2d80c51a368','Nguyễn','Đình Thanh','P. Ô Chợ Dừa, Chợ Dừa, Đống Đa, Hà Nội, Vietnam','0377954534','kivojoh106@acname.com','001082946357',NULL,'12-12-2002',_binary '','DRIVER',_binary '','thanhnd8863',2000000),('507ee842-be1b-4a9d-bfc7-61312fa73e39','Nguyễn','Quang Khải','Giảng Võ, Ba Đình, Hanoi, Vietnam','0378147534','khainq141@gmail.com','001257246397',NULL,'12-12-2000',_binary '','CUSTOMER',_binary '','khainq9829',NULL),('5829ea05-5081-4403-b87b-f702fa92bea1','Nguyễn','Quang Huy','11 P. Láng Hạ, Thành Công, Ba Đình, Hà Nội, Vietnam','0976954534','thanhnd1312@gmail.com','001282746397',NULL,'12-12-2002',_binary '','CUSTOMER',_binary '','huynq0078',NULL),('5f2ccf24-cac8-4d98-9eb2-6b078a4a3365','Vũ','Văn Cường','6a Ng. 9 - Hoàng Cầu, Chợ Dừa, Đống Đa, Hà Nội 100000, Việt Nam','0983629531','cuongvv12@gmail.com','023134151246',NULL,'09-12-1999',_binary '','DRIVER',_binary '','cuongvv1713',11000000),('6cbf4324-33d7-4099-b43c-a5146fd03c9d','Vương','Tùng Lâm','17 ngách 22 Ng. 80 P. Chùa Láng, Láng Thượng, Đống Đa, Hà Nội, Vietnam','0993954534','lamtld234@gmail.com','001064846357',NULL,'15-02-1999',_binary '','CUSTOMER',_binary '','lamvt3538',NULL),('70f21daf-923c-4a97-a778-27612e9da095','Phạm','Tiến Mạnh','183 Dốc viện Phụ Sản, Láng Thượng, Đống Đa, Hà Nội, Vietnam','0974654557','manhtp238@gmail.com','001285378397',NULL,'07-12-1996',_binary '','CUSTOMER',_binary '','manhpt5684',NULL),('8536b11c-3a95-4036-8302-997def51de9d','Bạch','Thái Minh','814 Đ. La Thành, Thành Công, Hoàn Kiếm, Hà Nội, Vietnam','0973954634','btminh1314@gmail.com','001272636359',NULL,'02-02-1996',_binary '','DRIVER',_binary '','minhbt3350',10000000),('8c44d260-d73d-4615-97c8-2dae52b27501','Nguyễn','Trung Hiếu','1020 Đ. La Thành, Láng Thượng, Hoàn Kiếm, Hà Nội, Vietnam','0972354564','hieutn9457@gmail.com','001082947495',NULL,'06-05-1998',_binary '','CUSTOMER',_binary '','hieunt9081',NULL),('9c9b2966-f745-46e2-88a3-f58d4d32bc6c','Đỗ','Ngọc Duy','Láng Thượng, Đống Đa, Hanoi, Vietnam','0957954534','duydn2335@gmail.com','001272648759',NULL,'03-02-1999',_binary '','CUSTOMER',_binary '','duydn4795',NULL),('b9e533a4-ca29-4116-8d6f-3c690154e2a0','Trương','Tuấn Tú','110 P. Thành Công, Thành Công, Ba Đình, Hà Nội, Vietnam','0972953536','tuantu27d@gmail.com','001192747897',NULL,'08-02-1995',_binary '','CUSTOMER',_binary '','tutt8504',NULL),('b9e72561-dbb2-4b95-a3f3-51793b543bd0','Phạm','Văn Hoàng','Ngõ 92 Ngõ 92, Phường Quan Hoa, Quận Cầu Giấy, Thành phố Hà Nội, Việt Nam','0983629888','hoangpv1@gmail.com','023134642442',NULL,'02-11-2000',_binary '','DRIVER',_binary '','hoangpv2877',13000000),('b9ec1d79-81c8-454b-b491-de49ce8a7f9b','Ngô','Mạnh Hùng','Thành Công, Ba Đình, Hanoi, Vietnam','0967954534','manhhung0607@gmail.com','001282446357',NULL,'07-06-2002',_binary '','DRIVER',_binary '','hungnm1761',1000000),('bffe9861-8c48-493e-9fb1-d89f6e2a324c','Nguyễn ','Cao Cường','Quảng Ninh','0978583137','hivawef790@em2lab.com','095475674654',NULL,'16-04-2006',_binary '','DRIVER',_binary '','cuongnc4915',5000000),('cd894289-b349-4dda-ae37-907904ef80dd','Nguyễn','Thấp Cường','850 Láng, Đống Đa, Hà Nội','0944128834','regisaw246@dxice.com','097845456765',NULL,'16-04-2007',_binary '','CUSTOMER',_binary '','cuongnt8027',NULL),('eab40f14-78cb-4f14-bee3-b7ca683e51af','Phạm','Hải Long','183 Dốc viện Phụ Sản, Láng Thượng, Đống Đa, Hà Nội, Vietnam','0983629111','longph1@gmail.com','023134642312',NULL,'12-10-1997',_binary '','DRIVER',_binary '','longph5528',10000000),('f9063f5e-95c3-4d61-bad7-0bc27d170de7','Mai','Thảo Linh','53 Đ. Nguyễn Chí Thanh, Láng Thượng, Đống Đa, Hà Nội, Vietnam','0367954587','mtlinhh564@gmail.com','001186746499',NULL,'12-12-2002',_binary '','CUSTOMER',_binary '','linhmt5161',NULL),('fb988402-d8e6-4763-bac9-cc340506f7a0','Vũ ','Văn Thanh','Quảng Ninh','0978583137','nixaray288@haislot.com','097845675645',NULL,'16-04-2003',_binary '','DRIVER',_binary '','thanhvv5670',10000000),('id-0','Admministrator',NULL,NULL,'0',NULL,'035202001661',NULL,NULL,_binary '','ADMIN',_binary '','admin0',NULL),('id-1','Staff',NULL,NULL,'0',NULL,'035202001661',NULL,NULL,_binary '','STAFF',_binary '','staff0',NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicle_handover_contract`
--

DROP TABLE IF EXISTS `vehicle_handover_contract`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicle_handover_contract` (
  `id` varchar(255) NOT NULL,
  `attach` varchar(255) DEFAULT NULL,
  `contract_number` varchar(255) DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `salary` float DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `driver` varchar(255) DEFAULT NULL,
  `container_truck` varchar(255) DEFAULT NULL,
  `contract_duration` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKt4skmce0l2ytjfla9piflye7v` (`driver`),
  KEY `FK26ri46vq62kma92qgdsld4bf8` (`container_truck`),
  CONSTRAINT `FK26ri46vq62kma92qgdsld4bf8` FOREIGN KEY (`container_truck`) REFERENCES `container_truck` (`truck_id`),
  CONSTRAINT `FKt4skmce0l2ytjfla9piflye7v` FOREIGN KEY (`driver`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicle_handover_contract`
--

LOCK TABLES `vehicle_handover_contract` WRITE;
/*!40000 ALTER TABLE `vehicle_handover_contract` DISABLE KEYS */;
INSERT INTO `vehicle_handover_contract` VALUES ('a24d4c47-706c-41ba-b255-159f7da012c3','handover_contract.docx','90-05/HDBG','2027-04-15','',0,'2024-04-15','3d9fadd7-b0ca-4b5f-a20e-8f02327ead42','0812ee6d-5d4c-410e-ba93-9a22198648bb',NULL);
/*!40000 ALTER TABLE `vehicle_handover_contract` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-04-24 22:26:36
