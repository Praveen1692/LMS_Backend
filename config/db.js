import mongoose from "mongoose";

mongoose.set("strictQuery", false); //  enable strict mode for queries.{By setting 'strictQuery' to true, you are instructing Mongoose to enable strict mode for queries, ensuring that only properties defined in the schema can be used in queries. This helps maintain data integrity and prevents unexpected behavior when interacting with the database.}

const connectionTODb = async () => {
  // connect to the database

  try {
    const connectionInstance = await mongoose.connect(
      "mongodb://localhost:27017/lms"
    );

    if (connectionInstance) {
     // console.log(connectionInstance); //  for testing purposes only
      console.log(`connection at host ${connectionInstance.connection.host}`);
      //console.log(`\n Mongodb connected...${connectionInstance.connection.host}`);
    }
  } catch (error) {
    console.log("Error connecting to DB", error);
    process.exit(1); //  terminate and indicate error

  }
};


export default  connectionTODb;
