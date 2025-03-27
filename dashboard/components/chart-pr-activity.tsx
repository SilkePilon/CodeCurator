"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const chartData = [
  { date: "2024-04-01", opened: 12, closed: 8, merged: 5 },
  { date: "2024-04-08", opened: 15, closed: 10, merged: 7 },
  { date: "2024-04-15", opened: 10, closed: 12, merged: 9 },
  { date: "2024-04-22", opened: 18, closed: 14, merged: 11 },
  { date: "2024-04-29", opened: 14, closed: 9, merged: 6 },
  { date: "2024-05-06", opened: 16, closed: 11, merged: 8 },
  { date: "2024-05-13", opened: 20, closed: 15, merged: 12 },
  { date: "2024-05-20", opened: 17, closed: 13, merged: 10 },
  { date: "2024-05-27", opened: 19, closed: 16, merged: 13 },
  { date: "2024-06-03", opened: 22, closed: 18, merged: 15 },
  { date: "2024-06-10", opened: 25, closed: 20, merged: 17 },
  { date: "2024-06-17", opened: 21, closed: 19, merged: 16 },
  { date: "2024-06-24", opened: 24, closed: 22, merged: 18 },
]

const chartConfig = {
  activity: {
    label: "PR Activity",
  },
  opened: {
    label: "Opened",
    color: "hsl(var(--chart-1))",
  },
  closed: {
    label: "Closed",
    color: "hsl(var(--chart-2))",
  },
  merged: {
    label: "Merged",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function ChartPRActivity() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("30d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardTitle>PR Activity</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">Pull request activity over time</span>
          <span className="@[540px]/card:hidden">PR activity</span>
        </CardDescription>
        <div className="absolute right-4 top-4">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="@[767px]/card:flex hidden"
          >
            <ToggleGroupItem value="90d" className="h-8 px-2.5">
              Last 3 months
            </ToggleGroupItem>
            <ToggleGroupItem value="30d" className="h-8 px-2.5">
              Last 30 days
            </ToggleGroupItem>
            <ToggleGroupItem value="7d" className="h-8 px-2.5">
              Last 7 days
            </ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="@[767px]/card:hidden flex w-40" aria-label="Select a value">
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillOpened" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-opened)" stopOpacity={1.0} />
                <stop offset="95%" stopColor="var(--color-opened)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillClosed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-closed)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-closed)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillMerged" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-merged)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-merged)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area dataKey="merged" type="natural" fill="url(#fillMerged)" stroke="var(--color-merged)" stackId="a" />
            <Area dataKey="closed" type="natural" fill="url(#fillClosed)" stroke="var(--color-closed)" stackId="a" />
            <Area dataKey="opened" type="natural" fill="url(#fillOpened)" stroke="var(--color-opened)" stackId="a" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

