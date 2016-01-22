#<a href="https://nodeauth-app.herokuapp.com/users/login">Nodeauth</a> - User authentication,password encryption, and blog app 
<a href="https://codeclimate.com/github/iposton/nodeauth"><img src="https://codeclimate.com/github/iposton/nodeauth/badges/gpa.svg" /></a><br>
This app allows a user to register their account info. After you are registered you can log in and go to the members area, add a blog post and upload a photo. User info and encrypted password is stored in mongodb. This code makes it possible to deploy this app live to heroku. You can demo <a href="https://nodeauth-app.herokuapp.com/users/login">Nodeauth here.</a>

<h3>This app uses the following technologies</h3>
  <ul>
    <li>Node</li>
    <li>Express 4.12.0</li>
    <li>MongoDB 1.4.40</li>
    <li>Jade 1.9.2</li>
    <li>mongoose 4.1.9</li>
    <li>Monk</li>
    <li>express-messages</li>
    <li>express-session</li>
    <li>express-validator</li>
    <li><a href="https://github.com/jaredhanson/connect-flash">connect-flash</a></li>
    <li>multer</li>
    <li><a href="passportjs.org">Passport</a></li>
    <li>passport-http</li>
    <li>passport-local</li>
    <li>bcryptjs 2.3.0</li>
    <li><a href="http://momentjs.com/">moment.js</a></li>
    
  </ul>

<h3>To run this app locally</h3>
<ul>
<li>Install Modules run: <code>npm install</code></li>
<li>In new terminal window start node server run: <code>npm start</code></li>
<li>Go to your browser and open http://localhost:3000</li>
<li>Enjoy!</li>
</ul>

<h3>Setup MongoDB locally for mac</h3>
<ul>
<li>Open two terminal windows. run: <code>sudo mongod</code> in one window and run: <code>mongo</code> in the other teminal window at the same time. (mongod needs to run for mongo command to work)</li>
<li>In mongo terminal window Create a db run: <code>use nodeauth</code></li>
<li>Create a collection in the db run: <code>db.creatCollection('users')</code></li>
<li>To see a list of all dbs run: <code>show dbs</code> (nodeauth should be in this list)</li>
<li>now you should be able to connect to this db from the codebase</li>
</ul>

<h3>Setup MongoDB to work with Heroku</h3>
The db that was created locally will not work on heroku. An add-on needs to be added for mongodb to work on heroku. It's called mongoLabs and it is free to set up. Follow instructions below to add it to your app if you plan to use mongodb for data. This works if you have a <a href="https://www.heroku.com/">heroku</a> account and installed <a href="https://toolbelt.heroku.com/">heroku toolbelt.</a>
<ul>
<li>Stand in the root of the app and Create a heroku app run: <code>heroku create</code></li>
<li>Add mongolab and run: <code> heroku addons:add mongolab</code></li>
<li>Log in to heroku click on the new app created click on mongolabs add on and click on Users add a database user with a dbusername and dbpassword.</li>
<li>Configure your dbusername and dbpassword in heroku to keep it private run: <code>heroku config:set MONGOLAB_URI=" mongodb://dbuser:dbpassword@something.mongolab.com:39175/heroku_something"</code></li>
<li>Configure the dbusername and dbpassword in heroku and then use the MONGOLAB_URI environment variable like I did in my code because you do not want to push your dbusername and dbpassword live to github.</li>
<li>Make a change in code commit and push to github then run: <code>git push heroku master</code> and deploy the app.</li>
<li>After it's done deploying run: <code>heroku open</code> to see the app live.
</ul>

