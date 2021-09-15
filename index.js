const express = require('express');
const app = express();
const port = 3000;

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://hyeon:abcd1234@nodejs.gohxx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
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

app.get('/',(req,res)=>res.send('Hello World!'))
app.listen(port,()=>console.log(`${port}번 포트 연결했다!`))