import todoSchema from "../models/todoSchema.js";
import multer from "multer";
import path from "path"

const storage = multer.diskStorage({
    destination: "upload",
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname))
    }
})

export const upload = multer({ storage: storage })

export const createTodo = async (req, res) => {
    try {
        const { title } = req.body
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image uploaded",
            })
        }

        const allowedTypes = ["image/jpeg", "image/png", "image/svg"]
        if (!allowedTypes.includes(req.file.mimetype)) {
            return res.status(400).json({
                success: false,
                message: "Invalid file type",
            })
        }

        const imageUrl = `http://localhost:7001/upload/${req.file.filename}`
        const todoData = await todoSchema.create({ picture: imageUrl, title, userId: req.userId })

        if (todoData) {
            return res.status(201).json({
                success: true,
                message: "Todo Created",
                todoData
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getAll = async (req, res) => {
    try {
        const todoData = await todoSchema.find({ userId: req.userId })

        if (todoData) {
            return res.status(200).json({
                success: true,
                message: "Todo fetched",
                todoData
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const deleteTodo = async (req, res) => {
    try {
        const todoId = req.params.id;
        const todoData = await todoSchema.findByIdAndDelete({ _id: todoId, userId: req.userId });

        if (!todoData) {
            return res.status(404).json({
                status: false,
                message: "Todo Not Found"
            });
        } else {
            return res.status(200).json({
                status: true,
                message: "Todo Deleted",
                todoData
            })
        };

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    };
};

export const updateTodo = async (req, res) => {
    try {
        const todoId = req.params.id;
        const { title } = req.body;
        const todoData = await todoSchema.findOne({ _id: todoId, userId: req.userId });

        if (!todoData) {
            return res.status(404).json({
                status: false,
                message: "Todo Noto Found"
            });
        };
        if (req.file) {
            const allowedType = ["image/jpeg", "image/png", "image/svg"]
            if (!allowedType.includes(req.file.mimetype)) {
                return res.status(400).json({
                    success: false,
                    message: "Filetype Not Matched"
                })
            }

            const imageUrl = `http://localhost:7001/upload/${req.file.filename}`
            todoData.picture = imageUrl
        }
        if (title) {
            todoData.title = title
        }
        await todoData.save();
        return res.status(200).json({
            status: true,
            message: "Todo Updated",
            todoData
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    };
};



export const paginateTodo = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 3; // 3 notes per page

        // Calculating the skip value
        const skip = (page - 1) * limit;

        // Getting notes with pagination
        const todos = await todoSchema
            .find({ userId: req.userId })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            message: "Todos fetched as per query",
            data: todos,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            data: "Internal server error",
        });
    }
};