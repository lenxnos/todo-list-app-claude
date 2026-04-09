import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../schemas/auth.schema';
import { useForgotPasswordMutation } from '../hooks/use-auth-mutations';

export function ForgotPasswordForm() {
  const mutation = useForgotPasswordMutation();

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    mutation.mutate(data, {
      onSuccess: () => {
        toast.success('Si el email existe, recibirás un enlace de recuperación.');
      },
      onError: () => {
        toast.error('Error al enviar el email de recuperación');
      },
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Recuperar contraseña</CardTitle>
        <CardDescription>Ingresa tu email para recibir un enlace de recuperación</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="tu@email.com" {...register('email')} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? 'Enviando...' : 'Enviar enlace'}
          </Button>
          <Link to="/login" className="text-sm text-muted-foreground hover:underline">
            Volver al login
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
}
