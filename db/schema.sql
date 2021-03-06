DROP DATABASE IF EXISTS employee_trackerDB;
CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;

CREATE TABLE department (
	id INT UNSIGNED NOT NULL AUTO_INCREMENT ,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE role (
	id INT UNSIGNED NOT NULL AUTO_INCREMENT ,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10,4) NOT NULL,
    department_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE employee (
	id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT UNSIGNED NOT NULL,
    manager_id INT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES role(id)
);