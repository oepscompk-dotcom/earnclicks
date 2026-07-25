'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Zap, Users, Globe, Heart, ArrowRight, Target, Award, TrendingUp, Lock } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
        <div className="container relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4">About Us</Badge>
            <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl">
              The Future of{' '}
              <span className="text-primary">Social Media Earning</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              EarnClicks was founded with a simple mission: make social media engagement rewarding for everyone. 
              We connect brands with real people who genuinely engage with their content.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">Our Story</Badge>
              <h2 className="text-3xl font-bold mb-6">
                We Believe in <span className="text-primary">Fair Value</span> Exchange
              </h2>
              <p className="text-muted-foreground mb-4">
                In a world where social media algorithms control what people see, we created EarnClicks to empower both 
                content creators and brands. Our platform ensures that every interaction is genuine, every reward is fair, 
                and every campaign reaches real people.
              </p>
              <p className="text-muted-foreground">
                Since our launch, we have helped over 50,000 users earn rewards while assisting 5,000+ advertisers 
                grow their social media presence authentically.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Users, value: '50K+', label: 'Active Users', color: 'text-blue-500' },
                { icon: Globe, value: '195+', label: 'Countries', color: 'text-green-500' },
                { icon: TrendingUp, value: '$2.5M+', label: 'Paid Out', color: 'text-purple-500' },
                { icon: Award, value: '1M+', label: 'Tasks Completed', color: 'text-orange-500' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border bg-card p-6 text-center hover:shadow-lg transition-shadow">
                  <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-3`} />
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Our Values</h2>
            <p className="text-muted-foreground mt-2">The principles that guide everything we do</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: 'Trust & Safety', desc: 'Every user is verified, every task is genuine, and every payment is secure. We never compromise on trust.', color: 'bg-blue-500/10 text-blue-500' },
              { icon: Heart, title: 'Community First', desc: 'We build for our users. Your feedback drives our roadmap, and your success is our success.', color: 'bg-rose-500/10 text-rose-500' },
              { icon: Zap, title: 'Innovation', desc: 'We constantly evolve our platform with cutting-edge technology to deliver the best experience possible.', color: 'bg-amber-500/10 text-amber-500' },
              { icon: Target, title: 'Results Driven', desc: 'We focus on real engagement metrics that matter, not vanity numbers that do not convert.', color: 'bg-green-500/10 text-green-500' },
              { icon: Lock, title: 'Privacy Protected', desc: 'Your data is yours. We never sell personal information and comply with all major privacy regulations.', color: 'bg-purple-500/10 text-purple-500' },
              { icon: Award, title: 'Quality Guaranteed', desc: 'Our multi-layer verification ensures that every interaction on our platform meets the highest standards.', color: 'bg-orange-500/10 text-orange-500' },
            ].map((value) => (
              <div key={value.title} className="rounded-xl border bg-card p-6 hover:shadow-lg transition-all duration-300">
                <div className={`inline-flex rounded-lg p-3 ${value.color} mb-4`}>
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Leadership Team</h2>
            <p className="text-muted-foreground mt-2">Meet the people behind EarnClicks</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { name: 'Sarah Chen', role: 'CEO & Co-Founder', bio: 'Former social media executive with 10+ years building platforms that connect brands with audiences.' },
              { name: 'Marcus Rodriguez', role: 'CTO & Co-Founder', bio: 'Full-stack engineer passionate about building scalable systems that handle millions of daily interactions.' },
              { name: 'Aisha Patel', role: 'Head of Operations', bio: 'Operations expert who ensures our platform runs smoothly and our community thrives.' },
            ].map((person) => (
              <div key={person.name} className="text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">
                    {person.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="font-semibold">{person.name}</h3>
                <p className="text-sm text-primary">{person.role}</p>
                <p className="text-sm text-muted-foreground mt-2">{person.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold sm:text-4xl mb-4">
            Ready to Join the Revolution?
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
            Whether you are looking to earn extra income or grow your brand, EarnClicks is the platform for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-xl">
                Start Earning Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
