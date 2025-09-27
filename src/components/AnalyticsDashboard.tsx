import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  BookOpen, 
  DollarSign, 
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award,
  Clock
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface AnalyticsData {
  registrations: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
  revenue: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
  courses: {
    total: number;
    active: number;
    completion: number;
  };
  users: {
    total: number;
    students: number;
    teachers: number;
    newThisMonth: number;
  };
}

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("30d");
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    registrations: {
      total: 247,
      thisMonth: 45,
      lastMonth: 38,
      growth: 18.4
    },
    revenue: {
      total: 625000000,
      thisMonth: 112500000,
      lastMonth: 95000000,
      growth: 18.4
    },
    courses: {
      total: 12,
      active: 8,
      completion: 85
    },
    users: {
      total: 324,
      students: 289,
      teachers: 15,
      newThisMonth: 67
    }
  });

  // Mock data for charts
  const registrationData = [
    { month: 'T1', count: 32, revenue: 80000000 },
    { month: 'T2', count: 28, revenue: 70000000 },
    { month: 'T3', count: 35, revenue: 87500000 },
    { month: 'T4', count: 42, revenue: 105000000 },
    { month: 'T5', count: 38, revenue: 95000000 },
    { month: 'T6', count: 45, revenue: 112500000 },
  ];

  const courseDistribution = [
    { name: 'N5 (Sơ cấp)', value: 40, color: '#10b981' },
    { name: 'N4 (Trung cấp)', value: 30, color: '#3b82f6' },
    { name: 'N3 (Trung cao)', value: 20, color: '#f59e0b' },
    { name: 'N2-N1 (Cao cấp)', value: 10, color: '#ef4444' },
  ];

  const dailyActivity = [
    { day: 'T2', students: 24, teachers: 3, quizzes: 8 },
    { day: 'T3', students: 31, teachers: 4, quizzes: 12 },
    { day: 'T4', students: 28, teachers: 3, quizzes: 6 },
    { day: 'T5', students: 35, teachers: 5, quizzes: 15 },
    { day: 'T6', students: 42, teachers: 4, quizzes: 18 },
    { day: 'T7', students: 19, teachers: 2, quizzes: 5 },
    { day: 'CN', students: 12, teachers: 1, quizzes: 3 },
  ];

  const topCourses = [
    { name: 'Tiếng Nhật Sơ cấp N5', students: 45, completion: 92, revenue: 112500000 },
    { name: 'Tiếng Nhật Trung cấp N4', students: 32, completion: 87, revenue: 102400000 },
    { name: 'Luyện thi JLPT N3', students: 28, completion: 95, revenue: 78400000 },
    { name: 'Giao tiếp tiếng Nhật', students: 23, completion: 89, revenue: 57500000 },
    { name: 'Kanji cơ bản', students: 19, completion: 78, revenue: 38000000 },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatGrowth = (growth: number) => {
    return `${growth > 0 ? '+' : ''}${growth.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analytics & Báo cáo</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Chọn khoảng thời gian" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7 ngày qua</SelectItem>
            <SelectItem value="30d">30 ngày qua</SelectItem>
            <SelectItem value="90d">3 tháng qua</SelectItem>
            <SelectItem value="1y">1 năm qua</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng đăng ký</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.registrations.total}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              {analytics.registrations.growth > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span className={analytics.registrations.growth > 0 ? "text-green-500" : "text-red-500"}>
                {formatGrowth(analytics.registrations.growth)}
              </span>
              <span>so với tháng trước</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics.revenue.total)}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              {analytics.revenue.growth > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span className={analytics.revenue.growth > 0 ? "text-green-500" : "text-red-500"}>
                {formatGrowth(analytics.revenue.growth)}
              </span>
              <span>so với tháng trước</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khóa học</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.courses.active}/{analytics.courses.total}</div>
            <div className="text-xs text-muted-foreground">
              <span className="text-green-500">{analytics.courses.completion}%</span> tỷ lệ hoàn thành
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Người dùng mới</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.users.newThisMonth}</div>
            <div className="text-xs text-muted-foreground">
              Tổng: {analytics.users.total} người dùng
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
          <TabsTrigger value="courses">Khóa học</TabsTrigger>
          <TabsTrigger value="users">Người dùng</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Registration Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Xu hướng đăng ký</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={registrationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#dc2626" 
                      fill="#dc2626" 
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Course Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Phân bố khóa học theo cấp độ</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      dataKey="value"
                      data={courseDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {courseDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Daily Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Hoạt động hàng ngày</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dailyActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="students" fill="#dc2626" name="Học viên" />
                    <Bar dataKey="teachers" fill="#3b82f6" name="Giáo viên" />
                    <Bar dataKey="quizzes" fill="#10b981" name="Quiz hoàn thành" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Courses */}
            <Card>
              <CardHeader>
                <CardTitle>Top khóa học</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCourses.map((course, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{course.name}</p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center space-x-1">
                              <Users className="w-3 h-3" />
                              <span>{course.students} học viên</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Target className="w-3 h-3" />
                              <span>{course.completion}% hoàn thành</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">{formatCurrency(course.revenue)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Biểu đồ doanh thu theo tháng</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={registrationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#dc2626" 
                    strokeWidth={3}
                    dot={{ fill: '#dc2626', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Doanh thu tháng này</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{formatCurrency(analytics.revenue.thisMonth)}</div>
                <div className="text-sm text-muted-foreground mt-2">
                  Tăng {formatGrowth(analytics.revenue.growth)} so với tháng trước
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Doanh thu trung bình/khóa học</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {formatCurrency(analytics.revenue.total / analytics.registrations.total)}
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  Từ {analytics.registrations.total} đăng ký
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tỷ lệ chuyển đổi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">78.5%</div>
                <div className="text-sm text-muted-foreground mt-2">
                  Từ đăng ký thành thanh toán
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="courses" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Hiệu suất khóa học</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCourses.slice(0, 3).map((course, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{course.name}</span>
                        <span className="text-sm text-muted-foreground">{course.completion}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${course.completion}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thống kê hoàn thành</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">85%</div>
                    <div className="text-sm text-muted-foreground">Tỷ lệ hoàn thành</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">4.7</div>
                    <div className="text-sm text-muted-foreground">Đánh giá trung bình</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">92%</div>
                    <div className="text-sm text-muted-foreground">Hài lòng</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">12</div>
                    <div className="text-sm text-muted-foreground">Tuần trung bình</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng học viên</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.users.students}</div>
                <div className="text-xs text-muted-foreground">
                  {((analytics.users.students / analytics.users.total) * 100).toFixed(1)}% tổng người dùng
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Giáo viên</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.users.teachers}</div>
                <div className="text-xs text-muted-foreground">
                  Tỷ lệ {(analytics.users.students / analytics.users.teachers).toFixed(1)}:1
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Người dùng mới</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.users.newThisMonth}</div>
                <div className="text-xs text-muted-foreground">
                  Tháng này
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hoạt động</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78%</div>
                <div className="text-xs text-muted-foreground">
                  Đăng nhập tuần này
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Hoạt động người dùng theo ngày</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dailyActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="students" 
                    stackId="1"
                    stroke="#dc2626" 
                    fill="#dc2626" 
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="teachers" 
                    stackId="1"
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
