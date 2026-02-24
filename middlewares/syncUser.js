import User from '../src/users/user.model.js';

export const syncUser = async (req, res, next) => {
    try {
        // Extraemos los datos del usuario que vienen decodificados del token de .NET
        const { id, username, email, name } = req.user; 

        const user = await User.findOneAndUpdate(
            { _id: id },
            { 
                $setOnInsert: { 
                    _id: id, 
                    username: username,
                    email: email,
                    name: name,
                    isActive: true
                } 
            },
            { upsert: true, new: true }
        );

        // Reemplazamos req.user con el documento de Mongo para tener el objeto completo
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al sincronizar el perfil de usuario en el gestor de opiniones",
            error: error.message
        });
    }
};