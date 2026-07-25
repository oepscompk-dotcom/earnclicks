'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ArrowRight } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    desc: 'Perfect for getting started with social media tasks',
    features: [
      'Unlimited task submissions',
      'Access to all platforms',
      'Basic wallet withdrawals',
      '1-level referral commission (10%)',
      'Email support',
      'KYC verification',
    ],
    cta: 'Start Free',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$9.99',
    period: '/month',
    desc: 'For serious earners who want to maximize rewards',
    features: [
      'Everything in Free',
      'Priority task access (2x more tasks)',
      'Instant withdrawals (no queue)',
      '3-level referral commissions (10%/5%/2%)',
      '2x reward multiplier on all tasks',
      'Exclusive VIP-only tasks',
      'Priority support (24h response)',
      'Advanced analytics dashboard',
    ],
    cta: 'Go Pro',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'For businesses, agencies, and large-scale campaigns',
    features: [
      'Everything in Pro',
      'Bulk campaign creation (1000+ tasks)',
      'API access for automation',
      'Dedicated account manager',
      'Custom branding & white-label',
      'Advanced targeting options',
      'Real-time analytics & reporting',
      'SLA guarantee (99.9% uptime)',
      'Custom integrations',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
        <div className="container relative z-10">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Pricing</Badge>
            <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl">
              Simple,{' '}
              <span className="text-primary">Transparent</span>{' '}
              Pricing
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Start earning for free. Upgrade to Pro when you are ready to take it to the next level.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div key={plan.name} className={`relative rounded-2xl border bg-card p-8 ${plan.popular ? 'border-primary shadow-xl shadow-primary/10 ring-1 ring-primary/20 scale-[1.02]' : 'hover:shadow-lg'} transition-all duration-300`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-primary to-primary/80 px-4 py-1">Most Popular</Badge>
                  </div>
                )}
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{plan.desc}</p>
                <div className="mt-6 mb-8">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register">
                  <Button className={`w-full ${plan.popular ? 'bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/25' : ''}`} variant={plan.popular ? 'default' : 'outline'}>
                    {plan.cta}
                    {!plan.popular && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-muted-foreground mb-4">Need a custom plan for your team?</p>
            <Link href="/support">
              <Button variant="outline">
                Contact Our Sales Team
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Compare Plans</h2>
          </div>
          <div className="max-w-3xl mx-auto overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 pr-4">Feature</th>
                  <th className="text-center py-4 px-4">Free</th>
                  <th className="text-center py-4 px-4 text-primary font-bold">Pro</th>
                  <th className="text-center py-4 pl-4">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Task Submissions', 'Unlimited', 'Unlimited', 'Unlimited'],
                  ['Task Access', 'Standard', 'Priority (2x)', 'Priority + Custom'],
                  ['Withdrawal Speed', '24-48h', 'Instant', 'Instant'],
                  ['Referral Levels', '1 level (10%)', '3 levels (10/5/2%)', '3 levels + Custom'],
                  ['Reward Multiplier', '1x', '2x', 'Custom'],
                  ['Support', 'Email', 'Priority', 'Dedicated Manager'],
                  ['API Access', '-', '-', 'Full Access'],
                  ['Custom Branding', '-', '-', 'White-label'],
                ].map(([feature, free, pro, enterprise], i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-3 pr-4 font-medium">{feature}</td>
                    <td className="text-center py-3 px-4 text-muted-foreground">{free}</td>
                    <td className="text-center py-3 px-4 font-medium text-primary">{pro}</td>
                    <td className="text-center py-3 pl-4 text-muted-foreground">{enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
