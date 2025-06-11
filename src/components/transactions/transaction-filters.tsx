import {
  CalendarIcon,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Calendar } from "~/components/ui/calendar";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import { format } from "date-fns";
import type { FilterState } from "~/types/transactions";

export default function TransactionFilters({
  filterState,
  setFilterState,
}: {
  filterState: FilterState;
  setFilterState: (filterState: FilterState) => void;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
              <Input
                type="search"
                placeholder={`Search ${activeTab === "all" ? "transactions" : activeTab}...`}
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="category">
                    {activeTab === "all"
                      ? "Category"
                      : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(0, -1)} Category`}
                  </Label>
                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={`All ${activeTab === "all" ? "Categories" : activeTab.charAt(0).toUpperCase() + activeTab.slice(0, -1) + " Categories"}`}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        All{" "}
                        {activeTab === "all"
                          ? "Categories"
                          : activeTab.charAt(0).toUpperCase() +
                          activeTab.slice(0, -1) +
                          " Categories"}
                      </SelectItem>
                      {actualCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category
                            .split("-")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1),
                            )
                            .join(" ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="min-amount">{amountPlaceholders.min}</Label>
                  <Input
                    id="min-amount"
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*\.?[0-9]*"
                    placeholder="0.00"
                    value={minAmount}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*\.?\d*$/.test(value)) {
                        setMinAmount(value);
                      }
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-amount">{amountPlaceholders.max}</Label>
                  <Input
                    id="max-amount"
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*\.?[0-9]*"
                    placeholder="999.99"
                    value={maxAmount}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*\.?\d*$/.test(value)) {
                        setMaxAmount(value);
                      }
                    }}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateFrom && !dateTo && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateFrom && dateTo
                          ? `${format(dateFrom, "MMM d")} - ${format(dateTo, "MMM d, yyyy")}`
                          : dateFrom
                            ? `From ${format(dateFrom, "MMM d, yyyy")}`
                            : dateTo
                              ? `Until ${format(dateTo, "MMM d, yyyy")}`
                              : "Select date range"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="space-y-4 p-4">
                        <div className="space-y-2">
                          <div className="text-muted-foreground text-sm">
                            {!dateFrom && !dateTo
                              ? "Click a date to start selecting range"
                              : dateFrom && !dateTo
                                ? "Click another date to complete range"
                                : "Date range selected"}
                          </div>
                          <Calendar
                            mode="range"
                            selected={
                              dateFrom && dateTo
                                ? { from: dateFrom, to: dateTo }
                                : undefined
                            }
                            onSelect={(range) => {
                              if (range?.from) {
                                setDateFrom(range.from);
                                setDateTo(range.to);
                              } else {
                                setDateFrom(undefined);
                                setDateTo(undefined);
                              }
                            }}
                            numberOfMonths={1}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setDateFrom(undefined);
                              setDateTo(undefined);
                            }}
                            className="flex-1"
                          >
                            Clear
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="w-full"
                  >
                    Clear All Filters
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}