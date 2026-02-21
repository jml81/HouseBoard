import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import type { Contact, ContactRole } from '@/types';
import { useContacts } from '@/hooks/use-contacts';
import { useAuthStore } from '@/stores/auth-store';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { ContactCard } from './contact-card';
import { ContactFormDialog } from './contact-form-dialog';

const ROLE_ORDER: ContactRole[] = ['isannoitsija', 'huolto', 'hallitus', 'siivous', 'muu'];

export function ContactsPage(): React.JSX.Element {
  const { t } = useTranslation();
  const { data: contacts = [] } = useContacts();
  const isManager = useAuthStore((s) => s.isManager);
  const [createOpen, setCreateOpen] = useState(false);

  const grouped = useMemo(() => {
    const groups = new Map<ContactRole, Contact[]>();
    for (const role of ROLE_ORDER) {
      const roleContacts = contacts.filter((c) => c.role === role);
      if (roleContacts.length > 0) {
        groups.set(role, roleContacts);
      }
    }
    return groups;
  }, [contacts]);

  return (
    <div>
      <PageHeader
        titleKey="contacts.title"
        descriptionKey="contacts.description"
        actions={
          isManager ? (
            <Button
              className="bg-hbplus-accent hover:bg-hbplus-accent/90"
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="mr-1 size-4" />
              {t('contacts.createNew')}
            </Button>
          ) : undefined
        }
      />

      <div className="space-y-6 p-6">
        {[...grouped.entries()].map(([role, roleContacts]) => (
          <section key={role}>
            <h2 className="mb-3 text-lg font-semibold text-hb-primary">
              {t(`contactRoles.${role}`)}
            </h2>
            <div className="space-y-3">
              {roleContacts.map((contact) => (
                <ContactCard key={contact.id} contact={contact} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <ContactFormDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
