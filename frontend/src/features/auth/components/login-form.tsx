import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { loginSchema, type LoginFormData } from '../schemas/auth.schema';
import { useLoginMutation } from '../hooks/use-auth-mutations';
import { AxiosError } from 'axios';
import { ApiError } from '@/shared/types/api';

export function LoginForm() {
  const navigate = useNavigate();
  const loginMutation = useLoginMutation();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        navigate('/');
      },
      onError: (error) => {
        const axiosError = error as AxiosError<ApiError>;
        toast.error(axiosError.response?.data?.error || 'Error al iniciar sesión');
      },
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Iniciar sesión</CardTitle>
        <CardDescription>Ingresa tus credenciales para acceder</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="tu@email.com" {...register('email')} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" type="password" {...register('password')} />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? 'Ingresando...' : 'Ingresar'}
          </Button>
          <div className="flex justify-between text-sm w-full">
            <Link to="/forgot-password" className="text-muted-foreground hover:underline">
              Olvidé mi contraseña
            </Link>
            <Link to="/register" className="text-muted-foreground hover:underline">
              Crear cuenta
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
