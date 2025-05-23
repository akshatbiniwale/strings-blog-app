import React, { useState } from "react";
import { images } from "../../../constants";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

const Hero = () => {
	const navigate = useNavigate();
	const [searchKeyword, setSearchKeyword] = useState("");

	const categories = [
		{
			id: "680dfdfcb001243d0553dd30",
			title: "Backend",
		},
		{
			id: "680dfe0cb001243d0553dd36",
			title: "Lifestyle",
		},
		{
			id: "680dfe16b001243d0553dd3c",
			title: "Movies",
		},
		{
			id: "680e0297b001243d0553de06",
			title: "Automobile",
		},
	];

	const handleCategoryClick = (categoryId) => {
		navigate(`/blog?page=1&search=&categories=${categoryId}`);
	};

	const handleSearch = (e) => {
		e.preventDefault();

		if (searchKeyword.trim()) {
			navigate(
				`/blog?search=${searchKeyword}&search=&categories=`
			);
		}
	};

	return (
		<section className="container mx-auto flex flex-auto px-5 py-5 lg:flex-row">
			<div className="mt-10 lg:w-1/2">
				<h1 className="font-roboto text-3xl text-center font-bold text-dark-soft md:text-5xl lg:text-4xl xl:text-5xl lg:text-left lg:max-w-[540px]">
					Read the most interesting articles
				</h1>
				<p className="text-dark-light mt-4 text-center md:text-xl lg:text-base xl:text-xl lg:text-left">
					Exploring the Spectrum of Thoughts: Navigating Life,
					Learning, and Beyond Through Engaging and Insightful Blogs.
				</p>
				<form
					onSubmit={handleSearch}
					className="flex flex-col gap-y-2.5 mt-10 lg:mt-6 xl:mt-10 relative"
				>
					<div className="relative">
						<FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-[#959EAD]" />
						<input
							className="placeholder:font-bold font-semibold text-dark-soft placeholder:text-[#959EAD] rounded-lg pl-12 pr-3 w-full py-3 focus:outline-none shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px] md:py-4"
							placeholder="Search Article"
							type="text"
							value={searchKeyword}
							onChange={(e) => setSearchKeyword(e.target.value)}
						/>
					</div>
					<button
						type="submit"
						className="w-full bg-primary text-white font-semibold rounded-lg px-5 py-3 md:absolute md:right-2 md:top-1/2 md:-translate-y-1/2 md:w-fit md:py-2"
					>
						Search
					</button>
				</form>
				<div className="flex mt4 flex-col lg:flex-row lg:items-start lg:flex-nowrap lg:gap-x-4 lg:mt-7">
					<span className="text-dark-light font-semibold italic mt-2 lg:mt-4 lg:text-sm xl:text-base">
						Popular Categories:
					</span>
					<ul className="flex flex-wrap gap-x-2.5 gap-y-2.5 mt-3 lg:text-sm xl:text-base">
						{categories.map((category) => (
							<li
								key={category.id}
								className="cursor-pointer rounded-lg bg-primary bg-opacity-10 px-3 py-1.5 text-primary font-semibold hover:bg-opacity-20 transition-all"
								onClick={() =>
									handleCategoryClick(category.id)
								} // Pass category title
							>
								{category.title}
							</li>
						))}
					</ul>
				</div>
			</div>
			<div className="hidden lg:block lg:1/2">
				<img
					className="w-full"
					src={images.HeroImage}
					alt="users are reading articles"
				/>
			</div>
		</section>
	);
};

export default Hero;
