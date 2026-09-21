export {
  InputFormItem,
  SelectFormItem,
  DateFormItem,
  NumberFormItem,
  TextAreaFormItem,
  SwitchFormItem,
  TimePickerFormItem,
  CheckboxFormItem,
} from './components/forms/inputs'
export { FormItem, FormItemWrapper, FormSection } from './components/forms'
export type { FormSectionProps } from './components/forms'


export {
  MainTable,
  MainTableToolbar,
  ColumnManager,
  DraggableHeader,
  DraggableMenuItem,
  useColumnManager,
  useTableFullHeightCalculator,
  ListPageTableArea,
  TextFilterDropdown,
  textSearchColumnProps,
  textSearchMultiFieldProps,
  enumFilterColumnProps,
  booleanFilterColumnProps,
  listPageRootClassName,
  listTableScroll,
  LIST_TABLE_BODY_MAX_Y,
  LIST_TABLE_PROPS,
  DETAIL_TABLE_PROPS,
  DRAG_TYPE,
} from './components/tables'
export type {
  TableFilterType,
  TableSorterType,
  MainTableProps,
  MainTableToolbarProps,
} from './components/tables'
export type {
  FixedStatus,
  TableColumnConfig,
  DraggableHeaderProps,
  DraggableMenuItemProps,
  ListPageGap,
} from './components/tables'

// ─── Modal Components ───────────────────────────────────────
export { BaseModal, FullscreenMobileModal, ConfirmModal } from './components/modals'
export type { BaseModalProps, FullscreenMobileModalProps, ConfirmModalProps } from './components/modals'

// ─── Header Components ─────────────────────────────────────
export { MainHeader, SectionHeader, PageHeader } from './components/headers'
export type {
  MainHeaderProps,
  MainHeaderVariant,
  PageHeaderProps,
  SectionHeaderProps,
} from './components/headers'

// ─── Card Components ────────────────────────────────────────
export { StatCard, SkeletonCard } from './components/cards'

// ─── Content (loaders, empty states, action rows) ───────────
export {
  ContentLoader,
  ContentState,
  ActionColumnRow,
  DetailSkeleton,
  MobileActionSplitRow,
} from './components/content'
export type {
  ContentLoaderProps,
  ContentLoaderVariant,
  ContentStateProps,
  ActionColumnRowProps,
  DetailSkeletonProps,
  DetailSkeletonVariant,
  MobileActionSplitRowProps,
} from './components/content'

// ─── Shared Components ──────────────────────────────────────
export { SignatureCanvas, PrimaryKey } from './components/shared'

// ─── Data Display Components ───────────────────────────────
export { StatusBadge, EntityInfo } from './components/data-display'
export type { StatusBadgeProps, EntityInfoProps, EntityInfoItem, EntityInfoSource } from './components/data-display'

// ─── Hooks ──────────────────────────────────────────────────
export { useResponsive } from './common/responsive'
export { useFormRules } from './common/hooks'
export { useLibTranslation } from './common/i18n'
export { RESPONSIVE_BREAKPOINTS, MOBILE_FULLSCREEN_MODAL_CLASS } from './common/responsive'

// ─── i18n Utilities ─────────────────────────────────────────
export { registerLocale } from './common/i18n'

// ─── Providers ──────────────────────────────────────────────
export { SoftwareifyThemeProvider } from './components/providers'
export type { SoftwareifyThemeProviderProps } from './components/providers'

// ─── Design Tokens ──────────────────────────────────────────
export { brand, colors, fontSize, fontWeight, spacing, radius, softwareifyTheme } from './config'
export type { ThemeConfig } from './config'

// ─── Helpers ────────────────────────────────────────────────
export { objectToFormData, datesToDayjs } from './common/helpers'

// ─── Constants ──────────────────────────────────────────────
export {
  dateFormat,
  dateTimeFormat,
  dateTimeFormatWithoutSeconds,
  dateFormatISO,
  isoDateFormatRegex,
  passwordRegex,
  defaultTablePageSize,
  uriRegex,
  phoneFormatRegex,
  dropdownItemsMaxTake,
} from './common/constants'

// ─── Models / Types ─────────────────────────────────────────
export type { BaseModel } from './common/models'
export type { BaseFormItemProps, FormItemWrapperProps } from './common/models'
