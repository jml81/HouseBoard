import { Phone, Mail } from 'lucide-react';
import type { Contact } from '@/types';
import { Card, CardContent } from '@/components/ui/card';

interface ContactCardProps {
  contact: Contact;
}

export function ContactCard({ contact }: ContactCardProps): React.JSX.Element {
  return (
    <Card className="gap-0 border-l-4 border-l-hbplus-accent">
      <CardContent className="space-y-2 p-4">
        <div>
          <p className="font-semibold">{contact.name}</p>
          {contact.company && <p className="text-sm text-muted-foreground">{contact.company}</p>}
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
  );
}
