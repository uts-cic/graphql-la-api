import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
    platform: {
        type: String,
        required : true
    },
    title : {
       type: String,
       required: true
    },
    verb: {
      type: String,
      required: true
    },
    text :{
       type: String
    },
    courseRef :{
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
    createdAt: {
       type: String
    },
    updatedAt: {
       type: String
    },
    user: {
        type: { type: Schema.Types.ObjectId,
            ref: 'user'
        }
    }

    });

export default mongoose.model('note', NoteSchema);