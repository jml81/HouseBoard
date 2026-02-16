import type { BoardRole } from '@/types';
import { boardMembers } from '@/data';
import { PageHeader } from '@/components/common/page-header';
import { BoardMemberCard } from './board-member-card';

const ROLE_ORDER: Record<BoardRole, number> = {
  puheenjohtaja: 0,
  varapuheenjohtaja: 1,
  jasen: 2,
  varajasen: 3,
};

export function BoardPage(): React.JSX.Element {
  const sorted = [...boardMembers].sort((a, b) => ROLE_ORDER[a.role] - ROLE_ORDER[b.role]);

  return (
    <div>
      <PageHeader titleKey="board.title" descriptionKey="board.description" />

      <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((member) => (
          <BoardMemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}
