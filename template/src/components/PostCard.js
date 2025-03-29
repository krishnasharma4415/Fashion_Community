import { FiHeart } from "react-icons/fi";
import PropTypes from "prop-types";

const PostCard = ({ post }) => {
    return (
        <div className="relative group">
            <img src={post.image} alt="Fashion Post" className="w-full h-auto rounded-lg" />
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-2 text-white flex justify-between items-center">
                <p>{post.user}</p>
                <div className="flex items-center space-x-1">
                    <FiHeart className="text-red-500" />
                    <span>{post.likes}</span>
                </div>
            </div>
        </div>
    );
};

PostCard.propTypes = {
    post: PropTypes.shape({
        image: PropTypes.string.isRequired,
        user: PropTypes.string.isRequired,
        likes: PropTypes.number.isRequired,
    }).isRequired,
};

export default PostCard;