# Read Me First
The following was discovered as part of building this project:

* The original package name 'com.inventory.inventory-backend' is invalid and this project uses 'com.inventory.inventory_backend' instead.

Demostration Link:https://drive.google.com/drive/folders/1XS4B2M-5fQg9WlVW_7JNiv2Kp2fuYeGI?usp=sharing


Inventory Management System

This is a Inventory Management System developed using Spring Boot for backend and HTML, CSS, JavaScript for frontend.
The system supports role-based login for Admin and Employee users.

🛠 Technologies Used

Backend

Java

Spring Boot

Spring Data JPA

MySQL (XAMPP)

Frontend

HTML

CSS

JavaScript

📁 Project Structure

Backend code is written in Spring Boot

Frontend files are placed inside
src/main/resources/static

Database is managed using MySQL

🔐 Features

User Registration

User Login

Role-based access (Admin / Employee)

OTP-based password reset

Session handling using browser localStorage

👥 User Roles

Admin: Can access Admin Dashboard

Employee: Can access Employee Dashboard

🗄️ Database Details

Database Name: inven_db

Table: users

Database used: MySQL (via XAMPP)

▶️ How to Run the Project

Start MySQL using XAMPP

Run Spring Boot application

Run InventoryBackendApplication.java

OR use terminal:

mvn spring-boot:run


Open browser and go to:

http://localhost:8080/login.html

🔒 Security Note

This project uses localStorage for session handling.
It is designed for learning and internship purposes, not for production use.

👨‍👩‍👦 Team Project

This project is developed as a team project, where:

Backend is handled using Spring Boot

Frontend is handled using HTML, CSS, and JavaScript

Code is shared via GitHub for collaboration

📌 Purpose

Academic project

Internship submission

Learning Spring Boot and REST APIs

Team collaboration using GitHub

✅ END--


# Getting Started

### Reference Documentation
For further reference, please consider the following sections:

* [Official Apache Maven documentation](https://maven.apache.org/guides/index.html)
* [Spring Boot Maven Plugin Reference Guide](https://docs.spring.io/spring-boot/3.5.9/maven-plugin)
* [Create an OCI image](https://docs.spring.io/spring-boot/3.5.9/maven-plugin/build-image.html)
* [Spring Web](https://docs.spring.io/spring-boot/3.5.9/reference/web/servlet.html)
* [Spring Data JPA](https://docs.spring.io/spring-boot/3.5.9/reference/data/sql.html#data.sql.jpa-and-spring-data)

### Guides
The following guides illustrate how to use some features concretely:

* [Building a RESTful Web Service](https://spring.io/guides/gs/rest-service/)
* [Serving Web Content with Spring MVC](https://spring.io/guides/gs/serving-web-content/)
* [Building REST services with Spring](https://spring.io/guides/tutorials/rest/)
* [Accessing Data with JPA](https://spring.io/guides/gs/accessing-data-jpa/)
* [Accessing data with MySQL](https://spring.io/guides/gs/accessing-data-mysql/)

### Maven Parent overrides

Due to Maven's design, elements are inherited from the parent POM to the project POM.
While most of the inheritance is fine, it also inherits unwanted elements like `<license>` and `<developers>` from the parent.
To prevent this, the project POM contains empty overrides for these elements.
If you manually switch to a different parent and actually want the inheritance, you need to remove those overrides.

