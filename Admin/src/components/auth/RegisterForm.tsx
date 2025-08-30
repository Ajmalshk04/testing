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
  Check, 
  X, 
  User,
  Mail,
  Lock,
  Chrome,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Shield,
  Star,
  UserPlus
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps extends React.ComponentProps<'div'> {
  onToggleMode?: () => void;
}

export function RegisterForm({ className, onToggleMode, ...props }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { register: registerUser, loading } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch('password');
  const watchedName = watch('name');
  const watchedEmail = watch('email');
  const watchedConfirmPassword = watch('confirmPassword');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const onSubmit = async (data: RegisterFormData) => {
    const { confirmPassword, ...registerData } = data;
    const success = await registerUser(registerData);
    if (success) {
      // Navigation will be handled by the auth context or parent component
    }
  };

  const getPasswordStrength = (password: string) => {
    const requirements = [
      { regex: /.{6,}/, text: 'At least 6 characters' },
      { regex: /[a-z]/, text: 'One lowercase letter' },
      { regex: /[A-Z]/, text: 'One uppercase letter' },
      { regex: /\d/, text: 'One number' },
    ];

    return requirements.map(req => ({
      ...req,
      met: req.regex.test(password),
    }));
  };

  const passwordRequirements = password ? getPasswordStrength(password) : [];

  return (
    <div className={cn('flex flex-col gap-8 w-full', className)} {...props}>
      {/* Background Elements */}
      <div className="fixed inset-0 bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-emerald-100/20 via-transparent to-blue-100/20 -z-10" />
      
      {/* Animated Background Shapes */}
      <div className="fixed top-32 left-32 w-80 h-80 bg-gradient-to-br from-emerald-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse -z-10" />
      <div className="fixed bottom-32 right-32 w-72 h-72 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse -z-10" style={{ animationDelay: '1.5s' }} />
      
      <div className={cn(
        'transform transition-all duration-1000 ease-out',
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
      )}>
        <Card className="relative border-0 shadow-2xl bg-white/80 backdrop-blur-xl overflow-hidden group hover:shadow-3xl transition-all duration-500">
          {/* Animated border gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute inset-[1px] bg-white/90 backdrop-blur-xl rounded-lg" />
          
          {/* Header with enhanced design */}
          <CardHeader className="relative space-y-8 pb-10 pt-12">
            <div className="flex flex-col items-center space-y-6">
              {/* Enhanced logo with animation */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full blur-md opacity-50 animate-pulse" />
                <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                  <UserPlus className="h-10 w-10 text-white animate-pulse" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full" />
                </div>
                <Sparkles className="absolute -top-2 -right-2 h-5 w-5 text-yellow-400 animate-bounce" style={{ animationDelay: '0.5s' }} />
                <Star className="absolute -bottom-1 -left-1 h-4 w-4 text-emerald-400 animate-bounce" style={{ animationDelay: '1s' }} />
              </div>
              
              {/* Enhanced title and description */}
              <div className="text-center space-y-3">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-emerald-800 to-blue-800 bg-clip-text text-transparent tracking-tight">
                  Join Our Community
                </CardTitle>
                <CardDescription className="text-gray-600 max-w-sm leading-relaxed px-4">
                  Create your account and start your amazing journey with us today
                </CardDescription>
                
                {/* Trust indicators */}
                <div className="flex items-center justify-center gap-4 pt-2">
                  <div className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                    <CheckCircle className="h-3 w-3" />
                    <span className="font-medium">Free</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    <Shield className="h-3 w-3" />
                    <span className="font-medium">Secure</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                    <Star className="h-3 w-3" />
                    <span className="font-medium">Premium</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        <CardContent className="relative space-y-8 px-8 pb-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6">
              {/* Enhanced Name Field */}
              <div className="space-y-3">
                <Label 
                  htmlFor="name" 
                  className={cn(
                    "text-sm font-semibold transition-all duration-200",
                    focusedField === 'name' || watchedName ? 'text-emerald-600' : 'text-gray-700'
                  )}
                >
                  Full Name
                </Label>
                <div className="relative group">
                  {/* Enhanced input container with gradient border */}
                  <div className={cn(
                    "absolute inset-0 rounded-xl bg-gradient-to-r transition-all duration-300",
                    focusedField === 'name' 
                      ? 'from-emerald-500 to-blue-500 p-[2px]' 
                      : errors.name 
                        ? 'from-red-400 to-red-500 p-[1px]'
                        : 'from-gray-200 to-gray-300 p-[1px] group-hover:from-emerald-300 group-hover:to-blue-300'
                  )}>
                    <div className="w-full h-full bg-white rounded-xl" />
                  </div>
                  
                  <User className={cn(
                    "absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-all duration-200 z-10",
                    focusedField === 'name' || watchedName 
                      ? 'text-emerald-500 scale-110' 
                      : errors.name 
                        ? 'text-red-500'
                        : 'text-gray-400 group-hover:text-emerald-400'
                  )} />
                  
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    {...register('name')}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    className={cn(
                      "relative z-10 pl-12 pr-4 h-14 border-0 bg-transparent focus:ring-0 focus:outline-none text-gray-900 placeholder:text-gray-400 text-base font-medium",
                      "transition-all duration-200"
                    )}
                  />
                  
                  {/* Success indicator */}
                  {watchedName && !errors.name && (
                    <CheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500 animate-in fade-in-50 duration-300" />
                  )}
                </div>
                
                {/* Enhanced error message */}
                {errors.name && (
                  <div className="flex items-center gap-2 text-red-500 animate-in slide-in-from-left-2 duration-300">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <p className="text-sm font-medium">{errors.name.message}</p>
                  </div>
                )}
              </div>
              
              {/* Enhanced Email Field */}
              <div className="space-y-3">
                <Label 
                  htmlFor="email" 
                  className={cn(
                    "text-sm font-semibold transition-all duration-200",
                    focusedField === 'email' || watchedEmail ? 'text-emerald-600' : 'text-gray-700'
                  )}
                >
                  Email Address
                </Label>
                <div className="relative group">
                  {/* Enhanced input container with gradient border */}
                  <div className={cn(
                    "absolute inset-0 rounded-xl bg-gradient-to-r transition-all duration-300",
                    focusedField === 'email' 
                      ? 'from-emerald-500 to-blue-500 p-[2px]' 
                      : errors.email 
                        ? 'from-red-400 to-red-500 p-[1px]'
                        : 'from-gray-200 to-gray-300 p-[1px] group-hover:from-emerald-300 group-hover:to-blue-300'
                  )}>
                    <div className="w-full h-full bg-white rounded-xl" />
                  </div>
                  
                  <Mail className={cn(
                    "absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-all duration-200 z-10",
                    focusedField === 'email' || watchedEmail 
                      ? 'text-emerald-500 scale-110' 
                      : errors.email 
                        ? 'text-red-500'
                        : 'text-gray-400 group-hover:text-emerald-400'
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
                <Label 
                  htmlFor="password" 
                  className={cn(
                    "text-sm font-semibold transition-all duration-200",
                    focusedField === 'password' || password ? 'text-emerald-600' : 'text-gray-700'
                  )}
                >
                  Password
                </Label>
                <div className="relative group">
                  {/* Enhanced input container with gradient border */}
                  <div className={cn(
                    "absolute inset-0 rounded-xl bg-gradient-to-r transition-all duration-300",
                    focusedField === 'password' 
                      ? 'from-emerald-500 to-blue-500 p-[2px]' 
                      : errors.password 
                        ? 'from-red-400 to-red-500 p-[1px]'
                        : 'from-gray-200 to-gray-300 p-[1px] group-hover:from-emerald-300 group-hover:to-blue-300'
                  )}>
                    <div className="w-full h-full bg-white rounded-xl" />
                  </div>
                  
                  <Lock className={cn(
                    "absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-all duration-200 z-10",
                    focusedField === 'password' || password 
                      ? 'text-emerald-500 scale-110' 
                      : errors.password 
                        ? 'text-red-500'
                        : 'text-gray-400 group-hover:text-emerald-400'
                  )} />
                  
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
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
                </div>
                
                {/* Enhanced Password Strength Indicator */}
                {password && (
                  <div className="space-y-3 p-4 bg-gradient-to-r from-gray-50/50 to-emerald-50/30 rounded-xl border border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-emerald-500" />
                      Password Strength
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {passwordRequirements.map((req, index) => (
                        <div key={index} className={cn(
                          "flex items-center gap-2 p-2 rounded-lg transition-all duration-300",
                          req.met ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                        )}>
                          <div className={cn(
                            "flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300",
                            req.met ? 'bg-emerald-100' : 'bg-red-100'
                          )}>
                            {req.met ? (
                              <Check className="h-3 w-3 text-emerald-600" />
                            ) : (
                              <X className="h-3 w-3 text-red-500" />
                            )}
                          </div>
                          <span className="font-medium text-xs">{req.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Enhanced error message */}
                {errors.password && (
                  <div className="flex items-center gap-2 text-red-500 animate-in slide-in-from-left-2 duration-300">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <p className="text-sm font-medium">{errors.password.message}</p>
                  </div>
                )}
              </div>
              
              {/* Enhanced Confirm Password Field */}
              <div className="space-y-3">
                <Label 
                  htmlFor="confirmPassword" 
                  className={cn(
                    "text-sm font-semibold transition-all duration-200",
                    focusedField === 'confirmPassword' || watchedConfirmPassword ? 'text-emerald-600' : 'text-gray-700'
                  )}
                >
                  Confirm Password
                </Label>
                <div className="relative group">
                  {/* Enhanced input container with gradient border */}
                  <div className={cn(
                    "absolute inset-0 rounded-xl bg-gradient-to-r transition-all duration-300",
                    focusedField === 'confirmPassword' 
                      ? 'from-emerald-500 to-blue-500 p-[2px]' 
                      : errors.confirmPassword 
                        ? 'from-red-400 to-red-500 p-[1px]'
                        : 'from-gray-200 to-gray-300 p-[1px] group-hover:from-emerald-300 group-hover:to-blue-300'
                  )}>
                    <div className="w-full h-full bg-white rounded-xl" />
                  </div>
                  
                  <Lock className={cn(
                    "absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-all duration-200 z-10",
                    focusedField === 'confirmPassword' || watchedConfirmPassword 
                      ? 'text-emerald-500 scale-110' 
                      : errors.confirmPassword 
                        ? 'text-red-500'
                        : 'text-gray-400 group-hover:text-emerald-400'
                  )} />
                  
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    {...register('confirmPassword')}
                    onFocus={() => setFocusedField('confirmPassword')}
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
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 group-hover/toggle:text-gray-600 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 group-hover/toggle:text-gray-600 transition-colors" />
                    )}
                  </button>
                  
                  {/* Success indicator */}
                  {watchedConfirmPassword && !errors.confirmPassword && password && watchedConfirmPassword === password && (
                    <CheckCircle className="absolute right-16 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500 animate-in fade-in-50 duration-300" />
                  )}
                </div>
                
                {/* Enhanced error message */}
                {errors.confirmPassword && (
                  <div className="flex items-center gap-2 text-red-500 animate-in slide-in-from-left-2 duration-300">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <p className="text-sm font-medium">{errors.confirmPassword.message}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-6 pt-2">
              {/* Enhanced Create Account Button */}
              <Button 
                type="submit" 
                className={cn(
                  "relative w-full h-14 bg-gradient-to-r from-emerald-600 via-emerald-600 to-blue-600 text-white font-semibold text-base rounded-xl overflow-hidden group",
                  "hover:from-emerald-700 hover:via-emerald-700 hover:to-blue-700",
                  "transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98]",
                  "disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none",
                  loading && "animate-pulse"
                )}
                disabled={loading}
              >
                {/* Button background gradient animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 group-hover:animate-[shimmer_1.5s_ease-out] opacity-0 group-hover:opacity-100" />
                
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Creating account...</span>
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1 h-1 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1 h-1 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 group-hover:gap-3 transition-all duration-300">
                    <UserPlus className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    <span>Create Account</span>
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
                    Or sign up with
                  </span>
                </div>
              </div>
              
              {/* Enhanced Google Sign Up Button */}
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
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-blue-50 opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                
                <div className="flex items-center justify-center gap-3 relative z-10">
                  <Chrome className="h-5 w-5 text-gray-600 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-gray-700">Continue with Google</span>
                </div>
              </Button>
            </div>
            
            {/* Enhanced Sign In Link */}
            {onToggleMode && (
              <div className="text-center pt-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50/50 backdrop-blur-sm border border-gray-100">
                  <span className="text-sm text-gray-600">Already have an account?</span>
                  <button
                    type="button"
                    onClick={onToggleMode}
                    className={cn(
                      "font-semibold text-emerald-600 hover:text-emerald-500 transition-all duration-200",
                      "hover:scale-105 active:scale-95 underline decoration-2 underline-offset-2"
                    )}
                  >
                    Sign in
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