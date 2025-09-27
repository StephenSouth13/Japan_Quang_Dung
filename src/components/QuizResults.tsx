import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Trophy, 
  Clock, 
  Target, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  RotateCcw,
  Share2,
  Download,
  Eye,
  TrendingUp,
  Award
} from "lucide-react";
import { useQuiz, QuizQuestion } from "../contexts/QuizContext";
import { cn } from "./ui/utils";

export function QuizResults() {
  const { 
    currentQuiz, 
    currentAttempt, 
    userAnswers, 
    resetQuiz 
  } = useQuiz();
  
  const [showDetailedReview, setShowDetailedReview] = useState(false);

  if (!currentQuiz || !currentAttempt) {
    return (
      <div className="text-center p-8">
        <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Không có kết quả để hiển thị</h3>
        <p className="text-muted-foreground">Vui lòng làm một quiz để xem kết quả.</p>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 70) return "text-blue-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeVariant = (percentage: number) => {
    if (percentage >= 90) return "default";
    if (percentage >= 70) return "secondary";
    if (percentage >= 50) return "outline";
    return "destructive";
  };

  const getPerformanceMessage = (percentage: number) => {
    if (percentage >= 90) return "Xuất sắc! Bạn đã nắm vững kiến thức.";
    if (percentage >= 70) return "Tốt! Bạn đã hiểu phần lớn nội dung.";
    if (percentage >= 50) return "Khá! Bạn cần ôn luyện thêm một số phần.";
    return "Cần cố gắng! Hãy xem lại tài liệu và thử lại.";
  };

  const analyzePerformance = () => {
    const correctAnswers = currentQuiz.questions.filter(question => {
      const userAnswer = userAnswers[question.id];
      if (!userAnswer) return false;
      
      if (Array.isArray(question.correctAnswer)) {
        return Array.isArray(userAnswer) && 
               userAnswer.length === question.correctAnswer.length &&
               userAnswer.every(ans => question.correctAnswer.includes(ans));
      }
      return userAnswer === question.correctAnswer;
    });

    const incorrectAnswers = currentQuiz.questions.filter(question => {
      const userAnswer = userAnswers[question.id];
      if (!userAnswer) return true;
      
      if (Array.isArray(question.correctAnswer)) {
        return !(Array.isArray(userAnswer) && 
                userAnswer.length === question.correctAnswer.length &&
                userAnswer.every(ans => question.correctAnswer.includes(ans)));
      }
      return userAnswer !== question.correctAnswer;
    });

    const skippedAnswers = currentQuiz.questions.filter(question => 
      !userAnswers[question.id]
    );

    return {
      correct: correctAnswers.length,
      incorrect: incorrectAnswers.length,
      skipped: skippedAnswers.length,
      correctQuestions: correctAnswers,
      incorrectQuestions: incorrectAnswers,
      skippedQuestions: skippedAnswers
    };
  };

  const performance = analyzePerformance();
  
  const shareResults = () => {
    const text = `Tôi vừa hoàn thành quiz "${currentQuiz.title}" với điểm số ${currentAttempt.score}/${currentAttempt.totalPoints} (${currentAttempt.percentage}%)! 🎉`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Kết quả Quiz',
        text: text,
        url: window.location.href
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(text).then(() => {
        alert('Đã sao chép kết quả vào clipboard!');
      }).catch(console.error);
    }
  };

  const downloadCertificate = () => {
    // In a real app, this would generate a PDF certificate
    alert('Tính năng tải chứng chỉ sẽ được triển khai trong phiên bản tới!');
  };

  const renderQuestionReview = (question: QuizQuestion, index: number, isCorrect: boolean) => {
    const userAnswer = userAnswers[question.id];
    
    return (
      <Card key={question.id} className={cn(
        "border-l-4",
        isCorrect ? "border-l-green-500 bg-green-50/50" : "border-l-red-500 bg-red-50/50"
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">Câu {index + 1}</Badge>
                <Badge variant={isCorrect ? "default" : "destructive"}>
                  {isCorrect ? (
                    <><CheckCircle className="w-3 h-3 mr-1" /> Đúng</>
                  ) : (
                    <><XCircle className="w-3 h-3 mr-1" /> Sai</>
                  )}
                </Badge>
                <Badge variant="secondary">{question.points} điểm</Badge>
              </div>
              <CardTitle className="text-base">{question.question}</CardTitle>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {/* User Answer */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Câu trả lời của bạn:
            </p>
            <p className={cn(
              "text-sm p-2 rounded",
              isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            )}>
              {userAnswer ? (
                Array.isArray(userAnswer) ? userAnswer.join(', ') : userAnswer
              ) : (
                <span className="italic">Không trả lời</span>
              )}
            </p>
          </div>
          
          {/* Correct Answer */}
          {!isCorrect && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Đáp án đúng:
              </p>
              <p className="text-sm p-2 rounded bg-green-100 text-green-800">
                {Array.isArray(question.correctAnswer) 
                  ? question.correctAnswer.join(', ') 
                  : question.correctAnswer}
              </p>
            </div>
          )}
          
          {/* Explanation */}
          {question.explanation && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Giải thích:
              </p>
              <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                {question.explanation}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Main Results Card */}
      <Card className="text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto mb-4">
            {currentAttempt.passed ? (
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <Trophy className="w-10 h-10 text-green-600" />
              </div>
            ) : (
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
                <Target className="w-10 h-10 text-orange-600" />
              </div>
            )}
          </div>
          
          <CardTitle className="text-2xl mb-2">
            {currentAttempt.passed ? "Chúc mừng! Bạn đã vượt qua!" : "Hoàn thành Quiz"}
          </CardTitle>
          
          <div className="space-y-2">
            <p className="text-lg text-muted-foreground">{currentQuiz.title}</p>
            <Badge variant={getScoreBadgeVariant(currentAttempt.percentage)} className="text-lg px-4 py-1">
              {currentAttempt.score}/{currentAttempt.totalPoints} điểm ({currentAttempt.percentage}%)
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span className="font-medium">Câu đúng</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{performance.correct}</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <XCircle className="w-5 h-5 text-red-500 mr-2" />
                <span className="font-medium">Câu sai</span>
              </div>
              <p className="text-2xl font-bold text-red-600">{performance.incorrect}</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-5 h-5 text-blue-500 mr-2" />
                <span className="font-medium">Thời gian</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{formatTime(currentAttempt.timeSpent)}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Tỷ lệ chính xác</span>
                <span className={getScoreColor(currentAttempt.percentage)}>
                  {currentAttempt.percentage}%
                </span>
              </div>
              <Progress value={currentAttempt.percentage} className="h-3" />
            </div>
            
            <p className={cn("text-lg font-medium", getScoreColor(currentAttempt.percentage))}>
              {getPerformanceMessage(currentAttempt.percentage)}
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <Button onClick={resetQuiz} className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Làm lại Quiz
            </Button>
            
            <Button variant="outline" onClick={shareResults} className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Chia sẻ kết quả
            </Button>
            
            {currentAttempt.passed && (
              <Button variant="outline" onClick={downloadCertificate} className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                Tải chứng chỉ
              </Button>
            )}
            
            <Button 
              variant="ghost" 
              onClick={() => setShowDetailedReview(!showDetailedReview)}
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              {showDetailedReview ? 'Ẩn' : 'Xem'} chi tiết
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Review */}
      {showDetailedReview && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Xem lại chi tiết
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">
                  Tất cả ({currentQuiz.questions.length})
                </TabsTrigger>
                <TabsTrigger value="correct" className="text-green-600">
                  Đúng ({performance.correct})
                </TabsTrigger>
                <TabsTrigger value="incorrect" className="text-red-600">
                  Sai ({performance.incorrect})
                </TabsTrigger>
                <TabsTrigger value="skipped" className="text-orange-600">
                  Bỏ qua ({performance.skipped})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-4 mt-6">
                {currentQuiz.questions.map((question, index) => {
                  const isCorrect = performance.correctQuestions.includes(question);
                  return renderQuestionReview(question, index, isCorrect);
                })}
              </TabsContent>
              
              <TabsContent value="correct" className="space-y-4 mt-6">
                {performance.correctQuestions.length > 0 ? (
                  performance.correctQuestions.map((question, index) => 
                    renderQuestionReview(question, currentQuiz.questions.indexOf(question), true)
                  )
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Không có câu trả lời đúng
                  </p>
                )}
              </TabsContent>
              
              <TabsContent value="incorrect" className="space-y-4 mt-6">
                {performance.incorrectQuestions.length > 0 ? (
                  performance.incorrectQuestions.map((question, index) => 
                    renderQuestionReview(question, currentQuiz.questions.indexOf(question), false)
                  )
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Tuyệt vời! Không có câu trả lời sai
                  </p>
                )}
              </TabsContent>
              
              <TabsContent value="skipped" className="space-y-4 mt-6">
                {performance.skippedQuestions.length > 0 ? (
                  performance.skippedQuestions.map((question, index) => 
                    renderQuestionReview(question, currentQuiz.questions.indexOf(question), false)
                  )
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Tuyệt vời! Bạn đã trả lời tất cả câu hỏi
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Gợi ý cải thiện</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentAttempt.percentage < 70 && (
              <p className="text-amber-700 bg-amber-50 p-3 rounded-lg">
                💡 Bạn nên ôn lại các phần kiến thức liên quan và thực hành thêm trước khi làm lại quiz.
              </p>
            )}
            
            {performance.incorrect > 0 && (
              <p className="text-blue-700 bg-blue-50 p-3 rounded-lg">
                📚 Hãy xem lại những câu trả lời không chính xác để hiểu rõ hơn về các khái niệm.
              </p>
            )}
            
            {currentAttempt.passed && (
              <p className="text-green-700 bg-green-50 p-3 rounded-lg">
                🎉 Chúc mừng! Bạn có thể thử những quiz khó hơn hoặc chuyển sang cấp độ tiếp theo.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
