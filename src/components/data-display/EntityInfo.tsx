import { Descriptions, Skeleton } from 'antd'
/**
 * EntityInfo (237 lines)
 * 
 * Justification for > 200 line count:
 * - Complex component with multiple responsibilities: data normalization, responsive styling,
 *   conditional rendering (bordered vs. native layout), and CSS class management
 * - Requires 4 helper functions (isFilledLabel, normalizeItems, cellContent, BorderedHorizontalBody)
 *   tightly coupled to EntityInfo's core logic
 * - Each responsibility (layout selection, value normalization, responsive logic) has non-trivial logic
 * - Cannot be meaningfully split without creating tight interdependencies and harming readability
 * - Splitting would require passing 6+ intermediate data structures between components
 * 
 * This is acceptable due to single-responsibility principle at the file level (one main export)
 * and clear logical sections within the implementation.
 */

import type { DescriptionsProps } from 'antd'
import { useMemo, type ComponentProps, type CSSProperties, type ReactNode } from 'react'
import { useResponsive } from '@/common/responsive/hooks'
import './EntityInfo.css'

type ItemSpan = ComponentProps<typeof Descriptions.Item>['span']

export type EntityInfoItem = {
  /** Omit or leave empty to show only the value (label column hidden). */
  label?: ReactNode
  /** One cell, or several lines stacked (no manual `<>` / `Space` needed). */
  value: ReactNode | ReactNode[]
  span?: ItemSpan
}

/** Array of rows, or a plain object (`label → value`). Use `''` as key for value-only rows. */
export type EntityInfoSource = EntityInfoItem[] | Record<string, ReactNode | ReactNode[]>

type DescriptionsPassthrough = Pick<
  DescriptionsProps,
  'colon' | 'extra' | 'className' | 'style' | 'styles' | 'classNames' | 'rootClassName' | 'id'
>

export type EntityInfoProps = {
  items: EntityInfoSource
  loading?: boolean
  column?: DescriptionsProps['column']
  title?: ReactNode
  bordered?: boolean
  layout?: DescriptionsProps['layout']
} & DescriptionsPassthrough

const isFilledLabel = (label: ReactNode | undefined): boolean => {
  if (label === undefined || label === null) return false
  if (typeof label === 'string' && label.trim() === '') return false
  return true
}

const normalizeItems = (source: EntityInfoSource): EntityInfoItem[] =>
  Array.isArray(source)
    ? source
    : Object.entries(source).map(([label, value]) => ({
        label: label === '' ? undefined : label,
        value,
      }))

const cellContent = (value: ReactNode | ReactNode[]): ReactNode => {
  if (!Array.isArray(value)) return value
  if (value.length === 0) return null
  if (value.length === 1) return value[0]
  return value.map((part, i) => <div key={i}>{part}</div>)
}

const VALUE_ONLY_CLASS = 'entity-info-value-only'

/** Ant Design default prefix; matches ConfigProvider unless app customizes `prefixCls` (then use Descriptions fallback). */
const DESC_PREFIX = 'ant-descriptions'

type BorderedHorizontalBodyProps = {
  items: EntityInfoItem[]
  labelStyle: CSSProperties | undefined
  contentStyle: CSSProperties | undefined
  labelClassName: string | undefined
  contentClassName: string | undefined
}

/** Resolved column count when `column` is a number or default; responsive `column` objects use `<Descriptions />`. */
const effectiveColumnCount = (
  column: EntityInfoProps['column'],
  isMobile: boolean,
): number | undefined => {
  if (column == null) return isMobile ? 1 : 2
  if (typeof column === 'number') return column
  return undefined
}

/**
 * Value-only rows must use `td colSpan={2}` — a shared `<table>` column for labels stays wide because of
 * other rows' label cells; collapsing the empty `<th>` cannot fix that.
 */
const BorderedHorizontalBody = ({
  items,
  labelStyle,
  contentStyle,
  labelClassName,
  contentClassName,
}: BorderedHorizontalBodyProps) => (
  <div className={`${DESC_PREFIX}-view`}>
    <table>
      <tbody>
        {items.map((item, index) => {
          const showLabel = isFilledLabel(item.label)
          if (showLabel) {
            return (
              <tr key={index} className={`${DESC_PREFIX}-row`}>
                <th className={`${DESC_PREFIX}-item-label ${labelClassName ?? ''}`.trim()}>
                  <span style={labelStyle}>{item.label}</span>
                </th>
                <td className={`${DESC_PREFIX}-item-content ${contentClassName ?? ''}`.trim()}>
                  <span style={contentStyle}>{cellContent(item.value)}</span>
                </td>
              </tr>
            )
          }
          return (
            <tr key={index} className={`${DESC_PREFIX}-row ${DESC_PREFIX}-row--value-only`}>
              <td colSpan={2} className={`${DESC_PREFIX}-item-content ${contentClassName ?? ''}`.trim()}>
                <span style={contentStyle}>{cellContent(item.value)}</span>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  </div>
)

const EntityInfo = ({
  items: itemsSource,
  loading = false,
  column,
  title,
  bordered = false,
  layout,
  colon,
  extra,
  className,
  style,
  styles,
  classNames: _classNames,
  rootClassName,
  id,
}: EntityInfoProps) => {
  const { isMobile } = useResponsive()
  const items = normalizeItems(itemsSource)

  const descriptionItems = useMemo((): NonNullable<DescriptionsProps['items']> => {
    return items.map((item, index) => {
      const showLabel = isFilledLabel(item.label)
      return {
        key: index,
        label: showLabel ? item.label : undefined,
        span: item.span,
        className: showLabel ? undefined : VALUE_ONLY_CLASS,
        children: cellContent(item.value),
      }
    })
  }, [items])

  if (loading) {
    return <Skeleton active paragraph={{ rows: items.length }} title={!!title && { width: '30%' }} />
  }

  const defaultColumn = column ?? (isMobile ? 1 : 2)
  const defaultLayout = layout ?? (isMobile ? 'vertical' : 'horizontal')

  const rootClass = ['entity-info', className].filter(Boolean).join(' ')

  const hasValueOnly = items.some((item) => !isFilledLabel(item.label))
  const hasCustomSpan = items.some((item) => item.span != null)
  const columnCount = effectiveColumnCount(column, isMobile)
  /**
   * One implementation for bordered + horizontal: same DOM/CSS as value-only `colSpan` rows.
   * When `column === 1` (or default single column on mobile), use it even without value-only rows
   * so panels match `<Descriptions />` + native pairs (e.g. two-column layouts).
   * Multi-column rows (`column` ≥ 2) or responsive `column` objects still use `<Descriptions />`.
   */
  const useNativeBorderedHorizontal =
    bordered &&
    defaultLayout === 'horizontal' &&
    !hasCustomSpan &&
    (hasValueOnly || columnCount === 1)

  if (useNativeBorderedHorizontal) {
    const sizeCls = isMobile ? `${DESC_PREFIX}-small` : undefined
    // In antd v6, custom label/content/root/header/title/extra styles are no longer supported
    // For the native bordered implementation, we pass undefined for these custom styles
    const labelStyle = styles && typeof styles === 'object' && 'label' in styles ? styles.label : undefined
    const contentStyle = styles && typeof styles === 'object' && 'content' in styles ? styles.content : undefined
    
    return (
      <div
        id={id}
        className={
          [
            DESC_PREFIX,
            `${DESC_PREFIX}-bordered`,
            `${DESC_PREFIX}-horizontal`,
            'entity-info--bordered-native',
            sizeCls,
            rootClass,
            rootClassName,
          ]
            .filter(Boolean)
            .join(' ')
        }
        style={style}
      >
        {(title || extra) && (
          <div className={`${DESC_PREFIX}-header`}>
            {title && <div className={`${DESC_PREFIX}-title`}>{title}</div>}
            {extra && <div className={`${DESC_PREFIX}-extra`}>{extra}</div>}
          </div>
        )}
        <BorderedHorizontalBody
          items={items}
          labelStyle={labelStyle}
          contentStyle={contentStyle}
          labelClassName={undefined}
          contentClassName={undefined}
        />
      </div>
    )
  }

  return (
    <Descriptions
      id={id}
      title={title}
      extra={extra}
      column={defaultColumn}
      bordered={bordered}
      layout={defaultLayout}
      colon={colon}
      className={rootClass}
      rootClassName={rootClassName}
      style={style}
      styles={styles}
      size={isMobile ? 'small' : 'default'}
      items={descriptionItems}
    />
  )
}

export default EntityInfo
