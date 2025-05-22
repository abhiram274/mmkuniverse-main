
import { useState } from "react";
import { Search, Filter, Plus, Heart, MessageSquare, BookOpen, Calendar, User, Tag, PlusCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for forum posts
const MOCK_POSTS = [
  {
    id: 1,
    title: "How to get started with Machine Learning in 2025",
    content: "I've been looking to learn machine learning but there are so many resources out there. What are the best paths for beginners in 2025? Has anyone taken any good courses recently?",
    author: "TechLearner42",
    authorAvatar: "https://ui-avatars.com/api/?name=TL&background=8B5CF6&color=fff",
    date: "April 1, 2025",
    likes: 24,
    comments: 13,
    tags: ["Machine Learning", "Beginners", "Resources"],
    type: "question"
  },
  {
    id: 2,
    title: "The Future of Web Development: My Thoughts on WASM and Edge Computing",
    content: "Web Assembly and Edge Computing are revolutionizing how we build web applications. In this post, I share my experiences with these technologies and how they're changing the development landscape.",
    author: "DevFuturist",
    authorAvatar: "https://ui-avatars.com/api/?name=DF&background=F59E0B&color=fff",
    date: "March 28, 2025",
    likes: 56,
    comments: 8,
    tags: ["Web Development", "WASM", "Edge Computing"],
    type: "article"
  },
  {
    id: 3,
    title: "My Journey from Student to Software Engineer",
    content: "I wanted to share my journey from being a computer science student to landing my first job as a software engineer. It wasn't easy, but here are the steps I took and lessons I learned along the way.",
    author: "GradDev2025",
    authorAvatar: "https://ui-avatars.com/api/?name=GD&background=8B5CF6&color=fff",
    date: "March 25, 2025",
    likes: 89,
    comments: 21,
    tags: ["Career", "Personal Journey", "Software Engineering"],
    type: "article"
  },
  {
    id: 4,
    title: "Best Study Methods for Technical Interviews?",
    content: "I have some technical interviews coming up for internships. What are your recommended study methods and resources for algorithm and data structure questions?",
    author: "InterviewPrepper",
    authorAvatar: "https://ui-avatars.com/api/?name=IP&background=F59E0B&color=fff",
    date: "March 20, 2025",
    likes: 32,
    comments: 18,
    tags: ["Interviews", "Data Structures", "Algorithms"],
    type: "question"
  },
];

// Forum categories
const FORUM_CATEGORIES = [
  "General Discussion",
  "Tech Talk",
  "Career Advice",
  "Projects",
  "Events",
  "Learning Resources",
  "Job Opportunities",
  "Student Life",
];

const ForumBlogs = () => {
  const [isCreatePostDialogOpen, setIsCreatePostDialogOpen] = useState(false);
  const [isViewPostDialogOpen, setIsViewPostDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<typeof MOCK_POSTS[0] | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const handleViewPost = (post: typeof MOCK_POSTS[0]) => {
    setSelectedPost(post);
    setIsViewPostDialogOpen(true);
  };

  const filteredPosts = activeTab === "all" 
    ? MOCK_POSTS 
    : MOCK_POSTS.filter(post => post.type === activeTab);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-20">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gradient-primary">MMK Community Voices</h1>
              <p className="text-gray-400 mt-2">Share ideas, ask questions, grow together.</p>
            </div>
            <Button onClick={() => setIsCreatePostDialogOpen(true)} className="bg-mmk-purple hover:bg-mmk-purple/90">
              <Plus size={18} />
              Start a Conversation
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="glass-card p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search discussions, tags, or creators..."
                  className="pl-10 bg-transparent border-white/20"
                />
              </div>
              <Button 
                variant="outline" 
                className="md:w-auto border-white/20 bg-transparent"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={18} className="mr-2" />
                Filters
              </Button>
              <Select>
                <SelectTrigger className="w-full md:w-[180px] bg-transparent border-white/20">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="comments">Most Comments</SelectItem>
                  <SelectItem value="trending">Trending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Tabs for post types */}
            <div className="mt-4">
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-black/20">
                  <TabsTrigger value="all">All Posts</TabsTrigger>
                  <TabsTrigger value="article">Articles</TabsTrigger>
                  <TabsTrigger value="question">Questions</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {/* Filters Panel (Toggled) */}
            {showFilters && (
              <div className="mt-4 p-4 border border-white/10 rounded-lg bg-mmk-dark/80">
                <h3 className="text-lg font-medium mb-3">Filter Posts</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Categories</h4>
                    <Select>
                      <SelectTrigger className="bg-transparent border-white/20">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {FORUM_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category.toLowerCase().replace(/\s+/g, '-')}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Tags</h4>
                    <Input 
                      placeholder="e.g. Career, Python, Learning" 
                      className="bg-transparent border-white/20"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Date Posted</h4>
                    <Select>
                      <SelectTrigger className="bg-transparent border-white/20">
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                        <SelectItem value="year">This Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" className="border-white/20">Clear All</Button>
                  <Button className="bg-mmk-purple hover:bg-mmk-purple/90">Apply Filters</Button>
                </div>
              </div>
            )}
          </div>

          {/* Posts Listing */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPosts.map((post) => (
              <Card 
                key={post.id} 
                className="bg-secondary/40 border-white/10 hover:border-mmk-purple/60 transition-all overflow-hidden"
                onClick={() => handleViewPost(post)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge 
                      variant="secondary" 
                      className={`mb-2 ${
                        post.type === 'question' 
                          ? 'bg-mmk-amber/20 hover:bg-mmk-amber/30' 
                          : 'bg-mmk-purple/20 hover:bg-mmk-purple/30'
                      }`}
                    >
                      {post.type === 'question' ? 'Question' : 'Article'}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-semibold line-clamp-2">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-300 line-clamp-3">{post.content}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="border-white/20 text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full overflow-hidden">
                        <img src={post.authorAvatar} alt={post.author} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm text-gray-300">{post.author}</span>
                    </div>
                    <div className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {post.date}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 flex justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-gray-400">
                      <Heart className="h-4 w-4" />
                      <span className="text-xs">{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <MessageSquare className="h-4 w-4" />
                      <span className="text-xs">{post.comments}</span>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="text-mmk-purple hover:bg-mmk-purple/10 p-0 h-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewPost(post);
                    }}
                  >
                    Read More
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredPosts.length === 0 && (
            <div className="glass-card p-10 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-mmk-purple/20 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-10 w-10 text-mmk-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Let's break the silence. Be the first to post!</h3>
              <p className="text-gray-400 max-w-md mb-6">
                Start a conversation and help build our community knowledge base.
              </p>
              <Button onClick={() => setIsCreatePostDialogOpen(true)} className="bg-mmk-purple hover:bg-mmk-purple/90">
                <Plus size={18} className="mr-2" />
                Start a Conversation
              </Button>
            </div>
          )}
        </div>

        {/* Create Post Dialog */}
        <Dialog open={isCreatePostDialogOpen} onOpenChange={setIsCreatePostDialogOpen}>
          <DialogContent className="bg-secondary/90 border-white/10 sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-xl">Start a Conversation</DialogTitle>
              <DialogDescription>
                Share your thoughts, questions, or insights with the community.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="post-type" className="text-sm font-medium">Post Type</label>
                <Select defaultValue="article">
                  <SelectTrigger id="post-type" className="bg-transparent border-white/20">
                    <SelectValue placeholder="Select post type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="article">Article</SelectItem>
                    <SelectItem value="question">Question</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="post-title" className="text-sm font-medium">Title</label>
                <Input id="post-title" placeholder="Write a clear, descriptive title" className="bg-transparent border-white/20" />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="post-content" className="text-sm font-medium">Content</label>
                <Textarea 
                  id="post-content" 
                  placeholder="Share your thoughts, ideas, or questions in detail..." 
                  className="bg-transparent border-white/20 min-h-[200px]"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="post-tags" className="text-sm font-medium">Tags (comma separated)</label>
                <Input 
                  id="post-tags"
                  placeholder="e.g. Career, Programming, Learning" 
                  className="bg-transparent border-white/20" 
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="post-category" className="text-sm font-medium">Category</label>
                <Select>
                  <SelectTrigger id="post-category" className="bg-transparent border-white/20">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {FORUM_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category.toLowerCase().replace(/\s+/g, '-')}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsCreatePostDialogOpen(false)}
                className="border-white/20"
              >
                Save Draft
              </Button>
              <Button className="bg-mmk-purple hover:bg-mmk-purple/90">
                Publish
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Post Dialog */}
        <Dialog open={isViewPostDialogOpen} onOpenChange={setIsViewPostDialogOpen}>
          <DialogContent className="bg-secondary/90 border-white/10 sm:max-w-[700px] max-h-[80vh] overflow-y-auto scrollbar-none">
            {selectedPost && (
              <>
                <DialogHeader>
                  <div className="flex gap-2 mb-2">
                    <Badge 
                      variant="secondary" 
                      className={selectedPost.type === 'question' 
                        ? 'bg-mmk-amber/20' 
                        : 'bg-mmk-purple/20'}
                    >
                      {selectedPost.type === 'question' ? 'Question' : 'Article'}
                    </Badge>
                  </div>
                  <DialogTitle className="text-xl font-bold">{selectedPost.title}</DialogTitle>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <img src={selectedPost.authorAvatar} alt={selectedPost.author} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{selectedPost.author}</div>
                        <div className="text-xs text-gray-400">{selectedPost.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <Heart className="h-4 w-4 mr-1" />
                        {selectedPost.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <BookOpen className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                    </div>
                  </div>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                  <div className="prose text-gray-200 max-w-none">
                    <p>{selectedPost.content}</p>
                    <p>This is a longer version of the content that would be visible when viewing the full post. It contains more details, examples, and insights that wouldn't fit in the post preview card.</p>
                    <p>The community can engage with this content through comments, likes, and sharing their own perspectives.</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                    {selectedPost.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="border-white/20">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="pt-4 border-t border-white/10">
                    <h3 className="text-lg font-semibold mb-4">Comments ({selectedPost.comments})</h3>
                    
                    <div className="space-y-4 mb-6">
                      <div className="bg-black/20 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-mmk-purple/20 flex items-center justify-center">
                            <User className="h-3 w-3 text-mmk-purple" />
                          </div>
                          <div className="text-sm font-medium">CodeMaster</div>
                          <div className="text-xs text-gray-400">2 days ago</div>
                        </div>
                        <p className="text-sm text-gray-300">Great insights! I've been exploring this topic as well and found some useful resources that might help others.</p>
                      </div>
                      
                      <div className="bg-black/20 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-mmk-amber/20 flex items-center justify-center">
                            <User className="h-3 w-3 text-mmk-amber" />
                          </div>
                          <div className="text-sm font-medium">LearningDaily</div>
                          <div className="text-xs text-gray-400">Yesterday</div>
                        </div>
                        <p className="text-sm text-gray-300">Have you tried the approach mentioned in the latest research paper? It seems to address some of the challenges you're facing.</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="comment" className="text-sm font-medium">Add a comment</label>
                      <div className="flex gap-2">
                        <Textarea id="comment" placeholder="Share your thoughts..." className="bg-transparent border-white/20" />
                        <Button className="bg-mmk-purple hover:bg-mmk-purple/90 self-end">Post</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default ForumBlogs;
