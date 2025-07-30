import { Section } from '@/components/ui/section';
import ExerciseSearch from '@/components/ExerciseSearch';

const ExerciseLibrary = () => {
  return (
    <Section className="min-h-screen" size="large">
      <div className="max-w-6xl mx-auto">
        <ExerciseSearch />
      </div>
    </Section>
  );
};

export default ExerciseLibrary;