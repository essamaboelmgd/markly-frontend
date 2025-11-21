import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { bookmarkApi, authApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Calendar, Bookmark, Star } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState(user?.username || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadStats();
    if (user) {
      setUsername(user.username || "");
    }
  }, [user]);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      // Fetch all bookmarks
      const bookmarks = await bookmarkApi.getAll();
      setBookmarkCount(bookmarks.length);
      
      // Count favorites
      const favorites = bookmarks.filter((b: any) => b.is_fav);
      setFavoriteCount(favorites.length);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading stats",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      // Validate password fields if they are being updated
      if (newPassword || confirmPassword) {
        if (newPassword !== confirmPassword) {
          toast({
            variant: "destructive",
            title: "Password Error",
            description: "New passwords do not match",
          });
          setIsUpdating(false);
          return;
        }
        
        if (newPassword.length < 6) {
          toast({
            variant: "destructive",
            title: "Password Error",
            description: "Password must be at least 6 characters long",
          });
          setIsUpdating(false);
          return;
        }
        
        if (!currentPassword) {
          toast({
            variant: "destructive",
            title: "Password Error",
            description: "Please enter your current password",
          });
          setIsUpdating(false);
          return;
        }
      }
      
      // Prepare update payload
      const updatePayload: any = {};
      
      if (username !== user?.username) {
        updatePayload.username = username;
      }
      
      if (newPassword) {
        updatePayload.password = newPassword;
      }
      
      // If no updates, show message
      if (Object.keys(updatePayload).length === 0) {
        toast({
          title: "No Changes",
          description: "No changes to save",
        });
        setIsUpdating(false);
        return;
      }
      
      // Make API call to update profile
      const response = await fetch("https://markly-api.essamaboelmgd.cloud/api/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify(updatePayload),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }
      
      // Refresh user profile by fetching it again
      try {
        const updatedUser = await authApi.getProfile();
        // We could update the context here if needed, but for now we'll just show a success message
      } catch (error) {
        console.error("Error refreshing user profile:", error);
      }
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      
      // Reset password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "Failed to update profile",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-up max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold mb-2">Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and preferences
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="p-6 md:col-span-1">
            <div className="text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarFallback className="bg-gradient-primary text-white text-2xl">
                  {user?.username?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold mb-1">{user?.username}</h2>
              <p className="text-sm text-muted-foreground mb-4">{user?.email}</p>
              <Button variant="outline" className="w-full rounded-full">
                Change Avatar
              </Button>
            </div>
          </Card>

          {/* Information Form */}
          <Card className="p-6 md:col-span-2">
            <h3 className="text-lg font-semibold mb-6">Personal Information</h3>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ""}
                      className="pl-10"
                      disabled
                    />
                  </div>
                </div>
              </div>
              
              {/* Password Update Section */}
              <div className="border-t pt-4 mt-4">
                <h4 className="text-md font-semibold mb-4">Change Password</h4>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="bg-gradient-primary"
                disabled={isUpdating}
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </Card>
        </div>

        {/* Stats */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Usage Statistics</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Bookmark, label: "Total Bookmarks", value: isLoading ? "..." : bookmarkCount.toString() },
              { icon: Star, label: "Favorites", value: isLoading ? "..." : favoriteCount.toString() },
              { icon: Calendar, label: "Member Since", value: "2025" },
              { icon: User, label: "Profile Views", value: "Coming Soon" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-2xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}