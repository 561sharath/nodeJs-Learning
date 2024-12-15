// console.log("Starting")

const express = require("express");
const connectDB = require("./config/database");
// require("./config/database")
const app = express();
const UserModel = require("./models/user");

app.use(express.json());
app.post("/signup", async (req, res) => {
  console.log(req.body);
  //   const user = new UserModel({
  //     firstName: "John",
  //     lastName: "Doe",
  //     emailId: "john.doe@example.com",
  //     password: "password123",
  //     age: 30,
  //     gender: "Male",
  //   });

  const user = new UserModel(req.body)

  try {
    await user.save();
    res.send("User created successfully");
  } catch (err) {
    res.status(400).send("Error in saving the data", err.message);
  }
});

// app.get('/', (req, res) => {
//     res.send('Hello World!')
// })

// app.get('/test', (req, res) => {
//     res.end('testing')
// })

// app.get('/test', (req, res) => {
//     res.send('testing again')
// })
connectDB()
  .then(() => {
    console.log("successfully connected to database");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log("Failed to connect to database", err);
  });
