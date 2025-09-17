import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { LoadingSpinner } from './LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const { state } = useApp();
  const { signIn, signUp, signInWithProvider, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const translations = {
    en: {
      login: 'Login',
      signup: 'Sign Up',
      name: 'Full Name',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      loginButton: 'Login',
      signupButton: 'Create Account',
      forgotPassword: 'Forgot Password?',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      switchToSignup: 'Sign up',
      switchToLogin: 'Login',
      welcome: 'Welcome Back!',
      createAccount: 'Create Your Account',
      loginSubtitle: 'Sign in to your account to continue shopping',
      signupSubtitle: 'Join AmarShop for the best fashion experience',
      or: 'or',
      googleLogin: 'Continue with Google',
      facebookLogin: 'Continue with Facebook'
    },
    bn: {
      login: 'লগইন',
      signup: 'সাইন আপ',
      name: 'পূর্ণ নাম',
      email: 'ইমেইল',
      password: 'পাসওয়ার্ড',
      confirmPassword: 'পাসওয়ার্ড নিশ্চিত করুন',
      loginButton: 'লগইন',
      signupButton: 'অ্যাকাউন্ট তৈরি করুন',
      forgotPassword: 'পাসওয়ার্ড ভুলে গেছেন?',
      noAccount: 'অ্যাকাউন্ট নেই?',
      hasAccount: 'ইতিমধ্যে অ্যাকাউন্ট আছে?',
      switchToSignup: 'সাইন আপ',
      switchToLogin: 'লগইন',
      welcome: 'স্বাগতম!',
      createAccount: 'আপনার অ্যাকাউন্ট তৈরি করুন',
      loginSubtitle: 'কেনাকাটা চালিয়ে যেতে আপনার অ্যাকাউন্টে সাইন ইন করুন',
      signupSubtitle: 'সেরা ফ্যাশন অভিজ্ঞতার জন্য আমারশপে যোগ দিন',
      or: 'অথবা',
      googleLogin: 'Google দিয়ে চালিয়ে যান',
      facebookLogin: 'Facebook দিয়ে চালিয়ে যান'
    }
  };

  const t = translations[state.language];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (activeTab === 'signup') {
      if (!formData.name.trim()) {
        toast.error('Name is required');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return false;
      }
      if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return false;
      }
    }
    
    if (!formData.email.trim() || !formData.password.trim()) {
      toast.error('Email and password are required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    const result = await signIn(formData.email, formData.password);
    
    if (result.success) {
      toast.success('Login successful!');
      onOpenChange(false);
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    } else {
      toast.error(`Login failed: ${result.error}`);
    }
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    const result = await signUp(formData.email, formData.password, formData.name);
    
    if (result.success) {
      toast.success('Account created successfully! Please check your email to verify your account.');
      // Auto-switch to login tab
      setActiveTab('login');
      setFormData({ name: '', email: formData.email, password: '', confirmPassword: '' });
    } else {
      toast.error(`Signup failed: ${result.error}`);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    const result = await signInWithProvider(provider);
    
    if (result.success) {
      toast.success(`${provider} login initiated. Please complete the process in the popup window.`);
    } else {
      toast.error(`${provider} login failed: ${result.error}`);
      // Show additional info for social login setup
      toast.info(`Note: Social login requires additional setup. Visit https://supabase.com/docs/guides/auth/social-login/auth-${provider} for instructions.`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="bg-primary text-primary-foreground px-3 py-1 rounded-lg">
                <span className="font-bold">AmarShop</span>
              </div>
            </div>
          </DialogTitle>
          <DialogDescription className="text-center">
            Sign in to your account or create a new one to continue
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'signup')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">{t.login}</TabsTrigger>
            <TabsTrigger value="signup">{t.signup}</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold">{t.welcome}</h2>
              <p className="text-sm text-muted-foreground">{t.loginSubtitle}</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="login-email">{t.email}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="login-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="login-password">{t.password}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10 pr-10"
                    placeholder="Enter your password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button 
                className="w-full" 
                onClick={handleLogin} 
                disabled={isLoading}
              >
                {isLoading ? <LoadingSpinner size="sm" /> : t.loginButton}
              </Button>

              <div className="text-center">
                <Button variant="link" className="text-sm">
                  {t.forgotPassword}
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">{t.or}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => handleSocialLogin('google')}
                >
                  {t.googleLogin}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => handleSocialLogin('facebook')}
                >
                  {t.facebookLogin}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold">{t.createAccount}</h2>
              <p className="text-sm text-muted-foreground">{t.signupSubtitle}</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="signup-name">{t.name}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="signup-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="pl-10"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="signup-email">{t.email}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="signup-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="signup-password">{t.password}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10 pr-10"
                    placeholder="Create a password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="signup-confirm-password">{t.confirmPassword}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="signup-confirm-password"
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="pl-10"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>

              <Button 
                className="w-full" 
                onClick={handleSignup} 
                disabled={isLoading}
              >
                {isLoading ? <LoadingSpinner size="sm" /> : t.signupButton}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">{t.or}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => handleSocialLogin('google')}
                >
                  {t.googleLogin}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => handleSocialLogin('facebook')}
                >
                  {t.facebookLogin}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
