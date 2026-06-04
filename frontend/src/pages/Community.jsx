import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Search,
  Plus,
  TrendingUp,
  Users,
  HeartPulse,
  Moon,
  Salad,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { FloralDecoration } from "@/components/shared/Illustrations";

// Mock Data
const INITIAL_POSTS = [];
const TRENDING_TOPICS = [];

const SUPPORT_GROUPS = [
  { name: "PCOS Support", icon: HeartPulse, color: "#F6A58E" },
  { name: "First Period Help", icon: Users, color: "#CDB4F6" },
  { name: "Wellness & Self-Care", icon: Salad, color: "#BDD7B3" },
  { name: "Cycle Tracking Tips", icon: Moon, color: "#F8B6B6" },
];

export default function Community() {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState(null);

  // Create Post State
  const [newPostContent, setNewPostContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;

    const newPost = {
      id: Date.now(),
      author: isAnonymous ? "Anonymous" : "Jaishree",
      avatar: isAnonymous ? "?" : "J",
      isAnonymous,
      content: newPostContent,
      tags: ["Wellness"], // Default tag for now
      likes: 0,
      comments: 0,
      timeAgo: "Just now",
      isLiked: false,
      isSaved: false,
    };

    setPosts([newPost, ...posts]);
    setNewPostContent("");
    setIsAnonymous(false);
    setIsDialogOpen(false);
  };

  const toggleLike = (postId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post,
      ),
    );
  };

  const toggleSave = (postId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, isSaved: !post.isSaved } : post,
      ),
    );
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) =>
        t.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    // Simple filter mock: if clicking a support group, we filter by a related keyword
    const matchesFilter = activeFilter
      ? post.tags.some((t) =>
          t.toLowerCase().includes(activeFilter.toLowerCase()),
        ) || post.content.toLowerCase().includes(activeFilter.toLowerCase())
      : true;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 pb-24 max-w-[1400px] mx-auto relative">
      {/* Header Banner */}
      <div
        className="rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between"
        style={{
          background: "linear-gradient(135deg, #FAF6FF, #FFF5F5)",
          border: "1px solid rgba(205,180,246,0.3)",
          boxShadow: "0 4px 25px rgba(205,180,246,0.08)",
        }}
      >
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
          <FloralDecoration className="w-64 h-64" />
        </div>

        <div className="relative z-10 max-w-2xl text-center sm:text-left">
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#2D1F1A] mb-2">
            Sisterhood Sanctuary 🌸
          </h1>
          <p className="text-[#5C4D47] font-medium leading-relaxed">
            Welcome to our safe space. A place to share, connect, and learn from
            other women on similar wellness journeys. Please be kind,
            supportive, and respectful.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Sidebar */}
        <div className="lg:col-span-3 space-y-6">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C7B74]"
              size={18}
            />
            <Input
              placeholder="Search discussions..."
              className="pl-10 h-12 rounded-2xl bg-white border-[#F5F3F1] shadow-sm focus-visible:ring-[#F8B6B6]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div
            className="rounded-3xl p-5 border bg-white"
            style={{
              borderColor: "rgba(246,165,142,0.15)",
              boxShadow: "0 4px 20px rgba(200,150,130,0.04)",
            }}
          >
            <h3 className="font-serif font-bold text-lg text-[#2D1F1A] mb-4 flex items-center gap-2">
              <Users size={18} className="text-[#F6A58E]" /> Support Groups
            </h3>
            <div className="space-y-2">
              {SUPPORT_GROUPS.map((group) => {
                const isActive = activeFilter === group.name.split(" ")[0]; // Simple matching logic
                return (
                  <button
                    key={group.name}
                    onClick={() =>
                      setActiveFilter(
                        isActive ? null : group.name.split(" ")[0],
                      )
                    }
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 ${
                      isActive
                        ? "bg-[#F9F8F7] scale-[1.02]"
                        : "hover:bg-[#F9F8F7]"
                    }`}
                  >
                    <div
                      className="p-2 rounded-xl"
                      style={{ backgroundColor: `${group.color}20` }}
                    >
                      <group.icon size={16} style={{ color: group.color }} />
                    </div>
                    <span
                      className={`text-sm font-medium ${isActive ? "text-[#2D1F1A] font-bold" : "text-[#5C4D47]"}`}
                    >
                      {group.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center Feed */}
        <div className="lg:col-span-6 space-y-6">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                style={{
                  borderColor: "rgba(246,165,142,0.1)",
                  boxShadow: "0 4px 20px rgba(200,150,130,0.04)",
                }}
              >
                {/* Post Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-serif font-bold text-white text-lg"
                      style={{
                        background: post.isAnonymous
                          ? "linear-gradient(135deg, #E5DFDA, #8C7B74)"
                          : "linear-gradient(135deg, #F8B6B6, #CDB4F6)",
                      }}
                    >
                      {post.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#2D1F1A] text-sm">
                        {post.author}{" "}
                        {post.isAnonymous && (
                          <span className="text-[#8C7B74] font-normal italic ml-1">
                            (Hidden)
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-[#8C7B74] font-medium">
                        {post.timeAgo}
                      </p>
                    </div>
                  </div>
                  <button className="text-[#8C7B74] hover:bg-[#F5F3F1] p-1.5 rounded-full transition-colors">
                    <MoreHorizontal size={18} />
                  </button>
                </div>

                {/* Post Content */}
                <p className="text-[#5C4D47] leading-relaxed text-sm mb-4">
                  {post.content}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{
                        backgroundColor: "rgba(205,180,246,0.15)",
                        color: "#71549C",
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-6 pt-4 border-t border-[#F5F3F1]">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                      post.isLiked
                        ? "text-[#F6A58E]"
                        : "text-[#8C7B74] hover:text-[#F6A58E]"
                    }`}
                  >
                    <Heart size={18} fill={post.isLiked ? "#F6A58E" : "none"} />
                    {post.likes}
                  </button>
                  <button className="flex items-center gap-1.5 text-sm font-medium text-[#8C7B74] hover:text-[#CDB4F6] transition-colors">
                    <MessageCircle size={18} />
                    {post.comments}
                  </button>
                  <div className="flex-1" />
                  <button
                    onClick={() => toggleSave(post.id)}
                    className={`transition-colors ${
                      post.isSaved
                        ? "text-[#5A8A4E]"
                        : "text-[#8C7B74] hover:text-[#5A8A4E]"
                    }`}
                  >
                    <Bookmark
                      size={18}
                      fill={post.isSaved ? "#5A8A4E" : "none"}
                    />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div
              className="bg-white rounded-3xl p-10 text-center border"
              style={{
                borderColor: "rgba(246,165,142,0.1)",
                boxShadow: "0 4px 20px rgba(200,150,130,0.04)",
              }}
            >
              <div className="w-24 h-24 mx-auto mb-4 bg-[#FAF6FF] rounded-full flex items-center justify-center">
                <Search size={32} className="text-[#CDB4F6]" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#2D1F1A] mb-2">
                No discussions found
              </h3>
              <p className="text-[#8C7B74] text-sm">
                Try adjusting your search or filters to find what you're looking
                for.
              </p>
              <Button
                variant="outline"
                className="mt-6 rounded-2xl border-[#F6A58E]/40 text-[#F6A58E] hover:bg-[#F6A58E]/5"
                onClick={() => {
                  setSearchQuery("");
                  setActiveFilter(null);
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-3 space-y-6">
          <div
            className="rounded-3xl p-5 border bg-gradient-to-b from-[#FFFAF9] to-white"
            style={{
              borderColor: "rgba(246,165,142,0.15)",
              boxShadow: "0 4px 20px rgba(200,150,130,0.04)",
            }}
          >
            <h3 className="font-serif font-bold text-lg text-[#2D1F1A] mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-[#BDD7B3]" /> Trending Now
            </h3>
            <div className="space-y-4">
              {TRENDING_TOPICS.length > 0 ? (
                TRENDING_TOPICS.map((topic, i) => (
                  <div
                    key={topic.tag}
                    className="flex justify-between items-center group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-[#8C7B74] opacity-50">
                        0{i + 1}
                      </span>
                      <span className="text-sm font-medium text-[#5C4D47] group-hover:text-[#F6A58E] transition-colors">
                        #{topic.tag}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-[#8C7B74] bg-[#F5F3F1] px-2 py-0.5 rounded-full">
                      {topic.posts}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center flex flex-col items-center justify-center">
                  <div className="w-12 h-12 bg-[#F9F8F7] rounded-full flex items-center justify-center mb-3">
                    <TrendingUp className="text-[#A69B97]" size={20} />
                  </div>
                  <p className="text-sm font-medium text-[#8C7B74]">
                    No trending topics yet
                  </p>
                  <p className="text-xs text-[#A69B97] mt-1">
                    Check back later as discussions grow!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Create Post Button */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            className="fixed bottom-8 right-8 h-14 px-6 rounded-full shadow-2xl transition-all hover:scale-105 hover:shadow-xl text-white font-bold gap-2 z-40"
            style={{ background: "linear-gradient(135deg, #F6A58E, #F8B6B6)" }}
          >
            <Plus size={20} /> New Post
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] p-0 border-none rounded-[2rem] overflow-hidden shadow-2xl">
          <div
            className="h-2 w-full"
            style={{
              background:
                "linear-gradient(90deg, #F8B6B6, #CDB4F6, #F6A58E, #BDD7B3)",
            }}
          />
          <div className="p-6 sm:p-8 space-y-6 bg-white">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl text-[#2D1F1A]">
                Create a Discussion
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Share your thoughts, ask a question, or seek advice..."
                className="w-full h-32 p-4 rounded-2xl bg-[#F9F8F7] border border-[#E5DFDA] focus:outline-none focus:ring-2 focus:ring-[#F8B6B6]/50 resize-none text-sm text-[#2D1F1A] placeholder:text-[#A69B97]"
              />

              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAF6FF] border border-[#CDB4F6]/20">
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-[#2D1F1A]">
                    Post Anonymously
                  </p>
                  <p className="text-xs text-[#8C7B74]">
                    Hide your name and avatar from this post
                  </p>
                </div>
                <Checkbox
                  checked={isAnonymous}
                  onCheckedChange={setIsAnonymous}
                  className="border-[#CDB4F6] data-[state=checked]:bg-[#CDB4F6] data-[state=checked]:border-[#CDB4F6] h-5 w-5 rounded-md"
                />
              </div>
            </div>

            <DialogFooter className="border-none bg-transparent p-0 sm:justify-between items-center mt-6 flex-row">
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  className="text-[#8C7B74] hover:bg-[#F5F3F1] hover:text-[#2D1F1A] rounded-xl h-12 px-6"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                onClick={handleCreatePost}
                disabled={!newPostContent.trim()}
                className="rounded-xl h-12 px-8 text-white font-bold shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #CDB4F6, #9D74E3)",
                }}
              >
                Post to Community
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
