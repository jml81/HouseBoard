import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateUser, useUpdateUser } from '@/hooks/use-users';
import { ApiError } from '@/lib/api-client';
import type { User, UserRole, UserStatus } from '@/types';

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  user?: User;
}

export function UserFormDialog({
  open,
  onOpenChange,
  mode,
  user,
}: UserFormDialogProps): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? t('users.createTitle') : t('users.editTitle')}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' ? t('users.createDescription') : t('users.editDescription')}
          </DialogDescription>
        </DialogHeader>
        {open && <FormBody mode={mode} user={user} onClose={() => onOpenChange(false)} t={t} />}
      </DialogContent>
    </Dialog>
  );
}

interface FormBodyProps {
  mode: 'create' | 'edit';
  user?: User;
  onClose: () => void;
  t: (key: string) => string;
}

function FormBody({ mode, user, onClose, t }: FormBodyProps): React.JSX.Element {
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [apartment, setApartment] = useState(user?.apartment ?? '');
  const [role, setRole] = useState<UserRole>(user?.role ?? 'resident');
  const [status, setStatus] = useState<UserStatus>(user?.status ?? 'active');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();

  const validationErrors: string[] = [];
  if (!name.trim()) validationErrors.push(t('users.validationNameRequired'));
  if (mode === 'create' && !email.trim()) validationErrors.push(t('users.validationEmailRequired'));
  if (!apartment.trim()) validationErrors.push(t('users.validationApartmentRequired'));
  if (mode === 'create') {
    if (!password) validationErrors.push(t('users.validationPasswordRequired'));
    else if (password.length < 8) validationErrors.push(t('users.validationPasswordMinLength'));
    if (password && confirmPassword && password !== confirmPassword) {
      validationErrors.push(t('users.validationPasswordMismatch'));
    }
  }

  const canSubmit =
    name.trim() !== '' &&
    apartment.trim() !== '' &&
    (mode === 'edit' ||
      (email.trim() !== '' && password.length >= 8 && password === confirmPassword));

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    if (mode === 'create') {
      createMutation.mutate(
        {
          name: name.trim(),
          email: email.trim(),
          apartment: apartment.trim(),
          role,
          password,
        },
        {
          onSuccess: () => {
            toast.success(t('users.createSuccess'));
            onClose();
          },
          onError: (err) => {
            if (err instanceof ApiError && err.status === 409) {
              toast.error(t('users.duplicateEmail'));
            } else {
              toast.error(t('users.createError'));
            }
          },
        },
      );
    } else if (user) {
      updateMutation.mutate(
        {
          id: user.id,
          name: name.trim(),
          apartment: apartment.trim(),
          role,
          status,
        },
        {
          onSuccess: () => {
            toast.success(t('users.updateSuccess'));
            onClose();
          },
          onError: () => {
            toast.error(t('users.updateError'));
          },
        },
      );
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  // Show first validation error only after user has interacted
  const showPasswordError = mode === 'create' && password.length > 0 && password.length < 8;
  const showMismatchError =
    mode === 'create' && confirmPassword.length > 0 && password !== confirmPassword;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="user-name">{t('users.formName')}</Label>
        <Input id="user-name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      {mode === 'create' && (
        <div className="space-y-2">
          <Label htmlFor="user-email">{t('users.formEmail')}</Label>
          <Input
            id="user-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="user-apartment">{t('users.formApartment')}</Label>
        <Input
          id="user-apartment"
          value={apartment}
          onChange={(e) => setApartment(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>{t('users.formRole')}</Label>
        <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="resident">{t('userRoles.resident')}</SelectItem>
            <SelectItem value="manager">{t('userRoles.manager')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {mode === 'edit' && (
        <div className="space-y-2">
          <Label>{t('users.formStatus')}</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as UserStatus)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">{t('userStatuses.active')}</SelectItem>
              <SelectItem value="locked">{t('userStatuses.locked')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {mode === 'create' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="user-password">{t('users.formPassword')}</Label>
            <Input
              id="user-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            {showPasswordError && (
              <p className="text-sm text-destructive">{t('users.validationPasswordMinLength')}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="user-confirm-password">{t('users.formConfirmPassword')}</Label>
            <Input
              id="user-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            {showMismatchError && (
              <p className="text-sm text-destructive">{t('users.validationPasswordMismatch')}</p>
            )}
          </div>
        </>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          {t('common.cancel')}
        </Button>
        <Button type="submit" disabled={!canSubmit || isPending}>
          {mode === 'create' ? t('users.submit') : t('users.update')}
        </Button>
      </div>
    </form>
  );
}
