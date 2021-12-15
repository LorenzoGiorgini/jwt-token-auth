import mongoose from 'mongoose';

const { Schema } = mongoose;


const BlogPostSchema = new Schema({
    category: {
        type: String,
        required: true
    }, 
    title: {
        type: String,
        required: true
    },
    cover: {
        type: String,
        required: false
    },
    readTime: {
        type: Object,
        required: true,
        nested: {
            value: {
                type: Number,
                required: false
            },
            unit: {
                type: String,
                required: true,
                default: 'minutes'
            }
        }
    },
    content: {
        type: String,
        required: true
    },
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    likes: [{
        type: Schema.Types.ObjectId, ref: 'User'
    }],
    comments: [{
        text: {type: String, required: true},
        image: {type: String, required: true},
        postedAt: {type: Date, required: true},
        updatedAt: {type: Date}
    }]
}, {
    timestamp: true
})



export default mongoose.model("BlogPost", BlogPostSchema)