import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/brand/logo';
import { useResetPassword } from '@/hooks/use-password-reset';

interface ResetPasswordPageProps {
  token: string;
}

export function ResetPasswordPage({ token }: ResetPasswordPageProps): React.JSX.Element {
  const { t } = useTranslation();
  const mutation = useResetPassword();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    setValidationError('');

    if (newPassword.length < 8) {
      setValidationError(t('profile.passwordMinLength'));
      return;
    }

    if (newPassword !== confirmPassword) {
      setValidationError(t('profile.passwordMismatch'));
      return;
    }

    mutation.mutate({ token, newPassword });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center space-y-4">
          <Logo size="lg" />
          <CardTitle>{t('auth.resetPasswordTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          {mutation.isSuccess ? (
            <div className="space-y-4 text-center">
              <p className="text-sm text-muted-foreground">{t('auth.resetPasswordSuccess')}</p>
              <Link to="/kirjaudu" className="text-sm text-primary hover:underline">
                {t('auth.backToLogin')}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">{t('profile.newPassword')}</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('profile.confirmPassword')}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
              {validationError && (
                <p className="text-sm text-destructive" role="alert">
                  {validationError}
                </p>
              )}
              {mutation.isError && (
                <p className="text-sm text-destructive" role="alert">
                  {t('auth.resetPasswordError')}
                </p>
              )}
              <Button type="submit" className="w-full" disabled={mutation.isPending}>
                {t('auth.resetPasswordSubmit')}
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
