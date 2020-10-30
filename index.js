/*
@Kukkui Sertis-Backend-Software-Engineer-Team-Lab for Backend Blog RestAPI CRUD Services Test
|COMPLETED TASK LISTS...
|(1) #Done: Implement a basic user authentication.
|(2) #Done: Add new cards with the following properties: name, status, content,category and author.
|(3) #Done: Edit a card's name, status, content, and category for owner only.
|(4) #Done: Delete cards that belongs to each owner only.
*/


const express = require('express');
var session = require('express-session')
const mysql = require('mysql')
var generator = require('generate-password');
var tempResult;
const app = express();

app.use(express.json());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))
var sertis_cards = [];
var con = mysql.createConnection({
  host: "127.0.0.1",
  user: "kukkui",
  password: "kukkui",
  database: "kukkui"
});
con.connect();
//*************DEFAULT INDEX WITH SESSION,DB,TABLE CREATE*****//////////////////
app.get('/', (req, res) => {
  let sess = req.session
  sess.username = "No session set for username"
  sess.password = "No session set for password"
  sess.allposts = "No session set for all posts mock"
  
  
  console.log("Connected!");
  con.query("CREATE DATABASE IF NOT EXISTS kukkui", function (err, result) {
    if (err) throw err;
    console.log("Database created");
  })
      console.log("Connected!");
      var sql = "CREATE TABLE IF NOT EXISTS accounts (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), address VARCHAR(255))";
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table ACCOUNTS created( IF NOT EXISTS )");
      });

      console.log("Connected!");
      var sql = "CREATE TABLE IF NOT EXISTS blogposts (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255),content LONGTEXT,cardName VARCHAR(255),cardStatus VARCHAR(255),cardContent LONGTEXT,cardCategory VARCHAR(255))";
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table BLOGPOSTS created ( IF NOT EXISTS )");
      });
    
    //(username,content,cardName,cardStatus,cardContent,cardCategory
  res.send('Hello Sertis.Corp! My name is Punyawee Pos(KUKKUI)\nTo test a backend service here...\n----------------\nSteps...\n1)Start XAMPP as a localhost\n2)GET localhost:5000 // {} \n3)POST localhost:5000/auth  // {username,password} \n4)GET localhost:5000/session // {}\n5)POST localhost:5000/api/allPost // {}\n6)POST localhost:5000/api/myPost // {}\n7)POST localhost:5000/api/addPost // {content,cardName,cardstatus,cardContent,cardCategory}\n8)PUT localhost:5000/api/editPost/[id] // {content,cardName,cardstatus,cardContent,cardCategory}\n9)DELTE localhost:5000/api/deletePost/[id] // {}\n----------------\n API Lists...\n-> GET localhost:5000/ \n-> GET localhost:5000/session\n-> POST localhost:5000/auth\n-> POST localhost:5000/api/myPost\n-> POST localhost:5000/api/allPost \n-> PUT localhost:5000/api/editPost/[id] \n-> DELTE localhost:5000/api/deletePost/[id]');
})

//GET localhost:5000 // {}
//POST localhost:5000/auth  // {username,password}
//GET localhost:5000/session // {}
//POST localhost:5000/api/allPost // {}
//POST localhost:5000/api/myPost // {}
//POST localhost:5000/api/addPost // {content,cardName,cardstatus,cardContent,cardCategory}
//PUT localhost:5000/api/editPost/[id] // {content,cardName,cardstatus,cardContent,cardCategory}
//DELTE localhost:5000/api/deletePost/[id] // {}
//*************GET SESSION CHECKED****************************//////////////////
app.get('/session', (req, res) => {
  let sess = req.session
  console.log(sess)
  res.status(200).send(sess)
})

//*************CHECK ACCOUNT**********************************//////////////////
app.post('/auth', (req, res) => {
    const new_card = {
        id: sertis_cards.length + 1,
        username: req.body.username,
        password: req.body.password
        // content: req.body.content,
        // author: req.body.author
    };
    sertis_cards.push(new_card);
    var password = generator.generate({
        length: 10,
        numbers: true
    });
     
    var account = new_card.username;
    var password = new_card.password;
    //
    //Now...
    //set session for one time body request
    //
    let sess = req.session
    sess.username = account
    sess.password = password
    
        con.query("SELECT * FROM accounts WHERE username = '"+ account +"'", function(err, result, field){
          if(result.length === 0){
            var genPassword = generator.generate({
              length: 10,
              numbers: true
            });
            var sql = "INSERT INTO accounts (username, password) VALUES ('"+account+"', '"+genPassword+"')";
            con.query(sql, function (err, result) {
                if (err) throw err;
                res.send("New account name: "+account+" // With password: "+genPassword);
                })
            }
            else{
                const querystring="SELECT * FROM accounts WHERE username ='"+account+"' AND password='"+password+"'";
                con.query(querystring, function (err, result, fields) {
                  if(result.length === 0){
                    console.log("Wrong Password For Username : " + account);
                    res.send("Wrong Password For Username : " + account) // Please login with your password that we assigned to you at the first time.")
                  }
                  else{if (err) throw err;
                    var data = JSON.stringify(result[0].username)
                    console.log("Record Exist, Name: " + data);
                    res.send("Correct Password For Username : " + account +"\n---------\n Now, to view the list of all blogs...\n #Visit the URL:localhost:3000/allBlogs \n without any body requests required\n---------\nTo view only your blog posts...\n#Visit the URL: localhost:3000/myBlogs\nwith require of body requests(username,password)") // Correct
                 }
              })
            }
        })
    
    //Check account exist or add new with random password
    //Activate on url : http://[localhost]:[port]/checkAccount 
});

//*************VIEW PERSONAL BLOGS****************************//////////////////
app.post('/api/myPost', (req, res) => {
    const new_card = {
        id: sertis_cards.length + 1,
        username: req.body.username,
        password: req.body.password
        // content: req.body.content,
        // author: req.body.author
    };
    sertis_cards.push(new_card);
    var password = generator.generate({
        length: 10,
        numbers: true
    });
    //
    //set session for account name and password instead of recieved them again from body request
    //
    let sess = req.session
    var account = sess.username
    var password = sess.password 
        con.query("SELECT * FROM accounts WHERE username = '"+ account +"'", function(err, result, field){
          if(result.length === 0){
            //check if username correct or not, if not show error username input
            res.send("Wrong username input, please try again.")
          }
            else{
                //check if username and password correct for view blogs post or not
                const querystring="SELECT * FROM accounts WHERE username ='"+account+"' AND password='"+password+"'";
                con.query(querystring, function (err, result, fields) {
                  if(result.length === 0){
                    console.log("Wrong Password For Username : " + account);
                    res.send("Wrong Password For Username : " + account) // Please login with your password that we assigned to you at the first time.")
                  }
                  else{if (err) throw err;
                    var data = JSON.stringify(result[0].username)
                    // console.log("Record Exist, Name: " + data);
                    // res.send("Correct Password For Username : " + account +"\n---------\n Now, to view the list of all blogs...\n #Visit the URL:localhost:3000/allBlogs \n without any body requests required\n---------\nTo view only your blog posts...\n#Visit the URL: localhost:3000/myBlogs\nwith require of body requests(username,password)") // Correct
                    //
                    //Now fetch DB for blog posts for each account
                    //
                    const querystring="SELECT * FROM blogposts WHERE username ='"+account+"'";
                    con.query(querystring, function (err, result, fields) {
                    if(result.length === 0){
                        // console.log("Wrong Password For Username : " + account);
                        res.send("No Blog Posts For Username : " + account) // Please login with your password that we assigned to you at the first time.")
                    }
                    else{if (err) throw err;
                      console.log("Blog post from "+account+" are shown by res.send")
                        var string=JSON.stringify(result);
                        var json =  JSON.parse(string);
                        res.send(json);
                    }
                  })
                }
              })
            }
        })
    //Add new blog card via POST 
    //Activate on url : http://[localhost]:[port]/addCard 
});

//*************VIEW PERSONAL BLOGS****************************//////////////////
app.post('/api/addPost', (req, res) => {
  const new_card = {
      id: sertis_cards.length + 1,
      username: req.body.username,
      password: req.body.password
      // content: req.body.content,
      // author: req.body.author
  };

  // var username = req.body.username;
  var content = req.body.content;
  var cardName = req.body.cardName;
  var cardStatus = req.body.cardStatus;
  var cardContent = req.body.cardContent;
  var cardCategory = req.body.cardCategory;

  var content2 = content.replace("'","''");
  var cardName2 = cardName.replace("'","''");
  var cardStatus2 = cardStatus.replace("'","''");
  var cardContent2 = cardContent.replace("'","''");
  var cardCategory2 = cardCategory.replace("'","''");
  console.log(cardName2);
  //
  //set session for account name and password instead of recieved them again from body request
  //
  let sess = req.session
  var account = sess.username
  var password = sess.password 
      con.query("SELECT * FROM accounts WHERE username = '"+ account +"'", function(err, result, field){
        if(result.length === 0){
          //check if username correct or not, if not show error username input
          res.send("Wrong username input, please try again.")
        }
          else{
              //check if username and password correct for view blogs post or not
              const querystring="SELECT * FROM accounts WHERE username ='"+account+"' AND password='"+password+"'";
              con.query(querystring, function (err, result, fields) {
                if(result.length === 0){
                  console.log("Wrong Password For Username : " + account);
                  res.send("Wrong Password For Username : " + account) // Please login with your password that we assigned to you at the first time.")
                }
                else{
                console.log("Problem Here");
                console.log("Already add new post for account name: "+account+" \nWith Content: "+content+"\nWith cardName: "+cardName+"\nWith cardStatus: "+cardStatus+"\nWith cardContent: "+cardContent+"\nWith cardCategory: "+cardCategory);
                //problem here
                var sql = "INSERT INTO blogposts (username,content,cardName,cardStatus,cardContent,cardCategory) VALUES ('"+account+"','"+content2+"','"+cardName2+"','"+cardStatus2+"','"+cardContent2+"','"+cardCategory2+"')";
                con.query(sql, function (err, result) {
                  if (err) throw err;
                  res.send("Already add new post for account name: "+account+" \nWith Content: "+content+"\nWith cardName: "+cardName+"\nWith cardStatus: "+cardStatus+"\nWith cardContent: "+cardContent+"\nWith cardCategory: "+cardCategory);
                })
              }
            })
          }
      })
  //Add new blog card via POST 
  //Activate on url : http://[localhost]:[port]/addCard 
});

//*************VIEW ALL BLOGS POST BY ANYONE******************//////////////////
app.post('/api/allPost', (req, res) => {
  const new_card = {
      id: sertis_cards.length + 1,
      username: req.body.username,
      password: req.body.password
      // content: req.body.content,
      // author: req.body.author
  };
  sertis_cards.push(new_card);
  var password = generator.generate({
      length: 10,
      numbers: true
  });
   
  var account = new_card.username;
  var password = new_card.password;
  
    const querystring="SELECT * FROM blogposts";
                  con.query(querystring, function (err, result, fields) {
                  if(result.length === 0){
                      // console.log("Wrong Password For Username : " + account);
                      res.send("No Blog Posts") // Please login with your password that we assigned to you at the first time.")
                  }
                  else{if (err) throw err;
                      var string=JSON.stringify(result);
                      var json =  JSON.parse(string);
                      console.log("All blog posts shown by res.send")
                      let sess = req.session;
                      sess.allposts = json;
                      res.status(200).send(json);
                  }
  })
  //Add new blog card via POST 
  //Activate on url : http://[localhost]:[port]/addCard 
});

//*************EDIT BLOG POST*********************************//////////////////
app.put('/api/editPost/:id', (req, res) => {
  var id = req.params.id;
  var content = req.body.content;
  var cardName = req.body.cardName;
  var cardStatus = req.body.cardStatus;
  var cardContent = req.body.cardContent;
  var cardCategory = req.body.cardCategory;

  var content2 = content.replace("'","''");
  var cardName2 = cardName.replace("'","''");
  var cardStatus2 = cardStatus.replace("'","''");
  var cardContent2 = cardContent.replace("'","''");
  var cardCategory2 = cardCategory.replace("'","''");

  let sess = req.session
  var account = sess.username
  var password = sess.password 

    con.query("SELECT * FROM accounts WHERE username = '"+ account +"'", function(err, result, field){
      if(result.length === 0){
        //check if username correct or not, if not show error username input
        res.send("Wrong username input, please try again.")
      }
        else{
            //check if username and password correct for view blogs post or not
            const querystring="SELECT * FROM accounts WHERE username ='"+account+"' AND password='"+password+"'";
            con.query(querystring, function (err, result, fields) {
              if(result.length === 0){
                console.log("Wrong Password For Username : " + account);
                res.send("Wrong Password For Username : " + account) // Please login with your password that we assigned to you at the first time.")
              }
              else{
              //console.log("Problem Here");
              //console.log("Already add new post for account name: "+account+" \nWith Content: "+content+"\nWith cardName: "+cardName+"\nWith cardStatus: "+cardStatus+"\nWith cardContent: "+cardContent+"\nWith cardCategory: "+cardCategory);
              //problem here
              var sql = "UPDATE blogposts SET content = '"+content2+"',cardName = '"+cardName2+"',cardStatus = '"+cardStatus2+"',cardContent = '"+cardContent2+"',cardCategory = '"+cardCategory2+"' WHERE id = '"+id+"' AND username = '"+account+"'";
              con.query(sql, function (err, result) {
                if (err) throw err;
                res.send("record(s) updated");
              })
            }
          })
        }
    })
  // const postFound = sess.allposts.find(m => m.id === parseInt(req.body.id));
  // res.send(postFound);
  });
//*************DELETE PERSONAL BLOGS**************************//////////////////
app.delete('/api/deletePost/:id', (req, res) => {
  var id = req.params.id;
  var content = req.body.content;
  var cardName = req.body.cardName;
  var cardStatus = req.body.cardStatus;
  var cardContent = req.body.cardContent;
  var cardCategory = req.body.cardCategory;

  var content2 = content.replace("'","''");
  var cardName2 = cardName.replace("'","''");
  var cardStatus2 = cardStatus.replace("'","''");
  var cardContent2 = cardContent.replace("'","''");
  var cardCategory2 = cardCategory.replace("'","''");

  let sess = req.session
  var account = sess.username
  var password = sess.password 

    con.query("SELECT * FROM accounts WHERE username = '"+ account +"'", function(err, result, field){
      if(result.length === 0){
        //check if username correct or not, if not show error username input
        res.send("UnAuthorized!! \nplease try again via POST at localhost:[Port]/checkAccount.")
      }
        else{
            //check if username and password correct for view blogs post or not
            const querystring="SELECT * FROM accounts WHERE username ='"+account+"' AND password='"+password+"'";
            con.query(querystring, function (err, result, fields) {
              if(result.length === 0){
                console.log("Wrong Password For Username : " + account);
                res.send("Wrong Password For Username : " + account) // Please login with your password that we assigned to you at the first time.")
              }
              else{
              //console.log("Problem Here");
              //console.log("Already add new post for account name: "+account+" \nWith Content: "+content+"\nWith cardName: "+cardName+"\nWith cardStatus: "+cardStatus+"\nWith cardContent: "+cardContent+"\nWith cardCategory: "+cardCategory);
              //problem here
              var sql = "DELETE FROM blogposts WHERE id = '"+id+"' AND username = '"+account+"'";
              con.query(sql, function (err, result) {
                if (err) throw err;
                res.send("Delete Process Completed \n!!Note : If you still see the record even you've deleted its\nPlease remind that you have delete the post that's not belong to you!");
              })
            }
          })
        }

  // const postFound = sess.allposts.find(m => m.id === parseInt(req.body.id));
  // res.send(postFound);
  })
    // const new_card = sertis_cards.find(m => m.id === parseInt(req.params.id));
    // if(!new_card) {
    // res.status(404).send('The new_card with the given ID was not found ')
    // }
    // else {
    // const index = sertis_cards.indexOf(new_card);
    // sertis_cards.splice(index, 1);
    // res.send(new_card);
    // };
    //Remove existing blog card via PUT 
    //Activate on url : http://[localhost]:[port]/deleteCard/[id]
});

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Listening on port : ${port}...`) );
