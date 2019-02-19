import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const QuizSchema = new Schema({
    platform: {
        type: String,
        required : true
    },
    title : {
        type: String,
        required: true
    },
    verb :{
        type: String,
        required: true
    },
    lrsRef: {
        type: String
    },
    objRef: {
        type: String
    },
    courseRef: {
        type: String
    },
    course: {
        type:String
    },
    activityRef: {
        type: String
    },
    activity: {
        type:String
    },
    subjectRef: {
        type:String
    },
    rawScore :{
        type: Schema.Types.Decimal128
    },
    scaledScore :{
        type: Schema.Types.Decimal128
    },
    createdAt: {
        type: String
    },
    updatedAt: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

});

export default mongoose.model('quiz', QuizSchema);