const express = require("express");
const connectDB = require("./config/database");
const UserModel = require("./models/user");
const app = express();
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")

const {userAuth} = require("./middlewares/auth")
// Middleware to parse JSON request body
app.use(express.json());
app.use(cookieParser())

// Route to get all users
app.get("/users", async (req, res) => {
  try {
    const users = await UserModel.find({});
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.send(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to get a user by email
app.get("/users/:emailId", async (req, res) => {
  const { emailId } = req.params;

  try {
    const user = await UserModel.findOne({ emailId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.send(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to update a user's details
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const updatedUserData = req.body;

  try {

    const ALLOWED_UPDATES = ["firstName", "lastName", "password", "age", "skills"]

    const updates = Object.keys(updatedUserData).every(key => ALLOWED_UPDATES.includes(key))

    if (!updates) {
      throw new Error("updates not allowed")
    }

    if (updatedUserData?.skills.length > 10) {
      throw new Error("skills length should be less than 10")
    }

    const updatedUser = await UserModel.findByIdAndUpdate(userId, updatedUserData, {
      runValidators: true,
      new: true, // Return the updated document
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.send("User updated successfully");
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error updating user", error: err.message });
  }
});

// Route to delete a user
app.delete("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const deletedUser = await UserModel.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error deleting user", error: err.message });
  }
});

// Route to register a new user
app.post("/signup", async (req, res) => {
  // const userData = req.body;
  try {
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body

    const hashedPassword = await bcrypt.hash(password, 10)


    // Create a new user instance
    const user = new UserModel({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    }

    );


    await user.save();
    res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error saving user data", error: err.message });
  }
});

app.post("/login", async (req, res) => {
  try {

    const { emailId, password } = req.body

    const user = await UserModel.findOne({ emailId: emailId })

    if (!user) {
      throw new Error("User not found")
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (isPasswordValid) {

      const token = await jwt.sign({ _id: user._id }, "Sharath@12345")

      console.log(token)

      res.cookie("token", token)
      res.send("Login successful")
    } else {
      throw new Error("user not found")
    }

  } catch (err) {
    console.error(err)
    res.status(400).json({ message: "Error logging in", error: err.message })
  }
})

app.get('/profile', userAuth, async (req, res) => {

  try {

    const user = req.user

    if(!user){
      throw new Error("User not found")
    }


    res.send(user)

  } catch (err) {
    console.error(err)
    res.status(400).json({ message: "Error fetching profile", error: err.message })
  }



})

// Connect to the database and start the server
connectDB()
  .then(() => {
    console.log("Successfully connected to the database");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err);
  });
