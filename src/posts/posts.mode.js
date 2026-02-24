'use strict';

import mongoose from "mongoose";

const postSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'El título es obligatorio'],
            trim: true
        },
        category: {
            type: String,
            required: [true, 'La categoría es obligatoria'],
            enum: {
                values: ['Tecnología', 'Salud', 'Educación', 'Entretenimiento', 'Deportes', 'Negocios', 'Ciencia', 'Arte', 'Viajes', 'Gastronomía', 'Otros'],
                message: 'La categoría debe ser una de las siguientes: Tecnología, Salud, Educación, Entretenimiento, Deportes, Negocios, Ciencia, Arte, Viajes, Gastronomía o Otros'
            },
            trim: true
        },
        content: {
            type: String,
            required: [true, 'El contenido o texto principal es obligatorio'],
            trim: true
        },
        author: {
            type: String,
            ref: 'User',
            required: [true, 'El autor de la publicación es requerido']
        },
        photo: {
            type: String,
            default: null,
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

export default mongoose.model('Post', postSchema);