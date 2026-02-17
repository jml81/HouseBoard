import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Contact, ContactRole } from '@/types';
import { useContacts } from '@/hooks/use-contacts';
import { PageHeader } from '@/components/common/page-header';
import { ContactCard } from './contact-card';

const ROLE_ORDER: ContactRole[] = ['isannoitsija', 'huolto', 'hallitus', 'siivous', 'muu'];

export function ContactsPage(): React.JSX.Element {
  const { t } = useTranslation();
  const { data: contacts = [] } = useContacts();

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
      <PageHeader titleKey="contacts.title" descriptionKey="contacts.description" />

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
    </div>
  );
}
