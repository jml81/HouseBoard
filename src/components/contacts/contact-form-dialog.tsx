import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import type { Contact, ContactRole } from '@/types';
import { useCreateContact, useUpdateContact } from '@/hooks/use-contacts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

const CONTACT_ROLES: ContactRole[] = ['isannoitsija', 'huolto', 'hallitus', 'siivous', 'muu'];

interface ContactFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact?: Contact;
}

export function ContactFormDialog({
  open,
  onOpenChange,
  contact,
}: ContactFormDialogProps): React.JSX.Element {
  const { t } = useTranslation();
  const isEdit = Boolean(contact);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? t('contacts.editTitle') : t('contacts.createTitle')}</DialogTitle>
          <DialogDescription>
            {isEdit ? t('contacts.editDescription') : t('contacts.createDescription')}
          </DialogDescription>
        </DialogHeader>
        {open && <ContactFormBody contact={contact} onOpenChange={onOpenChange} />}
      </DialogContent>
    </Dialog>
  );
}

interface FormErrors {
  name?: string;
  role?: string;
  phone?: string;
  email?: string;
}

interface ContactFormBodyProps {
  contact?: Contact;
  onOpenChange: (open: boolean) => void;
}

function ContactFormBody({ contact, onOpenChange }: ContactFormBodyProps): React.JSX.Element {
  const { t } = useTranslation();
  const createContact = useCreateContact();
  const updateContact = useUpdateContact();
  const isEdit = Boolean(contact);

  const [name, setName] = useState(contact?.name ?? '');
  const [role, setRole] = useState<ContactRole>(contact?.role ?? 'muu');
  const [company, setCompany] = useState(contact?.company ?? '');
  const [phone, setPhone] = useState(contact?.phone ?? '');
  const [email, setEmail] = useState(contact?.email ?? '');
  const [description, setDescription] = useState(contact?.description ?? '');
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  function validateForm(): FormErrors {
    const errors: FormErrors = {};
    if (!name.trim()) {
      errors.name = t('contacts.validationNameRequired');
    }
    if (!role) {
      errors.role = t('contacts.validationRoleRequired');
    }
    if (!phone.trim()) {
      errors.phone = t('contacts.validationPhoneRequired');
    }
    if (!email.trim()) {
      errors.email = t('contacts.validationEmailRequired');
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
      if (isEdit && contact) {
        await updateContact.mutateAsync({
          id: contact.id,
          name: name.trim(),
          role,
          company: company.trim() || undefined,
          phone: phone.trim(),
          email: email.trim(),
          description: description.trim() || undefined,
        });
        toast.success(t('contacts.updateSuccess'));
      } else {
        await createContact.mutateAsync({
          name: name.trim(),
          role,
          company: company.trim() || undefined,
          phone: phone.trim(),
          email: email.trim(),
          description: description.trim() || undefined,
        });
        toast.success(t('contacts.createSuccess'));
      }
      onOpenChange(false);
    } catch {
      toast.error(isEdit ? t('contacts.updateError') : t('contacts.createError'));
    }
  }

  const isPending = createContact.isPending || updateContact.isPending;

  return (
    <form
      onSubmit={(e) => {
        void handleSubmit(e);
      }}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="contact-name">{t('contacts.formName')}</Label>
          <Input id="contact-name" value={name} onChange={(e) => setName(e.target.value)} />
          {formErrors.name && <p className="text-sm text-destructive">{formErrors.name}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-role">{t('contacts.formRole')}</Label>
          <Select value={role} onValueChange={(v) => setRole(v as ContactRole)}>
            <SelectTrigger id="contact-role">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CONTACT_ROLES.map((r) => (
                <SelectItem key={r} value={r}>
                  {t(`contactRoles.${r}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formErrors.role && <p className="text-sm text-destructive">{formErrors.role}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-company">{t('contacts.formCompany')}</Label>
          <Input
            id="contact-company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contact-phone">{t('contacts.formPhone')}</Label>
            <Input id="contact-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            {formErrors.phone && <p className="text-sm text-destructive">{formErrors.phone}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-email">{t('contacts.formEmail')}</Label>
            <Input
              id="contact-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {formErrors.email && <p className="text-sm text-destructive">{formErrors.email}</p>}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-description">{t('contacts.formDescription')}</Label>
          <Textarea
            id="contact-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
        </div>
      </div>
      <DialogFooter className="mt-6">
        <Button
          type="submit"
          className="bg-hbplus-accent hover:bg-hbplus-accent/90"
          disabled={isPending}
        >
          {isEdit ? t('contacts.update') : t('contacts.submit')}
        </Button>
      </DialogFooter>
    </form>
  );
}
