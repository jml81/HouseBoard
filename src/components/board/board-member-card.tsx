import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, Home, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { BoardMember } from '@/types';
import { useAuthStore } from '@/stores/auth-store';
import { useDeleteBoardMember } from '@/hooks/use-board-members';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { cn } from '@/lib/utils';
import { BoardMemberFormDialog } from './board-member-form-dialog';

interface BoardMemberCardProps {
  member: BoardMember;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export function BoardMemberCard({ member }: BoardMemberCardProps): React.JSX.Element {
  const { t } = useTranslation();
  const isManager = useAuthStore((s) => s.isManager);
  const deleteBoardMember = useDeleteBoardMember();
  const isChair = member.role === 'puheenjohtaja';

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  async function handleDelete(): Promise<void> {
    try {
      await deleteBoardMember.mutateAsync(member.id);
      toast.success(t('board.deleteSuccess'));
    } catch {
      toast.error(t('board.deleteError'));
    }
    setDeleteOpen(false);
  }

  return (
    <>
      <Card className="gap-3">
        <CardHeader className="flex flex-row items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="size-12">
              <AvatarFallback
                className={cn(
                  'text-sm font-medium',
                  isChair
                    ? 'bg-hbplus-accent-light text-hbplus-accent'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                {getInitials(member.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{member.name}</p>
              <Badge
                variant="outline"
                className={cn(
                  isChair && 'border-hbplus-accent bg-hbplus-accent-light text-hbplus-accent',
                )}
              >
                {t(`boardRoles.${member.role}`)}
              </Badge>
            </div>
          </div>
          {isManager && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => setEditOpen(true)}
                aria-label={t('board.editMember')}
              >
                <Pencil className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-destructive"
                onClick={() => setDeleteOpen(true)}
                aria-label={t('board.deleteMember')}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <Home className="size-4 shrink-0" />
            {member.apartment}
          </span>
          <a
            href={`mailto:${member.email}`}
            className="flex items-center gap-2 hover:text-foreground"
          >
            <Mail className="size-4 shrink-0" />
            {member.email}
          </a>
          <a
            href={`tel:${member.phone.replace(/\s/g, '')}`}
            className="flex items-center gap-2 hover:text-foreground"
          >
            <Phone className="size-4 shrink-0" />
            {member.phone}
          </a>
        </CardContent>
      </Card>

      <BoardMemberFormDialog open={editOpen} onOpenChange={setEditOpen} member={member} />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('board.deleteMember')}</AlertDialogTitle>
            <AlertDialogDescription>{t('board.deleteConfirm')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                void handleDelete();
              }}
            >
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
