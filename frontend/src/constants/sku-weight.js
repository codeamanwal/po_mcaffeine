export const sku_weight = [
    // "sku_code": "wt_per_unit"

]

export function getProductWt(sku_code){
    if(!sku_code) return 0.00;
    return sku_weight[sku_code];
}