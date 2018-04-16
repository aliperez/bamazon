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
  // after connection is made, show the user what's in stock
  showStock();
});

// Shows user what's in stock
function showStock() {
  connection.query("SELECT * FROM items", function (err, res) {
    if (err) throw err;
    // Show user available products to purchase
    console.table(res);
    // Ask user which item they are interested in purchasing
    whichItem();
  });
}

// ask user which item they want to purchase
function whichItem() {
  inquirer
    .prompt({
      name: "itemToBuy",
      type: "input",
      message: "Hello, welcome to Bamazon!  Please type the ID of the item you would like to purchase."
    })
    .then(function (answer) {
      // ask the user how many units they would like to buy
      howMany(answer.itemToBuy);
    });
}

// ask user quantity of items to buy
function howMany(itemIdentification) {
  // first make a query in order to get stock quantity information in the .then function below
  connection.query("SELECT * FROM items", function (err, res) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "quantity",
          type: "input",
          message: "How many units of item #" + itemIdentification + " do you need?"
        }
      ])
      .then(function (answer) {
        // check to make sure quantity requested by customer < quantity in stock
        if (answer.quantity < res[itemIdentification - 1].stock_quantity) {
          // math for new stock quantity (use -1 bc id = index + 1)
          var origQuant = res[itemIdentification - 1].stock_quantity;
          var newQuant = origQuant - answer.quantity;
          var orderCost = answer.quantity * res[itemIdentification - 1].price;
          // update the number of items remaining in stock
          connection.query(
            "UPDATE items SET ? WHERE ?",
            [
              {
                stock_quantity: newQuant
              },
              {
                item_id: itemIdentification
              }
            ],
            function (err) {
              if (err) throw err;
              console.log("You order has been placed!  Your credit card has been charged $" + orderCost + ".  Please check your email to track your package.");
              // re-prompt the user to see if they want to complete another purchase
              inquirer
                .prompt({
                  name: "goAgain",
                  type: "list",
                  message: "Would you like to continue shopping?",
                  choices: ["Yes", "No"]
                })
                .then(function (answer) {
                  if (answer.goAgain === "Yes") {
                    showStock();
                  }
                  else {
                    console.log("Okay, see you next time!");
                    connection.end();
                  }
                });
            }
          );
        }
        else {
          console.log("Insufficient quantity, sorry!");
          connection.end();
        }
      });
  });
};