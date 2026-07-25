'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon } from 'lucide-react';

export default function AdvertiserSettingsPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><SettingsIcon className="h-5 w-5" />Account Settings</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <div><p className="font-medium">Email Notifications</p><p className="text-sm text-muted-foreground">Receive campaign updates</p></div>
            <input type="checkbox" defaultChecked className="h-4 w-4" />
          </div>
          <div className="flex items-center justify-between py-3">
            <div><p className="font-medium">Language</p></div>
            <select className="rounded-md border border-input bg-background px-3 py-1 text-sm"><option>English</option><option>Arabic</option></select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
