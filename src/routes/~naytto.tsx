import { createFileRoute } from '@tanstack/react-router';
import { DisplayPage } from '@/components/display/display-page';

export const Route = createFileRoute('/naytto')({
  component: DisplayPageRoute,
});

function DisplayPageRoute(): React.JSX.Element {
  return <DisplayPage />;
}
