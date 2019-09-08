# projektniZadatak
 REST API
## Global dependancies
```
mySQL server
node.js
npm

```
## Project setup
```
npm install
```

### Compile for development
```
npm run dev
```

### Compile and starts main file
```
npm run start
```


### Folders and files explanation

#### Root folder
```
projektniZadatak/server.js
```
main file in root folder ,setting up the server
```
projektniZadatak/passport.js
```
authentication middlewares and strategies for adding tokens to user on login and register

```
projektniZadatak/package.json
projektniZadatak/package-lock.json
```
list of the project dependancies and their versions

#### Configuration folder
```
projektniZadatak/configuration/mailer.js
```
configuration for mail service,using sendgrid smtp service with nodemailer library

```
projektniZadatak/configuration/scrt.js
```
secret keys for JWT and sendgrid


#### Core folder
```
projektniZadatak/core/database.js
```
database connection configuration and queries with crud operations which will be called in routes.js file

```
projektniZadatak/core/dbforum.sql
```
database made in phpmyadmin 


```
projektniZadatak/core/dbforum.sql
```
My database for this api, which is running locally .Not sure is it neccessary ,but added it anyway

#### Routes folder
```
projektniZadatak/routes/route.js
```
 all routes in this rest api. Inside of the file there are simple comments on what it does.
 Here is the explanation of parameters for http requests.

```
#####Req.headers

 content-type : application/json

(for protected routes)
 authorization : tokenValue    ,*you don't need 'Bearer' keyword with tokens value
 ```
 
 

```
router.post('/register') , example :
req.body : {
	first_name : 'alphabetChars',
	last_name : 'alphabetChars',
	email : 'uniqueEmail@example.com',
	password : 'atLeast8Characters',
	confirmPassword : 'atLeast8Characters',
	termsOfService : true

},  response  will send token,generated by passport.authentication strategy ,which is neccessary to access most of the routes. 

```

```
router.post('/login') , example :
req.body : {
	email : 'uniqueEmail@example.com',
	password : 'atLeast8Characters'

},response  will send token,generated by passport.authentication strategy ,which is neccessary to access most of the routes. 

```

```
router.post('/passwordReset') , example :
req.body : {
	email : 'yourEmail@example.com'

}, triggers mail service ,which sends an email containing a link to click on  for changing your password.
Email delivery time : +- 10minutes

```

```
router.patch('/user/:id') , example :
req.param.id : id value of the user
req.body : {
	first_name : 'YourNewNameAtoZ',
	last_name : 'newLastName'

}, update first name and last name
```

```
router.patch('/reset/:token') , example :
req.param.token :value which will be sent in  inbox with mail service. 
req.body : {
	password : 'YourNewPassWithMin8Chars',
	confirmPassword : 'YourNewPassWithMin8Chars'

}, change password
```

```
router.post('/topic') , example :
req.body : {
	title : 'your Topic title',
	content : 'content of your title'

}, add topic to database
```

```
router.patch('/topic') , example :
req.body : {
	title : 'your Topic title',
	content : 'content of your title'

}, update  topic,if  only one value is passed ,other will stay the same as before
```

```
router.post('/topic/:id/comment') , example :
req.params.id : 1
req.body : {
	comment_content : 'comment content'

}, add comment to database
```
```
router.patch('/topic/:topicId/comment/:commentId') , example :
req.params.topicId : 1,
req.params.commentId : 1
req.body : {
	comment_content : 'updated content'

}, update comment ,only author of topic/comment can update it.Authorized with JWT 
```
```
router.get('/topics') , example :('/topics?page=1&size=10')
req.query.page  : int value or default 1,
req.query.size : int value of default 10

,pagination with default values
```

```
router.get('/topicSearch') , example : 
req.query.title : 'string value to search topics by title'
,search
```

```
router.get('/commentSearch') , example :
req.query.comment : 'string value to search by comment content'
,search
```
