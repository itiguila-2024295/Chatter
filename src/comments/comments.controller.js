import Comment from "./comments.model.js";
import Post from "../posts/posts.mode.js";

export const addComment = async (req, res) => {
    try {
        const { text, postId } = req.body;
        const { id: userId } = req.user; 

        const postExists = await Post.findById(postId);
        if (!postExists) {
            return res.status(404).json({
                success: false,
                message: 'La publicación a la que intentas comentar no existe'
            });
        }

        const newComment = new Comment({
            text,
            post: postId,
            author: userId
        });

        await newComment.save();

        res.status(201).json({
            success: true,
            message: 'Comentario agregado exitosamente',
            comment: newComment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al agregar el comentario',
            error: error.message
        });
    }
};

export const getComments = async (req, res) => {
    try {
        const { postId } = req.params; 
        const { page = 1, limit = 10 } = req.query;

        const comments = await Comment.find({ post: postId })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 })
            .populate('author', 'name username') 
            .lean();

        const total = await Comment.countDocuments({ post: postId });

        res.status(200).json({
            success: true,
            totalRecords: total,
            data: comments,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                limit: parseInt(limit)
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener los comentarios',
            error: error.message
        });
    }
};

export const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        const { id: userId } = req.user;

        const comment = await Comment.findById(id);
        if (!comment) return res.status(404).json({ message: 'Comentario no encontrado' });

        if (comment.author.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para editar este comentario'
            });
        }

        comment.text = text;
        await comment.save();

        res.status(200).json({
            success: true,
            message: 'Comentario actualizado',
            comment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar',
            error: error.message
        });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { id: userId } = req.user;

        const comment = await Comment.findById(id);
        if (!comment) return res.status(404).json({ message: 'Comentario no encontrado' });

        if (comment.author.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para eliminar este comentario'
            });
        }

        await Comment.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Comentario eliminado correctamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar',
            error: error.message
        });
    }
};