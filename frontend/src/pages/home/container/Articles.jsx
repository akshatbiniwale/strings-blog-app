import React from "react";
import ArticleCard from "./ArticleCard";
import { FaArrowRight } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { getAllPosts } from "../../../services/index/posts";
import { toast } from "react-hot-toast";
import ArticleCardSkeleton from "../../../components/ArticleCardSkeleton";
import ErrorMessage from "../../../components/ErrorMessage";
import { useNavigate } from "react-router-dom";

const Articles = () => {
    const navigate = useNavigate();

    const { data, isLoading, isError } = useQuery({
        queryFn: () => getAllPosts(),
        queryKey: ["posts"],
        onError: (error) => {
            toast.error(error.message);
            console.log(error);
        },
    });

    return (
		<section className="flex flex-col container mx-auto px-5 py-10">
			<div className="flex flex-wrap md:gap-x-5 gap-y-5 pb-10">
				{isLoading ? (
					[...Array(3)].map((item, index) => (
						<ArticleCardSkeleton
							key={index}
							className="w-full md:w-[calc(50%-20px)] lg:w-[calc(33.33%-21px)]"
						/>
					))
				) : isError ? (
					<ErrorMessage message="Something went wrong." />
				) : (
					data?.data.map((post) => (
						<ArticleCard
							key={post._id}
							post={post}
							className="w-full md:w-[calc(50%-20px)] lg:w-[calc(33.33%-21px)]"
						/>
					))
				)}
			</div>
			<button
				className="mx-auto flex items-center gap-x-2 font-bold text-primary border-2 border-primary px-3 py-2 rounded-lg"
				onClick={() => navigate("/blog")}
			>
				<span>More Articles</span>
				<FaArrowRight className="w-3" />
			</button>
		</section>
	);
};

export default Articles;
