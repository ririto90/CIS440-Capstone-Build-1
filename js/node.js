const mysql = require('mysql');
const http = require('http');
const fs = require('fs');
let events = require('events');

const PORT = 8080;



let usedNumbers = new Set();
let orderNumber = 1000

let searchSpeciality
let searchMilkTea
let searchBrewedTea
let searchFruitTea
let searchToppings
let searchIceLevel
let searchSugarLevel
let searchArrivalTime
let searchSubtotal
let searchTax
let searchTotal

let eventEmitter = new events.EventEmitter();
// eventEmitter.on('processingFinished', processingFinishedHandler);

let httpServer = http.createServer(processServerRequest);
httpServer.listen(PORT, function () {
  console.log(`Server is listening on port ${PORT}`);
});

function processServerRequest(request, response) {

  let base = 'http://' + request.headers['host']
  let url = new URL(request.url, base)

  response.writeHead(200, {
    'Content-Type': 'text/html'
  });
  

  // generateUniqueSixDigitNumber()

  searchSpeciality = url.searchParams.get('craftiSpecialty')
  searchMilkTea = url.searchParams.get('classicMilkTea')
  searchBrewedTea = url.searchParams.get('freshlyBrewedTea')
  searchFruitTea = url.searchParams.get('refreshingFruitTea')
  searchToppings = url.searchParams.getAll('toppings')
  searchIceLevel = url.searchParams.get('iceLevel')
  searchSugarLevel = url.searchParams.get('sugarLevel')
  searchArrivalTime = url.searchParams.get('time')
  searchSubtotal = url.searchParams.get('subtotal')
  searchTax = url.searchParams.get('tax')
  searchTotal = url.searchParams.get('total')
  console.log(`${searchSpeciality}`)

  const pairs = [
    { value: searchSpeciality, label: 'Speciality:' },
    { value: searchMilkTea, label: 'Milk Tea:' },
    { value: searchBrewedTea, label: 'Brewed Tea:' },
    { value: searchFruitTea, label: 'Fruit Tea:' },
    { value: searchToppings, label: 'Toppings:' },
    { value: searchIceLevel, label: 'Ice Level:' },
    { value: searchSugarLevel, label: 'Sugar Level:' },
    { value: searchArrivalTime, label: 'Arrival Time:' },
    { value: searchSubtotal, label: 'Subtotal:' },
    { value: searchTax, label: 'Tax:' },
    { value: searchTotal, label: 'Total:' }
  ];

  let values = [searchSpeciality, searchMilkTea, searchBrewedTea, searchFruitTea, searchToppings, searchIceLevel, searchSugarLevel, searchArrivalTime, searchSubtotal, searchTax, searchTotal].filter(Boolean);

  let html = '';
  
  for (const pair of pairs) {
    if (pair.value !== null) {
      html += `<strong>${pair.label}</strong> ${pair.value}<br>`;
    }
  }

  orderDetails = `<head>
                  <title>Order</title>
                  <link href="../css/index.css" rel="stylesheet" type="text/css" />
                  </head>
                  <style>
                  #box {
                      display: block;
                      text-align: center;
                      padding: 15px;
                      margin: 20px auto;
                      border: black 2px solid;
                      background-color: #FFE8C9;
                      width: 30%;
                      text-align: center;
                  }
                  button {
                      border: 2px solid black;
                      background-color: white;
                      color: black;
                      padding: 14px 28px;
                      font-size: 16px;
                      cursor: pointer;
                      text-align: center;
                      }
                  .orange {
                      border-color: #ff9800;
                      color: orange;
                  }
                  .orange:hover {
                      background: #ff9800;
                      color: white;
                      }
                </style>

                <body>
                  
                  <div id="box">
                      <h1>Your order has been placed!</h1>
                      <p class="order">${html}</p> 
                  </div>

                </body>`

  response.write(orderDetails)
  response.end()

  initializeDB()

}

function initializeDB() {

  const string = `INSERT INTO customer_orders (order_number, crafti_specialty, classic_milk_tea, freshly_brewed_tea, refreshing_fruit_tea, toppings, ice_level, sugar_level, arrival_time, subtotal, tax, total_amount) VALUES (${orderNumber}, ${searchSpeciality}, ${searchMilkTea}, ${searchBrewedTea}, ${searchFruitTea}, ${searchToppings}, ${searchIceLevel}, ${searchSugarLevel}, ${searchArrivalTime}, ${searchSubtotal}, ${searchTax}, ${searchTotal});`

  const con = mysql.createConnection({
    host: '107.180.1.16',
    port: 3306,
    database: 'sprc2023team2',
    user: 'sprc2023team2',
    password: 'sprc2023team2',
  });

  con.connect((err) => {
    if (err) {
      console.log('Error connecting to Db');
      return;
    }
    console.log('Connection established');
    con.query(string)
    con.end((err) => {});
  });

  

  

}