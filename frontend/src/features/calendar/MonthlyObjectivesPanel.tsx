import { BookOpen, Clock, Hand } from 'lucide-react';

function MonthlyObjectivesPanel() {
  return (
    <section className="monthly-objectives-panel">
      <h2>Monthly objectives</h2>

      <div className="objective-card">
        <div className="objective-card-header">
          <Clock size={16} strokeWidth={2.4} />
          <span>MTT hours</span>
        </div>

        <strong>0 / 80</strong>
      </div>

      <div className="objective-card">
        <div className="objective-card-header">
          <Hand size={16} strokeWidth={2.4} />
          <span>Hands played</span>
        </div>

        <strong>0 / 20k</strong>
      </div>

      <div className="objective-card">
        <div className="objective-card-header">
          <BookOpen size={16} strokeWidth={2.4} />
          <span>Learning hours</span>
        </div>

        <strong>0 / 15</strong>
      </div>
    </section>
  );
}

export default MonthlyObjectivesPanel;