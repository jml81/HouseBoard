import { createFileRoute } from '@tanstack/react-router';
import { ContactsPage } from '@/components/contacts/contacts-page';

export const Route = createFileRoute('/plus/yhteystiedot')({
  component: YhteystiedotPage,
});

function YhteystiedotPage(): React.JSX.Element {
  return <ContactsPage />;
}
