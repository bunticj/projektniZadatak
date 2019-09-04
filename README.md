# projektniZadatak
 REST API

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
projektniZadatak/core/sql-phpmyadmin.js
```
queries for creating database and tables,i've done it in phpmyadmin and commented it in this file


#### Routes folder
```
projektniZadatak/routes/route.js
```
 all routes in this rest api. Inside of the file there are simple comments on what it does.Here under i will 
 write about post and patch routes,what do they expect in request

```
router.post('/register') , example :
req.body : {
	first_name : 'alphabetChars',
	last_name : 'alphabetChars',
	email : 'uniqueEmail@example.com',
	password : 'atLeast8Characters',
	confirmPassword : 'atLeast8Characters',
	termsOfService : true

}, in response you will get token,generated by passport.authentication strategy ,which you will use for almost 
every route . Copy it to header as a value for key authorization,example : 
authorization : someToken4324324234withMoreLetters
```

```
router.post('/login') , example :
req.body : {
	email : 'uniqueEmail@example.com',
	password : 'atLeast8Characters'

}, in response you will get token which you will use for almost every route .Copy it to header as a value for 
key authorization,example : 
authorization : someToken4324324234withMoreLetters     *you don't need 'Bearer' key word with tokens value
```

```
router.post('/passwordReset') , example :
req.body : {
	email : 'yourEmail@example.com'

}, triggers mail service ,which will send you a message with link to click on for changing your password.
 p.s. not sure how fast will it come,sometimes few minutes,sometimes half hour
```

```
router.patch('/user/:id') , example :
req.param.id : id value of the user. You can only update and delete your user,and your own topics and comments
req.body : {
	first_name : 'YourNewNameAtoZ',
	last_name : 'newLastName'

}, update first name and last name,password change is on different route
```

```
router.patch('/reset/:token') , example :
req.param.token :value which you will get in your inbox with mail service. 
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

}, update  topic,if you change only one value ,other value will stay the same as before
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

}, update comment . the one who created it,he can update it
```
