import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import type { MarketplaceItem, MarketplaceCategory, ItemCondition } from '@/types';
import { useMarketplaceItems } from '@/hooks/use-marketplace-items';
import { PageHeader } from '@/components/common/page-header';
import { EmptyState } from '@/components/common/empty-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { MarketplaceItemCard } from './marketplace-item-card';

const categories: MarketplaceCategory[] = [
  'huonekalu',
  'elektroniikka',
  'vaatteet',
  'urheilu',
  'kirjat',
  'muu',
];

const conditions: ItemCondition[] = ['uusi', 'hyva', 'kohtalainen', 'tyydyttava'];

export function MarketplaceList(): React.JSX.Element {
  const { t } = useTranslation();
  const { data: remoteItems = [] } = useMarketplaceItems();
  const [localAdditions, setLocalAdditions] = useState<MarketplaceItem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MarketplaceCategory | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCategory, setFormCategory] = useState<MarketplaceCategory>('muu');
  const [formCondition, setFormCondition] = useState<ItemCondition>('hyva');

  const items = useMemo(() => [...localAdditions, ...remoteItems], [localAdditions, remoteItems]);

  const filtered = useMemo(() => {
    let result = items;

    if (selectedCategory) {
      result = result.filter((i) => i.category === selectedCategory);
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (i) => i.title.toLowerCase().includes(query) || i.description.toLowerCase().includes(query),
      );
    }

    return result;
  }, [items, search, selectedCategory]);

  function resetForm(): void {
    setFormTitle('');
    setFormDescription('');
    setFormPrice('');
    setFormCategory('muu');
    setFormCondition('hyva');
  }

  function handleSubmit(e: React.FormEvent): void {
    e.preventDefault();

    const newItem: MarketplaceItem = {
      id: `mp-${Date.now()}`,
      title: formTitle,
      description: formDescription,
      price: Number(formPrice) || 0,
      category: formCategory,
      condition: formCondition,
      status: 'available',
      seller: { name: 'Oma ilmoitus', apartment: 'A 1' },
      publishedAt: new Date().toISOString().slice(0, 10),
    };

    setLocalAdditions((prev) => [newItem, ...prev]);
    setDialogOpen(false);
    resetForm();
  }

  return (
    <div>
      <PageHeader
        titleKey="marketplace.title"
        descriptionKey="marketplace.description"
        actions={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1 bg-hb-accent hover:bg-hb-accent/90">
                <Plus className="size-4" />
                {t('marketplace.sell')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>{t('marketplace.createTitle')}</DialogTitle>
                  <DialogDescription>{t('marketplace.createDescription')}</DialogDescription>
                </DialogHeader>
                <div className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="item-title">{t('marketplace.itemTitle')}</Label>
                    <Input
                      id="item-title"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="item-description">{t('marketplace.itemDescription')}</Label>
                    <Textarea
                      id="item-description"
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="item-price">{t('marketplace.itemPrice')}</Label>
                    <Input
                      id="item-price"
                      type="number"
                      min="0"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      placeholder={t('marketplace.pricePlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('marketplace.itemCategory')}</Label>
                    <Select
                      value={formCategory}
                      onValueChange={(v) => setFormCategory(v as MarketplaceCategory)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c} value={c}>
                            {t(`marketplaceCategories.${c}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t('marketplace.itemCondition')}</Label>
                    <Select
                      value={formCondition}
                      onValueChange={(v) => setFormCondition(v as ItemCondition)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {conditions.map((c) => (
                          <SelectItem key={c} value={c}>
                            {t(`itemConditions.${c}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button type="submit" className="bg-hb-accent hover:bg-hb-accent/90">
                    {t('marketplace.submit')}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="space-y-4 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Input
            placeholder={t('marketplace.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className={cn(selectedCategory === null && 'bg-hb-accent hover:bg-hb-accent/90')}
            >
              {t('common.all')}
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                className={cn(
                  selectedCategory === category && 'bg-hb-accent hover:bg-hb-accent/90',
                )}
              >
                {t(`marketplaceCategories.${category}`)}
              </Button>
            ))}
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          {filtered.length} {t('marketplace.total')}
        </p>

        {filtered.length === 0 ? (
          <EmptyState title={t('marketplace.noResults')} />
        ) : (
          <div className="space-y-4">
            {filtered.map((item) => (
              <MarketplaceItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
