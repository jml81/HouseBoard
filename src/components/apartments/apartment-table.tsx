import type { Apartment } from '@/types';
import { ApartmentRow } from './apartment-row';

interface ApartmentTableProps {
  apartments: Apartment[];
}

export function ApartmentTable({ apartments }: ApartmentTableProps): React.JSX.Element {
  return (
    <div className="space-y-2">
      {apartments.map((apartment) => (
        <ApartmentRow key={apartment.id} apartment={apartment} />
      ))}
    </div>
  );
}
