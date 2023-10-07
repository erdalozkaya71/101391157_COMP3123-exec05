const express = require('express');
const app = express();
const router = express.Router();
const fs = require('fs');


/*
- Create new html file name home.html 
- add <h1> tag with message "Welcome to ExpressJs Tutorial"
- Return home.html page to client
*/
router.get('/home', (req, res) => {
  // Send the HTML file as a response
  res.sendFile(__dirname + '/home.html');
});

/*
- Return all details from user.json file to client as JSON format
*/
router.get('/profile', (req, res) => {
  // Read the contents of the 'user.json' file
  fs.readFile('user.json', 'utf8', (err, data) => {
    if (err) {
      // Handle any errors (e.g., file not found)
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      // Parse the JSON data and send it as a JSON response
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    }
  });
});


/*
- Modify /login router to accept username and password as query string parameter
- Read data from user.json file
- If username and  passsword is valid then send resonse as below 
    {
        status: true,
        message: "User Is valid"
    }
- If username is invalid then send response as below 
    {
        status: false,
        message: "User Name is invalid"
    }
- If passsword is invalid then send response as below 
    {
        status: false,
        message: "Password is invalid"
    }
*/
let user; 

// Reading the user data from user.json
try {
  const userDataRaw = fs.readFileSync('user.json', 'utf8');
  user = JSON.parse(userDataRaw);
} catch (err) {
  console.error('Error reading user data:', err);
}

router.get('/login', (req, res) => {
  const { username, password } = req.query;

  if (!username || !password) {
    res.status(400).json({
      status: false,
      message: 'Both username and password are required.',
    });
    return;
  }

  

  if (!user) {
    res.status(401).json({
      status: false,
      message: 'Username is invalid',
    });
  } else if (user.password !== password) {
    res.status(401).json({
      status: false,
      message: 'Password is invalid',
    });
  } else {
    res.json({
      status: true,
      message: 'User is valid',
    });
  }
});


/*
- Modify /logout route to accept username as parameter and display message
    in HTML format like <b>${username} successfully logout.<b>
*/
router.get('/logout/:username', (req, res) => {
  const { username } = req.params;
  res.send(`<b>${username} successfully logged out.</b>`);
});

app.use('/', router);

app.listen(process.env.port || 8081);

console.log('Web Server is listening at port '+ (process.env.port || 8081));