import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { categoryApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Plus, FolderOpen, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Categories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryApi.getAll();
      setCategories(data);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading categories",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      description: formData.get("description"),
    };

    try {
      await categoryApi.create(data);
      toast({
        title: "Category created",
        description: "Your category has been added successfully.",
      });
      setIsDialogOpen(false);
      loadCategories();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error creating category",
        description: error.message,
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Categories</h1>
            <p className="text-muted-foreground">
              Organize your bookmarks into categories
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full bg-gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Category</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div>
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., Development"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description (optional)</Label>
                  <Input
                    id="description"
                    name="description"
                    placeholder="Brief description"
                  />
                </div>
                <Button type="submit" className="w-full bg-gradient-primary">
                  Create Category
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading categories...</p>
          </div>
        ) : categories.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card
                key={category.id}
                className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-accent/10">
                    <FolderOpen className="h-6 w-6 text-accent" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                {category.description && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {category.description}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  {category.bookmarkCount || 0} bookmarks
                </p>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <FolderOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No categories yet</h3>
            <p className="text-muted-foreground mb-6">
              Create categories to organize your bookmarks
            </p>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="rounded-full bg-gradient-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Category
            </Button>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
