import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { addMonths, subMonths, format, isSameDay } from 'date-fns';
import type { BookingCategory } from '@/types';
import { useBookings } from '@/hooks/use-bookings';
import { formatMonthYear } from '@/lib/date-utils';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CalendarGrid } from './calendar-grid';
import { BookingList } from './booking-list';
import { CategoryFilter } from './category-filter';
import { BookingFormDialog } from './booking-form-dialog';

export function CalendarPage(): React.JSX.Element {
  const { t } = useTranslation();
  const [currentMonth, setCurrentMonth] = useState(() => new Date(2026, 2, 1)); // March 2026
  const [selectedCategory, setSelectedCategory] = useState<BookingCategory | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { data: bookings = [] } = useBookings();

  const filteredBookings = selectedCategory
    ? bookings.filter((b) => b.category === selectedCategory)
    : bookings;

  const selectedDayBookings = selectedDay
    ? filteredBookings.filter((b) => {
        const bookingDate = new Date(b.date);
        return isSameDay(bookingDate, selectedDay);
      })
    : [];

  function handlePrevMonth(): void {
    setCurrentMonth((prev) => subMonths(prev, 1));
    setSelectedDay(null);
  }

  function handleNextMonth(): void {
    setCurrentMonth((prev) => addMonths(prev, 1));
    setSelectedDay(null);
  }

  return (
    <div>
      <PageHeader
        titleKey="calendar.title"
        descriptionKey="calendar.description"
        actions={
          <Button
            size="sm"
            className="gap-1 bg-hb-accent hover:bg-hb-accent/90"
            onClick={() => setCreateDialogOpen(true)}
          >
            <Plus className="size-4" />
            {t('booking.createTitle')}
          </Button>
        }
      />

      <div className="space-y-4 p-6">
        <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />

        <Tabs defaultValue="month">
          <TabsList>
            <TabsTrigger value="month">{t('calendar.monthView')}</TabsTrigger>
            <TabsTrigger value="list">{t('calendar.listView')}</TabsTrigger>
          </TabsList>

          <TabsContent value="month" className="space-y-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
                <ChevronLeft className="size-5" />
              </Button>
              <h2 className="text-lg font-semibold">{formatMonthYear(currentMonth)}</h2>
              <Button variant="ghost" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="size-5" />
              </Button>
            </div>

            <CalendarGrid
              currentMonth={currentMonth}
              bookings={filteredBookings}
              selectedDay={selectedDay}
              onSelectDay={setSelectedDay}
            />

            {selectedDay && (
              <div className="space-y-2">
                <h3 className="font-medium">{format(selectedDay, 'd.M.yyyy')}</h3>
                <BookingList bookings={selectedDayBookings} showDate={false} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="list">
            <BookingList bookings={filteredBookings} />
          </TabsContent>
        </Tabs>
      </div>

      <BookingFormDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
    </div>
  );
}
