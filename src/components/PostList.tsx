import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { PostItem } from "./PostItem";
import { CityFilter } from "./CityFilter";

export interface Post {
    id: number;
    title: string;
    content: string;
    created_at: string;
    image_url: string;
    avatar_url?: string;
    like_count?: number;
    comment_count?: number;
    city_id?: number | null;
    cities?: {
        name: string;
        country: string;
    };
}

const fetchPosts = async (cityId?: number | null): Promise<Post[]> => {
    let query = supabase
        .from("posts")
        .select(`
            *,
            cities (
                name,
                country
            )
        `)
        .order("created_at", { ascending: false });

    if (cityId) {
        query = query.eq("city_id", cityId);
    }
    
    const { data, error } = await query;
    
    if (error) throw new Error(error.message);
    return data as Post[];
};

export const PostList = () => {
    const [selectedCityId, setSelectedCityId] = useState<number | null>(null);

    const { data, error, isLoading } = useQuery<Post[], Error>({
        queryKey: ["posts", selectedCityId],
        queryFn: () => fetchPosts(selectedCityId),
    });

    if (isLoading) {
        return (
            <div className="text-center py-8">
                <div className="inline-flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                    <span>Loading posts...</span>
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
        <div>
            <CityFilter
                selectedCityId={selectedCityId}
                onCityChange={setSelectedCityId}
            />
            
            {data && data.length > 0 ? (
                <div className="flex flex-wrap gap-6 justify-center">
                    {data.map((post) => (
                        <PostItem post={post} key={post.id} />
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-400 py-8">
                    {selectedCityId 
                        ? "No posts found in the selected city." 
                        : "No posts available."
                    }
                </div>
            )}
        </div>
    );
};