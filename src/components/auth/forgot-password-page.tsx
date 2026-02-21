import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/brand/logo';
import { useForgotPassword } from '@/hooks/use-password-reset';

export function ForgotPasswordPage(): React.JSX.Element {
  const { t } = useTranslation();
  const mutation = useForgotPassword();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    mutation.mutate(email);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center space-y-4">
          <Logo size="lg" />
          <CardTitle>{t('auth.forgotPasswordTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          {mutation.isSuccess ? (
            <div className="space-y-4 text-center">
              <p className="text-sm text-muted-foreground">{t('auth.forgotPasswordSuccess')}</p>
              <Link to="/kirjaudu" className="text-sm text-primary hover:underline">
                {t('auth.backToLogin')}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-muted-foreground">{t('auth.forgotPasswordDescription')}</p>
              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              {mutation.isError && (
                <p className="text-sm text-destructive" role="alert">
                  {t('auth.forgotPasswordError')}
                </p>
              )}
              <Button type="submit" className="w-full" disabled={mutation.isPending}>
                {t('auth.sendResetLink')}
              </Button>
              <div className="text-center">
                <Link to="/kirjaudu" className="text-sm text-primary hover:underline">
                  {t('auth.backToLogin')}
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
