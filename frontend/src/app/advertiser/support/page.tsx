'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  MessageSquare, Ticket, Send, Paperclip, ChevronDown, ChevronUp,
  HelpCircle, ExternalLink, Crown, User, Clock, CheckCircle,
  AlertCircle, Loader2, Phone, Mail,
} from 'lucide-react';

type SupportTab = 'chat' | 'tickets';

interface ChatMessage {
  id: number;
  sender: 'user' | 'agent';
  message: string;
  time: string;
}

interface Ticket {
  id: number;
  subject: string;
  status: 'open' | 'closed' | 'pending';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  last_reply: string;
}

const MOCK_CHAT: ChatMessage[] = [
  { id: 1, sender: 'agent', message: 'Hello! Welcome to EarnClicks Support. How can I help you today?', time: '10:30 AM' },
  { id: 2, sender: 'user', message: 'Hi, I need help with my campaign budget settings.', time: '10:31 AM' },
  { id: 3, sender: 'agent', message: 'Sure! I can help with that. Could you please provide your campaign ID?', time: '10:32 AM' },
];

const MOCK_TICKETS: Ticket[] = [
  { id: 1001, subject: 'Payment issue with deposit', status: 'open', priority: 'high', created_at: '2026-07-25', last_reply: '2 hours ago' },
  { id: 1002, subject: 'Campaign approval delay', status: 'pending', priority: 'medium', created_at: '2026-07-24', last_reply: '1 day ago' },
  { id: 1003, subject: 'Feature request: Analytics export', status: 'closed', priority: 'low', created_at: '2026-07-20', last_reply: '3 days ago' },
];

const FAQ_DATA = [
  { q: 'How do I create a campaign?', a: 'Navigate to Campaign Manager and click "Create Campaign". Fill in the required details including platform, budget, and task type.' },
  { q: 'What payment methods are accepted?', a: 'We accept USDT (TRC20, BEP20, ERC20), and major credit/debit cards through our payment partners.' },
  { q: 'How long does campaign approval take?', a: 'Most campaigns are reviewed within 2-4 hours during business hours. Complex campaigns may take up to 24 hours.' },
  { q: 'Can I pause or cancel a running campaign?', a: 'Yes, you can pause a campaign at any time. Unused budget will be returned to your wallet.' },
  { q: 'How do I withdraw my earnings?', a: 'Go to Wallet > Withdraw, enter the amount, and confirm. Withdrawals are processed within 24 hours.' },
];

const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  high: 'bg-red-50 text-red-700 border-red-200',
};

const STATUS_COLORS: Record<string, string> = {
  open: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  closed: 'bg-gray-100 text-gray-500 border-gray-200',
};

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<SupportTab>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_CHAT);
  const [input, setInput] = useState('');
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [ticketForm, setTicketForm] = useState({ subject: '', message: '', priority: 'medium' });
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [sending, setSending] = useState(false);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg: ChatMessage = {
      id: messages.length + 1,
      sender: 'user',
      message: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([...messages, newMsg]);
    setInput('');
    setSending(true);
    setTimeout(() => {
      const reply: ChatMessage = {
        id: messages.length + 2,
        sender: 'agent',
        message: 'Thank you for your message. Our support team will get back to you shortly.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, reply]);
      setSending(false);
    }, 1500);
  };

  const submitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const newTicket: Ticket = {
      id: tickets.length + 1001,
      subject: ticketForm.subject,
      status: 'open',
      priority: ticketForm.priority as 'low' | 'medium' | 'high',
      created_at: new Date().toISOString().slice(0, 10),
      last_reply: 'Just now',
    };
    setTickets([newTicket, ...tickets]);
    setTicketForm({ subject: '', message: '', priority: 'medium' });
    setShowNewTicket(false);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Support Center</h1>
          <p className="text-sm text-gray-400 mt-1">Get help from our support team</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1.5 border-amber-200 bg-amber-50 text-amber-700 rounded-xl">
          <Crown className="h-3.5 w-3.5" />
          Priority Support
        </Badge>
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl p-1.5 shadow-sm">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('chat')}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
              activeTab === 'chat'
                ? 'bg-[#2D4F97] text-white shadow-md shadow-[#2D4F97]/20'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            )}
          >
            <MessageSquare className="h-4 w-4" />
            Live Chat
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
              activeTab === 'tickets'
                ? 'bg-[#2D4F97] text-white shadow-md shadow-[#2D4F97]/20'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            )}
          >
            <Ticket className="h-4 w-4" />
            Tickets
          </button>
        </div>
      </div>

      {activeTab === 'chat' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <CardHeader className="border-b border-gray-100 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2D4F97] to-[#1E8A8D] flex items-center justify-center text-white">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Live Support Chat</CardTitle>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs text-emerald-600 font-medium">Online</span>
                        <span className="text-xs text-gray-300 mx-1">|</span>
                        <span className="text-xs text-gray-400">Avg. response: &lt; 5 min</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2D4F97] to-[#1E8A8D] flex items-center justify-center text-white text-[10px] font-bold border-2 border-white">SA</div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#18C79A] to-[#1E8A8D] flex items-center justify-center text-white text-[10px] font-bold border-2 border-white">MK</div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white text-[10px] font-bold border-2 border-white">+2</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[400px] overflow-y-auto p-4 space-y-3">
                  {messages.map((msg) => (
                    <div key={msg.id} className={cn('flex', msg.sender === 'user' ? 'justify-end' : 'justify-start')}>
                      <div
                        className={cn(
                          'max-w-[80%] rounded-2xl px-4 py-2.5',
                          msg.sender === 'user'
                            ? 'bg-gradient-to-r from-[#2D4F97] to-[#1E8A8D] text-white rounded-br-md'
                            : 'bg-gray-50 border border-gray-100 text-gray-700 rounded-bl-md'
                        )}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p className={cn('text-[10px] mt-1', msg.sender === 'user' ? 'text-white/70' : 'text-gray-400')}>{msg.time}</p>
                      </div>
                    </div>
                  ))}
                  {sending && (
                    <div className="flex justify-start">
                      <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-bl-md px-4 py-2.5">
                        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="border-t border-gray-100 p-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors">
                      <Paperclip className="h-4 w-4" />
                    </button>
                    <input
                      type="text"
                      placeholder="Type your message..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                      className="flex-1 h-10 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D4F97]/20 focus:border-[#2D4F97] focus:bg-white transition-all"
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!input.trim() || sending}
                      size="icon"
                      className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#2D4F97] to-[#1E8A8D] hover:from-[#1E3A7A] hover:to-[#166A6D] text-white shadow-lg shadow-[#2D4F97]/20"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm">
              <CardHeader><CardTitle className="text-sm">Agent Status</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: 'Sarah Ahmed', role: 'Senior Support', status: 'online', avatar: 'SA' },
                  { name: 'Mike Karim', role: 'Technical Support', status: 'online', avatar: 'MK' },
                  { name: 'Lena Park', role: 'Billing Support', status: 'away', avatar: 'LP' },
                ].map((agent, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="relative">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2D4F97] to-[#1E8A8D] flex items-center justify-center text-white text-xs font-bold">
                        {agent.avatar}
                      </div>
                      <span className={cn(
                        'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white',
                        agent.status === 'online' ? 'bg-emerald-500' : 'bg-amber-400'
                      )} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{agent.name}</p>
                      <p className="text-xs text-gray-400">{agent.role}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        'ml-auto text-[10px] px-2 py-0 capitalize rounded-full',
                        agent.status === 'online' ? 'border-emerald-200 bg-emerald-50 text-emerald-600' : 'border-amber-200 bg-amber-50 text-amber-600'
                      )}
                    >
                      {agent.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm">
              <CardHeader><CardTitle className="text-sm">Quick Links</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:text-[#2D4F97] transition-colors">
                  <HelpCircle className="h-4 w-4" /> FAQ
                </a>
                <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:text-[#2D4F97] transition-colors">
                  <ExternalLink className="h-4 w-4" /> Knowledge Base
                </a>
                <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:text-[#2D4F97] transition-colors">
                  <Phone className="h-4 w-4" /> Contact Phone
                </a>
                <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:text-[#2D4F97] transition-colors">
                  <Mail className="h-4 w-4" /> support@earnclicks.app
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'tickets' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button
              onClick={() => setShowNewTicket(!showNewTicket)}
              className="h-10 px-5 rounded-xl bg-gradient-to-r from-[#2D4F97] to-[#1E8A8D] hover:from-[#1E3A7A] hover:to-[#166A6D] text-white shadow-lg shadow-[#2D4F97]/20"
            >
              <Ticket className="h-4 w-4 mr-2" />
              {showNewTicket ? 'Cancel' : 'New Ticket'}
            </Button>
          </div>

          {showNewTicket && (
            <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm">
              <CardHeader><CardTitle className="text-lg">Create New Ticket</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={submitTicket} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Input
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                      placeholder="Brief description of your issue"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Message</Label>
                    <textarea
                      value={ticketForm.message}
                      onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                      placeholder="Describe your issue in detail..."
                      required
                      className="w-full min-h-[120px] rounded-xl border border-gray-200 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D4F97]/20 focus:border-[#2D4F97]"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <select
                        value={ticketForm.priority}
                        onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                        className="w-full h-10 rounded-xl border border-gray-200 bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D4F97]/20 focus:border-[#2D4F97]"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Attachment</Label>
                      <div className="flex items-center gap-2 h-10 px-3 rounded-xl border border-gray-200 bg-background cursor-pointer hover:border-[#2D4F97]/30 transition-colors">
                        <Paperclip className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-400">Attach file (optional)</span>
                        <input type="file" className="hidden" />
                      </div>
                    </div>
                  </div>
                  <Button type="submit" className="bg-gradient-to-r from-[#2D4F97] to-[#1E8A8D] text-white">
                    <Send className="h-4 w-4 mr-2" /> Submit Ticket
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {tickets.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl">
              <CardContent className="py-16 text-center">
                <Ticket className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-400">No support tickets yet</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">
                      <th className="px-5 py-4">Ticket</th>
                      <th className="px-4 py-4">Priority</th>
                      <th className="px-4 py-4">Status</th>
                      <th className="px-4 py-4">Created</th>
                      <th className="px-4 py-4">Last Reply</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((t) => (
                      <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-gray-900">#{t.id} — {t.subject}</p>
                        </td>
                        <td className="px-4 py-4">
                          <Badge variant="outline" className={cn('text-xs capitalize', PRIORITY_COLORS[t.priority])}>
                            {t.priority}
                          </Badge>
                        </td>
                        <td className="px-4 py-4">
                          <Badge variant="outline" className={cn('text-xs capitalize', STATUS_COLORS[t.status])}>
                            {t.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">{t.created_at}</td>
                        <td className="px-4 py-4 text-sm text-gray-500">{t.last_reply}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      )}

      <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-[#2D4F97]" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {FAQ_DATA.map((faq, i) => (
            <div key={i} className="border-b border-gray-50 last:border-0">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between py-3 px-2 rounded-xl hover:bg-gray-50 transition-colors text-left"
              >
                <span className="text-sm font-medium text-gray-700">{faq.q}</span>
                {openFaq === i ? (
                  <ChevronUp className="h-4 w-4 text-gray-400 shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
                )}
              </button>
              {openFaq === i && (
                <div className="px-2 pb-3 text-sm text-gray-500 leading-relaxed">{faq.a}</div>
              )}
            </div>
          ))}
          <div className="pt-3 text-center">
            <a href="#" className="inline-flex items-center gap-1.5 text-sm text-[#2D4F97] hover:underline font-medium">
              <ExternalLink className="h-3.5 w-3.5" />
              Visit Knowledge Base
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
