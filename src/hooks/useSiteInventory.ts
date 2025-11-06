import { useMemo } from 'react';
import { Waybill, Asset } from '@/types/asset';
import { SiteInventoryItem } from '@/types/inventory';

export const useSiteInventory = (waybills: Waybill[], assets: Asset[]) => {
  const siteInventory = useMemo(() => {
    // Use the asset's siteQuantities field which is accurately maintained by backend
    const inventory: SiteInventoryItem[] = [];
    const itemMap = new Map<string, SiteInventoryItem>();

    // Get all unique site IDs from assets (including zero quantities)
    assets.forEach(asset => {
      if (asset.siteQuantities) {
        Object.entries(asset.siteQuantities).forEach(([siteId, quantity]) => {
          if (quantity !== undefined) {
            const key = `${siteId}-${asset.id}`;
            itemMap.set(key, {
              assetId: asset.id,
              itemName: asset.name,
              quantity: quantity as number,
              unit: asset.unitOfMeasurement,
              category: asset.category,
              lastUpdated: asset.updatedAt
            });
          }
        });
      }
    });

    return Array.from(itemMap.values());
  }, [assets]);

  const getSiteInventory = (siteId: string): SiteInventoryItem[] => {
    // Use the asset's siteQuantities field for the specific site (including zero quantities)
    return assets
      .filter(asset => asset.siteQuantities && asset.siteQuantities[siteId] !== undefined)
      .map(asset => ({
        assetId: asset.id,
        itemName: asset.name,
        quantity: asset.siteQuantities![siteId],
        unit: asset.unitOfMeasurement,
        category: asset.category,
        lastUpdated: asset.updatedAt
      }));
  };

  return {
    siteInventory,
    getSiteInventory
  };
};
