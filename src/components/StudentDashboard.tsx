import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  Target, 
  Calendar,
  FileText,
  Video,
  Users,
  Star,
  Download,
  PlayCircle,
  CheckCircle,
  AlertCircle,
  Brain,
  Play
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationContext";
import { useQuiz, Quiz } from "../contexts/QuizContext";
import { QuizList } from "./QuizList";
import { QuizEngine } from "./QuizEngine";

interface StudentProgress {
  courseId: number;
  courseTitle: string;
  completedLessons: number;
  totalLessons: number;
  currentLesson: string;
  lastAccessed: string;
  grade: number;
  certificates: string[];
}

interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  score?: number;
  feedback?: string;
}

interface Schedule {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'class' | 'test' | 'meeting';
  location: string;
}

export function StudentDashboard() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const { startQuiz, currentQuiz, isQuizActive } = useQuiz();
  const [studentProgress, setStudentProgress] = useState<StudentProgress[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data - in real app, fetch from backend
  useEffect(() => {
    const mockProgress: StudentProgress[] = [
      {
        courseId: 1,
        courseTitle: "Tiếng Nhật cơ bản (N5)",
        completedLessons: 12,
        totalLessons: 20,
        currentLesson: "Bài 13: Số đếm và thời gian",
        lastAccessed: "2024-11-15T10:30:00Z",
        grade: 85,
        certificates: []
      },
      {
        courseId: 2,
        courseTitle: "Tiếng Nhật trung cấp (N4)",
        completedLessons: 8,
        totalLessons: 24,
        currentLesson: "Bài 9: Ngữ pháp điều kiện",
        lastAccessed: "2024-11-14T14:20:00Z",
        grade: 78,
        certificates: ["N5 Certificate"]
      }
    ];

    const mockAssignments: Assignment[] = [
      {
        id: "1",
        title: "Bài tập từ vựng tuần 3",
        dueDate: "2024-11-20T23:59:59Z",
        status: "pending"
      },
      {
        id: "2", 
        title: "Luận văn về văn hóa Nhật Bản",
        dueDate: "2024-11-25T23:59:59Z",
        status: "submitted"
      },
      {
        id: "3",
        title: "Kiểm tra giữa kỳ N4",
        dueDate: "2024-11-18T09:00:00Z",
        status: "graded",
        score: 88,
        feedback: "Làm rất tốt! Cần chú ý thêm về cách sử dụng keigo."
      }
    ];

    const mockSchedule: Schedule[] = [
      {
        id: "1",
        title: "Lớp học N5 - Bài 14",
        date: "2024-11-16",
        time: "19:00 - 20:30",
        type: "class",
        location: "Phòng 101 - Online"
      },
      {
        id: "2",
        title: "Kiểm tra giữa kỳ N4",
        date: "2024-11-18",
        time: "09:00 - 11:00", 
        type: "test",
        location: "Phòng thi A2"
      },
      {
        id: "3",
        title: "Gặp gỡ Sensei Tanaka",
        date: "2024-11-20",
        time: "15:00 - 15:30",
        type: "meeting",
        location: "Phòng tư vấn"
      }
    ];

    setStudentProgress(mockProgress);
    setAssignments(mockAssignments);
    setSchedule(mockSchedule);
    setLoading(false);
  }, []);

  const totalProgress = studentProgress.reduce((acc, course) => 
    acc + (course.completedLessons / course.totalLessons * 100), 0
  ) / studentProgress.length || 0;

  const overallGrade = studentProgress.reduce((acc, course) => 
    acc + course.grade, 0
  ) / studentProgress.length || 0;

  const pendingAssignments = assignments.filter(a => a.status === 'pending').length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN');
  };

  const handleQuizSelect = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    startQuiz(quiz);
  };

  const getScheduleIcon = (type: Schedule['type']) => {
    switch (type) {
      case 'class':
        return <BookOpen className="w-4 h-4" />;
      case 'test':
        return <FileText className="w-4 h-4" />;
      case 'meeting':
        return <Users className="w-4 h-4" />;
    }
  };

  const getScheduleColor = (type: Schedule['type']) => {
    switch (type) {
      case 'class':
        return 'bg-blue-500';
      case 'test':
        return 'bg-red-500';
      case 'meeting':
        return 'bg-green-500';
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard học viên</h1>
          <p className="text-muted-foreground">Xin chào, {user?.user_metadata?.fullName || user?.email}!</p>
        </div>
        <Avatar className="h-12 w-12">
          <AvatarFallback className="bg-primary text-primary-foreground">
            {user?.user_metadata?.fullName?.charAt(0) || user?.email?.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiến độ học tập</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(totalProgress)}%</div>
            <Progress value={totalProgress} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Điểm trung bình</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(overallGrade)}</div>
            <p className="text-xs text-muted-foreground">Trên thang điểm 100</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bài tập chờ</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingAssignments}</div>
            <p className="text-xs text-muted-foreground">Cần hoàn thành</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khóa học đang học</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentProgress.length}</div>
            <p className="text-xs text-muted-foreground">Khóa học đang tham gia</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="courses">Khóa học</TabsTrigger>
          <TabsTrigger value="assignments">Bài tập</TabsTrigger>
          <TabsTrigger value="quiz">Quiz & Kiểm tra</TabsTrigger>
          <TabsTrigger value="schedule">Lịch học</TabsTrigger>
          <TabsTrigger value="resources">Tài liệu</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          <div className="grid gap-4">
            {studentProgress.map((course) => (
              <Card key={course.courseId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{course.courseTitle}</CardTitle>
                    <Badge variant="secondary">
                      {course.completedLessons}/{course.totalLessons} bài
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span>Tiến độ hoàn thành</span>
                        <span>{Math.round(course.completedLessons / course.totalLessons * 100)}%</span>
                      </div>
                      <Progress value={course.completedLessons / course.totalLessons * 100} />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Bài học hiện tại:</span>
                        <p className="font-medium">{course.currentLesson}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Lần truy cập cuối:</span>
                        <p className="font-medium">{formatDateTime(course.lastAccessed)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Điểm số:</span>
                        <p className="font-medium text-primary">{course.grade}/100</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm">
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Tiếp tục học
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        Xem chi tiết
                      </Button>
                    </div>
                    
                    {course.certificates.length > 0 && (
                      <div>
                        <span className="text-sm text-muted-foreground">Chứng chỉ đã đạt được:</span>
                        <div className="flex gap-2 mt-1">
                          {course.certificates.map((cert, index) => (
                            <Badge key={index} variant="default" className="bg-green-500">
                              <Trophy className="w-3 h-3 mr-1" />
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <div className="grid gap-4">
            {assignments.map((assignment) => (
              <Card key={assignment.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium">{assignment.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Hạn nộp: {formatDateTime(assignment.dueDate)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {assignment.status === 'pending' && (
                        <Badge variant="secondary">
                          <Clock className="w-3 h-3 mr-1" />
                          Chưa nộp
                        </Badge>
                      )}
                      {assignment.status === 'submitted' && (
                        <Badge className="bg-blue-500">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Đã nộp
                        </Badge>
                      )}
                      {assignment.status === 'graded' && (
                        <Badge className="bg-green-500">
                          <Star className="w-3 h-3 mr-1" />
                          Đã chấm: {assignment.score}/100
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {assignment.feedback && (
                    <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium">Nhận xét của giáo viên:</span>
                      <p className="text-sm text-muted-foreground mt-1">{assignment.feedback}</p>
                    </div>
                  )}
                  
                  <div className="flex gap-2 mt-4">
                    {assignment.status === 'pending' && (
                      <Button size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        Làm bài tập
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Tải đề bài
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="quiz" className="space-y-4">
          {isQuizActive && currentQuiz ? (
            <QuizEngine />
          ) : (
            <QuizList onQuizSelect={handleQuizSelect} />
          )}
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <div className="grid gap-4">
            {schedule.map((item) => (
              <Card key={item.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${getScheduleColor(item.type)} text-white`}>
                      {getScheduleIcon(item.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(item.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.time}
                        </span>
                        <span>{item.location}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Chi tiết
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Video className="w-8 h-8 text-blue-500" />
                  <div>
                    <h3 className="font-medium">Video bài giảng</h3>
                    <p className="text-sm text-muted-foreground">45 video</p>
                  </div>
                </div>
                <Button className="w-full mt-4" size="sm">
                  Xem video
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-green-500" />
                  <div>
                    <h3 className="font-medium">Tài liệu PDF</h3>
                    <p className="text-sm text-muted-foreground">28 tài liệu</p>
                  </div>
                </div>
                <Button className="w-full mt-4" size="sm">
                  Tải xuống
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-8 h-8 text-purple-500" />
                  <div>
                    <h3 className="font-medium">Từ điển</h3>
                    <p className="text-sm text-muted-foreground">Tra cứu từ vựng</p>
                  </div>
                </div>
                <Button className="w-full mt-4" size="sm">
                  Mở từ điển
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
