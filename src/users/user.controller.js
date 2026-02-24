import { parse } from 'dotenv';
import User from './user.model.js';

export const finishCreateUser = async (req, res) => {
    try {
        const user = req.user;

        user.set(req.body);

        await user.save();

        res.status(201).json({
            success: true,
            message: 'Usuario creado exitosamente',
            data: user
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al crear usuario',
            error: error.message
        });
    }
}

export const getUsers = async (req, res) => {

    try {
        const { page = 1, limit = 10, isActive = true } = req.query;

        const filter = { isActive };

        const users = await User.find(filter)
            .limit(limit)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 })
            .select('-__v')
            .lean();

        const orderedUsers = users.map(user => ({
            _id: user._id,
            username: user.username,
            email: user.email,
            name: user.name,
            birthdate: user.birthdate,
            description: user.description,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }));
        const total = await User.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: orderedUsers,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalRecords: total,
                limit
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener los usuarios',
            error: error.message
        })
    }
}


export const updateUserInfo = async (req, res) => {
    try {
        const { id } = req.user; 
        const data = req.body;

        // Eliminamos si viene datos de id email o isActive para evitar que se modifiquen
        delete data._id;      
        delete data.email;    
        delete data.isActive; 

        const updatedUser = await User.findByIdAndUpdate(
            id,
            data,
            { 
                new: true,           
                runValidators: true  
            }
        ).select('-__v').lean();

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado en la base de datos',
            });
        }

        const orderedUser = {
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            name: updatedUser.name,
            birthdate: updatedUser.birthdate,
            description: updatedUser.description,
            isActive: updatedUser.isActive,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt
        };

        res.status(200).json({
            success: true,
            message: 'Perfil actualizado exitosamente',
            user: orderedUser
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al intentar actualizar el perfil',
            error: error.message
        });
    }
};

