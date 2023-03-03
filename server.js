const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3008;

// Enable CORS
app.use(cors());

// Parse JSON request bodies
app.use(bodyParser.json());

// Serve static files
app.use(express.static('public'));

// Define routes
app.get('/users', (req, res) => {
  // Read user data from data.json
  const userData = require('./data.json');

  // Return list of users and their information
  res.json(userData.users);
});

app.post('/users', (req, res) => {
  // Read user data from data.json
  const userData = require('./data.json');

  // Extract new user information from request body
  const { id, name, createdOn, gender, dob, city, state, pincode, modifiedOn } = req.body;

  // Create new user object
  const newUser = { id, name, createdOn, gender, dob, city, state, pincode, modifiedOn };

  // Add new user to user data
  userData.users.push(newUser);

  // Write updated user data back to data.json
  const fs = require('fs');
  fs.writeFileSync('./data.json', JSON.stringify(userData, null, 2));

  // Return new user object
  res.status(200).json({
    message: `User created successfully`,
  });
});

app.put('/users/:userId', (req, res) => {
  // Read user data from data.json
  const userData = require('./data.json');

  // Find user by ID
  const userId = req.params.userId;
  const userIndex = userData.users.findIndex((user) => user.id == userId);

  // If user not found, return 404 error
  if (userIndex == -1) {
    res.status(404).send('User not found');
    return;
  }

  // Update user object with new information from request body
  const { id, name, createdOn, gender, dob, city, state, pincode, modifiedOn } = req.body;
  userData.users[userIndex] = {
    id: id || userData.users[userIndex].id,
    name: name || userData.users[userIndex].name,
    createdOn: createdOn || userData.users[userIndex].createdOn,
    gender: gender || userData.users[userIndex].gender,
    dob: dob || userData.users[userIndex].dob,
    city: city || userData.users[userIndex].city,
    state: state || userData.users[userIndex].state,
    pincode: pincode || userData.users[userIndex].pincode,
    modifiedOn: modifiedOn || new Date().toISOString(),
  };

  // Write updated user data back to data.json
  const fs = require('fs');
  fs.writeFileSync('./data.json', JSON.stringify(userData, null, 2));

  // Return updated user object
  res.status(200).json({
    message: `User with ID ${userId} updated successfully`,
  });
});

app.delete('/users/:userId', (req, res) => {
    const userId = req.params.userId;
    console.log(`Deleting user with ID ${userId}`);
  
    // Read user data from data.json
    const userData = require('./data.json');
  
    // Find user by ID
    const userIndex = userData.users.findIndex((user) => user.id == userId);
  
    // If user not found, return 404 error
    if (userIndex == -1) {
      res.status(404).send('User not found');
      return;
    }
  
    // Remove user from user data
    userData.users.splice(userIndex, 1);
  
    // Write updated user data back to data.json
    const fs = require('fs');
    fs.writeFileSync('./data.json', JSON.stringify(userData, null, 2));
  
    console.log(`User with ID ${userId} deleted successfully`);
  
    // Return success message
    res.status(200).json({
      message: `User with ID ${userId} deleted successfully`,
    });

  
  

    
});

app.listen(port, () => {
    console.log(`UserApiServer listening at http://localhost:${port}`);
  });