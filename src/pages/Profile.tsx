import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { User, Mail, Calendar, Bookmark, Star } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();

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
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold mb-1">{user?.name}</h2>
              <p className="text-sm text-muted-foreground mb-4">{user?.email}</p>
              <Button variant="outline" className="w-full rounded-full">
                Change Avatar
              </Button>
            </div>
          </Card>

          {/* Information Form */}
          <Card className="p-6 md:col-span-2">
            <h3 className="text-lg font-semibold mb-6">Personal Information</h3>
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      defaultValue={user?.name}
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
                      defaultValue={user?.email}
                      className="pl-10"
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Input
                  id="bio"
                  placeholder="Tell us about yourself"
                />
              </div>
              <Button className="bg-gradient-primary">Save Changes</Button>
            </form>
          </Card>
        </div>

        {/* Stats */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Usage Statistics</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Bookmark, label: "Total Bookmarks", value: "0" },
              { icon: Star, label: "Favorites", value: "0" },
              { icon: Calendar, label: "Member Since", value: "2025" },
              { icon: User, label: "Profile Views", value: "0" },
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

        {/* Security */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Security Settings</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                placeholder="••••••••"
              />
            </div>
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="••••••••"
              />
            </div>
            <Button variant="outline">Update Password</Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
