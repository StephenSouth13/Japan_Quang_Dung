import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  AlertCircle,
  Volume2,
  RotateCcw,
  Flag,
  Eye,
  EyeOff
} from "lucide-react";
import { useQuiz, QuizQuestion } from "../contexts/QuizContext";
import { QuizResults } from "./QuizResults";
import { cn } from "./ui/utils";

interface QuizEngineProps {
  className?: string;
}

export function QuizEngine({ className }: QuizEngineProps) {
  const {
    currentQuiz,
    currentQuestionIndex,
    userAnswers,
    timeRemaining,
    isQuizActive,
    isQuizCompleted,
    submitAnswer,
    nextQuestion,
    previousQuestion,
    submitQuiz,
    resetQuiz
  } = useQuiz();

  const [showHints, setShowHints] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());

  if (!currentQuiz) {
    return (
      <div className="text-center p-8">
        <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Không có quiz nào được chọn</h3>
        <p className="text-muted-foreground">Vui lòng chọn một quiz từ danh sách để bắt đầu.</p>
      </div>
    );
  }

  if (isQuizCompleted) {
    return <QuizResults />;
  }

  const currentQuestion = currentQuiz.questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;
  const answeredQuestions = Object.keys(userAnswers).length;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (value: string | string[]) => {
    submitAnswer(currentQuestion.id, value);
  };

  const toggleFlag = (questionId: string) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const playAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play().catch(console.error);
  };

  const renderQuestion = () => {
    const currentAnswer = userAnswers[currentQuestion.id];

    switch (currentQuestion.type) {
      case 'multiple_choice':
        return (
          <div className="space-y-4">
            <RadioGroup
              value={Array.isArray(currentAnswer) ? currentAnswer[0] : currentAnswer || ""}
              onValueChange={(value) => handleAnswerChange(value)}
            >
              {currentQuestion.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 'fill_blank':
        return (
          <div className="space-y-4">
            <Input
              placeholder="Nhập câu trả lời của bạn..."
              value={Array.isArray(currentAnswer) ? currentAnswer[0] : currentAnswer || ""}
              onChange={(e) => handleAnswerChange(e.target.value)}
              className="text-lg"
            />
          </div>
        );

      case 'essay':
        return (
          <div className="space-y-4">
            <Textarea
              placeholder="Viết câu trả lời của bạn ở đây..."
              value={Array.isArray(currentAnswer) ? currentAnswer[0] : currentAnswer || ""}
              onChange={(e) => handleAnswerChange(e.target.value)}
              rows={6}
              className="resize-none"
            />
            <p className="text-sm text-muted-foreground">
              Câu hỏi tự luận sẽ được chấm bởi giáo viên.
            </p>
          </div>
        );

      case 'matching':
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Chọn các đáp án phù hợp (có thể chọn nhiều):
            </p>
            <div className="space-y-2">
              {currentQuestion.options?.map((option, index) => {
                const isChecked = Array.isArray(currentAnswer) && currentAnswer.includes(option);
                return (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      id={`match-${index}`}
                      checked={isChecked}
                      onCheckedChange={(checked) => {
                        let newAnswers = Array.isArray(currentAnswer) ? [...currentAnswer] : [];
                        if (checked) {
                          if (!newAnswers.includes(option)) {
                            newAnswers.push(option);
                          }
                        } else {
                          newAnswers = newAnswers.filter(ans => ans !== option);
                        }
                        handleAnswerChange(newAnswers);
                      }}
                    />
                    <Label htmlFor={`match-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'listening':
        return (
          <div className="space-y-4">
            {currentQuestion.audioUrl && (
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => playAudio(currentQuestion.audioUrl!)}
                  className="mb-4"
                >
                  <Volume2 className="w-5 h-5 mr-2" />
                  Phát âm thanh
                </Button>
                <p className="text-sm text-muted-foreground">
                  Nhấn để nghe và trả lời câu hỏi bên dưới
                </p>
              </div>
            )}
            
            <RadioGroup
              value={Array.isArray(currentAnswer) ? currentAnswer[0] : currentAnswer || ""}
              onValueChange={(value) => handleAnswerChange(value)}
            >
              {currentQuestion.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`listen-option-${index}`} />
                  <Label htmlFor={`listen-option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      default:
        return <div>Loại câu hỏi không được hỗ trợ</div>;
    }
  };

  return (
    <div className={cn("max-w-4xl mx-auto", className)}>
      {/* Quiz Header */}
      <Card className="mb-6">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{currentQuiz.title}</CardTitle>
              <p className="text-muted-foreground">
                Câu hỏi {currentQuestionIndex + 1} / {currentQuiz.questions.length}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-sm">
                Trình độ {currentQuiz.level}
              </Badge>
              <div className="flex items-center gap-2 text-lg font-mono">
                <Clock className={cn(
                  "w-5 h-5",
                  timeRemaining < 300 ? "text-red-500" : "text-muted-foreground"
                )} />
                <span className={cn(
                  timeRemaining < 300 ? "text-red-500" : "text-foreground"
                )}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>Tiến độ hoàn thành</span>
              <span>{answeredQuestions}/{currentQuiz.questions.length} câu đã trả lời</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Question Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary">
                  {currentQuestion.type.replace('_', ' ').toUpperCase()}
                </Badge>
                <Badge variant="outline">
                  {currentQuestion.points} điểm
                </Badge>
                <Badge variant={currentQuestion.difficulty === 'easy' ? 'default' : 
                              currentQuestion.difficulty === 'medium' ? 'secondary' : 'destructive'}>
                  {currentQuestion.difficulty === 'easy' ? 'Dễ' : 
                   currentQuestion.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                </Badge>
              </div>
              
              <CardTitle className="text-lg leading-relaxed">
                {currentQuestion.question}
              </CardTitle>
              
              {currentQuestion.imageUrl && (
                <div className="mt-4">
                  <img 
                    src={currentQuestion.imageUrl} 
                    alt="Question image"
                    className="max-w-full h-auto rounded-lg border"
                  />
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHints(!showHints)}
                className="h-8 w-8 p-0"
              >
                {showHints ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleFlag(currentQuestion.id)}
                className={cn(
                  "h-8 w-8 p-0",
                  flaggedQuestions.has(currentQuestion.id) && "text-yellow-500"
                )}
              >
                <Flag className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {renderQuestion()}
          
          {showHints && currentQuestion.explanation && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <h4 className="font-medium text-blue-900 mb-2">💡 Gợi ý:</h4>
              <p className="text-blue-800 text-sm">{currentQuestion.explanation}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={previousQuestion}
          disabled={currentQuestionIndex === 0}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Câu trước
        </Button>

        <div className="flex items-center gap-2">
          {/* Question Navigation Pills */}
          <div className="flex gap-1 max-w-md overflow-x-auto px-2">
            {currentQuiz.questions.map((_, index) => {
              const isAnswered = userAnswers[currentQuiz.questions[index].id];
              const isCurrent = index === currentQuestionIndex;
              const isFlagged = flaggedQuestions.has(currentQuiz.questions[index].id);
              
              return (
                <button
                  key={index}
                  onClick={() => {
                    const diff = index - currentQuestionIndex;
                    if (diff > 0) {
                      for (let i = 0; i < diff; i++) nextQuestion();
                    } else if (diff < 0) {
                      for (let i = 0; i < Math.abs(diff); i++) previousQuestion();
                    }
                  }}
                  className={cn(
                    "w-8 h-8 rounded-full text-sm font-medium transition-colors relative",
                    isCurrent 
                      ? "bg-primary text-primary-foreground" 
                      : isAnswered
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {index + 1}
                  {isFlagged && (
                    <Flag className="w-3 h-3 text-yellow-500 absolute -top-1 -right-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {currentQuestionIndex === currentQuiz.questions.length - 1 ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Hoàn thành
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xác nhận nộp bài</AlertDialogTitle>
                <AlertDialogDescription>
                  Bạn đã trả lời {answeredQuestions}/{currentQuiz.questions.length} câu hỏi.
                  {answeredQuestions < currentQuiz.questions.length && (
                    <span className="block mt-2 text-amber-600">
                      ⚠️ Bạn chưa trả lời tất cả câu hỏi. Các câu chưa trả lời sẽ được tính là 0 điểm.
                    </span>
                  )}
                  <br />
                  Bạn có chắc chắn muốn nộp bài không?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction onClick={submitQuiz}>
                  Nộp bài
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <Button
            onClick={nextQuestion}
            className="flex items-center gap-2"
          >
            Câu tiếp
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <RotateCcw className="w-4 h-4 mr-2" />
              Làm lại từ đầu
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận làm lại</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn làm lại quiz từ đầu? Tất cả câu trả lời hiện tại sẽ bị xóa.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction onClick={resetQuiz}>
                Làm lại
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
