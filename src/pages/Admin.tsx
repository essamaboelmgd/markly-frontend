import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Users,
  Bookmark,
  FolderOpen,
  Layers,
  Tag,
  BarChart3,
  Settings,
  TrendingUp,
  Activity,
} from "lucide-react";

export default function Admin() {
  const stats = [
    { icon: Users, label: "Total Users", value: "1,234", change: "+12%" },
    { icon: Bookmark, label: "Total Bookmarks", value: "45,678", change: "+8%" },
    { icon: FolderOpen, label: "Categories", value: "234", change: "+5%" },
    { icon: Layers, label: "Collections", value: "567", change: "+15%" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-admin-accent/10">
                <Shield className="h-6 w-6 text-admin-accent" />
              </div>
              <h1 className="text-3xl font-bold">Super Admin Panel</h1>
            </div>
            <p className="text-muted-foreground">
              Manage and monitor your entire platform
            </p>
          </div>
          <Button className="bg-admin-accent hover:bg-admin-accent/90">
            <Settings className="h-4 w-4 mr-2" />
            System Settings
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="p-6 border-admin-accent/20 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-admin-accent/10">
                  <stat.icon className="h-6 w-6 text-admin-accent" />
                </div>
                <span className="text-success text-sm font-medium">{stat.change}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">User Management</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              View, edit, and manage user accounts
            </p>
            <Button variant="outline" className="w-full">
              Manage Users
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Bookmark className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">Bookmark Moderation</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Review and moderate user bookmarks
            </p>
            <Button variant="outline" className="w-full">
              View Bookmarks
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <FolderOpen className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">Category Management</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Create and manage system categories
            </p>
            <Button variant="outline" className="w-full">
              Manage Categories
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Layers className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">Collection Management</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Manage featured collections
            </p>
            <Button variant="outline" className="w-full">
              Manage Collections
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Tag className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">Tag Management</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Monitor and manage system tags
            </p>
            <Button variant="outline" className="w-full">
              Manage Tags
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">Analytics Dashboard</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              View detailed system analytics
            </p>
            <Button variant="outline" className="w-full">
              View Analytics
            </Button>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Recent Activity</h2>
          </div>
          <div className="space-y-3">
            {[
              { user: "John Doe", action: "created a new account", time: "2 minutes ago" },
              { user: "Jane Smith", action: "added 5 bookmarks", time: "10 minutes ago" },
              { user: "Bob Johnson", action: "created a category", time: "1 hour ago" },
              { user: "Alice Brown", action: "shared a collection", time: "2 hours ago" },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-medium text-primary">
                      {activity.user.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">
                      {activity.user}{" "}
                      <span className="text-muted-foreground font-normal">
                        {activity.action}
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* System Health */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="h-5 w-5 text-success" />
            <h2 className="text-xl font-semibold">System Health</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { label: "Server Status", value: "Operational", status: "success" },
              { label: "API Response Time", value: "45ms", status: "success" },
              { label: "Database Load", value: "23%", status: "success" },
            ].map((metric, index) => (
              <div key={index} className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-2">{metric.label}</p>
                <p className="text-2xl font-bold text-success">{metric.value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
