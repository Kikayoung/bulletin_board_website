var mysql = require("mysql");

var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "guro1234",
    database: "myboard"
});

conn.connect((err) => {
    if (err) {
        console.error('MySQL 연결 오류:', err);
    } else {
        console.log('MySQL 연결 성공');
    }
});


conn.query("select * from post",function(err,rows,fields){
    if(err) throw err;
    console.log(rows);
});

conn.query("select * from customer",function(err,rows,fields){
    if(err) throw err;
    console.log(rows);
});

conn.query("select * from product",function(err,rows,fields){
    if(err) throw err;
    console.log(rows);
});

conn.query("select * from orders",function(err,rows,fields){
    if(err) throw err;
    console.log(rows);
});


const express = require('express');
const app = express();

//body-parser라이브러리 추가
const bodyParser = require('body-parser');

const db=require('node-mysql/lib/db');app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine','ejs');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.listen(8080, function() {
    console.log("포트 8080 으로 서버 대기중 ...");
});

app.get('/list', function(req, res) {
    conn.query("SELECT * FROM post", function(err, result) {
        if (err) {
            console.error('쿼리 실행 오류:', err);
            res.status(500).send('데이터 조회 실패');
            return;
        }
        console.log(result);
        res.render('list.ejs', { data: result });
    });
});



app.get('/enter', function(req, res) {
    res.render('enter.ejs');
});



app.post("/delete", function(req, res) {
    console.log(req.body);
    let postId = req.body.id; 

    let sql = "DELETE FROM post WHERE id = ?";
    let params = [postId];

    conn.query(sql, params, function(err, result) {
        if (err) {
            console.error('쿼리 실행 오류:', err);
            res.status(500).send('데이터 삭제 실패');
            return;
        }
        console.log("삭제 완료");
        res.status(200).send();
    });
});


// '/save' 엔드포인트에 대한 POST 요청 처리
app.post('/save1', function(req, res) {
    console.log(req.body.title); 
    console.log(req.body.content); 

    let sql = "INSERT INTO post (title, content, created) VALUES (?, ?, NOW())";
    let params = [req.body.title, req.body.content];

    conn.query(sql, params, function(err, result) {
        if (err) {
            console.error('쿼리 실행 오류:', err);
            res.status(500).send('데이터 추가 실패');
            return;
        }
        console.log("데이터 추가 성공");
        res.send('데이터 추가 성공');
    });
});


app.post('/save2', function(req, res) {
    console.log(req.body.customer_name); 
    console.log(req.body.email); 
    console.log(req.body.phone_number); 
    console.log(req.body.address); 

    const { customer_name, email, phone_number, address } = req.body;

    let sql = "INSERT INTO customer (customer_name, email, phone_number, address) VALUES (?, ?, ?, ?)";
    let params = [customer_name, email, phone_number, address];

    conn.query(sql, params, function(err, result) {
        if (err) {
            console.error('쿼리 실행 오류:', err);
            res.status(500).send('데이터 추가 실패');
            return;
        }
        console.log("데이터 추가 성공");
        res.send('데이터 추가 성공');
    });
});

app.post('/save3', function(req, res) {
    console.log(req.body.product_name); 
    console.log(req.body.price); 
    console.log(req.body.stock); 

    const { product_name, price, stock } = req.body;

    let sql = "INSERT INTO product (product_name, price, stock) VALUES (?, ?, ?)";
    let params = [product_name, price,stock];

    conn.query(sql, params, function(err, result) {
        if (err) {
            console.error('쿼리 실행 오류:', err);
            res.status(500).send('데이터 추가 실패');
            return;
        }
        console.log("데이터 추가 성공");
        res.send('데이터 추가 성공');
    });
});

app.post('/save4', function(req, res) {
    console.log(req.body.customer_id); 
    console.log(req.body.product_id); 
    console.log(req.body.quantity); 
    console.log(req.body.order_date); 

    const { customer_id, product_id, quantity, order_date } = req.body;

    let sql = "INSERT INTO orders (customer_id, product_id, quantity,order_date) VALUES (?, ?, ?,NOW())";
    let params = [customer_id, product_id, quantity, order_date];

    conn.query(sql, params, function(err, result) {
        if (err) {
            console.error('쿼리 실행 오류:', err);
            res.status(500).send('데이터 추가 실패');
            return;
        }
        console.log("데이터 추가 성공");
        res.send('데이터 추가 성공');
    });
});

// app.get('/customer', function(req, res) {
//     conn.query("select * from customer",function(err,rows,fields){
//         if(err) throw err;
//         console.log(rows);
//     });
// });
// app.get('/product', function(req, res) {
//     conn.query("select * from product",function(err,rows,fields){
//         if(err) throw err;
//         console.log(rows);
//     });
// });
// app.get('/orders', function(req, res) {
//     conn.query("select * from orders",function(err,rows,fields){
//         if(err) throw err;
//         console.log(rows);
//     });
// });


// app.get('/book', function(req, res) {
//     res.send('도서 목록 관련 페이지입니다.');
// });

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/profile', function(req, res) {
    res.sendFile(__dirname + '/profile.html');
});

// conn.query("select * from post",function(err,rows,fields){
//     if(err) throw err;
//     console.log(rows);
// });

