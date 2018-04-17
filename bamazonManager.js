var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("console.table");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password and database
    password: "",
    database: "bamazon_db"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    start();
});

function start() {
    // after connection is made, ask the manager what they want to do
    inquirer
        .prompt({
            name: "start",
            type: "list",
            message: "Hello, what would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"]
        })
        .then(function (answer) {
            if (answer.start === "View Products for Sale") {
                showStock();
            }
            if (answer.start === "View Low Inventory") {
                lowInventory();
            }
            if (answer.start === "Add to Inventory") {
                addInventory();
            }
            if (answer.start === "Add New Product") {
                newProduct();
            }
            if (answer.start === "Quit") {
                console.log("Okay, see you next time!");
                connection.end();
            }
        });
}

// * If a manager selects `View Products for Sale`, the app should list every available item: the item IDs, names, prices, and quantities.
function showStock() {
    connection.query("SELECT * FROM items", function (err, res) {
        if (err) throw err;
        console.table(res);
        // Give option to start over or quit
        start();
    });
}

// * If a manager selects `View Low Inventory`, then it should list all items with an inventory count lower than five.
function lowInventory() {
    connection.query("SELECT * FROM items WHERE stock_quantity < 5", function (err, res) {
        if (err) throw err;
        console.table(res);
        // Give option to start over or quit
        start();
    });
}

// * If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.
function addInventory() {
    connection.query("SELECT * FROM items", function (err, res) {
        if (err) throw err;
        console.table(res);
        inquirer
            .prompt([
                {
                    name: "id",
                    type: "input",
                    message: "Please type the ID of the item you would like to restock."
                },
                {
                    name: "additional",
                    type: "input",
                    message: "How many of this item would you like to add?"
                }])
            .then(function (answer) {
                var newSum = parseInt(answer.additional) + parseInt(res[answer.id - 1].stock_quantity);
                connection.query("UPDATE items SET ? WHERE ?",
                    [
                        {
                            stock_quantity: newSum
                        },
                        {
                            item_id: answer.id
                        }
                    ],
                    function (error) {
                        if (error) throw err;
                        console.log("Inventory has been updated!");
                        start();
                    }
                );
            });
    });
}

// * If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.
function newProduct() {
    inquirer
        .prompt([
            {
                name: "prodName",
                type: "input",
                message: "Name of new item: "
            },
            {
                name: "deptName",
                type: "input",
                message: "Department of new item: "
            },
            {
                name: "price",
                type: "input",
                message: "Price of new item: "
            },
            {
                name: "stockQuant",
                type: "input",
                message: "Stock quantity of new item: "
            }])
        .then(function (answer) {
            connection.query("INSERT INTO items SET ?",
                {
                    product_name: answer.prodName,
                    department_name: answer.deptName,
                    price: answer.price,
                    stock_quantity: answer.stockQuant
                },
                function (error) {
                    if (error) throw err;
                    console.log("New item added!");
                    start();
                }
            );
        });
}
