import React, { memo } from "react";
import { Link } from "wouter";
import { ArrowRight, Play, Users, Target, Code2, Megaphone, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const HERO_BG_CDN_URL = "https://res.cloudinary.com/doeodacsg/image/upload/f_auto,q_auto/v1788351134/godivatech/herosection/hero-full-bg.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-[92vh] lg:min-h-screen bg-[#03050E] text-white flex items-center pt-28 pb-16 lg:pt-32 lg:pb-20 overflow-hidden">
      {/* 16:9 Full Master Background Canvas (Rendered via high-priority Image from CDN) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <img 
          src={HERO_BG_CDN_URL} 
          alt="Next-Gen Technology Solutions Master Canvas"
          className="w-full h-full object-cover object-center select-none"
          loading="eager"
          // @ts-ignore
          fetchpriority="high"
        />
        {/* Soft edge blending gradient on mobile */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#03050E]/80 via-transparent to-transparent lg:hidden" />
      </div>

      {/* Calibrated Overlay Elements for the 3D Tablet in 16:9 Space (Desktop) */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none z-10">
        {/* Tablet Screen Text Header */}
        <div 
          className="absolute transform -translate-y-1/2 -rotate-6 skew-y-2 select-none"
          style={{ left: '63.5%', top: '38%' }}
        >
          <div className="text-xl lg:text-2xl xl:text-[27px] font-semibold text-white tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            Innovative Solutions
          </div>
          <div className="text-base lg:text-lg xl:text-xl font-light text-slate-200 tracking-wide mt-1 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            for a Digital World
          </div>
          <div className="w-14 h-0.5 bg-gradient-to-r from-cyan-400 to-transparent mt-2 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
        </div>

        {/* Floating Glass Card 1: Software Development (Left of Tablet) */}
        <motion.div 
          className="absolute -translate-x-1/2 -translate-y-1/2 p-3.5 xl:p-4 rounded-2xl bg-[#090d21]/80 border border-cyan-500/35 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.7)] flex flex-col items-center justify-center text-center w-[120px] xl:w-[130px] pointer-events-auto hover:border-cyan-400 transition-colors group cursor-default"
          style={{ left: '54%', top: '53.4%' }}
          animate={{ y: [-2, -8, -2] }}
          transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.35)] mb-2 group-hover:scale-110 transition-transform">
            <Code2 className="w-5 h-5" />
          </div>
          <div className="text-xs font-semibold text-white tracking-wide leading-tight">Software</div>
          <div className="text-[11px] text-slate-300 font-medium leading-tight mt-0.5">Development</div>
        </motion.div>

        {/* Floating Glass Card 2: Digital Marketing (Top Right of Tablet) */}
        <motion.div 
          className="absolute -translate-x-1/2 -translate-y-1/2 p-3.5 xl:p-4 rounded-2xl bg-[#090d21]/80 border border-purple-500/35 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.7)] flex flex-col items-center justify-center text-center w-[120px] xl:w-[130px] pointer-events-auto hover:border-purple-400 transition-colors group cursor-default"
          style={{ left: '83.2%', top: '29.1%' }}
          animate={{ y: [2, 8, 2] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 }}
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.35)] mb-2 group-hover:scale-110 transition-transform">
            <Megaphone className="w-5 h-5" />
          </div>
          <div className="text-xs font-semibold text-white tracking-wide leading-tight">Digital</div>
          <div className="text-[11px] text-slate-300 font-medium leading-tight mt-0.5">Marketing</div>
        </motion.div>

        {/* Floating Glass Card 3: Growth Strategy (Bottom Right of Tablet) */}
        <motion.div 
          className="absolute -translate-x-1/2 -translate-y-1/2 p-3.5 xl:p-4 rounded-2xl bg-[#090d21]/80 border border-indigo-500/35 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.7)] flex flex-col items-center justify-center text-center w-[120px] xl:w-[130px] pointer-events-auto hover:border-indigo-400 transition-colors group cursor-default"
          style={{ left: '83.2%', top: '67.3%' }}
          animate={{ y: [-2, -8, -2] }}
          transition={{ repeat: Infinity, duration: 4.8, ease: "easeInOut", delay: 1 }}
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.35)] mb-2 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="text-xs font-semibold text-white tracking-wide leading-tight">Growth</div>
          <div className="text-[11px] text-slate-300 font-medium leading-tight mt-0.5">Strategy</div>
        </motion.div>
      </div>

      {/* Main Content Container (Left Side on Desktop) */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[65vh]">
          
          {/* ================= LEFT COLUMN: Value Proposition, CTAs & Proof ================= */}
          <motion.div 
            className="lg:col-span-7 xl:col-span-6 text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Pill Badge */}
            <motion.div 
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-blue-400/25 backdrop-blur-md mb-6 sm:mb-8 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <span className="text-xs sm:text-sm font-medium tracking-wide text-white/90 flex items-center gap-2">
                <span className="text-base leading-none">🚀</span>
                Next-Gen Technology Solutions
              </span>
            </motion.div>

            {/* Main Headline (H1) */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] xl:text-[62px] font-extrabold tracking-tight text-white leading-[1.08] mb-6">
              <span className="block text-white">Digital Marketing.</span>
              <span className="block text-white mt-1">Software Solutions.</span>
              <span className="block mt-1 bg-gradient-to-r from-[#00D2FF] via-[#818CF8] to-[#D946EF] bg-clip-text text-transparent pb-1">
                Real Business Impact.
              </span>
            </h1>

            {/* Supporting Subtitle */}
            <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 mb-8 sm:mb-10 leading-relaxed font-normal">
              We help businesses grow their online presence, generate quality leads, and build powerful software that drives efficiency and scale.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10 sm:mb-12">
              <Link href="/contact" className="w-full sm:w-auto">
                <button 
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:from-[#4338CA] hover:to-[#6D28D9] shadow-[0_0_25px_rgba(124,58,237,0.45)] hover:shadow-[0_0_35px_rgba(124,58,237,0.65)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer text-base"
                >
                  <span>Start a Project</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>

              <Link href="/services" className="w-full sm:w-auto">
                <button 
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-medium text-white bg-[#0B0F19]/90 hover:bg-[#121829] border border-white/10 hover:border-white/20 backdrop-blur-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer text-base"
                >
                  <span>Explore Solutions</span>
                  <div className="w-5 h-5 rounded-full border border-white/30 flex items-center justify-center">
                    <Play className="w-2 h-2 text-white fill-white translate-x-0.5" />
                  </div>
                </button>
              </Link>
            </div>

            {/* Social Proof Counters */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 sm:gap-12 pt-2">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full border border-white/15 bg-white/[0.03] flex items-center justify-center text-white/80 shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-none mb-1">150+</div>
                  <div className="text-xs sm:text-sm text-slate-400 font-medium">Happy Clients</div>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full border border-white/15 bg-white/[0.03] flex items-center justify-center text-white/80 shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-none mb-1">250+</div>
                  <div className="text-xs sm:text-sm text-slate-400 font-medium">Projects Delivered</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right spacer for layout balance on large screens */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-6" />

        </div>
      </div>
    </section>
  );
};

HeroSection.displayName = "HeroSection";
export default memo(HeroSection);


