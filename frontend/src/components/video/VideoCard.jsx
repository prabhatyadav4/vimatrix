import { useNavigate, Link } from "react-router-dom";

function VideoCard({ video }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/watch/${video._id}`);
  };

  return (
    <Link to={`/watch/${video._id}`} className="block hover:opacity-90">
      <img src={video.thumbnail} alt={video.title} />
      <h3>{video.title}</h3>
    </Link>
  );
}
