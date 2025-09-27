import { useState } from 'react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { Settings, Shield, GraduationCap } from 'lucide-react';

export function DemoSetup() {
  const [loading, setLoading] = useState(false);

  const setupDemo = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/setup-demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('Demo setup results:', result.results);
        
        // Show individual results
        const created = result.results.filter((r: any) => r.status === 'created');
        const existing = result.results.filter((r: any) => r.status === 'exists');
        const errors = result.results.filter((r: any) => r.status === 'error');
        
        if (created.length > 0) {
          toast.success(`Tạo thành công ${created.length} tài khoản demo!`);
        }
        
        if (existing.length > 0) {
          toast.info(`${existing.length} tài khoản đã tồn tại`);
        }
        
        if (errors.length > 0) {
          toast.error(`Lỗi tạo ${errors.length} tài khoản`);
        }
        
        if (created.length > 0 || existing.length > 0) {
          toast.success('Demo accounts sẵn sàng!', {
            description: 'admin@japancenter.demo / Admin123!@#'
          });
        }
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Setup demo error:', error);
      toast.error('Không thể setup demo accounts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={setupDemo}
      disabled={loading}
      variant="ghost"
      size="sm"
      className="text-xs opacity-50 hover:opacity-100"
    >
      <Settings className="h-3 w-3 mr-1" />
      {loading ? 'Setting up...' : 'Setup Demo'}
    </Button>
  );
}
