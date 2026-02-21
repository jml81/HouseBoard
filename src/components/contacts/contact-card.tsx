import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Contact } from '@/types';
import { useAuthStore } from '@/stores/auth-store';
import { useDeleteContact } from '@/hooks/use-contacts';
import { Card, CardContent } from '@/components/ui/card';
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
import { ContactFormDialog } from './contact-form-dialog';

interface ContactCardProps {
  contact: Contact;
}

export function ContactCard({ contact }: ContactCardProps): React.JSX.Element {
  const { t } = useTranslation();
  const isManager = useAuthStore((s) => s.isManager);
  const deleteContact = useDeleteContact();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  async function handleDelete(): Promise<void> {
    try {
      await deleteContact.mutateAsync(contact.id);
      toast.success(t('contacts.deleteSuccess'));
    } catch {
      toast.error(t('contacts.deleteError'));
    }
    setDeleteOpen(false);
  }

  return (
    <>
      <Card className="gap-0 border-l-4 border-l-hbplus-accent">
        <CardContent className="space-y-2 p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold">{contact.name}</p>
              {contact.company && (
                <p className="text-sm text-muted-foreground">{contact.company}</p>
              )}
            </div>
            {isManager && (
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={() => setEditOpen(true)}
                  aria-label={t('contacts.editContact')}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-destructive"
                  onClick={() => setDeleteOpen(true)}
                  aria-label={t('contacts.deleteContact')}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            )}
          </div>
          {contact.description && (
            <p className="text-sm text-muted-foreground">{contact.description}</p>
          )}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <a
              href={`tel:${contact.phone.replace(/\s/g, '')}`}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <Phone className="size-4" />
              {contact.phone}
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <Mail className="size-4" />
              {contact.email}
            </a>
          </div>
        </CardContent>
      </Card>

      <ContactFormDialog open={editOpen} onOpenChange={setEditOpen} contact={contact} />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('contacts.deleteContact')}</AlertDialogTitle>
            <AlertDialogDescription>{t('contacts.deleteConfirm')}</AlertDialogDescription>
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
