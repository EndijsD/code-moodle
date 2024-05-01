-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `db` ;

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `db` DEFAULT CHARACTER SET utf8 ;
USE `db` ;

-- -----------------------------------------------------
-- Table `db`.`skolas`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db`.`skolas` ;

CREATE TABLE IF NOT EXISTS `db`.`skolas` (
  `skolas_id` INT NOT NULL AUTO_INCREMENT,
  `nosaukums` VARCHAR(100) NOT NULL,
  `tips` ENUM("Augstskola", "Vidusskola", "Tehnikums", "Pamatskola") NOT NULL,
  PRIMARY KEY (`skolas_id`),
  UNIQUE INDEX `skolas_id_UNIQUE` (`skolas_id` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `db`.`students`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db`.`students` ;

CREATE TABLE IF NOT EXISTS `db`.`students` (
  `students_id` INT NOT NULL AUTO_INCREMENT,
  `vards` VARCHAR(45) NOT NULL,
  `uzvards` VARCHAR(45) NOT NULL,
  `klase` VARCHAR(45) NOT NULL,
  `epasts` VARCHAR(100) NOT NULL,
  `parole` VARCHAR(256) NOT NULL,
  `skolas_id` INT NOT NULL,
  PRIMARY KEY (`students_id`, `skolas_id`),
  UNIQUE INDEX `students_id_UNIQUE` (`students_id` ASC),
  UNIQUE INDEX `epasts_UNIQUE` (`epasts` ASC),
  INDEX `fk_students_skolas1_idx` (`skolas_id` ASC),
  CONSTRAINT `fk_students_skolas1`
    FOREIGN KEY (`skolas_id`)
    REFERENCES `db`.`skolas` (`skolas_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `db`.`skolotajs`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db`.`skolotajs` ;

CREATE TABLE IF NOT EXISTS `db`.`skolotajs` (
  `skolotajs_id` INT NOT NULL AUTO_INCREMENT,
  `vards` VARCHAR(45) NOT NULL,
  `uzvards` VARCHAR(45) NOT NULL,
  `epasts` VARCHAR(100) NOT NULL,
  `parole` VARCHAR(256) NOT NULL,
  PRIMARY KEY (`skolotajs_id`),
  UNIQUE INDEX `skolotajs_id_UNIQUE` (`skolotajs_id` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `db`.`moduli`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db`.`moduli` ;

CREATE TABLE IF NOT EXISTS `db`.`moduli` (
  `moduli_id` INT NOT NULL AUTO_INCREMENT,
  `nosaukums` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`moduli_id`),
  UNIQUE INDEX `moduli_id_UNIQUE` (`moduli_id` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `db`.`uzdevumi`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db`.`uzdevumi` ;

CREATE TABLE IF NOT EXISTS `db`.`uzdevumi` (
  `uzdevumi_id` INT NOT NULL AUTO_INCREMENT,
  `tema` VARCHAR(100) NOT NULL,
  `nosaukums` VARCHAR(100) NOT NULL,
  `apraksts` TEXT NOT NULL,
  PRIMARY KEY (`uzdevumi_id`),
  UNIQUE INDEX `uzdevumi_id_UNIQUE` (`uzdevumi_id` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `db`.`moduli_uzdevumi`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db`.`moduli_uzdevumi` ;

CREATE TABLE IF NOT EXISTS `db`.`moduli_uzdevumi` (
  `moduli_id` INT NOT NULL,
  `uzdevumi_id` INT NOT NULL,
  PRIMARY KEY (`moduli_id`, `uzdevumi_id`),
  INDEX `fk_moduli_has_uzdevumi_uzdevumi1_idx` (`uzdevumi_id` ASC),
  INDEX `fk_moduli_has_uzdevumi_moduli_idx` (`moduli_id` ASC),
  CONSTRAINT `fk_moduli_has_uzdevumi_moduli`
    FOREIGN KEY (`moduli_id`)
    REFERENCES `db`.`moduli` (`moduli_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_moduli_has_uzdevumi_uzdevumi1`
    FOREIGN KEY (`uzdevumi_id`)
    REFERENCES `db`.`uzdevumi` (`uzdevumi_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `db`.`atteli`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db`.`atteli` ;

CREATE TABLE IF NOT EXISTS `db`.`atteli` (
  `atteli_id` INT NOT NULL AUTO_INCREMENT,
  `adrese` VARCHAR(100) NOT NULL,
  `uzdevumi_id` INT NOT NULL,
  PRIMARY KEY (`atteli_id`, `uzdevumi_id`),
  UNIQUE INDEX `atteli_id_UNIQUE` (`atteli_id` ASC),
  INDEX `fk_atteli_uzdevumi1_idx` (`uzdevumi_id` ASC),
  CONSTRAINT `fk_atteli_uzdevumi1`
    FOREIGN KEY (`uzdevumi_id`)
    REFERENCES `db`.`uzdevumi` (`uzdevumi_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `db`.`skolotajs_moduli`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db`.`skolotajs_moduli` ;

CREATE TABLE IF NOT EXISTS `db`.`skolotajs_moduli` (
  `skolotajs_id` INT NOT NULL,
  `moduli_id` INT NOT NULL,
  PRIMARY KEY (`skolotajs_id`, `moduli_id`),
  INDEX `fk_skolotajs_has_moduli_moduli1_idx` (`moduli_id` ASC),
  INDEX `fk_skolotajs_has_moduli_skolotajs1_idx` (`skolotajs_id` ASC),
  CONSTRAINT `fk_skolotajs_has_moduli_skolotajs1`
    FOREIGN KEY (`skolotajs_id`)
    REFERENCES `db`.`skolotajs` (`skolotajs_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_skolotajs_has_moduli_moduli1`
    FOREIGN KEY (`moduli_id`)
    REFERENCES `db`.`moduli` (`moduli_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `db`.`moduli_students`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db`.`moduli_students` ;

CREATE TABLE IF NOT EXISTS `db`.`moduli_students` (
  `moduli_id` INT NOT NULL,
  `students_id` INT NOT NULL,
  PRIMARY KEY (`moduli_id`, `students_id`),
  INDEX `fk_moduli_has_students_students1_idx` (`students_id` ASC),
  INDEX `fk_moduli_has_students_moduli1_idx` (`moduli_id` ASC),
  CONSTRAINT `fk_moduli_has_students_moduli1`
    FOREIGN KEY (`moduli_id`)
    REFERENCES `db`.`moduli` (`moduli_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_moduli_has_students_students1`
    FOREIGN KEY (`students_id`)
    REFERENCES `db`.`students` (`students_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `db`.`iesniegumi`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db`.`iesniegumi` ;

CREATE TABLE IF NOT EXISTS `db`.`iesniegumi` (
  `iesniegumi_id` INT NOT NULL AUTO_INCREMENT,
  `punkti` FLOAT NOT NULL,
  `datums` DATETIME NOT NULL,
  `atbilde` TEXT NOT NULL,
  `uzdevumi_id` INT NOT NULL,
  `piebilde` TEXT NOT NULL,
  `skolotajs_id` INT NOT NULL,
  `students_id` INT NOT NULL,
  PRIMARY KEY (`iesniegumi_id`, `uzdevumi_id`, `skolotajs_id`, `students_id`),
  UNIQUE INDEX `rezultati_id_UNIQUE` (`iesniegumi_id` ASC),
  INDEX `fk_rezultati_uzdevumi1_idx` (`uzdevumi_id` ASC),
  INDEX `fk_iesniegumi_skolotajs1_idx` (`skolotajs_id` ASC),
  INDEX `fk_iesniegumi_students1_idx` (`students_id` ASC),
  CONSTRAINT `fk_rezultati_uzdevumi1`
    FOREIGN KEY (`uzdevumi_id`)
    REFERENCES `db`.`uzdevumi` (`uzdevumi_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_iesniegumi_skolotajs1`
    FOREIGN KEY (`skolotajs_id`)
    REFERENCES `db`.`skolotajs` (`skolotajs_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_iesniegumi_students1`
    FOREIGN KEY (`students_id`)
    REFERENCES `db`.`students` (`students_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `db`.`komentari`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db`.`komentari` ;

CREATE TABLE IF NOT EXISTS `db`.`komentari` (
  `komentari_id` INT NOT NULL AUTO_INCREMENT,
  `komentars` VARCHAR(45) NOT NULL,
  `ir_students` TINYINT NOT NULL,
  `datums` DATETIME NOT NULL,
  `iesniegumi_id` INT NOT NULL,
  PRIMARY KEY (`komentari_id`, `iesniegumi_id`),
  INDEX `fk_komentari_iesniegumi1_idx` (`iesniegumi_id` ASC),
  UNIQUE INDEX `komentari_id_UNIQUE` (`komentari_id` ASC),
  CONSTRAINT `fk_komentari_iesniegumi1`
    FOREIGN KEY (`iesniegumi_id`)
    REFERENCES `db`.`iesniegumi` (`iesniegumi_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Data for table `db`.`skolas`
-- -----------------------------------------------------
START TRANSACTION;
USE `db`;
INSERT INTO `db`.`skolas` (`skolas_id`, `nosaukums`, `tips`) VALUES (DEFAULT, 'Krotes Kronvalda Ata pamatskola', 'Pamatskola');
INSERT INTO `db`.`skolas` (`skolas_id`, `nosaukums`, `tips`) VALUES (DEFAULT, 'Liepājas Valsts Tehnikums', 'Tehnikums');
INSERT INTO `db`.`skolas` (`skolas_id`, `nosaukums`, `tips`) VALUES (DEFAULT, 'RTU Liepāja', 'Augstskola');
INSERT INTO `db`.`skolas` (`skolas_id`, `nosaukums`, `tips`) VALUES (DEFAULT, 'Liepājas Jāņa Čakstes vidusskola', 'Vidusskola');

COMMIT;


-- -----------------------------------------------------
-- Data for table `db`.`students`
-- -----------------------------------------------------
START TRANSACTION;
USE `db`;
INSERT INTO `db`.`students` (`students_id`, `vards`, `uzvards`, `klase`, `epasts`, `parole`, `skolas_id`) VALUES (DEFAULT, 'Kārlis', 'Lācītis', '1.kurss', 'lacitis18@inbox.lv', '$2b$10$ZpyuZ.lBh0rSpHhcORhOGOtLrW0Rcl3TXFDW3n06IbiUiYr86AIpy', 3);

COMMIT;


-- -----------------------------------------------------
-- Data for table `db`.`skolotajs`
-- -----------------------------------------------------
START TRANSACTION;
USE `db`;
INSERT INTO `db`.`skolotajs` (`skolotajs_id`, `vards`, `uzvards`, `epasts`, `parole`) VALUES (DEFAULT, 'Tests', 'Testētājs', 'lacitiskarlis@gmail.com', '$2b$10$ZpyuZ.lBh0rSpHhcORhOGOtLrW0Rcl3TXFDW3n06IbiUiYr86AIpy');

COMMIT;

