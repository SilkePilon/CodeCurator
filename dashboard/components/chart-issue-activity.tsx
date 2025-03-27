"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const chartData = [
  { date: "2024-04-01", opened: 15, closed: 10, inProgress: 8 },
  { date: "2024-04-08", opened: 18, closed: 12, inProgress: 10 },
  { date: "2024-04-15", opened: 12, closed: 15, inProgress: 7 },
  { date: "2024-04-22", opened: 20, closed: 16, inProgress: 12 },
  { date: "2024-04-29", opened: 16, closed: 11, inProgress: 9 },
  { date: "2024-05-06", opened: 19, closed: 14, inProgress: 11 },
  { date: "2024-05-13", opened: 22, closed: 18, inProgress: 14 },
  { date: "2024-05-20", opened: 20, closed: 15, inProgress: 12 },
  { date: "2024-05-27", opened: 24, closed: 19, inProgress: 15 },
  { date: "2024-06-03", opened: 26, closed: 21, inProgress: 17 },
  { date: "2024-06-10", opened: 28, closed: 23, inProgress: 19 },
  { date: "2024-06-17", opened: 25, closed: 22, inProgress: 18 },
  { date: "2024-06-24", opened: 27, closed: 24, inProgress: 20 },
]

const chartConfig = {
  activity: {
    label: "Issue Activity",
  },
  opened: {
    label: "Opened",
    color: "hsl(var(--chart-1))",
  },
  closed: {
    label: "Closed",
    color: "hsl(var(--chart-2))",
  },
  inProgress: {
    label: "In Progress",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function ChartIssueActivity() {
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
        <CardTitle>Issue Activity</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">Issue activity over time</span>
          <span className="@[540px]/card:hidden">Issue activity</span>
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
              <linearGradient id="fillInProgress" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-inProgress)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-inProgress)" stopOpacity={0.1} />
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
            <Area
              dataKey="inProgress"
              type="natural"
              fill="url(#fillInProgress)"
              stroke="var(--color-inProgress)"
              stackId="a"
            />
            <Area dataKey="closed" type="natural" fill="url(#fillClosed)" stroke="var(--color-closed)" stackId="a" />
            <Area dataKey="opened" type="natural" fill="url(#fillOpened)" stroke="var(--color-opened)" stackId="a" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

