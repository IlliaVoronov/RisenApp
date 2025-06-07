import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { LikeButton } from "./LikeButton";
import { CommentSection } from "./CommentSection";

interface Props {
  postId: number;
}

interface PostWithCity {
  id: number;
  title: string;
  content: string;
  created_at: string;
  image_url: string;
  avatar_url?: string;
  city_id?: number | null;
  cities?: {
    name: string;
    country: string;
  };
}

const fetchPostById = async (id: number): Promise<PostWithCity> => {
  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      cities (
        name,
        country
      )
    `)
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  return data as PostWithCity;
};

export const PostDetail = ({ postId }: Props) => {
  const { data, error, isLoading } = useQuery<PostWithCity, Error>({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(postId),
  });

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
          <span>Loading post...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          {data?.title}
        </h2>
        
        {/* City and Date Information */}
        <div className="flex items-center justify-center space-x-4 text-gray-400 text-sm mb-6">
          {data?.cities && (
            <div className="flex items-center">
              <svg 
                className="w-4 h-4 mr-1" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {data.cities.name}, {data.cities.country}
            </div>
          )}
          <div className="flex items-center">
            <svg 
              className="w-4 h-4 mr-1" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            {new Date(data!.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>

      {data?.image_url && (
        <img
          src={data.image_url}
          alt={data?.title}
          className="rounded-lg object-contain w-full max-h-[70vh] mx-auto"
        />
      )}
      
      <div className="bg-gray-800/30 border border-white/10 rounded-lg p-6">
        <p className="text-gray-300 leading-relaxed">{data?.content}</p>
      </div>

      <LikeButton postId={postId} />
      <CommentSection postId={postId} />
    </div>
  );
};