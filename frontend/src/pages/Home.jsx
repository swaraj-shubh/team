import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      
      {/* HERO SECTION */}
      <div className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-6 py-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Glowing Logo/Title */}
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-emerald-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <h1 className="relative text-6xl md:text-8xl font-black bg-gradient-to-r from-sky-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-2xl">
              NUMERANO
            </h1>
          </div>

          <div className="relative mb-8">
            <p className="text-2xl md:text-3xl text-slate-300 font-medium mb-2">
              The Official Mathematics Club of
            </p>
            <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
              Dayananda Sagar College of Engineering
            </p>
          </div>

          <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            Where brilliant minds unite to explore the beauty of mathematics through 
            innovation, collaboration, and groundbreaking problem-solving.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={() => navigate("/register")}
              className="group relative px-10 py-4 bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 rounded-2xl text-white font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl"
            >
              <div className="absolute inset-0 bg-white/10 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative flex items-center gap-3">
                Register Your Team 
                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>

            <button
              onClick={() => navigate("/auth")}
              className="group px-10 py-4 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-slate-600 rounded-2xl text-white font-semibold text-xl transition-all duration-300 backdrop-blur-sm"
            >
              <span className="flex items-center gap-3">
                Member Login
                <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
            </button>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute -bottom-30 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
                Why Join Numerano?
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Discover a world where mathematics meets innovation, creativity, and real-world application
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group relative bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-sm rounded-3xl p-8 border border-slate-800/50 hover:border-sky-500/30 transition-all duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 to-emerald-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="inline-flex p-4 bg-gradient-to-r from-sky-500/20 to-sky-600/20 rounded-2xl mb-6">
                  <span className="text-3xl">🧠</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Mathematical Excellence</h3>
                <p className="text-slate-400 leading-relaxed">
                  Master complex concepts through hands-on workshops, expert-led sessions, and 
                  cutting-edge problem-solving techniques that push your analytical boundaries.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group relative bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-sm rounded-3xl p-8 border border-slate-800/50 hover:border-emerald-500/30 transition-all duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-blue-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="inline-flex p-4 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-2xl mb-6">
                  <span className="text-3xl">🚀</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Competitive Spirit</h3>
                <p className="text-slate-400 leading-relaxed">
                  Engage in thrilling competitions that test your logical reasoning, 
                  creativity, and teamwork while competing for prestigious awards and recognition.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group relative bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-sm rounded-3xl p-8 border border-slate-800/50 hover:border-purple-500/30 transition-all duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="inline-flex p-4 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-2xl mb-6">
                  <span className="text-3xl">🤝</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Collaborative Community</h3>
                <p className="text-slate-400 leading-relaxed">
                  Join a vibrant network of passionate mathematicians, collaborate on 
                  innovative projects, and build lifelong connections with like-minded peers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STATS SECTION */}
      <div className="py-16 px-6 bg-gradient-to-r from-slate-900/50 to-slate-950/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent mb-2">50+</div>
              <div className="text-slate-400">Active Members</div>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent mb-2">10+</div>
              <div className="text-slate-400">Events Hosted</div>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent mb-2">25+</div>
              <div className="text-slate-400">Teams Registered</div>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent mb-2">100%</div>
              <div className="text-slate-400">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* FINAL CTA SECTION */}
      <div className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-transparent to-emerald-500/10"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex p-4 bg-gradient-to-r from-sky-500/20 to-emerald-500/20 rounded-3xl mb-8">
            <span className="text-4xl">🎯</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Solve the 
            <span className="bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent"> Next Challenge?</span>
          </h2>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Join hundreds of brilliant minds and embark on a mathematical journey 
            that will redefine your problem-solving abilities.
          </p>
          <button
            onClick={() => navigate("/register")}
            className="group relative px-12 py-5 bg-gradient-to-r from-sky-600 via-blue-600 to-emerald-600 hover:from-sky-500 hover:via-blue-500 hover:to-emerald-500 rounded-2xl text-white font-bold text-xl transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-3xl"
          >
            <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
            <span className="relative flex items-center justify-center gap-3">
              Register Now For Free
              <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </span>
          </button>
          <p className="text-slate-500 mt-6 text-sm">
            No registration fees • Open to all DSCE students • Limited spots available
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="relative py-8 px-6 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <div className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                NUMERANO
              </div>
              <p className="text-slate-500 text-sm">
                Mathematics Club • Dayananda Sagar College of Engineering
              </p>
            </div>
            <div className="text-center">
              <p className="text-slate-500 text-sm mb-2">
                © {new Date().getFullYear()} Numerano. All rights reserved.
              </p>
              <p className="text-slate-600 text-xs">
                Crafted with ❤️ for the love of mathematics
              </p>
            </div>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-colors">
                <span className="text-slate-400">📘</span>
              </a>
              <a href="#" className="p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-colors">
                <span className="text-slate-400">📷</span>
              </a>
              <a href="#" className="p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-colors">
                <span className="text-slate-400">🐦</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
