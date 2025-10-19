'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useLocale } from '@/lib/hooks/useLocale';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const router = useRouter();
  const { isArabic, direction } = useLocale();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Create or update user profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .upsert({
            id: data.user.id,
            email: data.user.email,
            full_name: data.user.user_metadata.full_name || 'User',
            role: 'member',
            cohort_id: 'default-cohort-6', // This should be dynamic
          });

        if (profileError) throw profileError;
      }

      toast.success(isArabic ? 'تم تسجيل الدخول بنجاح' : 'Login successful');
      router.push('/feed');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || (isArabic ? 'فشل تسجيل الدخول' : 'Login failed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className={cn(
            "text-3xl font-bold text-gray-900",
            direction === 'rtl' && 'text-right'
          )}>
            {isArabic ? 'تسجيل الدخول' : 'Sign in to your account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isArabic ? 'مرحباً بك في كونسول المجلس' : 'Welcome to Majlis Console'}
          </p>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className={cn(
              "text-xl text-center",
              direction === 'rtl' && 'text-right'
            )}>
              {isArabic ? 'تسجيل الدخول' : 'Login'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <Label htmlFor="email" className={direction === 'rtl' ? 'text-right' : ''}>
                  {isArabic ? 'البريد الإلكتروني' : 'Email address'}
                </Label>
                <div className="mt-1 relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    placeholder={isArabic ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className={direction === 'rtl' ? 'text-right' : ''}>
                  {isArabic ? 'كلمة المرور' : 'Password'}
                </Label>
                <div className="mt-1 relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    placeholder={isArabic ? 'أدخل كلمة المرور' : 'Enter your password'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className={cn(
                    "ml-2 block text-sm text-gray-900",
                    direction === 'rtl' && 'ml-0 mr-2'
                  )}>
                    {isArabic ? 'تذكرني' : 'Remember me'}
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-primary hover:text-primary/80">
                    {isArabic ? 'نسيت كلمة المرور؟' : 'Forgot your password?'}
                  </a>
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading
                    ? isArabic
                      ? 'جاري تسجيل الدخول...'
                      : 'Signing in...'
                    : isArabic
                    ? 'تسجيل الدخول'
                    : 'Sign in'
                  }
                </Button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    {isArabic ? 'أو' : 'Or'}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    // Demo login for testing
                    setEmail('demo@accentureacademy.com');
                    setPassword('demo123');
                  }}
                >
                  {isArabic ? 'تسجيل دخول تجريبي' : 'Demo Login'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}