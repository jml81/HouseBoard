import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useUsers, useDeleteUser } from '@/hooks/use-users';
import { useAuthStore } from '@/stores/auth-store';
import { ApiError } from '@/lib/api-client';
import type { User } from '@/types';
import { UserFormDialog } from './user-form-dialog';

export function UsersPage(): React.JSX.Element {
  const { t } = useTranslation();
  const { data: users, isLoading, error } = useUsers();
  const deleteUserMutation = useDeleteUser();
  const currentUser = useAuthStore((s) => s.user);
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const handleDelete = (): void => {
    if (!deleteTarget) return;
    deleteUserMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success(t('users.deleteSuccess'));
        setDeleteTarget(null);
      },
      onError: (err) => {
        if (err instanceof ApiError && err.status === 403) {
          toast.error(t('users.cannotDeleteSelf'));
        } else {
          toast.error(t('users.deleteError'));
        }
        setDeleteTarget(null);
      },
    });
  };

  return (
    <div className="space-y-0">
      <PageHeader
        titleKey="users.title"
        descriptionKey="users.description"
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 size-4" />
            {t('users.createUser')}
          </Button>
        }
      />

      <div className="p-6">
        {isLoading && <p className="text-muted-foreground">{t('common.loading')}</p>}
        {error && <p className="text-destructive">{t('common.error')}</p>}
        {users?.length === 0 && <p className="text-muted-foreground">{t('users.noUsers')}</p>}
        {users && users.length > 0 && (
          <>
            {/* Mobile: card layout */}
            <div className="space-y-2 md:hidden">
              {users.map((user) => (
                <div key={user.id} className="flex items-center gap-3 rounded-lg border p-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{user.name}</p>
                    <p className="truncate text-sm text-muted-foreground">{user.email}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <span className="text-xs text-muted-foreground">{user.apartment}</span>
                      <Badge variant={user.role === 'manager' ? 'default' : 'secondary'}>
                        {t(`userRoles.${user.role}`)}
                      </Badge>
                      <Badge variant={user.status === 'active' ? 'outline' : 'destructive'}>
                        {t(`userStatuses.${user.status}`)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => setEditUser(user)}
                      aria-label={t('common.edit')}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => setDeleteTarget(user)}
                      disabled={user.id === currentUser?.id}
                      aria-label={t('users.deleteUser')}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: table layout */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('users.formName')}</TableHead>
                    <TableHead>{t('users.formEmail')}</TableHead>
                    <TableHead>{t('users.formApartment')}</TableHead>
                    <TableHead>{t('users.formRole')}</TableHead>
                    <TableHead>{t('users.formStatus')}</TableHead>
                    <TableHead className="w-24" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.apartment}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'manager' ? 'default' : 'secondary'}>
                          {t(`userRoles.${user.role}`)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === 'active' ? 'outline' : 'destructive'}>
                          {t(`userStatuses.${user.status}`)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditUser(user)}
                            aria-label={t('common.edit')}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteTarget(user)}
                            disabled={user.id === currentUser?.id}
                            aria-label={t('users.deleteUser')}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </div>

      {createOpen && (
        <UserFormDialog open={createOpen} onOpenChange={setCreateOpen} mode="create" />
      )}

      {editUser && (
        <UserFormDialog
          open={!!editUser}
          onOpenChange={(open) => {
            if (!open) setEditUser(null);
          }}
          mode="edit"
          user={editUser}
        />
      )}

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('users.deleteUser')}</AlertDialogTitle>
            <AlertDialogDescription>{t('users.deleteConfirm')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>{t('common.delete')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
