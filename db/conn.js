const mongoose =require('mongoose')
mongoose.set("strictQuery", true);

mongoose.connect("mongodb://127.0.0.1/interview").then(() => {
    console.log("mongodb cluster connected sucessfully");
  })


  .catch((err) => {
    //("no connection");
    console.log("no connection");
  });
