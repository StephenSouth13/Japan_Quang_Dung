import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "../components/ui/button";
import { Calendar, User } from "lucide-react";

async function getBlog(id: string) {
  try {
    const res = await fetch(`http://localhost:3000/api/blogs?id=${id}`, { cache: "no-store" });
    if (!res.ok) {
      throw new Error("Failed to fetch blog");
    }
    const data = await res.json();
    if (!data.success || !data.data) {
      return null;
    }
    return data.data;
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const blog = await getBlog(params.id);
  if (!blog) {
    return {
      title: "Bài viết không tìm thấy",
      description: "Không tìm thấy thông tin bài viết.",
    };
  }
  return {
    title: blog.title,
    description: blog.content.substring(0, 160), // Lấy đoạn đầu làm description
  };
}

export default async function BlogDetailPage({ params }: { params: { id: string } }) {
  const blog = await getBlog(params.id);

  if (!blog) {
    notFound();
  }

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-red-50/30 dark:from-background dark:to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Thông tin chính */}
          <Card className="border-0 bg-card/80 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-3xl">{blog.title}</CardTitle>
              <div className="flex items-center gap-2 mt-2 text-muted-foreground text-sm">
                <User className="w-4 h-4" />
                <span>{blog.author || "Không xác định"}</span>
                <Calendar className="w-4 h-4 ml-4" />
                <span>{new Date(blog.created_at).toLocaleDateString("vi-VN")}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative h-64 w-full rounded-lg overflow-hidden">
                <img
                  src={blog.image || "https://via.placeholder.com/800x400"}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/800x400")}
                />
              </div>
              <div className="prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: blog.content }} />
              </div>
            </CardContent>
          </Card>

          {/* Nút tương tác (tùy chọn) */}
          <Card className="border-0 bg-card/80 backdrop-blur-sm shadow-xl">
            <CardContent className="p-6 text-center">
              <Button className="bg-gradient-to-r from-primary via-pink-600 to-red-600 hover:from-primary/90 hover:to-red-600/90 text-white">
                Chia sẻ bài viết
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}