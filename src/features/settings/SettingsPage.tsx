import { useState } from 'react';
import { 
  User, 
  Shield, 
  Smartphone,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';

const SettingsPage = () => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Settings updated successfully');
    }, 1000);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account preferences and application defaults.</p>
      </div>

      <div className="space-y-6">
        <Card className="border shadow-none overflow-hidden">
          <CardHeader className="border-b bg-muted/20">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Profile Information
            </CardTitle>
            <CardDescription>Update your personal details and public profile.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-8 space-y-4">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary border-4 border-background shadow-lg">
                JD
              </div>
              <div>
                <Button variant="outline" size="sm">Change Avatar</Button>
                <p className="text-xs text-muted-foreground mt-2">JPG, GIF or PNG. 1MB Max.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="john.doe@university.edu" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-6 pt-0 flex justify-end">
            <Button onClick={handleSave} disabled={isSaving} className="gap-2">
              {isSaving ? 'Saving...' : <><Check className="w-4 h-4" /> Save Changes</>}
            </Button>
          </CardFooter>
        </Card>

        <Card className="border shadow-none overflow-hidden">
          <CardHeader className="border-b bg-muted/20">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Security Settings
            </CardTitle>
            <CardDescription>Keep your account secure by updating your credentials.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-pass">Current Password</Label>
              <Input id="current-pass" type="password" placeholder="••••••••" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-pass">New Password</Label>
                <Input id="new-pass" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-pass">Confirm New Password</Label>
                <Input id="confirm-pass" type="password" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-6 pt-0 flex justify-end">
             <Button variant="outline">Update Password</Button>
          </CardFooter>
        </Card>

        <Card className="border shadow-none overflow-hidden">
          <CardHeader className="border-b bg-muted/20">
            <CardTitle className="text-lg flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-primary" />
              Application Defaults
            </CardTitle>
            <CardDescription>Default parameters for new attendance sessions.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-8 space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="def-duration">Default Duration (mins)</Label>
                  <Input id="def-duration" type="number" defaultValue="60" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="def-radius">Default Radius (meters)</Label>
                  <Input id="def-radius" type="number" defaultValue="50" />
                </div>
             </div>
          </CardContent>
          <CardFooter className="p-6 pt-0 flex justify-end">
             <Button onClick={handleSave} disabled={isSaving} variant="secondary">Restore Defaults</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
