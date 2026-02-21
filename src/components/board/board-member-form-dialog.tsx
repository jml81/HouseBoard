import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import type { BoardMember, BoardRole } from '@/types';
import { useCreateBoardMember, useUpdateBoardMember } from '@/hooks/use-board-members';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const BOARD_ROLES: BoardRole[] = ['puheenjohtaja', 'varapuheenjohtaja', 'jasen', 'varajasen'];

interface BoardMemberFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member?: BoardMember;
}

export function BoardMemberFormDialog({
  open,
  onOpenChange,
  member,
}: BoardMemberFormDialogProps): React.JSX.Element {
  const { t } = useTranslation();
  const isEdit = Boolean(member);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? t('board.editTitle') : t('board.createTitle')}</DialogTitle>
          <DialogDescription>
            {isEdit ? t('board.editDescription') : t('board.createDescription')}
          </DialogDescription>
        </DialogHeader>
        {open && <BoardMemberFormBody member={member} onOpenChange={onOpenChange} />}
      </DialogContent>
    </Dialog>
  );
}

interface FormErrors {
  name?: string;
  role?: string;
  apartment?: string;
  email?: string;
  phone?: string;
  termStart?: string;
  termEnd?: string;
}

interface BoardMemberFormBodyProps {
  member?: BoardMember;
  onOpenChange: (open: boolean) => void;
}

function BoardMemberFormBody({
  member,
  onOpenChange,
}: BoardMemberFormBodyProps): React.JSX.Element {
  const { t } = useTranslation();
  const createBoardMember = useCreateBoardMember();
  const updateBoardMember = useUpdateBoardMember();
  const isEdit = Boolean(member);

  const [name, setName] = useState(member?.name ?? '');
  const [role, setRole] = useState<BoardRole>(member?.role ?? 'jasen');
  const [apartment, setApartment] = useState(member?.apartment ?? '');
  const [email, setEmail] = useState(member?.email ?? '');
  const [phone, setPhone] = useState(member?.phone ?? '');
  const [termStart, setTermStart] = useState(member?.termStart ?? '');
  const [termEnd, setTermEnd] = useState(member?.termEnd ?? '');
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  function validateForm(): FormErrors {
    const errors: FormErrors = {};
    if (!name.trim()) {
      errors.name = t('board.validationNameRequired');
    }
    if (!role) {
      errors.role = t('board.validationRoleRequired');
    }
    if (!apartment.trim()) {
      errors.apartment = t('board.validationApartmentRequired');
    }
    if (!email.trim()) {
      errors.email = t('board.validationEmailRequired');
    }
    if (!phone.trim()) {
      errors.phone = t('board.validationPhoneRequired');
    }
    if (!termStart) {
      errors.termStart = t('board.validationTermStartRequired');
    }
    if (!termEnd) {
      errors.termEnd = t('board.validationTermEndRequired');
    }
    if (termStart && termEnd && termEnd <= termStart) {
      errors.termEnd = t('board.validationTermEndAfterStart');
    }
    return errors;
  }

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      if (isEdit && member) {
        await updateBoardMember.mutateAsync({
          id: member.id,
          name: name.trim(),
          role,
          apartment: apartment.trim(),
          email: email.trim(),
          phone: phone.trim(),
          termStart,
          termEnd,
        });
        toast.success(t('board.updateSuccess'));
      } else {
        await createBoardMember.mutateAsync({
          name: name.trim(),
          role,
          apartment: apartment.trim(),
          email: email.trim(),
          phone: phone.trim(),
          termStart,
          termEnd,
        });
        toast.success(t('board.createSuccess'));
      }
      onOpenChange(false);
    } catch {
      toast.error(isEdit ? t('board.updateError') : t('board.createError'));
    }
  }

  const isPending = createBoardMember.isPending || updateBoardMember.isPending;

  return (
    <form
      onSubmit={(e) => {
        void handleSubmit(e);
      }}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="board-member-name">{t('board.formName')}</Label>
          <Input id="board-member-name" value={name} onChange={(e) => setName(e.target.value)} />
          {formErrors.name && <p className="text-sm text-destructive">{formErrors.name}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="board-member-role">{t('board.formRole')}</Label>
          <Select value={role} onValueChange={(v) => setRole(v as BoardRole)}>
            <SelectTrigger id="board-member-role">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BOARD_ROLES.map((r) => (
                <SelectItem key={r} value={r}>
                  {t(`boardRoles.${r}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formErrors.role && <p className="text-sm text-destructive">{formErrors.role}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="board-member-apartment">{t('board.formApartment')}</Label>
            <Input
              id="board-member-apartment"
              value={apartment}
              onChange={(e) => setApartment(e.target.value)}
            />
            {formErrors.apartment && (
              <p className="text-sm text-destructive">{formErrors.apartment}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="board-member-phone">{t('board.formPhone')}</Label>
            <Input
              id="board-member-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {formErrors.phone && <p className="text-sm text-destructive">{formErrors.phone}</p>}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="board-member-email">{t('board.formEmail')}</Label>
          <Input
            id="board-member-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {formErrors.email && <p className="text-sm text-destructive">{formErrors.email}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="board-member-term-start">{t('board.formTermStart')}</Label>
            <Input
              id="board-member-term-start"
              type="date"
              value={termStart}
              onChange={(e) => setTermStart(e.target.value)}
            />
            {formErrors.termStart && (
              <p className="text-sm text-destructive">{formErrors.termStart}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="board-member-term-end">{t('board.formTermEnd')}</Label>
            <Input
              id="board-member-term-end"
              type="date"
              value={termEnd}
              onChange={(e) => setTermEnd(e.target.value)}
            />
            {formErrors.termEnd && <p className="text-sm text-destructive">{formErrors.termEnd}</p>}
          </div>
        </div>
      </div>
      <DialogFooter className="mt-6">
        <Button
          type="submit"
          className="bg-hbplus-accent hover:bg-hbplus-accent/90"
          disabled={isPending}
        >
          {isEdit ? t('board.update') : t('board.submit')}
        </Button>
      </DialogFooter>
    </form>
  );
}
