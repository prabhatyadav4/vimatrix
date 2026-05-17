import { useParams, useSearchParams } from "react-router-dom";

function VideoWatch() {
  const { videoId } = useParams();

  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query");
  const page = searchParams.get("page");

  return <div>Watching video: {videoId} </div>;
}
