import { Checkbox } from '@/shared/ui/checkbox';
import { Label } from '@/shared/ui/label';

interface TodoFiltersProps {
  showCompleted: boolean;
  onShowCompletedChange: (show: boolean) => void;
}

export function TodoFilters({ showCompleted, onShowCompletedChange }: TodoFiltersProps) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id="show-completed"
        checked={showCompleted}
        onCheckedChange={(checked) => onShowCompletedChange(checked === true)}
      />
      <Label htmlFor="show-completed" className="text-sm cursor-pointer">
        Mostrar finalizados
      </Label>
    </div>
  );
}
