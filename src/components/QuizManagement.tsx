import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Users, 
  BarChart3,
  Clock,
  Target,
  Trophy,
  Copy,
  Play,
  Save,
  X
} from "lucide-react";
import { useQuiz, Quiz, QuizQuestion } from "../contexts/QuizContext";
import { toast } from "sonner";
import { cn } from "./ui/utils";

interface QuizManagementProps {
  className?: string;
}

export function QuizManagement({ className }: QuizManagementProps) {
  const { getQuizzes, createQuiz, updateQuiz, deleteQuiz, getQuizAttempts } = useQuiz();
  
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [quizStats, setQuizStats] = useState<{[quizId: string]: any}>({});

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const allQuizzes = await getQuizzes();
      setQuizzes(allQuizzes);
      
      // Load stats for each quiz
      const stats: {[quizId: string]: any} = {};
      for (const quiz of allQuizzes) {
        const attempts = await getQuizAttempts(quiz.id);
        stats[quiz.id] = {
          totalAttempts: attempts.length,
          uniqueUsers: new Set(attempts.map(a => a.userId)).size,
          averageScore: attempts.length > 0 
            ? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length)
            : 0,
          passRate: attempts.length > 0
            ? Math.round((attempts.filter(a => a.passed).length / attempts.length) * 100)
            : 0
        };
      }
      setQuizStats(stats);
      
    } catch (error) {
      console.error('Error loading quizzes:', error);
      toast.error('Có lỗi xảy ra khi tải danh sách quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = () => {
    const newQuiz: Partial<Quiz> = {
      title: "Quiz mới",
      description: "",
      level: "N5",
      duration: 30,
      totalPoints: 0,
      questions: [],
      passingScore: 70,
      attempts: 3,
      isPublished: false
    };
    setEditingQuiz(newQuiz as Quiz);
    setIsCreating(true);
  };

  const handleSaveQuiz = async (quizData: Partial<Quiz>) => {
    try {
      if (isCreating) {
        const newQuiz = await createQuiz(quizData as Omit<Quiz, 'id' | 'createdAt' | 'createdBy'>);
        setQuizzes(prev => [...prev, newQuiz]);
        toast.success('Quiz đã được tạo thành công!');
      } else if (editingQuiz) {
        const updatedQuiz = await updateQuiz(editingQuiz.id, quizData);
        setQuizzes(prev => prev.map(q => q.id === editingQuiz.id ? updatedQuiz : q));
        toast.success('Quiz đã được cập nhật thành công!');
      }
      
      setEditingQuiz(null);
      setIsCreating(false);
      loadQuizzes(); // Reload to get fresh stats
      
    } catch (error) {
      console.error('Error saving quiz:', error);
      toast.error('Có lỗi xảy ra khi lưu quiz');
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    try {
      await deleteQuiz(quizId);
      setQuizzes(prev => prev.filter(q => q.id !== quizId));
      toast.success('Quiz đã được xóa thành công!');
    } catch (error) {
      console.error('Error deleting quiz:', error);
      toast.error('Có lỗi xảy ra khi xóa quiz');
    }
  };

  const handleDuplicateQuiz = async (quiz: Quiz) => {
    const duplicatedQuiz = {
      ...quiz,
      title: `${quiz.title} (Copy)`,
      isPublished: false
    };
    delete (duplicatedQuiz as any).id;
    delete (duplicatedQuiz as any).createdAt;
    delete (duplicatedQuiz as any).createdBy;
    
    try {
      const newQuiz = await createQuiz(duplicatedQuiz);
      setQuizzes(prev => [...prev, newQuiz]);
      toast.success('Quiz đã được sao chép thành công!');
    } catch (error) {
      console.error('Error duplicating quiz:', error);
      toast.error('Có lỗi xảy ra khi sao chép quiz');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-muted-foreground">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Quản lý Quiz</h2>
          <p className="text-muted-foreground">Tạo và quản lý các bài kiểm tra trực tuyến</p>
        </div>
        <Button onClick={handleCreateQuiz} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Tạo Quiz mới
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tổng Quiz</p>
                <p className="text-2xl font-bold">{quizzes.length}</p>
              </div>
              <Target className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Đã xuất bản</p>
                <p className="text-2xl font-bold">{quizzes.filter(q => q.isPublished).length}</p>
              </div>
              <Eye className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tổng lượt làm</p>
                <p className="text-2xl font-bold">
                  {Object.values(quizStats).reduce((sum, stat) => sum + (stat.totalAttempts || 0), 0)}
                </p>
              </div>
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tỷ lệ đậu TB</p>
                <p className="text-2xl font-bold">
                  {Object.values(quizStats).length > 0
                    ? Math.round(Object.values(quizStats).reduce((sum, stat) => sum + (stat.passRate || 0), 0) / Object.values(quizStats).length)
                    : 0}%
                </p>
              </div>
              <Trophy className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quiz List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách Quiz</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quizzes.length === 0 ? (
              <div className="text-center py-12">
                <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Chưa có quiz nào</h3>
                <p className="text-muted-foreground mb-4">
                  Tạo quiz đầu tiên để bắt đầu đánh giá học viên
                </p>
                <Button onClick={handleCreateQuiz}>
                  <Plus className="w-4 h-4 mr-2" />
                  Tạo Quiz đầu tiên
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {quizzes.map((quiz) => {
                  const stats = quizStats[quiz.id] || {};
                  
                  return (
                    <Card key={quiz.id} className="border-l-4 border-l-primary/20">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{quiz.title}</h3>
                              <Badge variant="outline">{quiz.level}</Badge>
                              <Badge variant={quiz.isPublished ? "default" : "secondary"}>
                                {quiz.isPublished ? "Xuất bản" : "Nháp"}
                              </Badge>
                            </div>
                            
                            <p className="text-muted-foreground mb-3 line-clamp-2">
                              {quiz.description || "Chưa có mô tả"}
                            </p>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Thời gian:</span>
                                <p className="font-medium">{quiz.duration} phút</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Câu hỏi:</span>
                                <p className="font-medium">{quiz.questions.length}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Tổng điểm:</span>
                                <p className="font-medium">{quiz.totalPoints}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Lượt làm:</span>
                                <p className="font-medium">{stats.totalAttempts || 0}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Điểm TB:</span>
                                <p className="font-medium">{stats.averageScore || 0}%</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Tỷ lệ đậu:</span>
                                <p className="font-medium">{stats.passRate || 0}%</p>
                              </div>
                            </div>
                            
                            <div className="mt-3 text-xs text-muted-foreground">
                              Tạo lúc: {formatDate(quiz.createdAt)}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 ml-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingQuiz(quiz);
                                setIsCreating(false);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDuplicateQuiz(quiz)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                // In a real app, this would open quiz statistics
                                alert(`Thống kê chi tiết cho quiz: ${quiz.title}`);
                              }}
                            >
                              <BarChart3 className="w-4 h-4" />
                            </Button>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Bạn có chắc chắn muốn xóa quiz "{quiz.title}"? 
                                    Hành động này không thể hoàn tác và sẽ xóa tất cả dữ liệu liên quan.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteQuiz(quiz.id)}
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    Xóa
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quiz Editor Dialog */}
      {editingQuiz && (
        <QuizEditor
          quiz={editingQuiz}
          isCreating={isCreating}
          onSave={handleSaveQuiz}
          onCancel={() => {
            setEditingQuiz(null);
            setIsCreating(false);
          }}
        />
      )}
    </div>
  );
}

// Quiz Editor Component
interface QuizEditorProps {
  quiz: Quiz;
  isCreating: boolean;
  onSave: (quiz: Partial<Quiz>) => void;
  onCancel: () => void;
}

function QuizEditor({ quiz, isCreating, onSave, onCancel }: QuizEditorProps) {
  const [formData, setFormData] = useState<Partial<Quiz>>(quiz);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleQuizDataChange = (field: keyof Quiz, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleQuestionChange = (index: number, field: keyof QuizQuestion, value: any) => {
    const updatedQuestions = [...(formData.questions || [])];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    
    // Recalculate total points
    const totalPoints = updatedQuestions.reduce((sum, q) => sum + (q.points || 0), 0);
    
    setFormData(prev => ({ 
      ...prev, 
      questions: updatedQuestions,
      totalPoints 
    }));
  };

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: Date.now().toString(),
      type: 'multiple_choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: '',
      points: 10,
      difficulty: 'medium'
    };
    
    const updatedQuestions = [...(formData.questions || []), newQuestion];
    setFormData(prev => ({ 
      ...prev, 
      questions: updatedQuestions,
      totalPoints: updatedQuestions.reduce((sum, q) => sum + q.points, 0)
    }));
    setCurrentQuestionIndex(updatedQuestions.length - 1);
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = (formData.questions || []).filter((_, i) => i !== index);
    setFormData(prev => ({ 
      ...prev, 
      questions: updatedQuestions,
      totalPoints: updatedQuestions.reduce((sum, q) => sum + q.points, 0)
    }));
    if (currentQuestionIndex >= updatedQuestions.length) {
      setCurrentQuestionIndex(Math.max(0, updatedQuestions.length - 1));
    }
  };

  const handleSave = () => {
    // Validation
    if (!formData.title?.trim()) {
      toast.error('Vui lòng nhập tiêu đề quiz');
      return;
    }
    
    if (!formData.questions?.length) {
      toast.error('Quiz phải có ít nhất một câu hỏi');
      return;
    }
    
    // Validate questions
    for (let i = 0; i < formData.questions.length; i++) {
      const q = formData.questions[i];
      if (!q.question.trim()) {
        toast.error(`Câu hỏi ${i + 1} không được để trống`);
        return;
      }
      if (!q.correctAnswer) {
        toast.error(`Câu hỏi ${i + 1} phải có đáp án đúng`);
        return;
      }
    }
    
    onSave(formData);
  };

  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isCreating ? 'Tạo Quiz mới' : 'Chỉnh sửa Quiz'}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">Thông tin chung</TabsTrigger>
            <TabsTrigger value="questions">
              Câu hỏi ({formData.questions?.length || 0})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Tiêu đề Quiz *</Label>
                <Input
                  id="title"
                  value={formData.title || ''}
                  onChange={(e) => handleQuizDataChange('title', e.target.value)}
                  placeholder="Nhập tiêu đề quiz"
                />
              </div>
              
              <div>
                <Label htmlFor="level">Trình độ</Label>
                <Select 
                  value={formData.level || 'N5'} 
                  onValueChange={(value) => handleQuizDataChange('level', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="N5">N5</SelectItem>
                    <SelectItem value="N4">N4</SelectItem>
                    <SelectItem value="N3">N3</SelectItem>
                    <SelectItem value="N2">N2</SelectItem>
                    <SelectItem value="N1">N1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => handleQuizDataChange('description', e.target.value)}
                placeholder="Mô tả về nội dung và mục tiêu của quiz"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="duration">Thời gian (phút)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration || 30}
                  onChange={(e) => handleQuizDataChange('duration', parseInt(e.target.value))}
                  min="5"
                  max="180"
                />
              </div>
              
              <div>
                <Label htmlFor="passingScore">Điểm đạt (%)</Label>
                <Input
                  id="passingScore"
                  type="number"
                  value={formData.passingScore || 70}
                  onChange={(e) => handleQuizDataChange('passingScore', parseInt(e.target.value))}
                  min="1"
                  max="100"
                />
              </div>
              
              <div>
                <Label htmlFor="attempts">Số lần làm (0 = không giới hạn)</Label>
                <Input
                  id="attempts"
                  type="number"
                  value={formData.attempts || 3}
                  onChange={(e) => handleQuizDataChange('attempts', parseInt(e.target.value))}
                  min="0"
                  max="10"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={formData.isPublished || false}
                onCheckedChange={(checked) => handleQuizDataChange('isPublished', checked)}
              />
              <Label htmlFor="published">Xuất bản quiz (học viên có thể thấy và làm)</Label>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Thống kê:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Câu hỏi:</span>
                  <p className="font-medium">{formData.questions?.length || 0}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Tổng điểm:</span>
                  <p className="font-medium">{formData.totalPoints || 0}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Thời gian TB/câu:</span>
                  <p className="font-medium">
                    {formData.questions?.length 
                      ? Math.round((formData.duration || 30) * 60 / formData.questions.length) 
                      : 0}s
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Độ khó TB:</span>
                  <p className="font-medium">
                    {formData.questions?.length
                      ? (() => {
                          const avg = formData.questions.reduce((sum, q) => {
                            const score = q.difficulty === 'easy' ? 1 : q.difficulty === 'medium' ? 2 : 3;
                            return sum + score;
                          }, 0) / formData.questions.length;
                          return avg <= 1.5 ? 'Dễ' : avg <= 2.5 ? 'TB' : 'Khó';
                        })()
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="questions" className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Danh sách câu hỏi</h3>
              <Button onClick={addQuestion} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Thêm câu hỏi
              </Button>
            </div>
            
            {formData.questions?.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
                <Target className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground mb-4">Quiz chưa có câu hỏi nào</p>
                <Button onClick={addQuestion}>
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm câu hỏi đầu tiên
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Question Navigation */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {formData.questions?.map((_, index) => (
                    <Button
                      key={index}
                      variant={currentQuestionIndex === index ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentQuestionIndex(index)}
                      className="flex-shrink-0"
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>
                
                {/* Current Question Editor */}
                {formData.questions && formData.questions[currentQuestionIndex] && (
                  <QuestionEditor
                    question={formData.questions[currentQuestionIndex]}
                    index={currentQuestionIndex}
                    onChange={handleQuestionChange}
                    onRemove={() => removeQuestion(currentQuestionIndex)}
                  />
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Hủy
          </Button>
          
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            {isCreating ? 'Tạo Quiz' : 'Lưu thay đổi'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Question Editor Component
interface QuestionEditorProps {
  question: QuizQuestion;
  index: number;
  onChange: (index: number, field: keyof QuizQuestion, value: any) => void;
  onRemove: () => void;
}

function QuestionEditor({ question, index, onChange, onRemove }: QuestionEditorProps) {
  const handleOptionChange = (optionIndex: number, value: string) => {
    const newOptions = [...(question.options || [])];
    newOptions[optionIndex] = value;
    onChange(index, 'options', newOptions);
  };

  const addOption = () => {
    const newOptions = [...(question.options || []), ''];
    onChange(index, 'options', newOptions);
  };

  const removeOption = (optionIndex: number) => {
    const newOptions = (question.options || []).filter((_, i) => i !== optionIndex);
    onChange(index, 'options', newOptions);
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Câu {index + 1}</Badge>
            <Select
              value={question.type}
              onValueChange={(value) => onChange(index, 'type', value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="multiple_choice">Trắc nghiệm</SelectItem>
                <SelectItem value="fill_blank">Điền từ</SelectItem>
                <SelectItem value="essay">Tự luận</SelectItem>
                <SelectItem value="listening">Nghe</SelectItem>
                <SelectItem value="matching">Nối từ</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-red-500 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <Label>Câu hỏi *</Label>
          <Textarea
            value={question.question}
            onChange={(e) => onChange(index, 'question', e.target.value)}
            placeholder="Nhập nội dung câu hỏi"
            rows={2}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Điểm số</Label>
            <Input
              type="number"
              value={question.points}
              onChange={(e) => onChange(index, 'points', parseInt(e.target.value) || 0)}
              min="1"
              max="100"
            />
          </div>
          
          <div>
            <Label>Độ khó</Label>
            <Select
              value={question.difficulty}
              onValueChange={(value) => onChange(index, 'difficulty', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Dễ</SelectItem>
                <SelectItem value="medium">Trung bình</SelectItem>
                <SelectItem value="hard">Khó</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>URL âm thanh/hình ảnh</Label>
            <Input
              value={question.audioUrl || question.imageUrl || ''}
              onChange={(e) => {
                const url = e.target.value;
                if (url.includes('audio') || url.includes('mp3') || url.includes('wav')) {
                  onChange(index, 'audioUrl', url);
                } else {
                  onChange(index, 'imageUrl', url);
                }
              }}
              placeholder="https://..."
            />
          </div>
        </div>
        
        {/* Options for multiple choice, matching */}
        {(question.type === 'multiple_choice' || question.type === 'matching' || question.type === 'listening') && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Các phương án trả lời</Label>
              <Button size="sm" variant="outline" onClick={addOption}>
                <Plus className="w-3 h-3 mr-1" />
                Thêm
              </Button>
            </div>
            <div className="space-y-2">
              {question.options?.map((option, optionIndex) => (
                <div key={optionIndex} className="flex gap-2">
                  <Input
                    value={option}
                    onChange={(e) => handleOptionChange(optionIndex, e.target.value)}
                    placeholder={`Phương án ${optionIndex + 1}`}
                  />
                  {(question.options?.length || 0) > 2 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOption(optionIndex)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Correct Answer */}
        <div>
          <Label>Đáp án đúng *</Label>
          {question.type === 'multiple_choice' || question.type === 'listening' ? (
            <Select
              value={Array.isArray(question.correctAnswer) ? question.correctAnswer[0] : question.correctAnswer}
              onValueChange={(value) => onChange(index, 'correctAnswer', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn đáp án đúng" />
              </SelectTrigger>
              <SelectContent>
                {question.options?.map((option, optionIndex) => (
                  <SelectItem key={optionIndex} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              value={Array.isArray(question.correctAnswer) ? question.correctAnswer.join(', ') : question.correctAnswer}
              onChange={(e) => onChange(index, 'correctAnswer', e.target.value)}
              placeholder="Nhập đáp án đúng"
            />
          )}
        </div>
        
        <div>
          <Label>Giải thích (tùy chọn)</Label>
          <Textarea
            value={question.explanation || ''}
            onChange={(e) => onChange(index, 'explanation', e.target.value)}
            placeholder="Giải thích tại sao đây là đáp án đúng"
            rows={2}
          />
        </div>
      </CardContent>
    </Card>
  );
}
