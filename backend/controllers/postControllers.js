const uploadPicture = require("../middleware/uploadPictureMiddleware");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const fileRemover = require("../utils/fileRemover");
const { v4: uuidv4 } = require("uuid");

const createPost = async (req, res, next) => {
	try {
		const upload = uploadPicture.single("postPicture");

		const handleUpdatePostData = async (data, base64Image) => {
			const { title, caption, body = null, tags = [] } = JSON.parse(data);

			const post = new Post({
				title,
				caption,
				slug: uuidv4(),
				body: {
					type: body.type,
					content: body.content,
				},
				photo: base64Image, // Now storing base64 string
				tags,
				user: req.user._id,
			});

			const createdPost = await post.save();
			return res.json(createdPost);
		};

		upload(req, res, async function (err) {
			if (err) {
				const error = new Error(
					"An error occurred while uploading: " + err.message
				);
				return next(error);
			} else {
				let base64Image = "";
				if (req.file) {
					const mimeType = req.file.mimetype; // e.g. image/png
					base64Image = `data:${mimeType};base64,${req.file.buffer.toString(
						"base64"
					)}`;
				}
				await handleUpdatePostData(req.body.document, base64Image);
			}
		});
	} catch (error) {
		next(error);
	}
};

const updatePost = async (req, res, next) => {
	try {
		const post = await Post.findOne({ slug: req.params.slug });
		if (!post) {
			const error = new Error("Post was not found");
			return next(error);
		}

		const upload = uploadPicture.single("postPicture");

		const handleUpdatePostData = async (data, base64Image) => {
			const { title, caption, slug, body, tags, categories } =
				JSON.parse(data);

			post.title = title || post.title;
			post.caption = caption || post.caption;
			post.slug = slug || post.slug;
			post.body = body || post.body;
			post.tags = tags || post.tags;
			post.categories = categories || post.categories;

			if (base64Image !== null) {
				post.photo = base64Image; // Set the new image
			} else if (base64Image === "") {
				post.photo = ""; // Clear the image
			}

			const updatedPost = await post.save();
			res.json(updatedPost);
		};

		upload(req, res, async function (err) {
			if (err) {
				const error = new Error(
					"An error occurred while uploading: " + err.message
				);
				return next(error);
			}

			let base64Image = null;

			if (req.file) {
				const mimeType = req.file.mimetype;
				base64Image = `data:${mimeType};base64,${req.file.buffer.toString(
					"base64"
				)}`;
			} else if (req.body.removeImage === "true") {
				base64Image = ""; // Handle explicit request to remove image
			}

			await handleUpdatePostData(req.body.document, base64Image);
		});
	} catch (error) {
		next(error);
	}
};

const deletePost = async (req, res, next) => {
    try {
        const post = await Post.findOneAndDelete({ slug: req.params.slug });

        if (!post) {
            const error = new Error("Post was not found");
            return next();
        }

        const comments = await Comment.deleteMany({ post: post._id });
        return res.json({ message: "Post is successfully deleted" });
    } catch (error) {
        next(error);
    }
};

const getPost = async (req, res, next) => {
    try {
        const post = await Post.findOne({ slug: req.params.slug }).populate([
            {
                path: "user",
                select: ["name", "avatar"],
            },
            {
                path: "comments",
                match: {
                    check: true,
                    parent: null,
                },
                populate: [
                    {
                        path: "user",
                        select: ["name", "avatar"],
                    },
                    {
                        path: "replies",
                        match: {
                            check: true,
                        },
                        populate: [
                            {
                                path: "user",
                                select: ["name", "avatar"],
                            },
                        ],
                    },
                ],
            },
        ]);
        if (!post) {
            const error = new Error("Post was not found");
            next(error);
            return;
        }
        return res.json(post);
    } catch (error) {
        next(error);
    }
};

const getAllPostsOfUser = async (req, res, next) => {
    try {
        const filter = req.query.searchKeyword;
        let where = {
            user: req.user._id,
        };
        if (filter) {
            where.title = { $regex: filter, $options: "i" };
            // $regex: Provides regular expression capabilities for pattern matching strings in queries. MongoDB uses Perl compatible regular expressions
            // $options: i - Case insensitivity to match upper and lower cases.
        }
        let query = Post.find(where);
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * pageSize;
        const total = await Post.find(where).countDocuments();
        const pages = Math.ceil(total / pageSize);

        res.header({
            "x-filter": filter,
            "x-totalcount": JSON.stringify(total),
            "x-currentpage": JSON.stringify(page),
            "x-pagesize": JSON.stringify(pageSize),
            "x-totalpagecount": JSON.stringify(pages),
        });

        if (page > pages) {
            return res.json([]);
        }

        const result = await query
            .skip(skip) // Specifies the number of documents to skip.
            .limit(pageSize) // Specifies the maximum number of documents the query will return.
            .populate([
                {
                    path: "user",
                    select: ["avatar", "name", "verified"],
                },
            ])
            .sort({ updatedAt: "desc" });

        // The headers in the code start with x- because they are custom headers. Custom headers are headers that are not defined by the HTTP specification. By convention, custom headers start with x- to distinguish them from standard headers.

        return res.json(result);
    } catch (error) {
        next(error);
    }
};

const getAllPosts = async (req, res, next) => {
    try {
        const result = await Post.find()
            .populate([
                {
                    path: "user",
                    select: ["avatar", "name", "verified"],
                },
            ])
            .sort({ updatedAt: "desc" });

        return res.json(result);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPost,
    updatePost,
    deletePost,
    getPost,
    getAllPosts,
    getAllPostsOfUser,
};
