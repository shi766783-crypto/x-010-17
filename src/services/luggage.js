import { DESTINATION_TYPES } from '../constants'
import { uid } from '../utils/id'

// 根据出行类型推导目的地类型（国内 / 国外）
export function getDestinationType(tripType) {
  return tripType === '出国' ? DESTINATION_TYPES.ABROAD : DESTINATION_TYPES.DOMESTIC
}

// 构造单个模板物品
function item(name, category, extra = {}) {
  return { id: uid(), name, category, custom: false, packed: false, ...extra }
}

// 根据出行天数与目的地类型自动生成行李清单模板
export function generateLuggageTemplate({ tripType, days = 1 }) {
  const isAbroad = getDestinationType(tripType) === DESTINATION_TYPES.ABROAD
  const items = []

  // 证件类
  if (isAbroad) {
    items.push(item('护照', '证件类'))
    items.push(item('签证', '证件类'))
    items.push(item('身份证', '证件类'))
    items.push(item('驾照及翻译件', '证件类'))
  } else {
    items.push(item('身份证', '证件类'))
    items.push(item('驾驶证', '证件类'))
  }

  // 衣物类（数量随天数变化）
  items.push(item(`内衣裤 ×${days}`, '衣物类'))
  items.push(item(`袜子 ×${days}`, '衣物类'))
  items.push(item(`换洗衣物 ×${days}`, '衣物类'))
  items.push(item('外套', '衣物类'))
  items.push(item('睡衣', '衣物类'))
  items.push(item('舒适鞋', '衣物类'))

  // 洗漱类
  items.push(item('牙刷', '洗漱类'))
  items.push(item('牙膏', '洗漱类'))
  items.push(item('毛巾', '洗漱类'))
  items.push(item('洗发水', '洗漱类'))
  items.push(item('沐浴露', '洗漱类'))
  items.push(item('护肤品', '洗漱类'))
  if (isAbroad || days >= 3) items.push(item('防晒霜', '洗漱类'))

  // 电子设备类
  items.push(item('手机', '电子设备类'))
  items.push(item('充电器', '电子设备类'))
  items.push(item('充电宝', '电子设备类'))
  items.push(item('耳机', '电子设备类'))
  if (isAbroad) items.push(item('转换插头', '电子设备类'))
  if (days >= 3) items.push(item('相机', '电子设备类'))

  // 药品类
  items.push(item('感冒药', '药品类'))
  items.push(item('肠胃药', '药品类'))
  items.push(item('创可贴', '药品类'))
  if (days >= 3) items.push(item('晕车药', '药品类'))
  if (isAbroad) items.push(item('个人常用药', '药品类'))

  // 其他类
  items.push(item('雨伞', '其他类'))
  items.push(item('水杯', '其他类'))
  items.push(item('纸巾', '其他类'))
  items.push(item('行李箱', '其他类'))
  if (isAbroad) items.push(item('护照夹', '其他类'))

  return items
}

// 计算单个行李清单的打包完成率（0-100）
export function luggageCompletionRate(items = []) {
  if (!items.length) return 0
  const packed = items.filter((i) => i.packed).length
  return Math.round((packed / items.length) * 100)
}
