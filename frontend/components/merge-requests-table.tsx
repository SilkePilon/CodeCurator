"use client"

import * as React from "react"
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  AlertCircleIcon,
  BrainCircuitIcon,
  CheckCircle2Icon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  CircleDotIcon,
  ColumnsIcon,
  FilterIcon,
  GitBranchIcon,
  GitMergeIcon,
  GitPullRequestIcon,
  GripVerticalIcon,
  MessageSquareIcon,
  MoreVerticalIcon,
  PlusIcon,
  SparklesIcon,
} from "lucide-react"
import { toast } from "sonner"
import { z } from "zod"

import { useIsMobile } from "@/hooks/use-mobile"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

export const schema = z.object({
  id: z.number(),
  title: z.string(),
  type: z.string(),
  status: z.string(),
  repository: z.string(),
  author: z.string(),
  created: z.string(),
  updated: z.string(),
  reviewers: z.array(z.string()),
  aiReviewed: z.boolean(),
  priority: z.string(),
  branch: z.string(),
  source: z.string(),
})

// Create a separate component for the drag handle
function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({
    id,
  })

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground hover:bg-transparent"
    >
      <GripVerticalIcon className="size-3 text-muted-foreground" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}

function getStatusIcon(status: string) {
  switch (status) {
    case "Open":
      return <CircleDotIcon className="text-green-500 dark:text-green-400" />
    case "In Review":
      return <GitPullRequestIcon className="text-blue-500 dark:text-blue-400" />
    case "Merged":
      return <GitMergeIcon className="text-purple-500 dark:text-purple-400" />
    default:
      return <CircleDotIcon className="text-green-500 dark:text-green-400" />
  }
}

function getPriorityBadge(priority: string) {
  switch (priority) {
    case "Critical":
      return <Badge variant="destructive">{priority}</Badge>
    case "High":
      return (
        <Badge variant="outline" className="border-red-500 text-red-500">
          {priority}
        </Badge>
      )
    case "Medium":
      return (
        <Badge variant="outline" className="border-yellow-500 text-yellow-500">
          {priority}
        </Badge>
      )
    case "Low":
      return (
        <Badge variant="outline" className="border-green-500 text-green-500">
          {priority}
        </Badge>
      )
    default:
      return <Badge variant="outline">{priority}</Badge>
  }
}

function getTypeIcon(type: string) {
  switch (type) {
    case "Bug":
      return <AlertCircleIcon className="text-red-500 dark:text-red-400" />
    case "Feature":
      return <SparklesIcon className="text-blue-500 dark:text-blue-400" />
    case "Security":
      return <CheckCircle2Icon className="text-green-500 dark:text-green-400" />
    default:
      return null
  }
}

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      return <MRCellViewer item={row.original} />
    },
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {getTypeIcon(row.original.type)}
        <Badge variant="outline" className="px-1.5 text-muted-foreground">
          {row.original.type}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="outline" className="flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3">
        {getStatusIcon(row.original.status)}
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "repository",
    header: "Repository",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <GitBranchIcon className="h-4 w-4 text-muted-foreground" />
        <span>{row.original.repository}</span>
      </div>
    ),
  },
  {
    accessorKey: "author",
    header: "Author",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-6 w-6">
          <AvatarFallback>{row.original.author.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <span>{row.original.author}</span>
      </div>
    ),
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => <div className="flex justify-center">{getPriorityBadge(row.original.priority)}</div>,
  },
  {
    accessorKey: "aiReviewed",
    header: "AI Review",
    cell: ({ row }) => (
      <div className="flex justify-center">
        {row.original.aiReviewed ? (
          <Badge
            variant="outline"
            className="flex gap-1 px-1.5 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
          >
            <CheckCircle2Icon className="h-3 w-3" />
            Reviewed
          </Badge>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="flex gap-1 text-xs"
            onClick={() => {
              toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
                loading: `Running AI review for MR #${row.original.id}`,
                success: "AI review completed",
                error: "Error running AI review",
              })
            }}
          >
            <BrainCircuitIcon className="h-3 w-3" />
            Review
          </Button>
        )}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex size-8 text-muted-foreground data-[state=open]:bg-muted" size="icon">
            <MoreVerticalIcon />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem>View MR details</DropdownMenuItem>
          <DropdownMenuItem>Run AI code review</DropdownMenuItem>
          <DropdownMenuItem>Ask AI about this MR</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Assign to me</DropdownMenuItem>
          <DropdownMenuItem>Add reviewers</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Close MR</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
      ))}
    </TableRow>
  )
}

export function MergeRequestsTable({
  data: initialData,
}: {
  data: z.infer<typeof schema>[]
}) {
  const [data, setData] = React.useState(() => initialData)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const sortableId = React.useId()
  const sensors = useSensors(useSensor(MouseSensor, {}), useSensor(TouchSensor, {}), useSensor(KeyboardSensor, {}))

  const dataIds = React.useMemo<UniqueIdentifier[]>(() => data?.map(({ id }) => id) || [], [data])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }

  return (
    <Tabs defaultValue="all" className="flex w-full flex-col justify-start gap-6">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select defaultValue="all">
          <SelectTrigger className="@4xl/main:hidden flex w-fit" id="view-selector">
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All MRs</SelectItem>
            <SelectItem value="open">Open MRs</SelectItem>
            <SelectItem value="review">In Review</SelectItem>
            <SelectItem value="merged">Merged</SelectItem>
          </SelectContent>
        </Select>
        <TabsList className="@4xl/main:flex hidden">
          <TabsTrigger value="all">All MRs</TabsTrigger>
          <TabsTrigger value="open" className="gap-1">
            Open
            <Badge
              variant="secondary"
              className="flex h-5 w-5 items-center justify-center rounded-full bg-muted-foreground/30"
            >
              6
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="review" className="gap-1">
            In Review
            <Badge
              variant="secondary"
              className="flex h-5 w-5 items-center justify-center rounded-full bg-muted-foreground/30"
            >
              5
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="merged">Merged</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ColumnsIcon />
                <span className="hidden lg:inline">Customize Columns</span>
                <span className="lg:hidden">Columns</span>
                <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm">
            <FilterIcon className="mr-2 h-4 w-4" />
            <span className="hidden lg:inline">Filter</span>
          </Button>
          <Button variant="outline" size="sm">
            <PlusIcon />
            <span className="hidden lg:inline">New MR</span>
          </Button>
        </div>
      </div>
      <TabsContent value="all" className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-muted">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
            selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger className="w-20" id="rows-per-page">
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeftIcon />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeftIcon />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRightIcon />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRightIcon />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="open" className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent value="review" className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent value="merged" className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
    </Tabs>
  )
}

function MRCellViewer({ item }: { item: z.infer<typeof schema> }) {
  const isMobile = useIsMobile()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="w-fit px-0 text-left text-foreground">
          {item.title}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="gap-1">
          <DialogTitle className="flex items-center gap-2">
            <GitMergeIcon className="h-5 w-5" />
            {item.title}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <Badge variant="outline" className="flex gap-1 px-1.5">
              {getStatusIcon(item.status)}
              {item.status}
            </Badge>
            <span>•</span>
            <span className="text-muted-foreground">
              {item.repository} • {item.branch}
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto py-4">
          <Tabs defaultValue="changes">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="changes">Changes</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="ai-review">AI Review</TabsTrigger>
              <TabsTrigger value="ask-ai">Ask AI</TabsTrigger>
            </TabsList>
            <TabsContent value="changes" className="mt-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium">Files changed</h3>
                  <Badge variant="outline">5 files</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                    <span className="text-sm">src/components/auth/login.tsx</span>
                    <Badge variant="outline">+15 -3</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                    <span className="text-sm">src/lib/auth.ts</span>
                    <Badge variant="outline">+8 -2</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                    <span className="text-sm">src/pages/login.tsx</span>
                    <Badge variant="outline">+5 -1</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                    <span className="text-sm">src/styles/auth.css</span>
                    <Badge variant="outline">+12 -0</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                    <span className="text-sm">tests/auth.test.ts</span>
                    <Badge variant="outline">+20 -5</Badge>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="comments" className="mt-4">
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>JT</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">jamiktashpulatov</span>
                    <span className="text-xs text-muted-foreground">2 days ago</span>
                  </div>
                  <p className="text-sm">
                    The authentication flow looks good, but we should add more error handling for edge cases.
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>EL</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">eddielake</span>
                    <span className="text-xs text-muted-foreground">1 day ago</span>
                  </div>
                  <p className="text-sm">
                    I agree with Jamik. Also, let's make sure we're handling token expiration correctly.
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="comment">Add a comment</Label>
                    <Textarea id="comment" placeholder="Type your comment here..." />
                    <Button className="self-end mt-2">Comment</Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="ai-review" className="mt-4">
              {item.aiReviewed ? (
                <div className="space-y-4">
                  <div className="rounded-lg border p-4 bg-green-50 dark:bg-green-950">
                    <div className="flex items-center gap-2 mb-2">
                      <BrainCircuitIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <span className="font-medium">AI Code Review</span>
                      <Badge variant="outline" className="ml-auto">
                        3 suggestions
                      </Badge>
                    </div>
                    <p className="text-sm mb-4">
                      I've reviewed the code changes and found a few potential improvements.
                    </p>
                    <div className="space-y-2">
                      <div className="rounded-md bg-white dark:bg-gray-800 p-3 border border-green-200 dark:border-green-800">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Security Issue: Potential XSS vulnerability</span>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                View Fix
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>AI Suggested Fix</DialogTitle>
                                <DialogDescription>
                                  For the XSS vulnerability in src/components/auth/login.tsx
                                </DialogDescription>
                              </DialogHeader>
                              <div className="bg-muted p-4 rounded-md font-mono text-sm overflow-auto">
                                <pre>{`- const message = \`<div>\${errorMessage}</div>\`;
+ const message = errorMessage;

- dangerouslySetInnerHTML={{ __html: message }}
+ {message}`}</pre>
                              </div>
                              <DialogFooter>
                                <Button variant="outline">Copy to Clipboard</Button>
                                <Button>Apply Fix</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          The login component uses dangerouslySetInnerHTML which could lead to XSS attacks. Consider
                          using safe text rendering instead.
                        </p>
                      </div>
                      <div className="rounded-md bg-white dark:bg-gray-800 p-3 border border-yellow-200 dark:border-yellow-800">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Performance: Unnecessary re-renders</span>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                View Fix
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>AI Suggested Fix</DialogTitle>
                                <DialogDescription>
                                  For the performance issue in src/components/auth/login.tsx
                                </DialogDescription>
                              </DialogHeader>
                              <div className="bg-muted p-4 rounded-md font-mono text-sm overflow-auto">
                                <pre>{`- const handleSubmit = () => {
+ const handleSubmit = React.useCallback(() => {
  // function body
- }
+ }, [username, password])`}</pre>
                              </div>
                              <DialogFooter>
                                <Button variant="outline">Copy to Clipboard</Button>
                                <Button>Apply Fix</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          The handleSubmit function is recreated on every render. Consider using useCallback to prevent
                          unnecessary re-renders.
                        </p>
                      </div>
                      <div className="rounded-md bg-white dark:bg-gray-800 p-3 border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Accessibility: Missing aria attributes</span>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                View Fix
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>AI Suggested Fix</DialogTitle>
                                <DialogDescription>
                                  For the accessibility issue in src/components/auth/login.tsx
                                </DialogDescription>
                              </DialogHeader>
                              <div className="bg-muted p-4 rounded-md font-mono text-sm overflow-auto">
                                <pre>{`- <input type="text" id="username" />
+ <input 
+   type="text" 
+   id="username" 
+   aria-required="true"
+   aria-describedby="username-error"
+ />

+ <div id="username-error" className="sr-only">
+   {errors.username}
+ </div>`}</pre>
                              </div>
                              <DialogFooter>
                                <Button variant="outline">Copy to Clipboard</Button>
                                <Button>Apply Fix</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Form inputs are missing proper aria attributes for accessibility. Add aria-required and
                          aria-describedby attributes.
                        </p>
                      </div>
                    </div>
                    <Button className="mt-4 w-full" variant="outline">
                      <SparklesIcon className="mr-2 h-4 w-4" />
                      Run AI Review Again
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <BrainCircuitIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No AI review yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Run an AI code review to get suggestions and improvements for this merge request.
                  </p>
                  <Button
                    onClick={() => {
                      toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
                        loading: `Running AI review for MR #${item.id}`,
                        success: "AI review completed",
                        error: "Error running AI review",
                      })
                    }}
                  >
                    <BrainCircuitIcon className="mr-2 h-4 w-4" />
                    Run AI Review
                  </Button>
                </div>
              )}
            </TabsContent>
            <TabsContent value="ask-ai" className="mt-4">
              <div className="flex flex-col h-[400px]">
                <div className="flex-1 overflow-y-auto border rounded-lg p-4 mb-4">
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>ME</AvatarFallback>
                      </Avatar>
                      <div className="rounded-lg bg-muted p-3">
                        <p className="text-sm">Can you explain what this merge request is trying to accomplish?</p>
                      </div>
                    </div>
                    <div className="flex gap-3 justify-end">
                      <div className="rounded-lg bg-primary p-3 text-primary-foreground">
                        <p className="text-sm">
                          This merge request is addressing a bug in the authentication flow where users were sometimes
                          getting logged out unexpectedly. The main changes include:
                        </p>
                        <ul className="list-disc pl-5 mt-2 text-sm">
                          <li>Fixing token refresh mechanism to handle expired tokens</li>
                          <li>Adding proper error handling for network failures</li>
                          <li>Implementing secure storage for auth tokens</li>
                          <li>Updating the login form validation</li>
                        </ul>
                      </div>
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>ME</AvatarFallback>
                      </Avatar>
                      <div className="rounded-lg bg-muted p-3">
                        <p className="text-sm">Are there any security concerns with this implementation?</p>
                      </div>
                    </div>
                    <div className="flex gap-3 justify-end">
                      <div className="rounded-lg bg-primary p-3 text-primary-foreground">
                        <p className="text-sm">I've identified a few security concerns in the implementation:</p>
                        <ul className="list-disc pl-5 mt-2 text-sm">
                          <li>There's a potential XSS vulnerability in how error messages are displayed</li>
                          <li>The token storage mechanism could be improved to use HttpOnly cookies</li>
                          <li>Consider implementing CSRF protection for the authentication endpoints</li>
                          <li>The password validation rules should be strengthened</li>
                        </ul>
                        <p className="text-sm mt-2">
                          I'd recommend addressing these issues before merging the request to ensure the authentication
                          system is secure.
                        </p>
                      </div>
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Input placeholder="Ask AI about this merge request..." className="flex-1" />
                  <Button>
                    <MessageSquareIcon className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <DialogFooter className="mt-4 flex gap-2">
          <Button>Approve MR</Button>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

