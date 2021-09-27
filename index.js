const express = require('express');
const app = express();
const port = 5000;
const config = require('./server/config/key');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {auth} = require('./server/middleware/auth');
const {User} = require('./server/models/User');

// bodyParser가 client에서 오는 정보를 서버에서 분석해서 가져올 수 있게 하는 것
// applocation/x-www-form-urlencoded를 분석해서 가져오는 것
app.use(bodyParser.urlencoded({extended: true})); 
// application/json
app.use(bodyParser.json());
app.use(cookieParser());

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

//
app.get('/',(req,res)=>res.send('후훗'));

app.get('/api/hello',(req,res)=>{res.send('안녕하세요~');});

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
    });
  });
});

app.post('/login',(req,res)=>{
  // 1. 요청된 이메일을 데이터베이스에 있는지 찾기
  User.findOne({ email: req.body.email}, (err,user)=>{
    if (!user){
      return res.json({
        loginSuccess: false,
        message: "요청된 이메일에 해당하는 유저가 없습니다."
      })
    }  
    // 2. 요청한 이메일이 데베에 있으면 비번이 같은지 확인
    user.comparePassword(req.body.password,(err,isMatch)=>{
      if (!isMatch){
         return res.json({loginSuccess: false, message:"비밀번호가 틀렸습니다."});
      }
      // 3. 비번까지 맞으면 유저를 위한 Token 생성
      user.generateToken((err,user)=>{
        if (err) return res.status(400).send(err);
        // token을 저장 -> 어디에 저장할까? 쿠키, 로컬스토리지 등에 저장 가능함
        // 여기선 쿠키에 저장한다!
        res.cookie("x_auth",user.token)
          .status(200)
          .json({loginSuccess:true,userId:user._id})
      })
    })
  })  
})

app.get('/api/users/auth',auth,(req,res)=>{
  // 엔드포인트에서 request를 받은다음에 auth라는 미들웨어를 실행할 것

  // 여기까지 미들웨어를 통과해온 것은 Authentication이 true라는 말
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role===0 ? false:true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
});

app.get('/api/users/logout',auth,(req,res)=>{
  User.findOneAndUpdate({_id:req.user._id},{token:""},(err,user)=>{
    if (err) return res.json({success: false, err});
    return res.status(200).send({
      success:true
    }) 
  })
})

app.listen(port,()=>console.log(`${port}번 포트 연결했다!`))