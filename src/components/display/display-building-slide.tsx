import { useTranslation } from 'react-i18next';
import { building } from '@/data';

export function DisplayBuildingSlide(): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="flex flex-1 flex-col gap-6 p-8">
      <h2 className="text-3xl font-bold text-white">{t('display.buildingInfoTitle')}</h2>
      <div className="space-y-4">
        <div className="rounded-lg bg-white/10 p-6">
          <h3 className="text-4xl font-bold text-white">{building.name}</h3>
          <div className="mt-6 grid grid-cols-2 gap-6">
            <div>
              <p className="text-lg text-white/50">{t('display.address')}</p>
              <p className="text-2xl text-white">
                {building.address}, {building.postalCode} {building.city}
              </p>
            </div>
            <div>
              <p className="text-lg text-white/50">{t('display.apartments')}</p>
              <p className="text-2xl text-white">{building.apartments}</p>
            </div>
            <div>
              <p className="text-lg text-white/50">{t('display.buildYear')}</p>
              <p className="text-2xl text-white">{building.buildYear}</p>
            </div>
            <div>
              <p className="text-lg text-white/50">{t('display.management')}</p>
              <p className="text-2xl text-white">{building.managementCompany}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
