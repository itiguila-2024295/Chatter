import Post from "./posts.mode.js";

export const createPost = async (req, res) => {
    try {
        const { title, category, content } = req.body;
        const { id } = req.user;

        const newPost = new Post({
            title,
            category,
            content,
            author: id,
            photo: req.file ? req.file.path : null
        });

        await newPost.save();

        res.status(201).json({
            success: true,
            message: 'Publicación creada exitosamente',
            post: {
                id: newPost._id,
                title: newPost.title,
                category: newPost.category,
                content: newPost.content,
                author: newPost.author,
                photo: newPost.photo,
                createdAt: newPost.createdAt
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear la publicación',
            error: error.message
        });
    }
};

export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { id: userId } = req.user;
        const data = req.body;

        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Publicación no encontrada'
            });
        }

        if (post.author.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para editar esta publicación'
            });
        }

        if (req.file) {
            if (post.photo_public_id) {
                await cloudinary.uploader.destroy(post.photo_public_id);
            }

            data.photo = req.file.path;
            data.photo_public_id = req.file.filename;
        }

        const updatedPost = await Post.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true
        }).select('-__v').lean();

        res.status(200).json({
            success: true,
            message: 'Publicación actualizada exitosamente',
            post: updatedPost
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar la publicación',
            error: error.message
        });
    }
};

export const getPosts = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const posts = await Post.find()
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 })
            .populate('author', 'name username') 
            .lean();

        const total = await Post.countDocuments();

        const orderedPosts = posts.map(post => ({
            id: post._id,
            title: post.title,
            category: post.category,
            content: post.content,
            author: post.author,
            photo: post.photo,
            createdAt: post.createdAt
        }));

        res.status(200).json({
            success: true,
            totalRecords: total,
            data: orderedPosts,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                limit: parseInt(limit)
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener las publicaciones',
            error: error.message
        });
    }
};

export const deletePost = async (req, res) => {
    try {
        const { id } = req.params; 
        const { id: userId } = req.user; 

        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'La publicación no existe'
            });
        }

        if (post.author.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para eliminar esta publicación (no eres el autor)'
            });
        }

        await Post.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Publicación eliminada exitosamente'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al intentar eliminar la publicación',
            error: error.message
        });
    }
};