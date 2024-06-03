var mysql = require("mysql");

// var conn = mysql.createConnection({
//     host: "210.117.212.134",
//     user: "guro",
//     password: "1234",
//     database: "test",
//     dateStrings: 'date'
// });


var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "myboard",
    dateStrings: 'date'
});

conn.connect((err) => {
    if (err) {
        console.error('MySQL 연결 오류:', err);
    } else {
        console.log('MySQL 연결 성공');
    }
});


// conn.query("select * from post",function(err,rows,fields){
//     if(err) throw err;
//     console.log(rows);
// });

// conn.query("select * from customer",function(err,rows,fields){
//     if(err) throw err;
//     console.log(rows);
// });

// conn.query("select * from product",function(err,rows,fields){
//     if(err) throw err;
//     console.log(rows);
// });

// conn.query("select * from orders",function(err,rows,fields){
//     if(err) throw err;
//     console.log(rows);
// });


const express = require('express');
const app = express();
const sha=require('sha256');

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

// app.get('/content/:id', function(req, res) {
//     conn.query('SELECT * FROM post WHERE id = ?', function(err, result) {
//         if (err) {
//             console.error('쿼리 실행 오류:', err);
//             res.status(500).send('데이터 조회 실패');
//             return;
//         }
//         console.log(result);
//         res.render('content.ejs', { data: result });
//     });
// });


app.get("/content/:id",function(req,res){
    console.log(req.params.id);
    let sql="select * from post where id=?";
    let params=req.params.id;
    conn.query(sql,params,function(err,result){
      if(err) throw err;
      console.log(result);
      res.render("content.ejs",{data : result});
    });
    
  })



app.get('/enter',function(req,res){
    res.render('enter.ejs')
  });
  
  app.get('/enterpage',function(req,res){
    res.sendFile(__dirname+'enter.ejs')
  });
  
  

app.get("/edit/:id",function(req,res){
    let sql="select * from post where id=?";
    let params=req.params.id;
    conn.query(sql,params,function(err,result){
      if(err) throw err;
      console.log(result);
      res.render("edit.ejs",{data : result});
    });
  })
  
  app.post("/edit",function(req,res){
    let sql="update post set title=?, content=?, created=? where id=?";
    let params=[req.body.title, req.body.content, req.body.someDate, req.body.id];
    conn.query(sql,params,function(err,result){
      if(err) throw err;
      console.log(result);
      res.redirect("/list");
    });
  })

// app.get('/content', function(req, res) {
//     res.render('content.ejs');
// });

// app.get('/content/:1', function(req, res) {
//     console.loh(req,params.id)
//     req.params.id = new ObjId(req.params.id);
//     mysql
//     res.render('content.ejs');
// });

// app.get('/content/:id', (req, res) =>{
//     const contentId = req.params.id;

//     const query = 'SELECT * FROM contents WHERE id = ?';
//     connection.query(query, [contentId], (err, results) => {
//     });
// });

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
        res.redirect("/list");
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

// app.get('/', function(req, res) {
//     res.render('index.ejs')
// });
app.get('/', function(req, res) {
    res.render('index', { user: req.user });
});

app.get('/profile', function(req, res) {
    //res.sendFile(__dirname + '/profile.ejs');
    res.render('/profile.ejs')
});

// conn.query("select * from post",function(err,rows,fields){
//     if(err) throw err;
//     console.log(rows);
// });



app.use(express.static('public'));


//쿠키쿠키
let cookieParser = require('cookie-parser');


app.use(cookieParser('ncvka0e398423kpfd'));
// app.get('/cookie',function(req,res){
//     let milk=parseInt(req.signedCookies.milk)+1000;
//     if(isNaN(milk)){
//         milk=0;
//     }
//     res.cookie('milk',milk, {signed:true});
//     res.send('product: '+milk+'원');
// });

let session = require('express-session');


app.use(session({
    secret: 'dkufe8938493j4e08349u',
    resave: false,
    saveUninitialized: true
}));

// app.get('/session', function(req, res) {
//     if (isNaN(req.session.milk)) {
//         req.session.milk = 0;
//     }
//     req.session.milk = req.session.milk + 1000;
//     res.send('session: ' + req.session.milk + '원');
// });

// app.post("/login",function(req,res){
//     console.log("아이디 : "+req.body.userid);
//     console.log("비밀번호 : "+req.body.userpw);
//     res.send("로그인 되었습니다.");
// });

// app.get("/login",function(req,res){
//     console.log(req.session);
//     if(req.session.user){
//         console.log("세션 유지");
//         res.send('로그인 되었습니다.');
//     }else{
//         res.render("login.ejs");

//     }
// });

app.get("/index", function(req, res) {
    res.render("index.ejs", { user: req.session.user });
});


app.get("/login",function(req,res){
    console.log(req.session);
    if(req.session.user){
        console.log("세션 유지");
        res.render('index.ejs',{user:req.session.user});
    }else{
        res.render("login.ejs"); 
    }
});

app.post('/login', (req, res) => {
    console.log("아이디 : "+req.body.userid);
    console.log("비밀번호 : "+req.body.userpw);

    const userid = req.body.userid;
    const userpw = req.body.userpw;

    if (userid && userpw) {
        let sql = "SELECT * FROM account WHERE userid = ? AND userpw = ?";
        conn.query(sql, [userid, userpw], (err, results, fields) => {
            if (err) {
                res.send('데이터베이스 오류 발생: ' + err.message);
                return;
            }

            if (results.length > 0) {
                req.session.loggedin = true;
                req.session.userid = userid;
                req.session.user = results[0];
                console.log("새로운 로그인");
                res.render("index.ejs",{user:req.session.user}); 
            } else {
                res.render('login.ejs');
            }
        });
    } else {
        res.send('아이디와 비밀번호를 입력하세요!');
    }
});


app.get("/logout", function(req, res) {
    console.log('로그아웃');
    req.session.destroy();
    res.redirect("/index");
});


app.get("/signup",function(req,res){
    res.render("signup.ejs");
});


app.post('/signup', (req, res) => {
    console.log(req.body.userid); 
    console.log(sha(req.body.userpw)); 
    console.log(req.body.usergroup); 
    console.log(req.body.useremail); 
    const { userid, userpw, usergroup, useremail } = req.body;

    if (userid && userpw && usergroup && useremail) {
        let sql = "INSERT INTO account (userid, userpw, usergroup, useremail) VALUES (?, ?, ?, ?)";
        conn.query(sql, [userid, userpw, usergroup, useremail], (err, results, fields) => {
            if (err) {
                res.send('회원가입 중 오류가 발생했습니다: ' + err.message);
                return;
            }
            //res.send('회원가입이 완료되었습니다.');
            res.redirect('/');
        });
    } else {
        res.send('모든 항목를 입력하세요!');
    }
});
