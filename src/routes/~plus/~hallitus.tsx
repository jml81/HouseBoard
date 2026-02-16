import { createFileRoute } from '@tanstack/react-router';
import { BoardPage } from '@/components/board/board-page';

export const Route = createFileRoute('/plus/hallitus')({
  component: HallitusPage,
});

function HallitusPage(): React.JSX.Element {
  return <BoardPage />;
}
