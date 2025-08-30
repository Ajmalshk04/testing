import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Loader2, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  Chrome, 
  Sparkles,
  ArrowRight,
  CheckCircle,
  Shield,
  Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps extends React.ComponentProps<'div'> {
  onToggleMode?: () => void;
}

export function LoginForm({ className, onToggleMode, ...props }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { login, loading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const watchedEmail = watch('email');
  const watchedPassword = watch('password');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const onSubmit = async (data: LoginFormData) => {
    const success = await login(data);
    if (success) {
      // Navigation will be handled by the auth context or parent component
    }
  };

  return (
    <div className={cn('flex flex-col gap-8 w-full', className)} {...props}>
      {/* Background Elements */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-purple-100/20 -z-10" />
      
      {/* Animated Background Shapes */}
      <div className="fixed top-20 left-20 w-72 h-72 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse -z-10" />
      <div className="fixed bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse -z-10" style={{ animationDelay: '2s' }} />
      
      <div className={cn(
        'transform transition-all duration-1000 ease-out',
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
      )}>
        <Card className="relative border-0 shadow-2xl bg-white/80 backdrop-blur-xl overflow-hidden group hover:shadow-3xl transition-all duration-500">
          {/* Animated border gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute inset-[1px] bg-white/90 backdrop-blur-xl rounded-lg" />
          
          {/* Header with enhanced design */}
          <CardHeader className="relative space-y-8 pb-10 pt-12">
            <div className="flex flex-col items-center space-y-6">
              {/* Enhanced logo with animation */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-md opacity-50 animate-pulse" />
                <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                  <Shield className="h-10 w-10 text-white animate-pulse" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full" />
                </div>
                <Sparkles className="absolute -top-2 -right-2 h-5 w-5 text-yellow-400 animate-bounce" style={{ animationDelay: '1s' }} />
                <Zap className="absolute -bottom-1 -left-1 h-4 w-4 text-blue-400 animate-bounce" style={{ animationDelay: '0.5s' }} />
              </div>
              
              {/* Enhanced title and description */}
              <div className="text-center space-y-3">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent tracking-tight">
                  Welcome Back
                </CardTitle>
                <CardDescription className="text-gray-600 max-w-sm leading-relaxed px-4">
                  Sign in to your account and unlock the full potential of our platform
                </CardDescription>
                
                {/* Trust indicators */}
                <div className="flex items-center justify-center gap-4 pt-2">
                  <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    <CheckCircle className="h-3 w-3" />
                    <span className="font-medium">Secure</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    <Shield className="h-3 w-3" />
                    <span className="font-medium">Protected</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        <CardContent className="relative space-y-8 px-8 pb-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6">
              {/* Enhanced Email Field */}
              <div className="space-y-3">
                <Label 
                  htmlFor="email" 
                  className={cn(
                    "text-sm font-semibold transition-all duration-200",
                    focusedField === 'email' || watchedEmail ? 'text-blue-600' : 'text-gray-700'
                  )}
                >
                  Email Address
                </Label>
                <div className="relative group">
                  {/* Enhanced input container with gradient border */}
                  <div className={cn(
                    "absolute inset-0 rounded-xl bg-gradient-to-r transition-all duration-300",
                    focusedField === 'email' 
                      ? 'from-blue-500 to-purple-500 p-[2px]' 
                      : errors.email 
                        ? 'from-red-400 to-red-500 p-[1px]'
                        : 'from-gray-200 to-gray-300 p-[1px] group-hover:from-blue-300 group-hover:to-purple-300'
                  )}>
                    <div className="w-full h-full bg-white rounded-xl" />
                  </div>
                  
                  <Mail className={cn(
                    "absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-all duration-200 z-10",
                    focusedField === 'email' || watchedEmail 
                      ? 'text-blue-500 scale-110' 
                      : errors.email 
                        ? 'text-red-500'
                        : 'text-gray-400 group-hover:text-blue-400'
                  )} />
                  
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    {...register('email')}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className={cn(
                      "relative z-10 pl-12 pr-4 h-14 border-0 bg-transparent focus:ring-0 focus:outline-none text-gray-900 placeholder:text-gray-400 text-base font-medium",
                      "transition-all duration-200"
                    )}
                  />
                  
                  {/* Success indicator */}
                  {watchedEmail && !errors.email && (
                    <CheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500 animate-in fade-in-50 duration-300" />
                  )}
                </div>
                
                {/* Enhanced error message */}
                {errors.email && (
                  <div className="flex items-center gap-2 text-red-500 animate-in slide-in-from-left-2 duration-300">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <p className="text-sm font-medium">{errors.email.message}</p>
                  </div>
                )}
              </div>
              
              {/* Enhanced Password Field */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label 
                    htmlFor="password" 
                    className={cn(
                      "text-sm font-semibold transition-all duration-200",
                      focusedField === 'password' || watchedPassword ? 'text-blue-600' : 'text-gray-700'
                    )}
                  >
                    Password
                  </Label>
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-500 font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                    onClick={(e) => {
                      e.preventDefault();
                      // TODO: Implement forgot password functionality
                    }}
                  >
                    Forgot password?
                  </button>
                </div>
                
                <div className="relative group">
                  {/* Enhanced input container with gradient border */}
                  <div className={cn(
                    "absolute inset-0 rounded-xl bg-gradient-to-r transition-all duration-300",
                    focusedField === 'password' 
                      ? 'from-blue-500 to-purple-500 p-[2px]' 
                      : errors.password 
                        ? 'from-red-400 to-red-500 p-[1px]'
                        : 'from-gray-200 to-gray-300 p-[1px] group-hover:from-blue-300 group-hover:to-purple-300'
                  )}>
                    <div className="w-full h-full bg-white rounded-xl" />
                  </div>
                  
                  <Lock className={cn(
                    "absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-all duration-200 z-10",
                    focusedField === 'password' || watchedPassword 
                      ? 'text-blue-500 scale-110' 
                      : errors.password 
                        ? 'text-red-500'
                        : 'text-gray-400 group-hover:text-blue-400'
                  )} />
                  
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    {...register('password')}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className={cn(
                      "relative z-10 pl-12 pr-16 h-14 border-0 bg-transparent focus:ring-0 focus:outline-none text-gray-900 placeholder:text-gray-400 text-base font-medium",
                      "transition-all duration-200"
                    )}
                  />
                  
                  {/* Enhanced password toggle button */}
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-lg hover:bg-gray-100/50 transition-all duration-200 z-10 group/toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 group-hover/toggle:text-gray-600 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 group-hover/toggle:text-gray-600 transition-colors" />
                    )}
                  </button>
                  
                  {/* Success indicator */}
                  {watchedPassword && !errors.password && (
                    <CheckCircle className="absolute right-16 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500 animate-in fade-in-50 duration-300" />
                  )}
                </div>
                
                {/* Enhanced error message */}
                {errors.password && (
                  <div className="flex items-center gap-2 text-red-500 animate-in slide-in-from-left-2 duration-300">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <p className="text-sm font-medium">{errors.password.message}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-6 pt-2">
              {/* Enhanced Sign In Button */}
              <Button 
                type="submit" 
                className={cn(
                  "relative w-full h-14 bg-gradient-to-r from-blue-600 via-blue-600 to-purple-600 text-white font-semibold text-base rounded-xl overflow-hidden group",
                  "hover:from-blue-700 hover:via-blue-700 hover:to-purple-700",
                  "transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98]",
                  "disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none",
                  loading && "animate-pulse"
                )}
                disabled={loading}
              >
                {/* Button background gradient animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 group-hover:animate-[shimmer_1.5s_ease-out] opacity-0 group-hover:opacity-100" />
                
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Signing in...</span>
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1 h-1 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1 h-1 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 group-hover:gap-3 transition-all duration-300">
                    <span>Sign In</span>
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                )}
              </Button>
              
              {/* Enhanced Divider */}
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white/90 backdrop-blur-sm px-6 py-2 text-sm text-gray-500 font-medium rounded-full border border-gray-100">
                    Or continue with
                  </span>
                </div>
              </div>
              
              {/* Enhanced Google Sign In Button */}
              <Button 
                variant="outline" 
                className={cn(
                  "w-full h-14 border-2 border-gray-200 bg-white/50 backdrop-blur-sm rounded-xl font-semibold text-base",
                  "hover:border-gray-300 hover:bg-gray-50/80 hover:shadow-lg",
                  "transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]",
                  "group relative overflow-hidden"
                )}
                type="button"
              >
                {/* Google button hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-red-50 opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                
                <div className="flex items-center justify-center gap-3 relative z-10">
                  <Chrome className="h-5 w-5 text-gray-600 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-gray-700">Continue with Google</span>
                </div>
              </Button>
            </div>
            
            {/* Enhanced Sign Up Link */}
            {onToggleMode && (
              <div className="text-center pt-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50/50 backdrop-blur-sm border border-gray-100">
                  <span className="text-sm text-gray-600">Don't have an account?</span>
                  <button
                    type="button"
                    onClick={onToggleMode}
                    className={cn(
                      "font-semibold text-blue-600 hover:text-blue-500 transition-all duration-200",
                      "hover:scale-105 active:scale-95 underline decoration-2 underline-offset-2"
                    )}
                  >
                    Create account
                  </button>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}