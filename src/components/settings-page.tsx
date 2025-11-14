'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { 
  ArrowLeft, 
  Bell, 
  Globe, 
  Palette, 
  Shield, 
  User, 
  Zap,
  Moon,
  Sun,
  Monitor,
  Save,
  RefreshCw
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  
  // Settings state
  const [notifications, setNotifications] = useState({
    priceAlerts: true,
    marketUpdates: false,
    newsletter: true,
    pushNotifications: false,
  });
  
  const [preferences, setPreferences] = useState({
    defaultCurrency: 'usd',
    refreshInterval: 60,
    itemsPerPage: 50,
    compactView: false,
  });

  const handleSaveSettings = () => {
    // Save settings logic here
    toast({
      title: 'Settings saved',
      description: 'Your preferences have been updated successfully.',
    });
  };

  const handleResetSettings = () => {
    setNotifications({
      priceAlerts: true,
      marketUpdates: false,
      newsletter: true,
      pushNotifications: false,
    });
    setPreferences({
      defaultCurrency: 'usd',
      refreshInterval: 60,
      itemsPerPage: 50,
      compactView: false,
    });
    toast({
      title: 'Settings reset',
      description: 'All settings have been reset to defaults.',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push('/')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Settings</h1>
              <p className="text-sm text-muted-foreground">Manage your preferences and account</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="general" className="gap-2">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Account</span>
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Preferences</CardTitle>
                <CardDescription>Configure your default settings and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Select 
                    value={preferences.defaultCurrency} 
                    onValueChange={(value) => setPreferences({...preferences, defaultCurrency: value})}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD - US Dollar ($)</SelectItem>
                      <SelectItem value="eur">EUR - Euro (€)</SelectItem>
                      <SelectItem value="gbp">GBP - British Pound (£)</SelectItem>
                      <SelectItem value="jpy">JPY - Japanese Yen (¥)</SelectItem>
                      <SelectItem value="cad">CAD - Canadian Dollar ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="refresh">Auto-refresh Interval (seconds)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="refresh"
                      min={30}
                      max={300}
                      step={30}
                      value={[preferences.refreshInterval]}
                      onValueChange={(value) => setPreferences({...preferences, refreshInterval: value[0]})}
                      className="flex-1"
                    />
                    <Badge variant="secondary" className="w-16 justify-center">
                      {preferences.refreshInterval}s
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    How often to refresh market data automatically
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="items">Items Per Page</Label>
                  <Select 
                    value={preferences.itemsPerPage.toString()} 
                    onValueChange={(value) => setPreferences({...preferences, itemsPerPage: parseInt(value)})}
                  >
                    <SelectTrigger id="items">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="25">25 coins</SelectItem>
                      <SelectItem value="50">50 coins</SelectItem>
                      <SelectItem value="100">100 coins</SelectItem>
                      <SelectItem value="200">200 coins</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="compact">Compact View</Label>
                    <p className="text-sm text-muted-foreground">
                      Display coins in a more condensed layout
                    </p>
                  </div>
                  <Switch
                    id="compact"
                    checked={preferences.compactView}
                    onCheckedChange={(checked) => setPreferences({...preferences, compactView: checked})}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Language & Region</CardTitle>
                <CardDescription>Set your language and regional preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="ja">日本語</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="utc">
                    <SelectTrigger id="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc">UTC (GMT+0)</SelectItem>
                      <SelectItem value="est">Eastern Time (GMT-5)</SelectItem>
                      <SelectItem value="pst">Pacific Time (GMT-8)</SelectItem>
                      <SelectItem value="cet">Central European (GMT+1)</SelectItem>
                      <SelectItem value="jst">Japan Standard (GMT+9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Theme</CardTitle>
                <CardDescription>Choose your preferred color theme</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    className="h-24 flex-col gap-2"
                    onClick={() => setTheme('light')}
                  >
                    <Sun className="h-6 w-6" />
                    <span>Light</span>
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    className="h-24 flex-col gap-2"
                    onClick={() => setTheme('dark')}
                  >
                    <Moon className="h-6 w-6" />
                    <span>Dark</span>
                  </Button>
                  <Button
                    variant={theme === 'system' ? 'default' : 'outline'}
                    className="h-24 flex-col gap-2"
                    onClick={() => setTheme('system')}
                  >
                    <Monitor className="h-6 w-6" />
                    <span>System</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Display Options</CardTitle>
                <CardDescription>Customize how information is displayed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Coin Logos</Label>
                    <p className="text-sm text-muted-foreground">
                      Display cryptocurrency logos in the list
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Animate Price Changes</Label>
                    <p className="text-sm text-muted-foreground">
                      Show animations when prices update
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Reduce Motion</Label>
                    <p className="text-sm text-muted-foreground">
                      Minimize animations and transitions
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how you receive updates and alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Price Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when prices reach your targets
                    </p>
                  </div>
                  <Switch
                    checked={notifications.priceAlerts}
                    onCheckedChange={(checked) => setNotifications({...notifications, priceAlerts: checked})}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Market Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about market trends
                    </p>
                  </div>
                  <Switch
                    checked={notifications.marketUpdates}
                    onCheckedChange={(checked) => setNotifications({...notifications, marketUpdates: checked})}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Newsletter</Label>
                    <p className="text-sm text-muted-foreground">
                      Weekly digest of crypto news and insights
                    </p>
                  </div>
                  <Switch
                    checked={notifications.newsletter}
                    onCheckedChange={(checked) => setNotifications({...notifications, newsletter: checked})}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable browser push notifications
                    </p>
                  </div>
                  <Switch
                    checked={notifications.pushNotifications}
                    onCheckedChange={(checked) => setNotifications({...notifications, pushNotifications: checked})}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Email Preferences</CardTitle>
                <CardDescription>Configure email notification settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="your@email.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frequency">Email Frequency</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger id="frequency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Privacy & Security</CardTitle>
                <CardDescription>Control your data and privacy settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Analytics</Label>
                    <p className="text-sm text-muted-foreground">
                      Help improve the app by sharing usage data
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Personalized Ads</Label>
                    <p className="text-sm text-muted-foreground">
                      Show ads based on your interests
                    </p>
                  </div>
                  <Switch />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Share Watchlist</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow others to see your public watchlist
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Manage your stored data and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Globe className="h-4 w-4" />
                  Download My Data
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Clear Cache
                </Button>
                <Button variant="destructive" className="w-full justify-start gap-2">
                  <Shield className="h-4 w-4" />
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Settings */}
          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input id="name" placeholder="Your name" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" placeholder="@username" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Input id="bio" placeholder="Tell us about yourself" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Manage your account security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Shield className="h-4 w-4" />
                  Change Password
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Shield className="h-4 w-4" />
                  Enable Two-Factor Authentication
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Globe className="h-4 w-4" />
                  Manage Sessions
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Connected Accounts</CardTitle>
                <CardDescription>Link external accounts and services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Google</Label>
                    <p className="text-sm text-muted-foreground">Not connected</p>
                  </div>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Twitter</Label>
                    <p className="text-sm text-muted-foreground">Not connected</p>
                  </div>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <Button onClick={handleSaveSettings} className="flex-1 gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
          <Button onClick={handleResetSettings} variant="outline" className="flex-1 gap-2">
            <RefreshCw className="h-4 w-4" />
            Reset to Defaults
          </Button>
        </div>
      </main>

      <Toaster />
    </div>
  );
}
