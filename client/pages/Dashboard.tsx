import { Link } from "react-router-dom";
import { Plus, Folder, Clock, Share2, MoreVertical } from "lucide-react";

export default function Dashboard() {
  const projects = [
    {
      id: 1,
      name: "E-commerce Platform",
      platform: "web",
      created: "2 days ago",
      modified: "Today",
      description: "Full-featured online store with product catalog and checkout",
    },
    {
      id: 2,
      name: "Task Manager",
      platform: "web",
      created: "1 week ago",
      modified: "3 days ago",
      description: "Team collaboration tool for managing projects and tasks",
    },
    {
      id: 3,
      name: "Fitness Tracker",
      platform: "mobile",
      created: "2 weeks ago",
      modified: "5 days ago",
      description: "Mobile app to track workouts and nutrition",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-border bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Projects</h1>
              <p className="mt-1 text-muted-foreground">
                Manage and create your app designs
              </p>
            </div>
            <Link
              to="/builder"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground hover:bg-accent/90 transition"
            >
              <Plus className="h-5 w-5" />
              New Project
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="rounded-lg border border-border bg-white hover:shadow-lg transition overflow-hidden group"
            >
              {/* Preview Area */}
              <div className="aspect-video bg-gradient-to-br from-secondary/50 to-secondary flex items-center justify-center group-hover:from-secondary to-secondary/50 transition">
                <div className="text-center">
                  <Folder className="h-12 w-12 text-accent/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {project.platform === "web" ? "Web" : "Mobile"} App
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {project.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {project.description}
                </p>

                {/* Metadata */}
                <div className="space-y-2 mb-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Modified {project.modified}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    to="/builder"
                    className="flex-1 px-3 py-2 rounded-lg border border-border text-center text-sm font-medium text-foreground hover:bg-secondary transition"
                  >
                    Open
                  </Link>
                  <button className="px-3 py-2 rounded-lg border border-border text-foreground hover:bg-secondary transition">
                    <Share2 className="h-4 w-4" />
                  </button>
                  <button className="px-3 py-2 rounded-lg border border-border text-foreground hover:bg-secondary transition">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
