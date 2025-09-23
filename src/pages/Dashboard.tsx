import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Copy, Eye, Heart, Edit, Trash2, Search, Filter, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCopy, setEditingCopy] = useState<any>(null);

  const copies = useQuery(api.copies.list, user ? { userId: user._id } : "skip");
  const categories = useQuery(api.categories.list, {});
  const createCopy = useMutation(api.copies.create);
  const updateCopy = useMutation(api.copies.update);
  const deleteCopy = useMutation(api.copies.remove);
  const toggleLike = useMutation(api.copies.toggleLike);

  const [newCopy, setNewCopy] = useState({
    title: "",
    content: "",
    category: "general",
    tags: [] as string[],
  });

  const filteredCopies = copies?.filter(copy => {
    const matchesSearch = copy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         copy.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || copy.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const handleCreateCopy = async () => {
    if (!newCopy.title.trim() || !newCopy.content.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createCopy(newCopy);
      toast.success("Copy created successfully!");
      setNewCopy({ title: "", content: "", category: "general", tags: [] });
      setIsCreateDialogOpen(false);
    } catch (error) {
      toast.error("Failed to create copy");
    }
  };

  const handleUpdateCopy = async () => {
    if (!editingCopy) return;

    try {
      await updateCopy({
        id: editingCopy._id,
        title: editingCopy.title,
        content: editingCopy.content,
        category: editingCopy.category,
        tags: editingCopy.tags,
      });
      toast.success("Copy updated successfully!");
      setEditingCopy(null);
    } catch (error) {
      toast.error("Failed to update copy");
    }
  };

  const handleDeleteCopy = async (id: string) => {
    try {
      await deleteCopy({ id: id as any });
      toast.success("Copy deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete copy");
    }
  };

  const handleCopyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleLike = async (id: string) => {
    try {
      await toggleLike({ id: id as any });
    } catch (error) {
      toast.error("Failed to like copy");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img src="/logo.svg" alt="CopyVault" className="h-8 w-8" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">CopyVault</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Welcome, {user?.name || user?.email || "User"}
              </span>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search your copies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="social">Social Media</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="ads">Advertisements</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="whitespace-nowrap">
                <Plus className="h-4 w-4 mr-2" />
                New Copy
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Copy</DialogTitle>
                <DialogDescription>
                  Add a new piece of copy to your vault
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newCopy.title}
                    onChange={(e) => setNewCopy({ ...newCopy, title: e.target.value })}
                    placeholder="Enter copy title..."
                  />
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={newCopy.content}
                    onChange={(e) => setNewCopy({ ...newCopy, content: e.target.value })}
                    placeholder="Enter your copy content..."
                    rows={6}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={newCopy.category} onValueChange={(value) => setNewCopy({ ...newCopy, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="social">Social Media</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="ads">Advertisements</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateCopy}>Create Copy</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Copy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCopies.map((copy, index) => (
            <motion.div
              key={copy._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">{copy.title}</CardTitle>
                      <CardDescription className="mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {copy.category}
                        </Badge>
                      </CardDescription>
                    </div>
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingCopy(copy)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCopy(copy._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-4 mb-4">
                    {copy.content}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {copy.views}
                      </span>
                      <span className="flex items-center">
                        <Heart className="h-3 w-3 mr-1" />
                        {copy.likes}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(copy._id)}
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyToClipboard(copy.content)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredCopies.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Copy className="h-16 w-16 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No copies found
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {searchTerm || selectedCategory !== "all" 
                  ? "Try adjusting your search or filter criteria"
                  : "Get started by creating your first copy"}
              </p>
            </div>
            {!searchTerm && selectedCategory === "all" && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Copy
              </Button>
            )}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={!!editingCopy} onOpenChange={() => setEditingCopy(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Copy</DialogTitle>
              <DialogDescription>
                Make changes to your copy
              </DialogDescription>
            </DialogHeader>
            {editingCopy && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={editingCopy.title}
                    onChange={(e) => setEditingCopy({ ...editingCopy, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-content">Content</Label>
                  <Textarea
                    id="edit-content"
                    value={editingCopy.content}
                    onChange={(e) => setEditingCopy({ ...editingCopy, content: e.target.value })}
                    rows={6}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-category">Category</Label>
                  <Select value={editingCopy.category} onValueChange={(value) => setEditingCopy({ ...editingCopy, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="social">Social Media</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="ads">Advertisements</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setEditingCopy(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateCopy}>Save Changes</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
