import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import type { Material, MaterialCategory } from '@/types';
import { useCreateMaterial, useUpdateMaterial } from '@/hooks/use-materials';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface MaterialFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  material?: Material;
}

export function MaterialFormDialog({
  open,
  onOpenChange,
  material,
}: MaterialFormDialogProps): React.JSX.Element {
  const { t } = useTranslation();
  const isEdit = Boolean(material);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t('materials.editTitle') : t('materials.createTitle')}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? t('materials.editDescription') : t('materials.createDescription')}
          </DialogDescription>
        </DialogHeader>
        {open && <MaterialFormBody material={material} onOpenChange={onOpenChange} />}
      </DialogContent>
    </Dialog>
  );
}

const MATERIAL_CATEGORIES: MaterialCategory[] = [
  'saannot',
  'kokoukset',
  'talous',
  'kunnossapito',
  'muut',
];

const VALID_DOCUMENT_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];
const MAX_DOCUMENT_SIZE = 20 * 1024 * 1024;

interface FormErrors {
  name?: string;
  category?: string;
  file?: string;
  updatedAt?: string;
  description?: string;
}

interface MaterialFormBodyProps {
  material?: Material;
  onOpenChange: (open: boolean) => void;
}

function MaterialFormBody({ material, onOpenChange }: MaterialFormBodyProps): React.JSX.Element {
  const { t } = useTranslation();
  const createMaterial = useCreateMaterial();
  const updateMaterial = useUpdateMaterial();
  const isEdit = Boolean(material);

  const [name, setName] = useState(material?.name ?? '');
  const [category, setCategory] = useState<MaterialCategory | ''>(material?.category ?? '');
  const [file, setFile] = useState<File | null>(null);
  const [updatedAt, setUpdatedAt] = useState(material?.updatedAt ?? '');
  const [description, setDescription] = useState(material?.description ?? '');
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!VALID_DOCUMENT_TYPES.includes(selected.type)) {
      setFormErrors((prev) => ({ ...prev, file: t('materials.fileInvalidType') }));
      e.target.value = '';
      return;
    }
    if (selected.size > MAX_DOCUMENT_SIZE) {
      setFormErrors((prev) => ({ ...prev, file: t('materials.fileTooLarge') }));
      e.target.value = '';
      return;
    }

    setFile(selected);
    setFormErrors((prev) => ({ ...prev, file: undefined }));
  }

  function validateForm(): FormErrors {
    const errors: FormErrors = {};
    if (!name.trim()) {
      errors.name = t('materials.validationNameRequired');
    }
    if (!category) {
      errors.category = t('materials.validationCategoryRequired');
    }
    if (!isEdit && !file) {
      errors.file = t('materials.validationFileRequired');
    }
    if (!updatedAt) {
      errors.updatedAt = t('materials.validationDateRequired');
    }
    if (!description.trim()) {
      errors.description = t('materials.validationDescriptionRequired');
    }
    return errors;
  }

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      if (isEdit && material) {
        await updateMaterial.mutateAsync({
          id: material.id,
          name: name.trim(),
          category: category as MaterialCategory,
          updatedAt,
          description: description.trim(),
        });
        toast.success(t('materials.updateSuccess'));
      } else {
        await createMaterial.mutateAsync({
          name: name.trim(),
          category: category as MaterialCategory,
          fileType: 'pdf',
          fileSize: '',
          updatedAt,
          description: description.trim(),
          file: file!,
        });
        toast.success(t('materials.createSuccess'));
      }
      onOpenChange(false);
    } catch {
      toast.error(isEdit ? t('materials.updateError') : t('materials.createError'));
    }
  }

  const isPending = createMaterial.isPending || updateMaterial.isPending;

  return (
    <form
      onSubmit={(e) => {
        void handleSubmit(e);
      }}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="material-name">{t('materials.formName')}</Label>
          <Input id="material-name" value={name} onChange={(e) => setName(e.target.value)} />
          {formErrors.name && <p className="text-sm text-destructive">{formErrors.name}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="material-category">{t('materials.formCategory')}</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as MaterialCategory)}>
              <SelectTrigger id="material-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MATERIAL_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {t(`categories.${cat}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors.category && (
              <p className="text-sm text-destructive">{formErrors.category}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="material-updated-at">{t('materials.formDate')}</Label>
            <Input
              id="material-updated-at"
              type="date"
              value={updatedAt}
              onChange={(e) => setUpdatedAt(e.target.value)}
            />
            {formErrors.updatedAt && (
              <p className="text-sm text-destructive">{formErrors.updatedAt}</p>
            )}
          </div>
        </div>
        {!isEdit && (
          <div className="space-y-2">
            <Label htmlFor="material-file">{t('materials.formFile')}</Label>
            <Input
              id="material-file"
              type="file"
              accept=".pdf,.docx,.xlsx"
              onChange={handleFileChange}
              className="text-sm"
            />
            <p className="text-xs text-muted-foreground">{t('materials.formFileHint')}</p>
            {file && (
              <p className="text-xs text-muted-foreground">
                {file.name} ({Math.round(file.size / 1024).toString()} KB)
              </p>
            )}
            {formErrors.file && <p className="text-sm text-destructive">{formErrors.file}</p>}
          </div>
        )}
        {isEdit && material && (
          <div className="space-y-2">
            <Label>{t('materials.currentFile')}</Label>
            <p className="text-sm text-muted-foreground">
              {material.fileType.toUpperCase()} &middot; {material.fileSize}
            </p>
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="material-description">{t('materials.formDescription')}</Label>
          <Textarea
            id="material-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
          {formErrors.description && (
            <p className="text-sm text-destructive">{formErrors.description}</p>
          )}
        </div>
      </div>
      <DialogFooter className="mt-6">
        <Button type="submit" className="bg-hb-accent hover:bg-hb-accent/90" disabled={isPending}>
          {isEdit ? t('materials.update') : t('materials.submit')}
        </Button>
      </DialogFooter>
    </form>
  );
}
