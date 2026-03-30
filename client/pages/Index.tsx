import { Link } from "react-router-dom";
import { ArrowRight, Zap, Palette, Code2, Share2 } from "lucide-react";

export default function Index() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground font-bold text-lg">
                A
              </div>
              <span className="text-lg font-semibold text-foreground">AppForge</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition">
                Features
              </a>
              <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition">
                How it Works
              </a>
            </nav>
            <Link
              to="/builder"
              className="inline-flex items-center justify-center rounded-lg bg-accent px-5 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90 transition"
            >
              Start Building
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1 text-sm font-medium text-foreground mb-6">
              <span className="h-2 w-2 rounded-full bg-accent"></span>
              Introducing AppForge
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
              Design your app idea in seconds
            </h1>
            
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              Describe your app concept and let AI generate beautiful UI designs, screen layouts, and production-ready code. From idea to prototype in minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                to="/task-manager"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-8 py-3 text-base font-medium text-accent-foreground hover:bg-accent/90 transition"
              >
                Start Building Free
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a href="#how-it-works" className="inline-flex items-center justify-center rounded-lg border border-border px-8 py-3 text-base font-medium text-foreground hover:bg-secondary transition">
                Learn More
              </a>
            </div>

            {/* Hero Image Placeholder */}
            <div className="rounded-xl border border-border bg-secondary/30 aspect-video flex items-center justify-center">
              <div className="text-center">
                <div className="h-16 w-16 rounded-lg bg-accent/10 mx-auto mb-4 flex items-center justify-center">
                  <Code2 className="h-8 w-8 text-accent" />
                </div>
                <p className="text-muted-foreground">AI-generated app preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Powerful features
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to transform ideas into reality
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="rounded-lg border border-border bg-white p-8">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Instant Generation
              </h3>
              <p className="text-sm text-muted-foreground">
                Describe your app idea and get UI layouts, screens, and code instantly powered by AI
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-lg border border-border bg-white p-8">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Palette className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Design System
              </h3>
              <p className="text-sm text-muted-foreground">
                Beautiful, cohesive design with modern aesthetics, color palettes, and typography
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-lg border border-border bg-white p-8">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Code2 className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Production Code
              </h3>
              <p className="text-sm text-muted-foreground">
                Export clean, modular React or HTML/CSS code ready for production use
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-lg border border-border bg-white p-8">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Share2 className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Easy Collaboration
              </h3>
              <p className="text-sm text-muted-foreground">
                Share projects with your team and iterate together on app designs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              How it works
            </h2>
            <p className="text-lg text-muted-foreground">
              Three simple steps to bring your app to life
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-accent">1</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Describe Your Idea
              </h3>
              <p className="text-muted-foreground">
                Tell us about your app concept, target audience, and key features in plain English
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-accent">2</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                AI Generation
              </h3>
              <p className="text-muted-foreground">
                Our AI analyzes your requirements and generates screens, layout, and design system
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-accent">3</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Export & Build
              </h3>
              <p className="text-muted-foreground">
                Get clean, production-ready code to start building immediately
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-accent/5 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Ready to build?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Start designing your app today. No signup required. Just describe your idea and let AI generate beautiful UI.
          </p>
          <Link
            to="/builder"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-8 py-4 text-base font-medium text-accent-foreground hover:bg-accent/90 transition"
          >
            Start Building Now
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-white py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground font-bold text-lg">
                  A
                </div>
                <span className="text-lg font-semibold text-foreground">AppForge</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Design and prototype apps with AI
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition">About</a></li>
                <li><a href="#" className="hover:text-foreground transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-muted-foreground">
              © 2024 AppForge. All rights reserved.
            </p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition">Twitter</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition">GitHub</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition">Discord</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
