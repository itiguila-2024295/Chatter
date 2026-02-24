'use strict';

import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        _id: {
            type: String,
            required: [true, 'El ID del usuario es requerido'],
        },
        username: {
            type: String,
            required: [true, 'El nombre de usuario es requerido'],
            trim: true,
            maxLength: [100, 'El nombre de usuario no puede exceder 100 caracteres']
        },
        email: {
            type: String,
            required: [true, 'El correo electrónico es requerido'],
            unique: true,
            lowercase: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingresa un correo electrónico válido']
        },
        name: {
            type: String,
            required: [true, 'El nombre del usuario es requerido'],
            trim: true
        },
        birthdate: {
            type: Date,
            required: [true, 'La fecha de nacimiento es requerida']
        },
        description: {
            type: String,
            trim: true,
            maxLength: [500, 'La descripción no puede exceder 500 caracteres']
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

export default mongoose.model('User', userSchema);