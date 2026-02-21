import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import type { BoardRole } from '@/types';
import { useBoardMembers } from '@/hooks/use-board-members';
import { useAuthStore } from '@/stores/auth-store';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { BoardMemberCard } from './board-member-card';
import { BoardMemberFormDialog } from './board-member-form-dialog';

const ROLE_ORDER: Record<BoardRole, number> = {
  puheenjohtaja: 0,
  varapuheenjohtaja: 1,
  jasen: 2,
  varajasen: 3,
};

export function BoardPage(): React.JSX.Element {
  const { t } = useTranslation();
  const { data: boardMembers = [] } = useBoardMembers();
  const isManager = useAuthStore((s) => s.isManager);
  const [createOpen, setCreateOpen] = useState(false);
  const sorted = [...boardMembers].sort((a, b) => ROLE_ORDER[a.role] - ROLE_ORDER[b.role]);

  return (
    <div>
      <PageHeader
        titleKey="board.title"
        descriptionKey="board.description"
        actions={
          isManager ? (
            <Button
              className="bg-hbplus-accent hover:bg-hbplus-accent/90"
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="mr-1 size-4" />
              {t('board.createNew')}
            </Button>
          ) : undefined
        }
      />

      <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((member) => (
          <BoardMemberCard key={member.id} member={member} />
        ))}
      </div>

      <BoardMemberFormDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
