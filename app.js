const express=require('express');
const mongoose=require('mongoose');
const bodyparser=require('body-parser');
const url="mongodb+srv://jordy:jordy123@cluster0.lbajg.mongodb.net/<dbname>?retryWrites=true&w=majority";
const user=require('./models/user');
const ObjectId=require('mongoose').Types.ObjectId;
const idIsValid=require('mongoose').Types.ObjectId.isValid;
const dateformat=require('dateformat');

dateformat.masks.myformat="ddd mmm dd yyyy";

function objectIdChecker(id){//check if is is valid
    if(idIsValid(id)==true){
        const convertedId=new ObjectId(id).toString();
        if(id==convertedId){
            return true;
        }else{
            return false;
        }
    }else{
        return false;
    }
}

const app=express();
mongoose.connect(url,{useUnifiedTopology: true, useNewUrlParser: true})
.then(()=>{
    console.log('connected to database')
    app.use(express.static('public'))
    app.use(bodyparser.urlencoded({extended: true}))

    app.get('/',(req,res)=>{
        res.sendFile(__dirname+'/views/index.html');
    })

    app.post('/api/exercise/new-user',(req,res)=>{
        var createUser = new user({
            userName: req.body.username
        })
        createUser.save()
        .then((result)=>{
            return user.findOne({userName: result.userName}) //this findOne dont need an error handling
        })
        .then((result)=>{
            res.json({
                username: result.userName,
                _id: result._id
            })
        })
        .catch((err)=>{//if saving failed
            res.send('Username already taken')
        })
    })

    app.get('/api/exercise/users',(req,res)=>{
        var userArray=[];
        var userIndex;//the user objects in the userArray
        function foreachfunc(item,index){
            userIndex={//take the username and id only
                username: item.userName,
                _id: item._id
            }
            userArray.push(userIndex);
        }
        user.find()
        .then((result)=>{
            result.forEach(foreachfunc)//since the creating user only gave username and id and 
            // not the whole user object we may need to seperate it first to pass the test
            res.send(userArray)
        })
    })

    app.post('/api/exercise/add',(req,res)=>{
        if(objectIdChecker(req.body.userId)==false){
            res.send('Invalid userId"')
        }
        else if(req.body.description==""){
            res.send("Path `description` is required.")
        }else if(req.body.duration==""){
            res.send("Path `duration` is required.")
        }else{
            var dateExercise;//because the date might be empty so we need some conditions
            if(req.body.date=="" || new Date(req.body.date)== "Invalid Date"){
                dateExercise=new Date();
            }else{
                dateExercise=new Date(req.body.date);
                console.log(dateExercise)
            }
            var exercise=({
                description: req.body.description,
                duration: req.body.duration,
                date: dateExercise//dont need to format it here since it will converted to normal date again in the db
            })
            user.findOne({_id: req.body.userId})
            .then((result)=>{
                if(!result){
                    throw new Error('id not found')//throw error if not user is found
                }else{
                    result.log.push(exercise)//push the new exercise to the user log
                    return result; 
                }
            })
            .then((result)=>{
                return result.save();//save the changes to user
            })
            .then((result)=>{
                res.json({
                    _id: result._id,
                    username: result.userName,
                    date: dateformat(dateExercise,"myformat"),
                    duration: parseInt(req.body.duration),
                    description: req.body.description
                })
            })
            .catch(()=>{
                res.send("userId not Found")
            })
            
        }

    })
 
    app.get('/api/exercise/log',(req,res)=>{
        var resultlog=[];
        var pushItem;
        function logResultSet(item,index){//no optional given
            pushItem={//so the log objects doesn't have the exercise'id
                description: item.description,
                duration: item.duration,
                date: dateformat(item.date,"myformat")
            }
                resultlog.push(pushItem)
        }
        function logResultSetFrom(item){//if optional from available
            if(item.date>=new Date(req.query.from)){
                pushItem={//so the log objects doesn't have the exercise'id
                    description: item.description,
                    duration: item.duration,
                    date: dateformat(item.date,"myformat")
                }
                resultlog.push(pushItem);
            }
        }
        function logResultSetTo(item){//if optional to available
            if(item.date<=new Date(req.query.to)){
                pushItem={//so the log objects doesn't have the exercise'id
                    description: item.description,
                    duration: item.duration,
                    date: dateformat(item.date,"myformat")
                }
                resultlog.push(pushItem);
            }
        }
        function logResultSetFromTo(item){//if optional from and to available
            if(item.date>= new Date(req.query.from) && item.date<=new Date(req.query.to)){
                pushItem={//so the log objects doesn't have the exercise'id
                    description: item.description,
                    duration: item.duration,
                    date: dateformat(item.date,"myformat")
                }
                resultlog.push(pushItem);
            }
        }
        user.findOne({_id: req.query.userId})
        .then((result)=>{
            if(!result){//if not found
                throw new Error();
            }else{
                if(!req.query.from && !req.query.to){//option from and to not given
                    result.log.forEach(logResultSet)
                }else if(!req.query.to){//option to not given
                    result.log.forEach(logResultSetFrom)
                }else if(!req.query.from){//option from not given
                    result.log.forEach(logResultSetTo)
                }else{//option from and to ARE given
                    result.log.forEach(logResultSetFromTo);
                }
                if(req.query.limit){
                    resultlog=resultlog.slice(0,req.query.limit)
                }
                res.json({
                    _id: result._id,
                    username: result.userName,
                    count: resultlog.length,
                    log: resultlog
                })
            }
        })
        .catch(()=>{
            res.send('userId not Found')
        })

    })

})
.catch((err)=>{
    console.log('Failed to Connect to Database')
})
app.listen(3000);