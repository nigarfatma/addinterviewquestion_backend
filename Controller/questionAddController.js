const question=require("../Model/question")

// ADD QUESTION
exports.questionAdd=async(req,res,next)=>{

    const data=req.body;

   console.log(data,"data");
    const result=await question.create(data);
    console.log(result,"result");
    res.send({
        createResponse:result
    })
}

// GET QUESTION
exports.questionGet=async(req,res,next)=>{
    console.log("check");
    const questionGet=await question.find({})
    res.send({
        isSuccess: true,
        message: "question list fetch succeessly",
        data:questionGet
    })
}