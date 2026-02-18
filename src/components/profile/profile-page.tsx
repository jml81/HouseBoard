import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { PageHeader } from '@/components/common/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/auth-store';
import { useUpdateProfile, useChangePassword } from '@/hooks/use-profile';
import { ApiError } from '@/lib/api-client';
import type { User } from '@/types';

export function ProfilePage(): React.JSX.Element {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);

  return (
    <div className="space-y-0">
      <PageHeader titleKey="profile.title" descriptionKey="profile.description" />
      <div className="space-y-6 p-6">
        {user && <UserInfoCard user={user} updateUser={updateUser} t={t} />}
        <ChangePasswordCard t={t} />
      </div>
    </div>
  );
}

interface UserInfoCardProps {
  user: { id: string; name: string; email: string; apartment: string; role: string };
  updateUser: (user: User) => void;
  t: (key: string) => string;
}

function UserInfoCard({ user, updateUser, t }: UserInfoCardProps): React.JSX.Element {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [apartment, setApartment] = useState(user.apartment);
  const updateProfileMutation = useUpdateProfile();

  const handleSave = (): void => {
    updateProfileMutation.mutate(
      { name: name.trim(), apartment: apartment.trim() },
      {
        onSuccess: (updated) => {
          updateUser(updated);
          setEditing(false);
          toast.success(t('profile.updateSuccess'));
        },
        onError: () => {
          toast.error(t('profile.updateError'));
        },
      },
    );
  };

  const handleCancel = (): void => {
    setName(user.name);
    setApartment(user.apartment);
    setEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('profile.userInfo')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>{t('profile.name')}</Label>
          {editing ? (
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          ) : (
            <p className="text-sm">{user.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>{t('profile.email')}</Label>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>

        <div className="space-y-2">
          <Label>{t('profile.apartment')}</Label>
          {editing ? (
            <Input value={apartment} onChange={(e) => setApartment(e.target.value)} />
          ) : (
            <p className="text-sm">{user.apartment}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>{t('profile.role')}</Label>
          <div>
            <Badge variant={user.role === 'manager' ? 'default' : 'secondary'}>
              {t(`userRoles.${user.role}`)}
            </Badge>
          </div>
        </div>

        <div className="flex gap-2">
          {editing ? (
            <>
              <Button
                onClick={handleSave}
                disabled={updateProfileMutation.isPending || !name.trim() || !apartment.trim()}
              >
                {t('profile.saveInfo')}
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                {t('common.cancel')}
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => setEditing(true)}>
              {t('profile.editInfo')}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface ChangePasswordCardProps {
  t: (key: string) => string;
}

function ChangePasswordCard({ t }: ChangePasswordCardProps): React.JSX.Element {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const changePasswordMutation = useChangePassword();

  const validationError = (): string | null => {
    if (newPassword.length > 0 && newPassword.length < 8) {
      return t('profile.passwordMinLength');
    }
    if (confirmPassword.length > 0 && newPassword !== confirmPassword) {
      return t('profile.passwordMismatch');
    }
    return null;
  };

  const canSubmit =
    currentPassword.length > 0 &&
    newPassword.length >= 8 &&
    newPassword === confirmPassword &&
    !changePasswordMutation.isPending;

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    changePasswordMutation.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
          toast.success(t('profile.passwordSuccess'));
        },
        onError: (error) => {
          if (error instanceof ApiError && error.status === 401) {
            toast.error(t('profile.passwordWrong'));
          } else {
            toast.error(t('profile.passwordError'));
          }
        },
      },
    );
  };

  const error = validationError();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('profile.changePassword')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">{t('profile.currentPassword')}</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">{t('profile.newPassword')}</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
              autoComplete="new-password"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={!canSubmit}>
            {t('profile.changePasswordSubmit')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
