import React, { useState } from "react";
import { HiOutlineCamera } from "react-icons/hi";
import { useMutation } from "@tanstack/react-query";
import { createPost } from "../../../../services/index/posts";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import Editor from "../../../../components/editor/Editor";
import MultiSelectTagDropdown from "../../components/select-dropdown/MultiSelectTagDropdown";
import { getAllCategories } from "../../../../services/index/postCategories";
import { filterCategories } from "../../../../utils/multiSelectTagUtils";
import PostTags from "./PostTags";

const NewPost = () => {
	const labelClassName = "text-black font-semibold block text-xl";
	const inputClassName =
		"placeholder:text-[#959EAD] w-full text-dark-hard my-5 rounded-lg px-3 py-2 font-semibold block outline-none border";

	const [photo, setPhoto] = useState(null);
	const [title, setTitle] = useState("");
	const [caption, setCaption] = useState("");
	const [body, setBody] = useState(null);
	const [categories, setCategories] = useState([]);
	const [tags, setTags] = useState([]);
	const userState = useSelector((state) => state.user);
	const [bodyKey, setBodyKey] = useState(0);

	const { mutate } = useMutation({
		mutationFn: ({ postData, token }) => createPost({ postData, token }),
		onSuccess: () => {
			toast.success("Post created");
		},
		onError: (error) => {
			toast.error(error.message);
			console.log(error);
		},
	});

	const handleFileChange = (event) => {
		const file = event.target.files[0];
		setPhoto(file);
	};

	const titleChangeHandler = (event) => setTitle(event.target.value);
	const captionChangeHandler = (event) => setCaption(event.target.value);

	const promiseOptions = async (inputValue) => {
		const { data } = await getAllCategories();
		return filterCategories(inputValue, data);
	};

	const handleTagsChange = (newTags) => {
		setTags(newTags);
	};

	const submitHandler = (event) => {
		event.preventDefault();

		if (!title.trim()) {
			toast.error("Title cannot be empty.");
			return;
		}

		if (!caption.trim()) {
			toast.error("Caption cannot be empty.");
			return;
		}

		if (!body) {
			toast.error("Post body cannot be empty.");
			return;
		}

		const postData = {
			title,
			caption,
			body,
			categories: categories.map((item) => item.value),
			tags,
		};

		let updatedData = new FormData();
		if (photo) updatedData.append("postPicture", photo);
		updatedData.append("document", JSON.stringify(postData));

		mutate({ postData: updatedData, token: userState.userInfo.token });

		setPhoto(null);
		setTitle("");
		setCaption("");
		setBody("");
		setCategories([]);
		setTags([]);
		setBodyKey((prev) => prev + 1);
	};

	return (
		<form className="container pb-7" onSubmit={submitHandler}>
			<h1 className="text-2xl font-semibold mb-10">New Post</h1>

			{/* Title and Caption */}
			<div className="mx-10 mb-7">
				<label htmlFor="title" className={labelClassName}>
					Title
				</label>
				<input
					type="text"
					id="title"
					className={inputClassName}
					value={title}
					onChange={titleChangeHandler}
					placeholder="Title goes here.."
					autoComplete="off"
				/>
				<label htmlFor="caption" className={labelClassName}>
					Caption
				</label>
				<input
					type="text"
					id="caption"
					className={inputClassName}
					value={caption}
					onChange={captionChangeHandler}
					placeholder="Caption goes here.."
					autoComplete="off"
				/>
			</div>

			{/* Category Selector */}
			<label className="text-black font-semibold ml-10 text-xl">
				Categories
			</label>
			<div className="mx-10 my-5">
				<MultiSelectTagDropdown
					loadOptions={promiseOptions}
					value={categories}
					onChange={(selected) => {
						setCategories(selected || []);
					}}
				/>
			</div>

			{/* Tags Input */}
			<label className="text-black font-semibold ml-10 text-xl">
				Tags
			</label>
			<div className="mx-10 my-5">
				<PostTags onTagsHandler={handleTagsChange} />
			</div>

			{/* Editor */}
			<label className="text-black font-semibold ml-10 text-xl">
				Body
			</label>
			<div className="mx-10 my-7 flex flex-col justify-center border-2 border-primary rounded-xl">
				<Editor
					key={bodyKey}
					editable={true}
					content={(prevBody) => prevBody}
					onDataChange={(data) => setBody(data)}
				/>
			</div>

			{/* Image Upload */}
			<label className="text-black font-semibold text-xl ml-10">
				Image
			</label>
			<div className="mx-10 pt-7">
				<label htmlFor="postPicture" className="w-full cursor-pointer">
					{photo ? (
						<img
							src={URL.createObjectURL(photo)}
							alt="post"
							className="rounded-xl w-full"
						/>
					) : (
						<div className="w-full min-h-[200px] h-full bg-blue-50/50 flex justify-center items-center">
							<HiOutlineCamera className="w-7 h-auto text-primary" />
						</div>
					)}
				</label>
				<input
					type="file"
					className="sr-only"
					id="postPicture"
					onChange={handleFileChange}
				/>
			</div>

			{/* Buttons */}
			<div className="mx-10 pt-7 flex flex-row justify-between">
				<button
					className="bg-green-500 text-white w-1/2 mx-5 font-semibold rounded-lg px-4 py-2"
					type="submit"
				>
					Post
				</button>
				<button
					type="button"
					className="bg-red-500 text-white w-1/2 mx-5 font-semibold rounded-lg px-4 py-2"
					onClick={() => {
						setTitle("");
						setCaption("");
						setBody("");
						setPhoto(null);
						setCategories([]);
						setTags([]); // Reset tags
					}}
				>
					Discard
				</button>
			</div>
		</form>
	);
};

export default NewPost;
