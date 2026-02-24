'use strict';

import mongoose from "mongoose";

const commentsSchema = mongoose.Schema(
    {
        text: {
            type: String,
            required: [true, 'El texto del comentario es obligatorio'],
            trim: true
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            required: [true, 'El comentario debe estar vinculado a una publicación']
        },
        author: {
            type: String, 
            ref: 'User',
            required: [true, 'El autor del comentario es requerido']
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

export default mongoose.model('Comment', commentsSchema);