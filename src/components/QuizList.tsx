import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  Clock, 
  Users, 
  Trophy, 
  Play, 
  Search, 
  Filter,
  BookOpen,
  Target,
  Award,
  Eye,
  Calendar
} from "lucide-react";
import { useQuiz, Quiz } from "../contexts/QuizContext";
import { useAuth } from "../contexts/AuthContext";
import { cn } from "./ui/utils";

interface QuizListProps {
  onQuizSelect: (quiz: Quiz) => void;
  className?: string;
}

export function QuizList({ onQuizSelect, className }: QuizListProps) {
  const { getQuizzes, getQuizAttempts } = useQuiz();
  const { user } = useAuth();
  
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [userAttempts, setUserAttempts] = useState<{[quizId: string]: any[]}>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const allQuizzes = await getQuizzes();
      const publishedQuizzes = allQuizzes.filter(quiz => quiz.isPublished);
      setQuizzes(publishedQuizzes);
      
      // Load user attempts for each quiz
      if (user) {
        const attemptsData: {[quizId: string]: any[]} = {};
        for (const quiz of publishedQuizzes) {
          const attempts = await getQuizAttempts(quiz.id);
          attemptsData[quiz.id] = attempts.filter(attempt => attempt.userId === user.id);
        }
        setUserAttempts(attemptsData);
      }
    } catch (error) {
      console.error('Error loading quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort quizzes
  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = selectedLevel === "all" || quiz.level === selectedLevel;
    
    const avgDifficulty = quiz.questions.reduce((acc, q) => {
      const difficultyScore = q.difficulty === 'easy' ? 1 : q.difficulty === 'medium' ? 2 : 3;
      return acc + difficultyScore;
    }, 0) / quiz.questions.length;
    
    const difficulty = avgDifficulty <= 1.5 ? 'easy' : avgDifficulty <= 2.5 ? 'medium' : 'hard';
    const matchesDifficulty = selectedDifficulty === "all" || difficulty === selectedDifficulty;
    
    return matchesSearch && matchesLevel && matchesDifficulty;
  });

  const sortedQuizzes = [...filteredQuizzes].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "duration-short":
        return a.duration - b.duration;
      case "duration-long":
        return b.duration - a.duration;
      case "questions-few":
        return a.questions.length - b.questions.length;
      case "questions-many":
        return b.questions.length - a.questions.length;
      default:
        return 0;
    }
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedLevel("all");
    setSelectedDifficulty("all");
    setSortBy("newest");
  };

  const getQuizDifficulty = (quiz: Quiz) => {
    const avgDifficulty = quiz.questions.reduce((acc, q) => {
      const difficultyScore = q.difficulty === 'easy' ? 1 : q.difficulty === 'medium' ? 2 : 3;
      return acc + difficultyScore;
    }, 0) / quiz.questions.length;
    
    return avgDifficulty <= 1.5 ? 'easy' : avgDifficulty <= 2.5 ? 'medium' : 'hard';
  };

  const getDifficultyBadgeVariant = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'default';
      case 'medium':
        return 'secondary';
      case 'hard':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'Dễ';
      case 'medium':
        return 'Trung bình';
      case 'hard':
        return 'Khó';
      default:
        return 'Không xác định';
    }
  };

  const getUserBestScore = (quizId: string) => {
    const attempts = userAttempts[quizId] || [];
    if (attempts.length === 0) return null;
    
    return attempts.reduce((best, current) => 
      current.percentage > (best?.percentage || 0) ? current : best
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-muted-foreground">Đang tải danh sách quiz...</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Danh sách Quiz
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Tìm kiếm quiz..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Lọc:</span>
            </div>
            
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Trình độ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="N5">N5</SelectItem>
                <SelectItem value="N4">N4</SelectItem>
                <SelectItem value="N3">N3</SelectItem>
                <SelectItem value="N2">N2</SelectItem>
                <SelectItem value="N1">N1</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Độ khó" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả độ khó</SelectItem>
                <SelectItem value="easy">Dễ</SelectItem>
                <SelectItem value="medium">Trung bình</SelectItem>
                <SelectItem value="hard">Khó</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="oldest">Cũ nhất</SelectItem>
                <SelectItem value="duration-short">Thời gian ngắn</SelectItem>
                <SelectItem value="duration-long">Thời gian dài</SelectItem>
                <SelectItem value="questions-few">Ít câu hỏi</SelectItem>
                <SelectItem value="questions-many">Nhiều câu hỏi</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" onClick={clearFilters}>
              Xóa bộ lọc
            </Button>
          </div>

          {/* Results count */}
          <div className="text-sm text-muted-foreground">
            Tìm thấy {sortedQuizzes.length} quiz phù hợp
          </div>
        </CardContent>
      </Card>

      {/* Quiz Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedQuizzes.length > 0 ? sortedQuizzes.map((quiz) => {
          const difficulty = getQuizDifficulty(quiz);
          const bestScore = getUserBestScore(quiz.id);
          const userAttemptCount = userAttempts[quiz.id]?.length || 0;
          const canRetake = userAttemptCount < quiz.attempts || quiz.attempts === 0;
          
          return (
            <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline" className="text-xs">
                    {quiz.level}
                  </Badge>
                  <Badge variant={getDifficultyBadgeVariant(difficulty)} className="text-xs">
                    {getDifficultyLabel(difficulty)}
                  </Badge>
                </div>
                
                <CardTitle className="text-lg leading-tight">
                  {quiz.title}
                </CardTitle>
                
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {quiz.description}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Quiz Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{quiz.duration} phút</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-muted-foreground" />
                    <span>{quiz.questions.length} câu</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-muted-foreground" />
                    <span>{quiz.totalPoints} điểm</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{quiz.passingScore}% để đạt</span>
                  </div>
                </div>
                
                {/* User Progress */}
                {bestScore && (
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Điểm cao nhất:</span>
                      <Badge variant={bestScore.passed ? "default" : "secondary"}>
                        {bestScore.percentage}%
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {userAttemptCount}/{quiz.attempts === 0 ? '∞' : quiz.attempts} lần làm
                    </div>
                  </div>
                )}
                
                {/* Creation Date */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>Tạo ngày {formatDate(quiz.createdAt)}</span>
                </div>
                
                {/* Actions */}
                <div className="flex gap-2">
                  <Button 
                    onClick={() => onQuizSelect(quiz)}
                    disabled={!canRetake}
                    className="flex-1 flex items-center gap-2"
                    size="sm"
                  >
                    <Play className="w-4 h-4" />
                    {bestScore ? 'Làm lại' : 'Bắt đầu'}
                  </Button>
                  
                  {bestScore && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => {
                        // In a real app, this would show detailed attempt history
                        alert(`Xem lịch sử: ${userAttemptCount} lần làm, điểm cao nhất: ${bestScore.percentage}%`);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                {!canRetake && (
                  <p className="text-xs text-amber-600 text-center">
                    Bạn đã sử dụng hết số lần làm quiz này
                  </p>
                )}
              </CardContent>
            </Card>
          );
        }) : (
          <div className="col-span-full text-center py-12">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Không tìm thấy quiz</h3>
            <p className="text-muted-foreground mb-4">
              Không có quiz nào phù hợp với tiêu chí tìm kiếm của bạn
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Xóa bộ lọc và xem tất cả
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
