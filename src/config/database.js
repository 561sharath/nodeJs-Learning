const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://sharathKumar:Sharath%4023062001@nodelearning.ybqot.mongodb.net/nodeLearning"
  );
};

module.exports = connectDB;

// connectDB()
//   .then(() => {
//     console.log("MongoDB connected");
//   })
//   .catch((err) => {
//     console.error(err);
//   });
