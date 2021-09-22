const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const {User} = require('./models/User');

const config = require('./config/key');

// bodyParser가 client에서 오는 정보를 서버에서 분석해서 가져올 수 있게 하는 것
// applocation/x-www-form-urlencoded를 분석해서 가져오는 것
app.use(bodyParser.urlencoded({entended: true}));
// application/json
app.use(bodyParser.json());
const mongoose = require('mongoose');
mongoose.connect(config.mongoURI,{
    /* 오류가 생길 수 있어 적어주는 코드 */
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    /* 몽구스가 6.0이상이면 에러가 발생한다네,, */
    // useCreateIndex: true, 
    // useFindAndModify: false
})
  .then(()=>console.log('MongoDB Connected...'))
  .catch((err)=>console.log(err));

app.get('/',(req,res)=>res.send('후훗'));

//login 라우터
app.post('/register',(req,res)=>{
  // 회원가입할 때 필요한 정보들을 client에서 가져오면
  // 그것들을 DB에 넣어준다.

  /*
  json 형식으로 user 정보가  req.body로 전달됨
  {
    id:'hello',
    pw:'aaa',
  }
  */
 // json 형식을 객체로 만들기
  const user = new User(req.body);

  user.save((err,doc)=>{
    if (err) return res.json ({success: false, err});
    return res.status(200).json({
      success: true,
    })
  })
})

app.listen(port,()=>console.log(`${port}번 포트 연결했다!`));