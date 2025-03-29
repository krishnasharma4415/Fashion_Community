import React from "react";
import PostCard from "../components/PostCard";

const Home = () => {
    const posts = [
        { id: 1, image: "https://via.placeholder.com/300", user: "Jane Doe", likes: 120 },
        { id: 2, image: "https://via.placeholder.com/300", user: "John Smith", likes: 98 },
    ];

    return (
        <div className="pt-16 grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
            {posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    );
};

export default Home;