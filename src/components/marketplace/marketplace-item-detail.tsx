import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  CalendarDays,
  User,
  Home,
  MessageCircle,
  Trash2,
  CheckCircle,
  Clock,
  ShoppingCart,
} from 'lucide-react';
import { toast } from 'sonner';
import type { MarketplaceItem } from '@/types';
import { formatDate } from '@/lib/date-utils';
import { useAuthStore } from '@/stores/auth-store';
import {
  useUpdateMarketplaceItemStatus,
  useDeleteMarketplaceItem,
} from '@/hooks/use-marketplace-items';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MarketplaceCategoryBadge } from './category-badge';
import { CategoryIcon } from './category-icon';

interface MarketplaceItemDetailProps {
  item: MarketplaceItem;
}

export function MarketplaceItemDetail({ item }: MarketplaceItemDetailProps): React.JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const isManager = useAuthStore((s) => s.isManager);
  const updateStatus = useUpdateMarketplaceItemStatus();
  const deleteItem = useDeleteMarketplaceItem();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const isOwner = item.createdBy !== null && user?.id === item.createdBy;
  const canManage = isOwner || isManager;

  async function handleStatusChange(newStatus: 'available' | 'sold' | 'reserved'): Promise<void> {
    try {
      await updateStatus.mutateAsync({ id: item.id, status: newStatus });
      toast.success(t('marketplace.statusUpdateSuccess'));
    } catch {
      toast.error(t('marketplace.statusUpdateError'));
    }
  }

  async function handleDelete(): Promise<void> {
    try {
      await deleteItem.mutateAsync(item.id);
      toast.success(t('marketplace.deleteSuccess'));
      setDeleteDialogOpen(false);
      void navigate({ to: '/kirpputori' });
    } catch {
      toast.error(t('marketplace.deleteError'));
    }
  }

  return (
    <div className="p-6">
      <Button variant="ghost" size="sm" className="mb-4 gap-1" asChild>
        <Link to="/kirpputori">
          <ArrowLeft className="size-4" />
          {t('marketplace.backToList')}
        </Link>
      </Button>

      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-muted">
            <CategoryIcon category={item.category} className="size-8" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-hb-primary">{item.title}</h1>
            <div className="mt-1 text-2xl font-bold text-hb-accent">
              {item.price === 0 ? t('marketplace.free') : `${item.price} €`}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <MarketplaceCategoryBadge category={item.category} />
          <Badge variant="outline">{t(`itemConditions.${item.condition}`)}</Badge>
          {item.status !== 'available' && (
            <Badge variant={item.status === 'sold' ? 'destructive' : 'secondary'}>
              {t(`itemStatuses.${item.status}`)}
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <CalendarDays className="size-4" />
            {t('marketplace.publishedAt')}: {formatDate(item.publishedAt)}
          </span>
          <span className="flex items-center gap-1">
            <User className="size-4" />
            {t('marketplace.seller')}: {item.seller.name}
          </span>
          <span className="flex items-center gap-1">
            <Home className="size-4" />
            {t('marketplace.apartment')}: {item.seller.apartment}
          </span>
        </div>

        <Separator />

        <div className="whitespace-pre-line text-sm leading-relaxed">{item.description}</div>

        {canManage && (
          <div className="flex flex-wrap gap-2">
            {item.status === 'available' && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1"
                  disabled={updateStatus.isPending}
                  onClick={() => {
                    void handleStatusChange('sold');
                  }}
                >
                  <CheckCircle className="size-4" />
                  {t('marketplace.markSold')}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1"
                  disabled={updateStatus.isPending}
                  onClick={() => {
                    void handleStatusChange('reserved');
                  }}
                >
                  <Clock className="size-4" />
                  {t('marketplace.markReserved')}
                </Button>
              </>
            )}
            {item.status === 'reserved' && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1"
                  disabled={updateStatus.isPending}
                  onClick={() => {
                    void handleStatusChange('sold');
                  }}
                >
                  <CheckCircle className="size-4" />
                  {t('marketplace.markSold')}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1"
                  disabled={updateStatus.isPending}
                  onClick={() => {
                    void handleStatusChange('available');
                  }}
                >
                  <ShoppingCart className="size-4" />
                  {t('marketplace.markAvailable')}
                </Button>
              </>
            )}
            {item.status === 'sold' && (
              <Button
                size="sm"
                variant="outline"
                className="gap-1"
                disabled={updateStatus.isPending}
                onClick={() => {
                  void handleStatusChange('available');
                }}
              >
                <ShoppingCart className="size-4" />
                {t('marketplace.markAvailable')}
              </Button>
            )}
            <Button
              size="sm"
              variant="destructive"
              className="gap-1"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="size-4" />
              {t('marketplace.deleteItem')}
            </Button>
          </div>
        )}

        {!isOwner && (
          <Button className="gap-2 bg-hb-accent hover:bg-hb-accent/90">
            <MessageCircle className="size-4" />
            {t('marketplace.contact')}
          </Button>
        )}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('marketplace.deleteItem')}</DialogTitle>
            <DialogDescription>{t('marketplace.deleteConfirm')}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="destructive"
              disabled={deleteItem.isPending}
              onClick={() => {
                void handleDelete();
              }}
            >
              {t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
