"use client"
import {useState, useContext} from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
  getSortedRowModel,
  VisibilityState,
  useReactTable,
} from "@tanstack/react-table"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem
  } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import CustomFieldPopover from "./CustomFieldPopover"
import CurrentUserContext from "@/app/contexts/CurrentUserContext"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Spinner from "@/components/Spinner"


export function DataTable({
  columns,
  data,
  isOpen,
  setIsOpen,
  setIsRefreshTrigger
}) {
  const supabase = createClientComponentClient();
    const [sorting, setSorting] = useState([])
    const [columnFilters, setColumnFilters] = useState([])
    const [columnVisibility, setColumnVisibility] = useState({})
    const [rowSelection, setRowSelection] = useState({})
    const [red, setred] = useState([])
    const [blue, setblue] = useState([])
    const [green, setgreen] = useState([])
    const [yellow, setyellow] = useState([])
    const [grey, setgrey] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const currentUser = useContext(CurrentUserContext);



  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    },
  })

  const handleColorOnChange = async (stateSetter, thisColor) => {
    setIsLoading(true)
    const rows = table.getRowModel().rows
    for(const key in rowSelection) {
      let id = rows[key]?.original?.id
      let color = getColor(id)
      if(color) {
        const index = eval(color)?.indexOf(id)
        const newArr = eval(color)
        newArr?.splice(index, 1)
        eval(`set${color}`)([...newArr])
      }
      
      const { data: colorData } = await supabase
      .from("row_colors")
      .select(`*`)
      .eq("account_id", id)
      .maybeSingle();

      if(colorData) {
        if(colorData?.color_hex !== thisColor) {

          const {error} = await supabase
          .from("row_colors")
          .update({ color_hex: thisColor })
          .eq("account_id", id);
          console.log(error)
      }
      } else {
        await supabase.from("row_colors").insert([
          {
            account_id: id,
            profile_id: currentUser?.profile?.id,
            color_hex: thisColor
          },
        ]);
      }
      stateSetter(prevState => [...prevState, id])
    }
    table?.resetRowSelection(true)
    setIsLoading(false)
  }

  const getColor = (id) => {
    if(green.includes(id)) {
      return 'green'
    }
    if(blue.includes(id)) {
      return 'blue'
    }
    if(red.includes(id)) {
      return 'red'
    }
    if(yellow.includes(id)) {
      return 'yellow'
    }
    if(grey.includes(id)) {
      return 'grey'
    }
    return null
  }
  return (
    <div>
    <Spinner isLoading={isLoading} />
        <div className="flex justify-between items-center py-4">
          <div className="flex justify-between items-center py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto mr-4">
              Colors
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
                  <DropdownMenuItem
                  onClick={() => handleColorOnChange(setgreen, 'green')}
                  >
                    <div className="h-3 w-3 bg-[#A5D39C] rounded-full mr-1"/>
                    Green
                  </DropdownMenuItem>
                  <DropdownMenuItem
                  onClick={() => handleColorOnChange(setblue, 'blue')}
                  >
                    <div className="h-3 w-3 bg-[#B0D1E8] rounded-full mr-1"/>
                    Blue
                  </DropdownMenuItem>
                  <DropdownMenuItem
                  onClick={() => handleColorOnChange(setred, 'red')}
                  >            
                  <div className="h-3 w-3 bg-[#FF6C5C] rounded-full mr-1"/>
                    Red
                  </DropdownMenuItem>
                  <DropdownMenuItem
                  onClick={() => handleColorOnChange(setyellow, 'yellow')}
                  >
                    <div className="h-3 w-3 bg-[#FFE699] rounded-full mr-1"/>
                    Yellow
                  </DropdownMenuItem>
                  <DropdownMenuItem
                  onClick={() => handleColorOnChange(setgrey, 'grey')}
                  >
                    <div className="h-3 w-3 bg-[#D09FB8] rounded-full mr-1"/>
                    Grey
                  </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
            <Input
            placeholder="Filter by name"
            value={(table?.getColumn("Name")?.getFilterValue()) ?? ""}
            onChange={(event) =>
                table.getColumn("Name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
            />
            </div>
            <div>

            <CustomFieldPopover setIsRefreshTrigger={setIsRefreshTrigger}/>
        <Button onClick={() => setIsOpen(!isOpen)} variant="secondary" className="ml-auto mr-4">
        Add filter
      </Button>
      <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter(
                (column) => column.getCanHide()
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize pr-10"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
      </div>
    <div className="rounded-md border cursor-default">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              let savedColor = row?.original?.rowColor?.rowColor
              let color = (savedColor && !getColor(row?.original?.id)) ? savedColor : getColor(row?.original?.id)
              return (
              <TableRow
                key={row.id}
                className={color}
                data-color={color}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => {
                  const size = cell.column.getSize()
                  return(
                  <TableCell className={`max-w-[${size}px]`} key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                )})}
              </TableRow>
            )})
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
          <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
  {table.getFilteredSelectedRowModel().rows.length} of{" "}
  {table.getFilteredRowModel().rows.length} row(s) selected.
</div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
  )
}
