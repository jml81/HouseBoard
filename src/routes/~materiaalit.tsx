import { createFileRoute } from '@tanstack/react-router';
import { MaterialsPage } from '@/components/materials/materials-page';

export const Route = createFileRoute('/materiaalit')({
  component: MaterialsPage,
});
