CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE items (
	item_id  INTEGER AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(50),
	department_name VARCHAR(50),
	price DECIMAL(10, 2),
	stock_quantity INTEGER(10),
	PRIMARY KEY (item_id)
);

SELECT * FROM items;

INSERT INTO items (product_name, department_name, price, stock_quantity)
VALUES ("AA Batteries", "Home", 12.34, 150);

INSERT INTO items (product_name, department_name, price, stock_quantity)
VALUES ("Toothpicks", "Home", 6.99, 400);

INSERT INTO items (product_name, department_name, price, stock_quantity)
VALUES ("Lysol", "Home", 8.40, 225);

INSERT INTO items (product_name, department_name, price, stock_quantity)
VALUES ("Earbuds", "Electronics", 45.00, 90);

INSERT INTO items (product_name, department_name, price, stock_quantity)
VALUES ("Bluetooth Speaker", "Electronics", 29.99, 500);

INSERT INTO items (product_name, department_name, price, stock_quantity)
VALUES ("Echo Dot", "Electronics", 49.99, 1000);

INSERT INTO items (product_name, department_name, price, stock_quantity)
VALUES ("Cards Against Humanity", "Games", 25.00, 150);

INSERT INTO items (product_name, department_name, price, stock_quantity)
VALUES ("Catan", "Games", 34.90, 220);

INSERT INTO items (product_name, department_name, price, stock_quantity)
VALUES ("Jumanji", "Games", 19.78, 40);

INSERT INTO items (product_name, department_name, price, stock_quantity)
VALUES ("Guess Who", "Games", 15.59, 300);