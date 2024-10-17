const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 5000

var mysql = require('mysql')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE"
  );
  next();

});

var con = mysql.createConnection({
  host: "korawit.ddns.net",
  user: "webapp",
  password: "secret2024",
  port: "3307",
  database: "shop"
});

con.connect(function (err) {
  if (err) throw err;
});

app.use(express.json())
app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/api/products', function (req, res) {
  con.query("SELECT * FROM products", function (err, result, fields) {
    if (err) throw res.status(400).send('Not found any products');
    console.log(result);
    res.send(result);
  });
});
app.delete('/api/delproduct/:id', (req, res) => {
  const id = res.params.id;
  con.query('DELETE FROM products where id=${id}' + id, function (err, result, fields) {
    if (err) throw err;
    con.query("SELECT * FROM products", function (err, result, fields) {
      if (err) throw res.status(400).send('Not found any products');
      console.log(result);
      res.send({products:result,status:"ok"});
    });
  });
})
app.get('/api/products/:id', function (req, res) {
  const id = req.params.id;
  con.query("SELECT *FROM products where id=" + id, function (err, result, fields) {
    if (err) throw err;
    let products = result;
    if (products.length > 0) {
      res.send(products);
    }
    else {
      res.status(400).send('Not found products for' + id);
    }
    console.log(result);
  });

});
// app.put('/api/updateProducts/:id', (req, res) => {
//   const id = req.params.id;
//   const name = req.body.name;
//   const price = req.body.price;
//   console.log("data from frontend", id, name, price);
 
//   var sql = 'UPDATE products SET name = ?, price = ? WHERE id = ?';
//   con.query(sql, [name, price, id], (err, results) => {
//       if (err) {
//           return res.status(400).send('Error: Cannot update product');
//       }
 
//       var get = 'SELECT * FROM products';
//       con.query(get, (err, result) => {
//           if (err) {
//               return res.status(400).send("Error: Cannot get data");
//           }
//           console.log(result);
//           res.send(result);
//       });
//   });
// });

app.post('/api/addproduct', (req, res) => {
  const name = req.body.name;
  const price = req.body.price;
  const img = req.body.img;
  console.log(name, price, img)
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
