import { Table } from "antd"
import type { TableProps } from "antd"
import type { FilterValue, SorterResult } from "antd/es/table/interface"
import type { ColumnsType } from "antd/es/table"
import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { BaseModel } from "@/common/models"
import ColumnManager from "../column-manager/ColumnManager"
import { DndProvider } from "react-dnd"
import DraggableHeader from "../column-manager/DraggableHeader"
import { HTML5Backend } from "react-dnd-html5-backend"
import { defaultTablePageSize } from "@/common/constants"
import { spacing } from "@/config"
import { useColumnManager } from "../hooks/useColumnManager"
import { useResponsive } from "@/common/responsive/hooks"
import { useTableFullHeightCalculator } from "../hooks/useTableFullHeightCalculator"
import { useLibTranslation } from "@/common/i18n"
import MainTableToolbar from "./MainTableToolbar"

export type TableFilterType = Record<string, FilterValue | null>
export type TableSorterType<T = unknown> = SorterResult<T> | SorterResult<T>[]

export interface MainTableProps<T extends BaseModel<number | string>> extends TableProps<T> {
  totalCount: number
  onSearch?: (searchText: string) => void
  actionButtons?: ReactNode
  searchDebounceMs?: number
}

const MainTable = <T extends BaseModel<number | string>>({
  totalCount,
  onSearch,
  actionButtons,
  searchDebounceMs = 300,
  ...restProps
}: MainTableProps<T>) => {
  const tableHeaderRef = useRef<HTMLDivElement>(null)
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { t } = useLibTranslation()
  const { isMobile } = useResponsive()
  const { tableWrapperRef, getTableHeight } = useTableFullHeightCalculator(
    restProps.scroll?.y,
    tableHeaderRef,
    isMobile,
  )
  const columns = restProps.columns || []
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchText, setSearchText] = useState("")

  const {
    getColumnKey,
    getVisibleColumns,
    getEditingColumns,
    startEditing,
    applyChanges,
    cancelChanges,
    resetToDefault,
    moveColumn,
    toggleVisibility,
    setFixedStatus,
  } = useColumnManager(columns)

  useEffect(() => {
    if (isDropdownOpen) startEditing()
  }, [isDropdownOpen])

  useEffect(() => {
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
    }
  }, [])

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setSearchText(value)

      if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
      searchTimerRef.current = setTimeout(() => {
        onSearch?.(value)
      }, searchDebounceMs)
    },
    [onSearch, searchDebounceMs],
  )

  const handleApply = () => {
    applyChanges()
    setIsDropdownOpen(false)
  }

  const handleCancel = () => {
    cancelChanges()
    setIsDropdownOpen(false)
  }

  const draggableColumns = useMemo(() => {
    const visibleColumns = getVisibleColumns()
    const columnMap = new Map(columns.map((col) => [getColumnKey(col), col]))

    return visibleColumns
      .map((config, index) => {
        const col = columnMap.get(config.key)
        if (!col) return null

        return {
          ...col,
          fixed: isMobile ? false : config.fixed,
          title: (
            <DraggableHeader title={col.title as ReactNode} columnKey={config.key} index={index} moveColumn={moveColumn} />
          ),
          ellipsis: true,
          onCell: () => ({
            style: {
              whiteSpace: isMobile ? "normal" : ("nowrap" as const),
              // Mobile cell padding: spacing.sm (8px) vertical, spacing.xs (4px) horizontal for compact layout
              padding: isMobile ? `${spacing.sm}px ${spacing.xs}px` : undefined,
            },
          }),
        }
      })
      .filter(Boolean) as ColumnsType<T>
  }, [columns, getVisibleColumns, getColumnKey, isMobile, moveColumn])

  const columnManagerItems = useMemo(() => {
    const editingColumns = getEditingColumns()
    const columnMap = new Map(columns.map((col) => [getColumnKey(col), col]))

    return editingColumns.map((config) => ({
      key: config.key,
      visible: config.visible,
      fixed: config.fixed,
      title: columnMap.get(config.key)?.title?.toString() || config.key,
    }))
  }, [columns, getEditingColumns, getColumnKey])

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ height: "100%", width: "100%" }}>
        <MainTableToolbar
          headerRef={tableHeaderRef}
          isMobile={isMobile}
          searchLabel={t("labels.search")}
          columnsLabel={t("btns.columns")}
          customizeColumnsTooltip={t("labels.customizeTableColumns")}
          onSearchInputChange={onSearch ? handleSearchChange : undefined}
          searchText={searchText}
          columnMenuOpen={isDropdownOpen}
          onColumnMenuOpenChange={setIsDropdownOpen}
          columnManagerPanel={
            <ColumnManager
              columns={columnManagerItems}
              moveColumn={moveColumn}
              toggleVisibility={toggleVisibility}
              setFixedStatus={setFixedStatus}
              resetToDefault={resetToDefault}
              onCancel={handleCancel}
              onApply={handleApply}
            />
          }
          actionButtons={actionButtons}
        />
        <div style={{ height: "100%", width: "100%" }} ref={tableWrapperRef}>
          <Table
            {...restProps}
            columns={draggableColumns}
            virtual={restProps.virtual ?? true}
            pagination={{
              position: ["bottomCenter"],
              total: totalCount ?? 0,
              defaultPageSize: defaultTablePageSize,
              showSizeChanger: false,
              size: isMobile ? "small" : "middle",
              ...(restProps.pagination || {}),
            }}
            className={`w-full h-full ${restProps.className || ""}`}
            scroll={{
              // Column width multipliers: Mobile friendly (150px per column) vs Desktop (200px per column).
              // These ensure horizontal scrolling area is sized for content without layout thrashing.
              x: restProps.scroll?.x ?? (draggableColumns?.length ?? 0) * (isMobile ? 150 : 200),
              y: getTableHeight(),
            }}
            rowKey={(x) => x.id}
            size={isMobile ? "small" : "middle"}
          />
        </div>
      </div>
    </DndProvider>
  )
}

export default MainTable
