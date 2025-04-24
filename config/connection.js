import mongoose from "mongoose";
const ConnectDataBase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(
      `Connected to : ${process.env.MONGO_URL}`.red.underline
    );
  } catch (error) {
    console.log(error);
  }
};

export default ConnectDataBase;
