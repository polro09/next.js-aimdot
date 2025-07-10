// ===================================================================
// 6. app/(dashboard)/parties/page.tsx (파티 관리 페이지)
// ===================================================================

// app/(dashboard)/parties/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  GamepadIcon, 
  UsersIcon, 
  ClockIcon,
  MoreVerticalIcon,
  PlusIcon
} from 'lucide-react'

export default function PartiesPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">파티 관리</h1>
          <p className="text-muted-foreground">
            게임 파티 생성 및 관리를 위한 페이지입니다
          </p>
        </div>
        <Button>
          <PlusIcon className="w-4 h-4 mr-2" />
          새 파티 생성
        </Button>
      </div>

      <div className="text-center py-12">
        <GamepadIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">파티 관리 페이지</h3>
        <p className="text-muted-foreground">
          여기에 파티 관리 기능이 구현됩니다
        </p>
      </div>
    </div>
  )
}