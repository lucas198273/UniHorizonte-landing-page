
import type { BlogPost } from '../../types/blog';
import { PostCard } from './PostCard';

export function PostList({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
