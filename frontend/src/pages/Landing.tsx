import { Smartphone, LockKeyhole, Rocket } from 'lucide-react';

export const LandingPage = () => {
  return (
    <>
      <main className="relative min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-5 py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase leading-none mb-8 text-text-primary brutal-text-shadow">
                Organize<br />
                Your<br />
                Home
              </h1>

              <p className="text-2xl md:text-3xl font-bold text-text-primary uppercase tracking-wide mb-12 leading-relaxed">
                Keep track of manuals,<br />
                schedules, and maintenance<br />
                for everything in your home.
              </p>

              <div className="flex flex-col sm:flex-row gap-6">
                <button className="brutal-btn-primary">Get Started</button>
                <button className="brutal-btn-secondary">Learn More</button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white border-8 border-text-primary p-8 brutal-shadow-dark">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-16 h-16 bg-primary border-4 border-text-primary flex items-center justify-center text-2xl font-black text-white brutal-rotate-slight-left">
                    📋
                  </div>
                  <div>
                    <h3 className="text-2xl font-black uppercase text-text-primary">Manual Storage</h3>
                    <p className="text-text-secondary font-bold uppercase text-sm">Never lose another manual</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 mb-8">
                  <div className="w-16 h-16 bg-secondary border-4 border-text-primary flex items-center justify-center text-2xl font-black text-white brutal-rotate-slight-right">
                    ⏰
                  </div>
                  <div>
                    <h3 className="text-2xl font-black uppercase text-text-primary">Smart Schedules</h3>
                    <p className="text-text-secondary font-bold uppercase text-sm">Automated maintenance reminders</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-accent border-4 border-text-primary flex items-center justify-center text-2xl font-black text-white brutal-rotate-slight-left">
                    👥
                  </div>
                  <div>
                    <h3 className="text-2xl font-black uppercase text-text-primary">Family Sharing</h3>
                    <p className="text-text-secondary font-bold uppercase text-sm">Collaborate with household members</p>
                  </div>
                </div>
              </div>

              <div className="absolute -top-8 -right-8 bg-primary border-6 border-text-primary p-6 brutal-rotate-slight-right">
                <div className="text-4xl font-black text-white leading-none">47</div>
                <div className="text-white font-bold uppercase text-sm">Manuals Stored</div>
              </div>

              <div className="absolute -bottom-20 -left-8 bg-accent border-6 border-text-primary p-6 brutal-rotate-slight-left">
                <div className="text-4xl font-black text-white leading-none">12</div>
                <div className="text-white font-bold uppercase text-sm">Tasks Completed</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className="bg-text-primary border-t-8 border-primary py-16">
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary border-6 border-white flex items-center justify-center text-3xl font-black text-white mx-auto mb-6">
                <Smartphone size="42"/>
              </div>
              <h3 className="text-2xl font-black text-white uppercase mb-4">Mobile Ready</h3>
              <p className="text-white font-bold uppercase text-sm">Access your home data anywhere, anytime.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-secondary border-6 border-white flex items-center justify-center text-3xl font-black text-white mx-auto mb-6">
                <LockKeyhole size="42"/>
              </div>
              <h3 className="text-2xl font-black text-white uppercase mb-4">Secure Storage</h3>
              <p className="text-white font-bold uppercase text-sm">Your documents are encrypted and protected.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-accent border-6 border-white flex items-center justify-center text-3xl font-black text-white mx-auto mb-6">
                <Rocket size="42"/>
              </div>
              <h3 className="text-2xl font-black text-white uppercase mb-4">Easy Setup</h3>
              <p className="text-white font-bold uppercase text-sm">Get organized in minutes, not hours.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary py-20">
        <div className="max-w-4xl mx-auto px-5 text-center">
          <h2 className="text-5xl md:text-6xl font-black text-white uppercase mb-8 brutal-text-shadow-white">
            Ready to Get<br />Organized?
          </h2>
          <p className="text-2xl font-bold text-white uppercase mb-12">
            Join thousands of homeowners who've simplified their lives.
          </p>
          <button className="bg-white text-text-primary border-6 border-text-primary px-12 py-6 font-black text-2xl uppercase tracking-wide transition-all duration-100">
            Start Free Today
          </button>
        </div>
      </section>

      <footer className="bg-text-primary border-t-8 border-primary py-12">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-4 mb-6 md:mb-0">
              <div className="w-16 h-16 bg-primary border-4 border-white flex items-center justify-center text-2xl font-black text-white">
                🏠
              </div>
              <span className="text-3xl font-black text-white uppercase">HomeKeeper</span>
            </div>

            <div className="flex gap-8">
              <a href="#" className="text-white font-bold uppercase hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="text-white font-bold uppercase hover:text-primary transition-colors">Terms</a>
              <a href="#" className="text-white font-bold uppercase hover:text-primary transition-colors">Support</a>
            </div>
          </div>

          <div className="border-t border-white mt-8 pt-8 text-center">
            <p className="text-white font-bold uppercase text-sm">
              © 2025 HomeKeeper. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};
