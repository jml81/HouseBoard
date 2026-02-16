import { useTranslation } from 'react-i18next';
import { Mail, Phone, Home } from 'lucide-react';
import type { BoardMember } from '@/types';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
  const isChair = member.role === 'puheenjohtaja';

  return (
    <Card className="gap-3">
      <CardHeader>
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
  );
}
