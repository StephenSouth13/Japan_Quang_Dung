import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  BookOpen, 
  Users, 
  Award, 
  TrendingUp, 
  Plus, 
  Edit, 
  Eye, 
  Trash2,
  Search,
  Calendar,
  Clock,
  Target,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { QuizEngine } from './QuizEngine';

interface Quiz {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: number;
  totalQuestions: number;
  createdAt: string;
  status: 'active' | 'draft' | 'archived';
  category: string;
}

interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  userId: string;
  userName: string;
  userEmail: string;
  score: number;
  totalQuestions: number;
  timeSpent: number;
  completedAt: string;
  answers: any[];
}

interface TeacherStats {
  totalQuizzes: number;
  totalAttempts: number;
  averageScore: number;
  activeStudents: number;
}

export function TeacherDashboard() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [stats, setStats] = useState<TeacherStats>({
    totalQuizzes: 0,
    totalAttempts: 0,
    averageScore: 0,
    activeStudents: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [showQuizEngine, setShowQuizEngine] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const { user } = useAuth();

  const fetchData = async () => {
    try {
      const { projectId, publicAnonKey } = await import('../utils/supabase/info');
      
      // Fetch quizzes
      const quizzesResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-2c1a01cc/quizzes`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      if (quizzesResponse.ok) {
        const quizzesResult = await quizzesResponse.json();
        if (quizzesResult.success) {
          // Filter quizzes created by this teacher
          const teacherQuizzes = quizzesResult.data.filter((quiz: Quiz) => 
            quiz.createdAt // For now, show all quizzes. In real app, filter by creator
          );
          setQuizzes(teacherQuizzes);
        }
      }

      // Fetch quiz attempts
      const attemptsResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-2c1a01cc/quiz-attempts`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      if (attemptsResponse.ok) {
        const attemptsResult = await attemptsResponse.json();
        if (attemptsResult.success) {
          setAttempts(attemptsResult.data);
        }
      }

    } catch (error) {
      console.error('Error fetching teacher data:', error);
      toast.error('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Calculate stats
    const totalQuizzes = quizzes.length;
    const totalAttempts = attempts.length;
    const averageScore = attempts.length > 0 
      ? attempts.reduce((sum, attempt) => sum + (attempt.score / attempt.totalQuestions * 100), 0) / attempts.length
      : 0;
    const activeStudents = new Set(attempts.map(attempt => attempt.userId)).size;

    setStats({
      totalQuizzes,
      totalAttempts,
      averageScore: Math.round(averageScore),
      activeStudents
    });
  }, [quizzes, attempts]);

  const handleDeleteQuiz = async (quizId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa quiz này?')) {
      return;
    }

    try {
      const { projectId, publicAnonKey } = await import('../utils/supabase/info');
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-2c1a01cc/quiz/${quizId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      if (response.ok) {
        toast.success('Đã xóa quiz thành công');
        fetchData();
      } else {
        throw new Error('Failed to delete quiz');
      }
    } catch (error) {
      console.error('Error deleting quiz:', error);
      toast.error('Có lỗi xảy ra khi xóa quiz');
    }
  };

  const filteredQuizzes = quizzes.filter(quiz =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quiz.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quiz.level.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Đang hoạt động</Badge>;
      case 'draft':
        return <Badge variant="secondary">Bản nháp</Badge>;
      case 'archived':
        return <Badge variant="outline">Đã lưu trữ</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (showQuizEngine) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">
            {editingQuiz ? 'Chỉnh sửa Quiz' : 'Tạo Quiz mới'}
          </h1>
          <Button 
            variant="outline" 
            onClick={() => {
              setShowQuizEngine(false);
              setEditingQuiz(null);
            }}
          >
            ← Quay lại Dashboard
          </Button>
        </div>
        <QuizEngine 
          existingQuiz={editingQuiz}
          onSave={(quiz) => {
            setShowQuizEngine(false);
            setEditingQuiz(null);
            fetchData();
            toast.success(editingQuiz ? 'Đã cập nhật quiz' : 'Đã tạo quiz mới');
          }}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
          <p className="text-muted-foreground">Chào mừng, {user?.user_metadata?.name || user?.email}</p>
        </div>
        <Button 
          onClick={() => setShowQuizEngine(true)}
          className="bg-primary text-primary-foreground"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tạo Quiz mới
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="quizzes">Quiz của tôi ({quizzes.length})</TabsTrigger>
          <TabsTrigger value="results">Kết quả học viên</TabsTrigger>
          <TabsTrigger value="analytics">Thống kê</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng Quiz</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalQuizzes}</div>
                <p className="text-xs text-muted-foreground">Quiz đã tạo</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Lượt làm bài</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalAttempts}</div>
                <p className="text-xs text-muted-foreground">Tổng lượt thực hiện</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Điểm trung bình</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.averageScore}%</div>
                <p className="text-xs text-muted-foreground">Của tất cả học viên</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Học viên tích cực</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.activeStudents}</div>
                <p className="text-xs text-muted-foreground">Đã làm bài</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Hoạt động gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {attempts.slice(0, 5).map((attempt) => (
                  <div key={attempt.id} className="flex items-center justify-between border-b pb-3">
                    <div>
                      <p className="font-medium">{attempt.userName}</p>
                      <p className="text-sm text-muted-foreground">
                        Hoàn thành: {attempt.quizTitle}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant={attempt.score / attempt.totalQuestions >= 0.7 ? "default" : "secondary"}>
                        {Math.round(attempt.score / attempt.totalQuestions * 100)}%
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(attempt.completedAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                ))}
                {attempts.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Chưa có học viên nào làm bài
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quizzes" className="space-y-6 mt-6">
          {/* Search */}
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm quiz theo tên, danh mục, cấp độ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {/* Quizzes Table */}
          <Card>
            <CardHeader>
              <CardTitle>Quiz của tôi ({filteredQuizzes.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tiêu đề</TableHead>
                    <TableHead>Danh mục</TableHead>
                    <TableHead>Cấp độ</TableHead>
                    <TableHead>Câu hỏi</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Lượt làm</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuizzes.map((quiz) => {
                    const quizAttempts = attempts.filter(a => a.quizId === quiz.id);
                    return (
                      <TableRow key={quiz.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{quiz.title}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-xs">
                              {quiz.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{quiz.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getLevelColor(quiz.level)}>{quiz.level}</Badge>
                        </TableCell>
                        <TableCell>{quiz.totalQuestions}</TableCell>
                        <TableCell>{quiz.duration} phút</TableCell>
                        <TableCell>{getStatusBadge(quiz.status)}</TableCell>
                        <TableCell className="text-center">{quizAttempts.length}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingQuiz(quiz);
                                setShowQuizEngine(true);
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedQuiz(quiz)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteQuiz(quiz.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {filteredQuizzes.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm ? 'Không tìm thấy quiz nào' : 'Chưa có quiz nào được tạo'}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Kết quả làm bài của học viên</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Học viên</TableHead>
                    <TableHead>Quiz</TableHead>
                    <TableHead>Điểm số</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead>Ngày làm</TableHead>
                    <TableHead>Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attempts.map((attempt) => (
                    <TableRow key={attempt.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{attempt.userName}</div>
                          <div className="text-sm text-muted-foreground">{attempt.userEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>{attempt.quizTitle}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">
                            {attempt.score}/{attempt.totalQuestions}
                          </span>
                          <Badge variant={attempt.score / attempt.totalQuestions >= 0.7 ? "default" : "secondary"}>
                            {Math.round(attempt.score / attempt.totalQuestions * 100)}%
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{Math.floor(attempt.timeSpent / 60)}:{(attempt.timeSpent % 60).toString().padStart(2, '0')}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(attempt.completedAt).toLocaleDateString('vi-VN')}
                      </TableCell>
                      <TableCell>
                        <Badge variant={attempt.score / attempt.totalQuestions >= 0.7 ? "default" : "destructive"}>
                          {attempt.score / attempt.totalQuestions >= 0.7 ? 'Đạt' : 'Không đạt'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {attempts.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Chưa có kết quả nào
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Thống kê theo cấp độ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['beginner', 'intermediate', 'advanced'].map(level => {
                    const levelQuizzes = quizzes.filter(q => q.level === level);
                    const levelAttempts = attempts.filter(a => 
                      quizzes.find(q => q.id === a.quizId)?.level === level
                    );
                    
                    return (
                      <div key={level} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge className={getLevelColor(level)}>
                            {level === 'beginner' ? 'Cơ bản' : 
                             level === 'intermediate' ? 'Trung cấp' : 'Nâng cao'}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {levelQuizzes.length} quiz, {levelAttempts.length} lượt làm
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Điểm TB: {levelAttempts.length > 0 
                              ? Math.round(levelAttempts.reduce((sum, a) => sum + (a.score / a.totalQuestions * 100), 0) / levelAttempts.length)
                              : 0}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Hiệu suất Quiz
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {quizzes.slice(0, 5).map(quiz => {
                    const quizAttempts = attempts.filter(a => a.quizId === quiz.id);
                    const averageScore = quizAttempts.length > 0
                      ? quizAttempts.reduce((sum, a) => sum + (a.score / a.totalQuestions * 100), 0) / quizAttempts.length
                      : 0;
                    
                    return (
                      <div key={quiz.id} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium truncate max-w-xs">{quiz.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {quizAttempts.length} lượt làm
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={averageScore >= 70 ? "default" : "secondary"}>
                            {Math.round(averageScore)}%
                          </Badge>
                        </div>
                      </div>
                    );
                  })}

                  {quizzes.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      Chưa có dữ liệu thống kê
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quiz Detail Dialog */}
      {selectedQuiz && (
        <Dialog open={!!selectedQuiz} onOpenChange={() => setSelectedQuiz(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Chi tiết Quiz: {selectedQuiz.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Danh mục</label>
                  <p>{selectedQuiz.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Cấp độ</label>
                  <p>{selectedQuiz.level}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Số câu hỏi</label>
                  <p>{selectedQuiz.totalQuestions}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Thời gian</label>
                  <p>{selectedQuiz.duration} phút</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Mô tả</label>
                <p>{selectedQuiz.description}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Trạng thái</label>
                <div>{getStatusBadge(selectedQuiz.status)}</div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
