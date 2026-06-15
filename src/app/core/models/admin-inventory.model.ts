export interface InventoryResponseDTO {
  id: number;
  productId: number;
  productName: string;
  availableQuantity: number;
  reservedQuantity: number;
  reorderLevel: number;
  totalQuantity: number;
  version: number;
  updatedAt: string;
}

export interface InventoryTransactionDTO {
  id: number;
  transactionType: 'RESTOCK' | 'RESERVE' | 'RELEASE' | 'CONSUME' | 'ADJUSTMENT';
  referenceType: string;
  referenceId: string;
  quantity: number;
  notes: string;
  createdAt: string;
}

export interface InventoryAdjustmentRequest {
  quantityDelta: number;
  referenceType: string;
  referenceId: string;
  notes: string;
}

export interface FastMovingProductDTO {
  productId: number;
  productName: string;
  unitsConsumed: number;
  netUnitsSold: number;
}

export interface SlowMovingProductDTO {
  productId: number;
  productName: string;
  unitsConsumed: number;
  netUnitsSold: number;
}

export interface TransactionSummaryDTO {
  transactionType: string;
  totalQuantity: number;
}

export interface InventoryValuationDTO {
  totalAvailableValue: number;
  totalReservedValue: number;
  totalDamagedValue: number;
}

export interface InventoryAnalyticsDashboardDTO {
  valuation: InventoryValuationDTO;
  lowStockCount: number;
  outOfStockCount: number;
  fastMovingProducts: FastMovingProductDTO[];
  slowMovingProducts: SlowMovingProductDTO[];
  transactionSummaries: TransactionSummaryDTO[];
}
