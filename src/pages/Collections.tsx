import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { collectionApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Plus, Layers, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Collections() {
  const [collections, setCollections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      const data = await collectionApi.getAll();
      setCollections(data);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading collections",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCollection = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      description: formData.get("description"),
    };

    try {
      await collectionApi.create(data);
      toast({
        title: "Collection created",
        description: "Your collection has been added successfully.",
      });
      setIsDialogOpen(false);
      loadCollections();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error creating collection",
        description: error.message,
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Collections</h1>
            <p className="text-muted-foreground">
              Group related bookmarks into collections
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full bg-gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                New Collection
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Collection</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddCollection} className="space-y-4">
                <div>
                  <Label htmlFor="name">Collection Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., Learning Resources"
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
                  Create Collection
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading collections...</p>
          </div>
        ) : collections.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <Card
                key={collection.id}
                className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-success/10">
                    <Layers className="h-6 w-6 text-success" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{collection.name}</h3>
                {collection.description && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {collection.description}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  {collection.bookmarkCount || 0} bookmarks
                </p>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Layers className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No collections yet</h3>
            <p className="text-muted-foreground mb-6">
              Create collections to group related bookmarks
            </p>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="rounded-full bg-gradient-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Collection
            </Button>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
