# Exercise Tracker Microservice
For the fourth project of the FreeCodeCamp's API and Microservice Project, we have to make an Exercise Tracker Microservice with basic Node, basic Express, and MongoDb.

## Live Demo on Repl
https://freecodecamp-project-exercisetracker.jordyf15.repl.co/

## Test/User-Stories
1. I can create a user by posting form data username to /api/exercise/new-user and returned will be an object with username and _id.
2. I can get an array of all users by getting api/exercise/users with the same info as when creating a user.
3. I can add an exercise to any user by posting form data userId(_id), description, duration, and optionally date to /api/exercise/add. If no date supplied it will use current date. Returned will be the user object with also with the exercise fields added.
4. I can retrieve a full exercise log of any user by getting /api/exercise/log with a parameter of userId(_id). Return will be the user object with added array log and count (total exercise count).
5. I can retrieve part of the log of any user by also passing along optional parameters of from & to or limit. (Date format yyyy-mm-dd, limit = int)

## Functions
### 1. Create a New User: 
This will create a user by posting form data to /api/exercise/new-user and then returned a json object with username and id.  
Example input:  
kevin  
Example Output:
```
{
"username":"kevin",
"_id":"5f4903a5e40e8d004705df2b"
}
```
### 2. Get Users:
This will retrieve an array of all users in the database by getting /api/exercise/users which return an array of objects with properties of username and id.
Example Output:
```
[{"username":"jordy","_id":"5f465c97b2e71012a00bcd8a"},
{"username":"sora","_id":"5f4782ede23fd015900e693e"},
{"username":"kevin","_id":"5f4903a5e40e8d004705df2b"}]
```
### 3. Add Exercises:
This will add an exercise to a user with the specified id by posting to the /api/exercise/add , the description and duration is required while the date is optional. If the date wasn't filled then it will get the current date. This will return the user object and also the exercise added.  
Example Output:
```
{_id:	"5f4782ede23fd015900e693e",
username:	"sora",
date:	"Fri Aug 28 2020",
duration:	10,
description:	"singing"}
```

### 4. Get Exercises:
This will get the exercise log of a user which meets the from, to, and limit optional parameter by getting /api/exercise/log?{userId}[&from][&to][&limit]. If the optional parameters weren't given then it will return all of the user exercise log. This will return the user object and also the log array and count.  
Example Output:
```
{_id:	"5f4782ede23fd015900e693e",
username:	"sora",
count:	2,
log:[	
0:	{
description:	"singing",
duration:	10,
date:	"Fri Aug 28 2020"}
1:	{
description:	"dancing",
duration:	10000,
date:	"Fri Aug 28 2020"}
]}
```

## Technology Used:
1. HTML
2. CSS
3. Javascript
4. Express version 4.17.1
5. Mongoose version 5.10.0
6. Body-parser version 1.19.0
7. EJS version 3.1.5
8. Font Awesome version 4.7.0
